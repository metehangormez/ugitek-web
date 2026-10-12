/**
 * UGİTEK — ortak iş mantığı
 *
 * Hem yerel Express sunucusu (server.js) hem de Netlify Function
 * (netlify/functions/api.mjs) bu dosyayı kullanır. Burada hiç dosya/ağ
 * işlemi yoktur; sadece doğrulama, oturum ve biçimlendirme.
 */

import crypto from 'node:crypto';

export const SESSION_HOURS = 8;
export const COOKIE_NAME = 'ugitek_admin';

export const TYPES = ['membership', 'staff', 'suggestion'];

export const CLASSES = [
  'Hazırlık', '1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf',
  '5. Sınıf', '6. Sınıf', 'Yüksek Lisans', 'Doktora', 'Mezun',
];

export const TEAMS = [
  'Sponsorluk Ekibi',
  'Teknik Gezi Ekibi',
  'Sosyal Medya Ekibi',
  'İletişim Ekibi',
  'Organizasyon ve Sosyal Etkinlik Ekibi',
  'Tasarım Ekibi',
  'Yazılım ve Web Ekibi',
];

export const STATUSES = ['new', 'reviewing', 'accepted', 'rejected'];

/* ------------------------------------------------------------ yardımcılar */

export const clean = (v, max = 400) =>
  String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

export const digitsOf = (v) => String(v ?? '').replace(/\D/g, '');

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v);

export const newId = () => crypto.randomUUID();

/* ---------------------------------------------------------------- oturum */

const sign = (value, secret) =>
  crypto.createHmac('sha256', secret).update(value).digest('hex');

export function createToken(secret) {
  const payload = String(Date.now() + SESSION_HOURS * 3600 * 1000);
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyToken(token, secret) {
  if (typeof token !== 'string' || !token.includes('.')) return false;
  const [payload, mac] = token.split('.');
  const expected = sign(payload, secret);
  if (!mac || mac.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return false;
  return Number(payload) > Date.now();
}

export function safeCompare(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function parseCookies(header) {
  return String(header || '').split(';').reduce((acc, part) => {
    const idx = part.indexOf('=');
    if (idx > -1) acc[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    return acc;
  }, {});
}

/* ------------------------------------------------------------ doğrulama */

/** İki başvuru formunda da ortak olan öğrenci alanları. */
export function validateStudent(body, errors) {
  const fullName = clean(body.fullName, 90);
  const studentNo = digitsOf(body.studentNo).slice(0, 15);
  const email = clean(body.email, 120).toLowerCase();
  const phone = digitsOf(body.phone).slice(0, 15);
  const department = clean(body.department, 120);
  const grade = clean(body.grade, 30);

  if (fullName.length < 3 || !fullName.includes(' ')) errors.fullName = 'Ad ve soyadınızı birlikte yazın.';
  if (studentNo.length < 6) errors.studentNo = 'Öğrenci numarası en az 6 haneli olmalı.';
  if (!isEmail(email)) errors.email = 'Geçerli bir e-posta adresi girin.';
  if (phone.length < 10) errors.phone = 'Telefon numarası en az 10 haneli olmalı.';
  if (department.length < 2) errors.department = 'Bölümünüzü yazın.';
  if (!CLASSES.includes(grade)) errors.grade = 'Sınıfınızı seçin.';

  return { fullName, studentNo, email, phone, department, grade };
}

/** Üyelik başvurusunu doğrular; hata varsa {errors}, yoksa {record} döner. */
export function buildMembership(body) {
  const errors = {};
  const student = validateStudent(body, errors);
  if (body.kvkk !== true) errors.kvkk = 'Devam etmek için aydınlatma metnini onaylamanız gerekiyor.';
  if (Object.keys(errors).length) return { errors };

  return {
    record: {
      ...student,
      interests: Array.isArray(body.interests)
        ? body.interests.slice(0, 12).map((i) => clean(i, 60))
        : [],
      motivation: clean(body.motivation, 1200),
    },
  };
}

/** İdari kadro başvurusunu doğrular. */
export function buildStaff(body) {
  const errors = {};
  const student = validateStudent(body, errors);

  const firstChoice = clean(body.firstChoice, 60);
  const secondChoice = clean(body.secondChoice, 60);
  const weeklyHours = clean(body.weeklyHours, 30);
  const motivation = clean(body.motivation, 2000);

  if (!TEAMS.includes(firstChoice)) errors.firstChoice = 'Birinci tercih ekibinizi seçin.';
  if (secondChoice && !TEAMS.includes(secondChoice)) errors.secondChoice = 'Geçersiz ikinci tercih.';
  if (secondChoice && secondChoice === firstChoice) errors.secondChoice = 'İkinci tercih birinciden farklı olmalı.';
  if (motivation.length < 40) errors.motivation = 'Bizi biraz daha ikna et - en az 40 karakter yaz.';
  if (!weeklyHours) errors.weeklyHours = 'Haftada ayırabileceğin süreyi seç.';
  if (body.kvkk !== true) errors.kvkk = 'Devam etmek için aydınlatma metnini onaylamanız gerekiyor.';
  if (Object.keys(errors).length) return { errors };

  return {
    record: {
      ...student,
      firstChoice,
      secondChoice,
      weeklyHours,
      experience: clean(body.experience, 2000),
      motivation,
      portfolio: clean(body.portfolio, 300),
      isMember: body.isMember === true,
    },
  };
}

/** Öneri kutusu gönderimini doğrular. */
export function buildSuggestion(body) {
  const errors = {};
  const message = clean(body.message, 2000);
  const anonymous = body.anonymous === true;
  const email = anonymous ? '' : clean(body.email, 120).toLowerCase();

  if (message.length < 15) errors.message = 'Fikrini biraz daha açar mısın? (en az 15 karakter)';
  if (!anonymous && email && !isEmail(email)) errors.email = 'Geçerli bir e-posta adresi girin.';
  if (Object.keys(errors).length) return { errors };

  return {
    record: {
      category: clean(body.category, 60) || 'Genel',
      message,
      anonymous,
      fullName: anonymous ? '' : clean(body.fullName, 90),
      email,
    },
  };
}

/** Kaydı, depoya yazılmaya hazır hâle getirir. */
export function stamp(record, id) {
  return {
    id,
    createdAt: new Date().toISOString(),
    status: 'new',
    note: '',
    ...record,
  };
}

/* ------------------------------------------------------------------ CSV */

export const CSV_COLUMNS = {
  membership: ['createdAt', 'status', 'fullName', 'studentNo', 'email', 'phone', 'department', 'grade', 'interests', 'motivation', 'note'],
  staff: ['createdAt', 'status', 'fullName', 'studentNo', 'email', 'phone', 'department', 'grade', 'firstChoice', 'secondChoice', 'weeklyHours', 'isMember', 'experience', 'motivation', 'portfolio', 'note'],
  suggestion: ['createdAt', 'status', 'category', 'anonymous', 'fullName', 'email', 'message', 'note'],
};

export function toCsv(rows, columns) {
  const escape = (v) => {
    const s = Array.isArray(v) ? v.join(' | ') : String(v ?? '');
    // Excel'in hücreyi formül olarak yorumlamasını engelle.
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const head = columns.join(',');
  const body = rows.map((r) => columns.map((c) => escape(r[c])).join(',')).join('\r\n');
  return `﻿${head}\r\n${body}`;
}

/* ------------------------------------------------- basit bellek içi limit */

const hits = new Map();

/**
 * Aynı IP'den gelen art arda istekleri sınırlar.
 * Sunucusuz ortamda yalnızca aynı örnek (instance) için geçerlidir;
 * yine de bot seli gibi tipik durumları keser.
 */
export function rateLimit(key, { windowMs, max }) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (list.length >= max) return false;
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return true;
}
