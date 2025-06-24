import handleIntent from "./handleIntent.js";
import classifyIntent from "./classifyIntent.js";
import { checkLimit, incrementUsage } from "./usageLimiter.js";

let chatCount = 0;
const LIMIT = 10; // batas percakapan gratis
let recognition = null;
let nama = "";

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
    // reply: { type, content, text }
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
    // Cek limit chat
    if (!checkLimit()) return showLoginModal();
    incrementUsage();
    const intent = classifyIntent(prompt);
    if (intent === "katalog" || intent === "greeting" || intent === "help" || intent === "fallback") {
      const loading = document.createElement("div");
      loading.className = "chat-bubble assya loading";
      loading.textContent = "Assya sedang mengetik...";
      chatBox.appendChild(loading);
      chatBox.scrollTop = chatBox.scrollHeight;

      const response = await handleIntent(intent, prompt);
      renderReply(response);
    } else {
      // fallback ke AI
      try {
        const res = await fetch("https://qwen-ai.sendaljepit.workers.dev/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, uid })
        });
        if (res.status === 429) {
          chatBox.lastChild?.remove();
          return showLimitWarning();
        }
        const data = await res.json();
        chatBox.lastChild?.remove();
        if (data.limitReached) return showLimitWarning();
        renderReply({ type: "html", content: data.reply });
      } catch (err) {
        console.error("AI fetch failed:", err);
        const fallbackResponse = await handleIntent("fallback", prompt);
        renderReply(fallbackResponse);
      }
    }
    toggleButtons();
  }
});