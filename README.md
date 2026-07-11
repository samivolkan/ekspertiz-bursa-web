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

## Yerel çalışma

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd test
```

Varsayılan yerel adres `http://localhost:3000/` olur.

## Yayın öncesi tamamlanacak bilgiler

- Ticari unvan
- Paket fiyatlarının KDV dahil/hariç durumu
- Google Tag Manager kimliği

Gerçek gizli değerler repoya eklenmez; barındırma ortamında tanımlanır.
