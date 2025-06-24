# 🛍️ Assya — AI Conversational Commerce Assistant

---

`project milik toko As-Syariah Bordir`

---

**Assya** adalah chatbot e-commerce berbasis JavaScript yang dirancang untuk memberikan pengalaman belanja interaktif lewat chat. Dibangun dengan pendekatan modular, sistem ini mendukung katalog dinamis, detail produk, UI responsif, dan niat percakapan (intent) seperti "lihat produk", "keranjang", hingga pemilihan varian warna.

## ✨ Fitur Utama

- 🔍 Intent-aware Conversation: Katalog, greeting, fallback, detail produk via slug, keranjang, dll.
- 🖼️ Full-width Product Bubble: Tampilan katalog responsif mengikuti lebar layar.
- 🧠 Intent Classifier: Pemetaan teks user ke fungsi spesifik tanpa UI berbasis tombol.
- 💬 Native HTML Bubble Rendering: Produk ditampilkan langsung di chat seperti UI e-commerce.
- 📦 Produk JSON Dinamis: Terintegrasi dari file markdown `.md` Jekyll ke dalam `/produk.json`.
- 🌐 Multibahasa: Mendukung pemilihan bahasa lokal seperti Bahasa Indonesia & Sunda.
- 💡 Shortcut Luar Chat: Tombol pintasan seperti "Buka Katalog" yang langsung trigger chat.

## 📁 Struktur Proyek

```
📁 assets/
├── js/
│   ├── assya/
│   │   ├── core.js
│   │   ├── classifyIntent.js
│   │   ├── intents/
│   │   │   ├── katalog.js
│   │   │   ├── produkDetail.js
│   │   │   ├── addToCart.js
│   │   │   └── ...
│   │   └── renderers.js
├── produk.json
```

## 🧭 Roadmap

| Fase | Fitur                                               | Status     |
|------|-----------------------------------------------------|------------|
| 🟢 v1 | Bubble katalog dinamis, detail produk via slug     | ✅ Selesai  |
| 🟡 v2 | Intent `addToCart()`, keranjang, wizard warna       | 🔄 On Dev   |
| ⚪ v3 | Checkout UI, form pengiriman, input alamat          | ⏳ Planned  |
| ⚪ v4 | Voice input, web speech API                         | ⏳ Planned  |
| ⚪ v5 | Smart context, intent memory                        | ⏳ Planned  |

## 🚀 Jalankan Lokal

```bash
git clone https://github.com/daffadevhosting/jekyll-ai-olshop.git
cd jekyll-ai-olshop
npm install
npm run dev
```

Akses: `http://localhost:3000`

## 🔍 Intent Pencarian Produk

AI Assya memahami perintah seperti:

- `detail masker-bordir`
- `info masker bordir`
- `lihat masker 3d`

Dengan sistem slugify & fuzzy match.

## 📜 License

MIT License © 2025 Daffa Labs

```
Permission is hereby granted, free of charge, to any person obtaining a copy...
```

> Lihat file [LICENSE](./LICENSE) untuk versi lengkap.
