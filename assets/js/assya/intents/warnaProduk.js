export default async function warnaProduk(userInput) {
  const res = await fetch("/produk.json");
  const data = await res.json();
  const items = data.produk || [];
  const input = userInput.toLowerCase();

  // Ambil slug terakhir kalau tidak disebut di input
  const lastSlug = localStorage.getItem("produkTerakhir");
  const guess = items.find(p => input.includes(p.slug));
  const produk = guess || items.find(p => p.slug === lastSlug);

    if (!produk || !produk.styles || produk.styles.length === 0) {
    return {
        type: "text",
        text: `Produk ini belum punya daftar warna yang tersedia, jadi belum bisa dipilih ya 😅`
    };
    }

  const warna = produk.styles.find(s =>
    input.includes(s.name.toLowerCase())
  );

  if (!warna) {
    // Tampilkan semua warna kalau user belum pilih warna jelas
    const tombol = produk.styles.map(s => `
      <button onclick="chatTo('pilih ${produk.slug} warna ${s.name}')" 
        class="bg-white border px-2 py-1 text-xs rounded">
        ${s.name}
      </button>
    `).join("");

    return {
      type: "html",
      content: `<div><p class="text-sm mb-1">Pilih warna untuk <strong>${produk.title}</strong>:</p><div class="flex flex-wrap gap-2">${tombol}</div></div>`
    };
  }
    // Jika warna ditemukan, tampilkan detailnya
  return {
    type: "html",
    content: `
      <div class="text-sm">
        <p>Kamu memilih warna <strong>${warna.name}</strong> untuk <strong>${produk.title}</strong>:</p>
        <img src="${warna.image_path}" alt="${warna.name}" class="w-32 h-32 mt-2 rounded" />
        <p class="mt-2">Mau aku tambahkan ke keranjang, atau pilih warna lain?</p>
      </div>
    `
  };
}
// Catatan: Fungsi ini mengembalikan HTML untuk ditampilkan di chat
// Pastikan untuk menyesuaikan dengan struktur HTML yang digunakan di aplikasi chat
// Fungsi ini juga mengharuskan ada fungsi `chatTo` untuk mengirim pesan
// dan mengupdate konteks chat sesuai pilihan user.
// Misalnya, `chatTo('pilih produk slug warna warnaName')` untuk memilih warna tertentu.
// Pastikan juga untuk menangani event klik pada tombol dengan benar di aplikasi chat.
// Fungsi ini mengasumsikan bahwa produk memiliki struktur yang sesuai dengan data yang diambil
// dari `/produk.json`, termasuk atribut `styles` yang berisi informasi warna dan gambar.
// Pastikan untuk menguji fungsi ini dengan berbagai input untuk memastikan semua skenario ditangani
// dengan baik, termasuk kasus di mana produk atau warna tidak ditemukan.   