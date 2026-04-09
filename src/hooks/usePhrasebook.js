import { useState } from 'react'

export default function usePhrasebook() {
  const [phrases, setPhrases] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tx-phrasebook') || '[]') }
    catch { return [] }
  })

  const togglePhrase = (entry) => {
    const exists = phrases.find(p => p.original === entry.original && p.targetLang === entry.targetLang)
    let updated
    if (exists) {
      updated = phrases.filter(p => !(p.original === entry.original && p.targetLang === entry.targetLang))
    } else {
      updated = [{ ...entry, time: Date.now() }, ...phrases]
    }
    setPhrases(updated)
    localStorage.setItem('tx-phrasebook', JSON.stringify(updated))
  }

  const isStarred = (original, targetLang) => {
    return !!phrases.find(p => p.original === original && p.targetLang === targetLang)
  }

  return { phrases, togglePhrase, isStarred }
}
