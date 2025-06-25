// usageLimiter.js

const MAX_CHAT_ANON = 10;
const MAX_CHAT_FREE = 50;

function getUserStatus() {
  // Dummy logic: nanti bisa diganti dengan login sistem asli
  const status = localStorage.getItem("user_status") || "anon"; // "anon", "free", "premium"
  const used = parseInt(localStorage.getItem("chat_used") || "0", 10);
  return { status, used };
}

export function incrementUsage() {
  const current = parseInt(localStorage.getItem("chat_used") || "0", 10);
  localStorage.setItem("chat_used", current + 1);
}

export function checkLimit() {
  if (location.hostname === "localhost") return true; // 👈 bypass total di local

  const { status, used } = getUserStatus();

  if (status === "premium") return true;
  if (status === "free" && used < MAX_CHAT_FREE) return true;
  if (status === "anon" && used < MAX_CHAT_ANON) return true;

  return false;
}
// Reset usage and status for testing purposes
// Hapus ini setelah selesai testing
localStorage.removeItem("chat_used");
localStorage.removeItem("user_status");
// Gunakan ini untuk mengatur status pengguna
// Hapus atau ganti sesuai kebutuhan
// Ini hanya untuk testing, jangan gunakan di production
// Misalnya, untuk mengatur status pengguna ke "anon", "free", atau "premium
localStorage.setItem("user_status", "anon");    // default
localStorage.setItem("user_status", "free");    // login Google
localStorage.setItem("user_status", "premium"); // premium plan
localStorage.setItem("chat_used", "0");         // reset usage
