import { useState } from 'react'
import TextTranslator from './components/TextTranslator'
import LiveTranslator from './components/LiveTranslator'

export default function App() {
  const [tab, setTab] = useState('text')

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: '1.5rem' }}>
        Translator
      </h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
        {['text', 'live'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '6px 18px',
              borderRadius: 8,
              border: '0.5px solid',
              borderColor: tab === t ? '#378ADD' : '#ccc',
              background: tab === t ? '#E6F1FB' : 'white',
              color: tab === t ? '#0C447C' : '#555',
              cursor: 'pointer',
              fontWeight: tab === t ? 500 : 400,
            }}
          >
            {t === 'text' ? 'Text' : 'Live mic'}
          </button>
        ))}
      </div>

      {tab === 'text' ? <TextTranslator /> : <LiveTranslator />}
    </div>
  )
}
