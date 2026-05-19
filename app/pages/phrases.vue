<script setup lang="ts">
import type { AddNewItem } from '~/typos'

const { t, locale } = useI18n()

useSeoMeta({
  title: () => t('phrases.seoTitle'),
  description: () => t('phrases.seoDescription')
})

const speechLang = useLocalStorage<string>('speech-lang', 'en-US')
const pitch = useLocalStorage<number>('speech-pitch', 1)
const rate = useLocalStorage<number>('speech-rate', 1)
const { speak } = useAacSpeech(speechLang, pitch, rate)
const isStorageReady = ref(false)
const editingIndex = ref<number | null>(null)
const editingText = ref('')
const editingToneClass = ref('bg-pastel-blue')
const editingError = ref('')

type AppLocale = 'en' | 'es'

type Phrase = {
  text: string
  toneClass: string
}

const toneOptions = computed(
  () =>
    [
      {
        label: t('addCard.colors.blue'),
        value: 'bg-pastel-blue'
      },
      {
        label: t('addCard.colors.pink'),
        value: 'bg-pastel-pink'
      },
      {
        label: t('addCard.colors.green'),
        value: 'bg-pastel-green'
      },
      {
        label: t('addCard.colors.purple'),
        value: 'bg-pastel-purple'
      },
      {
        label: t('addCard.colors.yellow'),
        value: 'bg-pastel-yellow'
      }
    ] as const
)

const spanishPhrases = useLocalStorage<Phrase[]>('phrases-es', [
  {
    text: 'Tengo frío',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Tengo calor',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Me duele aquí',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Quiero hablar con mi familia',
    toneClass: 'bg-pastel-blue'
  }
])

const englishPhrases = useLocalStorage<Phrase[]>('phrases-en', [
  {
    text: 'I am cold',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'I am hot',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'It hurts here',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'I want to talk to my family',
    toneClass: 'bg-pastel-blue'
  }
])

const activeLocale = computed<AppLocale>(() =>
  locale.value === 'en' ? 'en' : 'es'
)

const activePhrases = computed({
  get: () =>
    activeLocale.value === 'en' ? englishPhrases.value : spanishPhrases.value,
  set: (value: Phrase[]) => {
    if (activeLocale.value === 'en') {
      englishPhrases.value = value
      return
    }

    spanishPhrases.value = value
  }
})

const onCardSelect = (text: string) => {
  speak(text)
}

const onCardDelete = (index: number) => {
  activePhrases.value = activePhrases.value.filter(
    (_, cardIndex) => cardIndex !== index
  )
}

const onCardEdit = (index: number) => {
  const phrase = activePhrases.value[index]
  if (!phrase) {
    return
  }

  editingIndex.value = index
  editingText.value = phrase.text
  editingToneClass.value = phrase.toneClass
  editingError.value = ''
}

const onEditClose = () => {
  editingIndex.value = null
  editingText.value = ''
  editingToneClass.value = 'bg-pastel-blue'
  editingError.value = ''
}

const onEditSave = () => {
  const phraseIndex = editingIndex.value
  const normalizedText = editingText.value.trim().normalize('NFC')

  if (phraseIndex === null) {
    return
  }

  if (normalizedText === '') {
    editingError.value = t('addCard.errors.empty')
    return
  }

  activePhrases.value = activePhrases.value.map((phrase, index) =>
    index === phraseIndex
      ? {
          text: normalizedText,
          toneClass: editingToneClass.value
        }
      : phrase
  )
  onEditClose()
}

const onAdding = (item: string) => {
  const newItem: Omit<AddNewItem, 'emoji'> = JSON.parse(item)
  activePhrases.value = [
    ...activePhrases.value,
    {
      text: newItem.text,
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
            v-for="(card, index) in activePhrases"
            :key="`${card.text}-${index}`"
            :text="card.text"
            :tone-class="card.toneClass"
            editable
            :delete-aria-label="t('voiceCard.deleteAria')"
            :edit-aria-label="t('voiceCard.editAria')"
            @select="onCardSelect"
            @edit="onCardEdit(index)"
            @delete="onCardDelete(index)"
          />

          <AddCard
            :title="t('phrases.addCardTitle')"
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

    <UModal
      :open="editingIndex !== null"
      :title="t('phrases.editCardTitle')"
      @update:open="(value) => !value && onEditClose()"
    >
      <template #body>
        <div class="flex flex-col gap-4 pt-1">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#374151] dark:text-[#d1d5db]">
              {{ t("addCard.textLabel") }}
            </label>
            <UInput
              v-model.trim="editingText"
              color="neutral"
              highlight
              size="lg"
              :placeholder="t('addCard.placeholderText')"
              :ui="{ base: 'w-full' }"
              @input="editingError = ''"
              @keydown.enter="onEditSave"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-[#374151] dark:text-[#d1d5db]">
              {{ t("addCard.colorLabel") }}
            </label>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="tone in toneOptions"
                :key="tone.value"
                class="inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm cursor-pointer transition-colors"
                :class="
                  editingToneClass === tone.value
                    ? 'border-[#94A3B8] dark:border-[#6b7280] bg-[#f8fafc] dark:bg-[#1e2028]'
                    : 'border-[#e2e8f0] dark:border-[#2d3748] hover:border-[#cbd5e1] dark:hover:border-[#4b5563]'
                "
              >
                <input
                  v-model="editingToneClass"
                  type="radio"
                  name="phrase-card-tone"
                  class="sr-only"
                  :value="tone.value"
                >
                <span
                  class="w-4 h-4 rounded-full border border-black/10 dark:border-white/10"
                  :class="tone.value"
                />
                <span class="text-[#374151] dark:text-[#d1d5db]">
                  {{ tone.label }}
                </span>
              </label>
            </div>
          </div>

          <Transition name="fade-slide">
            <UAlert
              v-if="editingError"
              color="error"
              variant="soft"
              :description="editingError"
              icon="i-lucide-circle-alert"
            />
          </Transition>

          <div class="flex gap-2 pt-1">
            <UButton
              variant="ghost"
              color="neutral"
              class="flex-1 justify-center"
              @click="onEditClose"
            >
              {{ t("addCard.cancel") }}
            </UButton>
            <UButton
              class="flex-1 justify-center"
              @click="onEditSave"
            >
              {{ t("phrases.saveCardButton") }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
