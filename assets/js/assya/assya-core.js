// 📁 assya-core.js (FULL PATCH: auto-cart 🚀)
import handleIntent from "./handleIntent.js";
import { logFallbackPhrase } from "./fallbackLogger.js";
import classifyIntent from "./classifyIntent.js";
import { checkLimit, incrementUsage } from "./usageLimiter.js";
import { extractOrderFromInput } from "./modules/extractOrderFromInput.js";
import { context, updateContext } from "./context.js";

let chatCount = 0;
const LIMIT = 10;
let recognition = null;
let nama = "";
let loading = null;

try {
  const user = firebase.auth().currentUser;
  if (user && user.displayName) {
    nama = user.displayName.split(" ")[0];
  }
} catch (err) {
  console.warn("Belum login");
}

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const micBtn = document.getElementById("mic-btn");
  const sendBtn = document.getElementById("send-btn");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = "";
    handleRequest(text);
  });

  window.chatTo = function (text) {
    document.querySelector('#user-input').value = text;
    document.querySelector('#chat-form').dispatchEvent(new Event('submit'));
  };

  function toggleButtons() {
    const value = input.value.trim();
    const isFocused = document.activeElement === input;
    micBtn.style.display = (isFocused || value.length > 0) ? 'none' : '';
    sendBtn.style.display = (isFocused || value.length > 0) ? '' : 'none';
  }

  input.addEventListener('focus', () => {
    toggleButtons();
    setTimeout(toggleButtons, 50);
  });
  input.addEventListener('input', toggleButtons);
  input.addEventListener('blur', () => {
    setTimeout(() => {
      if (input.value.trim().length === 0) toggleButtons();
    }, 100);
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event("submit", { bubbles: true }));
    }
  });

  function addUserMessage(text) {
    const msg = document.createElement("div");
    msg.className = "chat-bubble user";
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function renderReply(reply) {
    const msg = document.createElement("div");
    msg.className = "chat-bubble assya";
    if (reply && reply.type === "html") {
      msg.innerHTML = reply.content;
    } else if (reply && reply.type === "text") {
      msg.textContent = reply.text;
    } else if (typeof reply === "string") {
      msg.innerHTML = reply;
    } else {
      msg.textContent = "Maaf, terjadi kesalahan.";
    }
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function showLoginModal() {
    handleIntent("limitReached").then(renderReply);
  }

  function showLimitWarning() {
    handleIntent("limitReached").then(renderReply);
  }

  async function handleRequest(prompt) {
    const user = firebase.auth().currentUser;
    const uid = user?.uid ?? null;
    const isAnon = !uid;
    if (!checkLimit()) return showLoginModal();
    incrementUsage();

    const intent = classifyIntent(prompt);
    if (["katalog", "greeting", "help", "fallback"].includes(intent)) {
      loading = document.createElement("div");
      loading.className = "chat-bubble assya loading";
      loading.textContent = "Assya sedang mengetik...";
      chatBox.appendChild(loading);
      chatBox.scrollTop = chatBox.scrollHeight;

      if (loading) {
        loading.classList.add("fade-out");
        setTimeout(() => {
          loading.remove();
          loading = null;
        }, 400);
      }

      const response = await handleIntent(intent, prompt);
      renderReply(response);
      return;
    }

    // ✅ AUTO-CART dari input user (jika ada context.slug dan prompt mengandung niat belanja)
    if (context.slug && /warna|ambil|pcs|biji|buah|mau/i.test(prompt)) {
      console.log("🛒 Auto-cart: parsing dan simpan...");
      extractOrderFromInput(prompt);
      console.log("🧠 Context after extract:", context);
      const response = await handleIntent("fromDetailAddToCart");
      return renderReply(response);
    }

    // DETAIL PRODUK
    if (prompt.toLowerCase().startsWith("detail ")) {
      const slug = prompt.split("detail ")[1].trim();
      const res = await fetch("/produk.json");
      const { produk } = await res.json();
      const product = produk.find(p => p.slug === slug);

      if (!product) {
        return renderReply({
          type: "text",
          text: `Maaf, produk dengan slug "${slug}" tidak ditemukan.`
        });
      }

      updateContext({ slug: product.slug, stok: product.stok });

      const styleList = (product.styles || []).map(s => `
        <span class="text-xs px-2 py-1 bg-gray-100 border rounded" style="background-color: ${s.color}">${s.name}</span>
      `).join(" ");

      const detailHTML = `
        <div class="text-sm">
          <img src="${product.image}" alt="${product.title}" class="w-full max-h-48 object-cover rounded mb-2"/>
          <h2 class="font-bold text-base mb-1">${product.title}</h2>
          <p class="text-gray-600 mb-1">${product.description}</p>
          <p class="text-sm text-green-600 font-semibold mb-1">Harga: Rp ${product.discount || product.price}</p>
          <p class="text-sm">Stok: ${product.stok}</p>
          <div class="my-2">
            <p class="mb-1">Varian warna tersedia:</p>
            ${styleList || '<span class="text-xs">-</span>'}
          </div>
          <p class="text-xs text-gray-500 italic">Ketik misalnya: "Saya mau 1 warna merah"</p>
        </div>
      `;

      return renderReply({ type: "html", content: detailHTML });
    }

    // FALLBACK KE AI
    try {
      const produkData = await fetch("/produk.json").then(r => r.json());
      const produkList = (produkData.produk || []).slice(0, 5);
      const produkString = produkList.map(p => `${p.title} (slug: ${p.slug})`).join(", ");

      const systemPrompt = `Produk tersedia: ${produkString}`;
      const userPrompt = `User: ${prompt}\nPilihan: ${JSON.stringify(context)}`;

      let finalPrompt = `${systemPrompt}\n${userPrompt}`;
      if (finalPrompt.length > 500) {
        finalPrompt = finalPrompt.slice(0, 480);
      }

      console.log("🛰️ Sending prompt to AI:", { finalPrompt, uid });
      console.log("🧾 Prompt length:", finalPrompt.length);

      const res = await fetch("https://qwen-ai.sendaljepit.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, uid })
      });
      logFallbackPhrase(prompt);
      if (res.status === 429) {
        chatBox.lastChild?.remove();
        return showLimitWarning();
      }

      const data = await res.json();
      chatBox.lastChild?.remove();
      if (data.limitReached || data.error) return renderReply({ type: "text", text: data.error || "Limit habis." });
      renderReply({ type: "html", content: data.reply });
    } catch (err) {
      console.error("AI fetch failed:", err);
      const fallbackResponse = await handleIntent("fallback", prompt);
      renderReply(fallbackResponse);
    }

    toggleButtons();
  }
});
