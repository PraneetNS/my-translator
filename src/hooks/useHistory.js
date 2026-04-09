import { useState, useEffect } from 'react'

export default function useHistory() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tx-history') || '[]') }
    catch { return [] }
  })

  const addEntry = (entry) => {
    const updated = [{ ...entry, time: Date.now() }, ...history].slice(0, 100)
    setHistory(updated)
    localStorage.setItem('tx-history', JSON.stringify(updated))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('tx-history')
  }

  return { history, addEntry, clearHistory }
}
