// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/icon', '@nuxt/fonts'],

  nitro: {
    storage: {
      state: { driver: 'memory' },
      data: { driver: 'fs', base: './comfy-output' },
    },
  },

  runtimeConfig: {
    comfyUrl: 'localhost:' + (process.env.COMFY_PORT || '8188'),
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
})