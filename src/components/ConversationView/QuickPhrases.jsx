import { useState } from 'react'
import { useConversationStore } from '../../store/conversationStore'
import { translateText } from '../../services/bhashini'

const BASE_PHRASES = [
  'Hello', 'Thank you', 'How much?',
  'Where is...?', 'Please help', "I don't understand",
  'Repeat please', 'Yes', 'No',
]

export default function QuickPhrases() {
  const { speakerB, pipelineConfig } = useConversationStore()
  const [translated, setTranslated] = useState({})
  const [loading, setLoading] = useState({})

  const handlePhrase = async (phrase) => {
    if (translated[phrase]) return // already translated; just show it
    if (!pipelineConfig) return

    setLoading(prev => ({ ...prev, [phrase]: true }))
    try {
      const result = await translateText({
        text: phrase,
        sourceLang: 'en',
        targetLang: speakerB.code,
        serviceId: pipelineConfig?.pipelineResponseConfig?.[1]?.config?.[0]?.serviceId,
      })
      setTranslated(prev => ({ ...prev, [phrase]: result }))
    } catch (e) {
      console.warn('Quick phrase translation failed:', e)
    } finally {
      setLoading(prev => ({ ...prev, [phrase]: false }))
    }
  }

  return (
    <div style={{
      padding: '10px 16px',
      borderBottom: '0.5px solid #eee',
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      background: 'white',
    }}>
      {BASE_PHRASES.map(phrase => (
        <button
          key={phrase}
          onClick={() => handlePhrase(phrase)}
          style={{
            flexShrink: 0,
            padding: '6px 14px',
            borderRadius: 20,
            border: '0.5px solid',
            borderColor: translated[phrase] ? '#378ADD' : '#ddd',
            background: translated[phrase] ? '#E6F1FB' : 'white',
            fontSize: 12,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            color: translated[phrase] ? '#0C447C' : '#333',
            opacity: loading[phrase] ? 0.5 : 1,
          }}
          title={translated[phrase] ? `${phrase} → ${translated[phrase]}` : `Translate "${phrase}"`}
        >
          {loading[phrase] ? '…' : translated[phrase] ? translated[phrase] : phrase}
        </button>
      ))}
    </div>
  )
}
