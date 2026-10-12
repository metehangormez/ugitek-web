/**
 * UGİTEK — siteyi FTP'ye yüklemeye hazır bir .zip yapar
 *
 *   npm run zip
 *
 * public/ klasörünün içeriğini ugitek-site.zip dosyasına koyar.
 * FTP istemcisi zip açamıyorsa doğrudan public/ içindekileri de yükleyebilirsiniz.
 *
 * Windows'un Compress-Archive komutu dosya yollarını ters bölü (\) ile yazıyor;
 * bazı yükleme servisleri bunu çözemiyor. Bu betik ZIP'i standartlara uygun
 * (düz bölü) üretir.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public');
const OUT = path.join(ROOT, 'ugitek-site.zip');

/** Klasörü, ZIP içindeki göreli yollarıyla birlikte düz listeye çevirir. */
function walk(dir, base) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = base ? base + '/' + entry.name : entry.name;
    if (entry.isDirectory()) files.push(...walk(full, rel));
    else files.push({ rel, full });
  }
  return files;
}

/** MS-DOS tarih/saat biçimi (ZIP başlıklarının istediği hâli). */
function dosTime(date) {
  const time = ((date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() / 2)) & 0xffff;
  const day = (((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()) & 0xffff;
  return { time, day };
}

const entries = walk(SRC, '');
const now = dosTime(new Date());
const chunks = [];
const central = [];
let offset = 0;

for (const entry of entries) {
  const raw = fs.readFileSync(entry.full);
  const deflated = zlib.deflateRawSync(raw, { level: 9 });
  // Sıkıştırma büyütüyorsa dosyayı olduğu gibi sakla.
  const useDeflate = deflated.length < raw.length;
  const data = useDeflate ? deflated : raw;
  const crc = zlib.crc32(raw);
  const name = Buffer.from(entry.rel, 'utf8');

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);   // imza
  local.writeUInt16LE(20, 4);           // gereken sürüm
  local.writeUInt16LE(0x0800, 6);       // bayraklar: UTF-8 dosya adı
  local.writeUInt16LE(useDeflate ? 8 : 0, 8);
  local.writeUInt16LE(now.time, 10);
  local.writeUInt16LE(now.day, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(data.length, 18);
  local.writeUInt32LE(raw.length, 22);
  local.writeUInt16LE(name.length, 26);
  local.writeUInt16LE(0, 28);           // ek alan yok

  chunks.push(local, name, data);

  const dir = Buffer.alloc(46);
  dir.writeUInt32LE(0x02014b50, 0);
  dir.writeUInt16LE(20, 4);             // oluşturan sürüm
  dir.writeUInt16LE(20, 6);             // gereken sürüm
  dir.writeUInt16LE(0x0800, 8);
  dir.writeUInt16LE(useDeflate ? 8 : 0, 10);
  dir.writeUInt16LE(now.time, 12);
  dir.writeUInt16LE(now.day, 14);
  dir.writeUInt32LE(crc, 16);
  dir.writeUInt32LE(data.length, 20);
  dir.writeUInt32LE(raw.length, 24);
  dir.writeUInt16LE(name.length, 28);
  dir.writeUInt16LE(0, 30);             // ek alan
  dir.writeUInt16LE(0, 32);             // yorum
  dir.writeUInt16LE(0, 34);             // disk numarası
  dir.writeUInt16LE(0, 36);             // iç öznitelik
  dir.writeUInt32LE(0, 38);             // dış öznitelik
  dir.writeUInt32LE(offset, 42);        // yerel başlığın konumu

  central.push(dir, name);
  offset += local.length + name.length + data.length;
}

const centralBuf = Buffer.concat(central);

const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(0, 4);                       // disk
end.writeUInt16LE(0, 6);                       // merkezi dizinin başladığı disk
end.writeUInt16LE(entries.length, 8);
end.writeUInt16LE(entries.length, 10);
end.writeUInt32LE(centralBuf.length, 12);
end.writeUInt32LE(offset, 16);
end.writeUInt16LE(0, 20);                      // yorum uzunluğu

fs.writeFileSync(OUT, Buffer.concat([...chunks, centralBuf, end]));

console.log('Yazıldı : ' + path.relative(ROOT, OUT));
console.log('Dosya   : ' + entries.length);
console.log('Boyut   : ' + (fs.statSync(OUT).size / 1024).toFixed(0) + ' KB');
