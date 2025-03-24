// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
  ],
  ssr: false,
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',
  vite: {
    mode: 'client',
  },
  eslint: {
    config: {
      standalone: true,
    },
  },
})
