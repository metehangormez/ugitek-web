/**
 * Netlify Blobs tabanlı depo — yayındaki sürüm için.
 *
 * Her başvuru ayrı bir blob olarak saklanır: "<tür>/<id>".
 * Böylece iki kişi aynı anda form gönderdiğinde biri diğerinin üstüne yazamaz
 * (tek bir büyük JSON dosyası kullansaydık bu risk olurdu).
 *
 * Veri, site dağıtımlarından (deploy) bağımsız olarak kalıcıdır.
 */

import { getStore } from '@netlify/blobs';

const STORE_NAME = 'ugitek-basvurular';

/** Aynı anda en fazla `limit` iş çalıştırır (çok sayıda blob okurken). */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return out;
}

export function createBlobStore() {
  const store = getStore({ name: STORE_NAME, consistency: 'strong' });
  const keyOf = (type, id) => `${type}/${id}`;

  return {
    async listAll(type) {
      const { blobs } = await store.list({ prefix: `${type}/` });
      const rows = await mapLimit(blobs, 16, async (b) => {
        try {
          return await store.get(b.key, { type: 'json' });
        } catch {
          return null;
        }
      });
      return rows
        .filter(Boolean)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    },

    async getOne(type, id) {
      try {
        return await store.get(keyOf(type, id), { type: 'json' });
      } catch {
        return null;
      }
    },

    async putOne(type, id, row) {
      await store.setJSON(keyOf(type, id), row);
    },

    async delOne(type, id) {
      const existing = await this.getOne(type, id);
      if (!existing) return false;
      await store.delete(keyOf(type, id));
      return true;
    },
  };
}
