// src/utils/KTX2TextureManager.js
import { KTX2Loader } from "three-stdlib";
import * as THREE from "three";
import { getAssetPath } from "@/data/assets";

// Ruta al transcodificador KTX2
const BASIS_PATH = "/basis/";

/**
 * Clase Singleton para gestionar las texturas KTX2
 */
class KTX2TextureManager {
  constructor() {
    // Comprobamos si ya existe una instancia
    if (KTX2TextureManager.instance) {
      return KTX2TextureManager.instance;
    }

    // Inicializamos la instancia
    KTX2TextureManager.instance = this;

    // Mapa de texturas cargadas
    this.textureCache = new Map();

    // Estado del loader
    this.loader = null;
    this.renderer = null;
    this.isInitialized = false;

    // Callbacks pendientes mientras se inicializa
    this.pendingLoads = new Map();

    return this;
  }

  /**
   * Inicializa el manager con un renderer
   * @param {THREE.WebGLRenderer} renderer - Renderer de Three.js
   * @returns {KTX2TextureManager} La instancia del manager
   */
  initialize(renderer) {
    if (this.isInitialized && this.renderer === renderer) {
      return this;
    }

    this.renderer = renderer;

    // Inicializamos el loader
    this.loader = new KTX2Loader();
    this.loader.detectSupport(renderer);
    this.loader.setTranscoderPath(BASIS_PATH);

    this.isInitialized = true;

    // Procesamos las cargas pendientes
    this.processPendingLoads();

    return this;
  }

  /**
   * Procesa las cargas pendientes una vez inicializado el loader
   * @private
   */
  processPendingLoads() {
    if (!this.isInitialized) return;

    // Procesamos todas las cargas pendientes
    this.pendingLoads.forEach((callbacks, path) => {
      this.loadTexture(
        path,
        callbacks.onLoad,
        callbacks.onProgress,
        callbacks.onError
      );
    });

    // Limpiamos las cargas pendientes
    this.pendingLoads.clear();
  }

  /**
   * Carga una textura KTX2
   * @param {string} path - Ruta de la textura
   * @param {Function} onLoad - Callback cuando se carga
   * @param {Function} onProgress - Callback de progreso
   * @param {Function} onError - Callback de error
   */
  loadTexture(path, onLoad, onProgress, onError) {
    // Si no estamos inicializados, añadimos a pendientes
    if (!this.isInitialized) {
      this.pendingLoads.set(path, { onLoad, onProgress, onError });
      return;
    }

    // Si ya está en caché, la devolvemos inmediatamente
    if (this.textureCache.has(path)) {
      if (onLoad) {
        onLoad(this.textureCache.get(path));
      }
      return;
    }

    // Cargamos la textura
    this.loader.load(
      path,
      (texture) => {
        // Configuramos la textura
        texture.encoding = THREE.sRGBEncoding;
        texture.flipY = false;

        // Inicializamos la textura en la GPU
        this.renderer.initTexture(texture);

        // Guardamos en caché
        this.textureCache.set(path, texture);

        // Llamamos al callback
        if (onLoad) {
          onLoad(texture);
        }
      },
      onProgress,
      (error) => {
        console.error(`Error cargando textura KTX2 ${path}:`, error);
        if (onError) {
          onError(error);
        }
      }
    );
  }

  /**
   * Obtiene una textura por clave de asset, considerando el nivel de calidad actual
   * @param {string} assetKey - Clave del asset
   * @param {Function} onLoad - Callback cuando se carga
   * @param {Function} onProgress - Callback de progreso
   * @param {Function} onError - Callback de error
   */
  getTextureByAssetKey(assetKey, onLoad, onProgress, onError) {
    const path = getAssetPath(assetKey);
    this.loadTexture(path, onLoad, onProgress, onError);
  }

  /**
   * Precargar una textura por clave de asset
   * @param {string} assetKey - Clave del asset
   */
  preloadTextureByAssetKey(assetKey) {
    const path = getAssetPath(assetKey);
    this.loadTexture(
      path,
      () => console.log(`Textura KTX2 precargada: ${assetKey} (${path})`),
      undefined,
      (error) =>
        console.warn(`Error precargando textura KTX2 ${assetKey}:`, error)
    );
  }

  /**
   * Precargar múltiples texturas por claves de asset
   * @param {string[]} assetKeys - Array de claves de assets
   */
  preloadTexturesByAssetKeys(assetKeys) {
    assetKeys.forEach((key) => this.preloadTextureByAssetKey(key));
  }

  /**
   * Obtiene una textura ya cargada por clave de asset
   * @param {string} assetKey - Clave del asset
   * @returns {THREE.Texture|null} La textura o null si no está cargada
   */
  getCachedTextureByAssetKey(assetKey) {
    const path = getAssetPath(assetKey);
    return this.textureCache.has(path) ? this.textureCache.get(path) : null;
  }

  /**
   * Limpia la caché de texturas
   * @param {string|string[]|null} assetKeys - Clave(s) de asset a limpiar, null para limpiar todo
   */
  clearCache(assetKeys = null) {
    if (assetKeys === null) {
      // Limpiar toda la caché
      this.textureCache.forEach((texture) => texture.dispose());
      this.textureCache.clear();
    } else {
      // Limpiar sólo texturas específicas
      const keysArray = Array.isArray(assetKeys) ? assetKeys : [assetKeys];
      keysArray.forEach((key) => {
        const path = getAssetPath(key);
        if (this.textureCache.has(path)) {
          this.textureCache.get(path).dispose();
          this.textureCache.delete(path);
        }
      });
    }
  }
}

// Exportamos la instancia singleton
export const ktx2TextureManager = new KTX2TextureManager();

// Exportamos la clase para casos especiales
export default KTX2TextureManager;
