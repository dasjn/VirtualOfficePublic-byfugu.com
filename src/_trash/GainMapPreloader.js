// src/utils/GainMapPreloader.js (actualización)

import { GainMapLoader } from "@monogrid/gainmap-js";
import preloadManager from "./PreloadManager";

/**
 * Gestor para precargar GainMaps de forma centralizada
 */
class GainMapPreloader {
  constructor() {
    this.gainMapLoader = null;
    this.isInitialized = false;
    this.totalMaps = 0;
    this.loadedMaps = 0;
    this.listeners = new Set();
    this.loadingQueue = [];
    this.isLoadingFlag = false;
    this.error = null;
    this.textureMap = new Map(); // Almacena las texturas por id
    this.hasLoadedAll = false;
  }

  /**
   * Inicializa el GainMapPreloader con un renderer
   * @param {WebGLRenderer} renderer - Renderer de three.js
   * @returns {boolean} - true si se inicializó correctamente
   */
  initialize(renderer) {
    if (this.isInitialized) return true;

    if (renderer) {
      this.gainMapLoader = new GainMapLoader();
      this.gainMapLoader.setRenderer(renderer);
      this.isInitialized = true;
      console.log("[GainMapPreloader] Inicializado con éxito");

      // Si hay items en cola, comenzar carga
      if (this.loadingQueue.length > 0) {
        this.loadAll();
      }

      return true;
    }

    console.warn(
      "[GainMapPreloader] No se pudo inicializar: renderer no proporcionado"
    );
    return false;
  }

  /**
   * Registra un GainMap para precargar
   * @param {string} id - Identificador único
   * @param {Array} urls - Array con las URLs del GainMap
   */
  register(id, urls) {
    // Verificar si ya está registrado
    if (preloadManager.isGainMapRegistered(id)) {
      return false;
    }

    // Registrar en el preloadManager
    preloadManager.registerGainMap(id);

    // Añadir a la cola de carga
    this.loadingQueue.push({ id, urls });
    this.totalMaps++;

    console.log(`[GainMapPreloader] GainMap registrado: ${id}`);

    // Notificar a los listeners
    this.notifyProgress();

    return true;
  }

  /**
   * Carga todos los GainMaps registrados
   * @returns {Promise} - Promesa que se resuelve cuando todos los GainMaps están cargados
   */
  async loadAll() {
    // Check if already initialized
    if (!this.isInitialized) {
      console.warn(
        "[GainMapPreloader] Not initialized. GainMaps will load when initialized."
      );
      return;
    }

    // Check if already loaded
    if (this.hasLoadedAll) {
      console.log("[GainMapPreloader] GainMaps already loaded");
      return;
    }

    // Check if loading is in progress
    if (this.isLoadingFlag) {
      console.warn("[GainMapPreloader] Loading already in progress");
      return;
    }

    this.isLoadingFlag = true;
    this.error = null;
    console.log(
      `[GainMapPreloader] Starting load of ${this.loadingQueue.length} GainMaps`
    );

    // Use Promise.all with a limit to control concurrent loads
    const CONCURRENT_LIMIT = 1; // Adjust based on your needs
    for (let i = 0; i < this.loadingQueue.length; i += CONCURRENT_LIMIT) {
      const batch = this.loadingQueue.slice(i, i + CONCURRENT_LIMIT);

      const batchPromises = batch.map(async ({ id, urls }) => {
        try {
          // Add a timeout to prevent indefinite loading
          const result = await Promise.race([
            this.gainMapLoader.loadAsync(urls),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error(`Timeout loading ${id}`)), 5000)
            ),
          ]);

          const texture = result.renderTarget.texture;
          this.textureMap.set(id, texture);

          this.loadedMaps++;
          this.notifyProgress();
          console.log(`[GainMapPreloader] GainMap loaded: ${id}`);
          return { id, result };
        } catch (error) {
          console.error(
            `[GainMapPreloader] Error loading GainMap ${id}:`,
            error
          );
          this.loadedMaps++;
          this.notifyProgress();
          return { id, error };
        }
      });

      // Wait for this batch to complete before starting the next
      await Promise.allSettled(batchPromises);
    }

    // Mark as completely loaded
    this.hasLoadedAll = true;
    this.loadingQueue = [];
    this.isLoadingFlag = false;

    console.log("[GainMapPreloader] GainMaps loading completed");
  }

  /**
   * Obtiene una textura GainMap por su ID
   * @param {string} id - ID del GainMap
   * @returns {THREE.Texture|null} - Textura o null si no está disponible
   */
  getTexture(id) {
    return this.textureMap.get(id) || null;
  }

  /**
   * Comprueba si una textura GainMap está disponible
   * @param {string} id - ID del GainMap
   * @returns {boolean} - true si la textura está disponible
   */
  hasTexture(id) {
    return this.textureMap.has(id);
  }

  /**
   * Verifica si hay una carga en progreso
   * @returns {boolean} - true si hay una carga en progreso
   */
  isLoading() {
    return this.isLoadingFlag;
  }

  /**
   * Obtiene el progreso actual de carga (0-100)
   * @returns {number} - Porcentaje de progreso
   */
  getProgress() {
    if (this.totalMaps === 0) return 100;
    return (this.loadedMaps / this.totalMaps) * 100;
  }

  /**
   * Verifica si todos los GainMaps están cargados
   * @returns {boolean} - true si todos los GainMaps están cargados
   */
  isReady() {
    return this.totalMaps > 0 && this.loadedMaps === this.totalMaps;
  }

  /**
   * Verifica si hubo algún error durante la carga
   * @returns {Error|null} - Error si ocurrió alguno, null en caso contrario
   */
  getError() {
    return this.error;
  }

  /**
   * Añade un listener para seguir el progreso de carga
   * @param {Function} callback - Función a llamar con el progreso (0-100)
   * @returns {Function} - Función para eliminar el listener
   */
  addProgressListener(callback) {
    this.listeners.add(callback);
    // Notificar progreso actual inmediatamente
    callback(this.getProgress());
    return () => this.listeners.delete(callback);
  }

  /**
   * Notifica a todos los listeners el progreso actual
   */
  notifyProgress() {
    const progress = this.getProgress();
    this.listeners.forEach((callback) => callback(progress));
  }

  /**
   * Restablece el estado del preloader
   */
  reset() {
    this.hasLoadedAll = false;
    this.loadedMaps = 0;
    this.totalMaps = 0;
    this.error = null;
    this.loadingQueue = [];
    this.textureMap.clear();
    this.notifyProgress();
  }
}

// Singleton
export default new GainMapPreloader();
