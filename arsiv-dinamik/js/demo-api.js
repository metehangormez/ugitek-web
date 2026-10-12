/* =========================================================================
   UGİTEK — sunucusuz demo API
   Hem Artifact önizlemesi hem de statik (Netlify/GitHub Pages) sürüm kullanır.

   /api/... çağrılarını gerçek sunucu yerine ziyaretçinin kendi tarayıcısından
   karşılar. Gönderilen hiçbir bilgi dışarı çıkmaz.
   ========================================================================= */
(function () {
  'use strict';

  window.UGITEK_DEMO = true;

  var PREVIEW_PASSWORD = 'ugitek';
  var KEY = 'ugitek-preview-v1';

  /* ------------------------------------------------------------ depolama */

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function write(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      /* gizli sekme veya kapalı depolama — önizleme yine de çalışır */
    }
  }

  function uid() {
    return 'p' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function daysAgo(n) {
    return new Date(Date.now() - n * 86400000).toISOString();
  }

  /** Panel boş açılmasın diye açıkça "örnek" olduğu yazan kayıtlar. */
  function seed() {
    var note = 'Örnek kayıt — önizleme için eklendi, gerçek bir başvuru değildir.';
    return {
      membership: [
        { id: uid(), createdAt: daysAgo(1), status: 'new', note: note, fullName: 'Örnek Aday', studentNo: '230000001', email: 'ornek.aday@ogr.cbu.edu.tr', phone: '05000000001', department: 'Bilgisayar Mühendisliği', grade: '2. Sınıf', interests: ['Yapay Zekâ', 'Yazılım Geliştirme'], motivation: 'Bu bir örnek başvurudur. Panelin dolu hâlini göstermek için eklendi.' },
        { id: uid(), createdAt: daysAgo(3), status: 'reviewing', note: note, fullName: 'Örnek Öğrenci', studentNo: '230000002', email: 'ornek.ogrenci@ogr.cbu.edu.tr', phone: '05000000002', department: 'İşletme', grade: '1. Sınıf', interests: ['Girişimcilik', 'Pazarlama'], motivation: 'Bu bir örnek başvurudur.' },
        { id: uid(), createdAt: daysAgo(6), status: 'accepted', note: note, fullName: 'Örnek Üye', studentNo: '230000003', email: 'ornek.uye@ogr.cbu.edu.tr', phone: '05000000003', department: 'Grafik Tasarım', grade: '3. Sınıf', interests: ['Tasarım / UI-UX'], motivation: 'Bu bir örnek başvurudur.' },
      ],
      staff: [
        { id: uid(), createdAt: daysAgo(2), status: 'new', note: note, fullName: 'Örnek Kadro Adayı', studentNo: '230000004', email: 'ornek.kadro@ogr.cbu.edu.tr', phone: '05000000004', department: 'Endüstri Mühendisliği', grade: '2. Sınıf', firstChoice: 'Organizasyon ve Sosyal Etkinlik Ekibi', secondChoice: 'Sponsorluk Ekibi', weeklyHours: '4–6 saat', isMember: true, experience: 'Örnek deneyim metni.', motivation: 'Bu bir örnek başvurudur; panelin idari kadro sekmesini göstermek için eklendi.', portfolio: '' },
        { id: uid(), createdAt: daysAgo(5), status: 'accepted', note: note, fullName: 'Örnek Tasarımcı', studentNo: '230000005', email: 'ornek.tasarim@ogr.cbu.edu.tr', phone: '05000000005', department: 'Grafik Tasarım', grade: '4. Sınıf', firstChoice: 'Tasarım Ekibi', secondChoice: '', weeklyHours: '7–10 saat', isMember: false, experience: '', motivation: 'Bu bir örnek başvurudur.', portfolio: '' },
      ],
      suggestion: [
        { id: uid(), createdAt: daysAgo(1), status: 'new', note: note, category: 'Teknik gezi önerisi', message: 'Bu bir örnek öneridir. Teknoparka bir gezi düzenlenebilir.', anonymous: true, fullName: '', email: '' },
        { id: uid(), createdAt: daysAgo(4), status: 'reviewing', note: note, category: 'Konuk / konuşmacı önerisi', message: 'Bu bir örnek öneridir. Mezuna Sor için yazılım sektöründen bir konuk çağrılabilir.', anonymous: false, fullName: 'Örnek Öneren', email: 'ornek.oneri@ogr.cbu.edu.tr' },
      ],
      session: false,
    };
  }

  var store = read();
  if (!store || !store.membership) {
    store = seed();
    write(store);
  }

  /* ---------------------------------------------------------- doğrulama */

  function clean(v, max) {
    return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max || 400);
  }
  function digits(v) {
    return String(v == null ? '' : v).replace(/\D/g, '');
  }
  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v);
  }

  function validateStudent(b, errors) {
    var fullName = clean(b.fullName, 90);
    var studentNo = digits(b.studentNo).slice(0, 15);
    var email = clean(b.email, 120).toLowerCase();
    var phone = digits(b.phone).slice(0, 15);
    var department = clean(b.department, 120);
    var grade = clean(b.grade, 30);

    if (fullName.length < 3 || fullName.indexOf(' ') === -1) errors.fullName = 'Ad ve soyadınızı birlikte yazın.';
    if (studentNo.length < 6) errors.studentNo = 'Öğrenci numarası en az 6 haneli olmalı.';
    if (!isEmail(email)) errors.email = 'Geçerli bir e-posta adresi girin.';
    if (phone.length < 10) errors.phone = 'Telefon numarası en az 10 haneli olmalı.';
    if (department.length < 2) errors.department = 'Bölümünüzü yazın.';
    if (window.UGITEK.classes.indexOf(grade) === -1) errors.grade = 'Sınıfınızı seçin.';

    return { fullName: fullName, studentNo: studentNo, email: email, phone: phone, department: department, grade: grade };
  }

  /* ------------------------------------------------------- sahte sunucu */

  function reply(status, body) {
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status: status,
      json: function () { return Promise.resolve(body); },
      text: function () { return Promise.resolve(JSON.stringify(body)); },
      headers: { get: function () { return null; } },
    });
  }

  function add(list, record) {
    record.id = uid();
    record.createdAt = new Date().toISOString();
    record.status = 'new';
    record.note = '';
    store[list].unshift(record);
    write(store);
    return record;
  }

  function handle(url, opts) {
    var method = (opts.method || 'GET').toUpperCase();
    var path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
    var body = {};
    try { body = opts.body ? JSON.parse(opts.body) : {}; } catch (e) { body = {}; }

    /* ---- üyelik ---- */
    if (path === '/api/applications/membership' && method === 'POST') {
      var errs = {};
      var s = validateStudent(body, errs);
      if (body.kvkk !== true) errs.kvkk = 'Devam etmek için aydınlatma metnini onaylamanız gerekiyor.';
      if (Object.keys(errs).length) return reply(400, { ok: false, errors: errs });

      for (var i = 0; i < store.membership.length; i++) {
        if (store.membership[i].studentNo === s.studentNo) {
          return reply(409, { ok: false, errors: { studentNo: 'Bu öğrenci numarasıyla zaten bir başvuru var.' } });
        }
      }
      s.interests = Array.isArray(body.interests) ? body.interests.slice(0, 12).map(function (x) { return clean(x, 60); }) : [];
      s.motivation = clean(body.motivation, 1200);
      return reply(200, { ok: true, id: add('membership', s).id });
    }

    /* ---- idari kadro ---- */
    if (path === '/api/applications/staff' && method === 'POST') {
      var e2 = {};
      var st = validateStudent(body, e2);
      var teams = window.UGITEK.teams.map(function (t) { return t.name; });
      var first = clean(body.firstChoice, 60);
      var second = clean(body.secondChoice, 60);
      var motivation = clean(body.motivation, 2000);

      if (teams.indexOf(first) === -1) e2.firstChoice = 'Birinci tercih ekibinizi seçin.';
      if (second && teams.indexOf(second) === -1) e2.secondChoice = 'Geçersiz ikinci tercih.';
      if (second && second === first) e2.secondChoice = 'İkinci tercih birinciden farklı olmalı.';
      if (motivation.length < 40) e2.motivation = 'Bizi biraz daha ikna et - en az 40 karakter yaz.';
      if (!clean(body.weeklyHours, 30)) e2.weeklyHours = 'Haftada ayırabileceğin süreyi seç.';
      if (body.kvkk !== true) e2.kvkk = 'Devam etmek için aydınlatma metnini onaylamanız gerekiyor.';
      if (Object.keys(e2).length) return reply(400, { ok: false, errors: e2 });

      st.firstChoice = first;
      st.secondChoice = second;
      st.weeklyHours = clean(body.weeklyHours, 30);
      st.experience = clean(body.experience, 2000);
      st.motivation = motivation;
      st.portfolio = clean(body.portfolio, 300);
      st.isMember = body.isMember === true;
      return reply(200, { ok: true, id: add('staff', st).id });
    }

    /* ---- öneri ---- */
    if (path === '/api/suggestions' && method === 'POST') {
      var e3 = {};
      var message = clean(body.message, 2000);
      var anonymous = body.anonymous === true;
      var mail = anonymous ? '' : clean(body.email, 120).toLowerCase();
      if (message.length < 15) e3.message = 'Fikrini biraz daha açar mısın? (en az 15 karakter)';
      if (!anonymous && mail && !isEmail(mail)) e3.email = 'Geçerli bir e-posta adresi girin.';
      if (Object.keys(e3).length) return reply(400, { ok: false, errors: e3 });

      return reply(200, { ok: true, id: add('suggestion', {
        category: clean(body.category, 60) || 'Genel',
        message: message,
        anonymous: anonymous,
        fullName: anonymous ? '' : clean(body.fullName, 90),
        email: mail,
      }).id });
    }

    if (path === '/api/stats') {
      return reply(200, { ok: true, members: store.membership.length, suggestions: store.suggestion.length });
    }

    /* ---- admin ---- */
    if (path === '/api/admin/login' && method === 'POST') {
      if (String(body.password || '') !== PREVIEW_PASSWORD) {
        return reply(401, { ok: false, error: 'Şifre hatalı. Önizleme şifresi: ' + PREVIEW_PASSWORD });
      }
      store.session = true;
      write(store);
      return reply(200, { ok: true });
    }

    if (path === '/api/admin/logout') {
      store.session = false;
      write(store);
      return reply(200, { ok: true });
    }

    if (path === '/api/admin/session') {
      return reply(200, { ok: true, authenticated: store.session === true });
    }

    if (!store.session && path.indexOf('/api/admin/') === 0) {
      return reply(401, { ok: false, error: 'Oturum gerekli.' });
    }

    if (path === '/api/admin/data') {
      return reply(200, { ok: true, membership: store.membership, staff: store.staff, suggestion: store.suggestion });
    }

    var item = path.match(/^\/api\/admin\/item\/([^/]+)\/([^/]+)$/);
    if (item) {
      var list = store[item[1]];
      if (!list) return reply(404, { ok: false, error: 'Bilinmeyen liste.' });

      if (method === 'DELETE') {
        store[item[1]] = list.filter(function (r) { return r.id !== item[2]; });
        write(store);
        return reply(200, { ok: true });
      }

      var row = list.filter(function (r) { return r.id === item[2]; })[0];
      if (!row) return reply(404, { ok: false, error: 'Kayıt bulunamadı.' });
      if (body.status !== undefined) {
        if (['new', 'reviewing', 'accepted', 'rejected'].indexOf(body.status) === -1) {
          return reply(400, { ok: false, error: 'Geçersiz durum.' });
        }
        row.status = body.status;
      }
      if (body.note !== undefined) row.note = clean(body.note, 800);
      write(store);
      return reply(200, { ok: true, item: row });
    }

    return reply(404, { ok: false, error: 'Bu uç önizlemede yok.' });
  }

  var realFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (url, opts) {
    var u = String(url && url.url ? url.url : url);
    if (u.indexOf('/api/') === -1) {
      return realFetch ? realFetch(url, opts) : Promise.reject(new Error('fetch yok'));
    }
    return handle(u, opts || {});
  };

})();
