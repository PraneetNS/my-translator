import { useState } from 'react'
import { summarizeConversation } from '../services/summarize'
import { useConversationStore } from '../store/conversationStore'

export default function SummaryPanel() {
  const { messages, speakerA, speakerB } = useConversationStore()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleSummarize = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const result = await summarizeConversation(messages, speakerA, speakerB)
      setSummary(result)
      setOpen(true)
    } catch (e) {
      setSummary(null)
      setErrorMsg(e.message || 'Failed to generate summary. Check your Groq API key.')
      setOpen(true)
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={handleSummarize}
        disabled={loading || messages.length < 2}
        style={{
          padding: '6px 14px', borderRadius: 8,
          border: '0.5px solid #ddd',
          background: loading ? '#f5f5f5' : '#EEEDFE',
          color: loading ? '#aaa' : '#3C3489',
          fontSize: 12, fontWeight: 500, cursor: 'pointer',
        }}>
        {loading ? '✦ Summarizing...' : '✦ AI Summary'}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 60, right: 20, zIndex: 100,
          width: 340, background: 'white', borderRadius: 14,
          border: '0.5px solid #ddd', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#3C3489' }}>
              ✦ Conversation summary
            </span>
            <button onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none',
                color: '#aaa', cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
          {summary ? (
             <p style={{ fontSize: 13, lineHeight: 1.7, color: '#333',
               whiteSpace: 'pre-wrap' }}>{summary}</p>
          ) : (
             <p style={{ fontSize: 13, lineHeight: 1.7, color: '#E24B4A',
               whiteSpace: 'pre-wrap' }}>{errorMsg}</p>
          )}
          {summary && (
             <button
               onClick={() => navigator.clipboard.writeText(summary)}
               style={{ marginTop: 12, fontSize: 12, color: '#888',
                 background: 'none', border: 'none', cursor: 'pointer' }}>
               📋 Copy summary
             </button>
          )}
        </div>
      )}
    </>
  )
}
