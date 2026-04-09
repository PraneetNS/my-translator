import usePhrasebook from '../hooks/usePhrasebook'
import useTTS from '../hooks/useTTS'
import { LANGUAGES } from '../utils/languages'

export default function PhrasebookTab() {
  const { phrases, togglePhrase } = usePhrasebook()
  const { speak } = useTTS()

  const handleSpeak = (text, targetLang) => {
    const lang = LANGUAGES.find(l => l.code === targetLang)
    speak(text, lang?.ttsLang)
  }

  if (phrases.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
        Your phrasebook is empty. Star translations to save them here.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {phrases.map((item, i) => (
        <div key={i} style={{ padding: '12px', background: 'white', borderRadius: 8, border: '0.5px solid #378ADD' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 13, color: '#888' }}>{item.original}</p>
              <p style={{ fontSize: 15, fontWeight: 500, margin: '4px 0' }}>{item.translated}</p>
            </div>
            <button onClick={() => togglePhrase(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18 }}>
              ⭐
            </button>
          </div>
          <button onClick={() => handleSpeak(item.translated, item.targetLang)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>
            🔊
          </button>
        </div>
      ))}
    </div>
  )
}
