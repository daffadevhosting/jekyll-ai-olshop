export default async function keranjang() {
  const cart = JSON.parse(localStorage.getItem("keranjang")) || [];

  if (!cart.length) {
    return {
      type: "text",
      text: "🛒 Keranjangmu masih kosong, kak. Yuk pilih dulu produknya dari katalog!"
    };
  }

  // Grouping by slug
  const grouped = cart.reduce((acc, item) => {
    if (!acc[item.slug]) acc[item.slug] = [];
    acc[item.slug].push({ warna: item.warna, qty: item.qty });
    return acc;
  }, {});

  const items = Object.entries(grouped).map(([slug, variants]) => {
    const list = variants.map(v => `• ${v.warna} x${v.qty}`).join("<br>");
    const nama = slug.replace(/-/g, " ");

    return `
      <div class="border p-3 rounded bg-white shadow-sm">
        <p class="font-semibold text-gray-800">${nama}</p>
        <p class="text-sm text-gray-600 leading-relaxed">${list}</p>
      </div>
    `;
  }).join("");

  return {
    type: "html",
    content: `
      <div class="text-sm">
        <p class="mb-2">🧾 Berikut isi keranjang kamu:</p>
        <div class="grid grid-cols-1 gap-3">${items}</div>
        <p class="mt-4">Ketik <strong>checkout</strong> untuk lanjut pembayaran, atau <strong>hapus</strong> untuk bersihkan keranjang.</p>
      </div>
    `
  };
}
