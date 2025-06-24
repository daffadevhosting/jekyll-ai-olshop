// 📁 worker.js - Cloudflare Worker: AI Assya with Role-Based Limit, Context-Aware, Prompt Sanitizer

const ALLOWED_ORIGINS = [
  "http://localhost:8800",
  "http://127.0.0.1:8800",
];

function getCORSHeaders(origin) {
  const isAllowed = ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function getSystemPrompt(context = {}) {
  const hour = new Date().getHours();
  let greeting = "Assalamu’alaikum 👋";
  if (hour >= 4 && hour < 10) greeting = "Selamat pagi 🌤️";
  else if (hour >= 10 && hour < 15) greeting = "Selamat siang ☀️";
  else if (hour >= 15 && hour < 19) greeting = "Selamat sore 🌇";
  else greeting = "Selamat malam 🌙";

  const productLine = Array.isArray(context.productList)
    ? `Berikut produk yang tersedia: ${context.productList.join(", ")}.`
    : "";

  return `
${greeting}

Kamu adalah Assya, asisten toko online As-Syariah Putra.

Tugasmu:
- Selalu gunakan bahasa Indonesia yang ramah, sopan, dan santai.
- Jangan pernah menyebut dirimu sebagai AI, QWEN, model bahasa, atau asisten AI.
- Jangan gunakan tag <think>, *wave*, markdown, atau format khusus apapun.
- Gunakan emoji ringan seperti 👋 🌿 ✨ 💬 seperlunya.
- Jika ada perintah seperti "beli produk ke-2" atau "scroll ke bawah", cukup balas dengan konfirmasi singkat, biarkan frontend yang mengeksekusi.
- Jawaban harus pendek, jelas, hangat, dan tidak mengulang instruksi sistem.
- Jika pengguna menyebut nama kategori atau produk umum (misal 'masker'), hanya sebutkan pilihan dari daftar context.productList, jangan tampilkan produk yang tidak tersedia.

${productLine}
  `.trim();
}

function buildMessages({ prompt, history, context = {} }) {
  const messages = [
    { role: "system", content: getSystemPrompt(context) },
    ...(Array.isArray(history) ? history : []),
    { role: "user", content: prompt },
  ];
  return messages;
}

function makeError(message, status, corsHeaders, extra = {}) {
  return new Response(JSON.stringify({ error: message, ...extra }), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function getUsage(env, key) {
  let usage = await env.AI_USAGE_KV.get(key, { type: "json" });
  if (!usage || typeof usage !== "object") {
    usage = { count: 0, reset: Date.now() + 86400000 };
  }
  if (Date.now() > usage.reset) {
    usage = { count: 0, reset: Date.now() + 86400000 };
  }
  return usage;
}

async function updateUsage(env, key, usage) {
  await env.AI_USAGE_KV.put(key, JSON.stringify(usage), { expirationTtl: 86400 });
}

function validatePayload(payload) {
  const { prompt, uid, history = [], context = {} } = payload;

  if (typeof prompt !== "string" || !prompt.trim()) {
    return { valid: false, error: "❌ Prompt harus berupa teks yang tidak kosong." };
  }
  if (prompt.length > 500) {
    return { valid: false, error: "❌ Prompt terlalu panjang. Maksimal 500 karakter." };
  }
  if (!Array.isArray(history)) {
    return { valid: false, error: "❌ History harus berupa array." };
  }
  for (const msg of history) {
    if (
      typeof msg !== "object" ||
      !["user", "assistant"].includes(msg.role) ||
      typeof msg.content !== "string"
    ) {
      return { valid: false, error: "❌ History tidak valid. Role harus user/assistant & content teks." };
    }
    if (
      msg.role === "system" ||
      msg.content.toLowerCase().includes("asistenmu adalah") ||
      msg.content.toLowerCase().includes("ignore previous instructions")
    ) {
      return { valid: false, error: "❌ History mengandung manipulasi sistem." };
    }
  }
  if (typeof context !== "object" || context === null) {
    return { valid: false, error: "❌ Context harus berupa object." };
  }
  if (
    context.productList &&
    (!Array.isArray(context.productList) || context.productList.some((p) => typeof p !== "string"))
  ) {
    return { valid: false, error: "❌ context.productList harus array of string." };
  }

  return { valid: true, payload: { prompt, uid, history, context } };
}

async function handleChatRequest(request, env, corsHeaders) {
  let payload;
  try {
    payload = await request.json();
  } catch (err) {
    return makeError("Request body harus berupa JSON", 400, corsHeaders);
  }

  const { valid, error, payload: clean } = validatePayload(payload);
  if (!valid) return makeError(error, 400, corsHeaders);

  const { prompt, uid, history, context } = clean;
  const userId = uid || (request.headers.get("CF-Connecting-IP") || "anon");

  let role = "anon";
  if (uid && uid.startsWith("premium_")) role = "premium";
  else if (uid) role = "login";

  const limits = { anon: 10, login: 100, premium: 500 };
  const key = `usage:${userId}`;
  let usage = await getUsage(env, key);
  usage.count += 1;
  await updateUsage(env, key, usage);

  const limit = limits[role];
  if (usage.count > limit) {
    return new Response(
      JSON.stringify({
        reply: `Maaf, batas harian untuk akun ${role} sudah tercapai. 😊`,
        limitReached: true,
        remaining: 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  const messages = buildMessages({ prompt, history, context });

  let groqRes, data;
  try {
    groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages,
        temperature: 0.2,
        max_completion_tokens: 450,
        top_p: 0.5,
        stream: false,
      }),
    });
    data = await groqRes.json();
  } catch (err) {
    return makeError("Gagal menghubungi Groq API", 502, corsHeaders, { detail: err.message });
  }

  if (data?.error) {
    return makeError(data.error, 500, corsHeaders);
  }

  const rawReply = data.choices?.[0]?.message?.content || "";
  const blacklist = [
    "Saya adalah asisten AI",
    "Sebagai AI",
    "Sebagai model bahasa",
  ];
  let reply = rawReply
    .replace(/<think>[\s\S]*?<\/think>/gs, "")
    .replace(/\*wave\*/gi, "👋")
    .replace(/\*(.*?)\*/g, "$1")
    .trim();
  if (blacklist.some((phrase) => rawReply.includes(phrase))) {
    reply = "Maaf, bisa ulangi pertanyaannya? 😅";
  }

  return new Response(
    JSON.stringify({
      reply,
      limitReached: false,
      remaining: Math.max(0, limit - usage.count),
      role,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "";
    const corsHeaders = getCORSHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return makeError("Method Not Allowed", 405, corsHeaders);
    }

    return await handleChatRequest(request, env, corsHeaders);
  },
};
