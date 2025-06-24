export const INTENT_KEYWORDS = {
  lanjut: ["ya", "iya", "yoi", "lanjut", "boleh", "oke", "ayo", "jalan terus"],
  tidak: ["tidak", "nggak", "gak", "ga", "udah", "cukup", "enggak", "no", "itu saja", "nggak usah", "batal"],
  katalog: ["katalog", "produk", "lihat produk", "koleksi", "daftar barang"],
  greeting: ["halo", "assalamu", "hi", "selamat", "hai", "woy", "bre"],
  help: ["bantuan", "bisa apa", "fitur", "menu", "tolong"],
  keranjang: ["keranjang", "lihat keranjang", "cek belanja", "belanjaan", "sudah saya beli", "apa aja yang dibeli"],
  checkout: [
  "checkout",
  "mau bayar",
  "lanjut bayar",
  "konfirmasi pesanan",
  "lanjut ke pembayaran",
  "bayar sekarang",
  "lanjut checkout",
  "konfirmasi"
]

};
export const INTENT_PATTERNS = {
  lanjut: new RegExp(`\\b(${INTENT_KEYWORDS.lanjut.join("|")})\\b`, "i"),
  tidak: new RegExp(`\\b(${INTENT_KEYWORDS.tidak.join("|")})\\b`, "i"),
  katalog: new RegExp(`\\b(${INTENT_KEYWORDS.katalog.join("|")})\\b`, "i"),
  greeting: new RegExp(`\\b(${INTENT_KEYWORDS.greeting.join("|")})\\b`, "i"),
  help: new RegExp(`\\b(${INTENT_KEYWORDS.help.join("|")})\\b`, "i"),
  keranjang: new RegExp(`\\b(${INTENT_KEYWORDS.keranjang.join("|")})\\b`, "i"),
  checkout: new RegExp(`\\b(${INTENT_KEYWORDS.checkout.join("|")})\\b`, "i")
};