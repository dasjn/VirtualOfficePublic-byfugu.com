// src/utils/preloadAssets.js
import { assets, AssetTypes, getAssetPath } from "@/data/assets";
import { useGLTF, useTexture } from "@react-three/drei";
import { ktx2TextureManager } from "./KTX2TextureManager";
import { useExperienceStore } from "@/store/experienceStore";

/**
 * Precarga todos los assets de la aplicación
 * @param {THREE.WebGLRenderer} gl - Renderer WebGL
 * @returns {Promise} Promesa que se resuelve cuando terminan las precargas
 */
export const preloadAssets = async (gl) => {
  if (!gl) {
    console.warn("No se pudo realizar la precarga: renderer no disponible");
    return Promise.resolve();
  }

  // Inicializar el nivel de calidad usando el store
  const store = useExperienceStore.getState();
  const qualityLevel = store.initializeQualityLevel();
  console.log(`[PreloadAssets] Usando nivel de calidad: ${qualityLevel}`);

  // Inicializar el manager de texturas KTX2
  ktx2TextureManager.initialize(gl);

  // Dividir assets por tipo para procesarlos adecuadamente
  const gltfAssets = assets.filter((asset) => asset.type === AssetTypes.GLTF);
  const textureAssets = assets.filter(
    (asset) => asset.type === AssetTypes.TEXTURE
  );
  const ktx2Assets = assets.filter((asset) => asset.type === AssetTypes.KTX2);

  // Crear promesas para cada tipo de asset
  const preloadPromises = [
    // Precargar modelos GLTF
    ...gltfAssets.map(
      ({ key }) =>
        new Promise((resolve) => {
          try {
            const path = getAssetPath(key);
            useGLTF.preload(path);
            console.log(`✓ GLTF precargado: ${key} (${path})`);
            resolve();
          } catch (error) {
            console.warn(`Error precargando GLTF: ${key}`, error);
            resolve(); // Resolver de todos modos para no bloquear
          }
        })
    ),

    // Precargar texturas normales
    ...textureAssets.map(
      ({ key }) =>
        new Promise((resolve) => {
          try {
            const path = getAssetPath(key);
            useTexture.preload(path);
            console.log(`✓ Textura precargada: ${key} (${path})`);
            resolve();
          } catch (error) {
            console.warn(`Error precargando textura: ${key}`, error);
            resolve();
          }
        })
    ),

    // Precargar texturas KTX2 usando el singleton manager
    ...ktx2Assets.map(
      ({ key }) =>
        new Promise((resolve) => {
          try {
            ktx2TextureManager.preloadTextureByAssetKey(key);
            const path = getAssetPath(key);
            console.log(`✓ KTX2 precargado: ${key} (${path})`);
            resolve();
          } catch (error) {
            console.warn(`Error precargando textura KTX2: ${key}`, error);
            resolve();
          }
        })
    ),
  ];

  return Promise.all(preloadPromises);
};

/**
 * Limpia la caché de assets
 */
export const clearAssetCache = () => {
  // Limpiar caché de GLTF
  assets
    .filter((asset) => asset.type === AssetTypes.GLTF)
    .forEach(({ key }) => {
      const path = getAssetPath(key);
      useGLTF.clear(path);
    });

  // Limpiar caché de texturas
  assets
    .filter((asset) => asset.type === AssetTypes.TEXTURE)
    .forEach(({ key }) => {
      const path = getAssetPath(key);
      useTexture.clear(path);
    });

  // Limpiar caché de KTX2
  ktx2TextureManager.clearCache();
};
