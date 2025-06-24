import { updateContext } from "./context.js";

export function extractEntities(input = "", produk = []) {
  const message = input.toLowerCase();
  const warnaList = ["toska", "pink", "abu", "navi", "hitam", "merah", "mustard", "krem", "coksu"];
  const ukuranList = ["s", "m", "l", "xl", "all size", "one size"];
  const qty = parseInt(message.match(/\\b(\\d{1,2})\\b/)?.[1] || 1, 10);
    const produkItem = produk.find(p => {
    return message.includes(p.slug) || message.includes(p.title?.toLowerCase());
    });

const stok = produkItem?.stok || null;

updateContext({ warna, ukuran, slug, qty, stok });

  const warna = warnaList.find(w => message.includes(w));
  const ukuran = ukuranList.find(u => message.includes(u));
  const slug = produk.find(p => {
    return message.includes(p.slug) || message.includes(p.title?.toLowerCase());
  })?.slug;

  updateContext({ warna, ukuran, slug, qty });

  return { warna, ukuran, slug, qty };
}
