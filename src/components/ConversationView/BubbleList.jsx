import { useConversationStore } from '../../store/conversationStore'

export default function BubbleList({ messages }) {
  const { speakerA, speakerB } = useConversationStore()

  if (!messages.length) return null

  return messages.map(msg => {
    const isA = msg.side === 'A'
    const speaker = isA ? speakerA : speakerB
    const bg = isA ? '#E6F1FB' : '#E1F5EE'
    const accent = isA ? '#0C447C' : '#085041'

    return (
      <div key={msg.id} style={{
        alignSelf: isA ? 'flex-start' : 'flex-end',
        maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: 4
      }}>
        <span style={{ fontSize: 11, color: '#aaa', paddingLeft: 4 }}>
          {speaker.label} · {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div style={{ background: bg, borderRadius: 14, padding: '12px 16px' }}>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{msg.transcript}</p>
          <p style={{ fontSize: 16, fontWeight: 500, color: accent, lineHeight: 1.6 }}>
            {msg.translatedText}
          </p>
        </div>
      </div>
    )
  })
}
