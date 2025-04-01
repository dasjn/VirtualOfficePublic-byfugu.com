/**
 * Configuración de todos los GainMaps de la aplicación
 * Esta lista centralizada facilita el control de la precarga
 */
export const GAINMAPS = [
  {
    id: "paredes_texture",
    urls: [
      "/paredes/Paredes_Bake_8k_v02.webp",
      "/paredes/Paredes_Bake_8k_v02-gainmap.webp",
      "/paredes/Paredes_Bake_8k_v02.json",
    ],
  },
  {
    id: "suelo_texture",
    urls: [
      "/suelo/Bake_Suelo_v03.webp",
      "/suelo/Bake_Suelo_v03-gainmap.webp",
      "/suelo/Bake_Suelo_v03.json",
    ],
  },
  {
    id: "hdri_environment",
    urls: [
      "/hdr/HDRI_v02.webp",
      "/hdr/HDRI_v02-gainmap.webp",
      "/hdr/HDRI_v02.json",
    ],
  },
  // Añade aquí todos los demás GainMaps de tu aplicación
];

/**
 * Función de ayuda para obtener la configuración de un GainMap por ID
 * @param {string} id - ID del GainMap
 * @returns {Object|null} - Configuración del GainMap o null si no existe
 */
export function getGainMapConfig(id) {
  return GAINMAPS.find((gainmap) => gainmap.id === id) || null;
}
