import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import inlineSource from "vite-plugin-inline-source";
import handlebars from "vite-plugin-handlebars";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/html/partials"),
    }),
    inlineSource(),
  ],
  root: "src/",
  publicDir: "../public",
  build: {
    cssCodeSplit: false,
    emptyOutDir: true,
    outDir: "../dist",
    rollupOptions: {
      input: {
        about: resolve(__dirname, "src/html/static/about.html"),

        code: resolve(__dirname, "src/html/static/code.html"),
        conventions: resolve(__dirname, "src/html/list/conventions.html"),
        create_account: resolve(__dirname, "src/html/user/createAccount.html"),
        create_groups: resolve(__dirname, "src/html/groups/create.html"),
        create_event: resolve(__dirname, "src/html/groups/addEvent.html"),

        delete_group: resolve(__dirname, "src/html/groups/delete.html"),
        designers: resolve(__dirname, "src/html/static/designers.html"),

        editProfile: resolve(__dirname, "src/html/user/editProfile.html"),
        event: resolve(__dirname, "src/html/groups/event.html"),

        faq: resolve(__dirname, "src/html/static/faq.html"),
        feedback: resolve(__dirname, "src/html/feedback.html"),

        gameStores: resolve(__dirname, "src/html/list/gameStores.html"),
        gameRestaurants: resolve(
          __dirname,
          "src/html/list/gameRestaurants.html",
        ),
        groups: resolve(__dirname, "src/html/groups/groups.html"),

        join: resolve(__dirname, "src/html/static/join.html"),

        landing: resolve(__dirname, "src/html/static/landing.html"),
        links: resolve(__dirname, "src/html/static/links.html"),
        login: resolve(__dirname, "src/html/user/login.html"),


        main: resolve(__dirname, "src/index.html"),
        manualTesting: resolve(__dirname, "src/html/static/tech/manualtesting.html"),
        memberData: resolve(__dirname, "src/html/user/memberData.html"),

        placesJS: resolve(__dirname, "src/html/static/tech/placesjs.html"),

        searchGroups: resolve(__dirname, "src/html/list/searchGroups.html"),
        siteRules: resolve(__dirname, "src/html/static/siteRules.html"),

        vision: resolve(__dirname, "src/html/static/vision.html"),
      },
    },
  },
});
