export default function tanyaItem(userInput = "") {
  const match = userInput.match(/(?:produk|barang|item)(?: ke)?[ -]?(\d+)/i);
  const index = match ? parseInt(match[1], 10) - 1 : -1;

  const cart = JSON.parse(localStorage.getItem("keranjang")) || [];

  if (index < 0 || index >= cart.length) {
    return {
      type: "text",
      text: `Maaf, aku tidak menemukan produk ke-${index + 1} di keranjangmu. 🤔`
    };
  }

  const item = cart[index];

  return {
    type: "text",
    text: `🛍️ Produk ke-${index + 1} di keranjang:\n• Nama: ${item.slug.replace(/-/g, " ")}\n• Warna: ${item.warna}\n• Jumlah: ${item.qty}`
  };
}
