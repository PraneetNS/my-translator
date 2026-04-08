import { LANGUAGES } from '../utils/languages'

export default function LanguageSelector({ value, onChange, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <span style={{ fontSize: 12, color: '#888' }}>{label}</span>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '7px 10px',
          borderRadius: 8,
          border: '0.5px solid #ccc',
          fontSize: 14,
          background: 'white',
          cursor: 'pointer',
        }}
      >
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
        ))}
      </select>
    </div>
  )
}
