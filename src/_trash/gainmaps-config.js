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
  {
    id: "jardin_y_luces_texture",
    urls: [
      "/jardin_y_luces/JardinLuces_Bake_v01.webp",
      "/jardin_y_luces/JardinLuces_Bake_v01-gainmap.webp",
      "/jardin_y_luces/JardinLuces_Bake_v01.json",
    ],
  },
  {
    id: "muebles_y_signs_texture",
    urls: [
      "/muebles_y_signs/MueblesySigns_Bake_v01.webp",
      "/muebles_y_signs/MueblesySigns_Bake_v01-gainmap.webp",
      "/muebles_y_signs/MueblesySigns_Bake_v01.json",
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
