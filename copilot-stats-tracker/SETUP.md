# Kurulum ve Kullanım Rehberi

## 🚀 Hızlı Başlangıç (Node.js Gerektirmez!)

### ⚡ Şirket Bilgisayarında Kurulum

Bu extension **Node.js kurulumu gerektirmez**! VS Code'un kendi runtime'ını kullanır.

### 1. VSIX Dosyasını Kurun

**Adım 1:** VSIX dosyasını edinin
- Ekip liderinizden veya paylaşılan klasörden `.vsix` dosyasını alın
- Örnek: `copilot-stats-tracker-1.0.0.vsix`

**Adım 2:** VS Code'a yükleyin

1. VS Code'u açın
2. `Ctrl+Shift+P` tuşlarına basın
3. "Extensions: Install from VSIX" yazın
4. İndirdiğiniz `.vsix` dosyasını seçin
5. VS Code'u yeniden başlatın

✅ **Kurulum tamamlandı!** Başka hiçbir şey yüklemenize gerek yok.

Extension ilk çalıştırıldığında:

1. ✅ Otomatik olarak başlatılır
2. 💬 Kullanıcı adınızı sorar
3. 📝 Log dosyasını oluşturur

### 4. Kullanım

Artık kodlama yapmaya başlayabilirsiniz! Extension otomatik olarak:

- Yaptığınız her değişikliği izler
- Eklenen/silinen/değiştirilen satırları sayar
- TXT ve JSON dosyalarına loglar

## 📊 İstatistikleri Görüntüleme

### Komut Paleti (Ctrl+Shift+P):

**Bireysel İstatistikler:**
- `Copilot Stats: İstatistikleri Göster` - Son 7 günün özeti
- `Copilot Stats: Log Dosyasını Aç` - Detaylı logları göster
- `Copilot Stats: İstatistikleri Sıfırla` - Tüm verileri temizle

**Ekip İstatistikleri (Node.js gerektirmez!):**
- `Copilot Stats: Ekip Raporu Göster` - Tüm ekip istatistikleri HTML'de
- `Copilot Stats: Ekip Raporunu Dışa Aktar` - JSON format
- `Copilot Stats: Özel Klasörde Ekip Raporu` - Başka dizini analiz et

### Log Dosyaları:

- `copilot-stats.txt` - Detaylı zaman damgalı loglar
- `copilot-daily-stats.json` - Günlük toplamlar (makine okunabilir)

## ⚙️ Ayarlar

VS Code Settings'de (`Ctrl+,`) "Copilot Stats" arayın:

```json
{
  // Kullanıcı adınız (logda görünür)
  "copilotStatsTracker.userName": "ahmet.y",
  
  // Özel log klasörü (opsiyonel)
  "copilotStatsTracker.logFilePath": "C:\\LogKlasoru"
}
```

## 🏢 Ekip İçin Merkezi Takip

### Seçenek 1: Paylaşılan Ağ Klasörü

Her geliştiricinin `settings.json` dosyasına:

```json
{
  "copilotStatsTracker.logFilePath": "\\\\sunucu\\copilot-logs",
  "copilotStatsTracker.userName": "KULLANICI_ADI"
}
```

### Seçenek 2: Git Repository

1. Her kullanıcı kendi log dosyasını workspace'inde tutar
2. Git'e commit eder
3. Merkezi bir script ile analiz edilir
 (Node.js Gerektirmez!)

### Bireysel İstatistikler

```
Ctrl+Shift+P → "Copilot Stats: İstatistikleri Göster"
```

### Ekip Raporu (HTML)

Güzel, interaktif HTML raporu:

```
Ctrl+Shift+P → "Copilot Stats: Ekip Raporu Göster"
```

**Özellikler:**
- ✅ Kullanıcı bazlı detaylı istatistikler
- 📅 Günlük trendler (son 14 gün)
- 🎨 Modern, renkli arayüz
- 📊 Tablolar ve özet kartlar

### Özel Dizinde Analiz

Paylaşılan ağ klasörünü veya başka bir dizini analiz etmek için:

```
Ctrl+Shift+P → "Copilot Stats: Özel Klasörde Ekip Raporu"
```

Örnek kullanım:
1. Komutu çalıştırın
2. `\\sunucu\paylaşım\copilot-logs` dizinini seçin
3. Tüm ekibin istatistiklerini görün!

### JSON Export

Verileri dışa aktarmak için:

```
Ctrl+Shift+P → "Copilot Stats: Ekip Raporunu Dışa Aktar"
```

JSON dosyasını Excel, Power BI veya başka araçlara aktarabilirsiniz.
node analyze-stats.js "\\sunucu\copilot-logs"
```
Ekip Raporu**: "Özel Klasörde Ekip Raporu" komutu ile paylaşılan klasörü analiz edin
5. **Node.js Gerektirmez**: Tüm raporlama VS Code içinde çalışır!

## 📦 VSIX Dağıtımı (Ekip Liderleri İçin)

### VSIX Oluşturma (Sadece bir kez, Node.js gerektirir)

```powershell
# Proje klasöründe
npm install
npm run compile
npm install -g @vscode/vsce
vsce package

# Çıktı: copilot-stats-tracker-1.0.0.vsix
```

### Ekibe Dağıtım

1. `.vsix` dosyasını paylaşılan klasöre koyun
2. Ekip üyelerine VS Code'da "Install from VSIX" ile kurma talimatı verin
3. Her kullanıcı ayarlarına kendi kullanıcı adını ekler

**✅ Ekip üyeleri Node.js kurmadan kullanabilir!**
1. Workspace klasörünüzü kontrol edin
2. Ayarlarda özel path tanımladıysanız o klasörü kontrol edin
3. Klasör yazma izinlerini kontrol edin

### İstatistikler Görünmüyor

1. İlk kullanımda veri birikmesi gerekir
2. En az bir kod değişikliği yapın
3. `Copilot Stats: Log Dosyasını Aç` ile log dosyasını kontrol edin

## 🎯 İpuçları

1. **Günlük Temizlik**: Log dosyaları büyüyebilir, düzenli yedekleyin
2. **Kullanıcı Adı**: Ekip içinde benzersiz isimler kullanın
3. **Ağ Klasörü**: UNC path kullanırken ağ bağlantısını kontrol edin
4. **Raporlama**: Haftalık/aylık raporlar için scripti düzenli çalıştırın

## 📦 VSIX Dağıtımı

Ekibinize dağıtmak için:

```powershell
# 1. Paket oluştur
vsce package

# 2. VSIX dosyasını paylaş
# copilot-stats-tracker-1.0.0.vsix

# 3. Ekip üyeleri kurar
# VS Code → Install from VSIX
```

## 🔄 Güncelleme

Yeni versiyon yüklemek için:

1. Eski versiyonu kaldırın (opsiyonel)
2. Yeni VSIX'i yükleyin
3. VS Code'u yeniden başlatın

Log verileri korunur (farklı klasörde saklanır).

---

**Sorularınız için**: GitHub Issues veya ekip iletişim kanallarınız
