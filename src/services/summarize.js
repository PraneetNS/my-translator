export async function summarizeConversation(messages, speakerA, speakerB) {
  if (messages.length < 2) return null

  const transcript = messages.map(m =>
    `${m.side === 'A' ? speakerA.label : speakerB.label}: ${m.transcript} → ${m.translatedText}`
  ).join('\n')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: `You are summarizing multilingual conversations for an Indian language translation app called Vaani. 
Be concise, culturally aware, and practical. Always respond in English.`
        },
        {
          role: 'user',
          content: `Summarize this conversation between ${speakerA.label} and ${speakerB.label} speakers:

${transcript}

Provide:
1. A 2-3 sentence summary of what was discussed
2. Key topics (max 4 bullet points)  
3. Any action items or unresolved questions

Keep it short and practical.`
        }
      ]
    })
  })

  const data = await res.json()
  return data.choices[0].message.content
}
