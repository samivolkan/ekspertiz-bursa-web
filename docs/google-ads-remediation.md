# Google Ads güvenlik ve yanlış beyan düzeltme planı

Son gözden geçirme: 17 Ağustos 2026

## 1. Teşhis

Google Ads hedef sayfa denetiminde iki ayrı risk bulunuyor:

1. **Erişilebilirlik riski:** Normal ziyaretçiye açılan bazı sayfalar bot, HEAD isteği veya çerez/JavaScript çalıştırmayan istemcilerde 503 ya da doğrulama ekranı döndürebiliyor. Bu davranış sayfa uygulamasından çok hosting, CDN, WAF, bot koruması veya rate-limit katmanına işaret eder.
2. **Yanlış beyan riski:** Reklam metnindeki “Bursa geneli” ifadesi fiziksel şubenin Nilüfer/Üçevler’de olduğu gerçeğiyle açıkça ilişkilendirilmezse birden fazla şube veya mobil hizmet varmış gibi yorumlanabilir.

Kaynak uygulama statik olarak üretilir. Apache normalde statik dosyalarda GET ve HEAD için aynı durum kodunu verir. Dolayısıyla canlı ortamda yalnız HEAD isteğinin 503 alması, upstream güvenlik katmanının ayrıca incelenmesini gerektirir.

## 2. Kodda yapılan düzeltmeler

- `AdsBot-Google` ve `AdsBot-Google-Mobile` için `robots.txt` içinde açık `Allow: /` kuralı eklendi.
- Her sayfada görünen hizmet alanı açıklaması eklendi:
  - Fiziksel hizmet noktası Nilüfer/Üçevler’dir.
  - “Bursa geneli”, Bursa ilçelerinden müşterilerin bu fiziksel şubeye gelmesini ifade eder.
  - Başka ilçede şube veya mobil/yerinde ekspertiz hizmeti iddiası değildir.
- `/.well-known/adsbot-health.txt` sağlık kontrolü eklendi.
- GET/HEAD durum kodlarını, doğrulama ekranlarını, temel işletme beyanlarını ve sentetik AdsBot kullanıcı ajanlarını denetleyen `npm run audit:google-ads` komutu eklendi.
- Kaynak kod, statik çıktı ve canlı hedef için günlük kalite kapısı hazırlandı.

## 3. Hosting/CDN/WAF tarafında zorunlu işlemler

Bu bölüm kod değişikliğiyle çözülemez; hosting paneli veya sağlayıcı desteği gerekir.

### 3.1. Public sayfalarda tarayıcı doğrulamasını kaldırın

Aşağıdaki rotalar hiçbir çerez, JavaScript challenge, CAPTCHA veya “isteğiniz doğrulanıyor” ekranı olmadan doğrudan içerik döndürmelidir:

- `/`
- `/randevu/`
- `/iletisim/`
- `/hakkimizda/`
- `/paketler/`
- `/bursa-oto-ekspertiz/`
- `/nilufer-oto-ekspertiz/`
- `/robots.txt`
- `/sitemap.xml`
- `/.well-known/adsbot-health.txt`

Bu URL’lerde WAF yönetilen challenge, browser integrity check, bot fight mode, JavaScript challenge ve agresif rate-limit uygulanmamalıdır.

### 3.2. Google botlarını kullanıcı ajanına göre körlemesine beyaz listeye almayın

`Googlebot` veya `AdsBot-Google` kullanıcı ajanı taklit edilebilir. Güvenlik kuralı şu sırayı izlemelidir:

1. Sağlayıcının **Verified Bots / Known Bots** sınıflandırmasını kullanın.
2. Sağlayıcı desteklemiyorsa Google’ın yayınladığı crawler IP aralıklarını kullanın.
3. Tekil olaylarda reverse DNS ve ardından forward DNS doğrulaması yapın.
4. Doğrulanmış Google crawler isteklerinde challenge, CAPTCHA ve rate-limit atlanmalıdır.
5. Doğrulanmamış ve yalnız kullanıcı ajanı Google gibi görünen istemciler normal güvenlik kurallarına tabi kalabilir.

AdsBot özel crawler IP listesi Google’ın `special-crawlers.json` kaynağından güncel tutulmalıdır. IP’leri elle ve kalıcı biçimde kopyalamak yerine sağlayıcının otomatik güncellenen verified-bot özelliği tercih edilmelidir.

### 3.3. HEAD ve GET eşitliği

Her public URL için şu koşul sağlanmalıdır:

- `GET` sonucu: `200`
- `HEAD` sonucu: `200`
- Aynı canonical hedef
- Aynı temel response header’ları
- HEAD gövdesiz olabilir; fakat 403, 429 veya 503 dönmemelidir.

Apache/LiteSpeed tarafında HEAD engelleyen bir ModSecurity kuralı, güvenlik eklentisi veya özel rewrite bulunuyorsa kaldırılmalı ya da public rotalar için istisna tanımlanmalıdır.

### 3.4. Rate-limit ayarı

- GET ve HEAD, public landing page’lerde aynı limit havuzunda makul toleransla çalışmalıdır.
- Google verified bots rate-limit challenge’ından muaf tutulmalıdır.
- Form POST endpoint’i için rate-limit korunabilir.
- `/randevu/` sayfasının GET/HEAD erişimi ile form gönderim endpoint’inin POST koruması birbirine karıştırılmamalıdır.
- Eksik cookie, eksik referer, veri merkezi IP’si veya JavaScript çalıştırmama tek başına 503 sebebi olmamalıdır.

### 3.5. Hosting sağlayıcısına gönderilecek teknik talep

```text
www.bursaekspertiz.com alan adında public statik sayfalar normal GET ile açılırken
HEAD veya bot/çerezsiz istemcilerde zaman zaman 503 ve browser verification ekranı
oluşuyor. Google Ads hedef denetimi bu nedenle başarısız oluyor.

Lütfen aşağıdaki URL’lerde ModSecurity, Imunify/BitNinja, anti-DDoS, WAF, bot
protection ve rate-limit loglarını inceleyin:
/, /randevu/, /iletisim/, /hakkimizda/, /paketler/,
/bursa-oto-ekspertiz/, /nilufer-oto-ekspertiz/,
/robots.txt, /sitemap.xml, /.well-known/adsbot-health.txt

Beklenen davranış:
- GET ve HEAD: HTTP 200
- Çerez veya JavaScript zorunluluğu yok
- CAPTCHA/challenge yok
- Verified Googlebot ve AdsBot istekleri challenge ve rate-limit dışında
- Canonical host: https://www.bursaekspertiz.com

İlgili 503 kayıtlarında tetiklenen kural kimliği, güvenlik ürünü ve kaynak log
satırlarını paylaşmanızı; public rotalar ve verified Google crawler’lar için güvenli
istisna oluşturmanızı rica ederiz.
```

## 4. Güvenlik kontrolü

Google Ads “güvenlik” reddi yalnız uygulama kaynak kodu incelenerek kapatılamaz. Canlı hosting alanında repoda bulunmayan eski veya enjekte edilmiş dosyalar olabilir.

Yapılacaklar:

1. `public_html` tam yedeğini alın.
2. Hosting zararlı yazılım taramasını çalıştırın.
3. `public_html` içindeki tüm PHP, eski WordPress, `.zip`, `.bak`, `.old`, bilinmeyen JavaScript ve yönlendirme dosyalarını envantere alın.
4. Uygulama statik olduğundan beklenmeyen public PHP giriş noktalarını kaldırın.
5. `.htaccess` dosyasını repodaki doğrulanmış sürümle karşılaştırın.
6. Cron görevleri, FTP kullanıcıları, SSH anahtarları ve panel kullanıcılarını kontrol edin.
7. FTP ve panel parolalarını değiştirin; mümkünse FTPS/SFTP ve iki aşamalı doğrulama kullanın.
8. Google Search Console > Güvenlik sorunları ve Manuel işlemler bölümlerini kontrol edin.
9. Google Safe Browsing site durumunu kontrol edin.
10. Son 30 günlük access/error loglarında bilinmeyen yönlendirme, 5xx, 403, 429 ve injected script izlerini araştırın.

Taramada zararlı dosya çıkarsa itirazdan önce dosyalar temizlenmeli, erişim bilgileri yenilenmeli ve tekrar tarama yapılmalıdır.

## 5. İşletme beyanlarının tekilleştirilmesi

Aşağıdaki bilgiler web sitesi, reklam, Google İşletme Profili ve sosyal hesaplarda aynı olmalıdır:

- Marka: Ekspertiz Bursa
- İşletme sahibi: Bahar Gacıroğlu
- Telefon: 0552 741 51 43
- Adres: Üçevler Mahallesi, Küçük Sanayi Sitesi 18. Blok No: 21/2, Nilüfer/Bursa
- Fiziksel hizmet noktası: Nilüfer/Üçevler
- Paket fiyatları: Sitedeki güncel tutarlar ve KDV durumu
- Çalışma saatleri: İşletme tarafından doğrulanan tek saat seti

**Kritik not:** Kaynak kodda çalışma saati `Pazartesi-Cuma 10:00–14:00` olarak tanımlıdır. Canlı site, Google İşletme Profili veya reklam uzantılarında farklı saat bulunuyorsa yayın öncesinde gerçek saat teyit edilmeli ve tüm kanallar aynı değere getirilmelidir.

## 6. Reklam ve landing page eşleştirmesi

### Bursa odaklı reklam

- Final URL: `/bursa-oto-ekspertiz/`
- Uygun ifade: “Bursa’dan Nilüfer/Üçevler şubemize oto ekspertiz randevusu”
- Kaçınılacak ifade: “Bursa’nın her yerinde hizmet”, “Size en yakın şubemiz”, “Mobil ekspertiz” — gerçekten sunulmuyorsa kullanılmamalı.

### Nilüfer odaklı reklam

- Final URL: `/nilufer-oto-ekspertiz/`
- Fiziksel adres, yol tarifi ve şube ifadesi korunmalı.

### Paket/fiyat odaklı reklam

- Final URL: `/paketler/`
- Reklamdaki fiyat, paket adı, kapsam ve KDV ifadesi sayfadaki içerikle aynı olmalı.

Final URL, mobil final URL, izleme şablonu ve yönlendirme zincirinin tamamı aynı canonical alan adına ulaşmalıdır. Başka bir alan adına sessiz yönlendirme yapılmamalıdır.

## 7. Yayın ve doğrulama sırası

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build:static-hosting
npm run seo:audit:local
```

Ardından statik `out` klasörü hosting’e yüklenir. `--clean` seçeneği yalnız tam yedek alındıktan ve uzak klasörün yalnız bu siteye ait olduğu doğrulandıktan sonra kullanılmalıdır.

Yayın sonrası:

```bash
npm run audit:live
npm run audit:google-ads
```

Ek dış testler:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://www.bursaekspertiz.com/randevu/
curl -sS -I https://www.bursaekspertiz.com/randevu/
curl -sS -I https://www.bursaekspertiz.com/iletisim/
curl -sS -I https://www.bursaekspertiz.com/hakkimizda/
curl -sS -I https://www.bursaekspertiz.com/paketler/
curl -sS -A "AdsBot-Google (+http://www.google.com/adsbot.html)" -I https://www.bursaekspertiz.com/bursa-oto-ekspertiz/
curl -sS https://www.bursaekspertiz.com/robots.txt
curl -sS https://www.bursaekspertiz.com/.well-known/adsbot-health.txt
```

Sentetik AdsBot kullanıcı ajanı testi Google IP’sinden gelmez; tek başına verified AdsBot erişimini kanıtlamaz. Kesin doğrulama için hosting loglarında Google özel crawler IP listesiyle eşleştirme yapılmalıdır.

## 8. İtiraz öncesi kabul kriterleri

- Kritik URL’lerin GET ve HEAD istekleri en az üç farklı dış ağdan 200 döndürüyor.
- Hiçbir testte 403, 429, 500, 502, 503 veya doğrulama ekranı yok.
- `robots.txt` AdsBot masaüstü ve mobil gruplarını açıkça izinli gösteriyor.
- Search Console URL Denetleme ile ana landing page canlı testten geçiyor.
- Search Console Güvenlik Sorunları bölümü temiz.
- Hosting malware taraması temiz.
- Reklam metni ile final URL’deki konum, fiyat, işletme ve hizmet kapsamı aynı.
- Çalışma saatleri site ve Google İşletme Profili’nde aynı.
- Son 24 saatlik access loglarında doğrulanmış Google crawler isteklerinde 2xx görülüyor.
- Otomatik `audit:google-ads` raporunda hata sayısı sıfır.

## 9. Google Ads itiraz metni taslağı

Aşağıdaki metin yalnız kabul kriterleri tamamlandıktan sonra kullanılmalıdır:

```text
Politika bildirimi sonrasında hedef sayfa ve işletme beyanlarımızı teknik ve içerik
olarak yeniden düzenledik.

- Tüm reklam hedef URL’lerinde GET ve HEAD yanıtları HTTP 200 olacak şekilde
  hosting/WAF kuralları düzeltildi.
- Verified Googlebot ve AdsBot isteklerinde browser challenge, CAPTCHA ve
  rate-limit kaldırıldı.
- robots.txt içinde AdsBot-Google ve AdsBot-Google-Mobile için açık erişim sağlandı.
- Fiziksel hizmet noktamızın Nilüfer/Üçevler olduğu tüm sayfalarda görünür hale
  getirildi. “Bursa geneli” ifadesinin Bursa ilçelerinden müşterilerin bu fiziksel
  şubeye gelmesini anlattığı; başka şube veya mobil hizmet iddiası olmadığı açıklandı.
- Marka, işletme sahibi, telefon, adres, fiyat/KDV ve çalışma saati bilgileri web
  sitesi ile Google İşletme Profili arasında eşitlendi.
- Hosting zararlı yazılım taraması, Search Console güvenlik kontrolü ve canlı URL
  testleri tamamlandı.

Ana reklam landing page’lerimiz:
- https://www.bursaekspertiz.com/bursa-oto-ekspertiz/
- https://www.bursaekspertiz.com/nilufer-oto-ekspertiz/
- https://www.bursaekspertiz.com/paketler/

Yapılan değişikliklerden sonra politikanın yeniden değerlendirilmesini rica ederiz.
```

İtiraz nedeni olarak **“Politikaya uymak için değişiklik yaptım”** seçilmelidir. Aynı düzeltme tamamlanmadan art arda çok sayıda itiraz gönderilmemelidir.
