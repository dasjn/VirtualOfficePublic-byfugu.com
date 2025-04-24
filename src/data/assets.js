// assets/assets.js

import PropTypes from "prop-types";

// assets/assets.js

const isDevelopment = import.meta.env ? import.meta.env.DEV : false;

export const AssetTypes = {
  GLTF: "gltf",
  TEXTURE: "texture",
  KTX2: "ktx2",
};

/**
 * @typedef {"ALFOMBRA" | "BAKED_ALL" | "BIG_ASSETS_GRP" | "BIG_ASSETS_GRP_KTX2" | "BIG_BAKE" | "BOTON_PUERTA" | "CRISTAL_JARDIN" |
 *  "CUADRO_02" | "CUERDA_MESA" | "ENVIRONMENT" | "ESPINA" | "GLOBOS_CIELO" |
 *  "GOOGLE_HOME" | "HDR"  | "JARDIN_LUCES_BAKE" | "JARDIN_LUCES_BAKED" | "JARDIN_LUCES_GRP" | "JARDIN_LUCES_GRP_KTX2" | "JARDIN_PIEDRAS_BAKED" |
 *  "JARDIN_SUELO_BAKED" | "LATAS" | "LENGUA_VENTANA" | "LUCES" | "MANETAS_PUERTA" |
 *  "MARCO_CUADRO_01" | "MARCO_CUADRO_02" | "MARCO_TV" | "MARCO_VENTANA" | "MESA_OFFICE" |
 *  "MESA_OFFICE_BAKED" | "MUEBLES_SIGNS_BAKE" | "PAREDES" | "PAREDES_BAKE" | "PC_OFF" |
 *  "PC_ON" | "PC_SCREEN_SHADER" | "PIEDRAS_JARDIN" | "PLANO_IMG_CUADRO" | "SETUP_MESA" |
 *  "SETUP_MESA_BAKED" | "SIGN_MEETING" | "SIGN_MEETING_BAKED" | "SIGN_WC" | "SIGN_WC_BAKED" | "SMALL_ASSETS_GRP" | "SMALL_ASSETS_GRP_KTX2" |
 *  "SMALL_BAKE" | "SOBRES" | "SOBRES_BAKE" | "SOFA" | "SUELO_BAKE" | "SUELO_BAKED" |
 *  "SUELO_JARDIN" | "TARJETAS"} AssetKey
 */

/**
 * Lista de assets disponibles.
 * @type {Array<{key: AssetKey, path: string, type: string}>}
 */
export const assets = [
  // MODELOS
  // Main environment
  {
    key: "ENVIRONMENT",
    path: "/TheOFFiceFUGU_Environment_v4.glb",
    type: AssetTypes.GLTF,
  },

  // Big baked
  {
    key: "BIG_ASSETS_GRP",
    path: "/big_assets_baked/TheOFFice_BigAssets_GRP_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "SMALL_ASSETS_GRP",
    path: "/small_assets_baked/TheOFFice_SmallAssets_GRP_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "MUEBLES_SIGNS_GRP",
    path: "/muebles_y_signs/TheOFFice_MueblesySigns_GRP_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "ALFOMBRA",
    path: "/big_assets_baked/TheOFFice_Alfombra_Baked_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "LENGUA_VENTANA",
    path: "/big_assets_baked/TheOFFice_LenguaVentana_Baked_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "MARCO_CUADRO_01",
    path: "/big_assets_baked/TheOFFice_MarcoCuadro01_Baked_v03.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "MARCO_CUADRO_02",
    path: "/big_assets_baked/TheOFFice_MarcoCuadro02_Baked_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "MARCO_VENTANA",
    path: "/big_assets_baked/TheOFFice_MarcoVentana_Baked_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "MARCO_TV",
    path: "/big_assets_baked/TheOFFice_MarcoTV_v01.glb",
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

  // Small baked
  {
    key: "BOTON_PUERTA",
    path: "/small_assets_baked/TheOFFice_BotonPuerta_Baked_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "CUERDA_MESA",
    path: "/small_assets_baked/TheOFFice_CuerdaMesaSetUp_Baked_v02.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "GOOGLE_HOME",
    path: "/small_assets_baked/TheOFFice_GoogleHome_Baked_v02.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "MANETAS_PUERTA",
    path: "/small_assets_baked/TheOFFice_ManetasPuerta_Baked_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "PC_OFF",
    path: "/small_assets_baked/TheOFFice_PcOFF_Baked_v02.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "PC_ON",
    path: "/small_assets_baked/TheOFFice_PcOn_Baked_v02.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "TARJETAS",
    path: "/small_assets_baked/TheOFFice_Tarjetas_Baked_v02.glb",
    type: AssetTypes.GLTF,
  },

  // Computer screen
  {
    key: "PC_SCREEN_SHADER",
    path: "/computer_screen/TheOFFice_PcOn_Screen_Shader_v01.glb",
    type: AssetTypes.GLTF,
  },

  // Furniture
  {
    key: "MESA_OFFICE",
    path: "/mesa_office/TheOFFice_OfficeMesa_Shader_v02.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "SETUP_MESA",
    path: "/mesa_set_up/TheOFFice_SetUpMesa_Shader_v02.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "SUELO_JARDIN",
    path: "/suelo_jardin/TheOFFice_SueloJardin_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "SOFA",
    path: "/sofa/TheOFFice_Sofa_Shader_v03.glb",
    type: AssetTypes.GLTF,
  },

  // Signs
  {
    key: "SIGN_MEETING",
    path: "/signs/TheOFFice_SignMeetingRoom_Shader_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "SIGN_WC",
    path: "/signs/TheOFFice_SignWC_Shader_v01.glb",
    type: AssetTypes.GLTF,
  },

  // Garden
  {
    key: "JARDIN_LUCES_GRP",
    path: "/jardin_y_luces/TheOFFice_JardinyLuces_GRP_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "PIEDRAS_JARDIN",
    path: "/piedras_jardin/TheOFFice_Piedras_Shader_v02.glb",
    type: AssetTypes.GLTF,
  },
  { key: "ESPINA", path: "/FUGU_Jardin_Espina_v01.glb", type: AssetTypes.GLTF },
  {
    key: "CRISTAL_JARDIN",
    path: "/cristal_jardin/TheOFFice_CristalJardin_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "LATAS",
    path: "/latas/TheOFFice_Lata_Shader_v02.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "GLOBOS_CIELO",
    path: "/globos_cielo/TheOFFice_GlobosCielo_v01.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "LUCES",
    path: "/luces/TheOFFice_Luces_Shader_v01.glb",
    type: AssetTypes.GLTF,
  },

  // Sectional
  {
    key: "SUELO_BAKED",
    path: "/suelo/TheOFFice_Suelo_Baked_v03.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "PAREDES",
    path: "/paredes/TheOFFice_Paredes_v09.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "JARDIN_SUELO_BAKED",
    path: "/jardin_y_luces/TheOFFice_SueloJardin_Baked_v02.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "JARDIN_LUCES_BAKED",
    path: "/jardin_y_luces/TheOFFice_Luces_Baked_v02.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "JARDIN_PIEDRAS_BAKED",
    path: "/jardin_y_luces/TheOFFice_Piedras_Baked_v02.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "SETUP_MESA_BAKED",
    path: "/muebles_y_signs/TheOFFice_SetUpMesa_Bake_v06.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "MESA_OFFICE_BAKED",
    path: "/muebles_y_signs/TheOFFice_OfficeMesa_Bake_v06.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "SIGN_MEETING_BAKED",
    path: "/muebles_y_signs/TheOFFice_SignMeetingRoom_Bake_v06.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "SIGN_WC_BAKED",
    path: "/muebles_y_signs/TheOFFice_SignWC_Bake_v06.glb",
    type: AssetTypes.GLTF,
  },
  {
    key: "SOBRES",
    path: "/sobres/TheONFFICE_Sobres_v02.glb",
    type: AssetTypes.GLTF,
  },

  // TEXTURAS
  { key: "BAKED_ALL", path: "/Baked_All_001.jpg", type: AssetTypes.TEXTURE },
  {
    key: "BIG_BAKE",
    path: "/big_assets_baked/Bake_Assets_Big_v03.jpg",
    type: AssetTypes.TEXTURE,
  },
  {
    key: "SMALL_BAKE",
    path: "/small_assets_baked/SmallAssets_Bake_v01.jpg",
    type: AssetTypes.TEXTURE,
  },
  {
    key: "SUELO_BAKE",
    path: "/suelo/Bake_Suelo_v03.webp",
    type: AssetTypes.TEXTURE,
  },
  {
    key: "PAREDES_BAKE",
    path: "/paredes/Paredes_Bake_8k_v02.webp",
    type: AssetTypes.TEXTURE,
  },
  {
    key: "JARDIN_LUCES_BAKE",
    path: "/jardin_y_luces/JardinLuces_Bake_v01.webp",
    type: AssetTypes.TEXTURE,
  },
  {
    key: "MUEBLES_SIGNS_BAKE",
    path: "/muebles_y_signs/MueblesySigns_Bake_v01.webp",
    type: AssetTypes.TEXTURE,
  },
  {
    key: "SOBRES_BAKE",
    path: "/sobres/Sobre-Bake-02.webp",
    type: AssetTypes.TEXTURE,
  },
  { key: "HDR", path: "/hdr/HDRI_v02.webp", type: AssetTypes.TEXTURE },

  // TEXTURAS KTX2
  {
    key: "JARDIN_LUCES_GRP_KTX2",
    path: "/jardin_y_luces/JardinLuces_Bake_v01.ktx2",
    type: AssetTypes.KTX2,
  },
  {
    key: "BIG_ASSETS_GRP_KTX2",
    path: "/big_assets_baked/Bake_Assets_Big_v03.ktx2",
    type: AssetTypes.KTX2,
  },
  {
    key: "SMALL_ASSETS_GRP_KTX2",
    path: "/small_assets_baked/SmallAssets_Bake_v01.ktx2",
    type: AssetTypes.KTX2,
  },
  {
    key: "MUEBLES_SIGNS_GRP_KTX2",
    path: "/muebles_y_signs/MueblesySigns_Bake_v02_8Bits.ktx2",
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
});

/**
 * Obtiene un asset según la clave proporcionada.
 * @param {string} key - La clave del asset.
 * @returns {{ key: string, path: string, type: string }} El objeto del asset.
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
 * Obtiene la ruta de un asset dado su key.
 * @param {string} key - La clave del asset.
 * @returns {string} La ruta del asset.
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

  return getAsset(key).path;
};

/**
 * Obtiene todas las claves válidas de los assets.
 * @returns {Array<string>} Array de claves de assets.
 */
export const getValidAssetKeys = () => VALID_ASSET_KEYS;

/**
 * Filtra los assets por tipo.
 * @param {string} type - El tipo de asset a filtrar.
 * @returns {Array<{key: string, path: string, type: string}>} Los assets del tipo especificado.
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
