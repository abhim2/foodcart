import { defineNuxtConfig } from 'nuxt/config'
const process = require('process')

export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', 'nuxt-auth-utils', '@vueuse/nuxt'],
  runtimeConfig: {
    locale: 'en',
    productsDirectory: '/products',
    azure: {
      connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
      containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
    },
    redisUrl: process.env.REDIS_URL || '',
    externalApiToken: process.env.EXTERNAL_API_TOKEN || '',
    public: {
      mediaUrl: process.env.NUXT_PUBLIC_MEDIA_URL || '',
    },
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['sharp'],
      },
    },
  },
  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en-US.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru-RU.json' },
    ],
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-02-10',
})
