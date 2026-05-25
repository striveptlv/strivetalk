// https://nuxt.com/docs/api/configuration/nuxt-config
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const baseURL = process.env.NUXT_APP_BASE_URL || '/'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    // "@nuxt/a11y", // disabled: alpha module known to crash vite-node worker
    '@nuxt/hints',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt'
  ],
  ssr: false,

  devtools: {
    enabled: true
  },

  app: {
    baseURL,
    head: {
      link: [
        {
          rel: 'manifest',
          href: `${baseURL}manifest.webmanifest`
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: `${baseURL}apple-touch-icon.png`
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    preset: isGitHubActions ? 'github_pages' : undefined
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    langDir: 'locales',
    locales: [
      { code: 'es', language: 'es-MX', name: 'Español', file: 'es.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'strive_talk_locale',
      redirectOn: 'root'
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'STRIVE Talk',
      short_name: 'STRIVE Talk',
      description:
        'AAC communication support with English and Spanish voice output.',
      theme_color: '#083d7a',
      background_color: '#fffaf2',
      display: 'standalone',
      scope: baseURL,
      start_url: baseURL,
      icons: [
        {
          src: 'pwa-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-icon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: `${baseURL}index.html`,
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json,txt,woff2}'],
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true
    },
    client: {
      installPrompt: true
    }
  }
})
