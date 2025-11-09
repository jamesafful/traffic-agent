
import React from 'react'
import { askAgent } from '../agent'

export default function Chat({ conn, setResult, disabled }: { conn: any, setResult: (r:any)=>void, disabled: boolean }) {
  const [input, setInput] = React.useState('Top 10 busiest sensors last Friday 4–6pm by volume')
  const [busy, setBusy] = React.useState(false)

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!input || !conn) return
    setBusy(true)
    try {
      const r = await askAgent(input, conn)
      setResult(r)
    } catch (err) {
      console.error(err)
      alert('Agent error; check console and proxy URL in .env')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card">
      <form className="inputRow" onSubmit={submit}>
        <input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask about traffic…" disabled={disabled || busy} />
        <button disabled={disabled || busy} type="submit">Ask</button>
      </form>
    </div>
  )
}
