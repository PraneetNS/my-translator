import { useState } from 'react'
import useTranslation from '../hooks/useTranslation'
import useTTS from '../hooks/useTTS'
import LanguageSelector from './LanguageSelector'
import { LANGUAGES } from '../utils/languages'

export default function TextTranslator() {
  const [inputText, setInputText] = useState('')
  const [targetLang, setTargetLang] = useState('ES')
  const { translatedText, loading, error, translate } = useTranslation()
  const { speak, stop } = useTTS()

  const handleTranslate = () => translate(inputText, targetLang)

  const handleSpeak = () => {
    const lang = LANGUAGES.find(l => l.code === targetLang)
    speak(translatedText, lang.ttsLang)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleTranslate()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Language selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: '#888' }}>Auto-detect</span>
        <span style={{ color: '#ccc' }}>→</span>
        <LanguageSelector
          value={targetLang}
          onChange={setTargetLang}
          label="Translate to"
        />
      </div>

      {/* Input box */}
      <textarea
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type or paste text here... (Ctrl+Enter to translate)"
        rows={5}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 10,
          border: '0.5px solid #ddd',
          fontSize: 15,
          resize: 'vertical',
          fontFamily: 'inherit',
          lineHeight: 1.6,
        }}
      />

      {/* Translate button */}
      <button
        onClick={handleTranslate}
        disabled={loading || !inputText.trim()}
        style={{
          padding: '10px 24px',
          borderRadius: 8,
          border: 'none',
          background: loading ? '#aaa' : '#378ADD',
          color: 'white',
          fontSize: 14,
          fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        {loading ? 'Translating...' : 'Translate'}
      </button>

      {/* Error */}
      {error && (
        <p style={{ color: '#E24B4A', fontSize: 13 }}>{error}</p>
      )}

      {/* Output box */}
      {translatedText && (
        <div style={{
          background: '#f9f9f9',
          border: '0.5px solid #ddd',
          borderRadius: 10,
          padding: '14px 16px',
        }}>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
            {translatedText}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleSpeak}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '0.5px solid #ccc',
                background: 'white',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              🔊 Speak
            </button>
            <button
              onClick={stop}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '0.5px solid #ccc',
                background: 'white',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              ⏹ Stop
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(translatedText)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '0.5px solid #ccc',
                background: 'white',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              📋 Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
