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
