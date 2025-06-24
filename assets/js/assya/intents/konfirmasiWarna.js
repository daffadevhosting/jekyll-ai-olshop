// intents/konfirmasiWarna.js
export default async function konfirmasiWarna(userInput) {
  const lastSlug = localStorage.getItem("produkTerakhir");
  const res = await fetch("/produk.json");
  const data = await res.json();
  const items = data.produk || [];
  const produk = items.find(p => p.slug === lastSlug);

  if (!produk) {
    return { type: "text", text: "Kamu belum pilih produk mana yang dimaksud 😅" };
  }

  return {
    type: "text",
    text: `Siap, produk "${produk.title}" akan segera ditambahkan ke keranjang! 🛒`
    // Atau langsung trigger addToCart() jika ingin otomatis
  };
}
