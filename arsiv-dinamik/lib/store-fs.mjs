/**
 * Dosya tabanlı depo — yerel geliştirme için.
 *
 * Kayıtlar data/<tür>.json içinde bir dizi olarak tutulur.
 * Aynı anda yazmalar sıraya alınır, yazma geçici dosya üzerinden atomiktir.
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const FILES = {
  membership: 'membership.json',
  staff: 'staff.json',
  suggestion: 'suggestions.json',
};

export function createFileStore(dataDir) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const queue = new Map();
  const fileOf = (type) => path.join(dataDir, FILES[type]);

  async function readAll(type) {
    try {
      const parsed = JSON.parse(await fsp.readFile(fileOf(type), 'utf8'));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeAll(type, rows) {
    const prev = queue.get(type) || Promise.resolve();
    const next = prev.then(async () => {
      const tmp = `${fileOf(type)}.${process.pid}.tmp`;
      await fsp.writeFile(tmp, JSON.stringify(rows, null, 2), 'utf8');
      await fsp.rename(tmp, fileOf(type));
    });
    queue.set(type, next.catch(() => {}));
    return next;
  }

  return {
    async listAll(type) {
      const rows = await readAll(type);
      return rows.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    },

    async getOne(type, id) {
      const rows = await readAll(type);
      return rows.find((r) => r.id === id) || null;
    },

    async putOne(type, id, row) {
      const rows = await readAll(type);
      const idx = rows.findIndex((r) => r.id === id);
      if (idx > -1) rows[idx] = row;
      else rows.unshift(row);
      await writeAll(type, rows);
    },

    async delOne(type, id) {
      const rows = await readAll(type);
      const next = rows.filter((r) => r.id !== id);
      if (next.length === rows.length) return false;
      await writeAll(type, next);
      return true;
    },
  };
}
