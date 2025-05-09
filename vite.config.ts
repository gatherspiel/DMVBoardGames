import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        groups: resolve(__dirname, "groups.html"),
      },
    },
  },
});
