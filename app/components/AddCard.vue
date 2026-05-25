<script setup lang="ts">
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

type Emoji = {
  n: string[]
  u: string
  r: string
  t: string
  i: string
}

const newInput = ref('')
const hasErrors = ref('')
const selectedEmoji = ref('')
const selectedToneClass = ref('bg-pastel-blue')
const isOpen = ref(false)

const { t } = useI18n()

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

const wordPattern = /^[\p{L}\p{M}]+(?:[\s'-]+[\p{L}\p{M}]+)*$/u

const props = withDefaults(
  defineProps<{
    title?: string
    hasEmoji?: boolean
    isWord?: boolean
  }>(),
  {
    title: undefined,
    hasEmoji: false,
    isWord: false
  }
)

const emit = defineEmits<{
  adding: [text: string]
}>()

const onSelectEmoji = (emoji: Emoji) => {
  selectedEmoji.value = emoji.i
  hasErrors.value = ''
}

const onInput = () => {
  hasErrors.value = ''
}

const onClose = () => {
  newInput.value = ''
  selectedEmoji.value = ''
  selectedToneClass.value = 'bg-pastel-blue'
  hasErrors.value = ''
  isOpen.value = false
}

const onAdding = () => {
  const normalizedInput = newInput.value.trim().normalize('NFC')

  if (normalizedInput === '') {
    hasErrors.value = t('addCard.errors.empty')
    return
  }

  if (props.hasEmoji && selectedEmoji.value === '') {
    hasErrors.value = t('addCard.errors.emoji')
    return
  }

  if (props.isWord && !wordPattern.test(normalizedInput)) {
    hasErrors.value = t('addCard.errors.wordText')
    return
  }

  emit(
    'adding',
    JSON.stringify({
      text: normalizedInput,
      emoji: selectedEmoji.value,
      toneClass: selectedToneClass.value
    })
  )
  onClose()
}
</script>

<template>
  <button
    type="button"
    :aria-label="t('addCard.ariaAdd')"
    class="rounded-2xl min-h-[180px] flex flex-col items-center justify-center gap-3 p-4 border-4 border-dashed border-[#b8d7f0] dark:border-[#3f4450] text-[#4f78a3] dark:text-[#6b7280] hover:border-[#7db8e6] dark:hover:border-[#6b7280] hover:bg-[#eef8ff] dark:hover:bg-[#1e2028] hover:text-[#24548d] dark:hover:text-[#9ca3af] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7db8e6]"
    @click="isOpen = true"
  >
    <span class="text-5xl leading-none font-light select-none">+</span>
    <span class="text-sm font-medium">{{ t("addCard.add") }}</span>
  </button>

  <UModal
    v-model:open="isOpen"
    :title="title || t('addCard.newCard')"
    @update:open="(v) => !v && onClose()"
  >
    <template #body>
      <div class="flex flex-col gap-4 pt-1">
        <!-- Text input -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-[#374151] dark:text-[#d1d5db]">
            {{ t("addCard.textLabel") }}
          </label>
          <p
            v-if="isWord"
            class="text-xs text-[#6b7280] dark:text-[#9ca3af] leading-relaxed"
          >
            {{ t("addCard.wordHint") }}
          </p>
          <UInput
            v-model.trim="newInput"
            color="neutral"
            highlight
            size="lg"
            :placeholder="
              isWord
                ? t('addCard.placeholderWord')
                : t('addCard.placeholderText')
            "
            :ui="{ base: 'w-full' }"
            @input="onInput"
            @keydown.enter="onAdding"
          />
        </div>

        <!-- Card color -->
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
                selectedToneClass === tone.value
                  ? 'border-[#7db8e6] dark:border-[#6b7280] bg-[#eef8ff] dark:bg-[#1e2028]'
                  : 'border-[#cfe4f7] dark:border-[#2d3748] hover:border-[#9bc9ed] dark:hover:border-[#4b5563]'
              "
            >
              <input
                v-model="selectedToneClass"
                type="radio"
                name="card-tone"
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

        <!-- Emoji picker -->
        <div
          v-if="hasEmoji"
          class="flex flex-col gap-2"
        >
          <label class="text-sm font-medium text-[#374151] dark:text-[#d1d5db]">
            {{ t("addCard.emojiLabel") }}
          </label>
          <div class="flex items-start gap-4">
            <div
              class="flex flex-col items-center justify-center gap-1 w-16 shrink-0"
            >
              <div
                class="w-14 h-14 rounded-xl border-2 flex items-center justify-center text-4xl"
                :class="
                  selectedEmoji
                    ? 'border-[#7db8e6] dark:border-[#4b5563] bg-[#eef8ff] dark:bg-[#1e2028]'
                    : 'border-dashed border-[#b8d7f0] dark:border-[#3f4450] bg-[#f8fbff] dark:bg-[#1e2028]'
                "
              >
                <span v-if="selectedEmoji">{{ selectedEmoji }}</span>
                <span
                  v-else
                  class="text-2xl text-[#b8d7f0] dark:text-[#3f4450]"
                >?</span>
              </div>
              <span class="text-xs text-[#4f78a3] dark:text-[#6b7280]">
                {{
                  selectedEmoji
                    ? t("addCard.selected")
                    : t("addCard.notSelected")
                }}
              </span>
            </div>
            <EmojiPicker
              native
              hide-group-names
              hide-search
              disable-skin-tones
              class="!shadow-none !border !border-[#e2e8f0] dark:!border-[#2d3748] !rounded-xl overflow-hidden"
              @select="onSelectEmoji"
            />
          </div>
        </div>

        <!-- Error message -->
        <Transition name="fade-slide">
          <UAlert
            v-if="hasErrors"
            color="error"
            variant="soft"
            :description="hasErrors"
            icon="i-lucide-circle-alert"
          />
        </Transition>

        <!-- Action buttons -->
        <div class="flex gap-2 pt-1">
          <UButton
            variant="ghost"
            color="neutral"
            class="flex-1 justify-center"
            @click="onClose"
          >
            {{ t("addCard.cancel") }}
          </UButton>
          <UButton
            class="flex-1 justify-center"
            @click="onAdding"
          >
            {{ t("addCard.addCardButton") }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style>
.v3-footer {
  display: none !important;
  height: 0 !important;
}

.v3-emoji-picker {
  width: 100% !important;
  max-width: 280px !important;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
