// matchIntent.js

const intents = [
  {
    name: "pilih_warna",
    patterns: [/warna/, /pilih (toska|pink|abu|hitam|merah|coksu|krem|navi)/i]
  },
  {
    name: "pilih_ukuran",
    patterns: [/ukuran/, /size/i]
  },
  {
    name: "masukkan_keranjang",
    patterns: [/tambah.*keranjang/, /beli.*produk/, /masukkan ke keranjang/i]
  },
  {
    name: "checkout",
    patterns: [/checkout/, /bayar/, /lanjutkan pesanan/i]
  },
  {
    name: "pilih_produk",
    patterns: [/produk/, /lihat.*(hoodie|masker|kaos|baju|tasik)/i]
  }
];

export function matchIntent(message = "") {
  const input = message.toLowerCase();
  for (const intent of intents) {
    if (intent.patterns.some(pattern => pattern.test(input))) {
      return intent.name;
    }
  }
  return "unknown";
}
