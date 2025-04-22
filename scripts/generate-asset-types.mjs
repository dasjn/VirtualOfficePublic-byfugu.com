// scripts/generate-asset-types.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Importa tu array de assets
import { assets } from "../src/data/assets.js"; // ajusta la ruta si hace falta

// Extraer claves únicas
const keys = Array.from(new Set(assets.map((a) => a.key))).sort();

const content = `// Auto-generado desde assets.js. NO editar a mano.
/**
 * Lista de claves válidas de assets para autocompletado en JS y verificación.
 */
export type AssetKey =
${keys.map((k) => `  | "${k}"`).join("\n")};
`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, "../src/data/assets.d.ts");

fs.writeFileSync(outputPath, content, "utf-8");
console.log("✅ Archivo assets.d.ts generado con éxito:", outputPath);
