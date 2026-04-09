import { useConversationStore } from '../../store/conversationStore'

export default function BubbleList({ messages }) {
  const { speakerA, speakerB } = useConversationStore()

  return messages.map(msg => {
    const isA = msg.side === 'A'
    const speaker = isA ? speakerA : speakerB
    const bg = isA ? '#E6F1FB' : '#E1F5EE'
    const accent = isA ? '#0C447C' : '#085041'
    const badgeBg = isA ? '#B5D4F4' : '#9FE1CB'
    const badgeColor = isA ? '#042C53' : '#04342C'

    return (
      <div key={msg.id} style={{
        alignSelf: isA ? 'flex-start' : 'flex-end',
        maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: 4
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 4 }}>
          <span style={{ fontSize: 11, color: '#aaa' }}>
            {speaker.label} · {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span style={{
            fontSize: 9, padding: '1px 6px', borderRadius: 10,
            background: badgeBg, color: badgeColor, fontWeight: 500,
          }}>
            {msg.mode === 'text' ? '⌨ text' : '🎙 voice'}
          </span>
        </div>
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
