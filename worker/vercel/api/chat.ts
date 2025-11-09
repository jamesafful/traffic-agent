
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('POST only')
  const { messages } = req.body || {}
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: 'gpt-4o-mini', temperature: 0.2, messages })
  })
  const data = await r.text()
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(data)
}
