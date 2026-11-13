/* ============================================================
   UI.JS — Toast, Loading, dan helper UI umum
============================================================ */

let toastTimer = null;

function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
}

function setLoading(btn, on) {
  if (!btn) return;
  btn.classList.toggle("loading", on);
  btn.disabled = on;
}

/* ============================================================
   MASK EMAIL — Sensor email untuk riwayat
============================================================ */
function maskEmail(email) {
  if (!email) return "—";
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const name = parts[0];
  const domain = parts[1];
  if (name.length <= 2) return name[0] + '***@' + domain;
  return name.substring(0, 2) + '***@' + domain;
}