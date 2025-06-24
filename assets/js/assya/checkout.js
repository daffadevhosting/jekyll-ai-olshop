// intents/checkout.js
export default async function checkout() {
  try {
    const res = await fetch("/produk.json");
    const data = await res.json();
    const allItems = data.produk || [];

    const cart = JSON.parse(localStorage.getItem("keranjang")) || [];

    if (!cart.length) {
      return {
        type: "text",
        text: "Keranjangmu masih kosong, lur. Coba tambah produk dulu ya 🛍️"
      };
    }

    let total = 0;
    const list = cart.map((item, i) => {
      const product = allItems.find(p => p.slug === item.slug);
      if (!product) return "";

      const harga = parseInt((product.discount || product.price).replace(/\./g, ""), 10);
      total += harga * (item.qty || 1);

      return `
        <div class="flex justify-between items-start border-b py-2 text-sm">
          <div>
            <strong>${product.title}</strong> x${item.qty || 1}<br/>
            <span class="text-green-600">Rp ${harga.toLocaleString("id-ID")}</span>
          </div>
          <button onclick="removeFromCart(${i})" class="text-red-500 text-xs hover:underline">hapus</button>
        </div>
      `;
    }).join("");

    return {
      type: "html",
      content: `
        <div class="text-sm">
          <p class="mb-2 font-semibold">🧺 Isi Keranjang:</p>
          ${list}
          <p class="mt-3 border-t pt-2 font-bold">Total: Rp ${total.toLocaleString("id-ID")}</p>
          <div class="mt-3 flex gap-2">
            <button onclick="alert('Checkout belum diimplementasi 🛒')" class="bg-blue-600 text-white text-xs px-4 py-1 rounded hover:bg-blue-700">Checkout</button>
            <button onclick="clearCart()" class="bg-gray-200 text-xs px-3 py-1 rounded hover:bg-gray-300">Kosongkan</button>
          </div>
        </div>
        <script>
          function removeFromCart(index) {
            const c = JSON.parse(localStorage.getItem("keranjang")) || [];
            c.splice(index, 1);
            localStorage.setItem("keranjang", JSON.stringify(c));
            chatTo('keranjang'); // reload intent
          }
          function clearCart() {
            localStorage.removeItem("keranjang");
            chatTo('keranjang');
          }
        </script>
      `
    };
  } catch (err) {
    console.error("Gagal tampilkan keranjang:", err);
    return {
      type: "text",
      text: "Keranjang gagal dimuat 😔 Coba lagi nanti ya."
    };
  }
}
