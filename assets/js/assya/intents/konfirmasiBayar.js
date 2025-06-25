// 📁 intents/konfirmasiBayar.js

export default async function konfirmasiBayar() {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  if (!keranjang.length) {
    return {
      type: "text",
      text: "Keranjangmu kosong, kak 😅 Coba pilih produk dulu ya."
    };
  }

  // Simpan data ke Firestore (jika lo pake Firebase), sementara kita console.log aja dulu
  const orderId = `order_${Date.now()}`;

  console.log("🧾 Order Tercatat:", {
    id: orderId,
    items: keranjang
  });

  // Bersihkan keranjang
  localStorage.removeItem("keranjang");

  return {
    type: "html",
    content: `
      <div class="text-sm leading-relaxed">
        ✅ Pesanan kamu sudah dikonfirmasi dan dicatat. Terima kasih telah berbelanja bersama Assya! 💕<br/>
        <strong>ID Pesanan:</strong> ${orderId}<br/>
        Kami akan segera menghubungi kamu untuk proses lanjut. 🙌
      </div>
    `
  };
}
