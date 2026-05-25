<script setup lang="ts">
const { t, locale } = useI18n()

useSeoMeta({
  title: () => t('information.seoTitle'),
  description: () => t('information.seoDescription')
})

const speechLang = useLocalStorage<string>('speech-lang', 'en-US')
const pitch = useLocalStorage<number>('speech-pitch', 1)
const rate = useLocalStorage<number>('speech-rate', 1)
const { speak } = useAacSpeech(speechLang, pitch, rate)
const { isDeleteMode } = useDeleteMode()
const isStorageReady = ref(false)
const isEditOpen = ref(false)
const editingIndex = ref<number | null>(null)
const editingLabel = ref('')
const editingValue = ref('')
const editingToneClass = ref('bg-pastel-blue')
const editingError = ref('')

type AppLocale = 'en' | 'es'

type InfoItem = {
  label: string
  value: string
  toneClass: string
  hidden?: boolean
}

type InfoGroup = {
  title: string
  count: number
}

const toneOptions = computed(
  () =>
    [
      { label: t('addCard.colors.blue'), value: 'bg-pastel-blue' },
      { label: t('addCard.colors.pink'), value: 'bg-pastel-pink' },
      { label: t('addCard.colors.green'), value: 'bg-pastel-green' },
      { label: t('addCard.colors.purple'), value: 'bg-pastel-purple' },
      { label: t('addCard.colors.yellow'), value: 'bg-pastel-yellow' }
    ] as const
)

const englishGroups: InfoGroup[] = [
  { title: 'Essential Identity Info', count: 5 },
  { title: 'Emergency Contacts', count: 5 },
  { title: 'Medical Information', count: 7 },
  { title: 'Communication Preferences', count: 5 },
  { title: 'Personal Context', count: 5 }
]

const spanishGroups: InfoGroup[] = [
  { title: 'Identidad esencial', count: 5 },
  { title: 'Contactos de emergencia', count: 5 },
  { title: 'Información médica', count: 7 },
  { title: 'Preferencias de comunicación', count: 5 },
  { title: 'Contexto personal', count: 5 }
]

const englishInfoDefaults: InfoItem[] = [
  { label: 'Full name', value: '', toneClass: 'bg-pastel-blue' },
  { label: 'Preferred name', value: '', toneClass: 'bg-pastel-blue' },
  { label: 'Date of birth', value: '', toneClass: 'bg-pastel-blue' },
  { label: 'Home address', value: '', toneClass: 'bg-pastel-blue' },
  { label: 'Phone number', value: '', toneClass: 'bg-pastel-blue' },
  { label: 'Primary contact', value: '', toneClass: 'bg-pastel-yellow' },
  { label: 'Primary contact phone', value: '', toneClass: 'bg-pastel-yellow' },
  { label: 'Secondary contact', value: '', toneClass: 'bg-pastel-yellow' },
  { label: 'Primary care doctor', value: '', toneClass: 'bg-pastel-pink' },
  { label: 'Doctor phone / clinic', value: '', toneClass: 'bg-pastel-pink' },
  { label: 'Primary diagnosis', value: '', toneClass: 'bg-pastel-pink' },
  {
    label: 'Aphasia statement',
    value: 'I have aphasia. I understand more than I can say.',
    toneClass: 'bg-pastel-yellow'
  },
  { label: 'Current medications', value: '', toneClass: 'bg-pastel-yellow' },
  { label: 'Known allergies', value: '', toneClass: 'bg-pastel-pink' },
  { label: 'Blood type', value: '', toneClass: 'bg-pastel-pink' },
  { label: 'Insurance provider / ID', value: '', toneClass: 'bg-pastel-purple' },
  { label: 'Hospital preference', value: '', toneClass: 'bg-pastel-purple' },
  {
    label: 'Speak slowly',
    value: 'Please speak slowly and use simple sentences.',
    toneClass: 'bg-pastel-green'
  },
  {
    label: 'Give me time',
    value: 'Give me time to respond. Please do not finish my sentences.',
    toneClass: 'bg-pastel-green'
  },
  {
    label: 'Yes/no questions',
    value: 'Yes/no questions work best for me.',
    toneClass: 'bg-pastel-green'
  },
  { label: 'Best time to communicate', value: '', toneClass: 'bg-pastel-green' },
  { label: 'Preferred communication method', value: '', toneClass: 'bg-pastel-green' },
  { label: 'Occupation / former career', value: '', toneClass: 'bg-pastel-purple' },
  { label: 'City originally from', value: '', toneClass: 'bg-pastel-purple' },
  { label: 'Languages spoken', value: '', toneClass: 'bg-pastel-purple' },
  { label: 'Religion / cultural needs', value: '', toneClass: 'bg-pastel-purple' },
  { label: 'Living situation', value: '', toneClass: 'bg-pastel-purple' }
]

const spanishInfoDefaults: InfoItem[] = [
  { label: 'Nombre completo', value: '', toneClass: 'bg-pastel-blue' },
  { label: 'Nombre preferido', value: '', toneClass: 'bg-pastel-blue' },
  { label: 'Fecha de nacimiento', value: '', toneClass: 'bg-pastel-blue' },
  { label: 'Dirección de casa', value: '', toneClass: 'bg-pastel-blue' },
  { label: 'Número de teléfono', value: '', toneClass: 'bg-pastel-blue' },
  { label: 'Contacto principal', value: '', toneClass: 'bg-pastel-yellow' },
  { label: 'Teléfono del contacto principal', value: '', toneClass: 'bg-pastel-yellow' },
  { label: 'Contacto secundario', value: '', toneClass: 'bg-pastel-yellow' },
  { label: 'Doctor principal', value: '', toneClass: 'bg-pastel-pink' },
  { label: 'Teléfono del doctor / clínica', value: '', toneClass: 'bg-pastel-pink' },
  { label: 'Diagnóstico principal', value: '', toneClass: 'bg-pastel-pink' },
  {
    label: 'Mensaje de afasia',
    value: 'Tengo afasia. Entiendo más de lo que puedo decir.',
    toneClass: 'bg-pastel-yellow'
  },
  { label: 'Medicamentos actuales', value: '', toneClass: 'bg-pastel-yellow' },
  { label: 'Alergias conocidas', value: '', toneClass: 'bg-pastel-pink' },
  { label: 'Tipo de sangre', value: '', toneClass: 'bg-pastel-pink' },
  { label: 'Seguro / número de miembro', value: '', toneClass: 'bg-pastel-purple' },
  { label: 'Hospital preferido', value: '', toneClass: 'bg-pastel-purple' },
  {
    label: 'Hable despacio',
    value: 'Por favor hable despacio y use frases simples.',
    toneClass: 'bg-pastel-green'
  },
  {
    label: 'Deme tiempo',
    value: 'Deme tiempo para responder. Por favor no termine mis frases.',
    toneClass: 'bg-pastel-green'
  },
  {
    label: 'Preguntas sí/no',
    value: 'Las preguntas de sí o no funcionan mejor para mí.',
    toneClass: 'bg-pastel-green'
  },
  { label: 'Mejor hora para comunicarme', value: '', toneClass: 'bg-pastel-green' },
  { label: 'Método de comunicación preferido', value: '', toneClass: 'bg-pastel-green' },
  { label: 'Ocupación / carrera anterior', value: '', toneClass: 'bg-pastel-purple' },
  { label: 'Ciudad de origen', value: '', toneClass: 'bg-pastel-purple' },
  { label: 'Idiomas que habla', value: '', toneClass: 'bg-pastel-purple' },
  { label: 'Religión / necesidades culturales', value: '', toneClass: 'bg-pastel-purple' },
  { label: 'Situación de vivienda', value: '', toneClass: 'bg-pastel-purple' }
]

const englishInfo = useLocalStorage<InfoItem[]>('info-en-v1', englishInfoDefaults)
const spanishInfo = useLocalStorage<InfoItem[]>('info-es-v1', spanishInfoDefaults)
const defaultInfoCount = englishInfoDefaults.length

const activeLocale = computed<AppLocale>(() =>
  locale.value === 'en' ? 'en' : 'es'
)

const activeInfo = computed({
  get: () => (activeLocale.value === 'en' ? englishInfo.value : spanishInfo.value),
  set: (value: InfoItem[]) => {
    if (activeLocale.value === 'en') {
      englishInfo.value = value
      return
    }

    spanishInfo.value = value
  }
})

const activeGroups = computed(() =>
  activeLocale.value === 'en' ? englishGroups : spanishGroups
)

const shouldShowCard = (item: InfoItem) => isDeleteMode.value || !item.hidden

const groupedInfo = computed(() => {
  let start = 0
  const groups = activeGroups.value.map((group) => {
    const items = activeInfo.value
      .slice(start, start + group.count)
      .map((item, offset) => ({
        item,
        index: start + offset
      }))
      .filter(({ item }) => shouldShowCard(item))
    start += group.count
    return { title: group.title, items }
  }).filter(group => group.items.length > 0)

  const customItems = activeInfo.value
    .slice(start)
    .map((item, offset) => ({
      item,
      index: start + offset
    }))
    .filter(({ item }) => shouldShowCard(item))
  if (customItems.length) {
    groups.push({
      title: activeLocale.value === 'en' ? 'Additional Information' : 'Información adicional',
      items: customItems
    })
  }

  return groups
})

const getSpokenText = (item: InfoItem) => {
  const value = item.value.trim()
  return value
}

const onCardSelect = (item: InfoItem) => {
  speak(getSpokenText(item))
}

const onCardDelete = (index: number) => {
  activeInfo.value = activeInfo.value.map((card, cardIndex) =>
    cardIndex === index
      ? {
          ...card,
          hidden: !card.hidden
        }
      : card
  )
}

const getCardVisibilityAria = (item: InfoItem) =>
  item.hidden ? t('voiceCard.showAria') : t('voiceCard.hideAria')

const isDefaultInfoCard = (index: number | null) =>
  index !== null && index < defaultInfoCount

const onCardEdit = (index: number | null) => {
  editingIndex.value = index
  const item = index === null ? null : activeInfo.value[index]

  editingLabel.value = item?.label ?? ''
  editingValue.value = item?.value ?? ''
  editingToneClass.value = item?.toneClass ?? 'bg-pastel-blue'
  editingError.value = ''
  isEditOpen.value = true
}

const onEditClose = () => {
  isEditOpen.value = false
  editingIndex.value = null
  editingLabel.value = ''
  editingValue.value = ''
  editingToneClass.value = 'bg-pastel-blue'
  editingError.value = ''
}

const onEditSave = () => {
  const normalizedLabel = editingLabel.value.trim().normalize('NFC')
  const normalizedValue = editingValue.value.trim().normalize('NFC')

  if (normalizedLabel === '') {
    editingError.value = t('information.errors.labelRequired')
    return
  }

  const nextItem = {
    label: isDefaultInfoCard(editingIndex.value) && editingIndex.value !== null
      ? activeInfo.value[editingIndex.value].label
      : normalizedLabel,
    value: normalizedValue,
    toneClass: editingToneClass.value,
    hidden: editingIndex.value === null
      ? false
      : activeInfo.value[editingIndex.value]?.hidden
  }

  if (editingIndex.value === null) {
    activeInfo.value = [...activeInfo.value, nextItem]
    onEditClose()
    return
  }

  activeInfo.value = activeInfo.value.map((item, index) =>
    index === editingIndex.value ? nextItem : item
  )
  onEditClose()
}

onMounted(() => {
  isStorageReady.value = true
})
</script>

<template>
  <div
    class="min-h-screen bg-[#fffaf2] text-[#0e2f5d] dark:bg-[#111113] dark:text-[#f4f4f5]"
  >
    <main class="mx-auto w-full max-w-7xl px-6 py-8 pb-32">
      <template v-if="isStorageReady">
        <section
          v-for="group in groupedInfo"
          :key="group.title"
          class="mb-8"
        >
          <h2
            class="mb-3 font-brand-heading text-xl font-semibold uppercase tracking-[0.08em] text-[#083d7a] dark:text-[#8ecae6]"
          >
            {{ group.title }}
          </h2>

          <div
            class="grid grid-cols-1 gap-stack-gap w-full gap-2"
          >
            <div
              v-for="{ item, index } in group.items"
              :key="`${item.label}-${index}`"
              class="relative rounded-2xl shadow-ambient min-h-[180px] border-2 border-transparent"
              :class="[item.toneClass, item.hidden ? 'opacity-50' : 'opacity-100']"
            >
              <button
                type="button"
                :aria-label="item.value ? `${item.label}: ${item.value}` : item.label"
                class="w-full h-full min-h-[180px] rounded-2xl flex flex-col items-start justify-center gap-3 p-5 text-left transition-all duration-150 active:scale-95 active:brightness-90 cursor-pointer"
                :class="item.hidden ? 'cursor-default active:scale-100 active:brightness-100' : ''"
                :disabled="item.hidden"
                @click="onCardSelect(item)"
              >
                <span class="text-xs font-bold uppercase tracking-[0.12em] text-[#24548d] dark:text-[#8ecae6]">
                  {{ item.label }}
                </span>
                <span class="text-xl font-semibold leading-snug text-[#083d7a] dark:text-[#F0F0F0]">
                  {{ item.value || t('information.emptyValue') }}
                </span>
              </button>

              <button
                v-if="isDeleteMode"
                type="button"
                :aria-label="t('voiceCard.editAria')"
                class="absolute top-2 left-2 h-9 rounded-full bg-white/90 dark:bg-[#22242b]/90 border border-[#d8dee9] dark:border-[#3f4450] px-3 text-xs font-semibold uppercase tracking-wide text-[#083d7a] dark:text-[#8ecae6] flex items-center justify-center hover:brightness-95 transition"
                @click.stop="onCardEdit(index)"
              >
                {{ t('voiceCard.edit') }}
              </button>

              <button
                v-if="isDeleteMode"
                type="button"
                :aria-label="getCardVisibilityAria(item)"
                class="absolute top-2 right-2 h-9 w-9 rounded-full bg-white/90 dark:bg-[#22242b]/90 border border-[#d8dee9] dark:border-[#3f4450] text-[#9b1c1c] dark:text-[#fca5a5] text-xl leading-none flex items-center justify-center hover:brightness-95 transition"
                @click.stop="onCardDelete(index)"
              >
                ×
              </button>
            </div>
          </div>
        </section>

        <button
          type="button"
          :aria-label="t('information.addCardTitle')"
          class="rounded-2xl min-h-[150px] w-full flex flex-col items-center justify-center gap-3 p-4 border-4 border-dashed border-[#b8d7f0] dark:border-[#3f4450] text-[#4f78a3] dark:text-[#6b7280] hover:border-[#7db8e6] dark:hover:border-[#6b7280] hover:bg-[#eef8ff] dark:hover:bg-[#1e2028] hover:text-[#24548d] dark:hover:text-[#9ca3af] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7db8e6]"
          @click="onCardEdit(null)"
        >
          <span class="text-5xl leading-none font-light select-none">+</span>
          <span class="text-sm font-medium">{{ t('information.addCardTitle') }}</span>
        </button>
      </template>

      <template v-else>
        <div
          class="grid grid-cols-1 gap-stack-gap w-full gap-2"
        >
          <VoiceCardSkeleton
            v-for="index in 6"
            :key="index"
          />
        </div>
      </template>
    </main>

    <UModal
      :open="isEditOpen"
      :title="editingIndex === null ? t('information.addCardTitle') : t('information.editCardTitle')"
      @update:open="(value) => !value && onEditClose()"
    >
      <template #body>
        <div class="flex flex-col gap-4 pt-1">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#374151] dark:text-[#d1d5db]">
              {{ t('information.labelField') }}
            </label>
            <UInput
              v-model.trim="editingLabel"
              color="neutral"
              highlight
              size="lg"
              :placeholder="t('information.labelPlaceholder')"
              :disabled="isDefaultInfoCard(editingIndex)"
              :ui="{ base: 'w-full' }"
              @input="editingError = ''"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#374151] dark:text-[#d1d5db]">
              {{ t('information.valueField') }}
            </label>
            <UTextarea
              v-model.trim="editingValue"
              color="neutral"
              highlight
              :rows="4"
              :placeholder="t('information.valuePlaceholder')"
              :ui="{ base: 'w-full' }"
              @input="editingError = ''"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-[#374151] dark:text-[#d1d5db]">
              {{ t('addCard.colorLabel') }}
            </label>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="tone in toneOptions"
                :key="tone.value"
                class="inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm cursor-pointer transition-colors"
                :class="
                  editingToneClass === tone.value
                    ? 'border-[#7db8e6] dark:border-[#6b7280] bg-[#eef8ff] dark:bg-[#1e2028]'
                    : 'border-[#cfe4f7] dark:border-[#2d3748] hover:border-[#9bc9ed] dark:hover:border-[#4b5563]'
                "
              >
                <input
                  v-model="editingToneClass"
                  type="radio"
                  name="info-card-tone"
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
              {{ t('addCard.cancel') }}
            </UButton>
            <UButton
              class="flex-1 justify-center"
              @click="onEditSave"
            >
              {{ t('information.saveCardButton') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
