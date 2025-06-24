
function slugify(str = "") {
  return str.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default async function produkDetail(userInput = "") {
  try {
    const res = await fetch("/produk.json");
    const data = await res.json();
    const items = data.produk || [];

    const keyword = slugify(userInput);
    const match = items.find(p => {
      const aliases = [
        slugify(p.slug || ""),
        slugify(p.title || ""),
        slugify(p.url?.split("/").filter(Boolean).pop() || "")
      ];
      return aliases.some(key => keyword.includes(key) || key.includes(keyword));
    });

    if (!match) {
      return {
        type: "text",
        text: `Maaf, belum ketemu produk yang cocok untuk: "${userInput}".`
      };
    }

    const variants = (match.styles || []).map(s => `
      <div class="text-xs flex items-center gap-2">
        <img src="${s.image_path}" class="w-6 h-6 rounded-full border" />
        ${s.name} <span class="w-4 h-4 inline-block rounded-full" style="background:${s.color}"></span>
      </div>
    `).join("");

    const story = match.narrative || `
      Produk <strong>${match.title}</strong> ini dibuat dari bahan berkualitas dengan detail bordir halus dan desain khas. ${match.description || ""}<br/>
      Stok saat ini: <strong>${match.stok}</strong>.<br/>
      Harga: <span class="text-green-600 font-semibold">Rp${match.price}</span> ${match.discount ? `(diskon dari Rp${match.discount})` : ""}.
    `;

    return {
      type: "html",
      content: `
        <div class="text-sm leading-normal">
          <img src="${match.image}" class="w-full rounded mb-2" />
          ${story}
          ${variants ? `<div class="grid grid-cols-2 gap-2 mt-2">${variants}</div>` : ""}
          <div class="mt-3">
            <a href="${match.url}" target="_blank" class="inline-block bg-blue-600 text-white px-4 py-1.5 text-xs rounded hover:bg-blue-700 transition">
              🔗 Lihat Produk di Website
            </a>
          </div>
        </div>
      `
    };
  } catch (err) {
    console.error("Produk detail gagal:", err);
    return {
      type: "text",
      text: "Gagal memuat detail produk. Coba lagi nanti ya 😔"
    };
  }
}
