/**
 * UGİTEK — yerel önizleme sunucusu
 *
 *   npm start        ->  http://localhost:3000
 *
 * Site tamamen statiktir; bu betik yalnızca public/ klasörünü tarayıcıya
 * servis eder. Hiçbir dış paket kullanmaz (node_modules gerekmez).
 *
 * Not: Dosyaları çift tıklayıp doğrudan da açabilirsiniz, ama yerel sunucu
 * üzerinden bakmak gerçek sunucudaki davranışa daha yakındır.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', 'public');
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

function send(res, status, body, type) {
  res.writeHead(status, {
    'Content-Type': type || 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

http.createServer((req, res) => {
  let rel;
  try {
    rel = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    return send(res, 400, 'Hatalı adres.');
  }

  if (rel.endsWith('/')) rel += 'index.html';

  // Uzantısız adresleri de kabul et: /uye-ol -> uye-ol.html
  let file = path.join(ROOT, rel);
  if (!path.extname(file) && fs.existsSync(file + '.html')) file += '.html';

  // Klasörün dışına çıkılmasını engelle
  if (!file.startsWith(ROOT)) return send(res, 403, 'Erişim yok.');

  fs.readFile(file, (err, buf) => {
    if (err) {
      return fs.readFile(path.join(ROOT, '404.html'), (e2, page) => {
        if (e2) return send(res, 404, 'Sayfa bulunamadı.');
        send(res, 404, page, TYPES['.html']);
      });
    }
    send(res, 200, buf, TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
  });
}).listen(PORT, () => {
  console.log('\n  UGİTEK  ->  http://localhost:' + PORT);
  console.log('  Klasör  ->  public/\n');
});
