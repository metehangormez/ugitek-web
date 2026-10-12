/* =========================================================================
   UGİTEK — ortak arayüz davranışları
   Navigasyon + footer üretimi, kaydırma animasyonları, hero kanvası.
   ========================================================================= */
(function () {
  'use strict';

  const D = window.UGITEK;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Bağlantılar göreli: site ister alan adının kökünde ister bir alt
     klasörde dursun (FTP ile nereye yüklenirse yüklensin) çalışır. */
  const NAV_ITEMS = [
    { href: 'index.html', label: 'Ana Sayfa', page: 'home' },
    { href: 'biz-kimiz.html', label: 'Biz Kimiz', page: 'about' },
    { href: 'etkinlikler.html', label: 'Etkinlikler', page: 'events' },
    { href: 'idari-kadro.html', label: 'İdari Kadro', page: 'staff' },
    { href: 'iletisim.html', label: 'İletişim', page: 'contact' },
  ];

  const ICONS = {
    instagram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none"/></svg>',
    tiktok: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 2h-3v13.2a2.6 2.6 0 1 1-2.1-2.55V9.6a5.7 5.7 0 1 0 5.1 5.67V8.9a6.6 6.6 0 0 0 3.9 1.26V7.1a3.75 3.75 0 0 1-3.9-3.6V2z"/></svg>',
    linkedin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.9 3.5a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2zM3.1 9.2h3.6V21H3.1zM9.4 9.2H13v1.6c.5-.9 1.7-1.9 3.6-1.9 3 0 4.4 1.9 4.4 5.3V21h-3.6v-6c0-1.6-.6-2.6-2-2.6-1.2 0-1.9.8-2.2 1.6-.1.3-.1.7-.1 1.1V21H9.4z"/></svg>',
    whatsapp: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.2 22l5.3-1.4A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3a8 8 0 1 1 6.9 3.8Zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3c-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9 1.7.7 2.3.8 3.1.6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z"/></svg>',
    mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    codeMark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8.5 7.5-5 4.5 5 4.5M15.5 7.5l5 4.5-5 4.5"/></svg>',
    sun: '<svg class="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"/></svg>',
    moon: '<svg class="moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8Z"/></svg>',
  };

  /* Emoji yerine tek çizgi kalınlığında ikonlar. data.js bunlara isimle atıfta bulunur. */
  const ICON_PATHS = {
    rocket:    '<path d="M12 3c2.8 1.9 4.5 5 4.5 8.4V15l-2 2h-5l-2-2v-3.6C7.5 8 9.2 4.9 12 3Z"/><circle cx="12" cy="10" r="1.6"/><path d="M9.5 17.5 7.8 21l2.7-1M14.5 17.5l1.7 3.5-2.7-1"/>',
    flower:    '<circle cx="12" cy="7.5" r="2.6"/><path d="M12 10.1V21"/><path d="M12 14.5c-2.6 0-4.6-1.5-4.6-3.4M12 17.5c2.6 0 4.6-1.5 4.6-3.4"/>',
    bolt:      '<path d="M13 2.5 4.8 13.4H11l-1 8.1 8.2-10.9H12l1-8.1Z"/>',
    cap:       '<path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z"/><path d="M6.5 10.7V16c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-5.3"/><path d="M21.5 8.5V14"/>',
    quiz:      '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.6"/><path d="M12 17.3h.01"/>',
    factory:   '<path d="M3 21V10l5.5 3.5V10L14 13.5V6.5l6.5 4.5V21H3Z"/><path d="M7 17.5h2M13 17.5h2M18 17.5h1"/>',
    tent:      '<path d="M4.2 10v10.3h15.6V10"/><path d="M2.4 10 4.6 4.2h14.8L21.6 10Z"/><path d="M8.4 10 9.6 4.2M15.6 10 14.4 4.2"/><path d="M9.6 20.3v-5.4h4.8v5.4"/>',
    wave:      '<path d="M20.6 13.6a2.5 2.5 0 0 1-2.5 2.5H8.2l-4.8 4.2V6.1a2.5 2.5 0 0 1 2.5-2.5h12.2a2.5 2.5 0 0 1 2.5 2.5Z"/><path d="M8 8.6h8M8 11.8h5"/>',
    network:   '<circle cx="9" cy="8" r="3"/><path d="M3.2 20a5.8 5.8 0 0 1 11.6 0"/><circle cx="17.6" cy="10" r="2.4"/><path d="M16 15.4a5 5 0 0 1 4.8 4.6"/>',
    tools:     '<path d="M19.6 5.4a4 4 0 0 1-5.2 5.2L5.4 19.6 3.9 18.1l9-9a4 4 0 0 1 5.2-5.2L15.6 6.4 17.1 7.9l2.5-2.5Z"/>',
    ticket:    '<path d="M3.5 9.6V7.2a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v2.4a2.4 2.4 0 0 0 0 4.8v2.4a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-2.4a2.4 2.4 0 0 0 0-4.8Z"/><path d="M14 6.6v10.8"/>',
    globe:     '<circle cx="12" cy="12" r="9"/><path d="M3.4 9.2h17.2M3.4 14.8h17.2"/><path d="M12 3c2.3 2.4 3.5 5.4 3.5 9s-1.2 6.6-3.5 9c-2.3-2.4-3.5-5.4-3.5-9S9.7 5.4 12 3Z"/>',
    target:    '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1"/>',
    telescope: '<path d="M4.4 14.6 15.6 4.4l3 3L7.4 17.6l-3-3Z"/><path d="M8.2 16.8 6.2 21M12.4 14.2 15 21"/><path d="M2.6 12.8 5 15.2"/>',
    gear:      '<path d="M10.3 2.6h3.4l.4 2.3 1.9 1.1 2.1-1 1.7 2.9-1.7 1.6v2.2l1.7 1.6-1.7 2.9-2.1-1-1.9 1.1-.4 2.3h-3.4l-.4-2.3-1.9-1.1-2.1 1-1.7-2.9 1.7-1.6v-2.2L4.2 10.4l1.7-2.9 2.1 1 1.9-1.1Z"/><circle cx="12" cy="12" r="2.8"/>',
    briefcase: '<rect x="3" y="7.4" width="18" height="12.2" rx="2.2"/><path d="M8.6 7.4V6a2 2 0 0 1 2-2h2.8a2 2 0 0 1 2 2v1.4"/><path d="M3 12.2h18"/>',
    bus:       '<rect x="3.6" y="3.8" width="16.8" height="13.2" rx="2.4"/><path d="M3.6 10.4h16.8"/><path d="M7 17v2.6M17 17v2.6"/><circle cx="7.6" cy="13.8" r="1"/><circle cx="16.4" cy="13.8" r="1"/>',
    social:    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/>',
    envelope:  '<rect x="2.6" y="4.8" width="18.8" height="14.4" rx="2.6"/><path d="m3.6 7.4 8.4 6 8.4-6"/>',
    calendar:  '<rect x="3.4" y="5" width="17.2" height="15.6" rx="2.4"/><path d="M3.4 10.2h17.2M8 3v4M16 3v4"/>',
    palette:   '<path d="M12 3.2a8.8 8.8 0 0 0 0 17.6c1.2 0 2-.9 2-2 0-1.2-1-1.6-1-2.6 0-.9.7-1.6 1.6-1.6H17a3.9 3.9 0 0 0 3.9-3.9c0-4.1-4-7.5-8.9-7.5Z"/><circle cx="8" cy="10.2" r="1.1"/><circle cx="12" cy="7.8" r="1.1"/><circle cx="16" cy="10.6" r="1.1"/>',
    code:      '<path d="m8.8 7.8-5 4.2 5 4.2M15.2 7.8l5 4.2-5 4.2"/><path d="m13.4 5.6-2.8 12.8"/>',
    whatsapp:  '<path d="M20.7 12a8.7 8.7 0 0 1-13 7.5L3.3 20.7l1.2-4.3A8.7 8.7 0 1 1 20.7 12Z"/><path d="M9.2 9.1c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.4l.7 1.6c.1.2.1.4 0 .5l-.4.5c-.1.2-.2.3-.1.5a6.3 6.3 0 0 0 3 2.6c.2.1.4 0 .5-.1l.7-.8c.1-.2.3-.2.5-.1l1.5.7c.2.1.3.2.3.4 0 .5-.2 1-.6 1.3-.5.3-1.2.4-2 .2a10 10 0 0 1-6-4.8c-.3-.6-.5-1.3-.5-1.9 0-.5.2-1 .6-1.4Z"/>',
    spark:     '<path d="M12 3.2 13.9 9l5.9 1.9-5.9 1.9L12 18.7l-1.9-5.9L4.2 11 10.1 9 12 3.2Z"/>',
  };

  /** İsimden çizgi ikon üretir; bilinmeyen isimde yıldıza düşer. */
  function icon(name) {
    const d = ICON_PATHS[name] || ICON_PATHS.spark;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }

  /**
   * Etkinlik kartının üst görseli. Fotoğraf tanımlıysa onu, yoksa çizgi
   * ikonu basar. Dosya sunucuda yoksa fixMissingPhotos() kartı ikonlu
   * hâline geri döndürür — yani fotoğrafları sırayla ekleyebilirsiniz.
   */
  function eventHead(e) {
    const tag = '<span class="tag tag-' + esc(e.tagType) + '">' + esc(e.tag) + '</span>';

    if (!e.photo) {
      return '<div class="event-top"><span class="card-icon">' + icon(e.icon) + '</span>'
        + tag + '</div>';
    }

    return '<span class="event-photo" data-fallback="' + esc(e.icon || 'spark') + '">'
      + '<img src="assets/events/' + esc(e.photo) + '" alt="' + esc(e.title) + '"'
      + ' decoding="async"></span>'
      + '<div class="event-top">' + tag + '</div>';
  }

  /** Sunucuda bulunmayan kart görselini ikona çevirir. */
  function fixMissingPhotos(scope) {
    (scope || document).querySelectorAll('.event-photo img').forEach((img) => {
      const swap = () => {
        const box = img.closest('.event-photo');
        if (!box) return;
        const top = box.nextElementSibling;
        if (top && top.classList.contains('event-top')) {
          const span = document.createElement('span');
          span.className = 'card-icon';
          span.innerHTML = icon(box.dataset.fallback);
          top.prepend(span);
        }
        box.remove();
      };
      if (img.complete && img.naturalWidth === 0) swap();
      else img.addEventListener('error', swap, { once: true });
    });
  }

  /** HTML'de duran <span data-icon="..."> kutularını doldurur. */
  function paintIcons(scope) {
    (scope || document).querySelectorAll('[data-icon]').forEach((el) => {
      el.innerHTML = icon(el.dataset.icon);
    });
  }

  const logoMark = '<img src="assets/logo.svg" alt="" width="38" height="38">';

  /* ------------------------------------------------------- nav + footer */

  function buildChrome() {
    const page = document.body.dataset.page || '';

    const navRoot = document.getElementById('nav-root');
    if (navRoot) {
      const links = NAV_ITEMS.map((i) =>
        `<li><a href="${i.href}"${i.page === page ? ' aria-current="page"' : ''}>${i.label}</a></li>`
      ).join('');

      const mobileLinks = NAV_ITEMS.map((i) =>
        `<a href="${i.href}"${i.page === page ? ' aria-current="page"' : ''}>${i.label}</a>`
      ).join('');

      navRoot.innerHTML =
        '<div class="scroll-progress" id="scrollProgress"></div>' +
        '<header class="nav" id="nav"><div class="wrap">' +
          `<a class="brand" href="index.html">${logoMark}<span>UGİTEK<small>MCBÜ Topluluğu</small></span></a>` +
          navCredit() +
          `<nav aria-label="Ana menü"><ul class="nav-links">${links}</ul></nav>` +
          '<div class="nav-cta">' +
            '<button class="theme-toggle" id="themeToggle" type="button" ' +
              'aria-label="Açık veya koyu temaya geç" title="Tema değiştir">' +
              ICONS.sun + ICONS.moon + '</button>' +
            '<a class="btn btn-primary btn-sm" href="uye-ol.html">Üye Ol</a>' +
            '<button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mobileMenu" aria-label="Menüyü aç">' +
              '<span></span><span></span><span></span></button>' +
          '</div>' +
        '</div></header>' +
        `<div class="mobile-menu" id="mobileMenu">${mobileLinks}` +
          '<a class="btn btn-primary" href="uye-ol.html">Üye Ol</a>' +
          navCredit() + '</div>';
    }

    const footRoot = document.getElementById('footer-root');
    if (footRoot) {
      const s = D.info;
      footRoot.innerHTML =
        '<footer class="footer"><div class="wrap">' +
          '<div class="footer-grid">' +
            '<div>' +
              `<a class="brand" href="index.html">${logoMark}<span>UGİTEK<small>Est. ${s.founded}</small></span></a>` +
              `<p style="margin-top:1rem;max-width:34ch;font-size:.92rem">${s.longName} — ${s.university}.</p>` +
              '<div class="socials">' +
                `<a href="${s.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.instagram}</a>` +
                `<a href="${s.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${ICONS.tiktok}</a>` +
                `<a href="${s.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${ICONS.linkedin}</a>` +
                `<a href="${s.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp grubu">${ICONS.whatsapp}</a>` +
                `<a href="mailto:${s.email}" aria-label="E-posta">${ICONS.mail}</a>` +
              '</div>' +
            '</div>' +
            '<div><h4>Keşfet</h4><ul>' +
              '<li><a href="index.html">Ana Sayfa</a></li>' +
              '<li><a href="biz-kimiz.html">Biz Kimiz</a></li>' +
              '<li><a href="etkinlikler.html">Etkinlikler</a></li>' +
              '<li><a href="index.html#sss">S.S.S.</a></li>' +
            '</ul></div>' +
            '<div><h4>Katıl</h4><ul>' +
              `<li><a href="${s.memberForm}" target="_blank" rel="noopener">Üye Kayıt Formu</a></li>` +
              `<li><a href="${s.whatsapp}" target="_blank" rel="noopener">WhatsApp Grubu</a></li>` +
              '<li><a href="idari-kadro.html">İdari Kadro</a></li>' +
              `<li><a href="${s.linktree}" target="_blank" rel="noopener">Tüm bağlantılar</a></li>` +
            '</ul></div>' +
            '<div><h4>İletişim</h4><ul>' +
              `<li><a href="mailto:${s.email}">${s.email}</a></li>` +
              `<li><a href="${s.instagram}" target="_blank" rel="noopener">@mcbu_ugitek</a></li>` +
              '<li><a href="iletisim.html">Bize ulaşın</a></li>' +
            '</ul></div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            `<p>© <span data-year></span> ${s.name} · ${s.university}</p>` +
            `<span>Dönem ${s.term}</span>` +
            creditMark() +
          '</div>' +
        '</div></footer>';
    }

    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* --------------------------------------------------------------- tema */

  const THEME_KEY = 'ugitek-theme';

  /** Şu an ekranda hangi tema var? (seçim yoksa sistem tercihi) */
  function currentTheme() {
    const set = document.documentElement.dataset.theme;
    if (set === 'light' || set === 'dark') return set;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f6f8fc' : '#050a18');
    document.dispatchEvent(new CustomEvent('ugitek:theme', { detail: theme }));
  }

  function initTheme() {
    let stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* gizli sekme */ }
    applyTheme(stored === 'light' || stored === 'dark' ? stored : currentTheme());

    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* gizli sekme */ }
    });
  }

  /** Üst menüdeki küçük künye. Kısa, soluk, tıklanabilir (adres varsa). */
  function navCredit() {
    const c = D.credit;
    if (!c || !c.short) return '';
    return c.url
      ? `<a class="nav-credit" href="${c.url}" target="_blank" rel="noopener">${esc(c.short)}</a>`
      : `<span class="nav-credit">${esc(c.short)}</span>`;
  }

  /** Footer künyesi. data.js -> credit bloğundan beslenir. */
  function creditMark() {
    const c = D.credit;
    if (!c || !c.name) return '';
    const inner = ICONS.codeMark + '<span>' + esc(c.role) + '</span><b>' + esc(c.name) + '</b>';
    return c.url
      ? `<a class="credit" href="${c.url}" target="_blank" rel="noopener">${inner}</a>`
      : `<span class="credit">${inner}</span>`;
  }

  /* --------------------------------------------------------- navigasyon */

  function initNav() {
    const nav = document.getElementById('nav');
    const bar = document.getElementById('scrollProgress');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');

    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        menu.classList.toggle('open', !open);
      });
      menu.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('open');
        }
      });
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (nav) nav.classList.toggle('scrolled', y > 20);
        if (bar) {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------- kaydırınca görünürleşme */

  function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach((el) => io.observe(el));
  }

  /** Bir kap içindeki çocuklara kademeli gecikme verir. */
  function stagger(container, step) {
    const kids = container.querySelectorAll('[data-reveal]');
    kids.forEach((el, i) => el.style.setProperty('--delay', (i * (step || 70)) + 'ms'));
  }

  /* ------------------------------------------------------------ sayaçlar */

  function initCounters() {
    const nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;

    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (reduceMotion) { el.textContent = target + suffix; return; }

      const dur = 1500;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        run(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.5 });

    nums.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------- açılır bölümler */

  function initAccordions() {
    document.querySelectorAll('.accordion').forEach((acc) => {
      const single = acc.dataset.single === 'true';
      acc.addEventListener('click', (e) => {
        const head = e.target.closest('.acc-head');
        if (!head || !acc.contains(head)) return;

        const item = head.parentElement;
        const open = item.dataset.open === 'true';

        if (single) {
          acc.querySelectorAll('.acc-item').forEach((el) => {
            el.dataset.open = 'false';
            el.querySelector('.acc-head').setAttribute('aria-expanded', 'false');
          });
        }
        item.dataset.open = String(!open);
        head.setAttribute('aria-expanded', String(!open));
      });
    });
  }

  /* ------------------------------------------- karttaki imleç parıltısı */

  function initCardGlow() {
    if (reduceMotion || window.matchMedia('(hover: none)').matches) return;
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest('.card-glow');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    }, { passive: true });
  }

  /* --------------------------------------------- hero: takımyıldız ağı */

  function initConstellation() {
    const canvas = document.getElementById('constellation');
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dots = [], raf = null;
    const pointer = { x: -9999, y: -9999 };

    // Renkler CSS değişkenlerinden okunur ki tema değişince ağ da değişsin.
    let palette = readPalette();

    function readPalette() {
      const cs = getComputedStyle(document.documentElement);
      const val = (name, fallback) => (cs.getPropertyValue(name).trim() || fallback);
      return {
        dot: val('--canvas-dot', '160, 200, 255'),
        line: val('--canvas-line', '120, 170, 255'),
        alpha: parseFloat(val('--canvas-alpha', '1')) || 1,
      };
    }

    document.addEventListener('ugitek:theme', () => { palette = readPalette(); });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.round((w * h) / 16000), 110);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.6 + 0.6,
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + palette.dot + ', ' + (0.55 * palette.alpha) + ')';
        ctx.fill();
      }

      // Yakın noktalar arasına çizgi çek
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > 132) continue;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = 'rgba(' + palette.line + ', ' +
            ((1 - dist / 132) * 0.22 * palette.alpha) + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // İmlecin çevresindeki noktalar turuncuyla bağlanır
      for (const d of dots) {
        const dist = Math.hypot(d.x - pointer.x, d.y - pointer.y);
        if (dist > 170) continue;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.strokeStyle = `rgba(255, 138, 40, ${(1 - dist / 170) * 0.45})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();

    window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); frame(); });
    window.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    }, { passive: true });
    window.addEventListener('pointerleave', () => { pointer.x = pointer.y = -9999; });

    // Sekme arkaplandayken boşuna çizim yapma
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else frame();
    });
  }

  /* --------------------------------------------------------- yardımcılar */

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  /** "Fatma Nur KELOĞLU" -> "FK" */
  function initials(name) {
    const parts = String(name).trim().split(/\s+/);
    const first = parts[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1] : '';
    return (first.charAt(0) + last.charAt(0)).toLocaleUpperCase('tr-TR');
  }

  /** İsimden dosya adı üretir: publicassets/team/<slug>.jpg varsa fotoğraf gösterilir. */
  function slugify(name) {
    const map = { ç: 'c', ğ: 'g', ı: 'i', İ: 'i', ö: 'o', ş: 's', ü: 'u', Ç: 'c', Ğ: 'g', Ö: 'o', Ş: 's', Ü: 'u' };
    return String(name)
      .replace(/[çğıİöşüÇĞÖŞÜ]/g, (c) => map[c] || c)
      .toLocaleLowerCase('en-US')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  window.UGITEK_UI = {
    esc, initials, slugify, stagger, icon, paintIcons,
    eventHead, fixMissingPhotos, ICONS, reduceMotion,
    // Tek sayfalik onizleme her rota degisiminde bunlari yeniden calistirir.
    initReveal, initCounters, initAccordions, initConstellation,
  };

  /* ------------------------------------------------------------- başlat */

  function boot() {
    buildChrome();
    initTheme();
    initNav();
    initCardGlow();

    // Önizleme derlemesinde sayfa içeriğini yönlendirici basar; o kendi
    // render/animasyon çağrılarını yapar.
    if (window.UGITEK_PREVIEW) {
      document.dispatchEvent(new CustomEvent('ugitek:ready'));
      return;
    }

    initAccordions();
    initConstellation();
    paintIcons();

    // Sayfaya özel içerik render edildikten sonra animasyonları bağla
    if (typeof window.renderPage === 'function') window.renderPage();

    initReveal();
    initCounters();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
