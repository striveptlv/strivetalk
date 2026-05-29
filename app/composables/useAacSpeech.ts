import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

type VoiceGender = 'auto' | 'female' | 'male'

const femaleVoiceNameHints = [
  'allison',
  'aria',
  'ava',
  'catherine',
  'cora',
  'eva',
  'helena',
  'jenny',
  'joana',
  'karen',
  'laura',
  'lucia',
  'maria',
  'monica',
  'moira',
  'paulina',
  'samantha',
  'shelley',
  'soledad',
  'susan',
  'tessa',
  'victoria',
  'zira'
]

const maleVoiceNameHints = [
  'alex',
  'carlos',
  'daniel',
  'david',
  'diego',
  'george',
  'guy',
  'jorge',
  'juan',
  'mark',
  'miguel',
  'pablo',
  'paul',
  'raul',
  'tom'
]

function languageMatches(voiceLang: string, lang: string) {
  const voiceLangLower = voiceLang.toLowerCase()
  const langLower = lang.toLowerCase()
  const baseLang = langLower.split('-')[0]

  return voiceLangLower === langLower || voiceLangLower.startsWith(`${baseLang}-`)
}

function voiceMatchesGender(voice: SpeechSynthesisVoice, gender: VoiceGender) {
  if (gender === 'auto') {
    return true
  }

  const name = voice.name.toLowerCase()
  const hints = gender === 'female' ? femaleVoiceNameHints : maleVoiceNameHints

  return hints.some(hint => name.includes(hint))
}

function selectVoice(lang: string, gender: VoiceGender) {
  if (
    gender === 'auto'
    || typeof window === 'undefined'
    || !('speechSynthesis' in window)
    || typeof window.speechSynthesis.getVoices !== 'function'
  ) {
    return null
  }

  const matchingLanguageVoices = window.speechSynthesis
    .getVoices()
    .filter(voice => languageMatches(voice.lang, lang))

  return (
    matchingLanguageVoices.find(voice => voiceMatchesGender(voice, gender))
    ?? null
  )
}

export function useAacSpeech(
  lang: MaybeRefOrGetter<string> = 'es-ES',
  pitch: MaybeRefOrGetter<number> = 1,
  rate: MaybeRefOrGetter<number> = 1,
  voiceGender: MaybeRefOrGetter<VoiceGender> = 'auto'
) {
  const isSupported
    = typeof window !== 'undefined'
      && 'speechSynthesis' in window
      && typeof SpeechSynthesisUtterance !== 'undefined'

  const speak = (text: string) => {
    const phrase = text.trim()
    if (!isSupported || !phrase) {
      return false
    }

    const utterance = new SpeechSynthesisUtterance(phrase)
    const utteranceLang = toValue(lang)
    const voice = selectVoice(utteranceLang, toValue(voiceGender))
    utterance.lang = utteranceLang
    utterance.pitch = toValue(pitch)
    utterance.rate = toValue(rate)
    if (voice) {
      utterance.voice = voice
    }

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    return true
  }

  const speakAs = (text: string, langOverride: string) => {
    const phrase = text.trim()
    if (!isSupported || !phrase) {
      return false
    }

    const utterance = new SpeechSynthesisUtterance(phrase)
    const voice = selectVoice(langOverride, toValue(voiceGender))
    utterance.lang = langOverride
    utterance.pitch = toValue(pitch)
    utterance.rate = toValue(rate)
    if (voice) {
      utterance.voice = voice
    }

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    return true
  }

  return {
    isSupported,
    speak,
    speakAs
  }
}
