// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nextorders/core'],
  devtools: { enabled: true },
  ssr: false,
  compatibilityDate: '2025-05-06',
})