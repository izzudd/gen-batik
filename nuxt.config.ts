// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/icon', '@nuxt/fonts', '@nuxt/image'],

  nitro: {
    storage: {
      state: { driver: 'memory' },
      data: { driver: 'fs', base: './comfy-output' },
    },
  },

  runtimeConfig: {
    comfyUrl: 'localhost:' + (process.env.COMFY_PORT || '8188'),
    public: {
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    }
  },

  image: {
    format: ['avif', 'webp', 'jpeg'],
    domains: [stripProtocol(process.env.APP_URL || 'http://localhost:3000')],
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

function stripProtocol(url: string): string {
  return url.replace(/(^\w+:|^)\/\//, '');
}