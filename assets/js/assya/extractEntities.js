import { context, updateContext } from "./context.js";

export function extractEntities(input = "", produk = []) {
  const message = input.toLowerCase();

  // =======================
  // 🎯 Cari produk by slug / title
  let produkItem = produk.find(p =>
    message.includes(p.slug) || message.includes(p.title?.toLowerCase())
  );

  // Fallback: kalau user gak nyebut nama produk, tapi context udah ada
  if (!produkItem && context?.slug) {
    produkItem = produk.find(p => p.slug === context.slug);
  }

  const slug = produkItem?.slug || null;
  const stok = produkItem?.stok || context?.stok || null;

  // =======================
  // 🎨 Warna dari list atau alias
  const warnaList = ["toska", "pink", "abu", "navi", "hitam", "merah", "mustard", "krem", "coksu"];
  const warnaAlias = {
    marun: "merah",
    navy: "navi",
    coksus: "coksu"
  };

  let warna = "";
  const warnaRegex = new RegExp(`\\b(${warnaList.join("|")})\\b`, "i");
  const warnaMatch = message.match(warnaRegex);
  if (warnaMatch) {
    warna = warnaMatch[1].toLowerCase();
  } else {
    const aliasMatch = Object.keys(warnaAlias).find(alias => message.includes(alias));
    if (aliasMatch) warna = warnaAlias[aliasMatch];
  }

  // =======================
  // 📏 Ukuran (opsional)
  const ukuranList = ["s", "m", "l", "xl", "all size", "one size"];
  const ukuran = ukuranList.find(u => message.includes(u));

  // =======================
  // 🔢 Jumlah
  const qty = parseInt(message.match(/\b(\d{1,2})\b/)?.[1] || 1, 10);

  // =======================
  // 🔁 Simpan ke context global
  updateContext({ warna, ukuran, slug, qty, stok });

  return { warna, ukuran, slug, qty, stok };
}
