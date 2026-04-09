import travel from './travel.json'
import medical from './medical.json'
import food from './food.json'
import transport from './transport.json'
import shopping from './shopping.json'
import emergency from './emergency.json'

export const PHRASE_PACKS = [
  { id: 'travel',    label: 'Travel',     icon: '✈',  color: '#E6F1FB', text: '#0C447C', phrases: travel },
  { id: 'medical',   label: 'Medical',    icon: '🏥', color: '#FCEBEB', text: '#791F1F', phrases: medical },
  { id: 'food',      label: 'Food',       icon: '🍽',  color: '#FAEEDA', text: '#633806', phrases: food },
  { id: 'transport', label: 'Transport',  icon: '🚌', color: '#EAF3DE', text: '#27500A', phrases: transport },
  { id: 'shopping',  label: 'Shopping',   icon: '🛍',  color: '#EEEDFE', text: '#3C3489', phrases: shopping },
  { id: 'emergency', label: 'Emergency',  icon: '🚨', color: '#FCEBEB', text: '#A32D2D', phrases: emergency },
]
