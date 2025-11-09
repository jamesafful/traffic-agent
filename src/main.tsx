
import React from 'react'
import { createRoot } from 'react-dom/client'
import Chat from './ui/Chat'
import ResultPane from './ui/ResultPane'
import { initDuck } from './duck'

function App() {
  const [conn, setConn] = React.useState<any>(null)
  const [result, setResult] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    (async () => {
      try {
        const c = await initDuck()
        setConn(c)
      } catch (e) {
        console.error(e)
        alert('DuckDB init failed. See console.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Traffic Agent</h2>
        <p style={{fontSize:12}}>Ask questions about the sample traffic data. Your API key stays on the proxy.</p>
        <Chat conn={conn} setResult={setResult} disabled={loading || !conn} />
        <div className="card">
          <strong>Examples</strong>
          <ul>
            <li>Top 10 busiest sensors last Friday 4–6pm by volume</li>
            <li>Map sensors with avg speed &lt; 25 mph during 8–9am today</li>
            <li>Compare occupancy percentiles by direction on I‑90 in October</li>
          </ul>
        </div>
      </div>
      <div className="content">
        <ResultPane result={result} />
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
