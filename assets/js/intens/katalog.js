// intents/katalog.js
export default async function katalog() {
  const res = await fetch("/produk.json");
  const data = await res.json();
  const produk = data.produk.map(p => `
    <div class="border p-2 rounded">
      <img src="${p.image}" class="w-full mb-1">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <strong class="text-green-600">${p.price}</strong>
    </div>
  `).join("");
  
  return {
    type: "html",
    content: `<div class="grid grid-cols-2 gap-3">${produk}</div>`
  };
}
