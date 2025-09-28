# UFC Events UI

Modern ve kullanıcı dostu UFC etkinlikleri takip uygulaması. Yaklaşan UFC etkinliklerini görüntüleyin, detaylarını inceleyin ve takvime eklemek için email bildirimlerini alın.

## 🥊 Özellikler

### ⚔️ Dövüş Kartları

- Dövüşçü isimleri ve ülke bilgileri
- Sıralama (ranking) verileri
- Dövüş sicilleri (record)
- Ağırlık kategorileri

### 📧 Takvim Entegrasyonu

- E-mail ile takvim ekleme
- Çoklu etkinlik seçimi

### 🎨 Modern Arayüz

- **Koyu/Açık Tema**: Otomatik tema değişimi
- **Mobil Uyumlu**: Responsive layout

## 🛠 Teknoloji Stack

### Frontend

- **React 19** - Modern React özellikleri
- **TypeScript** - Tip güvenliği
- **Vite** - Hızlı geliştirme ortamı
- **Tailwind CSS** - Utility-first CSS framework

### State Management

- **Zustand** - Hafif state management
- **React Query** - API state yönetimi ve caching

### Geliştirici Araçları

- **Zod** - Schema validation

## 🚀 Kurulum

### Gereksinimler

- Node.js (18+ önerilen)
- pnpm package manager

### Kurulum Adımları

```bash
# Repository'i klonlayın
git clone <repository-url>
cd ufc-events-ui

# Bağımlılıkları yükleyin
pnpm install

# Geliştirme sunucusunu başlatın
pnpm dev

# Production build oluşturun
pnpm build

# Build'i önizleyin
pnpm preview
```

## 📁 Proje Yapısı

```
src/
├── api/                    # API servisleri
│   ├── constants.ts        # API konfigürasyonu
│   └── services.ts         # HTTP istekleri
├── components/             # React bileşenleri
│   ├── EventDetails.tsx    # Etkinlik detay görünümü
│   ├── EventSidebar.tsx    # Etkinlik listesi
│   ├── FightCard.tsx       # Dövüş kartı bileşeni
│   └── Header.tsx          # Ana başlık ve kontroller
├── hooks/                  # Custom React hooks
│   ├── useCalendarMutation.ts
│   └── useEvents.ts        # Etkinlik API hook'u
├── stores/                 # Zustand store'lar
│   ├── eventSelectionStore.ts  # Etkinlik seçim state
│   └── themeStore.ts          # Tema yönetimi
├── types/                  # TypeScript tip tanımları
│   └── index.ts
└── providers/              # React providers
    └── QueryProvider.tsx   # React Query provider
```

## 🔧 Kullanım

### Etkinlik Görüntüleme

1. Uygulama açıldığında otomatik olarak etkinlikler yüklenir
2. Sol sidebar'dan (masaüstü) veya üst menüden (mobil) etkinlik seçin
3. Seçilen etkinliğin detayları ana alanda görüntülenir

### Takvime Ekleme

1. Header'daki dropdown'dan istediğiniz etkinlikleri seçin
2. E-mail adresinizi girin
3. "Takvime ekle" butonuna tıklayın
4. E-mail ile takvim daveti gönderilir

### Tema Değiştirme

- Header'daki tema butonuna tıklayarak koyu/açık tema arasında geçiş yapın
- Tercih otomatik olarak kaydedilir

## 🎯 API Entegrasyonu

Uygulama aşağıdaki endpoint'leri kullanır:

```typescript
// UFC etkinliklerini listeler
GET /api/events

// Email ile etkinlik aboneliği oluşturur
POST /api/events/subscribe
{
  "email": "user@example.com",
  "selectedEventIds": ["event1", "event2"]
}
```

## 🤝 Katkıda Bulunma

1. Repository'i fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için issue oluşturun veya pull request gönderin.

---

**UFC Events UI** - Modern web teknolojileri ile geliştirilmiş, kullanıcı dostu UFC etkinlik takip uygulaması.
