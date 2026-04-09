import { useEffect, useRef, useState } from 'react'
import { useConversationStore } from '../../store/conversationStore'
import { runPipeline } from '../../services/sarvam'
import { startRecording, stopRecording } from '../../utils/recorder'
import BubbleList from './BubbleList'
import SpeakerPanel from './SpeakerPanel'
import TextInputPanel from './TextInputPanel'
import QuickPhrases from './QuickPhrases'
import TravelMode from '../TravelMode'
import SummaryPanel from '../SummaryPanel'
import FormalityDialectBar from '../FormalityDialectBar'

export default function ConversationView() {
  const {
    speakerA, speakerB, messages, inputMode,
    isTravelMode, addMessage,
    toggleTravelMode, exportConversation, setInputMode,
  } = useConversationStore()

  const [recording, setRecording] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleRecord = async (side) => {
    if (recording) return
    setRecording(side)
    setError(null)
    await startRecording()
  }

  const handleStop = async (side) => {
    if (recording !== side) return
    setLoading(true)
    try {
      const audioBase64 = await stopRecording()
      const sourceLang = side === 'A' ? speakerA.code : speakerB.code
      const targetLang = side === 'A' ? speakerB.code : speakerA.code
      const result = await runPipeline({ audioBase64, sourceLang, targetLang })
      const audio = new Audio(`data:audio/wav;base64,${result.audioBase64}`)
      audio.play()
      addMessage({ side, ...result, mode: 'voice' })
    } catch (e) { setError(e.message || 'Translation failed. Try again.') }
    finally { setLoading(false); setRecording(null) }
  }

  if (isTravelMode) return <TravelMode onExit={toggleTravelMode} />

  const btn = (bg, color) => ({
    padding: '6px 12px', borderRadius: 8, border: '0.5px solid #ddd',
    background: bg, color, fontSize: 12, fontWeight: 500, cursor: 'pointer'
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh',
      background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', borderBottom: '0.5px solid #e5e5e5', background: 'white' }}>
        <h1 style={{ fontSize: 18, fontWeight: 600 }}>
          वाणी <span style={{ fontSize: 13, fontWeight: 400, color: '#888' }}>Vaani</span>
        </h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <SummaryPanel />
          <button onClick={toggleTravelMode} style={btn('#f0f0f0', '#333')}>✈ Travel</button>
          <button onClick={exportConversation} disabled={!messages.length}
            style={btn('#E6F1FB', '#0C447C')}>↓ Export</button>
        </div>
      </div>

      {/* Voice / Text toggle */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 16px',
        background: 'white', borderBottom: '0.5px solid #eee' }}>
        {['voice', 'text'].map(mode => (
          <button key={mode} onClick={() => setInputMode(mode)} style={{
            padding: '5px 16px', borderRadius: 20, border: '0.5px solid',
            borderColor: inputMode === mode ? '#378ADD' : '#ddd',
            background: inputMode === mode ? '#E6F1FB' : 'white',
            color: inputMode === mode ? '#0C447C' : '#888',
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>
            {mode === 'voice' ? '🎙 Voice' : '⌨ Text'}
          </button>
        ))}
      </div>

      {/* Formality + Dialect bar */}
      <FormalityDialectBar />

      {/* Input panels */}
      {inputMode === 'voice'
        ? <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
            borderBottom: '0.5px solid #eee', background: 'white' }}>
            <SpeakerPanel side="A" onRecord={handleRecord} onStop={handleStop}
              isRecording={recording === 'A'} isLoading={loading} />
            <div style={{ width: '0.5px', background: '#eee' }} />
            <SpeakerPanel side="B" onRecord={handleRecord} onStop={handleStop}
              isRecording={recording === 'B'} isLoading={loading} />
          </div>
        : <TextInputPanel />
      }

      {/* Quick phrases */}
      <QuickPhrases />

      {error && <p style={{ color: '#E24B4A', fontSize: 13, padding: '8px 20px' }}>{error}</p>}

      {/* Chat bubbles */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px',
        display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#ccc', marginTop: 60 }}>
            <p style={{ fontSize: 40, marginBottom: 8 }}>🇮🇳</p>
            <p style={{ fontSize: 14 }}>Start speaking or typing to translate</p>
          </div>
        )}
        <BubbleList messages={messages} />
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
