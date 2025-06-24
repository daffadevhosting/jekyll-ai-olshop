const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const micBtn = document.getElementById("mic-btn");
const voiceModal = document.getElementById("voice-modal");
const sendBtn = document.getElementById("send-btn");
const loginModal = document.getElementById("loginModal");

let chatCount = 0;
const LIMIT = 3;
let recognition = null;

// Toggle tombol mic dan kirim
function toggleButtons() {
  const value = input.value.trim();
  const isFocused = document.activeElement === input;
  micBtn.style.display = (isFocused || value.length > 0) ? 'none' : '';
  sendBtn.style.display = (isFocused || value.length > 0) ? '' : 'none';
}

function renderReply(html) {
  const msg = document.createElement("div");
  msg.className = "chat-message assya";
  msg.innerHTML = html;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
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

// Voice recognition
function showVoiceModal() {
  voiceModal.style.display = "flex";
  setTimeout(() => {
    if (voiceModal.style.display === "flex") stopListening();
  }, 10000);
}

function hideVoiceModal() {
  voiceModal.style.display = "none";
}function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert("Browser kamu belum support voice recognition!");

  const recognition = new SpeechRecognition();
  recognition.lang = "id-ID";
  recognition.continuous = false;
  recognition.interimResults = false;

  showVoiceModal("Mendengarkan suara kamu... 🎙️");

  recognition.onresult = (event) => {
    const spoken = event.results[0][0].transcript;
    hideVoiceModal();
    handleVoiceInput(spoken); // langsung proses ke chat
  };

  recognition.onerror = () => hideVoiceModal();
  recognition.onend = () => hideVoiceModal();

  recognition.start();
}

function handleVoiceInput(spoken) {
  if (!spoken) return;
  const bubble = createBubble("user", spoken);
  chatBox.appendChild(bubble);
  scrollToBottom();
  sendToAI(spoken); // ini fungsi fetch ke Worker/Assya API
}

function stopListening() {
  recognition?.stop();
}

function showVoiceModal(msg = "Mendengarkan...") {
  const modal = document.getElementById("voice-modal");
  if (!modal) return;
  modal.querySelector("#voice-status").textContent = msg;
  modal.style.display = "block";
}

function hideVoiceModal() {
  const modal = document.getElementById("voice-modal");
  if (modal) modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // ⛔ cegah reload
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = "";
    toggleButtons?.(); // opsional jika kamu pakai mic/send switch
    handleRequest(text);
  });
});

function addUserMessage(text) {
  const msg = document.createElement("div");
  msg.className = "chat-bubble user";
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🔁 Voice + teks
function handleVoiceInput(text) {
  appendMessage("user", text);
  if (typeof handleCommand === "function") handleCommand(text);
  handleRequest(text);
}

async function handleRequest(prompt) {
  const user = firebase.auth().currentUser;
  const uid = user?.uid ?? null;
  const isAnon = !uid;
  if (isAnon && chatCount >= LIMIT) return showLoginModal();
  if (isAnon) chatCount++;

  showThinking();

  try {
    const res = await fetch("https://qwen-ai.sendaljepit.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, uid }),
    });

    if (res.status === 429) {
      chatBox.lastChild?.remove();
      return showLimitWarning();
    }

    const data = await res.json();
    chatBox.lastChild?.remove();

    if (data.limitReached) return showLimitWarning();

    const bubble = createBubble("assya");
    chatBox.appendChild(bubble);
    scrollToBottom();

    let reply = (data.reply || "Maaf, Assya belum ngerti 😅")
      .replace(/<think>.*?<\/think>/gs, "")
      .replace(/\*wave\*/gi, "👋")
      .replace(/\*(.*?)\*/g, "$1")
      .trim();

    await typeTextAndSpeak(reply, (val) => {
      bubble.textContent = val;
      scrollToBottom();
    });

  } catch (err) {
    console.error("❌ Gagal minta balasan:", err);
    chatBox.lastChild?.remove();
    appendMessage("assya", "🙈 Assya lagi error nih. Coba lagi sebentar ya.");
  }
}

function showLoginModal() {
  loginModal?.showModal?.();
}

function showLimitWarning() {
  appendMessage("assya", "🫣 Batas penggunaan gratis kamu sudah tercapai. Yuk login dulu~");
  showLoginModal();
}

function appendMessage(sender, text) {
  const div = createBubble(sender);
  div.textContent = text;
  chatBox.appendChild(div);
  if (sender === "assya") playBubbleSound();
  scrollToBottom();
}

function showThinking() {
  appendMessage("assya", "🤔 Assya sedang mikir bentar ya...");
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function createBubble(sender) {
  const div = document.createElement("div");
  div.className = `chat-bubble ${sender}`;
  return div;
}

function playBubbleSound() {
  const snd = new Audio("./assets/notif/chat-up.mp3");
  snd.volume = 0.2;
  snd.play().catch(() => {});
}

async function typeTextAndSpeak(text, callback) {
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();
  if (!voices.length) await new Promise((r) => setTimeout(r, 100));
  voices = synth.getVoices();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "id-ID";
  const voice = voices.find(v => v.lang === "id-ID" && v.name.toLowerCase().includes("female"));
  if (voice) utter.voice = voice;
  synth.speak(utter);

  let typed = "";
  for (const char of text) {
    typed += char;
    callback(typed);
    await new Promise((r) => setTimeout(r, 45 + Math.random() * 50));
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const bubble = createBubble("assya");
  bubble.classList.add("welcome-header"); // 🪄 Tambah class di sini
  chatBox.appendChild(bubble);
  scrollToBottom();
  showThinking();

  await new Promise((r) => setTimeout(r, 200));
  chatBox.lastChild?.remove();

  const hour = new Date().getHours();
  let waktu = "hari ini 🌿";
  if (hour >= 4 && hour < 10) waktu = "pagi ini 🌅";
  else if (hour >= 10 && hour < 15) waktu = "siang ini ☀️";
  else if (hour >= 15 && hour < 18) waktu = "sore ini 🌇";
  else waktu = "malam ini 🌙";

  let nama = "";
  try {
    const user = firebase.auth().currentUser;
    if (user && user.displayName) {
      nama = user.displayName.split(" ")[0];
    }
  } catch (err) {
    console.warn("Belum login");
  }

  const welcome = `Assalamu’alaikum${nama ? ', ' + nama : ''} 👋 Aku Assya dari As-Syariah Putra. Ada yang bisa kubantu ${waktu}?`;

  await typeTextAndSpeak(welcome, (val) => {
    bubble.textContent = val;
    scrollToBottom();
  });

  toggleButtons();
});

micBtn.addEventListener("click", () => {
  startListening();
});