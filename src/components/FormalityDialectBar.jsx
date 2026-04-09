import { useConversationStore } from '../store/conversationStore'

const FORMALITY_OPTIONS = [
  { value: 'very_formal', label: 'आदरणीय', sublabel: 'Very formal' },
  { value: 'formal',      label: 'आप',     sublabel: 'Formal' },
  { value: 'informal',    label: 'तुम',    sublabel: 'Informal' },
]

const DIALECT_OPTIONS = [
  { value: 'standard',   label: 'Standard' },
  { value: 'delhi',      label: 'Delhi' },
  { value: 'mumbai',     label: 'Mumbai' },
  { value: 'bengaluru',  label: 'Bengaluru' },
  { value: 'hyderabad',  label: 'Hyderabad' },
  { value: 'kolkata',    label: 'Kolkata' },
  { value: 'chennai',    label: 'Chennai' },
]

export default function FormalityDialectBar() {
  const { formality, dialect, setFormality, setDialect } = useConversationStore()

  return (
    <div style={{ display: 'flex', gap: 16, padding: '8px 16px',
      background: '#fafafa', borderBottom: '0.5px solid #eee',
      alignItems: 'center', overflowX: 'auto' }}>

      <span style={{ fontSize: 11, color: '#bbb', flexShrink: 0,
        textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tone</span>

      {FORMALITY_OPTIONS.map(opt => (
        <button key={opt.value} onClick={() => setFormality(opt.value)} style={{
          flexShrink: 0, padding: '4px 12px', borderRadius: 20,
          border: '0.5px solid',
          borderColor: formality === opt.value ? '#534AB7' : '#e0e0e0',
          background: formality === opt.value ? '#EEEDFE' : 'white',
          color: formality === opt.value ? '#3C3489' : '#666',
          fontSize: 12, cursor: 'pointer', display: 'flex',
          flexDirection: 'column', alignItems: 'center', gap: 0,
        }}>
          <span style={{ fontWeight: 500 }}>{opt.label}</span>
          <span style={{ fontSize: 10, opacity: 0.7 }}>{opt.sublabel}</span>
        </button>
      ))}

      <div style={{ width: '0.5px', height: 28, background: '#eee', flexShrink: 0 }} />

      <span style={{ fontSize: 11, color: '#bbb', flexShrink: 0,
        textTransform: 'uppercase', letterSpacing: '0.06em' }}>City</span>

      {DIALECT_OPTIONS.map(opt => (
        <button key={opt.value} onClick={() => setDialect(opt.value)} style={{
          flexShrink: 0, padding: '5px 12px', borderRadius: 20,
          border: '0.5px solid',
          borderColor: dialect === opt.value ? '#1D9E75' : '#e0e0e0',
          background: dialect === opt.value ? '#E1F5EE' : 'white',
          color: dialect === opt.value ? '#085041' : '#666',
          fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          {opt.label}
        </button>
      ))}
    </div>
  )
}
