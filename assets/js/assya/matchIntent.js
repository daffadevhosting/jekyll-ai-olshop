// matchIntent.js

const intents = [
  {
    name: "lihat_keranjang",
    patterns: [/^keranjang$/, /lihat keranjang/, /cek keranjang/, /keranjang saya/]
  },
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
    patterns: [/tambah(kan)? ke keranjang/i, /beli(kan)?( produk)? ini/i]
  },
  {
    name: "checkout",
    patterns: [/checkout/, /bayar/, /lanjutkan pesanan/i]
  },
  {
    name: "pilih_produk",
    patterns: [/produk/, /lihat.*(hoodie|masker|kaos|baju|tasik)/i]
  },
  {
    name: "tanya_item",
    patterns: [/barang( ke)?-(\d+)/i, /produk( ke)? (\d+)/i, /item warna/i]
  },
  {
    name: "tanya_stok",
    patterns: [/stok/, /ada stok/i, /tersedia/i]
  },
  {
    name: "tanya_harga",
    patterns: [/harga/, /berapa harga/i, /harga produk/i]
  },
  {
    name: "tanya_detail_produk",
    patterns: [/detail produk/, /info produk/i, /deskripsi produk/i]
  },
  {
    name: "tanya_rekomendasi",
    patterns: [/rekomendasi/, /saran produk/i, /produk lain/i]
  },
  {
    name: "konfirmasi_bayar",
    patterns: [/konfirmasi bayar/, /lanjut pembayaran/i, /bayar pesanan/i]
  },
  {
    name: "batal_pesanan",
    patterns: [/batalkan pesanan/, /hapus keranjang/i, /bersihkan keranjang/i]
  }
  // Tambahkan intent lainnya sesuai kebutuhan
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
