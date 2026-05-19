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

type Category = {
  title: string
  count: number
}

type RequestStarter = {
  label: string
  phrase: string
}

const priorityButtonCount = 8

const selectedRequestStarter = ref<RequestStarter | null>(null)

const englishCategories: Category[] = [
  { title: 'Social / Conversational', count: 2 },
  { title: 'Basic Needs & Requests', count: 11 },
  { title: 'Feelings & Status', count: 6 },
  { title: 'Medical & Safety', count: 6 },
  { title: 'People & Places', count: 6 },
  { title: 'Everyday Activities', count: 6 },
  { title: 'Conversation Repair', count: 6 }
]

const spanishCategories: Category[] = [
  { title: 'Social / Conversación', count: 2 },
  { title: 'Necesidades básicas y pedidos', count: 11 },
  { title: 'Sentimientos y estado', count: 6 },
  { title: 'Médico y seguridad', count: 6 },
  { title: 'Personas y lugares', count: 6 },
  { title: 'Actividades diarias', count: 6 },
  { title: 'Reparar la conversación', count: 6 }
]

const englishCoreWords: Word[] = [
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
    text: 'Hello / Hi',
    emoji: '👋',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Goodbye',
    emoji: '👋',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Thank you',
    emoji: '🙏',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Please',
    emoji: '🤲',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Help me',
    emoji: '🆘',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'I don\'t know',
    emoji: '❓',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Wait / One moment',
    emoji: '✋',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'I understand',
    emoji: '✅',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'I want / I need',
    emoji: '🙋',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Water / Drink',
    emoji: '💧',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Food / Hungry',
    emoji: '🍽️',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Bathroom',
    emoji: '🚽',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'I\'m tired',
    emoji: '😴',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'I\'m cold',
    emoji: '🥶',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'I\'m hot',
    emoji: '🥵',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Medicine / Pain',
    emoji: '💊',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'I feel sick',
    emoji: '🤢',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'More',
    emoji: '➕',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Stop / Finished',
    emoji: '🛑',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'I\'m okay',
    emoji: '👌',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Happy',
    emoji: '😊',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Sad',
    emoji: '😢',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Frustrated / Upset',
    emoji: '😣',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Scared',
    emoji: '😨',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'I\'m in pain',
    emoji: '🤕',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Call 911',
    emoji: '🚨',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'I had a stroke',
    emoji: '🧠',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Call my family',
    emoji: '📞',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'I have aphasia',
    emoji: '🗣️',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Doctor / Hospital',
    emoji: '🏥',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'I take medication',
    emoji: '💊',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Home',
    emoji: '🏠',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'My husband / wife / partner',
    emoji: '💞',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'My family',
    emoji: '👪',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'My doctor',
    emoji: '🩺',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Work / Job',
    emoji: '💼',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Outside / Go out',
    emoji: '🌳',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Phone call',
    emoji: '📱',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'TV / Watch something',
    emoji: '📺',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Music',
    emoji: '🎵',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Eat / Restaurant',
    emoji: '🍽️',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Sleep / Rest',
    emoji: '🛌',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Walk / Exercise',
    emoji: '🚶',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Say it again / Repeat',
    emoji: '🔁',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Write it down',
    emoji: '✍️',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'I can\'t find the word',
    emoji: '💬',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Almost right / Not quite',
    emoji: '↔️',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Show me / Point to it',
    emoji: '👉',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Let me try again',
    emoji: '🔄',
    toneClass: 'bg-pastel-green'
  }
]

const spanishCoreWords: Word[] = [
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
    text: 'Hola',
    emoji: '👋',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Adiós',
    emoji: '👋',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Gracias',
    emoji: '🙏',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Por favor',
    emoji: '🤲',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Ayúdame',
    emoji: '🆘',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'No sé',
    emoji: '❓',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Espera / Un momento',
    emoji: '✋',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Entiendo',
    emoji: '✅',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Quiero / Necesito',
    emoji: '🙋',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Agua / Bebida',
    emoji: '💧',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Comida / Tengo hambre',
    emoji: '🍽️',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Baño',
    emoji: '🚽',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Estoy cansado',
    emoji: '😴',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Tengo frío',
    emoji: '🥶',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Tengo calor',
    emoji: '🥵',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Medicina / Dolor',
    emoji: '💊',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Me siento mal',
    emoji: '🤢',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Más',
    emoji: '➕',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Alto / Terminé',
    emoji: '🛑',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Estoy bien',
    emoji: '👌',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Feliz',
    emoji: '😊',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Triste',
    emoji: '😢',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Frustrado / Molesto',
    emoji: '😣',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Asustado',
    emoji: '😨',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Tengo dolor',
    emoji: '🤕',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Llama al 911',
    emoji: '🚨',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Tuve un derrame cerebral',
    emoji: '🧠',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Llama a mi familia',
    emoji: '📞',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Tengo afasia',
    emoji: '🗣️',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Doctor / Hospital',
    emoji: '🏥',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Tomo medicamento',
    emoji: '💊',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Casa',
    emoji: '🏠',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Mi esposo / esposa / pareja',
    emoji: '💞',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Mi familia',
    emoji: '👪',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Mi doctor',
    emoji: '🩺',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Trabajo',
    emoji: '💼',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Afuera / Salir',
    emoji: '🌳',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Llamada telefónica',
    emoji: '📱',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'TV / Ver algo',
    emoji: '📺',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Música',
    emoji: '🎵',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Comer / Restaurante',
    emoji: '🍽️',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Dormir / Descansar',
    emoji: '🛌',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Caminar / Ejercicio',
    emoji: '🚶',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Repítelo',
    emoji: '🔁',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Escríbelo',
    emoji: '✍️',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'No encuentro la palabra',
    emoji: '💬',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Casi correcto / No exactamente',
    emoji: '↔️',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Muéstrame / Señálalo',
    emoji: '👉',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Déjame intentarlo de nuevo',
    emoji: '🔄',
    toneClass: 'bg-pastel-green'
  }
]

const spanishWords = useLocalStorage<Word[]>(
  'words-es-core-v1',
  spanishCoreWords
)

const englishWords = useLocalStorage<Word[]>(
  'words-en-core-v1',
  englishCoreWords
)

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

const activeCategories = computed(() =>
  activeLocale.value === 'en' ? englishCategories : spanishCategories
)

const requestStarters = computed<RequestStarter[]>(() =>
  activeLocale.value === 'en'
    ? [
        { label: 'I want', phrase: 'I want' },
        { label: 'I need', phrase: 'I need' },
        { label: 'I am', phrase: 'I am' },
        { label: 'I feel', phrase: 'I feel' }
      ]
    : [
        { label: 'Quiero', phrase: 'Quiero' },
        { label: 'Necesito', phrase: 'Necesito' },
        { label: 'Estoy', phrase: 'Estoy' },
        { label: 'Me siento', phrase: 'Me siento' }
      ]
)

const priorityWords = computed(() =>
  activeWords.value.slice(0, priorityButtonCount)
)

const groupedWords = computed(() => {
  let start = priorityButtonCount
  const groups = activeCategories.value.map((category) => {
    const words = activeWords.value.slice(start, start + category.count)
    start += category.count
    return {
      title: category.title,
      words
    }
  })

  const customWords = activeWords.value.slice(start)
  if (customWords.length) {
    groups.push({
      title: activeLocale.value === 'en' ? 'Custom' : 'Personalizadas',
      words: customWords
    })
  }

  return groups
})

const requestPreview = computed(() =>
  selectedRequestStarter.value
    ? `${selectedRequestStarter.value.phrase}...`
    : activeLocale.value === 'en'
      ? 'Choose a starter'
      : 'Elige un inicio'
)

const requestHelperText = computed(() =>
  selectedRequestStarter.value
    ? activeLocale.value === 'en'
      ? 'Now tap another button to speak the phrase.'
      : 'Ahora toca otro botón para decir la frase.'
    : activeLocale.value === 'en'
      ? 'Tap one button here, then tap any word card.'
      : 'Toca un botón aquí, luego toca una tarjeta.'
)

const normalizeRequestObject = (text: string) => {
  const [firstOption = text] = text.split('/')
  const trimmed = firstOption.trim()
  if (!trimmed) {
    return ''
  }

  return trimmed.charAt(0).toLocaleLowerCase() + trimmed.slice(1)
}

const getRequestPhrase = (starter: RequestStarter, text: string) =>
  `${starter.phrase} ${normalizeRequestObject(text)}`.trim()

const onRequestStarterSelect = (starter: RequestStarter) => {
  selectedRequestStarter.value = starter
}

const onRequestClear = () => {
  selectedRequestStarter.value = null
}

const onCardSelect = (text: string) => {
  const starter = selectedRequestStarter.value
  if (!starter) {
    speak(text)
    return
  }

  speak(getRequestPhrase(starter, text))
  selectedRequestStarter.value = null
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
      <template v-if="isStorageReady">
        <section
          class="mb-8 rounded-2xl border-2 border-[#d8e3d3] bg-white/70 p-4 shadow-ambient dark:border-[#2f4638] dark:bg-[#1a1c20]"
        >
          <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="font-brand-heading text-xl font-semibold uppercase tracking-[0.08em] text-[#083d7a] dark:text-[#8ecae6]">
                Request
              </p>
              <p class="mt-1 text-lg font-semibold text-[#0e2f5d] dark:text-[#f4f4f5]">
                {{ requestPreview }}
              </p>
              <p class="text-sm text-[#48617d] dark:text-[#b8c2cc]">
                {{ requestHelperText }}
              </p>
            </div>

            <button
              v-if="selectedRequestStarter"
              type="button"
              class="self-start rounded-full border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-semibold text-[#083d7a] transition hover:bg-[#f3f7fb] dark:border-[#3f4450] dark:bg-[#22242b] dark:text-[#8ecae6] dark:hover:bg-[#2b2f39]"
              @click="onRequestClear"
            >
              Clear
            </button>
          </div>

          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              v-for="starter in requestStarters"
              :key="starter.phrase"
              type="button"
              class="min-h-[86px] rounded-2xl border-2 p-3 text-center text-xl font-bold text-[#083d7a] shadow-sm transition active:scale-95 dark:text-[#F0F0F0]"
              :class="selectedRequestStarter?.phrase === starter.phrase
                ? 'border-[#083d7a] bg-pastel-green ring-2 ring-[#083d7a]/20 dark:border-[#8ecae6] dark:ring-[#8ecae6]/30'
                : 'border-transparent bg-pastel-blue hover:brightness-95'"
              @click="onRequestStarterSelect(starter)"
            >
              {{ starter.label }}
            </button>
          </div>
        </section>

        <section class="mb-8">
          <div
            class="grid grid-cols-2 gap-stack-gap w-full gap-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
          >
            <VoiceCard
              v-for="card in priorityWords"
              :key="card.text"
              :text="card.text"
              :emoji="card.emoji"
              :tone-class="card.toneClass"
              :delete-aria-label="t('voiceCard.deleteAria')"
              @select="onCardSelect"
              @delete="onCardDelete(activeWords.indexOf(card))"
            />
          </div>
        </section>

        <section
          v-for="group in groupedWords"
          :key="group.title"
          class="mb-8"
        >
          <h2
            class="mb-3 font-brand-heading text-xl font-semibold uppercase tracking-[0.08em] text-[#083d7a] dark:text-[#8ecae6]"
          >
            {{ group.title }}
          </h2>

          <div
            class="grid grid-cols-2 gap-stack-gap w-full gap-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
          >
            <VoiceCard
              v-for="card in group.words"
              :key="card.text"
              :text="card.text"
              :emoji="card.emoji"
              :tone-class="card.toneClass"
              :delete-aria-label="t('voiceCard.deleteAria')"
              @select="onCardSelect"
              @delete="onCardDelete(activeWords.indexOf(card))"
            />
          </div>
        </section>

        <div
          class="grid grid-cols-2 gap-stack-gap w-full gap-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
        >
          <AddCard
            :title="t('index.addCardTitle')"
            has-emoji
            is-word
            @adding="onAdding"
          />
        </div>
      </template>

      <template v-else>
        <div
          class="grid grid-cols-2 gap-stack-gap w-full gap-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
        >
          <VoiceCardSkeleton
            v-for="index in 6"
            :key="index"
          />
        </div>
      </template>
    </main>
  </div>
</template>
