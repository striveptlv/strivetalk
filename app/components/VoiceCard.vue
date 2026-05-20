<script setup lang="ts">
import { computed } from 'vue'
import { useDeleteMode } from '../composables/useDeleteMode'

const props = withDefaults(
  defineProps<{
    title?: string
    emoji?: string
    text: string
    toneClass?: string
    editable?: boolean
    showDelete?: boolean
    deleteAriaLabel?: string
    deleteIcon?: string
    editAriaLabel?: string
  }>(),
  {
    title: undefined,
    toneClass: 'bg-pastel-blue',
    editable: false,
    showDelete: true,
    deleteAriaLabel: 'Eliminar tarjeta',
    deleteIcon: undefined,
    editAriaLabel: 'Editar tarjeta'
  }
)

const emit = defineEmits<{
  select: [text: string]
  delete: []
  edit: []
}>()

const onSelect = () => {
  emit('select', props.text)
}

const onDelete = () => {
  emit('delete')
}

const onEdit = () => {
  emit('edit')
}

const isStrongTone = computed(() => props.toneClass.includes('bg-traffic-'))

const { isDeleteMode } = useDeleteMode()
</script>

<template>
  <div
    class="relative rounded-2xl shadow-ambient min-h-[180px] border-2 border-transparent"
    :class="toneClass"
  >
    <button
      type="button"
      :aria-label="title || text"
      class="w-full h-full min-h-[180px] rounded-2xl flex flex-col items-center justify-center gap-4 p-4 transition-all duration-150 active:scale-95 active:brightness-90 cursor-pointer"
      @click="onSelect"
    >
      <span
        aria-hidden="true"
        class="text-6xl"
      >{{ emoji }}</span>
      <span
        class="font-button-text text-button-text"
        :class="isStrongTone ? 'text-white' : 'text-[#083d7a] dark:text-[#F0F0F0]'"
      >
        {{ title || text }}
      </span>
    </button>

    <button
      v-if="isDeleteMode && showDelete"
      type="button"
      :aria-label="deleteAriaLabel"
      class="absolute top-2 right-2 h-9 w-9 rounded-full bg-white/90 dark:bg-[#22242b]/90 border border-[#d8dee9] dark:border-[#3f4450] text-[#9b1c1c] dark:text-[#fca5a5] text-xl leading-none flex items-center justify-center hover:brightness-95 transition"
      @click.stop="onDelete"
    >
      <span
        v-if="deleteIcon === 'hide'"
        aria-hidden="true"
        class="relative block h-4 w-6 rounded-full border-2 border-current"
      >
        <span
          class="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
        />
        <span
          class="absolute left-1/2 top-1/2 h-0.5 w-7 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current"
        />
      </span>
      <span v-else>{{ deleteIcon || '×' }}</span>
    </button>

    <button
      v-if="isDeleteMode && editable"
      type="button"
      :aria-label="editAriaLabel"
      class="absolute top-2 left-2 h-9 rounded-full bg-white/90 dark:bg-[#22242b]/90 border border-[#d8dee9] dark:border-[#3f4450] px-3 text-xs font-semibold uppercase tracking-wide text-[#083d7a] dark:text-[#8ecae6] flex items-center justify-center hover:brightness-95 transition"
      @click.stop="onEdit"
    >
      Edit
    </button>
  </div>
</template>
