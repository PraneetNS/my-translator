import { useState } from 'react'
import useSpeechRecognition from '../hooks/useSpeechRecognition'
import useTranslation from '../hooks/useTranslation'
import useTTS from '../hooks/useTTS'
import { LANGUAGES } from '../utils/languages'

export default function ConversationMode() {
  const [messages, setMessages] = useState([])
  const [activeSide, setActiveSide] = useState(null)
  const [langA, setLangA] = useState('EN')
  const [langB, setLangB] = useState('ES')
  const { transcript, listening, startListening, stopListening } = useSpeechRecognition()
  const { translate } = useTranslation()
  const { speak } = useTTS()

  const handleRecord = async (side) => {
    if (listening) {
      stopListening()
      const sourceLang = side === 'A' ? langA : langB
      const targetLang = side === 'A' ? langB : langA
      const ttsLang = LANGUAGES.find(l => l.code === targetLang)?.ttsLang

      // Wait for transcript to settle
      const result = await new Promise(res => {
        let count = 0
        const unsub = setInterval(() => {
          if (transcript || count > 10) { 
            clearInterval(unsub)
            res(transcript) 
          }
          count++
        }, 300)
      })

      if (!result) {
        setActiveSide(null)
        return
      }

      const translated = await translate(result, targetLang)
      setMessages(prev => [...prev, {
        side, original: result, translated, sourceLang, targetLang
      }])
      speak(translated, ttsLang)
      setActiveSide(null)
    } else {
      const srcLang = side === 'A'
        ? LANGUAGES.find(l => l.code === langA)?.ttsLang
        : LANGUAGES.find(l => l.code === langB)?.ttsLang
      setActiveSide(side)
      startListening(srcLang)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        {['A', 'B'].map(side => (
          <div key={side} style={{ flex: 1, textAlign: 'center' }}>
            <select value={side === 'A' ? langA : langB}
              onChange={e => side === 'A' ? setLangA(e.target.value) : setLangB(e.target.value)}
              style={{ marginBottom: 8, padding: '6px 10px', borderRadius: 8, border: '0.5px solid #ccc', width: '100%' }}>
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
            </select>
            <button onClick={() => handleRecord(side)}
              style={{
                width: '100%', padding: '14px', borderRadius: 10, border: 'none',
                background: activeSide === side ? '#E24B4A' : '#378ADD',
                color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer'
              }}>
              {activeSide === side ? '⏹ Done' : `🎙 Person ${side} speak`}
            </button>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 0' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.side === 'A' ? 'flex-start' : 'flex-end',
            maxWidth: '75%', background: msg.side === 'A' ? '#E6F1FB' : '#EAF3DE',
            borderRadius: 12, padding: '10px 14px'
          }}>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 3 }}>{msg.original}</p>
            <p style={{ fontSize: 15, fontWeight: 500 }}>{msg.translated}</p>
          </div>
        ))}
        {listening && activeSide && (
          <div style={{ alignSelf: activeSide === 'A' ? 'flex-start' : 'flex-end', opacity: 0.6 }}>
            <p style={{ fontSize: 13, fontStyle: 'italic' }}>Listening...</p>
          </div>
        )}
      </div>
    </div>
  )
}
