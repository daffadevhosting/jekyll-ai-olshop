export default async function tidak() {
  const keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];

  if (!keranjang.length) {
    return { type: 'text', text: 'Keranjang kamu masih kosong 😅' };
  }

  const list = keranjang.map(item =>
    `• ${item.slug} (${item.warna}, ${item.qty} pcs)`
  ).join('\\n');

  return {
    type: 'text',
    text: `🧾 Ini belanjaan kamu:\n${list}\n\nKetik \"checkout\" untuk lanjut pembayaran.`
  };
}
