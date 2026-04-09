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
      model: 'llama3-70b-8192',
      messages: [{
        role: 'user',
        content: `You are summarizing a multilingual conversation between two people using a translation app.

Here is the conversation transcript (format: Speaker: original → translated):
${transcript}

Please provide:
1. A 2-3 sentence summary of what was discussed
2. Key topics covered (as a short bullet list, max 4 items)
3. Any unresolved questions or action items if present

Keep it concise and practical. Respond in English.`
      }]
    })
  })

  if (!res.ok) {
     const errorBody = await res.json().catch(() => ({}));
     throw new Error(`Groq API Error: ${errorBody?.error?.message || res.statusText}`);
  }

  const data = await res.json()
  return data.choices[0].message.content
}
