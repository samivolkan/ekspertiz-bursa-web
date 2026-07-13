# Ekspertiz Bursa Web

Ekspertiz Bursa için paket karşılaştırma, yerel SEO ve kalıcı randevu kaydı içeren bağımsız web projesi.

## Özellikler

- Bursa ve Nilüfer odaklı SEO sayfaları
- Kaporta, Motor-Mekanik, Mini, Orta, Tam ve Full paketleri
- Cloudflare D1 üzerinde kalıcı randevu talepleri
- Telefon normalizasyonu, honeypot ve telefon bazlı hız sınırı
- KVKK aydınlatması ile isteğe bağlı pazarlama izninin ayrılması
- Google Tag Manager için izin tabanlı ölçüm hazırlığı
- `robots.txt`, `sitemap.xml` ve `AutoRepair` yapılandırılmış verisi
- 10 özgün Bursa, Nilüfer ve hizmet açılış sayfası
- 100 puanlık JSON, HTML ve Markdown SEO sağlık raporu
- Her gün 06.00 Türkiye saatinde GitHub Actions ve güvenli auto-fix PR akışı

## Yerel çalışma

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd test
npm.cmd run build:static-hosting
npm.cmd run seo:audit:local
npm.cmd run seo:audit:production
npm.cmd run seo:audit:fix:dry
```

Varsayılan yerel adres `http://localhost:3000/` olur.

## Yayın öncesi tamamlanacak bilgiler

- Ticari unvan
- Paket fiyatlarının KDV dahil/hariç durumu
- Google Business Profile bağlantısı ve koordinatlar
- Sosyal medya hesapları
- Google Tag Manager veya GA4 kimliği
- `info@ekspertizbursa.com` adresinin canonical alan adından farklı olmasının işletme tarafından teyidi

Gerçek gizli değerler repoya eklenmez; barındırma ortamında tanımlanır.

## Günlük SEO otomasyonu

`.github/workflows/daily-seo-audit.yml` her gün production alan adını ve üretilen statik sürümü denetler. Raporları 30 gün artifact olarak saklar, tek bir `SEO Günlük Sağlık ve Eksik Takibi` issue kaydını günceller ve yalnız deterministik düzeltmeler için ayrı draft PR açar. Main branch'e otomatik yazmaz ve otomatik merge yapmaz.
