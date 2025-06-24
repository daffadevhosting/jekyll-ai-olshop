// intents/addToCart.js
export default async function addToCart(userInput) {
  const slug = extractSlug(userInput); // misal dari "tambah masker-3d-bordir"
  const res = await fetch("/produk.json");
  const data = await res.json();
  const produk = data.produk || [];
  const item = produk.find(p => p.slug === slug);

  if (!item) {
    return { type: "text", text: `Produk "${slug}" tidak ditemukan.` };
  }

  // Simpan keranjang ke localStorage
  const cart = JSON.parse(localStorage.getItem("keranjang")) || [];
  cart.push({ slug: item.slug, qty: 1 });
  localStorage.setItem("keranjang", JSON.stringify(cart));

  return {
    type: "text",
    text: `✅ "${item.title}" telah ditambahkan ke keranjang.`
  };
}

function extractSlug(input) {
  const words = input.toLowerCase().split(" ");
  return words.find(word => word.includes("-")) || words.pop();
}
