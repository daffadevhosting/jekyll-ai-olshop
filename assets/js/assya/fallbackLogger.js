

export function logFallbackPhrase(prompt = "") {
  if (!prompt || prompt.length < 2) return;
  try {
    const list = JSON.parse(localStorage.getItem("unknown_phrases")) || [];
    if (!list.includes(prompt)) {
      list.push(prompt);
      localStorage.setItem("unknown_phrases", JSON.stringify(list));
    }
  } catch (err) {
    console.warn("Gagal menyimpan fallback phrase:", err);
  }
}
