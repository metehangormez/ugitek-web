/**
 * UGİTEK — yerel geliştirme sunucusu
 *
 * Yayındaki sürüm Netlify Functions üzerinde çalışır
 * (netlify/functions/api.mjs). Bu dosya aynı API'yi bilgisayarınızda,
 * verileri data/ klasöründeki JSON dosyalarında tutarak çalıştırır.
 *
 *   npm start      -> http://localhost:3000
 */

import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { createApi } from './lib/api.mjs';
import { createFileStore } from './lib/store-fs.mjs';
import { parseCookies } from './lib/core.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ugitek2026';
const DATA_DIR = path.join(__dirname, 'data');

/** Oturum anahtarı: ortamdan gelmezse üretilip data/.secret içine yazılır. */
function loadSecret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  const file = path.join(DATA_DIR, '.secret');
  try {
    return fs.readFileSync(file, 'utf8').trim();
  } catch {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    const generated = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(file, generated, 'utf8');
    return generated;
  }
}

const handle = createApi({
  store: createFileStore(DATA_DIR),
  adminPassword: ADMIN_PASSWORD,
  secret: loadSecret(),
});

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '64kb' }));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

app.all(/^\/api\//, async (req, res) => {
  let result;
  try {
    result = await handle({
      method: req.method,
      path: req.path,
      body: req.body,
      cookies: parseCookies(req.headers.cookie),
      ip: req.ip || 'unknown',
    });
  } catch (err) {
    console.error('[ugitek] api hatası:', err);
    return res.status(500).json({ ok: false, error: 'Beklenmeyen bir hata oluştu.' });
  }

  if (result.setCookie) {
    const { name, value, maxAgeSec } = result.setCookie;
    if (maxAgeSec === 0) res.clearCookie(name);
    else res.cookie(name, value, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: maxAgeSec * 1000,
      secure: req.secure,
    });
  }

  if (result.headers) {
    for (const [k, v] of Object.entries(result.headers)) res.setHeader(k, v);
  }

  if (result.text !== undefined) return res.status(result.status).send(result.text);
  return res.status(result.status).json(result.json);
});

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ ok: false, error: 'Bulunamadı.' });
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`\n  UGİTEK  ->  http://localhost:${PORT}`);
  console.log(`  Admin   ->  http://localhost:${PORT}/admin`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log('\n  !  ADMIN_PASSWORD tanımlı değil, varsayılan şifre kullanılıyor: ugitek2026\n');
  }
});
