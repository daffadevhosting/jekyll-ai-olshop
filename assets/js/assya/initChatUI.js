// initChatUI.js
// Inisialisasi UI chat, expose addUserMessage, toggleButtons

export function initChatUI(chatBox, input, micBtn, sendBtn) {
  function addUserMessage(text) {
    const msg = document.createElement("div");
    msg.className = "chat-bubble user";
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function toggleButtons() {
    const value = input.value.trim();
    const isFocused = document.activeElement === input;
    micBtn.style.display = (isFocused || value.length > 0) ? 'none' : '';
    sendBtn.style.display = (isFocused || value.length > 0) ? '' : 'none';
  }

  return { addUserMessage, toggleButtons };
}
