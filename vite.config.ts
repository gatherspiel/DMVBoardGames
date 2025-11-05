import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import checker from "vite-plugin-checker";
import { fileURLToPath } from "node:url";
import inlineSource from "vite-plugin-inline-source";
import handlebars from 'vite-plugin-handlebars';
import { ViteMinifyPlugin } from 'vite-plugin-minify'

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    checker({
      // e.g. use TypeScript check
      typescript: true,
    }),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/html/partials'),
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
        conventions: resolve(__dirname, "src/html/list/conventions.html"),
        create_account: resolve(__dirname,"src/html/user/createAccount.html"),
        create_groups: resolve(__dirname, "src/html/groups/create.html"),
        create_event: resolve(__dirname, "src/html/groups/addEvent.html"),

        delete_group: resolve(__dirname, "src/html/groups/delete.html"),
        designers: resolve(__dirname, "src/html/static/designers.html"),

        editProfile: resolve(__dirname, "src/html/user/editProfile.html"),
        event: resolve(__dirname, "src/html/groups/event.html"),

        faq: resolve(__dirname, "src/html/static/faq.html"),
        feedback: resolve(__dirname, "src/html/feedback.html"),

        gameStores: resolve(__dirname, "src/html/list/gameStores.html"),
        gameRestaurants: resolve(__dirname, "src/html/list/gameRestaurants.html"),
        groups: resolve(__dirname, "src/html/groups/groups.html"),

        join: resolve(__dirname, "src/html/static/join.html"),

        landing: resolve(__dirname,"src/html/static/landing.html"),
        links: resolve(__dirname, "src/html/static/links.html"),
        login: resolve(__dirname, "src/html/user/login.html"),

        main: resolve(__dirname, "src/index.html"),

        siteRules: resolve(__dirname,"src/html/static/siteRules.html"),

        vision: resolve(__dirname,"src/html/static/vision.html")
      }
    },
  },
});
