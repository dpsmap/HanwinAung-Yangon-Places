# Remote Data API Guide

This repository uses `https://api2.dpsmap.com` as the remote place-data source and `https://api.dpsmap.com` for vector search. The Node/Express backend proxies requests to those services so the frontend can stay simple.

---

## 🔗 Architecture

```text
                           Vue Frontend (Client)
                                    │
                  HTTP Requests (e.g. /api/places, /api/search)
                                    │
                       ┌────────────▼────────────┐
                       │   Node/Express Server   │  ← Unified Full-Stack Port 3000
                       │      (server.ts)        │
                       └────────────┬────────────┘
                                    │
                   Remote Data API   │   Vector Search API
                   api2.dpsmap.com   │   api.dpsmap.com
```

---

## 🔎 Data Source

- `/api/places` is proxied to `https://api2.dpsmap.com/places`.
- `api2.dpsmap.com` serves place data through a PostgREST-style JSON API.
- No local PostgreSQL instance or `DATABASE_URL` setting is required for normal app operation.

---

## 🚀 Run the App Locally

```bash
npm install
npm run dev
```

Then open:

```bash
http://localhost:3000
```

---

## 🔧 Notes

- Vector search routes through `https://api.dpsmap.com`.
- The backend does not depend on a direct database connection.
- If you want to point the app at a different vector backend, update the `vector search` URL in the app UI or by sending `x-vector-api-url`.
