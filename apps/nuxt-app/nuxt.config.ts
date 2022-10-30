export default defineNuxtConfig({
  typescript: { shim: false },
  nitro: {
    output: {
      dir: '~~/../../dist/apps/nuxt-app',
    },
  },
  srcDir: 'src/',
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'nuxt-app',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'nuxt-app-description' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  css: ['assets/css/global.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt', '@nuxt/image-edge'],
  tailwindcss: {
    viewer: false,
  },
  image: {},
});
