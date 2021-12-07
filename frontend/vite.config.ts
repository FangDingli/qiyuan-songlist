import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path"
import { changePackageVersion } from "./build/plugins"

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },
  server: {
    port: 3000,
    proxy: {
      "/devServer": {
        target: "http://8.136.112.243:8003",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/devServer/, '')
      }
    },
    fs: {
      strict: false
    }
  },
  plugins: [
    changePackageVersion(),
    vue({
      refTransform: [/src/]
    })
  ]
})
