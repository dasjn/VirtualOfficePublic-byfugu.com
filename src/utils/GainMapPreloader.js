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
    if (!this.isInitialized) {
      console.warn(
        "[GainMapPreloader] No inicializado. Los GainMaps se cargarán cuando se inicialice."
      );
      return;
    }

    if (this.isLoadingFlag) {
      console.warn("[GainMapPreloader] Ya hay una carga en progreso");
      return;
    }

    this.isLoadingFlag = true;
    this.error = null;
    console.log(
      `[GainMapPreloader] Iniciando carga de ${this.loadingQueue.length} GainMaps`
    );

    // Crear promesas para cada GainMap
    const promises = this.loadingQueue.map(async ({ id, urls }) => {
      try {
        const result = await this.gainMapLoader.loadAsync(urls);

        // Guardar la textura resultante en el mapa
        const texture = result.renderTarget.texture;
        this.textureMap.set(id, texture);

        // Incrementar contador y notificar progreso
        this.loadedMaps++;
        this.notifyProgress();
        console.log(`[GainMapPreloader] GainMap cargado: ${id}`);
        return { id, result };
      } catch (error) {
        console.error(
          `[GainMapPreloader] Error cargando GainMap ${id}:`,
          error
        );
        // Incrementar contador para no bloquear progreso
        this.loadedMaps++;
        this.notifyProgress();
        throw error;
      }
    });

    try {
      // Esperar a que se completen todas las cargas
      const results = await Promise.allSettled(promises);
      this.loadingQueue = [];
      this.isLoadingFlag = false;

      // Verificar si hubo errores
      const hasErrors = results.some((result) => result.status === "rejected");
      if (hasErrors) {
        this.error = new Error("Algunos GainMaps no se pudieron cargar");
      }

      console.log("[GainMapPreloader] Carga de GainMaps completada");
      return results;
    } catch (error) {
      this.error = error;
      this.isLoadingFlag = false;
      console.error("[GainMapPreloader] Error en la carga:", error);
      throw error;
    }
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
    this.loadingQueue = [];
    this.loadedMaps = 0;
    this.totalMaps = 0;
    this.error = null;
    this.notifyProgress();
  }
}

// Singleton
export default new GainMapPreloader();
