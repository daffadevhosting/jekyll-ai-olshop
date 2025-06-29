// handleRequest.js
// Logika utama proses chat
import classifyIntent from "./classifyIntent.js";
import handleIntent from "./handleIntent.js";
import { checkLimit, incrementUsage } from "./usageLimiter.js";
import { context, updateContext } from "./context.js";
import { extractOrderFromInput } from "./modules/extractOrderFromInput.js";

export async function handleRequest({prompt, chatBox, renderReply}) {
  const user = firebase.auth().currentUser;
  const uid = user?.uid ?? null;
  if (!checkLimit()) return handleIntent("limitReached").then(r => renderReply(r, chatBox));
  incrementUsage();

  const intent = classifyIntent(prompt);
  if (["katalog", "greeting", "help", "fallback"].includes(intent)) {
    let loading = document.createElement("div");
    loading.className = "chat-bubble assya loading";
    loading.textContent = "Assya sedang mengetik...";
    chatBox.appendChild(loading);
    chatBox.scrollTop = chatBox.scrollHeight;
    loading.classList.add("fade-out");
    setTimeout(() => loading.remove(), 400);
    const response = await handleIntent(intent, prompt);
    renderReply(response, chatBox);
    return;
  }

  if (context.slug && /warna|ambil|pcs|biji|buah|mau/i.test(prompt)) {
    extractOrderFromInput(prompt);
    const response = await handleIntent("fromDetailAddToCart");
    return renderReply(response, chatBox);
  }

  if (prompt.toLowerCase().startsWith("detail ")) {
    const slug = prompt.split("detail ")[1].trim();
    const res = await fetch("/produk.json");
    const { produk } = await res.json();
    const product = produk.find(p => p.slug === slug);
    if (!product) {
      return renderReply({ type: "text", text: `Maaf, produk dengan slug "${slug}" tidak ditemukan.` }, chatBox);
    }
    updateContext({ slug: product.slug, stok: product.stok });
    const styleList = (product.styles || []).map(s => `
      <span class="text-xs px-2 py-1 bg-gray-100 border rounded" style="background-color: ${s.color}">${s.name}</span>
    `).join(" ");
    const detailHTML = `
      <div class="assya-singleProduk rounded overflow-hidden text-sm">
        <div class="w-full bg-white mx-auto">
        <img src="${product.image}" alt="${product.title}" class="w-full max-h-48 object-cover rounded mb-2"/>
        <div class="px-2">
        <h2 class="font-bold text-gray-600 text-base mb-1">${product.title}</h2>
        <p class="text-gray-600 mb-1">${product.description}</p>
        <p class="text-sm text-green-600 font-semibold mb-1">Harga: Rp ${product.discount || product.price}</p>
        <p class="text-sm text-red-600">Stok: ${product.stok}</p>
        <div class="my-2" style="line-height: 30px;">
          <p class="mb-1">Varian warna tersedia:</p>
          ${styleList || '<span class="text-xs">-</span>'}
        </div>
        <p class="text-xs text-gray-500 italic">Ketik misalnya: "Saya mau 1 warna merah"</p>
        </div>
        </div>
      </div>
    `;
    return renderReply({ type: "html", content: detailHTML }, chatBox);
  }

  // Fallback ke AI
  try {
    const produkData = await fetch("/produk.json").then(r => r.json());
    const produkList = (produkData.produk || []).slice(0, 5);
    const produkString = produkList.map(p => `${p.title} (slug: ${p.slug})`).join(", ");
    const userPrompt = `User: ${prompt}\nPilihan: ${JSON.stringify(context)}`;
    let finalPrompt = `Produk tersedia: ${produkString}\n${userPrompt}`;
    if (finalPrompt.length > 500) finalPrompt = finalPrompt.slice(0, 480);
    const res = await fetch("https://qwen-ai.sendaljepit.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: finalPrompt, uid })
    });
    if (res.status === 429) {
      chatBox.lastChild?.remove();
      return handleIntent("limitReached").then(r => renderReply(r, chatBox));
    }
    const data = await res.json();
    chatBox.lastChild?.remove();
    if (data.limitReached || data.error) return renderReply({ type: "text", text: data.error || "Limit habis." }, chatBox);
    renderReply({ type: "html", content: data.reply }, chatBox);
  } catch (err) {
    const fallbackResponse = await handleIntent("fallback", prompt);
    renderReply(fallbackResponse, chatBox);
  }
}
