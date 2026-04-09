import { useState } from 'react'
import { PHRASE_PACKS } from '../../data/phrases'
import { useConversationStore } from '../../store/conversationStore'

export default function QuickPhrases() {
  const { speakerB } = useConversationStore()
  const [activePack, setActivePack] = useState('travel')
  const [spoken, setSpoken] = useState(null)

  const pack = PHRASE_PACKS.find(p => p.id === activePack)

  const handlePhrase = (phrase) => {
    setSpoken(phrase.en)

    // Use offline text from JSON first (no API needed)
    const text = phrase[speakerB.code] || phrase['hi'] || phrase.en

    // Speak using Web Speech API as offline fallback
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = speakerB.ttsLang || 'hi-IN'
      window.speechSynthesis.speak(utter)
    }

    setTimeout(() => setSpoken(null), 2000)
  }

  return (
    <div style={{ background: 'white', borderBottom: '0.5px solid #eee' }}>

      {/* Pack tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', padding: '8px 12px 0',
        gap: 6, borderBottom: '0.5px solid #f0f0f0' }}>
        {PHRASE_PACKS.map(pack => (
          <button
            key={pack.id}
            onClick={() => setActivePack(pack.id)}
            style={{
              flexShrink: 0, padding: '5px 12px', borderRadius: 20,
              border: '0.5px solid',
              borderColor: activePack === pack.id ? pack.color : '#eee',
              background: activePack === pack.id ? pack.color : 'transparent',
              color: activePack === pack.id ? pack.text : '#888',
              fontSize: 11, fontWeight: 500, cursor: 'pointer',
              whiteSpace: 'nowrap', marginBottom: 8,
            }}>
            {pack.icon} {pack.label}
          </button>
        ))}
      </div>

      {/* Phrases */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto',
        padding: '10px 12px', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#bbb', flexShrink: 0,
          textTransform: 'uppercase', letterSpacing: '0.05em' }}>offline</span>
        {pack.phrases.map((phrase, i) => {
          const translated = phrase[speakerB.code] || phrase['hi']
          const isActive = spoken === phrase.en
          return (
            <button
              key={i}
              onClick={() => handlePhrase(phrase)}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 20,
                border: '0.5px solid',
                borderColor: isActive ? pack.text : '#e0e0e0',
                background: isActive ? pack.color : 'white',
                color: isActive ? pack.text : '#333',
                fontSize: 12, cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}>
              {translated || phrase.en}
            </button>
          )
        })}
      </div>
    </div>
  )
}
