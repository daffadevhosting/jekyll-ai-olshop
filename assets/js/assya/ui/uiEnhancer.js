// 📁 ui/uiEnhancer.js

export function updateBadgeQty() {
  const badge = document.getElementById("badgeQty");
  if (!badge) return;
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const totalQty = keranjang.reduce((sum, item) => sum + (item.qty || 1), 0);

  badge.textContent = totalQty;
  badge.classList.toggle("hidden", totalQty === 0);
}

export function setupQuickSidebar() {
  const sidebarToggle = document.createElement("button");
  sidebarToggle.id = "sidebarToggle";
  sidebarToggle.className = "fixed bottom-4 left-4 sm:hidden z-50 bg-blue-700 text-white p-2 rounded-full shadow";
  sidebarToggle.innerHTML = "☰";

  const sidebar = document.createElement("div");
  sidebar.id = "quickSidebar";
  sidebar.className = "hidden sm:flex flex-col gap-2 fixed top-1/2 right-0 transform -translate-y-1/2 bg-white/90 backdrop-blur px-3 py-4 rounded-l-xl shadow-lg z-40";

  const buttons = [
    { label: "<i class=\"bi bi-grid-3x3\"></i>", cmd: "katalog", color: "bg-blue-600" },
    { label: "<i class=\"bi bi-cart\"></i>", cmd: "keranjang", color: "bg-gray-800", badge: true },
    { label: "<i class=\"bi bi-file-earmark-text\"></i>", cmd: "checkout", color: "bg-green-600" },
    { label: "<i class=\"bi bi-question-circle\"></i>", cmd: "tanya assya", color: "bg-orange-600" },
  ];

  buttons.forEach(btn => {
    const b = document.createElement("button");
    b.className = `${btn.color} text-white text-xl p-2 w-12 h-12 rounded-full shadow relative hover:opacity-90 transition`;
    b.onclick = () => {
      if (typeof window.chatTo === 'function') window.chatTo(btn.cmd);
      sidebar.classList.add("hidden");
    };

    if (btn.badge) {
      b.id = "keranjangBtn";
      b.innerHTML = `${btn.label}
        <span id="badgeQty" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 hidden">0</span>`;
    } else {
      b.innerHTML = btn.label;
    }

    sidebar.appendChild(b);
  });

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
  });

  document.body.appendChild(sidebar);
  document.body.appendChild(sidebarToggle);
}
