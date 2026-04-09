/**
 * SetupScreen — shown when Bhashini API keys are missing.
 * Guides user to register and add keys to their .env file.
 */
export default function SetupScreen() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fafafa',
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: 40,
      gap: 24,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 52 }}>🇮🇳</div>

      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#111' }}>वाणी</h1>
        <p style={{ fontSize: 14, color: '#aaa', marginTop: 4 }}>India's Indic Language Conversation Translator</p>
      </div>

      <div style={{
        background: 'white',
        border: '1px solid #e5e5e5',
        borderRadius: 16,
        padding: '28px 32px',
        maxWidth: 460,
        width: '100%',
        textAlign: 'left',
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#333' }}>
          🔑 Bhashini API Keys Required
        </h2>

        <ol style={{ fontSize: 13, color: '#555', lineHeight: 2, paddingLeft: 18, margin: 0 }}>
          <li>Visit <strong>bhashini.gov.in/ulca</strong> and register (free)</li>
          <li>Go to Dashboard → API Keys</li>
          <li>Copy your <strong>User ID</strong> and <strong>ULCA API Key</strong></li>
          <li>Open <code style={{ background: '#f5f5f5', padding: '1px 6px', borderRadius: 4 }}>.env</code> in the project root</li>
          <li>Paste the values:</li>
        </ol>

        <pre style={{
          background: '#1a1a1a',
          color: '#7EC8A4',
          padding: '14px 16px',
          borderRadius: 10,
          fontSize: 12,
          marginTop: 12,
          overflowX: 'auto',
          lineHeight: 1.8,
        }}>
{`VITE_BHASHINI_USER_ID=your_user_id
VITE_BHASHINI_API_KEY=your_ulca_api_key`}
        </pre>

        <p style={{ fontSize: 12, color: '#aaa', marginTop: 14 }}>
          Then restart the app with <code style={{ background: '#f5f5f5', padding: '1px 6px', borderRadius: 4 }}>npm run electron:dev</code>
        </p>
      </div>

      <p style={{ fontSize: 12, color: '#bbb', maxWidth: 360 }}>
        Bhashini is a Government of India initiative — free to use, no billing.
        Supports all 22 scheduled languages for STT, translation, and TTS.
      </p>
    </div>
  )
}
