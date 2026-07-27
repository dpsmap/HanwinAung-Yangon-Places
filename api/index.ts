import express from 'express';

const DEFAULT_DATA_API_URL = 'https://api2.dpsmap.com';
const DEFAULT_VECTOR_API_URL = 'https://api.dpsmap.com';

function normalizeApiUrl(rawUrl: string, fallback: string): string {
  const url = (rawUrl || fallback).trim().replace(/\/+$|\s+/g, '');
  return url || fallback;
}

// Vector search API (api.dpsmap.com) — Myanmar POI Vector Search API,
// exposes GET /api/health and POST /api/search ({ query, top_k } ->
// { results: [{ place_id, score }] }). Overridable via env/header for
// local testing against a different instance.

const app = express();
app.use(express.json());

// API Route: Fetch all places from the remote PostgREST data API.
app.get('/api/places', async (req, res) => {
  const dataApiUrl = normalizeApiUrl((req.headers['x-data-api-url'] as string) || DEFAULT_DATA_API_URL, DEFAULT_DATA_API_URL);

  try {
    // Forward any querystring from the incoming request to the remote data API
    const qsIndex = req.url.indexOf('?');
    const qs = qsIndex >= 0 ? req.url.substring(qsIndex) : '';
    const fetchUrl = `${dataApiUrl}/places${qs}`;
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      const details = await response.text();
      console.error(`[Express API] Data API returned ${response.status}: ${details}`);
      return res.status(response.status).json({
        error: 'Remote data API returned an error.',
        details: details || response.statusText,
      });
    }

    const rows = await response.json();
    if (!Array.isArray(rows)) {
      console.error('[Express API] Unexpected data API response format for /places.');
      return res.status(502).json({ error: 'Unexpected remote data format.' });
    }

    // If the incoming request supplied a numeric `limit` query param, enforce it
    // server-side in case the remote API ignores the parameter. This ensures
    // preview requests return a small payload quickly.
    const urlParts = req.url || '';
    const qsIndex2 = urlParts.indexOf('?');
    let clientLimit: number | null = null;
    if (qsIndex2 >= 0) {
      try {
        const rawQs = urlParts.substring(qsIndex2 + 1);
        const params = new URLSearchParams(rawQs);
        const l = params.get('limit') ?? params.get('LIMIT') ?? params.get('$limit');
        if (l) {
          const n = Number(l);
          if (!Number.isNaN(n) && isFinite(n) && n > 0) clientLimit = Math.floor(n);
        }
      } catch (e) {
        // ignore parse errors — we'll just return full rows
      }
    }

    const outRows = (clientLimit && Array.isArray(rows) && rows.length > clientLimit) ? rows.slice(0, clientLimit) : rows;
    console.log(`[Express API] Served ${rows.length} places from remote data API${clientLimit ? ` (sliced to ${outRows.length} for ?limit=${clientLimit})` : ''}.`);
    res.json(outRows);
  } catch (err: any) {
    console.error('[Express API] Failed to fetch places from remote data API:', err.message);
    res.status(502).json({ error: 'Remote data API unreachable', details: err.message });
  }
});

// API Route: Vector Search — proxies to api.dpsmap.com.
app.post('/api/search', async (req, res) => {
  const { query, top_k = 300 } = req.body;
  const queryText = (query || '').trim();

  if (!queryText) {
    return res.json({ results: [], engine: 'none' });
  }

  const vectorApiUrl = normalizeApiUrl((req.headers['x-vector-api-url'] as string) || DEFAULT_VECTOR_API_URL, DEFAULT_VECTOR_API_URL);
  try {
    // Enforce sensible server-side maximum to avoid accidental heavy requests
    const requestedTopK = Number(top_k) || 300;
    const topKClamped = Math.min(Math.max(requestedTopK, 1), 300);

    console.log(`[Express API] Proxying search query "${queryText}" to Vector Search API at ${vectorApiUrl} (top_k=${topKClamped})...`);
    const response = await fetch(`${vectorApiUrl}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Provide a browser-like User-Agent to coax richer JSON payloads from some CDNs/origins
        'User-Agent': 'Mozilla/5.0 (Node.js) YangonTravel/1.0'
      },
      body: JSON.stringify({ query: queryText, top_k: topKClamped })
    });

    if (!response.ok) {
      const details = await response.text();
      console.warn(`[Express API] Vector Search API returned ${response.status}: ${details}`);
      return res.status(response.status).json({
        error: 'Vector Search API returned an error.',
        details: details || response.statusText,
      });
    }

    const data = await response.json();
    // Enforce server-side top_k by slicing incoming results before normalization
    const resultsArray = Array.isArray(data.results) ? data.results.slice(0, topKClamped) : [];
    const normalizedResults = resultsArray.map((r: any) => ({
      // Normalize and canonicalize external IDs to match our `places` `poi_...` keys
      place_id: (() => {
        const raw = String(r.place_id ?? r.poi_id ?? r.id ?? '').trim();
        return /^[0-9]+$/.test(raw) ? `poi_${raw}` : raw;
      })(),
      score: Number(r.score) || 0.0,
      is_vector: true,
      // Preserve auxiliary fields to help frontend map external vector IDs to local places
      name: r.name ?? r.title ?? '',
      latitude: (typeof r.latitude === 'number') ? r.latitude : (typeof r.lat === 'number' ? r.lat : (r.latitude ? Number(r.latitude) : undefined)),
      longitude: (typeof r.longitude === 'number') ? r.longitude : (typeof r.lon === 'number' ? r.lon : (r.longitude ? Number(r.longitude) : undefined))
    })).filter((item: any) => item.place_id);

    // Final safety: ensure we never return more items than the clamped top_k
    const finalResults = normalizedResults.slice(0, topKClamped);

    console.log(`[Express API] Vector search returned ${finalResults.length} matches (clamped to ${topKClamped}).`);
    return res.json({
      results: finalResults,
      engine: 'vector-api-proxy'
    });
  } catch (err: any) {
    console.warn('[Express API] Vector Search API proxy failed:', err.message);
    return res.status(502).json({ error: 'Vector Search API unavailable', details: err.message });
  }
});

// API Route: Health Probe
app.get('/api/health', async (req, res) => {
  const dataApiUrl = normalizeApiUrl((req.headers['x-data-api-url'] as string) || DEFAULT_DATA_API_URL, DEFAULT_DATA_API_URL);
  const vectorApiUrl = normalizeApiUrl((req.headers['x-vector-api-url'] as string) || DEFAULT_VECTOR_API_URL, DEFAULT_VECTOR_API_URL);

  let dataConnected = false;
  let dataError: string | null = null;
  try {
    const response = await fetch(`${dataApiUrl}/places?limit=1`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (response.ok) {
      dataConnected = true;
    } else {
      dataError = `Data API returned ${response.status}`;
    }
  } catch (err: any) {
    dataError = err.message;
  }

  let vectorConnected = false;
  let vectorError: string | null = null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${vectorApiUrl}/api/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      vectorConnected = data?.status === 'healthy' || response.ok;
    } else {
      vectorError = `Vector API returned ${response.status}`;
    }
  } catch (err: any) {
    vectorError = err.message;
  }

  res.json({
    status: dataConnected || vectorConnected ? 'healthy' : 'unhealthy',
    data_api_connected: dataConnected,
    vector_api_connected: vectorConnected,
    errors: {
      data_api: dataError,
      vector_api: vectorError
    }
  });
});

// Catch-all for unmatched /api/* routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `No API route for ${req.method} ${req.path}` });
});

// Global error handler — guarantees a JSON body instead of a bare crash for
// any unexpected throw, and logs the real stack server-side.
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Express API] Unhandled error:', err);
  if (res.headersSent) return;
  res.status(500).json({ error: 'Internal server error', details: err?.message || String(err) });
});

export default app;
