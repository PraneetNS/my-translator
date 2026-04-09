import ConversationView from './components/ConversationView'
import SetupScreen from './components/SetupScreen'

const hasKeys =
  import.meta.env.VITE_SARVAM_API_KEY &&
  import.meta.env.VITE_SARVAM_API_KEY !== 'your_sarvam_api_key_here'

export default function App() {
  if (!hasKeys) return <SetupScreen />
  return <ConversationView />
}
