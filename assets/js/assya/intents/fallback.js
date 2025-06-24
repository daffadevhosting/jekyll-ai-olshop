// intents/fallback.js

export default function fallback(userInput) {
  return {
    type: "html",
    content: `
      <div class="text-sm leading-relaxed">
        Maaf, Assya belum paham maksud dari: <em>"${userInput}"</em> 😕<br/>
        Coba ketik <strong>katalog</strong> untuk lihat produk, atau <strong>bantuan</strong> untuk lihat apa saja yang bisa Assya lakukan.
      </div>
    `
  };
}
