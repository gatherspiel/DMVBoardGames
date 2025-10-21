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
        conventions: resolve(__dirname, "src/conventions.html"),
        create_account: resolve(__dirname,"src/beta/createAccount.html"),
        create_groups: resolve(__dirname, "src/beta/create.html"),
        create_event: resolve(__dirname, "src/beta/addEvent.html"),

        delete_group: resolve(__dirname, "src/beta/delete.html"),
        designers: resolve(__dirname, "src/designers.html"),

        event: resolve(__dirname, "src/groups/event.html"),

        faq: resolve(__dirname, "src/faq.html"),
        feedback: resolve(__dirname, "src/beta/feedback.html"),

        gameStores: resolve(__dirname, "src/gameStores.html"),
        gameRestaurants: resolve(__dirname, "src/gameRestaurants.html"),
        groups: resolve(__dirname, "src/groups.html"),

        join: resolve(__dirname, "src/join.html"),

        landing: resolve(__dirname,"src/landing.html"),
        links: resolve(__dirname, "src/links.html"),
        login: resolve(__dirname, "src/beta/login.html"),

        main: resolve(__dirname, "src/index.html"),

        siteRules: resolve(__dirname,"src/siteRules.html"),

        vision: resolve(__dirname,"src/vision.html")
      }
    },
  },
});
