// src/hooks/usePreloadHooks.js
import { useEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import preloadManager from "./PreloadManager";
import { TextureLoader } from "three";

/**
 * Hook para precargar un modelo solo si no ha sido precargado antes
 * @param {string} path - Ruta del modelo
 */
export function usePreloadModel(path) {
  useEffect(() => {
    if (preloadManager.registerModel(path)) {
      useGLTF.preload(path);
      console.log(`🔄 Modelo precargado: ${path}`);
    }
  }, [path]);
}

/**
 * Hook para precargar una textura solo si no ha sido precargada antes
 * @param {string} path - Ruta de la textura
 */
export function usePreloadTexture(path) {
  useEffect(() => {
    if (preloadManager.registerTexture(path)) {
      // No hay un método preload en useTexture, así que cargamos la textura explícitamente
      const textureLoader = new TextureLoader();
      textureLoader.load(path);
      console.log(`🔄 Textura precargada: ${path}`);
    }
  }, [path]);
}

/**
 * Hook para registrar y precargar un GainMap
 * @param {string} id - Identificador del GainMap
 * @param {Array} urls - Array con las URLs del GainMap
 * @param {Function} preloadFunction - Función para precargar el GainMap
 */
export function usePreloadGainMap(id, urls, preloadFunction) {
  useEffect(() => {
    if (
      preloadManager.registerGainMap(id) &&
      typeof preloadFunction === "function"
    ) {
      preloadFunction(urls);
      console.log(`🔄 GainMap precargado: ${id}`);
    }
  }, [id, urls, preloadFunction]);
}
