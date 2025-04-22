const fs = require("fs");
const path = require("path");

// Cambiar __dirname a la raíz del proyecto
const PROJECT_ROOT = path.resolve(__dirname, ".."); // Esto apunta a la raíz del proyecto
const TRASH_FOLDER = path.resolve(PROJECT_ROOT, "src/_trash");
const UNUSED_FILES_LIST = path.resolve(PROJECT_ROOT, "unused-files.txt");

// Verifica si la carpeta _trash existe, si no la crea
if (!fs.existsSync(TRASH_FOLDER)) {
  fs.mkdirSync(TRASH_FOLDER, { recursive: true });
  console.log(`🗑️ Created _trash folder at: ${TRASH_FOLDER}`);
}

// Lee el archivo de texto con las rutas de los archivos no utilizados
const files = fs
  .readFileSync(UNUSED_FILES_LIST, "utf-8")
  .split("\n")
  .map((line) => line.trim()) // Elimina espacios extra al principio y al final
  .filter((line) => line.length > 0 && !line.startsWith("-")) // Elimina líneas que empiezan con un guion
  .map((line) => line.replace(/^\s+|\s+$/g, "")); // Elimina cualquier espacio al principio o al final

console.log("🔍 Files to move:", files);

// Recorre cada archivo en la lista
files.forEach((file) => {
  console.log(`🔎 File being processed: "${file}"`); // Verifica cómo se están leyendo las rutas

  const srcPath = path.resolve(PROJECT_ROOT, file); // Ahora toma la ruta desde la raíz del proyecto
  const fileName = path.basename(file); // Solo el nombre del archivo
  const destPath = path.resolve(TRASH_FOLDER, fileName); // Ruta destino en la carpeta _trash

  // Verifica si el archivo existe en la ruta de origen
  if (fs.existsSync(srcPath)) {
    console.log(`✔️ File found: ${srcPath}`);
    try {
      fs.renameSync(srcPath, destPath); // Mueve el archivo
      console.log(`✔️ Moved: ${fileName} to ${destPath}`);
    } catch (err) {
      console.error(`❌ Error moving file: ${err.message}`);
    }
  } else {
    console.warn(`⚠️ File not found: ${srcPath}`);
  }
});
