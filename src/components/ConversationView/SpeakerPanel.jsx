import { useConversationStore } from '../../store/conversationStore'
import { INDIC_LANGUAGES } from '../../utils/languages'

export default function SpeakerPanel({ side, onRecord, onStop, isRecording, isLoading }) {
  const { speakerA, speakerB, setSpeaker } = useConversationStore()
  const speaker = side === 'A' ? speakerA : speakerB
  const color = side === 'A' ? '#378ADD' : '#1D9E75'

  return (
    <div style={{
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
    }}>
      <select
        value={speaker.code}
        onChange={e => {
          const lang = INDIC_LANGUAGES.find(l => l.code === e.target.value)
          setSpeaker(side, lang)
        }}
        style={{
          width: '100%', padding: '7px 10px', borderRadius: 8,
          border: '0.5px solid #ddd', fontSize: 13, background: 'white',
          cursor: 'pointer',
        }}
      >
        {INDIC_LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>{l.label} — {l.script}</option>
        ))}
      </select>

      <div style={{
        fontSize: 22, fontWeight: 500, color,
        letterSpacing: 1, textAlign: 'center', minHeight: 36
      }}>
        {speaker.script}
      </div>

      <button
        onMouseDown={() => onRecord(side)}
        onMouseUp={() => onStop(side)}
        onTouchStart={e => { e.preventDefault(); onRecord(side) }}
        onTouchEnd={e => { e.preventDefault(); onStop(side) }}
        disabled={isLoading}
        style={{
          width: '100%', padding: '14px 0', borderRadius: 10, border: 'none',
          background: isRecording ? color : '#f0f0f0',
          color: isRecording ? 'white' : '#555',
          fontSize: 13, fontWeight: 500,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
          userSelect: 'none',
        }}
      >
        {isLoading && !isRecording
          ? '⏳ Translating...'
          : isRecording
          ? '🔴 Recording… release to translate'
          : '🎙 Hold to speak'}
      </button>
    </div>
  )
}
