// intents/help.js

export default function help() {
  return {
    type: "html",
    content: `
      <div class="text-sm">
        🧭 Kamu bisa coba perintah ini:
        <ul class="list-disc pl-5 mt-2">
          <li>Ketik <strong>katalog</strong> → untuk lihat daftar produk</li>
          <li>Ketik <strong>halo</strong> atau <strong>assya</strong> → untuk menyapa aku</li>
          <li>Ketik <strong>bantuan</strong> → untuk menampilkan panduan ini</li>
        </ul>
      </div>
    `
  };
}
