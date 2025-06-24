// 📁 context.js
// Simpan state input user secara global (per sesi atau per user login)

export const context = {
  slug: null,
  stok: null,
  warna: null,
  qty: 1
};

export function updateContext(obj = {}) {
  Object.assign(context, obj);
}
