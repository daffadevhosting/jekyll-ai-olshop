// 📁 modules/renderSingleProduct.js

export async function renderSingleProduct(slug) {
  try {
    const res = await fetch("/produk.json");
    const { produk } = await res.json();
    const item = produk.find(p => p.slug === slug);
    if (!item) {
      return `<div class="text-sm text-red-500">❌ Produk dengan slug "${slug}" tidak ditemukan.</div>`;
    }

    const styleList = (item.styles || []).map(s =>
      `<span class="text-xs px-2 py-1 bg-gray-100 border rounded" style="background-color: ${s.color}">${s.name}</span>`
    ).join(" ");

    return `
      <div class="border p-3 rounded shadow bg-white flex flex-col mb-3">
        <img src="${item.image}" alt="${item.title}" class="w-full h-32 object-cover rounded mb-2" />
        <h3 class="font-semibold text-base mb-1">${item.title}</h3>
        <p class="text-sm text-gray-700 mb-1">${item.description}</p>
        <p class="text-green-600 font-bold text-sm">Rp ${item.discount || item.price}</p>
        <p class="text-xs text-gray-500 mt-1">Warna: ${styleList || '-'}</p>
        <button onclick="chatTo('detail ${item.slug}')" class="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
          Lihat Detail
        </button>
      </div>
    `;
  } catch (err) {
    console.error("Gagal render single product:", err);
    return `<div class="text-sm text-red-500">❌ Gagal memuat data produk.</div>`;
  }
}
