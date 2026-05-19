import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useAacSpeech } from '../../app/composables/useAacSpeech'

class MockSpeechSynthesisUtterance {
  lang = ''
  pitch = 1
  rate = 1
  text: string

  constructor(text: string) {
    this.text = text
  }
}

function setup() {
  const cancel = vi.fn()
  const speak = vi.fn()
  vi.stubGlobal('speechSynthesis', { cancel, speak })
  vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance)
  return { cancel, speak }
}

describe('useAacSpeech', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('speaks the provided phrase in Spanish', () => {
    const { cancel, speak } = setup()

    const { speak: speakPhrase, isSupported } = useAacSpeech('es-ES')
    const result = speakPhrase('Agua')

    expect(isSupported).toBe(true)
    expect(result).toBe(true)
    expect(cancel).toHaveBeenCalledTimes(1)
    expect(speak).toHaveBeenCalledTimes(1)

    const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance
    expect(utterance.text).toBe('Agua')
    expect(utterance.lang).toBe('es-ES')
  })

  it('applies default pitch (1) and rate (1)', () => {
    const { speak } = setup()

    const { speak: speakPhrase } = useAacSpeech('es-ES')
    speakPhrase('Hola')

    const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance
    expect(utterance.pitch).toBe(1)
    expect(utterance.rate).toBe(1)
  })

  it('applies custom pitch and rate', () => {
    const { speak } = setup()

    const { speak: speakPhrase } = useAacSpeech('en-US', 1.5, 0.8)
    speakPhrase('Hello')

    const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance
    expect(utterance.pitch).toBe(1.5)
    expect(utterance.rate).toBe(0.8)
  })

  it('applies a different language', () => {
    const { speak } = setup()

    const { speak: speakPhrase } = useAacSpeech('fr-FR')
    speakPhrase('Bonjour')

    const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance
    expect(utterance.lang).toBe('fr-FR')
  })

  it('reacts to reactive lang, pitch, and rate', () => {
    const { speak } = setup()

    const lang = ref('es-MX')
    const pitch = ref(1)
    const rate = ref(1)
    const { speak: speakPhrase } = useAacSpeech(lang, pitch, rate)

    lang.value = 'en-US'
    pitch.value = 2
    rate.value = 1.5
    speakPhrase('Test')

    const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance
    expect(utterance.lang).toBe('en-US')
    expect(utterance.pitch).toBe(2)
    expect(utterance.rate).toBe(1.5)
  })

  it('trims whitespace before speaking', () => {
    const { speak } = setup()

    const { speak: speakPhrase } = useAacSpeech()
    speakPhrase('  Comida  ')

    const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance
    expect(utterance.text).toBe('Comida')
  })

  it('does not speak empty phrases', () => {
    const { cancel, speak } = setup()

    const { speak: speakPhrase } = useAacSpeech('es-ES')
    const result = speakPhrase('   ')

    expect(result).toBe(false)
    expect(cancel).not.toHaveBeenCalled()
    expect(speak).not.toHaveBeenCalled()
  })

  it('cancels previous speech before speaking', () => {
    const { cancel, speak } = setup()

    const { speak: speakPhrase } = useAacSpeech()
    speakPhrase('Primero')
    speakPhrase('Segundo')

    expect(cancel).toHaveBeenCalledTimes(2)
    expect(speak).toHaveBeenCalledTimes(2)
  })

  it('returns false when speech synthesis is not supported', () => {
    vi.stubGlobal('speechSynthesis', undefined)
    vi.stubGlobal('SpeechSynthesisUtterance', undefined)

    const { speak: speakPhrase, isSupported } = useAacSpeech()

    expect(isSupported).toBe(false)
    expect(speakPhrase('Texto')).toBe(false)
  })

  describe('speakAs', () => {
    it('speaks with the given language override, ignoring stored lang', () => {
      const { speak } = setup()

      const { speakAs } = useAacSpeech('es-MX')
      speakAs('Hello! I am a voice demo', 'en-US')

      const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance
      expect(utterance.text).toBe('Hello! I am a voice demo')
      expect(utterance.lang).toBe('en-US')
    })

    it('applies current pitch and rate when using speakAs', () => {
      const { speak } = setup()

      const { speakAs } = useAacSpeech('es-MX', 1.8, 0.6)
      speakAs('Bonjour !', 'fr-FR')

      const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance
      expect(utterance.pitch).toBe(1.8)
      expect(utterance.rate).toBe(0.6)
    })

    it('applies reactive pitch and rate when using speakAs', () => {
      const { speak } = setup()

      const pitch = ref(0.5)
      const rate = ref(2)
      const { speakAs } = useAacSpeech('es-MX', pitch, rate)

      pitch.value = 1.2
      rate.value = 0.9
      speakAs('こんにちは！', 'ja-JP')

      const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance
      expect(utterance.lang).toBe('ja-JP')
      expect(utterance.pitch).toBe(1.2)
      expect(utterance.rate).toBe(0.9)
    })

    it('does not speak empty text', () => {
      const { cancel, speak } = setup()

      const { speakAs } = useAacSpeech()
      const result = speakAs('   ', 'en-US')

      expect(result).toBe(false)
      expect(cancel).not.toHaveBeenCalled()
      expect(speak).not.toHaveBeenCalled()
    })

    it('returns false when speech synthesis is not supported', () => {
      vi.stubGlobal('speechSynthesis', undefined)
      vi.stubGlobal('SpeechSynthesisUtterance', undefined)

      const { speakAs, isSupported } = useAacSpeech()

      expect(isSupported).toBe(false)
      expect(speakAs('Hola', 'es-MX')).toBe(false)
    })
  })
})
