import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueMacros from 'unplugin-vue-macros/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Pages from 'vite-plugin-pages'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/devServer': {
        // target: 'https://www.qiyuanyuan.live/songlistapi',
        target: 'http://localhost:8090/api',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/devServer/, ''),
      },
    },
    fs: {
      strict: false,
    },
  },
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
      },
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core', { 'naive-ui': ['useMessage'] }],
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dts: true,
      resolvers: [NaiveUiResolver()], // here is third party ui library, see more detail in your library document
    }),

    Pages(),
  ],
})
