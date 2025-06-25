// chatEvents.js
// Semua event listener chat

export function setupChatEvents({form, input, micBtn, sendBtn, addUserMessage, handleRequest, toggleButtons}) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = "";
    handleRequest(text);
  });

  window.chatTo = function (text) {
    input.value = text;
    form.dispatchEvent(new Event('submit'));
  };

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
}
