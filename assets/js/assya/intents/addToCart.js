import { context } from "../context.js";

export default async function addToCart() {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  if (!context.slug) {
    return {
      type: "text",
      text: "Produk belum dipilih dengan jelas. Coba sebutkan nama produknya dulu ya."
    };
  }

    if (context.stok === "0" || context.stok === 0) {
    return {
        type: "text",
        text: `⚠️ Maaf, stok untuk produk ini sedang habis. Kamu bisa pilih produk lain dulu, ya.`
    };
    }

  keranjang.push({
    slug: context.slug,
    warna: context.warna || "-",
    ukuran: context.ukuran || "-",
    qty: context.qty || 1
  });

  localStorage.setItem("keranjang", JSON.stringify(keranjang));

  return {
    type: "text",
    text: `🛒 Produk berhasil dimasukkan ke keranjang!\n- Produk: ${context.slug}\n- Warna: ${context.warna || "-"}\n- Ukuran: ${context.ukuran || "-"}\n- Jumlah: ${context.qty || 1}`
  };
}
