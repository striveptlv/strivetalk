<script setup lang="ts">
import type { AddNewItem } from '~/typos'

const { t, locale } = useI18n()

useSeoMeta({
  title: () => t('index.seoTitle'),
  description: () => t('index.seoDescription')
})

const userLang = useLocalStorage<string>('speech-lang', 'en-US')
const pitch = useLocalStorage<number>('speech-pitch', 1)
const rate = useLocalStorage<number>('speech-rate', 1)
const { speak } = useAacSpeech(userLang, pitch, rate)
const isStorageReady = ref(false)

type AppLocale = 'en' | 'es'

type Word = {
  text: string
  emoji: string
  toneClass: string
}

const spanishWords = useLocalStorage<Word[]>('words-es', [
  {
    text: 'Sí',
    emoji: '👍',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'No',
    emoji: '👎',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Agua',
    emoji: '💧',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Comida',
    emoji: '🍽️',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Baño',
    emoji: '🚽',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Me duele',
    emoji: '🤕',
    toneClass: 'bg-pastel-yellow'
  }
])

const englishWords = useLocalStorage<Word[]>('words-en', [
  {
    text: 'Yes',
    emoji: '👍',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'No',
    emoji: '👎',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Water',
    emoji: '💧',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Food',
    emoji: '🍽️',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Bathroom',
    emoji: '🚽',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'It hurts',
    emoji: '🤕',
    toneClass: 'bg-pastel-yellow'
  }
])

const activeLocale = computed<AppLocale>(() =>
  locale.value === 'en' ? 'en' : 'es'
)

const activeWords = computed({
  get: () =>
    activeLocale.value === 'en' ? englishWords.value : spanishWords.value,
  set: (value: Word[]) => {
    if (activeLocale.value === 'en') {
      englishWords.value = value
      return
    }

    spanishWords.value = value
  }
})

const onCardSelect = (text: string) => {
  speak(text)
}

const onCardDelete = (index: number) => {
  activeWords.value = activeWords.value.filter(
    (_, cardIndex) => cardIndex !== index
  )
}

const onAdding = (item: string) => {
  const newItem: AddNewItem = JSON.parse(item)
  activeWords.value = [
    ...activeWords.value,
    {
      text: newItem.text,
      emoji: newItem.emoji ?? '',
      toneClass: newItem.toneClass ?? 'bg-pastel-blue'
    }
  ]
}

onMounted(() => {
  isStorageReady.value = true
})
</script>

<template>
  <div
    class="min-h-screen bg-[#f7f4ef] text-[#0e2f5d] dark:bg-[#111113] dark:text-[#f4f4f5]"
  >
    <main class="mx-auto w-full max-w-7xl px-6 py-8 pb-32">
      <div
        class="grid gap-stack-gap w-full gap-2"
        style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))"
      >
        <template v-if="isStorageReady">
          <VoiceCard
            v-for="(card, index) in activeWords"
            :key="`${card.text}-${index}`"
            :text="card.text"
            :emoji="card.emoji"
            :tone-class="card.toneClass"
            :delete-aria-label="t('voiceCard.deleteAria')"
            @select="onCardSelect"
            @delete="onCardDelete(index)"
          />

          <AddCard
            :title="t('index.addCardTitle')"
            has-emoji
            is-word
            @adding="onAdding"
          />
        </template>

        <template v-else>
          <VoiceCardSkeleton
            v-for="index in 6"
            :key="index"
          />
        </template>
      </div>
    </main>
  </div>
</template>
