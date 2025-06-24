export default async function checkout() {
  const keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];

  if (!keranjang.length) {
    return {
      type: 'text',
      text: 'Keranjangmu masih kosong 😅 Tambah dulu yuk sebelum checkout.'
    };
  }

  const summary = keranjang.map((item, i) =>
    `${i + 1}. ${item.slug.replace(/-/g, ' ')} - ${item.warna} (${item.qty} pcs)`
  ).join('\\n');

  return {
    type: 'text',
    text: `🧾 Pesananmu:\n${summary}\n\n✅ Jika sudah sesuai, ketik \"konfirmasi bayar\" atau tekan tombol di bawah untuk menyelesaikan transaksi.`
  };
}
