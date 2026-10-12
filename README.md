# UGİTEK Web Sitesi

Manisa Celal Bayar Üniversitesi **Uluslararası Girişimcilik ve Teknoloji Topluluğu**
resmi web sitesi.

🌐 **Canlı:** https://ugitek.tech

**Tamamen statik bir sitedir.** Sunucu kodu, veritabanı, giriş paneli yoktur —
yalnızca HTML, CSS ve JavaScript. Üyelik ve başvurular Google Form / WhatsApp /
Instagram üzerinden yürür (bağlantılar Linktree'dekiyle aynıdır).

Bu sayede herhangi bir paylaşımlı hosting'e **FTP ile yükleyip** çalıştırabilirsiniz;
PHP, Node.js veya veritabanı desteği gerekmez.

---

## Yayınlama

Site **GitHub Pages** üzerinde, **https://ugitek.tech** adresinde yayınlanır.

### Nasıl güncellenir?

`main` dalına yapılan her push otomatik olarak yayına çıkar. `public/` klasöründe
bir şey değiştirip:

```bash
git add -A
git commit -m "etkinlik eklendi"
git push
```

Bir dakika içinde canlıdır. Durumu GitHub'da **Actions** sekmesinden izleyebilirsiniz.

Yayın akışı `.github/workflows/deploy.yml` dosyasında tanımlı; `public/` klasörünü
paketleyip Pages'e gönderir. Başka bir ayar gerekmez.

### Alan adı ayarları

`public/CNAME` dosyası `ugitek.tech` yazar — GitHub Pages özel alan adını buradan okur.
**Bu dosyayı silmeyin.**

Alan adının DNS kayıtları (get.tech panelinde) şöyle olmalı:

| Tür | Ad | Değer |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `<kullanıcı-adı>.github.io` |

HTTPS sertifikasını GitHub ücretsiz olarak kendisi alır (Settings → Pages →
*Enforce HTTPS*). DNS yayılması 10 dakika ile birkaç saat arasında sürebilir.

### Üniversite sunucusuna (FTP) yüklemek gerekirse

Site tamamen statiktir, herhangi bir yere FTP ile de yüklenebilir:
`public/` klasörünün **içindekileri** sunucunun yayın klasörüne (`public_html`,
`www`, `htdocs`…) kopyalamanız yeterli. `npm run zip` komutu hazır bir paket üretir.

Tüm bağlantılar görelidir; site alan adının kökünde de bir alt klasörde de çalışır.
Yalnızca `og:` etiketleri ve `sitemap.xml` içindeki `https://ugitek.tech` adresini
yeni adrese göre değiştirmeniz gerekir.

---

## Yerelde önizleme

```bash
npm start        # http://localhost:3000
```

Bu komut yalnızca `public/` klasörünü servis eden küçük bir sunucu çalıştırır;
**hiçbir paket kurmanız gerekmez** (`npm install` bile gerekmiyor).

Alternatif: `public/index.html` dosyasına çift tıklayıp doğrudan tarayıcıda
açabilirsiniz. Neredeyse her şey çalışır, ama yerel sunucu gerçek ortama daha yakındır.

---

## Sayfalar

| Dosya | İçerik |
|---|---|
| `index.html` | Ana sayfa — tanıtım, açılır bölümler, etkinlikler, yönetim önizlemesi, S.S.S. |
| `biz-kimiz.html` | Hikâye, misyon/vizyon, değerler, zaman çizelgesi, **tüm yönetim kurulu** |
| `etkinlikler.html` | Programlar, format açıklamaları, geçmiş etkinlik arşivi |
| `uye-ol.html` | Üyelik adımları + **Google Form**, WhatsApp ve Instagram bağlantıları |
| `idari-kadro.html` | Yedi ekibin ne yaptığı, başvuru süreci, beklentiler |
| `iletisim.html` | İletişim kanalları, öneri/iş birliği yönlendirmesi |
| `404.html` | Sayfa bulunamadı |

---

## İçeriği güncellemek

Neredeyse tüm metinler tek bir dosyada: **`public/js/data.js`**.
Kod bilmeden düzenlenebilecek şekilde yazıldı — tırnak işaretlerinin arasını
değiştirip kaydetmeniz yeterli.

| Ne değişecek | `data.js` içinde |
|---|---|
| **Bağlantılar** (form, WhatsApp, Instagram, e-posta…) | `info` |
| Ana sayfadaki kayan şerit kelimeleri | `ticker` |
| "Ne yapıyoruz" açılır bölümleri | `pillars` |
| Etkinlik kartları | `events` |
| Geçmiş etkinlik arşivi | `archive` |
| Kuruluştan bugüne zaman çizelgesi | `timeline` |
| **Yönetim kurulu / ekipler** | `board` |
| İdari kadro ekip listesi | `teams` |
| S.S.S. | `faq` |

Değişiklikten sonra dosyaları tekrar FTP'ye yükleyin (`js/data.js` yeterli olur).

### Üyelik formu değişirse

`data.js` → `info.memberForm` alanındaki adresi değiştirin. Bu adres hem üyelik
sayfasındaki büyük butonda hem de footer'da kullanılıyor — tek yerden yönetilir.
Aynı şekilde `info.whatsapp`, `info.instagram`, `info.linktree` ve `info.email`.

### Açık / koyu tema

Ziyaretçi ilk girdiğinde işletim sistemi tercihi uygulanır; menüdeki güneş/ay
düğmesiyle değiştirebilir, seçimi tarayıcısında saklanır.

Renkler `public/css/style.css` en üstteki token bloğunda: `--d-*` koyu temanın,
`--l-*` açık temanın değerleri.

### İkonlar

Çizimler `public/js/site.js` içindeki `ICON_PATHS` nesnesinde (24×24 SVG).

- Etkinlik kartları: `data.js` → `events[].icon`
- Ekip kartları: `data.js` → `teams[].icon`
- Sabit kartlar: `<span class="card-icon" data-icon="target"></span>`

### Etkinlik fotoğrafları

Fotoğraflar da tıpkı CSS ve JS gibi birer dosyadır; sitenin statik olması
fotoğraf eklemeye engel değil. Dosyaları `public/assets/events/` klasörüne
koyar, FTP ile diğerleriyle birlikte yüklersiniz.

**İki yerde görünürler:**

1. **Etkinlik kartlarında** — `data.js` → `events[]` içindeki `photo` alanına
   dosya adını yazın. Boş bırakılırsa kart eski ikonlu hâlinde kalır.

   ```js
   {
     title: 'Future Tech 4',
     photo: 'future-tech-4.jpg',   // ← dosya adı
     ...
   }
   ```

2. **Galeride** — `data.js` → `gallery` listesine satır ekleyin. Liste boşken
   Etkinlikler sayfasındaki galeri bölümü hiç görünmez.

   ```js
   gallery: [
     { file: 'future-tech-3.jpg', caption: 'Future Tech 3 · SUMMIT' },
     { file: 'mcbukaf-stand.jpg', caption: 'MCBÜKAF standımız' },
   ],
   ```

Dosya adını yazıp fotoğrafı yüklemeyi unutursanız site bozulmaz: kart ikona
döner, galeri karesi sessizce kaybolur.

Boyut ve isimlendirme önerileri `public/assets/events/OKU-BENI.txt` dosyasında.
Kısaca: kart görselleri 16:9, galeri 4:3, dosya başına 300 KB altı, adlarda
Türkçe karakter ve boşluk yok.

### Paylaşım görseli (og.png)

`public/assets/og.jpg`, link WhatsApp / Instagram / LinkedIn'de paylaşıldığında
çıkan önizleme kartıdır. Değiştirmek isterseniz aynı isimle 1.91:1 oranında
(örn. 1200×630) bir görsel koymanız yeterli.

> **Alan adı değişirse:** HTML dosyalarındaki `og:` etiketleri, `canonical`
> bağlantısı, `robots.txt` ve `sitemap.xml` içinde `https://ugitek.tech`
> adresi geçiyor. Alan adı farklı olursa bu 7 dosyada toplu bul-değiştir yapın.
> Yapılmazsa site yine çalışır, yalnızca paylaşım önizlemesi ve arama motoru
> bilgisi yanlış adresi gösterir.

### Yönetim kurulu fotoğrafları

`public/assets/team/` klasörüne koyun; adlandırma kuralları o klasördeki
`OKU-BENI.txt` dosyasında. Fotoğraf yoksa site ismin baş harflerini renkli
bir daire içinde gösterir.

---

## Proje yapısı

```
UGITEK/
├── .github/workflows/
│   └── deploy.yml       GitHub Pages otomatik yayın akışı
├── public/              ← YAYINLANAN KLASÖR
│   ├── CNAME            Özel alan adı (ugitek.tech) — silmeyin
│   ├── *.html
│   ├── css/style.css    Tüm tasarım sistemi + iki tema
│   ├── js/
│   │   ├── data.js      ← İÇERİK BURADA
│   │   └── site.js      Menü, tema, animasyonlar, ikonlar
│   ├── assets/
│   │   ├── logo.svg
│   │   ├── og.jpg       Paylaşım önizleme görseli
│   │   ├── team/        Yönetim kurulu fotoğrafları
│   │   └── events/      Etkinlik fotoğrafları
│   ├── robots.txt
│   └── sitemap.xml
├── tools/
│   ├── serve.cjs        Yerel önizleme sunucusu
│   └── make-zip.cjs     Yüklemeye hazır zip üretir
└── arsiv-dinamik/       Kullanılmayan sunuculu sürüm (aşağıya bakın)
```

---

## `arsiv-dinamik/` klasörü nedir?

Site önce **site içi başvuru formları ve yönetim paneli** ile geliştirilmişti:
üyelik/idari kadro başvuruları sitede toplanıyor, yönetim kurulu şifreli bir
panelden başvuruları görüp onaylıyordu. Bilgi işlem bu yapıya izin vermediği için
site statiğe çevrildi.

O sürümün kodu silinmedi, `arsiv-dinamik/` altında duruyor:

```
arsiv-dinamik/
├── server.js                 Yerel sunucu (Express)
├── lib/                      Doğrulama, oturum, CSV, depolama
├── netlify/functions/api.mjs Sunucusuz API
├── netlify.toml
├── js/                       forms.js, admin.js
└── eski-sayfalar/            admin.html ve eski form sayfaları
```

İleride izin çıkarsa bu dosyalar geri getirilebilir. **Yayına giden sitede
bunların hiçbiri yok** — `public/` klasöründe sunucu kodu bulunmuyor.

---

## Teknik notlar

- Hiçbir dış JavaScript kütüphanesi yok. Sadece Google Fonts (Sora + Inter) dışarıdan yükleniyor.
- Tüm bağlantılar göreli; site kökte de alt klasörde de çalışır.
- `prefers-reduced-motion` açık kullanıcılarda animasyonlar kapanır.
- Mobilde tipografi ekran genişliğine göre ölçeklenir.
- Sayfalar birbirinden bağımsızdır; biri bozulsa diğerleri çalışmaya devam eder.
