<script setup lang="ts">
const { t, locale, setLocale } = useI18n()

useSeoMeta({
  title: () => t('settings.seoTitle'),
  description: () => t('settings.seoDescription')
})

const lang = useLocalStorage<string>('speech-lang', 'en-US')
const pitch = useLocalStorage<number>('speech-pitch', 1)
const rate = useLocalStorage<number>('speech-rate', 1)

const langs = computed(() => [
  { label: t('settings.speechLanguages.esMX'), value: 'es-MX' },
  { label: t('settings.speechLanguages.enUS'), value: 'en-US' }
])

const langsTest = computed(() => [
  {
    label: t('settings.speechLanguages.esMX'),
    text: t('settings.demoText.esMX'),
    value: 'es-MX'
  },
  {
    label: t('settings.speechLanguages.enUS'),
    text: t('settings.demoText.enUS'),
    value: 'en-US'
  }
])

// USlider works with 0–100; map to actual speech ranges
// pitch: 0–2  → slider 0–100
// rate:  0.5–2 → slider 0–100
const pitchSlider = computed({
  get: () => Math.round((pitch.value / 2) * 100),
  set: (v: number) => {
    pitch.value = parseFloat(((v / 100) * 2).toFixed(2))
  }
})

const rateSlider = computed({
  get: () => Math.round(((rate.value - 0.5) / 1.5) * 100),
  set: (v: number) => {
    rate.value = parseFloat((0.5 + (v / 100) * 1.5).toFixed(2))
  }
})

const { speak } = useAacSpeech(lang, pitch, rate)

const resetDefaults = () => {
  pitch.value = 1
  rate.value = 1
}

const currentLangDemo = computed(
  () =>
    langsTest.value.find(l => l.value === lang.value) ?? {
      label: t('settings.speechLanguages.esMX'),
      text: t('settings.demoText.esMX'),
      value: 'es-MX'
    }
)

watch(
  lang,
  (value) => {
    if (!['en-US', 'es-MX'].includes(value)) {
      lang.value = 'en-US'
      return
    }

    const nextLocale = value === 'en-US' ? 'en' : 'es'
    if (nextLocale !== locale.value) {
      setLocale(nextLocale)
    }
  },
  { immediate: true }
)
</script>

<template>
  <section
    class="mx-auto w-full max-w-4xl px-6 py-8 text-[#0e2f5d] dark:text-[#f4f4f5]"
  >
    <h2 class="text-2xl font-semibold tracking-tight">
      {{ t("settings.title") }}
    </h2>

    <p class="mt-4 text-sm leading-6 text-[#4b5563] dark:text-[#d1d5db]">
      {{ t("settings.intro") }}
    </p>

    <div class="mt-6 space-y-3">
      <div class="rounded-xl border border-default bg-default p-4">
        <p class="text-sm font-medium">
          {{ t("settings.voiceLanguage") }}
        </p>
        <p class="mt-2 text-sm text-[#4b5563] dark:text-[#d1d5db]">
          <USelect
            v-model="lang"
            :items="langs"
            value-key="value"
            label-key="label"
          />
        </p>
      </div>

      <div class="rounded-xl border border-default bg-default p-4 space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">{{
            t("settings.speechControls")
          }}</span>
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            @click="resetDefaults"
          >
            {{ t("settings.resetDefaults") }}
          </UButton>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium">
              {{ t("settings.pitch") }}
            </p>
            <span class="text-xs text-[#4b5563] dark:text-[#d1d5db]">{{
              pitch
            }}</span>
          </div>
          <p class="mt-2 text-xs text-[#4b5563] dark:text-[#d1d5db] mb-2">
            {{ t("settings.pitchHint") }}
          </p>
          <USlider
            v-model="pitchSlider"
            :min="0"
            :max="100"
            :step="10"
          />
        </div>

        <div>
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium">
              {{ t("settings.rate") }}
            </p>
            <span class="text-xs text-[#4b5563] dark:text-[#d1d5db]">{{
              rate
            }}</span>
          </div>
          <p class="mt-2 text-xs text-[#4b5563] dark:text-[#d1d5db] mb-2">
            {{ t("settings.rateHint") }}
          </p>
          <USlider
            v-model="rateSlider"
            :min="0"
            :max="100"
            :step="10"
          />
        </div>
      </div>

      <div class="rounded-xl border border-default bg-default p-4 space-y-4">
        <div>
          <p class="text-sm font-medium">
            {{ t("settings.testVoice") }}
          </p>
          <p class="mt-1 text-xs text-[#4b5563] dark:text-[#d1d5db] mb-3">
            {{ t("settings.testVoiceHint") }}
          </p>
          <VoiceCard
            :text="currentLangDemo.text"
            emoji="🗣️"
            tone-class="bg-pastel-blue"
            :delete-aria-label="t('voiceCard.deleteAria')"
            @select="speak(currentLangDemo.text)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
