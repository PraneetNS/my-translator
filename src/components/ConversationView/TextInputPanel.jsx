import { useState } from 'react'
import { useConversationStore } from '../../store/conversationStore'
import { translateText } from '../../services/sarvam'
import { INDIC_LANGUAGES } from '../../utils/languages'

export default function TextInputPanel() {
  const { speakerA, speakerB, addMessage, formality, dialect } = useConversationStore()
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [loadingA, setLoadingA] = useState(false)
  const [loadingB, setLoadingB] = useState(false)

  const handleTranslate = async (side) => {
    const text = side === 'A' ? textA : textB
    const sourceLang = side === 'A' ? speakerA.code : speakerB.code
    const targetLang = side === 'A' ? speakerB.code : speakerA.code
    const ttsLang = side === 'A'
      ? INDIC_LANGUAGES.find(l => l.code === targetLang)?.ttsLang
      : INDIC_LANGUAGES.find(l => l.code === targetLang)?.ttsLang

    if (!text.trim()) return
    side === 'A' ? setLoadingA(true) : setLoadingB(true)

    try {
      const translated = await translateText({
        text,
        sourceLang,
        targetLang,
        formality, // Pass logic down into the updated Sarvam connector if needed
        dialect
      })

      // Speak via Web Speech as fallback
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance(translated)
        utter.lang = ttsLang || 'hi-IN'
        window.speechSynthesis.speak(utter)
      }

      addMessage({
        side,
        transcript: text,
        translatedText: translated,
        mode: 'text',
      })

      side === 'A' ? setTextA('') : setTextB('')
    } catch {}
    side === 'A' ? setLoadingA(false) : setLoadingB(false)
  }

  const panelProps = (side) => {
    const speaker = side === 'A' ? speakerA : speakerB
    const text = side === 'A' ? textA : textB
    const loading = side === 'A' ? loadingA : loadingB
    const color = side === 'A' ? '#378ADD' : '#1D9E75'
    const bg = side === 'A' ? '#E6F1FB' : '#E1F5EE'

    return { speaker, text, loading, color, bg, side }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
      borderBottom: '0.5px solid #eee', background: 'white' }}>
      {['A', 'B'].map(side => {
        const { speaker, text, loading, color, bg } = panelProps(side)
        const setText = side === 'A' ? setTextA : setTextB

        return (
          <div key={side} style={{
            padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8,
            borderRight: side === 'A' ? '0.5px solid #eee' : 'none'
          }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#aaa',
              textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {speaker.label} · {speaker.script}
            </span>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTranslate(side) } }}
              placeholder={`Type in ${speaker.label}...`}
              rows={3}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: '0.5px solid #ddd', fontSize: 14, resize: 'none',
                fontFamily: 'inherit', lineHeight: 1.6, outline: 'none',
              }}
            />
            <button
              onClick={() => handleTranslate(side)}
              disabled={loading || !text.trim()}
              style={{
                padding: '8px', borderRadius: 8, border: 'none',
                background: loading ? '#f0f0f0' : bg,
                color: loading ? '#aaa' : color,
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
              }}>
              {loading ? 'Translating...' : `Translate → ${side === 'A' ? speakerB.label : speakerA.label}`}
            </button>
          </div>
        )
      })}
    </div>
  )
}
