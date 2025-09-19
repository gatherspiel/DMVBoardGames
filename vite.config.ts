import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import checker from "vite-plugin-checker";
import { fileURLToPath } from "node:url";
import inlineSource from "vite-plugin-inline-source";
import handlebars from 'vite-plugin-handlebars';
import { ViteMinifyPlugin } from 'vite-plugin-minify'

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [
    checker({
      // e.g. use TypeScript check
      typescript: true,
    }),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
    }),
    inlineSource(),
    ViteMinifyPlugin({}),
  ],
  root: "src/",
  publicDir: "../public",
  build: {
    cssCodeSplit: false,
    emptyOutDir: true,
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        conventions: resolve(__dirname, "src/conventions.html"),
        gameStores: resolve(__dirname, "src/gameStores.html"),
        gameRestaurants: resolve(__dirname, "src/gameRestaurants.html"),
        groups: resolve(__dirname, "src/groups.html"),
        designers: resolve(__dirname, "src/designers.html"),
        print_and_play: resolve(__dirname, "src/print_and_play.html"),
        links: resolve(__dirname, "src/links.html"),
        feedback: resolve(__dirname, "src/feedback.html"),
        login: resolve(__dirname, "src/login.html"),
        create_groups: resolve(__dirname, "src/groups/create.html"),
        event: resolve(__dirname, "src/groups/event.html"),
        create_event: resolve(__dirname, "src/groups/addEvent.html"),
        delete_group: resolve(__dirname, "src/groups/delete.html")
      }
    },
  },
});
