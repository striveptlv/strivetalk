<script setup>
import { accessCodes } from './accessCodes'
import { userAgreementText, userAgreementVersion } from './userAgreement'

const { t, locale, setLocale } = useI18n()
const config = useRuntimeConfig()

const siteName = 'STRIVE Talk'
const siteUrl = 'https://talk.striveptlv.com'
const formspreeEndpoint = config.public.formspreeEndpoint

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
const accessForm = reactive({
  email: '',
  code: '',
  acceptedAgreement: false
})
const accessSession = useLocalStorage('strive-talk-access', {
  email: '',
  code: '',
  expiresAt: '',
  unlockedAt: ''
})
const accessError = ref('')
const isSubmittingAccess = ref(false)

const isDark = computed(() => colorMode.value === 'dark')
const normalizedAccessCode = computed(() =>
  accessForm.code.trim().toUpperCase()
)
const matchingAccessCode = computed(() =>
  accessCodes.find(
    accessCode => accessCode.code.toUpperCase() === normalizedAccessCode.value
  )
)
const hasValidAccess = computed(() => {
  if (!accessSession.value.email || !accessSession.value.code) {
    return false
  }

  const accessCode = accessCodes.find(
    code => code.code === accessSession.value.code
  )

  if (!accessCode) {
    return false
  }

  return Date.now() <= Date.parse(`${accessCode.expiresAt}T23:59:59`)
})

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

async function unlockAccess() {
  accessError.value = ''

  if (!accessForm.email.trim() || !accessForm.email.includes('@')) {
    accessError.value = t('access.errors.email')
    return
  }

  if (!matchingAccessCode.value) {
    accessError.value = t('access.errors.code')
    return
  }

  if (
    Date.now()
    > Date.parse(`${matchingAccessCode.value.expiresAt}T23:59:59`)
  ) {
    accessError.value = t('access.errors.expired')
    return
  }

  if (!accessForm.acceptedAgreement) {
    accessError.value = t('access.errors.agreement')
    return
  }

  isSubmittingAccess.value = true

  try {
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: accessForm.email.trim(),
        accessCode: matchingAccessCode.value.code,
        codeLabel: matchingAccessCode.value.label,
        expiresAt: matchingAccessCode.value.expiresAt,
        acceptedAgreement: 'yes',
        acceptedAgreementAt: new Date().toISOString(),
        userAgreementVersion,
        source: 'STRIVE Talk access gate'
      })
    })

    if (!response.ok) {
      throw new Error('Formspree submission failed')
    }

    accessSession.value = {
      email: accessForm.email.trim(),
      code: matchingAccessCode.value.code,
      expiresAt: matchingAccessCode.value.expiresAt,
      unlockedAt: new Date().toISOString()
    }
  } catch {
    accessError.value = t('access.errors.submit')
  } finally {
    isSubmittingAccess.value = false
  }
}

function lockAccess() {
  accessSession.value = {
    email: '',
    code: '',
    expiresAt: '',
    unlockedAt: ''
  }
  accessForm.code = ''
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
    <main
      v-if="!hasValidAccess"
      class="flex min-h-screen items-center justify-center bg-[#fffaf2] px-4 py-8 text-[#0e2f5d] dark:bg-[#111113] dark:text-[#f4f4f5]"
    >
      <section class="w-full max-w-2xl rounded-xl border border-[rgba(46,117,182,0.18)] bg-white p-5 shadow-ambient dark:border-[#1f2937] dark:bg-[#18181b] sm:p-7">
        <div class="flex items-center gap-3">
          <img
            src="/strive-talk-logo.png"
            alt="STRIVE Physical Therapy logo"
            class="h-12 w-12 object-contain"
          >
          <div>
            <p class="font-brand-heading text-2xl font-bold uppercase tracking-[0.08em] text-[#083d7a] dark:text-[#8ecae6]">
              {{ t("app.brand") }}
            </p>
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#e68a4d]">
              {{ t("access.title") }}
            </p>
          </div>
        </div>

        <p class="mt-5 text-sm leading-6 text-[#4b5563] dark:text-[#d1d5db]">
          {{ t("access.intro") }}
        </p>

        <form
          class="mt-6 space-y-5"
          @submit.prevent="unlockAccess"
        >
          <label class="block">
            <span class="text-sm font-semibold">{{ t("access.email") }}</span>
            <UInput
              v-model="accessForm.email"
              type="email"
              size="xl"
              class="mt-2"
              :placeholder="t('access.emailPlaceholder')"
              autocomplete="email"
              required
            />
          </label>

          <label class="block">
            <span class="text-sm font-semibold">{{ t("access.code") }}</span>
            <UInput
              v-model="accessForm.code"
              type="text"
              size="xl"
              class="mt-2"
              :placeholder="t('access.codePlaceholder')"
              autocomplete="one-time-code"
              required
            />
          </label>

          <div class="rounded-lg border border-default bg-[#f8fafc] p-4 dark:bg-[#111113]">
            <p class="text-sm font-semibold">
              {{ t("access.agreementTitle") }}
            </p>
            <p class="mt-1 text-xs text-[#4b5563] dark:text-[#d1d5db]">
              {{ t("access.agreementIntro") }}
            </p>
            <pre class="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-md border border-default bg-white p-3 text-xs leading-5 text-[#1f2937] dark:bg-[#18181b] dark:text-[#e5e7eb]">{{ userAgreementText }}</pre>
          </div>

          <label class="flex items-start gap-3 rounded-lg border border-default p-4 text-sm leading-5">
            <input
              v-model="accessForm.acceptedAgreement"
              type="checkbox"
              class="mt-1 h-5 w-5 rounded border-[#94a3b8]"
              required
            >
            <span>{{ t("access.agreementCheckbox") }}</span>
          </label>

          <UAlert
            v-if="accessError"
            color="error"
            variant="soft"
            icon="i-lucide-circle-alert"
            :description="accessError"
          />

          <UButton
            type="submit"
            color="primary"
            size="xl"
            block
            :loading="isSubmittingAccess"
            :label="
              isSubmittingAccess ? t('access.submitting') : t('access.submit')
            "
          />
        </form>
      </section>
    </main>

    <template v-else>
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
              icon="i-lucide-lock"
              color="neutral"
              variant="ghost"
              :aria-label="t('access.lock')"
              @click="lockAccess"
            />

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
    </template>
  </UApp>
</template>
