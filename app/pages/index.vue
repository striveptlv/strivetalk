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
const voiceGender = useLocalStorage<'auto' | 'female' | 'male'>('speech-voice-gender', 'auto')
const { speak } = useAacSpeech(userLang, pitch, rate, voiceGender)
const { isDeleteMode } = useDeleteMode()
const isStorageReady = ref(false)

type AppLocale = 'en' | 'es'

type Word = {
  text: string
  speakText?: string
  emoji: string
  toneClass: string
  hidden?: boolean
  grammar?: {
    kind: 'noun' | 'verb' | 'adjective' | 'place' | 'person' | 'fullPhrase'
    article?: 'a' | 'an' | 'the' | 'my' | 'some' | 'none'
    requestObject?: string
    questionObject?: string
  }
}

type Category = {
  title: string
  count: number
}

type PhraseStarter = Word & {
  phrase: string
  suffix?: string
}

type PainScaleOption = {
  label: string
  description: string
  phrase: string
}

const priorityButtonCount = 2

const selectedPhraseStarter = ref<PhraseStarter | null>(null)
const isPainScaleOpen = ref(false)

const englishCategories: Category[] = [
  { title: 'Social & Conversation Control', count: 11 },
  { title: 'Basic Needs', count: 7 },
  { title: 'Feelings & Physical State', count: 10 },
  { title: 'Medical & Safety', count: 6 },
  { title: 'People & Places', count: 8 },
  { title: 'Everyday Activities', count: 7 },
  { title: 'Conversation Repair', count: 10 }
]

const spanishCategories: Category[] = [
  { title: 'Social y control de conversación', count: 11 },
  { title: 'Necesidades básicas', count: 7 },
  { title: 'Sentimientos y estado físico', count: 10 },
  { title: 'Médico y seguridad', count: 6 },
  { title: 'Personas y lugares', count: 8 },
  { title: 'Actividades diarias', count: 7 },
  { title: 'Reparar la conversación', count: 10 }
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
    emoji: '✋',
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
    text: 'I need more time',
    emoji: '⏳',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'I\'m listening',
    emoji: '👂',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'I can do it',
    emoji: '💪',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Water',
    emoji: '💧',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Food',
    emoji: '🍎',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Bathroom',
    emoji: '🚽',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Medicine',
    emoji: '💊',
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
    text: 'Blanket',
    emoji: '🛏️',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'tired',
    emoji: '😴',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'cold',
    emoji: '🥶',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'hot',
    emoji: '🥵',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'sick',
    emoji: '🤢',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'okay',
    emoji: '👌',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'happy',
    emoji: '😊',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'sad',
    emoji: '😢',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'frustrated',
    emoji: '😣',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'scared',
    emoji: '😨',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'in pain',
    emoji: '🩹',
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
    text: 'Nurse',
    emoji: '👩‍⚕️',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'That hurts',
    emoji: '😖',
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
    text: 'Hospital',
    emoji: '🏥',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Physical therapy',
    emoji: '🏋️',
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
    text: 'to eat',
    emoji: '🍽️',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'to sleep',
    emoji: '🛌',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'to walk',
    emoji: '🚶',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'to exercise',
    emoji: '🏋️',
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
  },
  {
    text: 'I don\'t understand',
    emoji: '🤷',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Slow down',
    emoji: '🐢',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'That\'s not right',
    emoji: '❌',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Exactly right',
    emoji: '🎯',
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
    emoji: '✋',
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
    text: 'Necesito más tiempo',
    emoji: '⏳',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Estoy escuchando',
    emoji: '👂',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Puedo hacerlo',
    emoji: '💪',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Agua',
    emoji: '💧',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Comida',
    emoji: '🍎',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Baño',
    emoji: '🚽',
    toneClass: 'bg-pastel-purple'
  },
  {
    text: 'Medicina',
    emoji: '💊',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Más',
    emoji: '➕',
    toneClass: 'bg-pastel-green'
  },
  {
    text: 'Para',
    emoji: '🛑',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Cobija',
    emoji: '🛏️',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'cansado',
    emoji: '😴',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'con frío',
    emoji: '🥶',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'con calor',
    emoji: '🥵',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'mal',
    emoji: '🤢',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'bien',
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
    text: 'con dolor',
    emoji: '🩹',
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
    text: 'Enfermera',
    emoji: '👩‍⚕️',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Eso duele',
    emoji: '😖',
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
    text: 'Hospital',
    emoji: '🏥',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Terapia física',
    emoji: '🏋️',
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
    text: 'Hacer ejercicio',
    emoji: '🏋️',
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
  },
  {
    text: 'No entiendo',
    emoji: '🤷',
    toneClass: 'bg-pastel-yellow'
  },
  {
    text: 'Más despacio',
    emoji: '🐢',
    toneClass: 'bg-pastel-blue'
  },
  {
    text: 'Eso no está bien',
    emoji: '❌',
    toneClass: 'bg-pastel-pink'
  },
  {
    text: 'Exactamente',
    emoji: '🎯',
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

const englishDefaultCardTextReplacements = new Map([
  ['Hello / Hi', 'Hello'],
  ['Wait / One moment', 'Wait'],
  ['Water / Drink', 'Water'],
  ['Food / Hungry', 'Food'],
  ['Medicine / Pain', 'Medicine'],
  ['I take medication', 'Medicine'],
  ['Stop / Finished', 'Stop'],
  ['I\'m tired', 'tired'],
  ['I\'m cold', 'cold'],
  ['I\'m hot', 'hot'],
  ['I feel sick', 'sick'],
  ['I\'m okay', 'okay'],
  ['Happy', 'happy'],
  ['Sad', 'sad'],
  ['Frustrated', 'frustrated'],
  ['Frustrated / Upset', 'frustrated'],
  ['Scared', 'scared'],
  ['I\'m in pain', 'in pain'],
  ['Pain', 'in pain'],
  ['Doctor', 'Nurse'],
  ['Doctor / Hospital', 'Nurse'],
  ['My husband / wife / partner', 'My partner'],
  ['Work / Job', 'Work'],
  ['Outside / Go out', 'Outside'],
  ['TV / Watch something', 'TV'],
  ['Eat', 'to eat'],
  ['Eat / Restaurant', 'to eat'],
  ['Sleep', 'to sleep'],
  ['Sleep / Rest', 'to sleep'],
  ['Walk', 'to walk'],
  ['Walk / Exercise', 'to walk'],
  ['Say it again / Repeat', 'Repeat'],
  ['Almost right / Not quite', 'Almost right'],
  ['Show me / Point to it', 'Show me']
])

const spanishDefaultCardTextReplacements = new Map([
  ['Espera / Un momento', 'Espera'],
  ['Agua / Bebida', 'Agua'],
  ['Comida / Tengo hambre', 'Comida'],
  ['Medicina / Dolor', 'Medicina'],
  ['Alto', 'Para'],
  ['Alto / Terminé', 'Para'],
  ['Estoy cansado', 'cansado'],
  ['Tengo frío', 'con frío'],
  ['Tengo calor', 'con calor'],
  ['Me siento mal', 'mal'],
  ['Estoy bien', 'bien'],
  ['Frustrado / Molesto', 'Frustrado'],
  ['Tengo dolor', 'con dolor'],
  ['Tomo medicamento', 'Medicina'],
  ['Doctor', 'Enfermera'],
  ['Mi esposo / esposa / pareja', 'Mi pareja'],
  ['Afuera / Salir', 'Afuera'],
  ['TV / Ver algo', 'TV'],
  ['Comer / Restaurante', 'Comer'],
  ['Dormir / Descansar', 'Dormir'],
  ['Caminar / Ejercicio', 'Caminar'],
  ['Casi correcto / No exactamente', 'Casi correcto'],
  ['Muéstrame / Señálalo', 'Muéstrame']
])

const defaultCardTexts = new Set([
  ...englishCoreWords.map(card => card.text),
  ...spanishCoreWords.map(card => card.text)
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
        },
        {
          text: 'I can\'t',
          phrase: 'I can\'t',
          emoji: '🚫',
          toneClass: 'bg-pastel-pink'
        },
        {
          text: 'Can you',
          phrase: 'Can you',
          suffix: '?',
          emoji: '🤝',
          toneClass: 'bg-pastel-green'
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
        },
        {
          text: 'No puedo',
          phrase: 'No puedo',
          emoji: '🚫',
          toneClass: 'bg-pastel-pink'
        },
        {
          text: 'Puedes',
          phrase: 'Puedes',
          suffix: '?',
          emoji: '🤝',
          toneClass: 'bg-pastel-green'
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
        },
        {
          text: 'How',
          phrase: 'How',
          suffix: '?',
          emoji: '⚙️',
          toneClass: 'bg-pastel-green'
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
        },
        {
          text: 'Cómo',
          phrase: 'Cómo',
          suffix: '?',
          emoji: '⚙️',
          toneClass: 'bg-pastel-green'
        }
      ]
)

const questionEnder = computed<Word>(() => ({
  text: '?',
  emoji: '❔',
  toneClass: 'bg-pastel-pink'
}))

const painScaleOptions = computed<PainScaleOption[]>(() =>
  activeLocale.value === 'en'
    ? [
        {
          label: '0',
          description: 'No pain',
          phrase: 'My pain is zero. No pain.'
        },
        {
          label: '1-2',
          description: 'Mild pain',
          phrase: 'My pain is one to two. Mild pain.'
        },
        {
          label: '3-4',
          description: 'Uncomfortable pain',
          phrase: 'My pain is three to four. Uncomfortable pain.'
        },
        {
          label: '5-6',
          description: 'Moderate pain',
          phrase: 'My pain is five to six. Moderate pain.'
        },
        {
          label: '7-8',
          description: 'Severe pain',
          phrase: 'My pain is seven to eight. Severe pain.'
        },
        {
          label: '9-10',
          description: 'Worst pain',
          phrase: 'My pain is nine to ten. Worst pain.'
        }
      ]
    : [
        {
          label: '0',
          description: 'Sin dolor',
          phrase: 'Mi dolor es cero. Sin dolor.'
        },
        {
          label: '1-2',
          description: 'Dolor leve',
          phrase: 'Mi dolor es uno a dos. Dolor leve.'
        },
        {
          label: '3-4',
          description: 'Dolor incómodo',
          phrase: 'Mi dolor es tres a cuatro. Dolor incómodo.'
        },
        {
          label: '5-6',
          description: 'Dolor moderado',
          phrase: 'Mi dolor es cinco a seis. Dolor moderado.'
        },
        {
          label: '7-8',
          description: 'Dolor fuerte',
          phrase: 'Mi dolor es siete a ocho. Dolor fuerte.'
        },
        {
          label: '9-10',
          description: 'El peor dolor',
          phrase: 'Mi dolor es nueve a diez. El peor dolor.'
        }
      ]
)

const painScaleTitle = computed(() =>
  activeLocale.value === 'en' ? 'Pain scale' : 'Escala de dolor'
)

const painScaleHelper = computed(() =>
  activeLocale.value === 'en'
    ? 'Choose the number that matches the pain right now.'
    : 'Elige el número que describe el dolor ahora.'
)

const closePainScaleLabel = computed(() =>
  activeLocale.value === 'en' ? 'Close pain scale' : 'Cerrar escala de dolor'
)

const painStatement = computed(() =>
  activeLocale.value === 'en' ? 'I feel pain.' : 'Siento dolor.'
)

const isPainCardText = (text: string) =>
  ['in pain', 'con dolor', 'Pain', 'Dolor'].includes(text)

const getCardTitle = (card: Word) => {
  if (!isPainCardText(card.text)) {
    return undefined
  }

  return activeLocale.value === 'en' ? 'Pain' : 'Dolor'
}

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

const getPrimaryText = (text: string) => {
  const [firstOption = text] = text.split('/')
  return firstOption.trim()
}

const lowercaseFirst = (text: string) => {
  if (!text) {
    return ''
  }

  return text.charAt(0).toLocaleLowerCase() + text.slice(1)
}

const englishGrammarOverrides = new Map<string, NonNullable<Word['grammar']>>([
  ['Water', { kind: 'noun', article: 'some' }],
  ['Food', { kind: 'noun', article: 'some' }],
  ['Bathroom', { kind: 'place', requestObject: 'to use the bathroom', questionObject: 'the bathroom' }],
  ['Medicine', { kind: 'noun', article: 'my' }],
  ['More', { kind: 'noun', requestObject: 'more' }],
  ['Blanket', { kind: 'noun', article: 'a' }],
  ['tired', { kind: 'adjective' }],
  ['cold', { kind: 'adjective' }],
  ['hot', { kind: 'adjective' }],
  ['sick', { kind: 'adjective' }],
  ['okay', { kind: 'adjective' }],
  ['happy', { kind: 'adjective' }],
  ['sad', { kind: 'adjective' }],
  ['frustrated', { kind: 'adjective' }],
  ['scared', { kind: 'adjective' }],
  ['in pain', { kind: 'adjective' }],
  ['Nurse', { kind: 'person', article: 'the' }],
  ['Home', { kind: 'place', requestObject: 'to go home', questionObject: 'home' }],
  ['My partner', { kind: 'person', article: 'none' }],
  ['My family', { kind: 'person', article: 'none' }],
  ['My doctor', { kind: 'person', article: 'none' }],
  ['Work', { kind: 'place', requestObject: 'to go to work', questionObject: 'work' }],
  ['Outside', { kind: 'place', requestObject: 'to go outside', questionObject: 'outside' }],
  ['Hospital', { kind: 'place', requestObject: 'to go to the hospital', questionObject: 'the hospital' }],
  ['Physical therapy', { kind: 'place', requestObject: 'to go to physical therapy', questionObject: 'physical therapy' }],
  ['Phone call', { kind: 'noun', article: 'a' }],
  ['TV', { kind: 'noun', article: 'the' }],
  ['Music', { kind: 'noun', article: 'some' }],
  ['to eat', { kind: 'verb', requestObject: 'to eat' }],
  ['to sleep', { kind: 'verb', requestObject: 'to sleep' }],
  ['to walk', { kind: 'verb', requestObject: 'to walk' }],
  ['to exercise', { kind: 'verb', requestObject: 'to exercise' }],
  ['Repeat', { kind: 'verb', requestObject: 'to repeat that' }],
  ['Write it down', { kind: 'verb', requestObject: 'to write it down' }],
  ['Show me', { kind: 'verb', requestObject: 'to show me' }],
  ['Help me', { kind: 'verb', requestObject: 'to help me' }]
])

const spanishGrammarOverrides = new Map<string, NonNullable<Word['grammar']>>([
  ['Agua', { kind: 'noun', article: 'none' }],
  ['Comida', { kind: 'noun', article: 'none' }],
  ['Baño', { kind: 'place', requestObject: 'ir al baño', questionObject: 'el baño' }],
  ['Medicina', { kind: 'noun', article: 'none' }],
  ['Cobija', { kind: 'noun', article: 'none' }],
  ['cansado', { kind: 'adjective' }],
  ['con frío', { kind: 'adjective' }],
  ['con calor', { kind: 'adjective' }],
  ['mal', { kind: 'adjective' }],
  ['bien', { kind: 'adjective' }],
  ['Feliz', { kind: 'adjective' }],
  ['Triste', { kind: 'adjective' }],
  ['Frustrado', { kind: 'adjective' }],
  ['Asustado', { kind: 'adjective' }],
  ['con dolor', { kind: 'adjective' }],
  ['Casa', { kind: 'place', requestObject: 'ir a casa', questionObject: 'casa' }],
  ['Trabajo', { kind: 'place', requestObject: 'ir al trabajo', questionObject: 'el trabajo' }],
  ['Afuera', { kind: 'place', requestObject: 'ir afuera', questionObject: 'afuera' }],
  ['Hospital', { kind: 'place', requestObject: 'ir al hospital', questionObject: 'el hospital' }],
  ['Terapia física', { kind: 'place', requestObject: 'ir a terapia física', questionObject: 'terapia física' }],
  ['Comer', { kind: 'verb', requestObject: 'comer' }],
  ['Dormir', { kind: 'verb', requestObject: 'dormir' }],
  ['Caminar', { kind: 'verb', requestObject: 'caminar' }],
  ['Hacer ejercicio', { kind: 'verb', requestObject: 'hacer ejercicio' }],
  ['Repítelo', { kind: 'verb', requestObject: 'que lo repitas' }],
  ['Escríbelo', { kind: 'verb', requestObject: 'que lo escribas' }],
  ['Muéstrame', { kind: 'verb', requestObject: 'que me muestres' }]
])

const getGrammar = (card: Word) =>
  card.grammar
  ?? (activeLocale.value === 'en'
    ? englishGrammarOverrides.get(card.text)
    : spanishGrammarOverrides.get(card.text))

const getCardSpeechText = (card: Word) =>
  getPrimaryText(card.speakText ?? card.text)

const isCompletePhrase = (text: string) =>
  /^(i|i'm|i’ve|i can|i need|i want|can you|please|call|help|wait|thank|show|let|that|that's|no|yes|you|we)\b/i.test(text)

const withEnglishArticle = (text: string, grammar?: NonNullable<Word['grammar']>) => {
  const lower = lowercaseFirst(text)
  if (!grammar || grammar.article === 'none') {
    return lower
  }

  if (grammar.requestObject) {
    return grammar.requestObject
  }

  if (grammar.article) {
    return `${grammar.article} ${lower}`
  }

  return lower
}

const normalizeEnglishRequestObject = (card: Word, starter: PhraseStarter) => {
  const text = getCardSpeechText(card)
  const grammar = getGrammar(card)
  const lower = lowercaseFirst(text)

  if (!text) {
    return ''
  }

  if (grammar?.kind === 'fullPhrase' || isCompletePhrase(text)) {
    return lower
  }

  if (starter.phrase === 'I am' || starter.phrase === 'I feel') {
    return lower.replace(/^to\s+/i, '')
  }

  if (starter.phrase === 'I can\'t') {
    return (grammar?.requestObject ?? lower).replace(/^to\s+/i, '')
  }

  if (starter.phrase === 'Can you') {
    if (grammar?.kind === 'noun') {
      return `get me ${withEnglishArticle(text, grammar)}`
    }

    if (grammar?.kind === 'place') {
      return `help me ${grammar.requestObject ?? `go to ${withEnglishArticle(text, grammar)}`}`.replace('help me to ', 'help me ')
    }

    if (grammar?.kind === 'person') {
      return `call ${withEnglishArticle(text, grammar)}`
    }

    return (grammar?.requestObject ?? lower).replace(/^to\s+/i, '')
  }

  return withEnglishArticle(text, grammar)
}

const normalizeSpanishRequestObject = (card: Word, starter: PhraseStarter) => {
  const text = getCardSpeechText(card)
  const grammar = getGrammar(card)
  const lower = lowercaseFirst(text)

  if (!text) {
    return ''
  }

  if (grammar?.kind === 'fullPhrase' || isCompletePhrase(text)) {
    return lower
  }

  if (starter.phrase === 'No puedo') {
    return grammar?.requestObject ?? lower
  }

  if (starter.phrase === 'Puedes') {
    if (grammar?.kind === 'noun') {
      return `traerme ${lower}`
    }

    if (grammar?.kind === 'place') {
      return `ayudarme a ${grammar.requestObject ?? lower}`
    }

    return grammar?.requestObject ?? lower
  }

  return grammar?.requestObject ?? lower
}

const getEnglishQuestion = (starter: PhraseStarter, card: Word) => {
  const text = getCardSpeechText(card)
  const grammar = getGrammar(card)
  const object = grammar?.questionObject ?? withEnglishArticle(text, grammar)

  if (starter.phrase === 'Where') {
    return `Where is ${object}?`
  }

  if (starter.phrase === 'Who') {
    return `Who is ${object}?`
  }

  if (starter.phrase === 'What' && grammar?.kind === 'noun') {
    return `What ${object} do I need?`
  }

  if (starter.phrase === 'How' && grammar?.kind === 'verb') {
    return `How do I ${object.replace(/^to\s+/i, '')}?`
  }

  return `${starter.phrase} ${lowercaseFirst(text)}?`
}

const getSpanishQuestion = (starter: PhraseStarter, card: Word) => {
  const text = getCardSpeechText(card)
  const grammar = getGrammar(card)
  const object = grammar?.questionObject ?? lowercaseFirst(text)

  if (starter.phrase === 'Dónde') {
    return `Dónde está ${object}?`
  }

  if (starter.phrase === 'Quién') {
    return `Quién es ${object}?`
  }

  return `${starter.phrase} ${lowercaseFirst(text)}?`
}

const getPhrase = (starter: PhraseStarter, card: Word) => {
  const isRequestQuestion = ['Can you', 'Puedes'].includes(starter.phrase)

  if (starter.suffix === '?' && !isRequestQuestion) {
    return activeLocale.value === 'en'
      ? getEnglishQuestion(starter, card)
      : getSpanishQuestion(starter, card)
  }

  const object = activeLocale.value === 'en'
    ? normalizeEnglishRequestObject(card, starter)
    : normalizeSpanishRequestObject(card, starter)

  const phrase = `${starter.phrase} ${object}`.trim()
  return starter.suffix ? `${phrase}${starter.suffix}` : phrase
}

const getStarterSpeechText = (starter: PhraseStarter) =>
  getCardSpeechText(starter)

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
  speak(getStarterSpeechText(starter))
}

const onStarterClear = () => {
  selectedPhraseStarter.value = null
}

const onPainScaleClose = () => {
  isPainScaleOpen.value = false
}

const onPainScaleSelect = (option: PainScaleOption) => {
  speak(`${painStatement.value} ${option.phrase}`)
  isPainScaleOpen.value = false
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

const onCardSelect = (card: Word) => {
  const text = card.text
  if (isPainCardText(text)) {
    speak(painStatement.value)
    isPainScaleOpen.value = true
    selectedPhraseStarter.value = null
    return
  }

  isPainScaleOpen.value = false
  const starter = selectedPhraseStarter.value
  if (!starter) {
    speak(getCardSpeechText(card))
    return
  }

  speak(getPhrase(starter, card))
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

const reconcileDefaultCards = (
  currentCards: Word[],
  defaultCards: Word[],
  replacements: Map<string, string>
) => {
  const byNormalizedText = new Map<string, Word>()

  currentCards.forEach((card) => {
    const normalizedText = replacements.get(card.text) ?? card.text
    if (!byNormalizedText.has(normalizedText)) {
      byNormalizedText.set(normalizedText, card)
    }
  })

  const reconciledDefaults = defaultCards.map((defaultCard, index) => {
    const existingCard = byNormalizedText.get(defaultCard.text)
    return {
      ...defaultCard,
      hidden: index < priorityButtonCount ? false : existingCard?.hidden ?? defaultCard.hidden
    }
  })

  const customCards = currentCards.filter((card) => {
    if (deprecatedDefaultCards.has(card.text)) {
      return false
    }

    const normalizedText = replacements.get(card.text) ?? card.text
    return !defaultCardTexts.has(normalizedText)
  })

  return [...reconciledDefaults, ...customCards]
}

const removeDeprecatedDefaultCards = () => {
  englishWords.value = reconcileDefaultCards(
    englishWords.value,
    englishCoreWords,
    englishDefaultCardTextReplacements
  )
  spanishWords.value = reconcileDefaultCards(
    spanishWords.value,
    spanishCoreWords,
    spanishDefaultCardTextReplacements
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
              :title="getCardTitle(card)"
              :text="card.text"
              :emoji="card.emoji"
              :tone-class="getPriorityToneClass(card, index)"
              :hidden="card.hidden"
              :show-delete="false"
              @select="onCardSelect(card)"
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
              :title="getCardTitle(card)"
              :text="card.text"
              :emoji="card.emoji"
              :tone-class="card.toneClass"
              :hidden="card.hidden"
              :delete-aria-label="getCardVisibilityAria(card)"
              @select="onCardSelect(card)"
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

        <section
          v-if="isPainScaleOpen"
          class="sticky top-3 z-40 mb-8 rounded-2xl border-2 border-[#9b1c1c]/40 bg-[#fff7ed] p-4 shadow-ambient dark:border-[#fca5a5]/40 dark:bg-[#2b1f1b]"
          aria-live="polite"
        >
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 class="font-brand-heading text-xl font-semibold uppercase tracking-[0.08em] text-[#9b1c1c] dark:text-[#fca5a5]">
                {{ painScaleTitle }}
              </h2>
              <p class="mt-1 text-sm text-[#48617d] dark:text-[#d1d5db]">
                {{ painScaleHelper }}
              </p>
            </div>
            <button
              type="button"
              class="h-10 w-10 rounded-full border border-[#9b1c1c]/30 bg-white text-xl font-semibold leading-none text-[#9b1c1c] transition hover:bg-[#fff1f2] dark:border-[#fca5a5]/40 dark:bg-[#22242b] dark:text-[#fca5a5]"
              :aria-label="closePainScaleLabel"
              @click="onPainScaleClose"
            >
              ×
            </button>
          </div>

          <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <button
              v-for="option in painScaleOptions"
              :key="option.label"
              type="button"
              class="min-h-[112px] rounded-xl border-2 border-[#9b1c1c]/20 bg-white p-3 text-center transition active:scale-95 hover:border-[#9b1c1c]/50 hover:bg-[#fff1f2] dark:bg-[#22242b] dark:hover:bg-[#352722]"
              @click="onPainScaleSelect(option)"
            >
              <span class="block text-2xl font-bold text-[#9b1c1c] dark:text-[#fca5a5]">
                {{ option.label }}
              </span>
              <span class="mt-2 block text-sm font-semibold leading-snug text-[#0e2f5d] dark:text-[#f4f4f5]">
                {{ option.description }}
              </span>
            </button>
          </div>
        </section>

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
              :title="getCardTitle(card)"
              :text="card.text"
              :emoji="card.emoji"
              :tone-class="card.toneClass"
              :hidden="card.hidden"
              :delete-aria-label="getCardVisibilityAria(card)"
              @select="onCardSelect(card)"
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
