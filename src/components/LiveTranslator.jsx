import { useEffect, useState } from 'react'
import useSpeechRecognition from '../hooks/useSpeechRecognition'
import useTranslation from '../hooks/useTranslation'
import useTTS from '../hooks/useTTS'
import LanguageSelector from './LanguageSelector'
import { LANGUAGES } from '../utils/languages'

export default function LiveTranslator() {
  const [targetLang, setTargetLang] = useState('ES')
  const { transcript, listening, startListening, stopListening } = useSpeechRecognition()
  const { translatedText, translate } = useTranslation()
  const { speak } = useTTS()

  useEffect(() => {
    if (transcript) translate(transcript, targetLang)
  }, [transcript, targetLang])

  const handleSpeak = () => {
    const lang = LANGUAGES.find(l => l.code === targetLang)
    speak(translatedText, lang.ttsLang)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <LanguageSelector value={targetLang} onChange={setTargetLang} label="Translate to" />

      <button
        onClick={() => listening ? stopListening() : startListening()}
        style={{
          padding: '12px 24px', borderRadius: 8, border: 'none',
          background: listening ? '#E24B4A' : '#378ADD',
          color: 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer',
          alignSelf: 'flex-start'
        }}
      >
        {listening ? '⏹ Stop listening' : '🎙 Start listening'}
      </button>

      {transcript && (
        <div style={{ padding: '12px 14px', borderRadius: 10, border: '0.5px solid #ddd', background: '#fafafa' }}>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>You said</p>
          <p style={{ fontSize: 15, lineHeight: 1.6 }}>{transcript}</p>
        </div>
      )}

      {translatedText && (
        <div style={{ padding: '12px 14px', borderRadius: 10, border: '0.5px solid #378ADD', background: '#E6F1FB' }}>
          <p style={{ fontSize: 12, color: '#185FA5', marginBottom: 4 }}>Translation</p>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#0C447C' }}>{translatedText}</p>
          <button
            onClick={handleSpeak}
            style={{ marginTop: 10, padding: '6px 14px', borderRadius: 6, border: '0.5px solid #185FA5', background: 'white', fontSize: 13, cursor: 'pointer' }}
          >
            🔊 Speak translation
          </button>
        </div>
      )}
    </div>
  )
}
