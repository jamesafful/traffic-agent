
import React from 'react'
import embed from 'vega-embed'
import maplibregl from 'maplibre-gl'

export default function ResultPane({ result }: { result: any }) {
  const chartRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<HTMLDivElement>(null)
  const mapObj = React.useRef<any>(null)

  React.useEffect(() => {
    if (!result) return
    if (result.type === 'chart' && chartRef.current) {
      embed(chartRef.current, result.spec, { actions: false })
    }
    if (result.type === 'map' && mapRef.current) {
      if (mapObj.current) {
        mapObj.current.remove()
        mapObj.current = null
      }
      const map = new maplibregl.Map({
        container: mapRef.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [-87.62, 41.88],
        zoom: 9
      })
      map.on('load', () => {
        map.addSource('pts', { type: 'geojson', data: result.geojson })
        map.addLayer({ id: 'pt', type: 'circle', source: 'pts', paint: { 'circle-radius': 5 }})
      })
      mapObj.current = map
    }
  }, [result])

  if (!result) return <div className="card">Ask something to see results.</div>

  if (result.type === 'text') return <div className="card">{result.content}</div>

  if (result.type === 'table') {
    const rows: any[] = result.rows || []
    if (!rows.length) return <div className="card">No rows.</div>
    const cols = Object.keys(rows[0])
    return (
      <div className="card">
        <table>
          <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i}>{cols.map(c => <td key={c}>{String((r as any)[c])}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (result.type === 'chart') return <div className="card"><div id="chart" ref={chartRef} /></div>
  if (result.type === 'map') return <div className="card"><div id="map" ref={mapRef} /></div>

  return <div className="card">Unknown result.</div>
}
