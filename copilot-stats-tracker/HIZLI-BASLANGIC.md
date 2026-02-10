# 🚀 Copilot Stats Tracker - Hızlı Başlangıç

## ✅ SİZİN İÇİN HAZIR! (Node.js Gerektirmez)

Bu extension **şirket bilgisayarlarında** sorunsuz çalışır. 
Node.js veya özel izin gerekmez!

---

## 📦 1. KURULUM (2 Dakika)

### Adım 1: VSIX Dosyasını Alın
- Ekip liderinizden veya paylaşılan klasörden
- Dosya adı: `copilot-stats-tracker-X.X.X.vsix`

### Adım 2: VS Code'a Yükleyin
1. VS Code'u açın
2. `Ctrl+Shift+P` tuşlarına basın
3. Yazın: **"Extensions: Install from VSIX"**
4. VSIX dosyasını seçin
5. VS Code'u yeniden başlatın

✅ **Kurulum Tamamlandı!**

---

## 🎯 2. İLK KULLANIMINI

Extension otomatik başlar ve bir kullanıcı adı sorar:

```
Kullanıcı adınız: ahmet.y
```

Bu isim tüm loglarda görünecek. Ekipte benzersiz bir isim kullanın.

---

## 📊 3. KULLANIM

Extension arka planda çalışır ve **otomatik olarak** her kod değişikliğini kaydeder.

### Kendi İstatistiklerinizi Görün

`Ctrl+Shift+P` → Yazın: **"Copilot Stats: İstatistikleri Göster"**

### Ekip Raporunu Görün 🌟

`Ctrl+Shift+P` → Yazın: **"Copilot Stats: Ekip Raporu Göster"**

**Özellikler:**
- ✨ Güzel HTML raporu
- 📊 Tüm ekip istatistikleri
- 📈 Günlük trendler
- 🎨 İnteraktif tablolar

---

## 🏢 4. EKİP İÇİN PAYLAŞILAN KLASÖR

### Ayarları Yapın

VS Code Settings (`Ctrl+,`) → "Copilot Stats" arayın:

```json
{
  "copilotStatsTracker.logFilePath": "\\\\sunucu\\paylaşım\\copilot-logs",
  "copilotStatsTracker.userName": "ahmet.y"
}
```

### Ekip Raporunu Görüntüleyin

`Ctrl+Shift+P` → **"Copilot Stats: Özel Klasörde Ekip Raporu"**

Klasörü seçin: `\\sunucu\paylaşım\copilot-logs`

🎉 **Tüm ekibin istatistiklerini görün!**

---

## 📝 5. TÜM KOMUTLAR

| Komut | Açıklama |
|-------|----------|
| **Copilot Stats: İstatistikleri Göster** | Kendi son 7 günlük özet |
| **Copilot Stats: Log Dosyasını Aç** | Detaylı text log |
| **Copilot Stats: Ekip Raporu Göster** | HTML ekip raporu |
| **Copilot Stats: Özel Klasörde Ekip Raporu** | Başka dizini analiz et |
| **Copilot Stats: Ekip Raporunu Dışa Aktar** | JSON formatında kaydet |
| **Copilot Stats: İstatistikleri Sıfırla** | Tüm logları temizle |

---

## 🆘 SORUN GİDERME

### Extension görünmüyor
- VS Code'u yeniden başlatın
- `Ctrl+Shift+X` ile extension listesinde "Copilot Stats" arayın

### Log dosyası bulunamıyor
- Workspace klasörünüzü kontrol edin
- Dosya adı: `copilot-stats.txt` ve `copilot-daily-stats.json`

### Ekip raporu boş
- En az bir kod değişikliği yapın
- Log dosyasının oluştuğundan emin olun
- Paylaşılan klasör yolunu kontrol edin

### Ağ klasörüne erişemiyorum
- IT departmanından ağ erişim izni isteyin
- Klasör yolunu doğru yazdığınızdan emin olun
- Örnek: `\\sunucu\klasor` (ters slash!)

---

## ⚙️ AYARLAR

### Özel Log Klasörü

```json
{
  "copilotStatsTracker.logFilePath": "C:\\LogKlasorum"
}
```

### Kullanıcı Adı Değiştir

```json
{
  "copilotStatsTracker.userName": "yeni_isim"
}
```

---

## 🌟 ÖNEMLİ NOTLAR

✅ **Node.js gerektirmez** - VS Code'un runtime'ını kullanır  
✅ **Otomatik çalışır** - Kurulumdan sonra hiçbir şey yapmanız gerekmez  
✅ **Arka planda** - Performansınızı etkilemez  
✅ **Güvenli** - Sadece satır sayılarını kaydeder, kod içeriğini değil  
✅ **Paylaşılabilir** - Ekiple ağ klasöründe paylaşın  

---

## 📞 DESTEK

Sorularınız için:
- Ekip liderinize danışın
- `README.md` ve `SETUP.md` dosyalarını okuyun
- GitHub Issues (varsa)

---

**Hazırladı:** AIMtr Ekibi  
**Versiyon:** 1.0.0  
**Tarih:** Şubat 2026

🎉 **İyi kullanımlar!**
