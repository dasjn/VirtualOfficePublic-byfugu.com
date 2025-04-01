// hooks/useGainMapPreload.js
import { useState, useEffect, useRef } from "react";
import { GainMapLoader } from "@monogrid/gainmap-js";
import * as THREE from "three";

// Singleton para gestionar las texturas GainMap
class GainMapPreloader {
  constructor() {
    this.textureMap = new Map();
    this.loadingQueue = new Map();
    this.totalItems = 0;
    this.loadedItems = 0;
    this.isInitialized = false;
    this.listeners = new Set();
    this.renderer = null;
    this.loader = null;
  }

  initialize(renderer) {
    if (!this.isInitialized && renderer) {
      this.renderer = renderer;
      this.loader = new GainMapLoader();
      this.loader.setRenderer(renderer);
      this.isInitialized = true;
      console.log("GainMapPreloader inicializado con éxito");

      // Si hay elementos en cola, iniciar la carga automáticamente
      if (this.loadingQueue.size > 0) {
        console.log("Iniciando carga automática de texturas en cola");
        this.loadAll();
      }
    }

    return this.isInitialized;
  }

  addItem(id, urls) {
    // Si ya está cargado o en cola, no hacer nada
    if (this.textureMap.has(id) || this.loadingQueue.has(id)) {
      return;
    }

    // Añadir a la cola de carga
    this.loadingQueue.set(id, urls);
    this.totalItems++;
    this.notifyListeners();
    console.log(`Textura ${id} añadida a la cola de carga`);
  }

  async loadAll() {
    if (!this.isInitialized || !this.renderer || !this.loader) {
      console.warn(
        "GainMapPreloader no inicializado. Texturas añadidas a la cola para carga posterior."
      );
      return Promise.resolve(); // Resolver sin error, se cargará después
    }

    const promises = [];

    // Procesar cola de carga
    for (const [id, urls] of this.loadingQueue.entries()) {
      console.log(`Iniciando carga de textura ${id}`);

      const promise = this.loader
        .loadAsync(urls)
        .then((result) => {
          // Guardar textura en el mapa
          this.textureMap.set(id, result.renderTarget.texture);

          // Actualizar contadores
          this.loadedItems++;
          this.notifyListeners();

          console.log(`Textura ${id} cargada correctamente`);
        })
        .catch((error) => {
          console.error(`Error cargando textura ${id}:`, error);

          // Crear una textura "fallback" para evitar errores
          const emptyTexture = new THREE.Texture();
          emptyTexture.needsUpdate = true;
          this.textureMap.set(id, emptyTexture);

          // Actualizar contadores aunque haya error
          this.loadedItems++;
          this.notifyListeners();
        });

      promises.push(promise);
    }

    // Limpiar cola de carga
    this.loadingQueue.clear();

    // Esperar a que todas las texturas se carguen
    return Promise.all(promises);
  }

  getTexture(id) {
    return this.textureMap.get(id) || null;
  }

  getProgress() {
    if (this.totalItems === 0) return 100;
    return (this.loadedItems / this.totalItems) * 100;
  }

  addListener(callback) {
    this.listeners.add(callback);
    // Notificar estado actual inmediatamente
    callback(this.getProgress());
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners() {
    const progress = this.getProgress();
    this.listeners.forEach((callback) => callback(progress));
  }

  isReady() {
    return this.totalItems > 0 && this.loadedItems === this.totalItems;
  }

  reset() {
    this.loadingQueue.clear();
    this.totalItems = this.textureMap.size;
    this.loadedItems = this.textureMap.size;
    this.notifyListeners();
  }
}

// Crear la instancia singleton
const preloader = new GainMapPreloader();

/**
 * Hook para inicializar el preloader
 */
export function useInitGainMapPreloader(renderer) {
  useEffect(() => {
    if (renderer) {
      const initialized = preloader.initialize(renderer);
      console.log(
        "Inicializando GainMapPreloader:",
        initialized ? "Éxito" : "Ya inicializado"
      );
    }
  }, [renderer]);

  return preloader.isInitialized;
}

/**
 * Hook para obtener el progreso de carga
 */
export function useGainMapProgress() {
  const [progress, setProgress] = useState(preloader.getProgress());

  useEffect(() => {
    preloader.addListener(setProgress);
    return () => preloader.removeListener(setProgress);
  }, []);

  return progress;
}

/**
 * Función para añadir texturas a la precarga
 */
export function addGainMapsToPreload(items) {
  items.forEach(({ id, urls }) => {
    preloader.addItem(id, urls);
  });
}

/**
 * Función para iniciar la carga de todas las texturas
 */
export function loadAllGainMaps() {
  return preloader.loadAll();
}

/**
 * Función para comprobar si todas las texturas están cargadas
 */
export function areGainMapsReady() {
  return preloader.isReady();
}

/**
 * Función para obtener el estado de inicialización
 */
export function isGainMapPreloaderInitialized() {
  return preloader.isInitialized;
}

/**
 * Hook para obtener una textura específica
 */
export function useGainMapTexture(id) {
  const [texture, setTexture] = useState(preloader.getTexture(id));

  useEffect(() => {
    // Si la textura ya está cargada, usarla
    const existingTexture = preloader.getTexture(id);
    if (existingTexture) {
      setTexture(existingTexture);
      return;
    }

    // Si no, suscribirse a cambios
    const checkTexture = () => {
      const newTexture = preloader.getTexture(id);
      if (newTexture) {
        setTexture(newTexture);
      }
    };

    const listener = () => {
      checkTexture();
    };

    preloader.addListener(listener);

    return () => {
      preloader.removeListener(listener);
    };
  }, [id]);

  return texture;
}
