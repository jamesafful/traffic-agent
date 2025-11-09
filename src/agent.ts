
const SYSTEM_PROMPT = `You are a traffic analyst agent interacting with a browser client.
You can: (1) write SQL for DuckDB over views stations(sensor_id, lat, lon, road, direction)
and traffic(sensor_id, ts, speed_kph, volume, occ), (2) design Vega-Lite charts, (3) produce
GeoJSON FeatureCollection for maps.

Always respond with a single JSON object with these shapes:
- {"action":"sql"}                          -> only SQL returned
- {"action":"sql+chart","sql": "...","chart": {<vega-lite-spec-without-data>}}
- {"action":"sql+map","sql":"...","map":{"type":"FeatureCollection",...}}
- {"action":"text","text":"..."}            -> when you cannot query without clarification

Rules:
- Use date_trunc for time binning; ts is UTC.
- Prefer LIMIT 200 unless the user asks for export.
- Chart specs should include encodings and titles/units, but omit 'data' (the client will inject rows).
- For maps, include Point features with [lon, lat].
- If ambiguous (e.g., 'last Friday'), assume the most recent such date relative to America/Chicago.`

const PROXY_URL = import.meta.env.VITE_PROXY_URL as string | undefined

export async function askAgent(userText: string, conn: any) {
  if (!PROXY_URL) {
    return { type: 'text', content: 'Proxy not configured. Set VITE_PROXY_URL in .env' }
  }

  const res = await fetch(PROXY_URL + '/chat', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ messages: [
      { role:'system', content: SYSTEM_PROMPT },
      { role:'user', content: userText }
    ]})
  })
  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) return { type: 'text', content: 'No response from model' }

  let plan: any
  try { plan = JSON.parse(content) } catch {
    return { type: 'text', content: content }
  }

  if (plan.action?.startsWith('sql')) {
    if (!plan.sql) return { type: 'text', content: 'Model did not return SQL' }
    const table = await conn.query(plan.sql)
    const rows = table.toArray().slice(0, 200)
    if (plan.action === 'sql') return { type: 'table', rows }
    if (plan.action === 'sql+chart' && plan.chart) {
      const spec = { data: { values: rows }, ...plan.chart }
      return { type: 'chart', spec }
    }
    if (plan.action === 'sql+map' && plan.map) {
      return { type: 'map', geojson: plan.map }
    }
    return { type: 'table', rows }
  }

  if (plan.action === 'text') return { type: 'text', content: plan.text || '...' }
  return { type: 'text', content: content }
}
