function addToCart(productIndex) {
  const card = document.querySelector(`.product-card[data-index="${productIndex}"]`);
  if (!card) return alert("Produk tidak ditemukan!");

  const title = card.querySelector("h2")?.innerText;
  const price = card.querySelector("p")?.innerText.replace(/[^\d]/g, "");
  const image = card.querySelector("img")?.src;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ title, price: parseInt(price), image });
  localStorage.setItem("cart", JSON.stringify(cart));

  appendMessage("qwen", `🛒 ${title} ditambahkan ke keranjang.`);
}
