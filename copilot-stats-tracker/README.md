# Copilot Stats Tracker

GitHub Copilot ve yapay zeka destekli kod yazma işlemlerinizi otomatik olarak takip eden VS Code eklentisi. 

⚡ **ÖNEMLİ:** Bu extension **Node.js kurulumu gerektirmez!** Şirket bilgisayarlarında sorunsuz çalışır.

## 🎯 Özellikler

- ✅ **Otomatik Takip**: Tüm kod değişikliklerini otomatik olarak yakalar
- 📊 **Detaylı İstatistikler**: Günlük, kullanıcı bazlı toplam istatistikler
- 📝 **TXT Log Dosyası**: Tüm değişiklikler okunabilir formatta kaydedilir
- 📈 **JSON Özet**: Günlük istatistikler JSON formatında saklanır
- 👤 **Çoklu Kullanıcı**: Her kullanıcı için ayrı istatistik tutma
- 🔧 **Özelleştirilebilir**: Log dosyası konumunu ve kullanıcı adını ayarlayabilirsiniz
- 🌐 **Ekip Raporu**: Tüm ekibin istatistiklerini HTML'de görüntüleme (Node.js gerektirmez!)
- 🚀 **Kolay Kurulum**: VSIX dosyası ile tek tıkla kurulum

## 📦 Kurulum

### ⚡ Hızlı Kurulum (Node.js Gerektirmez!)

**Hazır VSIX dosyasını kurun:**

1. VS Code'u açın
2. `Ctrl+Shift+P` tuşlarına basın
3. "Extensions: Install from VSIX" yazın ve seçin
4. `.vsix` dosyasını seçin
5. VS Code'u yeniden başlatın

✅ **Hepsi bu kadar!** Node.js kurmanıza gerek yok.

### 🔧 Geliştirme için Kurulum (Opsiyonel)

Extension'ı kendiniz derlemek isterseniz:

1. Node.js kurun (sadece derleme için gerekli)
2. Bağımlılıkları yükleyin ve derleyin:
   ```powershell
   npm install
   npm run compile
   ```
3. F5 ile test edin veya VSIX oluşturun:
   ```powershell
   npm install -g @vscode/vsce
   vsce package
   ```

## 🚀 Kullanım

### İlk Kurulum

Extension ilk kez çalıştırıldığında sizden bir **kullanıcı adı** isteyecektir. Bu, logda görünecek isminizdir.

### Log Dosyası

Log dosyası varsayılan olarak **workspace klasörünüzde** oluşturulur:
- `copilot-stats.txt` - Detaylı log kayıtları
- `copilot-daily-stats.json` - Günlük toplam istatistikler

### Komutlar

VS Code'da `Ctrl+Shift+P` ile komut paletini açıp şu komutları kullanabilirsiniz:

**Bireysel İstatistikler:**
- **Copilot Stats: İstatistikleri Göster** - Son 7 günün özetini gösterir
- **Copilot Stats: Log Dosyasını Aç** - Detaylı log dosyasını açar
- **Copilot Stats: İstatistikleri Sıfırla** - Tüm istatistikleri temizler

**Ekip İstatistikleri:** (Node.js gerektirmez!)
- **Copilot Stats: Ekip Raporu Göster** - Tüm ekip istatistiklerini güzel HTML raporunda görüntüler
- **Copilot Stats: Ekip Raporunu Dışa Aktar** - JSON formatında rapor kaydeder
- **Copilot Stats: Özel Klasörde Ekip Raporu** - Paylaşılan ağ klasörü veya başka dizini analiz eder

### Ayarlar

Settings'de (`Ctrl+,`) "Copilot Stats" arayarak şu ayarları yapabilirsiniz:

- **Copilot Stats Tracker: User Name** - Logda görünecek kullanıcı adınız
- **Copilot Stats Tracker: Log File Path** - Log dosyasının kaydedileceği özel klasör yolu

## 📊 Log Formatı

### copilot-stats.txt Örneği

```
=== Copilot Stats Tracker Log ===
Format: [Tarih] [Saat] | Kullanıcı | Dosya | +Eklenen -Silinen ~Değiştirilen
================================================================================

[2026-02-10] [14:23:45] | ahmet.y | app.ts | +5 -2 ~1 | typescript
[2026-02-10] [14:25:12] | ahmet.y | index.html | +3 -0 ~0 | html
[2026-02-10] [14:30:08] | ayse.k | service.py | +12 -5 ~3 | python
```

### copilot-daily-stats.json Örneği

```json
[
  {
    "date": "2026-02-10",
    "userName": "ahmet.y",
    "totalLinesAdded": 127,
    "totalLinesDeleted": 43,
    "totalLinesModified": 28,
    "acceptanceCount": 45
  },
  {
    "date": "2026-02-10",
    "userName": "ayse.k",
    "totalLinesAdded": 89,
    "totalLinesDeleted": 21,
    "totalLinesModified": 15,
    "acceptanceCount": 32
  }
]
```

## 🔧 Ekip İçin Merkezi Takip

### Yöntem 1: Paylaşılan Ağ Klasörü (Önerilen) 🌐

Tüm ekibin istatistiklerini tek yerde toplamak için:

Her geliştiricinin VS Code settings.json'ına ekleyin:

```json
{
  "copilotStatsTracker.logFilePath": "\\\\sunucu\\paylaşım\\copilot-logs",
  "copilotStatsTracker.userName": "ahmet.y"
}
```

**Ekip raporunu görüntülemek için:**
1. VS Code'da `Ctrl+Shift+P`
2. "Copilot Stats: Özel Klasörde Ekip Raporu" komutunu çalıştırın
3. Paylaşılan klasörü seçin: `\\sunucu\paylaşım\copilot-logs`
4. Güzel HTML raporunu görüntüleyin! 🎉

### Yöntem 2: Git Repository ile 📦

Her kullanıcı workspace'inde log tutar:

```json
{
  "copilotStatsTracker.logFilePath": "${workspaceFolder}/logs",
  "copilotStatsTracker.userName": "ahmet.y"
}
```

Ekip raporu için workspace klasöründe:
1. `Ctrl+Shift+P` → "Copilot Stats: Ekip Raporu Göster"
2. Tüm alt klasörlerdeki istatistikler otomatik bulunur

## 📈 Ekip Raporları (Node.js Gerektirmez!)

### HTML Rapor Görüntüleme

VS Code içinde doğrudan güzel, interaktif rapor:

- 📊 Kullanıcı bazlı detaylı istatistikler
- 📅 Günlük trendler (son 14 gün)
- 🎨 Renkli, modern arayüz
- 📈 Grafiksel gösterimler

**Kullanım:**
```
Ctrl+Shift+P → "Copilot Stats: Ekip Raporu Göster"
```

### JSON Export

Verileri dışa aktarıp başka araçlarla analiz edin:

```
Ctrl+Shift+P → "Copilot Stats: Ekip Raporunu Dışa Aktar"
```

JSON formatında kaydeder, Excel'e veya BI araçlarına aktarabilirsiniz.

## 🤝 Katkıda Bulunma

Bu extension'ı geliştirmek için:

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeniOzellik`)
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin (`git push origin feature/yeniOzellik`)
5. Pull Request oluşturun

## ⚠️ Önemli Notlar
**Node.js gerektirmez** - VS Code'un kendi runtime'ını kullanır, şirket bilgisayarlarında sorunsuz çalışır
- Ekip raporları dahil tüm özellikler VS Code extension'ı içinde çalışır
- Gerçek zamanlı takip için 500ms debounce kullanılır (hızlı yazımları gruplar)
- Log dosyaları sürekli büyür, düzenli temizleme yapmanız önerilir
- Güvenli: Sadece satır sayılarını kaydeder, kod içeriğini kaydetmeztlı olduğundan, bu yaklaşım en pratik çözümdür
- Gerçek zamanlı takip için 500ms debounce kullanılır (hızlı yazımları gruplar)
- Log dosyaları sürekli büyür, düzenli temizleme yapmanız önerilir

## 📄 Lisans

MIT License - İstediğiniz gibi kullanabilir, değiştirebilirsiniz.

## 🐛 Sorun Bildirimi

Sorun yaşarsanız veya öneriniz varsa GitHub Issues'da bildirin.

---

**Geliştirici**: AIMtr Ekibi  
**Versiyon**: 1.0.0  
**Tarih**: Şubat 2026
