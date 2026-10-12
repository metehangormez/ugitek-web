/**
 * UGİTEK — taşınabilir API katmanı
 *
 * Express'e de Netlify Function'a da bağımlı değildir: düz bir istek nesnesi
 * alır, düz bir yanıt nesnesi döndürür. Böylece aynı davranış hem yerelde
 * hem yayında geçerli olur.
 */

import {
  COOKIE_NAME, SESSION_HOURS, TYPES, STATUSES, CSV_COLUMNS,
  buildMembership, buildStaff, buildSuggestion, stamp,
  clean, newId, createToken, verifyToken, safeCompare, toCsv, rateLimit,
} from './core.mjs';

const json = (status, body, extra = {}) => ({ status, json: body, ...extra });

export function createApi({ store, adminPassword, secret }) {
  const isAdmin = (cookies) => verifyToken(cookies[COOKIE_NAME], secret);

  /**
   * @param {{method:string, path:string, body:object, cookies:object, ip:string}} req
   */
  return async function handle(req) {
    const { method, path, cookies = {}, ip = 'unknown' } = req;
    const body = req.body || {};

    /* ------------------------------------------------ başvuru uçları */

    if (method === 'POST' && path === '/api/applications/membership') {
      if (!rateLimit(`${ip}:membership`, { windowMs: 3600_000, max: 8 })) {
        return json(429, { ok: false, error: 'Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin.' });
      }
      const { errors, record } = buildMembership(body);
      if (errors) return json(400, { ok: false, errors });

      // Kimlik olarak öğrenci numarası kullanılır: mükerrer başvuru
      // tek bir okumayla, yarış koşulu olmadan yakalanır.
      const id = record.studentNo;
      if (await store.getOne('membership', id)) {
        return json(409, { ok: false, errors: { studentNo: 'Bu öğrenci numarasıyla zaten bir başvuru var.' } });
      }
      await store.putOne('membership', id, stamp(record, id));
      return json(200, { ok: true });
    }

    if (method === 'POST' && path === '/api/applications/staff') {
      if (!rateLimit(`${ip}:staff`, { windowMs: 3600_000, max: 8 })) {
        return json(429, { ok: false, error: 'Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin.' });
      }
      const { errors, record } = buildStaff(body);
      if (errors) return json(400, { ok: false, errors });

      const id = newId();
      await store.putOne('staff', id, stamp(record, id));
      return json(200, { ok: true, id });
    }

    if (method === 'POST' && path === '/api/suggestions') {
      if (!rateLimit(`${ip}:suggestion`, { windowMs: 3600_000, max: 12 })) {
        return json(429, { ok: false, error: 'Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin.' });
      }
      const { errors, record } = buildSuggestion(body);
      if (errors) return json(400, { ok: false, errors });

      const id = newId();
      await store.putOne('suggestion', id, stamp(record, id));
      return json(200, { ok: true, id });
    }

    if (method === 'GET' && path === '/api/stats') {
      const [m, s] = await Promise.all([store.listAll('membership'), store.listAll('suggestion')]);
      return json(200, { ok: true, members: m.length, suggestions: s.length });
    }

    /* --------------------------------------------------- admin oturumu */

    if (method === 'POST' && path === '/api/admin/login') {
      if (!rateLimit(`${ip}:login`, { windowMs: 900_000, max: 10 })) {
        return json(429, { ok: false, error: 'Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin.' });
      }
      if (!safeCompare(String(body.password ?? ''), adminPassword)) {
        return json(401, { ok: false, error: 'Şifre hatalı.' });
      }
      return json(200, { ok: true }, {
        setCookie: { name: COOKIE_NAME, value: createToken(secret), maxAgeSec: SESSION_HOURS * 3600 },
      });
    }

    if (method === 'POST' && path === '/api/admin/logout') {
      return json(200, { ok: true }, { setCookie: { name: COOKIE_NAME, value: '', maxAgeSec: 0 } });
    }

    if (method === 'GET' && path === '/api/admin/session') {
      return json(200, { ok: true, authenticated: isAdmin(cookies) });
    }

    /* ------------------------------------------------ korumalı uçlar */

    if (path.startsWith('/api/admin/')) {
      if (!isAdmin(cookies)) return json(401, { ok: false, error: 'Oturum gerekli.' });
    }

    if (method === 'GET' && path === '/api/admin/data') {
      const [membership, staff, suggestion] = await Promise.all(TYPES.map((t) => store.listAll(t)));
      return json(200, { ok: true, membership, staff, suggestion });
    }

    const item = path.match(/^\/api\/admin\/item\/([^/]+)\/(.+)$/);
    if (item) {
      const [, type, rawId] = item;
      const id = decodeURIComponent(rawId);
      if (!TYPES.includes(type)) return json(404, { ok: false, error: 'Bilinmeyen liste.' });

      if (method === 'DELETE') {
        const removed = await store.delOne(type, id);
        return removed ? json(200, { ok: true }) : json(404, { ok: false, error: 'Kayıt bulunamadı.' });
      }

      if (method === 'PATCH') {
        const row = await store.getOne(type, id);
        if (!row) return json(404, { ok: false, error: 'Kayıt bulunamadı.' });

        if (body.status !== undefined) {
          if (!STATUSES.includes(body.status)) return json(400, { ok: false, error: 'Geçersiz durum.' });
          row.status = body.status;
        }
        if (body.note !== undefined) row.note = clean(body.note, 800);

        await store.putOne(type, id, row);
        return json(200, { ok: true, item: row });
      }
    }

    const exp = path.match(/^\/api\/admin\/export\/([^/]+?)(?:\.csv)?$/);
    if (method === 'GET' && exp) {
      const type = exp[1];
      if (!TYPES.includes(type)) return json(404, { ok: false, error: 'Bilinmeyen liste.' });

      const rows = await store.listAll(type);
      const today = new Date().toISOString().slice(0, 10);
      return {
        status: 200,
        text: toCsv(rows, CSV_COLUMNS[type]),
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="ugitek-${type}-${today}.csv"`,
        },
      };
    }

    return json(404, { ok: false, error: 'Bulunamadı.' });
  };
}
