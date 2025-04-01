// src/utils/PreloadManager.js

/**
 * Gestor simple para evitar precargas duplicadas de modelos y texturas
 */
class PreloadManager {
  constructor() {
    // Conjuntos para almacenar las rutas ya precargadas
    this.preloadedModels = new Set();
    this.preloadedGainMaps = new Set();
    this.preloadedTextures = new Set();
  }

  /**
   * Registra un modelo para evitar precargas duplicadas
   * @param {string} path - Ruta del modelo
   * @returns {boolean} - true si es la primera vez que se registra
   */
  registerModel(path) {
    if (!this.preloadedModels.has(path)) {
      this.preloadedModels.add(path);
      return true;
    }
    return false;
  }

  /**
   * Registra un GainMap para evitar precargas duplicadas
   * @param {string} id - Identificador del GainMap
   * @returns {boolean} - true si es la primera vez que se registra
   */
  registerGainMap(id) {
    if (!this.preloadedGainMaps.has(id)) {
      this.preloadedGainMaps.add(id);
      return true;
    }
    return false;
  }

  /**
   * Registra una textura para evitar precargas duplicadas
   * @param {string} path - Ruta de la textura
   * @returns {boolean} - true si es la primera vez que se registra
   */
  registerTexture(path) {
    if (!this.preloadedTextures.has(path)) {
      this.preloadedTextures.add(path);
      return true;
    }
    return false;
  }

  /**
   * Comprueba si un modelo ya está registrado
   */
  isModelRegistered(path) {
    return this.preloadedModels.has(path);
  }

  /**
   * Comprueba si un GainMap ya está registrado
   */
  isGainMapRegistered(id) {
    return this.preloadedGainMaps.has(id);
  }

  /**
   * Comprueba si una textura ya está registrada
   */
  isTextureRegistered(path) {
    return this.preloadedTextures.has(path);
  }
}

// Exportar singleton
export default new PreloadManager();
