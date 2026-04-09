const SARVAM_STT = 'https://api.sarvam.ai/speech-to-text'
const SARVAM_TRANSLATE = 'https://api.sarvam.ai/translate'
const SARVAM_TTS = 'https://api.sarvam.ai/text-to-speech'

const getHeaders = () => ({
  'api-subscription-key': import.meta.env.VITE_SARVAM_API_KEY,
})

export function buildFormalityContext(formality, dialect) {
  const formalityMap = {
    very_formal: 'Use very respectful honorifics. In Hindi use aap and ji. In Tamil use neenga. In Telugu use meeru.',
    formal: 'Use polite formal language. In Hindi use aap. In Tamil use neenga.',
    informal: 'Use casual friendly language. In Hindi use tum. In Tamil use nee.',
  }
  const dialectMap = {
    mumbai: 'Use Mumbai-style Hindi with some Marathi influence where natural.',
    delhi: 'Use Delhi-style Hindi, direct and colloquial.',
    bengaluru: 'Use Bengaluru-style Kannada-influenced Hindi or direct Kannada.',
    hyderabad: 'Use Hyderabadi style with Dakhani/Urdu influence where natural.',
    kolkata: 'Use Kolkata-style Bengali-influenced speech.',
    chennai: 'Use Chennai-style Tamil.',
    standard: '',
  }
  return [formalityMap[formality], dialectMap[dialect]].filter(Boolean).join(' ')
}

// Full pipeline: audio → transcribed text → translated text → audio
export async function runPipeline({ audioBase64, sourceLang, targetLang }) {
  // 1. Convert base64 to Blob for STT
  const byteCharacters = atob(audioBase64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const audioBlob = new Blob([byteArray], { type: 'audio/webm' })

  // 1. Speech to Text
  const formData = new FormData()
  formData.append('file', audioBlob, 'audio.webm')
  formData.append('language_code', sourceLang + '-IN')
  formData.append('model', 'saaras:v3')

  const sttRes = await fetch(SARVAM_STT, {
    method: 'POST',
    headers: { 'api-subscription-key': import.meta.env.VITE_SARVAM_API_KEY },
    body: formData
  })

  if (!sttRes.ok) {
    const errObj = await sttRes.json().catch(() => ({}))
    throw new Error(`STT: ${errObj?.error?.message || sttRes.status}`)
  }
  const sttData = await sttRes.json()
  const transcript = sttData.transcript

  if (!transcript || transcript.trim() === '') {
    throw new Error('No speech detected')
  }

  // 2. Translate
  const translateRes = await fetch(SARVAM_TRANSLATE, {
    method: 'POST',
    headers: { ...getHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: transcript,
      source_language_code: sourceLang + '-IN', // Assuming format like hi-IN
      target_language_code: targetLang + '-IN', 
      speaker_gender: 'Female',
      mode: 'formal',
      model: 'mayura:v1'
    })
  })

  if (!translateRes.ok) {
    const errObj = await translateRes.json().catch(() => ({}))
    throw new Error(`Translate: ${errObj?.error?.message || translateRes.status}`)
  }
  const translateData = await translateRes.json()
  const translatedText = translateData.translated_text

  // 3. Text to Speech
  const ttsRes = await fetch(SARVAM_TTS, {
    method: 'POST',
    headers: { ...getHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      inputs: [translatedText],
      target_language_code: targetLang + '-IN',
      speaker: 'ritu',
      model: 'bulbul:v3'
    })
  })

  if (!ttsRes.ok) {
    const errObj = await ttsRes.json().catch(() => ({}))
    throw new Error(`TTS: ${errObj?.error?.message || ttsRes.status}`)
  }
  const ttsData = await ttsRes.json()
  const audioBase64Out = ttsData.audios[0]

  return {
    transcript,
    translatedText,
    audioBase64: audioBase64Out,
  }
}

// Text-only translation (for quick phrases and text input mode)
export async function translateText({ text, sourceLang, targetLang, formality = 'formal', dialect = 'standard' }) {
  const promptContext = buildFormalityContext(formality, dialect)
  const inputPayload = promptContext ? `[Context: ${promptContext}]\n${text}` : text

  const translateRes = await fetch(SARVAM_TRANSLATE, {
    method: 'POST',
    headers: { ...getHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: inputPayload,
      source_language_code: sourceLang === 'en' ? 'en-IN' : sourceLang + '-IN',
      target_language_code: targetLang + '-IN',
      speaker_gender: 'Female',
      mode: formality.includes('informal') ? 'informal' : 'formal',
      model: 'mayura:v1'
    })
  })

  if (!translateRes.ok) throw new Error(`Translation failed: ${translateRes.status}`)
  const translateData = await translateRes.json()
  return translateData.translated_text
}
