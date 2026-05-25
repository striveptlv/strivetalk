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
const { isDeleteMode } = useDeleteMode()
const isStorageReady = ref(false)

type AppLocale = 'en' | 'es'

type Word = {
  text: string
  emoji: string
  toneClass: string
  hidden?: boolean
}

type Category = {
  title: string
  count: number
}

type PhraseStarter = Word & {
  phrase: string
  suffix?: string
}

const priorityButtonCount = 2

const selectedPhraseStarter = ref<PhraseStarter | null>(null)

const englishCategories: Category[] = [
  { title: 'Social / Conversational', count: 8 },
  { title: 'Basic Needs & Requests', count: 10 },
  { title: 'Feelings & Status', count: 6 },
  { title: 'Medical & Safety', count: 6 },
  { title: 'People & Places', count: 6 },
  { title: 'Everyday Activities', count: 6 },
  { title: 'Conversation Repair', count: 6 }
]

const spanishCategories: Category[] = [
  { title: 'Social / Conversación', count: 8 },
  { title: 'Necesidades básicas y pedidos', count: 10 },
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
    toneClass: 'bg-traffic-green'
  },
  {
    text: 'No',
    emoji: '👎',
    toneClass: 'bg-traffic-red'
  },
  {
    text: 'Hello',
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
    text: 'Wait',
    emoji: '✋',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'I understand',
    emoji: '✅',
    toneClass: 'bg-pastel-green'
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
    text: 'Medicine',
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
    text: 'Stop',
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
    text: 'Frustrated',
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
    text: 'Doctor',
    emoji: '🏥',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Pain',
    emoji: '💊',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Home',
    emoji: '🏠',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'My partner',
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
    text: 'Work',
    emoji: '💼',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Outside',
    emoji: '🌳',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Phone call',
    emoji: '📱',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'TV',
    emoji: '📺',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Music',
    emoji: '🎵',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Eat',
    emoji: '🍽️',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Sleep',
    emoji: '🛌',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Walk',
    emoji: '🚶',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Repeat',
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
    text: 'Almost right',
    emoji: '↔️',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Show me',
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
    toneClass: 'bg-traffic-green'
  },
  {
    text: 'No',
    emoji: '👎',
    toneClass: 'bg-traffic-red'
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
    text: 'Espera',
    emoji: '✋',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Entiendo',
    emoji: '✅',
    toneClass: 'bg-pastel-green'
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
    text: 'Medicina',
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
    text: 'Alto',
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
    text: 'Frustrado',
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
    text: 'Doctor',
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
    text: 'Mi pareja',
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
    text: 'Afuera',
    emoji: '🌳',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Llamada telefónica',
    emoji: '📱',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'TV',
    emoji: '📺',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Música',
    emoji: '🎵',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Comer',
    emoji: '🍽️',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Dormir',
    emoji: '🛌',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Caminar',
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
    text: 'Casi correcto',
    emoji: '↔️',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Muéstrame',
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

const deprecatedDefaultCards = new Set(['I want / I need', 'Quiero / Necesito'])

const defaultCardTextReplacements = new Map([
  ['Hello / Hi', 'Hello'],
  ['Wait / One moment', 'Wait'],
  ['Water / Drink', 'Water'],
  ['Food / Hungry', 'Food'],
  ['Medicine / Pain', 'Medicine'],
  ['I take medication', 'Pain'],
  ['Stop / Finished', 'Stop'],
  ['Frustrated / Upset', 'Frustrated'],
  ['Doctor / Hospital', 'Doctor'],
  ['My husband / wife / partner', 'My partner'],
  ['Work / Job', 'Work'],
  ['Outside / Go out', 'Outside'],
  ['TV / Watch something', 'TV'],
  ['Eat / Restaurant', 'Eat'],
  ['Sleep / Rest', 'Sleep'],
  ['Walk / Exercise', 'Walk'],
  ['Say it again / Repeat', 'Repeat'],
  ['Almost right / Not quite', 'Almost right'],
  ['Show me / Point to it', 'Show me'],
  ['Espera / Un momento', 'Espera'],
  ['Agua / Bebida', 'Agua'],
  ['Comida / Tengo hambre', 'Comida'],
  ['Medicina / Dolor', 'Medicina'],
  ['Alto / Terminé', 'Alto'],
  ['Frustrado / Molesto', 'Frustrado'],
  ['Mi esposo / esposa / pareja', 'Mi pareja'],
  ['Afuera / Salir', 'Afuera'],
  ['TV / Ver algo', 'TV'],
  ['Comer / Restaurante', 'Comer'],
  ['Dormir / Descansar', 'Dormir'],
  ['Caminar / Ejercicio', 'Caminar'],
  ['Casi correcto / No exactamente', 'Casi correcto'],
  ['Muéstrame / Señálalo', 'Muéstrame']
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

const activeCategories = computed(() =>
  activeLocale.value === 'en' ? englishCategories : spanishCategories
)

const requestStarters = computed<PhraseStarter[]>(() =>
  activeLocale.value === 'en'
    ? [
        {
          text: 'I want',
          phrase: 'I want',
          emoji: '🙋',
          toneClass: 'bg-pastel-green'
        },
        {
          text: 'I need',
          phrase: 'I need',
          emoji: '💬',
          toneClass: 'bg-pastel-yellow'
        },
        {
          text: 'I am',
          phrase: 'I am',
          emoji: '🙂',
          toneClass: 'bg-pastel-blue'
        },
        {
          text: 'I feel',
          phrase: 'I feel',
          emoji: '💭',
          toneClass: 'bg-pastel-purple'
        }
      ]
    : [
        {
          text: 'Quiero',
          phrase: 'Quiero',
          emoji: '🙋',
          toneClass: 'bg-pastel-green'
        },
        {
          text: 'Necesito',
          phrase: 'Necesito',
          emoji: '💬',
          toneClass: 'bg-pastel-yellow'
        },
        {
          text: 'Estoy',
          phrase: 'Estoy',
          emoji: '🙂',
          toneClass: 'bg-pastel-blue'
        },
        {
          text: 'Me siento',
          phrase: 'Me siento',
          emoji: '💭',
          toneClass: 'bg-pastel-purple'
        }
      ]
)

const questionStarters = computed<PhraseStarter[]>(() =>
  activeLocale.value === 'en'
    ? [
        {
          text: 'What',
          phrase: 'What',
          suffix: '?',
          emoji: '❓',
          toneClass: 'bg-pastel-purple'
        },
        {
          text: 'Where',
          phrase: 'Where',
          suffix: '?',
          emoji: '📍',
          toneClass: 'bg-pastel-blue'
        },
        {
          text: 'Why',
          phrase: 'Why',
          suffix: '?',
          emoji: '🤔',
          toneClass: 'bg-pastel-yellow'
        },
        {
          text: 'Who',
          phrase: 'Who',
          suffix: '?',
          emoji: '👤',
          toneClass: 'bg-pastel-green'
        },
        {
          text: 'When',
          phrase: 'When',
          suffix: '?',
          emoji: '🕒',
          toneClass: 'bg-pastel-blue'
        }
      ]
    : [
        {
          text: 'Qué',
          phrase: 'Qué',
          suffix: '?',
          emoji: '❓',
          toneClass: 'bg-pastel-purple'
        },
        {
          text: 'Dónde',
          phrase: 'Dónde',
          suffix: '?',
          emoji: '📍',
          toneClass: 'bg-pastel-blue'
        },
        {
          text: 'Por qué',
          phrase: 'Por qué',
          suffix: '?',
          emoji: '🤔',
          toneClass: 'bg-pastel-yellow'
        },
        {
          text: 'Quién',
          phrase: 'Quién',
          suffix: '?',
          emoji: '👤',
          toneClass: 'bg-pastel-green'
        },
        {
          text: 'Cuándo',
          phrase: 'Cuándo',
          suffix: '?',
          emoji: '🕒',
          toneClass: 'bg-pastel-blue'
        }
      ]
)

const questionEnder = computed<Word>(() => ({
  text: '?',
  emoji: '❔',
  toneClass: 'bg-pastel-pink'
}))

const shouldShowCard = (card: Word) => isDeleteMode.value || !card.hidden

const priorityWords = computed(() =>
  activeWords.value.slice(0, priorityButtonCount).filter(shouldShowCard)
)

const groupedWords = computed(() => {
  let start = priorityButtonCount
  const groups = activeCategories.value.map((category) => {
    const words = activeWords.value
      .slice(start, start + category.count)
      .filter(shouldShowCard)
    start += category.count
    return {
      title: category.title,
      words
    }
  })

  const customWords = activeWords.value
    .slice(start)
    .filter(shouldShowCard)
  if (customWords.length) {
    groups.push({
      title: activeLocale.value === 'en' ? 'Custom' : 'Personalizadas',
      words: customWords
    })
  }

  return groups
})

const socialGroup = computed(() => groupedWords.value[0])

const remainingGroups = computed(() =>
  groupedWords.value.slice(1).filter(group => group.words.length > 0)
)

const requestPreview = computed(() =>
  selectedPhraseStarter.value
    ? selectedPhraseStarter.value.suffix
      ? `${selectedPhraseStarter.value.phrase}...${selectedPhraseStarter.value.suffix}`
      : `${selectedPhraseStarter.value.phrase}...`
    : activeLocale.value === 'en'
      ? 'Choose a starter'
      : 'Elige un inicio'
)

const requestHelperText = computed(() =>
  selectedPhraseStarter.value
    ? activeLocale.value === 'en'
      ? 'Now tap another button to speak the phrase.'
      : 'Ahora toca otro botón para decir la frase.'
    : activeLocale.value === 'en'
      ? 'Tap one button here, then tap any word card.'
      : 'Toca un botón aquí, luego toca una tarjeta.'
)

const stickyStarterText = computed(() =>
  selectedPhraseStarter.value
    ? selectedPhraseStarter.value.suffix
      ? `${selectedPhraseStarter.value.phrase} ... ${selectedPhraseStarter.value.suffix}`
      : `${selectedPhraseStarter.value.phrase} ...`
    : ''
)

const stickyStarterLabel = computed(() =>
  activeLocale.value === 'en' ? 'Selected' : 'Seleccionado'
)

const normalizeRequestObject = (text: string) => {
  const [firstOption = text] = text.split('/')
  const trimmed = firstOption.trim()
  if (!trimmed) {
    return ''
  }

  return trimmed.charAt(0).toLocaleLowerCase() + trimmed.slice(1)
}

const getPhrase = (starter: PhraseStarter, text: string) => {
  const phrase = `${starter.phrase} ${normalizeRequestObject(text)}`.trim()
  return starter.suffix ? `${phrase}${starter.suffix}` : phrase
}

const getStarterToneClass = (starter: PhraseStarter) =>
  selectedPhraseStarter.value?.phrase === starter.phrase
    ? `${starter.toneClass} border-[#083d7a] ring-2 ring-[#083d7a]/20 dark:border-[#8ecae6] dark:ring-[#8ecae6]/30`
    : starter.toneClass

const getPriorityToneClass = (card: Word, index: number) => {
  if (index === 0) {
    return 'bg-traffic-green'
  }

  if (index === 1) {
    return 'bg-traffic-red'
  }

  return card.toneClass
}

const onStarterSelect = (starter: PhraseStarter) => {
  selectedPhraseStarter.value = starter
}

const onStarterClear = () => {
  selectedPhraseStarter.value = null
}

const onQuestionEnderSelect = () => {
  const starter = selectedPhraseStarter.value
  if (!starter) {
    speak(questionEnder.value.text)
    return
  }

  speak(`${starter.phrase}${starter.suffix ?? ''}`)
  selectedPhraseStarter.value = null
}

const onCardSelect = (text: string) => {
  const starter = selectedPhraseStarter.value
  if (!starter) {
    speak(text)
    return
  }

  speak(getPhrase(starter, text))
  selectedPhraseStarter.value = null
}

const getCardVisibilityAria = (card: Word) =>
  card.hidden ? t('voiceCard.showAria') : t('voiceCard.hideAria')

const onCardDelete = (index: number) => {
  if (index < priorityButtonCount) {
    return
  }

  activeWords.value = activeWords.value.map((card, cardIndex) =>
    cardIndex === index
      ? {
          ...card,
          hidden: !card.hidden
        }
      : card
  )
}

const onAdding = (item: string) => {
  const newItem: AddNewItem = JSON.parse(item)
  activeWords.value = [
    ...activeWords.value,
    {
      text: newItem.text,
      emoji: newItem.emoji ?? '',
      toneClass: newItem.toneClass ?? 'bg-pastel-blue',
      hidden: false
    }
  ]
}

const removeDeprecatedDefaultCards = () => {
  englishWords.value = englishWords.value.filter(
    card => !deprecatedDefaultCards.has(card.text)
  )
  spanishWords.value = spanishWords.value.filter(
    card => !deprecatedDefaultCards.has(card.text)
  )

  englishWords.value = englishWords.value.map((card, index) =>
    index < priorityButtonCount
      ? {
          ...card,
          text: defaultCardTextReplacements.get(card.text) ?? card.text,
          hidden: false
        }
      : {
          ...card,
          text: defaultCardTextReplacements.get(card.text) ?? card.text
        }
  )
  spanishWords.value = spanishWords.value.map((card, index) =>
    index < priorityButtonCount
      ? {
          ...card,
          text: defaultCardTextReplacements.get(card.text) ?? card.text,
          hidden: false
        }
      : {
          ...card,
          text: defaultCardTextReplacements.get(card.text) ?? card.text
        }
  )
}

onMounted(() => {
  removeDeprecatedDefaultCards()
  isStorageReady.value = true
})
</script>

<template>
  <div
    class="min-h-screen bg-[#fffaf2] text-[#0e2f5d] dark:bg-[#111113] dark:text-[#f4f4f5]"
  >
    <main class="mx-auto w-full max-w-7xl px-6 py-8 pb-32">
      <template v-if="isStorageReady">
        <section class="mb-8">
          <div
            class="grid grid-cols-2 gap-stack-gap w-full gap-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
          >
            <VoiceCard
              v-for="(card, index) in priorityWords"
              :key="card.text"
              :text="card.text"
              :emoji="card.emoji"
              :tone-class="getPriorityToneClass(card, index)"
              :hidden="card.hidden"
              :show-delete="false"
              @select="onCardSelect"
            />
          </div>
        </section>

        <section
          v-if="socialGroup"
          class="mb-8"
        >
          <h2
            class="mb-3 font-brand-heading text-xl font-semibold uppercase tracking-[0.08em] text-[#083d7a] dark:text-[#8ecae6]"
          >
            {{ socialGroup.title }}
          </h2>

          <div
            class="grid grid-cols-2 gap-stack-gap w-full gap-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
          >
            <VoiceCard
              v-for="card in socialGroup.words"
              :key="card.text"
              :text="card.text"
              :emoji="card.emoji"
              :tone-class="card.toneClass"
              :hidden="card.hidden"
              :delete-aria-label="getCardVisibilityAria(card)"
              @select="onCardSelect"
              @delete="onCardDelete(activeWords.indexOf(card))"
            />
          </div>
        </section>

        <div
          v-if="selectedPhraseStarter"
          class="sticky top-3 z-40 mb-6 flex items-center justify-between gap-3 rounded-2xl border-2 border-[#083d7a] bg-[#fff2bd] px-4 py-3 shadow-ambient dark:border-[#8ecae6] dark:bg-[#1f2937]"
        >
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.08em] text-[#48617d] dark:text-[#b8c2cc]">
              {{ stickyStarterLabel }}
            </p>
            <p class="flex items-center gap-2 text-2xl font-bold leading-tight text-[#083d7a] dark:text-[#f4f4f5]">
              <span
                aria-hidden="true"
                class="text-2xl"
              >
                {{ selectedPhraseStarter.emoji }}
              </span>
              <span>{{ stickyStarterText }}</span>
            </p>
          </div>

          <button
            type="button"
            class="rounded-full border border-[#083d7a]/30 bg-white px-4 py-2 text-base font-semibold text-[#083d7a] transition hover:bg-[#f3f7fb] dark:border-[#8ecae6]/40 dark:bg-[#22242b] dark:text-[#8ecae6]"
            @click="onStarterClear"
          >
            Clear
          </button>
        </div>

        <section class="mb-8">
          <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="font-brand-heading text-xl font-semibold uppercase tracking-[0.08em] text-[#083d7a] dark:text-[#8ecae6]">
                Requests
              </p>
              <p class="mt-1 text-lg font-semibold text-[#0e2f5d] dark:text-[#f4f4f5]">
                {{ requestPreview }}
              </p>
              <p class="text-sm text-[#48617d] dark:text-[#b8c2cc]">
                {{ requestHelperText }}
              </p>
            </div>

            <button
              v-if="selectedPhraseStarter"
              type="button"
              class="self-start rounded-full border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-semibold text-[#083d7a] transition hover:bg-[#f3f7fb] dark:border-[#3f4450] dark:bg-[#22242b] dark:text-[#8ecae6] dark:hover:bg-[#2b2f39]"
              @click="onStarterClear"
            >
              Clear
            </button>
          </div>

          <div
            class="grid grid-cols-2 gap-stack-gap w-full gap-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
          >
            <VoiceCard
              v-for="starter in requestStarters"
              :key="starter.phrase"
              :text="starter.text"
              :emoji="starter.emoji"
              :tone-class="getStarterToneClass(starter)"
              :show-delete="false"
              @select="onStarterSelect(starter)"
            />
          </div>
        </section>

        <section class="mb-8">
          <h2
            class="mb-3 font-brand-heading text-xl font-semibold uppercase tracking-[0.08em] text-[#083d7a] dark:text-[#8ecae6]"
          >
            Questions
          </h2>

          <div
            class="grid grid-cols-2 gap-stack-gap w-full gap-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
          >
            <VoiceCard
              v-for="starter in questionStarters"
              :key="starter.phrase"
              :text="starter.text"
              :emoji="starter.emoji"
              :tone-class="getStarterToneClass(starter)"
              :show-delete="false"
              @select="onStarterSelect(starter)"
            />

            <VoiceCard
              :text="questionEnder.text"
              :emoji="questionEnder.emoji"
              :tone-class="questionEnder.toneClass"
              :show-delete="false"
              @select="onQuestionEnderSelect"
            />
          </div>
        </section>

        <section
          v-for="group in remainingGroups"
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
              :hidden="card.hidden"
              :delete-aria-label="getCardVisibilityAria(card)"
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
