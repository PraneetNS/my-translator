import ConversationView from './components/ConversationView'
import SetupScreen from './components/SetupScreen'

const hasKeys =
  import.meta.env.VITE_BHASHINI_USER_ID &&
  import.meta.env.VITE_BHASHINI_USER_ID !== 'your_bhashini_user_id_here' &&
  import.meta.env.VITE_BHASHINI_API_KEY &&
  import.meta.env.VITE_BHASHINI_API_KEY !== 'your_bhashini_ulca_api_key_here'

export default function App() {
  if (!hasKeys) return <SetupScreen />
  return <ConversationView />
}
