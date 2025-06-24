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
import fromDetailAddToCart from "./intents/fromDetailAddToCart.js";
import lanjut from './intents/lanjut.js';
import tidak from './intents/tidak.js';
import checkout from './intents/checkout.js';
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
  checkout
};
export default async function handleIntent(intentName, userInput = "") {
  const handler = intents[intentName] || intents["fallback"];
  return await handler(userInput); // Boleh async jika ada fetch
}
