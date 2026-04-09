import { create } from 'zustand'

export const useConversationStore = create((set, get) => ({
  messages: [],
  speakerA: { code: 'hi', label: 'Hindi', script: 'हिन्दी', ttsLang: 'hi-IN' },
  speakerB: { code: 'ta', label: 'Tamil', script: 'தமிழ்', ttsLang: 'ta-IN' },
  pipelineConfig: null,
  isTravelMode: false,
  inputMode: 'voice', // 'voice' | 'text'
  formality: 'formal', // 'formal' | 'informal' | 'very_formal'
  dialect: 'standard', // 'standard' | 'mumbai' | 'delhi' | 'bengaluru' | 'hyderabad'

  setSpeaker: (side, lang) => set(() => ({
    [side === 'A' ? 'speakerA' : 'speakerB']: lang
  })),

  addMessage: (msg) => set(state => ({
    messages: [...state.messages, { ...msg, id: Date.now(), time: new Date() }]
  })),

  clearMessages: () => set({ messages: [] }),
  toggleTravelMode: () => set(state => ({ isTravelMode: !state.isTravelMode })),
  setPipelineConfig: (config) => set({ pipelineConfig: config }),
  setInputMode: (mode) => set({ inputMode: mode }),
  setFormality: (f) => set({ formality: f }),
  setDialect: (d) => set({ dialect: d }),

  exportConversation: () => {
    const { messages, speakerA, speakerB } = get()
    const text = messages.map(m =>
      `[${m.side === 'A' ? speakerA.label : speakerB.label}]\n` +
      `Original: ${m.transcript}\n` +
      `Translated: ${m.translatedText}\n`
    ).join('\n---\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `vaani-${Date.now()}.txt`
    a.click()
  }
}))
