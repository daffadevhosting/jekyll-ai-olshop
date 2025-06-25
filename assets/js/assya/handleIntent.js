// handleIntent.js
// Mengelola intent dan memanggil handler yang sesuai
// 📁 handleIntent.js

import katalog from "./intents/katalog.js";
import greeting from "./intents/greeting.js";
import fallback from "./intents/fallback.js";
import help from "./intents/help.js";
import limitReached from "./intents/limitReached.js";
import productDetail from "./intents/productDetail.js";
import keranjang from "./intents/keranjang.js";
import addToCart from "./intents/addToCart.js";
import lihatKeranjang from "./intents/keranjang.js";
import fromDetailAddToCart from "./intents/fromDetailAddToCart.js";
import lanjut from './intents/lanjut.js';
import tidak from './intents/tidak.js';
import checkout from './intents/checkout.js';
import rekomendasi from './intents/rekomendasi.js';
import konfirmasiBayar from './intents/konfirmasiBayar.js';
import tanyaItem from "./intents/tanyaItem.js";
// Pemetaan intent
const intents = {
  katalog,
  greeting,
  fallback,
  help,
  limitReached,
  productDetail,
  keranjang,
  fromDetailAddToCart,
  addToCart,
  lanjut,
  tidak,
  checkout,
  rekomendasi,
  konfirmasiBayar,
  "lihat keranjang": lihatKeranjang,
  "tanya item": tanyaItem,
  "tanya produk": tanyaItem,
  "tanya stok": tanyaItem,
  "tanya harga": tanyaItem,
  "tanya detail produk": tanyaItem,
  "tanya rekomendasi": tanyaItem,
  "tanya warna": tanyaItem,
  "tanya ukuran": tanyaItem,
  "tanya warna produk": tanyaItem,
  "tanya ukuran produk": tanyaItem,
  "tanya warna item": tanyaItem,
  "tanya ukuran item": tanyaItem,
  "tanya warna keranjang": tanyaItem,
  "tanya ukuran keranjang": tanyaItem,
  "tanya warna keranjang item": tanyaItem,
  "tanya ukuran keranjang item": tanyaItem,
};
export default async function handleIntent(intentName, userInput = "") {
  const handler = intents[intentName] || intents["fallback"];
  return await handler(userInput); // Boleh async jika ada fetch
}
