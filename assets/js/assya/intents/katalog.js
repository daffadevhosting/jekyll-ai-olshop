export default async function katalog() {
  try {
    const res = await fetch("/produk.json");
    const data = await res.json();
    const produk = data.produk || [];

    if (produk.length === 0) {
      return {
        type: "text",
        text: "Katalog kosong lur, coba cek deui engké nya 🙏"
      };
    }

    const cards = produk.map(p => {
      const slug = (p.url?.split("/").filter(Boolean).pop() || p.slug).toLowerCase();

      return `
        <div class="border p-2 rounded shadow bg-white flex flex-col">
          <img src="${p.image}" alt="${p.title}" class="w-full h-28 object-cover mb-2 rounded" />
          <h3 class="font-semibold text-gray-500 text-sm mb-1">${p.title}</h3>
          <p class="text-xs text-gray-600 flex-grow">${p.description}</p>
          <div class="text-green-600 font-bold text-sm mt-2">Rp${p.price}</div>
          <button onclick="chatTo('detail ${slug}')" class="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
            Lihat Detail
          </button>
        </div>
      `;
    }).join("");

return {
  type: "html",
  content: `
    <div class="assya-katalog w-full -mx-4 sm:mx-0">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        ${cards}
      </div>
    </div>
  `
};
  } catch (err) {
    console.error("Gagal render katalog:", err);
    return {
      type: "text",
      text: "Maaf, gagal memuat katalog. Coba lagi beberapa saat lagi 😔"
    };
  }
}
