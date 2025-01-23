// electron.vite.config.mjs
import { resolve } from "path";
import { bytecodePlugin, defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [
      bytecodePlugin({
        transformArrowFunctions: false
      }),
      externalizeDepsPlugin({
        exclude: ["electron-store", "node-fetch"]
      })
    ]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    plugins: [react()]
  }
});
export {
  electron_vite_config_default as default
};
