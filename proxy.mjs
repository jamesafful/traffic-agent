// proxy.mjs
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY env var'); process.exit(1);
}

/**
 * Minimal forwarder: POST /responses -> OpenAI Responses API
 * The frontend should POST the exact JSON it would send to OpenAI.
 */
app.post('/responses', async (req, res) => {
  try {
    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    res.status(r.status).set('Content-Type', r.headers.get('content-type') || 'application/json');
    res.send(await r.text());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'proxy_failed', details: String(err) });
  }
});

app.get('/', (_req, res) => res.send('OK'));
app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));
