import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import VoiceCardSkeleton from '../../app/components/VoiceCardSkeleton.vue'

describe('VoiceCardSkeleton', () => {
  it('renders a hidden placeholder shell', () => {
    const wrapper = mount(VoiceCardSkeleton)

    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })
})
