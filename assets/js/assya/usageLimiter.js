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
  const { status, used } = getUserStatus();

  if (status === "premium") return true;
  if (status === "free" && used < MAX_CHAT_FREE) return true;
  if (status === "anon" && used < MAX_CHAT_ANON) return true;

  return false;
}
localStorage.setItem("user_status", "anon");    // default
localStorage.setItem("user_status", "free");    // login Google
localStorage.setItem("user_status", "premium"); // premium plan
localStorage.setItem("chat_used", "0");         // reset usage
