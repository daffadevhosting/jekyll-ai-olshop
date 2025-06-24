// 📁 modules/extractOrderFromInput.js
// Mengekstrak warna + jumlah dari input user ("Saya mau 2 hitam", "1 merah")

import { updateContext } from "../context.js";

const warnaList = ["merah", "hitam", "toska", "pink", "abu", "navi", "mustard", "krem", "coksu", "biru", "putih"];

export function extractOrderFromInput(text) {
  const message = text.toLowerCase();
  const jumlahMatch = message.match(/(\d{1,2})\s?(pcs|biji|buah)?/);
  const warnaMatch = warnaList.find(w => message.includes(w));

  const qty = jumlahMatch ? parseInt(jumlahMatch[1], 10) : 1;
  const warna = warnaMatch || null;

  updateContext({ warna, qty });

  return { warna, qty };
}
