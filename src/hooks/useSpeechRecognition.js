import { useState, useRef, useCallback } from 'react'

export default function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const startListening = useCallback((sourceLang = 'en-US') => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return alert('Use Chrome — Speech Recognition not supported here')

    const recognition = new SpeechRecognition()
    recognition.lang = sourceLang
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(text)
    }

    recognition.onend = () => setListening(false)
    recognition.start()
    recognitionRef.current = recognition
    setListening(true)
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  return { transcript, listening, startListening, stopListening }
}
