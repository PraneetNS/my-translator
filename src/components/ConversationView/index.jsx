import { useEffect, useRef, useState } from 'react'
import { useConversationStore } from '../../store/conversationStore'
import { runPipeline } from '../../services/sarvam'
import { startRecording, stopRecording } from '../../utils/recorder'
import BubbleList from './BubbleList'
import SpeakerPanel from './SpeakerPanel'
import QuickPhrases from './QuickPhrases'
import TravelMode from '../TravelMode'
import SummaryPanel from '../SummaryPanel'

export default function ConversationView() {
  const {
    speakerA, speakerB, messages,
    addMessage,
    toggleTravelMode, isTravelMode,
    exportConversation, clearMessages,
  } = useConversationStore()

  const [recording, setRecording] = useState(null)  // 'A' | 'B' | null
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initStatus, setInitStatus] = useState('idle') // 'idle' | 'loading' | 'done' | 'error'
  const bottomRef = useRef(null)

  // Sarvam AI does not require pre-fetching pipeline config, we can start right away.

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleRecord = async (side) => {
    if (recording || loading) return
    setError(null)
    setRecording(side)
    try {
      await startRecording()
    } catch {
      setError('Microphone access denied.')
      setRecording(null)
    }
  }

  const handleStop = async (side) => {
    if (recording !== side) return
    setLoading(true)
    setRecording(null)
    try {
      const audioBase64 = await stopRecording()
      if (!audioBase64) throw new Error('No audio captured')

      const sourceLang = side === 'A' ? speakerA.code : speakerB.code
      const targetLang = side === 'A' ? speakerB.code : speakerA.code

      const result = await runPipeline({ audioBase64, sourceLang, targetLang })

      // Play translated audio
      const audio = new Audio(`data:audio/wav;base64,${result.audioBase64}`)
      audio.play()

      addMessage({ side, ...result })
    } catch (e) {
      setError(e.message || 'Translation failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (isTravelMode) return <TravelMode onExit={toggleTravelMode} />

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      background: '#f5f5f5', fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', borderBottom: '1px solid #e5e5e5',
        background: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>वाणी</h1>
          <span style={{ fontSize: 13, color: '#aaa', fontWeight: 400 }}>Vaani</span>
          {initStatus === 'done' || initStatus === 'idle' ? (
            <span style={{ fontSize: 11, color: '#1D9E75', background: '#E1F5EE', padding: '2px 8px', borderRadius: 12 }}>
              Ready
            </span>
          ) : null}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={clearMessages} style={pillBtn('#f5f5f5', '#555')}>
            🗑 Clear
          </button>
          <button onClick={toggleTravelMode} style={pillBtn('#f0f0f0', '#333')}>
            ✈ Travel
          </button>
          <SummaryPanel />
          <button
            onClick={exportConversation}
            disabled={!messages.length}
            style={pillBtn('#E6F1FB', '#0C447C', !messages.length)}>
            ↓ Export
          </button>
        </div>
      </div>

      {/* ── Speaker panels ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1px 1fr',
        borderBottom: '1px solid #e5e5e5', background: 'white',
      }}>
        <SpeakerPanel side="A" onRecord={handleRecord} onStop={handleStop}
          isRecording={recording === 'A'} isLoading={loading} />
        <div style={{ background: '#e5e5e5' }} />
        <SpeakerPanel side="B" onRecord={handleRecord} onStop={handleStop}
          isRecording={recording === 'B'} isLoading={loading} />
      </div>

      {/* ── Quick phrases ── */}
      <QuickPhrases />

      {/* ── Error banner ── */}
      {error && (
        <div style={{ padding: '8px 20px', background: '#FFF3F3', borderBottom: '1px solid #FCC' }}>
          <p style={{ color: '#E24B4A', fontSize: 13, margin: 0 }}>⚠ {error}</p>
        </div>
      )}

      {/* ── Chat area ── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#ccc', marginTop: 60 }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🇮🇳</p>
            <p style={{ fontSize: 15 }}>Hold a speaker button and speak</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>
              {speakerA.label} ↔ {speakerB.label}
            </p>
          </div>
        )}
        <BubbleList messages={messages} />
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

const pillBtn = (bg, color, disabled = false) => ({
  padding: '6px 14px', borderRadius: 8,
  border: '1px solid #e0e0e0',
  background: disabled ? '#f9f9f9' : bg,
  color: disabled ? '#ccc' : color,
  fontSize: 12, fontWeight: 500,
  cursor: disabled ? 'not-allowed' : 'pointer',
})
