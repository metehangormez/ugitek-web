/* =========================================================================
   UGİTEK — site içeriği
   Etkinlikleri / ekip listesini güncellemek için SADECE bu dosyayı düzenleyin.
   ========================================================================= */

window.UGITEK = {
  /* ---------------------------------------------------------- topluluk */
  info: {
    name: 'UGİTEK',
    longName: 'Uluslararası Girişimcilik ve Teknoloji Topluluğu',
    university: 'Manisa Celal Bayar Üniversitesi',
    founded: 2023,
    term: '2026 – 2027',
    email: 'mcbu.ugitek@gmail.com',
    instagram: 'https://www.instagram.com/mcbu_ugitek/',
    tiktok: 'https://www.tiktok.com/@mcb.ugitek',
    linkedin: 'https://www.linkedin.com/company/mcbu-ugitek/',
    linktree: 'https://linktr.ee/mcbu_ugitek',

    /* Başvuru ve iletişim bağlantıları — hepsi Linktree'deki adreslerle aynı.
       Form değişirse yalnızca burayı güncellemeniz yeterli. */
    memberForm: 'https://docs.google.com/forms/d/e/1FAIpQLSdmSYWu5TMqIeZK04ix-vgQ892kuOQb43zCUY38Z2S8FZD7hg/viewform',
    whatsapp: 'https://chat.whatsapp.com/FWfyEMt0b2UBp0w6d1Oe1J',
  },

  /* ------------------------------------------------------------- künye
     Sitenin altında ve "Biz Kimiz" sayfasında görünür.
     url boş bırakılırsa isim düz yazı olarak gösterilir; LinkedIn ya da
     Instagram adresi yazarsanız tıklanabilir hâle gelir.                */
  credit: {
    role: 'Tasarım & Geliştirme',
    name: 'Metehan Görmez',
    url: '',
    /* Üst menüdeki kısa künye. Boş = header'da künye yok (tercih edilen hâli).
       İleride istenirse 'Designed by Metehan Görmez' yazmak yeterli. */
    short: '',
    note: 'Bu sitenin tasarımı ve kodu, topluluğumuzun yönetim kurulu üyesi Metehan Görmez tarafından hazırlandı.',
  },

  /* ------------------------------------------------------- kayan şerit */
  ticker: [
    'GİRİŞİMCİLİK', 'TEKNOLOJİ', 'FUTURE TECH', 'TEKNİK GEZİ', 'NETWORKING',
    'BOOTCAMP', 'MEZUNA SOR', 'İNOVASYON', 'KARİYER', 'YAPAY ZEKÂ', 'STARTUP',
  ],

  /* ------------------------------------------ ana sayfadaki açılır liste */
  pillars: [
    {
      title: 'Zirveler & Summitler',
      text: 'Future Tech serisiyle sektörün dev isimlerini kampüse getiriyoruz. İki gün süren, tamamen öğrenci emeğiyle kurgulanan; panel, atölye ve networking oturumlarından oluşan bir teknoloji festivali.',
      bullets: ['Sektör liderleriyle panel ve söyleşiler', 'Paralel atölye oturumları', 'Stand alanı ve sponsor buluşmaları', 'Onur konuğu sunumları'],
    },
    {
      title: 'Bootcamp & Atölyeler',
      text: 'Fikri projeye, projeyi girişime dönüştüren yoğun kamplar. AEGEUS Bootcamp gibi bir tam gün süren programlarda ekipler kurulur, iş modeli çıkarılır ve gün sonunda jüriye sunum yapılır.',
      bullets: ['Takım kurma ve fikir doğrulama', 'İş modeli kanvası ve MVP çalışması', 'Mentor eşliğinde sprint', 'Demo Day ve jüri değerlendirmesi'],
    },
    {
      title: 'Teknik Geziler',
      text: 'Teoriyi sahada görmek için fabrikalara, teknoparklara ve teknoloji şirketlerine geziler düzenliyoruz. Üretimin nasıl işlediğini bizzat yerinde izliyor, mühendislerle birebir konuşuyoruz.',
      bullets: ['Teknopark ve Ar-Ge merkezi ziyaretleri', 'Üretim tesisi turları', 'Şirket içi kariyer sohbetleri', 'Ulaşım ve organizasyon topluluk tarafından'],
    },
    {
      title: 'Mezuna Sor & Kariyer',
      text: 'Mezunlarımızı kampüse davet ediyoruz. CV, staj, mülakat, ilk iş, yurt dışı süreçleri... Merak edilen her şey filtresiz konuşuluyor.',
      bullets: ['Sektörde çalışan mezunlarla söyleşi', 'CV ve LinkedIn kliniği', 'Staj ve mülakat tüyoları', 'Birebir soru-cevap'],
    },
    {
      title: 'Sosyal & Topluluk Hayatı',
      text: 'Quiz Night, tanışma toplantıları, şenlik standları ve dönem kapanış etkinlikleri. UGİTEK sadece çalışılan değil, arkadaş edinilen bir yer.',
      bullets: ['Dönem açılış tanışma toplantısı', 'Quiz Night ve turnuvalar', 'Bahar şenliği standı', 'Dönem kapanış buluşması'],
    },
    {
      title: 'Kadın & Kapsayıcılık',
      text: 'Future Tech | Rose, baştan sona kadın ekibimiz tarafından organize edilen; teknolojide iz bırakmış kadınları sahneye çıkaran özel bir program.',
      bullets: ['Kadın yöneticilerle panel', 'Rol model buluşmaları', 'Mentorluk eşleştirmesi', '8 Mart özel programı'],
    },
  ],

  /* ------------------------------------------------------- etkinlikler */
  events: [
    {
      icon: 'rocket',
      title: 'Future Tech 4',
      photo: 'future-tech-grup.jpg',
      tag: 'Yakında',
      tagType: 'live',
      text: 'Serinin dördüncüsü hazırlanıyor. İki güne yayılan paneller, atölyeler ve bir bootcamp; teknoloji ve girişimcilik dünyasının isimleriyle dolu bir program.',
      meta: [['Dönem', '2026–2027 Bahar'], ['Yer', 'MCBÜ Kampüs']],
    },
    {
      icon: 'flower',
      title: 'Future Tech | Rose',
      photo: '',
      tag: 'Seri',
      tagType: 'hot',
      text: 'Başından sonuna kadın ekibimiz tarafından organize edilen, sektörde iz bırakmış kadın konuklarımızı ağırladığımız özel program.',
      meta: [['Format', 'Panel + Söyleşi'], ['Katılım', 'Ücretsiz']],
    },
    {
      icon: 'bolt',
      title: 'AEGEUS Bootcamp',
      photo: 'aegeus-bootcamp.jpg',
      tag: 'Bootcamp',
      tagType: 'cool',
      text: 'Bir tam gün süren yoğun kamp. Fikrini projeye, projeni girişime dönüştür; ekibinle üret, gün sonunda jüri karşısına çık.',
      meta: [['Süre', '1 tam gün'], ['Çıktı', 'Demo Day sunumu']],
    },
    {
      icon: 'cap',
      title: 'Mezuna Sor',
      photo: '',
      tag: 'Kariyer',
      tagType: 'hot',
      text: 'Mezunlarımızla filtresiz kariyer sohbeti. Staj, mülakat, ilk iş ve yurt dışı süreçlerini deneyimleyenlerden dinliyoruz.',
      meta: [['Seri', '2 bölüm yapıldı'], ['Format', 'Söyleşi + Soru-cevap']],
    },
    {
      icon: 'quiz',
      title: 'Quiz Night',
      photo: '',
      tag: 'Sosyal',
      tagType: 'cool',
      text: 'Teknoloji, girişimcilik ve genel kültür sorularıyla takım takım yarıştığımız gece. Ödüller var, kahkaha bol.',
      meta: [['Format', 'Takım yarışması'], ['Yer', 'Kampüs']],
    },
    {
      icon: 'factory',
      title: 'Teknik Geziler',
      photo: '',
      tag: 'Saha',
      tagType: 'cool',
      text: 'Teknopark, Ar-Ge merkezi ve üretim tesisi ziyaretleri. Okulda öğrendiğimizin sahada nasıl işlediğini yerinde görüyoruz.',
      meta: [['Sıklık', 'Dönemde 2–3'], ['Ulaşım', 'Topluluk organizasyonu']],
    },
    {
      icon: 'tent',
      title: 'Şenlik Standı',
      photo: 'senlik-standi.jpg',
      tag: 'Kampüs',
      tagType: 'hot',
      text: 'MCBÜKAF ve Bilim Şenliği gibi kampüs etkinliklerinde standımızla yer alıyor, topluluğu binlerce öğrenciyle buluşturuyoruz.',
      meta: [['Etkinlik', 'MCBÜKAF · Bilim Şenliği'], ['Ziyaretçi', 'Binlerce öğrenci']],
    },
    {
      icon: 'wave',
      title: 'Tanışma Toplantısı',
      photo: '',
      tag: 'Dönem Açılışı',
      tagType: 'live',
      text: 'Her dönemin ilk etkinliği. Ekipleri tanıtıyor, dönem planını paylaşıyor ve yeni üyeleri aramıza katıyoruz.',
      meta: [['Ne zaman', 'Dönem başı'], ['Kimler', 'Tüm öğrenciler']],
    },
  ],

  /* ---------------------------------------------- geçmiş etkinlik arşivi */
  archive: [
    {
      title: 'Future Tech 3 · SUMMIT',
      when: 'Mayıs 2026',
      where: 'Süleyman Demirel Kültür Merkezi',
      text: 'İki güne yayılan zirve. Onur konuğumuz Coşkun Yıldırım’ın sunumu, paneller ve paralel oturumlarla serinin en kapsamlı ayağı.',
    },
    {
      title: 'Future Tech | Rose',
      when: 'Mayıs 2026',
      where: 'MCBÜ Kampüs',
      text: 'Baştan sona kadın ekibimizin organize ettiği, teknolojide iz bırakmış kadın konuklarımızla gerçekleşen program.',
    },
    {
      title: 'AEGEUS Bootcamp',
      when: 'Mayıs 2026',
      where: 'MCBÜ Kampüs',
      text: 'Bir tam gün süren girişimcilik kampı. Ekipler kuruldu, fikirler doğrulandı, gün sonunda jüriye sunuldu.',
    },
    {
      title: 'MCBÜKAF Standı',
      when: 'Bahar Şenliği',
      where: 'MCBÜ Şenlik Alanı',
      text: 'Bahar şenliğinde standımızla yer aldık; binlerce öğrenciyle tanıştık, yeni üyelerimizi orada kazandık.',
    },
    {
      title: 'Mezuna Sor 2',
      when: '2025 – 2026',
      where: 'MCBÜ Kampüs',
      text: 'Mezunlarımızla ikinci buluşma. Staj, mülakat ve ilk iş deneyimleri üzerine filtresiz bir söyleşi.',
    },
    {
      title: 'Quiz Night',
      when: '2025 – 2026',
      where: 'MCBÜ Kampüs',
      text: 'Teknoloji ve genel kültür sorularıyla takım takım yarıştığımız, ödüllü bilgi yarışması gecesi.',
    },
    {
      title: 'Allstars Event',
      when: '2024 – 2025',
      where: 'MCBÜ Kampüs',
      text: 'Topluluk ekiplerinin bir araya geldiği, dönem boyunca yapılanların sergilendiği kapanış etkinliği.',
    },
    {
      title: 'Bilim Şenliği ’23',
      when: '2023',
      where: 'MCBÜ Kampüs',
      text: 'Kuruluş yılımızdaki ilk çıkışımız. Standımızla bilim şenliğinde yer aldık ve topluluğu duyurduk.',
    },
  ],

  /* ------------------------------------------------------------- galeri
     Fotoğrafı public/assets/events/ klasörüne koyun, sonra buraya bir satır
     ekleyin. Liste boşken galeri bölümü sayfada hiç görünmez.

     Örnek:
       { file: 'future-tech-3.jpg', caption: 'Future Tech 3 · SUMMIT' },        */
  gallery: [
    { file: 'future-tech-grup.jpg', caption: 'Future Tech · tüm katılımcılar, MCBÜ Teknokent' },
    { file: 'aegeus-bootcamp.jpg',  caption: 'AEGEUS Bootcamp — takımlar iş başında' },
    { file: 'senlik-standi.jpg',    caption: 'Şenlik standımız' },
  ],

  /* ------------------------------------------------------ yol haritası */
  timeline: [
    { year: '2023', title: 'UGİTEK kuruldu', text: 'Manisa Celal Bayar Üniversitesi bünyesinde, girişimcilik ve teknolojiyi bir araya getirme fikriyle yola çıktık. İlk etkinliğimiz Bilim Şenliği standı oldu.' },
    { year: '2024', title: 'İlk Future Tech', text: 'Serinin ilk ayağını düzenledik. Allstars Event, Mezuna Sor ve teknik gezilerle takvim doldu; topluluk kampüste tanınır hâle geldi.' },
    { year: '2025', title: 'Kurumsallaşma', text: 'Ekip yapısı oturdu: Sponsorluk, Teknik Gezi, Sosyal Medya, İletişim ve Organizasyon ekipleri kuruldu. Quiz Night ve Mezuna Sor 2 gerçekleşti.' },
    { year: '2026', title: 'Future Tech 3 & Rose', text: 'Gençlik ve Spor Bakanlığı, UNİDES ve TÜBİTAK Milli Teknoloji Kulüpler Birliği destek programı kapsamında, tamamen öğrenci emeğiyle iki günlük Future Tech 3 ve Rose programını hayata geçirdik.' },
    { year: '2026–27', title: 'Yeni dönem', text: 'Yeni yönetim kurulumuzla birlikte daha fazla atölye, daha fazla teknik gezi ve kampüsün her köşesine yayılan bir program için kolları sıvadık.' },
  ],

  /* --------------------------------------------- yönetim kurulu (2026–27) */
  board: [
    {
      group: 'Yönetim Ekibi',
      members: [
        { name: 'Beyza ŞAHİN', role: 'Topluluk Başkanı', kind: 'lead' },
        { name: 'Zafer TAYBAR', role: 'Başkan Yardımcısı', kind: 'board' },
        { name: 'Yiğit BONCUK', role: 'Başkan Yardımcısı', kind: 'board' },
        { name: 'Furkan ÇİÇEK', role: 'Genel Sekreter', kind: 'lead' },
      ],
    },
    {
      group: 'Sponsorluk Ekibi',
      members: [
        { name: 'Müge TÜRKYILMAZ', role: 'Ekip Lideri', kind: 'lead' },
        { name: 'Emin ÜLGÜÇ', role: 'Ekip Lideri', kind: 'lead' },
        { name: 'Esin METE', role: 'Yönetim Kurulu Üyesi', kind: 'board' },
        { name: 'Betül İNCİ', role: 'Yönetim Kurulu Üyesi', kind: 'board' },
      ],
    },
    {
      group: 'Teknik Gezi Ekibi',
      members: [
        { name: 'Kerem ÜLVER', role: 'Ekip Lideri', kind: 'lead' },
        { name: 'Meryem ZEYREK', role: 'Ekip Lideri', kind: 'lead' },
        { name: 'Fatma Nur KELOĞLU', role: 'Yönetim Kurulu Üyesi', kind: 'board' },
        { name: 'Metehan GÖRMEZ', role: 'Yönetim Kurulu Üyesi', kind: 'board' },
      ],
    },
    {
      group: 'Sosyal Medya Ekibi',
      members: [
        { name: 'Arda GÜN', role: 'Ekip Lideri', kind: 'lead' },
        { name: 'Hatice Nur AKÖZ', role: 'Ekip Lideri', kind: 'lead' },
        { name: 'Selin GÜNGÖR', role: 'Yönetim Kurulu Üyesi', kind: 'board' },
        { name: 'Sude Nur SEVER', role: 'Yönetim Kurulu Üyesi', kind: 'board' },
      ],
    },
    {
      group: 'İletişim Ekibi',
      members: [
        { name: 'Ebru KAPLAN', role: 'Ekip Lideri', kind: 'lead' },
        { name: 'Ceyda TOSUN', role: 'Ekip Lideri', kind: 'lead' },
        { name: 'Şahan Zeki ALTIPARMAK', role: 'Yönetim Kurulu Üyesi', kind: 'board' },
      ],
    },
    {
      group: 'Organizasyon ve Sosyal Etkinlik Ekibi',
      members: [
        { name: 'Elif Naz KUNT', role: 'Ekip Lideri', kind: 'lead' },
        { name: 'Yusuf Talha TOK', role: 'Ekip Lideri', kind: 'lead' },
        { name: 'Halil AYDIN', role: 'Yönetim Kurulu Üyesi', kind: 'board' },
      ],
    },
  ],

  /* ------------------------------------------------------ form seçenekleri */
  classes: ['Hazırlık', '1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf', '5. Sınıf', '6. Sınıf', 'Yüksek Lisans', 'Doktora', 'Mezun'],

  teams: [
    { name: 'Sponsorluk Ekibi', icon: 'briefcase', desc: 'Firmalarla iletişim, sponsorluk dosyası, teklif ve takip süreçleri.' },
    { name: 'Teknik Gezi Ekibi', icon: 'bus', desc: 'Gezi planlaması, kurum iletişimi, ulaşım ve katılımcı organizasyonu.' },
    { name: 'Sosyal Medya Ekibi', icon: 'social', desc: 'Instagram/TikTok içerik üretimi, tasarım, reels çekimi ve etkileşim.' },
    { name: 'İletişim Ekibi', icon: 'envelope', desc: 'Kurum içi/dışı yazışmalar, duyurular, konuk ve katılımcı iletişimi.' },
    { name: 'Organizasyon ve Sosyal Etkinlik Ekibi', icon: 'calendar', desc: 'Etkinlik kurgusu, sahne akışı, lojistik ve gün içi koordinasyon.' },
    { name: 'Tasarım Ekibi', icon: 'palette', desc: 'Afiş, sunum, sosyal medya görselleri ve etkinlik kimliği tasarımı.' },
    { name: 'Yazılım ve Web Ekibi', icon: 'code', desc: 'Site bakımı, kayıt sistemleri, otomasyon ve veri raporlama.' },
  ],

  interests: [
    'Girişimcilik', 'Yapay Zekâ', 'Yazılım Geliştirme', 'Siber Güvenlik', 'Veri Bilimi',
    'Tasarım / UI-UX', 'Pazarlama', 'Finans & Yatırım', 'Robotik & Otomasyon',
    'Oyun Geliştirme', 'Sosyal Medya', 'Organizasyon', 'Sürdürülebilirlik', 'Fotoğraf & Video',
  ],

  departments: [
    'Bilgisayar Mühendisliği', 'Elektrik-Elektronik Mühendisliği', 'Makine Mühendisliği',
    'Endüstri Mühendisliği', 'İnşaat Mühendisliği', 'Gıda Mühendisliği', 'Malzeme Bilimi ve Mühendisliği',
    'İşletme', 'İktisat', 'Uluslararası Ticaret ve Finansman', 'Maliye', 'Siyaset Bilimi ve Kamu Yönetimi',
    'Yönetim Bilişim Sistemleri', 'Hukuk', 'Tıp', 'Diş Hekimliği', 'Eczacılık', 'Hemşirelik',
    'Mimarlık', 'Şehir ve Bölge Planlama', 'Matematik', 'Fizik', 'Kimya', 'Biyoloji',
    'İngilizce Öğretmenliği', 'Matematik Öğretmenliği', 'Sınıf Öğretmenliği',
    'Beden Eğitimi ve Spor', 'Turizm İşletmeciliği', 'Grafik Tasarım',
  ],

  weeklyHours: ['1–3 saat', '4–6 saat', '7–10 saat', '10+ saat'],

  suggestionCategories: [
    'Etkinlik fikri', 'Konuk / konuşmacı önerisi', 'Teknik gezi önerisi',
    'Atölye / eğitim talebi', 'Sosyal medya içeriği', 'İş birliği teklifi',
    'Şikâyet / geri bildirim', 'Diğer',
  ],

  /* ------------------------------------------------------------- S.S.S. */
  faq: [
    {
      q: 'UGİTEK’e kimler üye olabilir?',
      a: 'Manisa Celal Bayar Üniversitesi’nde okuyan her öğrenci üye olabilir. Bölüm, sınıf ya da fakülte ayrımı yok — mühendislikten hukuka, tıptan turizme herkes aramızda.',
    },
    {
      q: 'Üyelik ücretli mi?',
      a: 'Hayır. Üyelik tamamen ücretsiz. Etkinliklerimizin büyük çoğunluğu da ücretsizdir; ücretli olanlar (bazı geziler gibi) duyurularda ayrıca belirtilir.',
    },
    {
      q: 'Üye olduktan sonra ne oluyor?',
      a: 'Kayıt formundaki yanıtın yönetim kuruluna ulaşır. Kaydın işlendiğinde e-posta ile dönüş yapılır ve WhatsApp duyuru grubumuza yönlendirilirsin; etkinlik ve ekip çağrılarından ilk sen haberdar olursun.',
    },
    {
      q: 'İdari kadro başvurusu ile üyelik arasındaki fark ne?',
      a: 'Üyelik, etkinliklere katılmak ve topluluğun parçası olmak için yeterli; kayıt formunu doldurman yeterli. İdari kadro ise topluluğu yöneten ekiplerde (sponsorluk, organizasyon, sosyal medya vb.) aktif görev almak isteyenler için. İdari kadro çağrısı dönem başlarında Instagram’dan duyurulur ve tanışma görüşmesi içerir.',
    },
    {
      q: 'Teknik bilgim yok, yine de katılabilir miyim?',
      a: 'Kesinlikle. Topluluğun yarısı teknik olmayan işlerden oluşuyor: organizasyon, iletişim, sponsorluk, tasarım, içerik... Merak ve istek yeterli, gerisini birlikte öğreniyoruz.',
    },
    {
      q: 'Etkinlikleri nereden takip edebilirim?',
      a: 'En hızlı yol Instagram hesabımız @mcbu_ugitek. WhatsApp duyuru grubumuzda da her etkinlik önceden paylaşılıyor; bu sitedeki Etkinlikler sayfasından da programı görebilirsin.',
    },
  ],
};
