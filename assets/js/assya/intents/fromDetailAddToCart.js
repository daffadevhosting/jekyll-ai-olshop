// 📁 intents/fromDetailAddToCart.js
// Menambahkan produk langsung dari input user setelah melihat detail

import { context } from "../context.js";
console.log("🚚 SIMPAN KE KERANJANG:", {
  slug: context.slug,
  warna: context.warna,
  qty: context.qty
});

export default async function fromDetailAddToCart() {
  if (!context.slug || !context.warna || !context.qty) {
    return {
      type: "text",
      text: `⚠️ Aku belum tahu produk, warna, atau jumlah yang dimaksud. Bisa ulangi lagi dengan lengkap ya kak 😊`
    };
  }

  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  keranjang.push({
    slug: context.slug,
    warna: context.warna,
    qty: context.qty
  });

  localStorage.setItem("keranjang", JSON.stringify(keranjang));
console.log("🛒 Menyimpan ke keranjang:", { slug: context.slug, warna: context.warna, qty: context.qty });

  return {
    type: "text",
    text: `🛍️ Produk warna ${context.warna} (${context.qty} pcs) sudah dimasukkan ke keranjang.
Ada yang lain kak? (ketik "ya" atau "tidak")`
  };
}
