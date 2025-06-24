import { INTENT_KEYWORDS } from './intents/intentPatterns.js';

export default function classifyIntent(text) {
  const input = text.toLowerCase();

  if (/\\b(nggak|tidak|ga|gak)\\b/i.test(text)) return "tidak";
  if (/\\b(ya|iya|yup|lanjut)\\b/i.test(text)) return "lanjut";
  if (["oke", "sip", "sudah oke", "iya", "lanjut", "pilih ini"].some(k => input.includes(k)))
  return "konfirmasiWarna";
  if (input.includes("keranjang") || input.includes("checkout")) return "checkout";
  if (input.includes("warna") || ["hitam","merah","toska","pink","abu","mustard"].some(w => input.includes(w)))
  return "warnaProduk";
  if (input.includes("warna") || input.includes("pilih")) return "warnaProduk";
  if (input.includes("tambah") || input.includes("keranjang")) return "addToCart";
  if (input.includes("produk") || input.includes("katalog")) return "katalog";
  if (input.includes("detail") || input.includes("lihat") || input.includes("info")) return "produkDetail";
  if (input.includes("halo") || input.includes("hai") || input.includes("assya")) return "greeting";
  if (input.includes("bantuan") || input.includes("help")) return "help";
  if (input.includes("ukuran") || input.includes("size")) return "ukuranProduk";  
  if (input.includes("s") || input.includes("m") || input.includes("l") || input.includes("xl") || input.includes("all size") || input.includes("one size")) return "ukuranProduk"; 
  if (input.includes("beli") || input.includes("pesan") || input.includes("order")) return "beliProduk";
  if (input.includes("lanjutkan") || input.includes("bayar") || input.includes("checkout")) return "checkout";
  if (input.includes("selamat") || input.includes("hai") || input.includes("halo")) return "greeting";
  if (input.includes("bantuan") || input.includes("fitur") || input.includes("menu")) return "help";
  if (input.includes("lanjut") || input.includes("ya") || input.includes("iya")) return "lanjut";
  if (input.includes("tidak") || input.includes("nggak") || input.includes("gak") || input.includes("ga")) return "tidak";
  if (input.includes("katalog") || input.includes("produk") || input.includes("koleksi")) return "katalog";
  const lower = text.toLowerCase();
  for (const intent in INTENT_KEYWORDS) {
    const patterns = INTENT_KEYWORDS[intent];
    if (patterns.some(p => lower.includes(p))) return intent;
  }
  return "fallback";
}