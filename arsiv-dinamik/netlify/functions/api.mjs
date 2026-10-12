/**
 * UGİTEK — Netlify Function
 *
 * /api/* altındaki tüm istekleri karşılar. Veriyi Netlify Blobs'ta saklar,
 * yani site yeniden yayınlansa bile başvurular kaybolmaz.
 *
 * Ortam değişkenleri (Netlify panelinde ayarlanır):
 *   ADMIN_PASSWORD  — yönetim paneli şifresi (zorunlu)
 *   SESSION_SECRET  — oturum imzalama anahtarı (zorunlu)
 */

import { createApi } from '../../lib/api.mjs';
import { createBlobStore } from '../../lib/store-blobs.mjs';
import { parseCookies } from '../../lib/core.mjs';

export const config = { path: '/api/*' };

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;

let handle;

function getHandler() {
  if (!handle) {
    handle = createApi({
      store: createBlobStore(),
      adminPassword: ADMIN_PASSWORD,
      secret: SESSION_SECRET,
    });
  }
  return handle;
}

function cookieHeader({ name, value, maxAgeSec }) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Secure',
    `Max-Age=${maxAgeSec}`,
  ];
  return parts.join('; ');
}

export default async function (request) {
  // Yanlış yapılandırmayı sessizce geçmektense açıkça söyle.
  if (!ADMIN_PASSWORD || !SESSION_SECRET) {
    return Response.json(
      { ok: false, error: 'Sunucu yapılandırması eksik: ADMIN_PASSWORD ve SESSION_SECRET tanımlanmalı.' },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  let body = {};
  if (request.method === 'POST' || request.method === 'PATCH') {
    try {
      body = await request.json();
    } catch {
      body = {};
    }
  }

  let result;
  try {
    result = await getHandler()({
      method: request.method,
      path: url.pathname,
      body,
      cookies: parseCookies(request.headers.get('cookie')),
      ip: request.headers.get('x-nf-client-connection-ip')
        || request.headers.get('x-forwarded-for')
        || 'unknown',
    });
  } catch (err) {
    console.error('[ugitek] api hatası:', err);
    return Response.json({ ok: false, error: 'Beklenmeyen bir hata oluştu.' }, { status: 500 });
  }

  const headers = new Headers(result.headers || {});
  if (result.setCookie) headers.set('Set-Cookie', cookieHeader(result.setCookie));

  if (result.text !== undefined) {
    return new Response(result.text, { status: result.status, headers });
  }

  headers.set('Content-Type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(result.json), { status: result.status, headers });
}
