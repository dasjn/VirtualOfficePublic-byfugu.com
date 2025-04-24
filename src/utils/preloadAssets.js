// utils/preloadAssets.js
import { assets, AssetTypes } from "@/data/assets";
import { useGLTF, useTexture } from "@react-three/drei";
import { ktx2TextureManager } from "./KTX2TextureManager";

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
      ({ path }) =>
        new Promise((resolve) => {
          try {
            useGLTF.preload(path);
            resolve();
          } catch (error) {
            console.warn(`Error precargando GLTF: ${path}`, error);
            resolve(); // Resolver de todos modos para no bloquear
          }
        })
    ),

    // Precargar texturas normales
    ...textureAssets.map(
      ({ path }) =>
        new Promise((resolve) => {
          try {
            useTexture.preload(path);
            resolve();
          } catch (error) {
            console.warn(`Error precargando textura: ${path}`, error);
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
    .forEach(({ path }) => useGLTF.clear(path));

  // Limpiar caché de texturas
  assets
    .filter((asset) => asset.type === AssetTypes.TEXTURE)
    .forEach(({ path }) => useTexture.clear(path));

  // Limpiar caché de KTX2
  ktx2TextureManager.clearCache();
};
