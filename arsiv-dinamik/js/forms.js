/* =========================================================================
   UGİTEK — form gönderimi için ortak yardımcılar
   ========================================================================= */
(function () {
  'use strict';

  /** Bir alanın hata mesajını gösterir / temizler. */
  function setError(form, name, message) {
    // Aynı isimli birden çok giriş varsa (checkbox grubu) elements[name] liste döner.
    const input = form.elements[name];
    const field = input && typeof input.closest === 'function'
      ? input.closest('.field')
      : form.querySelector(`[data-field="${name}"]`);
    if (!field) return;
    field.classList.toggle('invalid', Boolean(message));
    const slot = field.querySelector('.err');
    if (slot) slot.textContent = message || '';
  }

  function clearErrors(form) {
    form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
    const alert = form.querySelector('.alert');
    if (alert) alert.classList.remove('show');
  }

  function showAlert(form, message, kind) {
    const alert = form.querySelector('.alert');
    if (!alert) return;
    alert.className = 'alert alert-' + (kind || 'error') + ' show';
    alert.innerHTML = '<span aria-hidden="true">' + (kind === 'success' ? '✓' : '!') + '</span><span>' + message + '</span>';
    alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /** Form alanlarını düz bir nesneye çevirir; checkbox grupları dizi olur. */
  function collect(form) {
    const data = {};
    for (const el of form.elements) {
      if (!el.name || el.disabled) continue;
      if (el.type === 'checkbox') {
        if (el.dataset.group) {
          (data[el.name] = data[el.name] || []);
          if (el.checked) data[el.name].push(el.value);
        } else {
          data[el.name] = el.checked;
        }
      } else if (el.type === 'radio') {
        if (el.checked) data[el.name] = el.value;
      } else {
        data[el.name] = el.value;
      }
    }
    return data;
  }

  /**
   * Formu API'ye bağlar.
   * @param {object} opts { form, endpoint, panel, transform }
   */
  function wire(opts) {
    const form = typeof opts.form === 'string' ? document.getElementById(opts.form) : opts.form;
    if (!form) return;

    const submit = form.querySelector('[type="submit"]');

    // Kullanıcı yazmaya başlayınca o alanın hatasını kaldır
    form.addEventListener('input', (e) => {
      const field = e.target.closest('.field, .check-wrap');
      if (field) field.classList.remove('invalid');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors(form);

      let payload = collect(form);
      if (typeof opts.transform === 'function') payload = opts.transform(payload, form);

      submit.classList.add('loading');
      submit.disabled = true;

      try {
        const res = await fetch(opts.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json().catch(() => ({}));

        if (!res.ok || !json.ok) {
          if (json.errors) {
            Object.keys(json.errors).forEach((k) => setError(form, k, json.errors[k]));
            const first = form.querySelector('.invalid');
            if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
            showAlert(form, 'Bazı alanları düzeltmen gerekiyor. İşaretli yerlere bak.', 'error');
          } else {
            showAlert(form, json.error || 'Bir şeyler ters gitti. Lütfen tekrar dene.', 'error');
          }
          return;
        }

        const panel = document.getElementById(opts.panel);
        if (panel) {
          form.closest('.form-card').style.display = 'none';
          panel.classList.add('show');
          panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          form.reset();
          showAlert(form, opts.successMessage || 'Gönderildi, teşekkürler!', 'success');
        }
      } catch (err) {
        showAlert(form, 'Sunucuya ulaşılamadı. İnternet bağlantını kontrol edip tekrar dene.', 'error');
      } finally {
        submit.classList.remove('loading');
        submit.disabled = false;
      }
    });
  }

  /**
   * data.js'te externalForms.<key> doluysa site içi formu gizleyip
   * Google Form'a yönlendiren bir kart gösterir. Boşsa hiçbir şey yapmaz.
   * @returns {boolean} dış forma yönlendirildi mi
   */
  function useExternalForm(key, formId, title) {
    const url = (window.UGITEK.externalForms || {})[key];
    if (!url) return false;

    const form = document.getElementById(formId);
    if (!form) return false;

    const card = form.closest('.form-card');
    card.innerHTML =
      '<div style="text-align:center;padding:clamp(1.5rem,5vw,3rem) 1rem">' +
        '<div style="font-size:2.6rem;margin-bottom:1rem" aria-hidden="true">📝</div>' +
        '<h2 style="font-size:clamp(1.4rem,3.5vw,2rem);margin-bottom:.9rem">' + title + '</h2>' +
        '<p style="max-width:46ch;margin:0 auto 2rem">' +
          'Başvurular Google Form üzerinden toplanıyor. Aşağıdaki butona tıklayarak ' +
          'formu doldurabilirsin — birkaç dakika sürüyor.' +
        '</p>' +
        '<a class="btn btn-primary btn-arrow" href="' + url + '" target="_blank" rel="noopener">' +
          '<span class="btn-label">Forma Git</span>' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
          'stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' +
      '</div>';
    return true;
  }

  window.UGITEK_FORM = { wire, setError, clearErrors, showAlert, collect, useExternalForm };
})();
