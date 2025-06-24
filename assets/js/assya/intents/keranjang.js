export default async function keranjang() {
  const data = JSON.parse(localStorage.getItem('keranjang')) || [];

  if (!data.length) {
    return {
      type: 'text',
      text: 'Keranjangmu masih kosong, kak 😅 Coba tambah produk dulu yuk!'
    };
  }

  const list = data.map((item, i) =>
    `${i + 1}. ${item.slug.replace(/-/g, ' ')} (${item.warna}, ${item.qty} pcs)`
  ).join('\\n');

  return {
    type: 'text',
    text: `🛒 Ini belanjaan kakak:\n${list}\n\nKetik \"checkout\" untuk lanjut pembayaran ya 😊`
  };
}
