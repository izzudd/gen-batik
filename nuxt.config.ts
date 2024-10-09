// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/icon'],

  nitro: {
    storage: {
      state: { driver: 'memory' },
      data: { driver: 'fs', base: './comfy-output' },
    },
  },

  runtimeConfig: {
    comfyUrl: process.env.COMFY_ADDRESS || 'localhost:8188',
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
