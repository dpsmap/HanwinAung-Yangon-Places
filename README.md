# Yangon Travel Directory

This repository runs a Vue + Express full-stack app with remote place data from `https://api2.dpsmap.com` and vector search via `https://api.dpsmap.com`.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Start the app:
   `npm run dev`
3. Open in your browser:
   `http://localhost:3000`

## Notes

- Place data is loaded from `https://api2.dpsmap.com/places` through the Express backend.
- Vector search uses `https://api.dpsmap.com` by default.
- No local database or `.env` file is required for normal app usage.
