// hooks/useKTX2Asset.js
import { useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { ktx2TextureManager } from "../utils/KTX2TextureManager";

/**
 * Hook para usar texturas KTX2 con el manager singleton
 * @param {string} assetKey - Clave del asset a cargar
 * @param {boolean} [preload=false] - Si solo debe precargar sin devolver la textura
 * @returns {THREE.Texture|null} La textura o null si aún no está cargada
 */
export function useKTX2Asset(assetKey, preload = false) {
  const { gl } = useThree();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    // Inicializar el manager con el renderer
    ktx2TextureManager.initialize(gl);

    // Si es solo precarga, no actualizamos el estado
    if (preload) {
      ktx2TextureManager.preloadTextureByAssetKey(assetKey);
      return;
    }

    // Intentar obtener de caché primero
    const cachedTexture =
      ktx2TextureManager.getCachedTextureByAssetKey(assetKey);
    if (cachedTexture) {
      setTexture(cachedTexture);
      return;
    }

    // Cargar la textura
    ktx2TextureManager.getTextureByAssetKey(assetKey, (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, [gl, assetKey, preload]);

  return texture;
}

/**
 * Hook para precargar múltiples texturas KTX2
 * @param {string[]} assetKeys - Array de claves de assets a precargar
 */
export function usePreloadKTX2Assets(assetKeys) {
  const { gl } = useThree();

  useEffect(() => {
    // Inicializar el manager con el renderer
    ktx2TextureManager.initialize(gl);

    // Precargar todas las texturas
    ktx2TextureManager.preloadTexturesByAssetKeys(assetKeys);
  }, [gl, assetKeys]);
}

/**
 * Función para limpiar la caché de texturas KTX2
 * @param {string|string[]|null} assetKeys - Clave(s) de asset a limpiar, null para limpiar todo
 */
export function clearKTX2Cache(assetKeys = null) {
  ktx2TextureManager.clearCache(assetKeys);
}
