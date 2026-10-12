/* =========================================================================
   UGİTEK — yönetim paneli
   Başvuruları listeler, durumlarını günceller, not ekler, CSV dışa aktarır.
   ========================================================================= */
(function () {
  'use strict';

  const state = {
    type: 'membership',
    data: { membership: [], staff: [], suggestion: [] },
    search: '',
    status: '',
    sort: 'new',
  };

  const STATUS_LABEL = {
    new: 'Yeni',
    reviewing: 'İnceleniyor',
    accepted: 'Kabul',
    rejected: 'Red',
  };

  const TYPE_LABEL = {
    membership: 'Üyelik Başvurusu',
    staff: 'İdari Kadro Başvurusu',
    suggestion: 'Öneri',
  };

  const $ = (id) => document.getElementById(id);
  let esc;

  /* ------------------------------------------------------------- yardımcı */

  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleString('tr-TR', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return iso;
    }
  }

  async function api(url, options) {
    const res = await fetch(url, Object.assign({ headers: { 'Content-Type': 'application/json' } }, options));
    if (res.status === 401) { showLogin(); throw new Error('unauthorized'); }
    return res.json();
  }

  /* --------------------------------------------------------------- görünüm */

  function showLogin() {
    $('loginBox').hidden = false;
    $('dashboard').hidden = true;
  }

  function showDashboard() {
    $('loginBox').hidden = true;
    $('dashboard').hidden = false;
  }

  /* ------------------------------------------------------------ istatistik */

  function renderStats() {
    const m = state.data.membership;
    const s = state.data.staff;
    const g = state.data.suggestion;
    const pending = (rows) => rows.filter((r) => r.status === 'new').length;

    $('statRow').innerHTML = [
      ['Üyelik başvurusu', m.length, pending(m) + ' yeni'],
      ['İdari kadro', s.length, pending(s) + ' yeni'],
      ['Öneri', g.length, pending(g) + ' okunmamış'],
      ['Kabul edilen', m.filter((r) => r.status === 'accepted').length + s.filter((r) => r.status === 'accepted').length, 'toplam'],
    ].map(([label, value, sub]) => `
      <div class="stat">
        <b>${value}</b>
        <span>${esc(label)} · ${esc(sub)}</span>
      </div>`).join('');
  }

  /* -------------------------------------------------------------- filtreler */

  function visibleRows() {
    const q = state.search.toLocaleLowerCase('tr-TR');
    let rows = state.data[state.type].slice();

    if (state.status) rows = rows.filter((r) => r.status === state.status);

    if (q) {
      rows = rows.filter((r) =>
        [r.fullName, r.studentNo, r.email, r.phone, r.department, r.grade,
         r.firstChoice, r.secondChoice, r.message, r.motivation, r.category, r.note]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase('tr-TR')
          .includes(q)
      );
    }

    if (state.sort === 'old') rows.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    else if (state.sort === 'name') rows.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || '', 'tr'));
    else rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return rows;
  }

  /* ----------------------------------------------------------------- liste */

  function kv(label, value) {
    if (!value) return '';
    return `<div><span>${esc(label)}</span><b>${esc(value)}</b></div>`;
  }

  function rowHtml(r) {
    const isSuggestion = state.type === 'suggestion';
    const title = isSuggestion
      ? (r.anonymous ? 'Anonim' : (r.fullName || 'İsimsiz'))
      : r.fullName;
    const sub = isSuggestion
      ? r.category
      : `${r.studentNo} · ${r.department} · ${r.grade}`;

    const details = isSuggestion
      ? `<div class="kv">
           ${kv('Kategori', r.category)}
           ${kv('E-posta', r.email)}
           ${kv('Gönderim', fmtDate(r.createdAt))}
         </div>
         <div class="longtext">${esc(r.message)}</div>`
      : `<div class="kv">
           ${kv('Öğrenci No', r.studentNo)}
           ${kv('E-posta', r.email)}
           ${kv('Telefon', r.phone)}
           ${kv('Bölüm', r.department)}
           ${kv('Sınıf', r.grade)}
           ${kv('Başvuru', fmtDate(r.createdAt))}
           ${kv('1. Tercih', r.firstChoice)}
           ${kv('2. Tercih', r.secondChoice)}
           ${kv('Haftalık süre', r.weeklyHours)}
           ${r.isMember !== undefined ? kv('Zaten üye', r.isMember ? 'Evet' : 'Hayır') : ''}
           ${kv('İlgi alanları', (r.interests || []).join(', '))}
           ${kv('Portfolyo', r.portfolio)}
         </div>
         ${r.motivation ? '<div><span style="font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dim)">Motivasyon</span><div class="longtext" style="margin-top:.4rem">' + esc(r.motivation) + '</div></div>' : ''}
         ${r.experience ? '<div><span style="font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dim)">Deneyim</span><div class="longtext" style="margin-top:.4rem">' + esc(r.experience) + '</div></div>' : ''}`;

    const statusButtons = ['new', 'reviewing', 'accepted', 'rejected'].map((s) => `
      <button class="btn btn-ghost btn-sm" data-action="status" data-id="${r.id}" data-value="${s}"
              ${r.status === s ? 'disabled' : ''}>${STATUS_LABEL[s]}</button>`).join('');

    return `
      <details class="app-row" data-status="${r.status}">
        <summary class="app-summary">
          <span class="who">
            <b>${esc(title)}</b>
            <small>${esc(sub)}</small>
          </span>
          <span class="badge badge-${r.status}">${STATUS_LABEL[r.status]}</span>
          <span style="font-size:.78rem;color:var(--dim)">${esc(fmtDate(r.createdAt))}</span>
        </summary>

        <div class="app-detail">
          ${details}

          <div class="field">
            <label for="note-${r.id}" style="font-size:.78rem">Yönetim notu</label>
            <textarea id="note-${r.id}" data-note="${r.id}" style="min-height:70px"
                      placeholder="Bu başvuruyla ilgili kendi notunuz…">${esc(r.note || '')}</textarea>
          </div>

          <div class="row-actions">
            ${statusButtons}
            <span style="flex:1"></span>
            <button class="btn btn-ghost btn-sm" data-action="save-note" data-id="${r.id}">Notu Kaydet</button>
            <button class="btn btn-ghost btn-sm" data-action="delete" data-id="${r.id}"
                    style="color:var(--red);border-color:rgba(255,91,110,.4)">Sil</button>
          </div>
        </div>
      </details>`;
  }

  function renderList() {
    const rows = visibleRows();
    const list = $('list');

    if (!rows.length) {
      list.innerHTML = `<div class="empty">
        <p style="font-size:1.05rem;margin-bottom:.4rem">Gösterilecek kayıt yok.</p>
        <p style="font-size:.9rem">${state.search || state.status ? 'Filtreleri temizlemeyi dene.' : TYPE_LABEL[state.type] + ' henüz gelmemiş.'}</p>
      </div>`;
      return;
    }

    list.innerHTML = rows.map(rowHtml).join('');
  }

  function render() {
    renderStats();
    renderList();
    $('exportBtn').href = '/api/admin/export/' + state.type;
  }

  /* ------------------------------------------------------------ veri çekme */

  async function load() {
    const json = await api('/api/admin/data');
    if (!json.ok) return;
    state.data.membership = json.membership || [];
    state.data.staff = json.staff || [];
    state.data.suggestion = json.suggestion || [];
    showDashboard();
    render();
  }

  /* ------------------------------------------------------------ eylemler */

  async function patch(id, body) {
    const json = await api(`/api/admin/item/${state.type}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    if (!json.ok) return null;

    const rows = state.data[state.type];
    const idx = rows.findIndex((r) => r.id === id);
    if (idx > -1) rows[idx] = json.item;
    return json.item;
  }

  function bindDashboard() {
    /* sekmeler */
    document.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        state.type = tab.dataset.type;
        render();
      });
    });

    /* filtreler */
    let timer;
    $('search').addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => { state.search = e.target.value.trim(); renderList(); }, 180);
    });
    $('statusFilter').addEventListener('change', (e) => { state.status = e.target.value; renderList(); });
    $('sortBy').addEventListener('change', (e) => { state.sort = e.target.value; renderList(); });

    $('refreshBtn').addEventListener('click', () => load());

    $('logoutBtn').addEventListener('click', async () => {
      await fetch('/api/admin/logout', { method: 'POST' });
      location.reload();
    });

    /* satır içi eylemler */
    $('list').addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const { action, id, value } = btn.dataset;
      const row = btn.closest('.app-row');

      if (action === 'status') {
        btn.disabled = true;
        const item = await patch(id, { status: value });
        if (item) {
          row.dataset.status = item.status;
          const badge = row.querySelector('.badge');
          badge.className = 'badge badge-' + item.status;
          badge.textContent = STATUS_LABEL[item.status];
          row.querySelectorAll('[data-action="status"]').forEach((b) => {
            b.disabled = b.dataset.value === item.status;
          });
          renderStats();
        } else {
          btn.disabled = false;
        }
      }

      if (action === 'save-note') {
        const ta = row.querySelector(`[data-note="${id}"]`);
        btn.disabled = true;
        const label = btn.textContent;
        await patch(id, { note: ta.value });
        btn.textContent = 'Kaydedildi ✓';
        setTimeout(() => { btn.textContent = label; btn.disabled = false; }, 1600);
      }

      if (action === 'delete') {
        // İki aşamalı onay: tarayıcı diyaloğu yerine butonun kendisi sorar.
        if (btn.dataset.confirm !== '1') {
          btn.dataset.confirm = '1';
          btn.textContent = 'Emin misin? Tıkla';
          setTimeout(() => {
            if (btn.isConnected) { btn.dataset.confirm = '0'; btn.textContent = 'Sil'; }
          }, 4000);
          return;
        }
        const json = await api(`/api/admin/item/${state.type}/${id}`, { method: 'DELETE' });
        if (json.ok) {
          state.data[state.type] = state.data[state.type].filter((r) => r.id !== id);
          render();
        }
      }
    });
  }

  /* --------------------------------------------------------------- giriş */

  function bindLogin() {
    const form = $('loginForm');
    const submit = form.querySelector('[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const alert = form.querySelector('.alert');
      alert.classList.remove('show');
      submit.classList.add('loading');
      submit.disabled = true;

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: $('password').value }),
        });
        const json = await res.json().catch(() => ({}));

        if (!res.ok || !json.ok) {
          alert.className = 'alert alert-error show';
          alert.innerHTML = '<span aria-hidden="true">!</span><span>' + (json.error || 'Giriş başarısız.') + '</span>';
          return;
        }
        $('password').value = '';
        await load();
      } catch {
        const a = form.querySelector('.alert');
        a.className = 'alert alert-error show';
        a.textContent = 'Sunucuya ulaşılamadı.';
      } finally {
        submit.classList.remove('loading');
        submit.disabled = false;
      }
    });
  }

  /* --------------------------------------------------------------- başlat */

  window.renderPage = async function () {
    esc = window.UGITEK_UI.esc;
    bindLogin();
    bindDashboard();

    try {
      const session = await api('/api/admin/session');
      if (session.authenticated) await load();
      else showLogin();
    } catch {
      showLogin();
    }
  };
})();
