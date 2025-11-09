
export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response('', { headers: cors() })
    if (req.method !== 'POST') return new Response('POST /chat only', { status: 405, headers: cors() })

    const { messages } = await req.json()

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages
      })
    })

    return new Response(r.body, { headers: { ...cors(), 'Content-Type': 'application/json' }})
  }
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
}
