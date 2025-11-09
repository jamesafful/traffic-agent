
# Traffic Agent (Agentic Q&A for Traffic Data)

Ready-to-run in **GitHub Codespaces**. Frontend is Vite+React; the LLM key stays in a tiny proxy (Cloudflare Worker or Vercel).

## Run (Codespaces)
```bash
npm install
npm run dev
```

Set `VITE_PROXY_URL` in `.env` to your deployed proxy (or run wrangler dev).

## Deploy Proxy
### Cloudflare Worker
```bash
cd worker/cloudflare
npx wrangler secret put OPENAI_API_KEY
npx wrangler dev  # local, exposes http://127.0.0.1:8787
# npx wrangler deploy  # to deploy
```
Then set `.env` in project root:
```
VITE_PROXY_URL=http://127.0.0.1:8787
```

### Vercel
Deploy `worker/vercel/api/chat.ts` and set env `OPENAI_API_KEY`. Then:
```
VITE_PROXY_URL=https://<your>.vercel.app/api/chat
```

## Data
CSV samples are in `public/data/`. If you add Parquet files with matching names, the app auto-prefers Parquet.

Schema:
- stations: `sensor_id, lat, lon, road, direction`
- traffic: `sensor_id, ts, speed_kph, volume, occ`

Convert CSV → Parquet (optional):
```bash
duckdb -c "COPY (SELECT * FROM read_csv_auto('public/data/stations.csv')) TO 'public/data/stations.parquet' (FORMAT PARQUET);"
duckdb -c "COPY (SELECT * FROM read_csv_auto('public/data/traffic-2025-10.csv')) TO 'public/data/traffic-2025-10.parquet' (FORMAT PARQUET);"
duckdb -c "COPY (SELECT * FROM read_csv_auto('public/data/traffic-2025-11.csv')) TO 'public/data/traffic-2025-11.parquet' (FORMAT PARQUET);"
```
