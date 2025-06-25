// 📁 assya-core.js (FULL PATCH: auto-cart 🚀)
import handleIntent from "./handleIntent.js";
import { logFallbackPhrase } from "./fallbackLogger.js";
import classifyIntent from "./classifyIntent.js";
import { checkLimit, incrementUsage } from "./usageLimiter.js";
import { renderSingleProduct } from "./modules/renderSingleProduct.js";
import { extractOrderFromInput } from "./modules/extractOrderFromInput.js";
import { context, updateContext } from "./context.js";
import { updateBadgeQty, setupQuickSidebar } from "./ui/uiEnhancer.js";
import { initChatUI } from "./initChatUI.js";
import { renderReply } from "./renderReply.js";
import { handleRequest } from "./handleRequest.js";
import { autogreet } from "./autogreet.js";
import { setupChatEvents } from "./chatEvents.js";

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

document.addEventListener("DOMContentLoaded", async () => {
  const chatBox = document.getElementById("chat-box");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const micBtn = document.getElementById("mic-btn");
  const sendBtn = document.getElementById("send-btn");

  // Inisialisasi UI
  const { addUserMessage, toggleButtons } = initChatUI(chatBox, input, micBtn, sendBtn);
  setupQuickSidebar();
  updateBadgeQty();

  // Greeting & help awal
  await autogreet(handleIntent, renderReply, chatBox);

  // Setup event listener
  setupChatEvents({form, input, micBtn, sendBtn, addUserMessage, handleRequest: (text) => handleRequest({prompt: text, chatBox, renderReply}), toggleButtons});
});
