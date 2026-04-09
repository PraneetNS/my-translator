import useHistory from '../hooks/useHistory'
import useTTS from '../hooks/useTTS'
import { LANGUAGES } from '../utils/languages'

export default function HistoryTab() {
  const { history, clearHistory } = useHistory()
  const { speak } = useTTS()

  const handleSpeak = (text, targetLang) => {
    const lang = LANGUAGES.find(l => l.code === targetLang)
    speak(text, lang?.ttsLang)
  }

  if (history.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
        No translation history yet.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={clearHistory} style={{ alignSelf: 'flex-end', fontSize: 12, color: '#E24B4A', border: 'none', background: 'none', cursor: 'pointer' }}>
        Clear history
      </button>
      {history.map((item, i) => (
        <div key={i} style={{ padding: '12px', background: 'white', borderRadius: 8, border: '0.5px solid #ddd' }}>
          <p style={{ fontSize: 13, color: '#888' }}>{item.original}</p>
          <p style={{ fontSize: 15, fontWeight: 500, margin: '4px 0' }}>{item.translated}</p>
          <button onClick={() => handleSpeak(item.translated, item.targetLang)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>
            🔊
          </button>
        </div>
      ))}
    </div>
  )
}
