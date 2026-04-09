import { useState } from 'react'
import { useConversationStore } from '../store/conversationStore'
import { runPipeline } from '../services/sarvam'
import { startRecording, stopRecording } from '../utils/recorder'

export default function TravelMode({ onExit }) {
  const { speakerA, speakerB } = useConversationStore()
  const [result, setResult] = useState(null)
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePress = async () => {
    setRecording(true)
    setResult(null)
    setError(null)
    try {
      await startRecording()
    } catch {
      setError('Microphone not accessible')
      setRecording(false)
    }
  }

  const handleRelease = async () => {
    if (!recording) return
    setLoading(true)
    setRecording(false)
    try {
      const audioBase64 = await stopRecording()
      if (!audioBase64) throw new Error('No audio captured')
      const res = await runPipeline({
        audioBase64,
        sourceLang: speakerA.code,
        targetLang: speakerB.code,
      })
      setResult(res)
      const audio = new Audio(`data:audio/wav;base64,${res.audioBase64}`)
      audio.play()
    } catch (e) {
      setError(e.message || 'Translation failed.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      height: '100vh', background: '#0d0d0d', color: 'white',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 32, gap: 40, position: 'relative',
    }}>
      <button
        onClick={onExit}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'transparent', border: '1px solid #333',
          color: '#aaa', padding: '7px 16px', borderRadius: 8,
          cursor: 'pointer', fontSize: 13,
        }}
      >
        ✕ Exit
      </button>

      {/* Speaker label */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 6, letterSpacing: 1 }}>
          SPEAKING IN
        </p>
        <p style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>{speakerA.script}</p>
        <p style={{ fontSize: 15, color: '#777', marginTop: 4 }}>{speakerA.label}</p>
      </div>

      {/* Result card */}
      {result && (
        <div style={{
          textAlign: 'center', padding: '28px 36px',
          background: '#1a1a1a', borderRadius: 20,
          maxWidth: 520, width: '100%',
          border: '1px solid #222',
        }}>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 10, letterSpacing: 1 }}>
            {speakerB.label.toUpperCase()} ({speakerB.script})
          </p>
          <p style={{ fontSize: 34, fontWeight: 600, lineHeight: 1.5, color: '#fff' }}>
            {result.translatedText}
          </p>
          <p style={{ fontSize: 13, color: '#555', marginTop: 12 }}>
            "{result.transcript}"
          </p>
        </div>
      )}

      {error && (
        <p style={{ color: '#E24B4A', fontSize: 14 }}>{error}</p>
      )}

      {/* Big hold button */}
      <button
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onTouchStart={e => { e.preventDefault(); handlePress() }}
        onTouchEnd={e => { e.preventDefault(); handleRelease() }}
        disabled={loading}
        style={{
          width: 140, height: 140, borderRadius: '50%', border: 'none',
          background: recording ? '#E24B4A' : loading ? '#444' : '#378ADD',
          color: 'white', fontSize: 15, fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'transform 0.1s, background 0.2s',
          transform: recording ? 'scale(1.12)' : 'scale(1)',
          boxShadow: recording ? '0 0 40px rgba(226,75,74,0.5)' : '0 0 20px rgba(55,138,221,0.3)',
          lineHeight: 1.4,
          userSelect: 'none',
        }}
      >
        {loading ? '⏳' : recording ? 'Release\nto send' : 'Hold\n& Speak'}
      </button>

      <p style={{ fontSize: 12, color: '#444', letterSpacing: 1 }}>
        HAND THIS SCREEN TO THE OTHER PERSON
      </p>
    </div>
  )
}
