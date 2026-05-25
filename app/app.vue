<script setup>
const { t, locale, setLocale } = useI18n()

const siteName = 'STRIVE Talk'
const siteUrl = 'https://talk.striveptlv.com'

const defaultTitle = computed(() => t('app.seo.defaultTitle'))
const defaultDescription = computed(() => t('app.seo.defaultDescription'))
const socialImage = `${siteUrl}/strive-talk-banner.png`

const route = useRoute()
const canonicalUrl = computed(
  () => `${siteUrl}${route.path === '/' ? '' : route.path}`
)
const structuredData = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': siteName,
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'Web',
    'inLanguage': locale.value,
    'description': defaultDescription.value,
    'url': siteUrl,
    'image': socialImage,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'author': {
      '@type': 'Organization',
      'name': 'STRIVE Physical Therapy'
    }
  })
)

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'canonical', href: () => canonicalUrl.value }
  ],
  script: [
    { type: 'application/ld+json', children: () => structuredData.value }
  ],
  htmlAttrs: {
    lang: () => locale.value
  }
})

useSeoMeta({
  title: () => defaultTitle.value,
  titleTemplate: `%s | ${siteName}`,
  description: () => defaultDescription.value,
  applicationName: siteName,
  author: 'STRIVE Physical Therapy',
  keywords: () => t('app.seo.keywords'),
  robots:
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  ogType: 'website',
  ogSiteName: siteName,
  ogLocale: () => (locale.value === 'en' ? 'en_US' : 'es_MX'),
  ogTitle: () => `${siteName} - ${defaultTitle.value}`,
  ogDescription: () => defaultDescription.value,
  ogUrl: () => canonicalUrl.value,
  ogImage: socialImage,
  ogImageAlt: () => t('app.seo.ogImageAlt'),
  twitterCard: 'summary_large_image',
  twitterTitle: () => `${siteName} - ${defaultTitle.value}`,
  twitterDescription: () => defaultDescription.value,
  twitterImage: socialImage,
  twitterImageAlt: () => t('app.seo.ogImageAlt')
})

const speechLang = useLocalStorage('speech-lang', 'en-US')

watch(
  speechLang,
  (value) => {
    if (!['en-US', 'es-MX'].includes(value)) {
      speechLang.value = 'en-US'
      return
    }

    const nextLocale = value === 'en-US' ? 'en' : 'es'
    if (nextLocale !== locale.value) {
      setLocale(nextLocale)
    }
  },
  { immediate: true }
)

const colorMode = useColorMode()
const { isDeleteMode, toggleDeleteMode, disableDeleteMode } = useDeleteMode()

const isDark = computed(() => colorMode.value === 'dark')

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

watch(
  () => route.path,
  () => {
    disableDeleteMode()
  }
)
</script>

<template>
  <UApp class="min-h-screen">
    <header class="border-b border-[rgba(46,117,182,0.16)] bg-[#fffaf2]/95 backdrop-blur dark:border-[#1f2937] dark:bg-[#111113]/95">
      <div
        class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6"
      >
        <a
          href="https://striveptlv.com"
          class="flex items-center gap-3 no-underline"
          aria-label="STRIVE Physical Therapy website"
        >
          <img
            src="/strive-talk-logo.png"
            alt="STRIVE Physical Therapy logo"
            class="h-11 w-11 object-contain"
          >
          <span class="flex flex-col leading-none">
            <span
              class="font-brand-heading text-[1.35rem] font-bold uppercase tracking-[0.08em] text-[#083d7a] dark:text-[#8ecae6]"
            >
              {{ t("app.brand") }}
            </span>
            <span
              class="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#e68a4d]"
            >
              {{ t("app.tagline") }}
            </span>
          </span>
        </a>

        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-pencil"
            :color="isDeleteMode ? 'primary' : 'neutral'"
            variant="ghost"
            :aria-label="
              isDeleteMode
                ? t('app.aria.deleteModeOff')
                : t('app.aria.deleteModeOn')
            "
            @click="toggleDeleteMode"
          />

          <UButton
            :label="isDark ? '🌞' : '🌙'"
            color="neutral"
            variant="ghost"
            :aria-label="t('app.aria.changeTheme')"
            @click="toggleTheme"
          />
        </div>
      </div>
    </header>

    <UMain class="pb-24">
      <NuxtPage />

      <USeparator
        icon="i-simple-icons-nuxtdotjs"
        class="mt-10"
      />

      <UFooter>
        <template #left>
          <p class="text-sm text-muted">
            {{ t("app.madeWith") }}
          </p>
        </template>

        <template #right>
          <div class="flex items-center gap-1">
            <UButton
              to="/about"
              :label="t('app.nav.about')"
              icon="i-lucide-info"
              variant="ghost"
              color="neutral"
            />
            <UButton
              to="/settings"
              :label="t('app.nav.settings')"
              icon="i-lucide-settings"
              variant="ghost"
              color="neutral"
            />
          </div>
        </template>
      </UFooter>
    </UMain>

    <footer
      class="fixed inset-x-0 bottom-0 z-50 border-t border-default bg-default/95 backdrop-blur supports-backdrop-filter:bg-default/80"
    >
      <nav
        class="mx-auto flex max-w-lg items-center justify-center gap-3 px-4 py-4"
      >
        <UButton
          to="/"
          :label="t('app.nav.home')"
          icon="i-lucide-house"
          variant="ghost"
          :color="route.path === '/' ? 'primary' : 'neutral'"
          size="xl"
          class="flex-1 justify-center text-lg font-semibold"
        />
        <UButton
          to="/phrases"
          :label="t('app.nav.phrases')"
          icon="i-lucide-message-square"
          variant="ghost"
          :color="route.path.startsWith('/phrases') ? 'primary' : 'neutral'"
          size="xl"
          class="flex-1 justify-center text-lg font-semibold"
        />
      </nav>
    </footer>
  </UApp>
</template>
