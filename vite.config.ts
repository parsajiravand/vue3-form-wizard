import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const path = require("path");
import banner from "vite-plugin-banner";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      banner,
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Vue3FormWizard",
      fileName: (format) => `vue3-form-wizard.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  plugins: [
    vue(),
    banner(`/*
 * ${pkg.name}
 * Creator:${pkg.author}
 * ${pkg.description}
 * v${pkg.version}
 * ${pkg.license} License
 */
`),
  ],
});
