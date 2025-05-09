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
        designers: resolve(__dirname, "designers.html"),
        plans: resolve(__dirname, "plans.html"),
        print_and_play: resolve(__dirname, "print_and_play.html"),
        useful_links: resolve(__dirname, "useful_links.html"),
      },
    },
  },
});
