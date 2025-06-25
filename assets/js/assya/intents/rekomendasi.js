// 📁 intents/rekomendasi.js

import { renderSingleProduct } from "../modules/renderSingleProduct.js";

export default async function rekomendasi() {
  const slugs = [
    "masker-bordir-tasik-3d",
    "masker-bordir-tasik-dahlia",
    "masker-bordir-tasik-mawar"
  ];

  const cards = await Promise.all(slugs.map(slug => renderSingleProduct(slug)));

  return {
    type: "html",
    content: `
      <p class="mb-2">Berikut beberapa rekomendasi masker bordir dari Assya ✨</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        ${cards.join("")}
      </div>
    `
  };
}