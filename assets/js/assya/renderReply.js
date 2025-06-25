// 📁 renderReply.js
// Fungsi render bubble balasan Assya dengan auto-scroll UX

export function renderReply(reply, chatBox) {
  const isKatalog = reply.type === "html" && reply.content.includes("assya-katalog");

  const msg = document.createElement("div");
  if (!isKatalog) {
    msg.className = "chat-bubble assya";
  }

  if (reply.type === "html") {
    msg.innerHTML = reply.content;
  } else if (reply.type === "text") {
    msg.textContent = reply.text;
  } else if (typeof reply === "string") {
    msg.innerHTML = reply;
  } else {
    msg.textContent = "Maaf, terjadi kesalahan.";
  }

  chatBox.appendChild(msg);

  // Tambahkan elemen target scroll paling bawah
  const scrollTarget = document.createElement("div");
  scrollTarget.id = "chat-scroll-bottom";
  chatBox.appendChild(scrollTarget);

  scrollTarget.scrollIntoView({ behavior: "smooth" });
}
