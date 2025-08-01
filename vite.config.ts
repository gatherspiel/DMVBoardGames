import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import checker from "vite-plugin-checker";
import { fileURLToPath } from "node:url";
import inlineSource from "vite-plugin-inline-source";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [
    checker({
      // e.g. use TypeScript check
      typescript: true,
    }),
    inlineSource()
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
        groups: resolve(__dirname, "src/groups.html"),
        designers: resolve(__dirname, "src/designers.html"),
        print_and_play: resolve(__dirname, "src/print_and_play.html"),
        useful_links: resolve(__dirname, "src/useful_links.html"),
        create_groups: resolve(__dirname, "src/groups/create.html"),
        event: resolve(__dirname, "src/groups/event.html"),
        create_event: resolve(__dirname, "src/groups/addEvent.html"),
        feedback: resolve(__dirname, "src/feedback.html"),
      },
      output:{
        chunkFileNames: (chunkInfo) => {
          // Filenames you want to keep unhashed
          const noHashFiles = ["PageComponent", "content"];
          if (noHashFiles.includes(chunkInfo.name)) {
            return "[name].js"; // Keep file unhashed
          }
          return "assets/[name]-[hash].js"; // Hash other entry files
        },
      }
    },
  },
});
