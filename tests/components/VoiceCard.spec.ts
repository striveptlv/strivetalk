import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import VoiceCard from '../../app/components/VoiceCard.vue'

vi.mock('../../app/composables/useDeleteMode', () => ({
  useDeleteMode: () => ({
    isDeleteMode: true
  })
}))

describe('VoiceCard', () => {
  it('renders text and emoji', () => {
    const wrapper = mount(VoiceCard, {
      props: {
        text: 'Gracias',
        emoji: '🙏'
      }
    })

    expect(wrapper.text()).toContain('Gracias')
    expect(wrapper.text()).toContain('🙏')
  })

  it('emits select with the card text on click', async () => {
    const wrapper = mount(VoiceCard, {
      props: {
        text: 'No',
        emoji: '👎'
      }
    })

    await wrapper.get('button[aria-label="No"]').trigger('click')

    expect(wrapper.emitted('select')).toEqual([['No']])
  })

  it('emits delete on delete button click', async () => {
    const wrapper = mount(VoiceCard, {
      props: {
        text: 'No',
        emoji: '👎'
      }
    })

    await wrapper.get('button[aria-label="Eliminar tarjeta"]').trigger('click')

    expect(wrapper.emitted('delete')).toEqual([[]])
    expect(wrapper.emitted('select')).toBeUndefined()
  })
})
