import { useState, useEffect } from 'react'
import useTranslation from '../hooks/useTranslation'
import useTTS from '../hooks/useTTS'
import LanguageSelector from './LanguageSelector'
import { LANGUAGES } from '../utils/languages'
import usePhrasebook from '../hooks/usePhrasebook'

export default function TextTranslator() {
  const [inputText, setInputText] = useState('')
  const [targetLang, setTargetLang] = useState('ES')
  const [autoSpeak, setAutoSpeak] = useState(false)
  const { translatedText, loading, error, translate } = useTranslation()
  const { speak, stop } = useTTS()
  const { togglePhrase, isStarred } = usePhrasebook()

  const handleTranslate = async () => {
    const result = await translate(inputText, targetLang)
    if (result && autoSpeak) {
      const lang = LANGUAGES.find(l => l.code === targetLang)
      speak(result, lang.ttsLang)
    }
  }

  const handleSpeak = () => {
    const lang = LANGUAGES.find(l => l.code === targetLang)
    speak(translatedText, lang.ttsLang)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleTranslate()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#888' }}>Auto-detect</span>
          <span style={{ color: '#ccc' }}>→</span>
          <LanguageSelector
            value={targetLang}
            onChange={setTargetLang}
            label="Translate to"
          />
        </div>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#666' }}>
          <input 
            type="checkbox" 
            checked={autoSpeak} 
            onChange={e => setAutoSpeak(e.target.checked)}
          />
          Auto-speak
        </label>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ fontSize: 15, lineHeight: 1.7, flex: 1 }}>
              {translatedText}
            </p>
            <button 
              onClick={() => togglePhrase({ original: inputText, translated: translatedText, targetLang })}
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18 }}
            >
              {isStarred(inputText, targetLang) ? '⭐' : '☆'}
            </button>
          </div>
          
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
