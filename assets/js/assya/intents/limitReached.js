// intents/limitReached.js

export default function limitReached() {
  return {
    type: "html",
    content: `
      <div class="text-sm leading-relaxed">
        💬 Batas chat gratis kamu sudah habis. <br/>
        <strong>Login dengan Google</strong> untuk melanjutkan hingga 50 percakapan tambahan, atau upgrade ke premium untuk akses tanpa batas.
        <div class="mt-3">
          <a href="/login" class="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
            🔐 Login dengan Google
          </a>
        </div>
      </div>
    `
  };
}
