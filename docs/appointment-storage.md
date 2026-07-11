# Randevu kayıtları

Web formundan gönderilen randevu talepleri `POST /api/appointments` üzerinden Sites/Cloudflare D1 içindeki mantıksal `DB` bağlantısına ve `appointments` tablosuna kaydedilir.

Kayıt; referans kodu, ad soyad, normalize telefon, e-posta, paket, araç bilgileri, tercih edilen tarih/saat aralığı, iletişim tercihi, izinler, UTM alanları, `pending` durumu ve oluşturulma zamanını içerir.

## Operasyonel durum

- Müşteri başarılı gönderimden sonra referans kodunu görür.
- Mevcut sürümde yönetici randevu listesi, durum güncelleme, CSV dışa aktarma veya yeni kayıt bildirimi bulunmaz.
- Bu nedenle canlı kullanıma geçmeden önce kimlik doğrulamalı bir randevu yönetim ekranı ve en az e-posta bildirimi eklenmelidir.

Kişisel veriler istemci loglarına veya herkese açık sayfalara yazılmamalıdır.
