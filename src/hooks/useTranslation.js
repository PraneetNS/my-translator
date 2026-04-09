import { useState, useCallback } from 'react'
import useHistory from './useHistory'

export default function useTranslation() {
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { addEntry } = useHistory()

  const translate = useCallback(async (text, targetLang) => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)

    try {
      console.log('Translating with Google Translate:', text, 'to', targetLang)
      
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang.toLowerCase()}&dt=t&q=${encodeURIComponent(text)}`
      
      const res = await fetch(url)

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`)
      }

      const data = await res.json()
      
      // Google Translate returns data as [[[translatedText, originalText, ...], ...], ...]
      // We need to join all segments in case of multi-line text
      const translation = data[0].map(item => item[0]).join('')

      console.log('Google Translate result:', translation)
      setTranslatedText(translation)
      
      // Save to history
      addEntry({ original: text, translated: translation, targetLang })
      
      return translation
    } catch (err) {
      console.error('Translation error:', err)
      setError(`Translation failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [addEntry])

  return { translatedText, loading, error, translate }
}
