/* ============================================================
   NAVIGATION.JS — Sidebar, Tab, & Page Switch
============================================================ */

/* ----- Sidebar ----- */
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("sidebarOverlay").classList.toggle("active");
}

/* ----- Tab Switch (Aktivasi) ----- */
function switchTab(tab) {
  const tabSendBtn  = document.getElementById("tabSendBtn");
  const tabVerifBtn = document.getElementById("tabVerifBtn");
  const paneSend    = document.getElementById("paneSend");
  const paneVerif   = document.getElementById("paneVerif");

  if (tab === 'send') {
    tabSendBtn.classList.add('active');
    tabVerifBtn.classList.remove('active');
    paneSend.classList.add('active');
    paneVerif.classList.remove('active');
  } else {
    tabVerifBtn.classList.add('active');
    tabSendBtn.classList.remove('active');
    paneVerif.classList.add('active');
    paneSend.classList.remove('active');
  }
}

/* ----- Page Navigation ----- */
function goTo(id) {
  // Cek proteksi login untuk halaman tertentu
  if ((id === 'aktivasi' || id === 'riwayat' || id === 'dashboard' || id === 'bulk') && !isLoggedIn()) {
    requireLogin(id);
    return;
  }

  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === id));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.target === id));
  document.querySelectorAll(".side-link").forEach(link => {
    link.classList.toggle("active", link.dataset.target === id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  const activePage = document.getElementById(id);
  if (!activePage) return;

  activePage.querySelectorAll(".reveal").forEach(el => el.classList.remove("in"));
  requestAnimationFrame(() => {
    activePage.querySelectorAll(".reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("in"), 60 + i * 70);
    });
  });
}

/* ----- Bind Nav Buttons ----- */
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => goTo(btn.dataset.target));
});