export default function classifyIntent(text) {
  const input = text.toLowerCase();

  if (input.includes("tambah") || input.includes("keranjang")) return "addToCart";
  if (input.includes("produk") || input.includes("katalog")) return "katalog";
  if (input.includes("detail") || input.includes("lihat") || input.includes("info")) return "produkDetail";
  if (input.includes("halo") || input.includes("hai") || input.includes("assya")) return "greeting";
  if (input.includes("bantuan") || input.includes("help")) return "help";

  return "fallback";
}
