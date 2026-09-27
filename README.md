# ÜSTAD KASA · Şatafatlı Kasa Defteri · KATEGORİ: MUHASEBE · v1.2

**Kenan Kuzucu**'nun ön muhasebe programının **kopya sürümü**: aynı motor, ayrı klasör, ayrı port ve üstünde
**şatafat katmanı** (aurora zemin, dönen konik logo halkası, cam + neon kartlar, 3B eğilme, konfeti, parıltı tülü).

> **Kategori etiketi:** `muhasebe` · **Depo:** `ustad-kasa` · **Ana proje:** `ustad-muhasebe` (port 8091)
> Ayrı çalışsınlar diye portlar farklıdır: **MUHASEBE 8091 · KASA 8092**. İkisi aynı anda açılabilir.

---

## Açmak

| Ne | Nasıl |
|---|---|
| PC'de aç | `BASLAT.bat` → tarayıcı **`http://127.0.0.1:8092`** |
| Kapatmak | Siyah pencereyi KAPATMA — kapatırsan program durur (açık kaldıkça çökse bile kendini yeniden başlatır) |
| Telefondan | `AG-AC.bat` → aynı WiFi'de `http://<bilgisayar-IP>:8092` (ağ modu varsayılan kapalı, HTTP şifresiz) |
| Doğrudan | `python sunucu/sunucu.py 8092` |
| Kurulum | **Yok** — `pip install` gerekmez, bütün program Python standart kütüphanesiyle yazıldı |

## Giriş ve roller

| Kullanıcı | Şifre | Rol | Yetki |
|---|---|---|---|
| kenan | kenan1981 | Yönetici | her şey: kayıt, silme, ayar, yedek geri alma, kullanıcı yönetimi |
| kasa | kasa2026 | Kasiyer | kasa/fatura/gelir-gider girebilir; **silemez**, ayar değiştiremez |
| misafir | misafir2026 | Misafir | yalnız okuma ve rapor |

Şifreler sunucuda **PBKDF2 (100.000 tur + rastgele tuz)** ile saklanır; girişte **oturum jetonu** verilir ve
her yazma işlemi sunucu tarafında rol denetiminden geçer. 5 hatalı girişte 60 saniye kilit.

## Şatafat katmanı (bu sürümü ayıran şey)

Ayrı dosyalarda durur, çekirdek koda dokunmaz — `panel/satafat.css` + `panel/satafat.js`, `index.html`'e birer satırla bağlıdır:

- **Aurora zemin** + dönen **konik logo halkası**, cam + neon kartlar, tıklama dalgası, kaydet düğmesinde konfeti
- **3B eğilme**: fare hareketiyle kartlar `rotateX/Y` ile eğilir
- `body` altında **`satafatTul`** parıltı tülü ve **`satafat` teması** (gece siyahı + altın + neon)
- **Çevrimdışı rozeti** (sol altta `#cevrimRozet`): `navigator.onLine` ile canlı yazar
- **PDF devralma**: panel kodu değişmeden, `satafat.js` capture fazında PDF düğmesini yakalar →
  `satafat.yazdirHtml()` ile ekranı yazdırma penceresine basar (Word/Office kurulu olmasa da PDF çıkar)
- Asistan ekranında uyarı kutusu: *"Asistan internet ister (Gemini), geri kalan her şey çevrimdışı"*

## Modüller (19 ekran · ana projeyle aynı)

1. Genel Bakış · 2. Cari Yönetimi (6 sekme) · 3. Görüşmeler · 4. Görevler & Hatırlatma · 5. Harcamalar · Sade Defter ·
6. Bütçe · 7. Gelirler · 8. Giderler · 9. Kasa & Bankalar · 10. Faturalar (KDV/iskonto otomatik, stoktan düşer) ·
11. Çek & Senet (vade takvimi) · 12. Tekrarlayan Kayıt & Abonelik · 13. Stok Yönetimi · 14. Personel & Bordro (+ puantaj) ·
15. Muhasebe Asistanı · 16. Fiş & Fatura Fotoğrafları · 17. Raporlar (10 klasik + 4 akıllı) ·
18. Word / Excel / PDF Çıktıları · 19. Ayarlar & Yedek (6 sekme)

Ek olarak **13 tema, 6 renk paleti**, 4K/5K'da ölçeklenen punto ve boşluklar, her satırda Düzenle/Sil.

## Çıktılar

**Word (.docx) · Excel (.xlsx) · PDF** (Word üzerinden gerçek PDF) ve **Mali Müşavir Paketi**
(seçilen tarih aralığındaki tüm defterler → CSV + KDV özeti, tek ZIP). .xlsx/.docx paketleri
`zipfile` + elle XML ile üretilir; `python-docx` / `openpyxl` gerekmez.

## Klasör düzeni

```
panel\     index.html · stil.css · uygulama.js · satafat.css · satafat.js
sunucu\    sunucu.py · ozellikler.py · disa_aktar.py · pdf_rapor.py · ai_asistan.py
arac\      giris.py (PORT=8092) · lan_bilgi.py · paketle.py · github-yedek.sh
veri\      kasa.db (SQLite) · ayar.json · ai.json · fisler\   → .gitignore'da (kişisel veri)
yedek\ cikti\ build\ dist\                                     → .gitignore'da
```

> **Depoda olmayanlar (bilerek):** `veri\` (firma bilgisi, gerçek defter, Gemini anahtarı, fiş fotoğrafları),
> `yedek\`, `cikti\`, `build\`, `dist\`, `.exe`. Kaynak kod temiz, kişisel veri yok; program ilk açılışta
> `veri\` klasörünü ve veritabanını kendisi kurar.

## GitHub yedeği

```
bash <KOK>/arac/github-yedek.sh "v1.3 · açıklama"
```
→ kaynağı depo klasörüne eşitler · sır taraması yapar · commit + push · yerel HEAD ile uzak `main` sha'sını karşılaştırır.

## Dürüst sınırlar

- **OCR kapalı** (Tesseract kurulu değil) → fiş tutarını sen yazarsın.
- **PDF** için Word kurulu olmalıdır (5-15 sn); yoksa Word/Excel çıktısı çalışır.
- **Asistan** yalnız API anahtarı girilirse çalışır.
- **e-Fatura / e-Arşiv entegrasyonu yoktur** — bu bir **ön muhasebe** programıdır, beyanname yerine geçmez.
- Yerel ağ modu **HTTP** (şifresiz) — yalnız güvenilen ağda açılmalı.
- Android (APK) sürümü **yoktur**.

---

© 2026 **Kenan Kuzucu** · ÜSTAD SALON KENAN · Gaziantep · TÜM HAKLARI SAKLIDIR · 5846 sayılı FSEK kapsamında korunur.
