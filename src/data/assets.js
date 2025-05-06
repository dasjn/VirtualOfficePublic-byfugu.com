// src/data/assets.js
import { useExperienceStore } from "@/store/experienceStore";
import PropTypes from "prop-types";

const isDevelopment = import.meta.env ? import.meta.env.DEV : false;

// Tipos de assets definidos como constantes para mejor mantenibilidad
export const AssetTypes = {
  GLTF: "gltf",
  TEXTURE: "texture",
  KTX2: "ktx2",
};

// Niveles de calidad para texturas y KTX2
export const QualityLevels = {
  HIGH: "high",
  LOW: "low",
};

/**
 * Lista de assets disponibles.
 * @type {Array<{key: string, path: string, type: string, lowQualityPath?: string}>}
 */
export const assets = [
  // Archivos en la raíz
  {
    key: "ESPINA",
    path: "/FUGU_Jardin_Espina_v01.glb",
    type: AssetTypes.GLTF,
  },

  // /big_assets_baked/
  {
    key: "BIG_ASSETS_GRP",
    path: "/big_assets_baked/TheOFFice_BigAssets_GRP_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "PLANO_IMG_CUADRO",
    path: "/big_assets_baked/TheOFFice_PlanoImgCuadro_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "CUADRO_02",
    path: "/big_assets_baked/TheOFFice_Cuadro02_v02.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "BIG_ASSETS_GRP_KTX2",
    path: "/big_assets_baked/Bake_Assets_Big_v03.ktx2",
    lowQualityPath: "/big_assets_baked/Bake_Assets_Big_v03.ktx2", // Se usará la misma ruta inicialmente
    type: AssetTypes.KTX2,
  },

  // /computer_screen/
  {
    key: "PC_SCREEN_SHADER",
    path: "/computer_screen/TheOFFice_PcOn_Screen_Shader_v01.glb",
    type: AssetTypes.GLTF,
  },

  // /cristal_jardin/
  {
    key: "CRISTAL_JARDIN",
    path: "/cristal_jardin/TheOFFice_CristalJardin_v01.glb",
    type: AssetTypes.GLTF,
  },

  // /globos_cielo/
  {
    key: "GLOBOS_CIELO",
    path: "/globos_cielo/TheOFFice_GlobosCielo_v01.glb",
    type: AssetTypes.GLTF,
  },

  // /jardin_y_luces/
  {
    key: "JARDIN_LUCES_GRP",
    path: "/jardin_y_luces/TheOFFice_JardinyLuces_GRP_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "JARDIN_LUCES_GRP_KTX2",
    path: "/jardin_y_luces/JardinLuces_Bake_v01.ktx2",
    lowQualityPath: "/jardin_y_luces/JardinLuces_Bake_v01.ktx2", // Se usará la misma ruta inicialmente
    type: AssetTypes.KTX2,
  },

  // /latas/
  {
    key: "LATAS",
    path: "/latas/TheOFFice_Lata_Shader_v02.glb",
    type: AssetTypes.GLTF,
  },

  // /muebles_y_signs/
  {
    key: "MUEBLES_SIGNS_GRP",
    path: "/muebles_y_signs/TheOFFice_MueblesySigns_GRP_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "MUEBLES_SIGNS_GRP_KTX2",
    path: "/muebles_y_signs/MueblesySigns_Bake_v02_8Bits.ktx2",
    lowQualityPath: "/muebles_y_signs/MueblesySigns_Bake_v02_8Bits.ktx2", // Se usará la misma ruta inicialmente
    type: AssetTypes.KTX2,
  },

  // /paredes/
  {
    key: "PAREDES",
    path: "/paredes/TheOFFice_Paredes_v10.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "PAREDES_BAKE",
    path: "/paredes/Paredes_Bake_4k_v02.ktx2",
    lowQualityPath: "/paredes/Paredes_Bake_2k_v02.ktx2", // Se usará la misma ruta inicialmente
    type: AssetTypes.KTX2,
  },

  // /small_assets_baked/
  {
    key: "SMALL_ASSETS_GRP",
    path: "/small_assets_baked/TheOFFice_SmallAssets_GRP_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "GOOGLE_HOME",
    path: "/small_assets_baked/TheOFFice_GoogleHome_Baked_v02.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "TARJETAS",
    path: "/small_assets_baked/TheOFFice_Tarjetas_Baked_v02.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "SMALL_ASSETS_GRP_KTX2",
    path: "/small_assets_baked/SmallAssets_Bake_v01.ktx2",
    lowQualityPath: "/small_assets_baked/SmallAssets_Bake_v01.ktx2", // Se usará la misma ruta inicialmente
    type: AssetTypes.KTX2,
  },

  // /sobres/
  {
    key: "SOBRES",
    path: "/sobres/TheONFFICE_Sobres_v03.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "SOBRES_BAKE",
    path: "/sobres/Sobre-Bake-02.ktx2",
    lowQualityPath: "/sobres/Sobre-Bake-02.ktx2", // Se usará la misma ruta inicialmente
    type: AssetTypes.KTX2,
  },

  // /sofa/
  {
    key: "SOFA",
    path: "/sofa/TheOFFice_Sofa_Shader_v03.glb",
    type: AssetTypes.GLTF,
  },

  // /suelo/
  {
    key: "SUELO_BAKED",
    path: "/suelo/TheOFFice_Suelo_Baked_v03.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "SUELO_BAKE",
    path: "/suelo/Bake_Suelo_4k_v03.ktx2",
    lowQualityPath: "/suelo/Bake_Suelo_2k_v03.ktx2",
    type: AssetTypes.KTX2,
  },
];

// Extraemos todas las claves de assets
export const VALID_ASSET_KEYS = assets.map((asset) => asset.key);

// Creamos un validador para las claves de assets usando PropTypes
export const AssetKeyPropType = PropTypes.oneOf(VALID_ASSET_KEYS);

// Validador para objetos de asset completos
export const AssetPropType = PropTypes.shape({
  key: AssetKeyPropType.isRequired,
  path: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(AssetTypes)).isRequired,
  lowQualityPath: PropTypes.string,
});

/**
 * Obtiene un asset según la clave proporcionada.
 * @param {string} key - La clave del asset.
 * @returns {{ key: string, path: string, type: string, lowQualityPath?: string }} El objeto del asset.
 */
export const getAsset = (key) => {
  // Validación solo en desarrollo
  if (isDevelopment) {
    PropTypes.checkPropTypes(
      { key: AssetKeyPropType },
      { key },
      "argument",
      "getAsset"
    );
  }

  const asset = assets.find((a) => a.key === key);
  if (!asset) throw new Error(`No se encontró el asset con key: "${key}"`);
  return asset;
};

/**
 * Obtiene la ruta de un asset dado su key, considerando el nivel de calidad actual.
 * @param {string} key - La clave del asset.
 * @returns {string} La ruta del asset según el nivel de calidad.
 */
export const getAssetPath = (key) => {
  // Validación solo en desarrollo
  if (isDevelopment) {
    PropTypes.checkPropTypes(
      { key: AssetKeyPropType },
      { key },
      "argument",
      "getAssetPath"
    );
  }

  const asset = getAsset(key);

  // Obtener el nivel de calidad del store
  const qualityLevel = useExperienceStore.getState().qualityLevel;

  // Si estamos en calidad baja y el asset tiene una ruta de baja calidad, usar esa
  if (qualityLevel === QualityLevels.LOW && asset.lowQualityPath) {
    return asset.lowQualityPath;
  }

  // De lo contrario, usar la ruta predeterminada (alta calidad)
  return asset.path;
};

/**
 * Obtiene todas las claves válidas de los assets.
 * @returns {Array<string>} Array de claves de assets.
 */
export const getValidAssetKeys = () => VALID_ASSET_KEYS;

/**
 * Filtra los assets por tipo.
 * @param {string} type - El tipo de asset a filtrar.
 * @returns {Array<{key: string, path: string, type: string, lowQualityPath?: string}>} Los assets del tipo especificado.
 */
export const getAssetsByType = (type) => {
  if (isDevelopment) {
    PropTypes.checkPropTypes(
      { type: PropTypes.oneOf(Object.values(AssetTypes)) },
      { type },
      "argument",
      "getAssetsByType"
    );
  }

  return assets.filter((asset) => asset.type === type);
};

/**
 * Obtiene todas las claves de assets de un tipo específico.
 * @param {string} type - El tipo de asset.
 * @returns {Array<string>} Array de claves de assets del tipo especificado.
 */
export const getAssetKeysByType = (type) => {
  return getAssetsByType(type).map((asset) => asset.key);
};

// Exporta todas las claves de KTX2 para facilitar su uso
export const KTX2_ASSET_KEYS = getAssetKeysByType(AssetTypes.KTX2);
