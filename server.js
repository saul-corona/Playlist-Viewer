const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;
const EXCLUDED = new Set(['package.json', 'package-lock.json', 'tsconfig.json']);
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (url.pathname === '/api/playlists') {
        const files = fs.readdirSync(ROOT)
            .filter(f => f.endsWith('.json') && !EXCLUDED.has(f))
            .map(f => ({ name: f.replace(/\.json$/i, '').replace(/[-_]/g, ' '), file: f }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(files));
        return;
    }

    const filePath = path.join(ROOT, url.pathname === '/' ? 'index.html' : url.pathname);
    const resolved = path.resolve(filePath);

    if (!resolved.startsWith(ROOT + path.sep) && resolved !== path.join(ROOT, 'index.html')) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(resolved, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        const ext = path.extname(resolved).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
}).listen(PORT, () => console.log(`Playlist Viewer → http://localhost:${PORT}`));
