/* ============================================================
   MAIN.JS — Inisialisasi & event binding umum
============================================================ */

/* ----- Scroll Reveal IntersectionObserver ----- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add("in");
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

function observeReveals() {
  document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));
}

/* ----- Accordion FAQ ----- */
document.querySelectorAll(".acc-head").forEach(head => {
  head.addEventListener("click", () => {
    const acc = head.parentElement;
    const isOpen = acc.classList.contains("open");
    document.querySelectorAll(".accordion").forEach(a => a.classList.remove("open"));
    if (!isOpen) acc.classList.add("open");
  });
});

/* ----- Init Aplikasi ----- */
(async function init() {
  // 1) Init Supabase DULU sebelum semua
  initSupabase();

  // 2) Pre-fill order ID otomatis
  const autoOrderInput = document.getElementById("autoOrder");
  if (autoOrderInput) autoOrderInput.value = genOrderId();

  // 3) Render state plan (dari localStorage, karena per-user)
  renderPlans();

  // 4) Render riwayat dari Supabase (async)
  await renderHistory();

  // 5) Init uptime global dari Supabase
  await initUptime();

  // 6) Aktifkan reveal & ringkasan
  observeReveals();
  if (typeof updateSummary === "function") updateSummary();

  // 7) Cek sesi login
  checkLogin();

  // 8) Log startup
  log("Sistem menggunakan Direct API (Google Identity & AM Server).", "info");
  log("Database Supabase terhubung. Riwayat & uptime disinkronkan secara global.", "success");
})();