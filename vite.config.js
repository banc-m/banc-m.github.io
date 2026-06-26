import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig(({command}) => {

  return {
    plugins: [vue()],
    server: {
      host: true
    },
    build: {
      outDir: 'docs'
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      },
    }
  }
})
