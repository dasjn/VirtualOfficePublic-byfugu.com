import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import UnusedFiles from "vite-plugin-unused-files";

export default defineConfig({
  plugins: [
    react(),
    UnusedFiles({
      patterns: ["src/**/*.*"], // escanea todo en src
      failOnUnused: false, // puedes activarlo si quieres que falle en CI/CD
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
