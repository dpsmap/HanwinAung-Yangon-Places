import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import app from './api/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

async function startServer() {
  if (!isProd) {
    // Development mode: Create Vite Dev Server as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    // Serve index.html dynamically with hot-reloading support
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const templatePath = path.resolve(__dirname, 'index.html');
        let html = fs.readFileSync(templatePath, 'utf-8');
        html = await vite.transformIndexHtml(url, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // Production mode: Serve pre-compiled static distribution files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [Full-Stack API] Server active on http://0.0.0.0:${PORT} [Prod: ${isProd}]`);
  });
}

startServer();
