export default async function checkoutRingkasan() {
  const res = await fetch("/produk.json");
  const data = await res.json();
  const items = data.produk || [];

  const cart = JSON.parse(localStorage.getItem("keranjang")) || [];
  if (!cart.length) {
    return {
      type: "text",
      text: "Keranjangmu masih kosong, ayo isi dulu belanjaannya 😄"
    };
  }

  let total = 0;
  const list = cart.map(item => {
    const produk = items.find(p => p.slug === item.slug);
    if (!produk) return "";

    const harga = parseInt((produk.discount || produk.price).replace(/\./g, ""), 10);
    const subtotal = harga * item.qty;
    total += subtotal;

    return `
      <div class="text-sm border-b py-2 flex justify-between">
        <div>
          <strong>${produk.title}</strong><br/>
          Warna: <span class="capitalize">${item.warna}</span><br/>
          Qty: ${item.qty} × Rp ${harga.toLocaleString("id-ID")}
        </div>
        <div class="font-semibold text-green-600">Rp ${subtotal.toLocaleString("id-ID")}</div>
      </div>
    `;
  }).join("");

  return {
    type: "html",
    content: `
      <div class="text-sm">
        <p class="mb-2 font-semibold">🧾 Ringkasan Pesananmu:</p>
        ${list}
        <p class="mt-3 border-t pt-2 font-bold text-right">Total: Rp ${total.toLocaleString("id-ID")}</p>
        <div class="mt-3 flex gap-2">
          <button onclick="alert('Checkout belum diproses')" class="bg-blue-600 text-white text-xs px-4 py-1 rounded hover:bg-blue-700">
            Checkout Sekarang
          </button>
          <button onclick="clearCart()" class="bg-gray-200 text-xs px-3 py-1 rounded hover:bg-gray-300">
            Kosongkan Keranjang
          </button>
        </div>
        <script>
          function clearCart() {
            localStorage.removeItem("keranjang");
            chatTo('keranjang');
          }
        </script>
      </div>
    `
  };
}
