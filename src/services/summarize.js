export async function summarizeConversation(messages, speakerA, speakerB) {
  if (messages.length < 2) return null

  const transcript = messages.map(m =>
    `${m.side === 'A' ? speakerA.label : speakerB.label}: ${m.transcript} → ${m.translatedText}`
  ).join('\n')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
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
     throw new Error(`Anthropic API Error: ${errorBody?.error?.message || res.statusText}`);
  }

  const data = await res.json()
  return data.content[0].text
}
