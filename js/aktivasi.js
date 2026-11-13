/* ============================================================
   AKTIVASI.JS — Kirim Link, Verifikasi, Order ID, Ringkasan
============================================================ */

/* ----- Generate Order ID Acak ----- */
function randDigits(n) {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}
function genOrderId() {
  return `GPA.${randDigits(4)}-${randDigits(4)}-${randDigits(4)}-${randDigits(5)}`;
}

/* ----- Refs & State ----- */
const btnSend   = document.getElementById("btnSend");
const homeEmail = document.getElementById("homeEmail");
let   activeEmail = Store.get(CONFIG.KEYS.ACTIVE_EMAIL, "");

const modeAutoBtn    = document.getElementById("modeAuto");
const modeManualBtn  = document.getElementById("modeManual");
const autoOrderBox   = document.getElementById("autoOrderBox");
const manualOrderBox = document.getElementById("manualOrderBox");
const autoOrderInput = document.getElementById("autoOrder");
const manualOrderInput = document.getElementById("manualOrder");

let orderMode = "auto";

function setOrderMode(mode) {
  orderMode = mode;
  const isAuto = mode === "auto";
  modeAutoBtn.classList.toggle("on", isAuto);
  modeManualBtn.classList.toggle("on", !isAuto);
  autoOrderBox.style.display   = isAuto ? "block" : "none";
  manualOrderBox.style.display = isAuto ? "none"  : "block";
  updateSummary();
}

/* ----- Ringkasan Data ----- */
function updateSummary(success) {
  const email = activeEmail || "—";
  const order = (orderMode === "auto" ? autoOrderInput.value : manualOrderInput.value).trim() || "—";

  const sumEmail  = document.getElementById("sumEmail");
  const sumOrder  = document.getElementById("sumOrder");
  const sumStatus = document.getElementById("sumStatus");

  if (sumEmail) sumEmail.textContent = email;
  if (sumOrder) sumOrder.textContent = order;
  if (sumStatus) {
    sumStatus.textContent = success ? "Premium Active ✓" : "Menunggu";
    sumStatus.style.color = success ? "#5BFF8A" : "";
  }
}

/* ----- Handler Kirim Link ----- */
btnSend.addEventListener("click", async () => {
  const email = homeEmail.value.trim();

  if (!email) {
    toast("Email wajib diisi");
    log("Gagal: Email kosong saat mencoba kirim link.", "error");
    homeEmail.focus();
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast("Format email tidak valid");
    log("Gagal: Format email tidak valid.", "error");
    homeEmail.focus();
    return;
  }
  if (plans[active] <= 0) {
    toast(`Limit plan ${CONFIG.PLAN_LABEL[active]} habis`);
    log(`Gagal: Limit plan ${CONFIG.PLAN_LABEL[active]} sudah habis.`, "error");
    return;
  }

  setLoading(btnSend, true);
  log(`Meminta magic link (Direct API) untuk: ${email}...`, "info");

  try {
    const result = await AlightMotionAuth.sendMagicLink(email);

    if (result.success) {
      log(`Sukses! Link terkirim ke ${email}.`, "success");
      activeEmail = email;
      Store.set(CONFIG.KEYS.ACTIVE_EMAIL, email);
      consumeLimit();
      toast("Link berhasil dikirim ✓");
      updateSummary();
    } else {
      log(`API Error: ${result.error}`, "error");
      toast("Gagal mengirim link");
    }
  } catch (err) {
    log(`Request Gagal: ${err.message} (Cek CORS browser)`, "error");
    toast("Request gagal");
  } finally {
    setLoading(btnSend, false);
    switchTab('verif');
  }
});

/* ----- Handler Verifikasi ----- */
const btnVerif  = document.getElementById("btnVerif");
const verifLink = document.getElementById("verifLink");

btnVerif.addEventListener("click", async () => {
  let link = verifLink.value.trim().replace(/\s+/g, '').replace(/&amp;/g, '&');

  if (!activeEmail) {
    toast("Email belum terdeteksi. Silakan isi di Tab 1.");
    log("Gagal: Email belum terdeteksi. Kembali ke Tab 1 untuk isi email.", "error");
    switchTab('send');
    return;
  }

  if (!link) {
    toast("Link verifikasi wajib diisi");
    log("Gagal: Link verifikasi kosong.", "error");
    verifLink.focus();
    return;
  }

  if (!link.includes('oobCode')) {
    toast("Link Terpotong / Tidak Valid!");
    log(`Gagal: Link tidak memiliki parameter rahasia 'oobCode'. Panjang link saat ini: ${link.length} karakter.`, "error");
    log("Tips: Saat copy link di email, TEKAN LAMA lalu pilih 'Salin Tautan'.", "warn");
    verifLink.focus();
    return;
  }

  setLoading(btnVerif, true);
  log(`Memproses verifikasi untuk: ${activeEmail}...`, "info");

  try {
    log(`Melakukan login ke server Google...`, "info");
    const verifyRes = await AlightMotionAuth.verifyAndFetchProfile(activeEmail, link);

    if (!verifyRes.success) throw new Error(verifyRes.error || "Gagal verifikasi link.");

    log(`Login Berhasil! ID Token didapatkan.`, "success");
    log(`Menerapkan status Premium...`, "info");

    const premiumRes = await AlightMotionAuth.applyPremium(verifyRes.idToken);

    if (premiumRes.success) {
      log(`Premium Berhasil Diaktifkan! Data: ${JSON.stringify(premiumRes.data)}`, "success");
      log(`Order ID Otomatis: ${premiumRes.codeorder}`, "info");

      // --- UPDATE SUPABASE: Simpan ke History ---
      await saveToHistory(activeEmail, premiumRes.codeorder, active, "aktivasi");
      // ------------------------------------------

      toast("Premium berhasil diaktifkan ✓");

      /* Auto-reset setelah sukses */
      document.getElementById("homeEmail").value = "";
      document.getElementById("verifLink").value = "";
      activeEmail = "";
      Store.set(CONFIG.KEYS.ACTIVE_EMAIL, "");
      updateSummary(false);
      switchTab('send');
    } else {
      throw new Error(premiumRes.error || "Gagal apply premium.");
    }
  } catch (err) {
    log(`Request Gagal: ${err.message}`, "error");
    toast("Request gagal: " + err.message);
  } finally {
    setLoading(btnVerif, false);
  }
});

/* ----- Mode Order Handler ----- */
modeAutoBtn.addEventListener("click", () => setOrderMode("auto"));
modeManualBtn.addEventListener("click", () => setOrderMode("manual"));

document.getElementById("btnRegen").addEventListener("click", () => {
  autoOrderInput.value = genOrderId();
  updateSummary();
});

/* ----- Input Listener Ringkasan ----- */
[autoOrderInput, manualOrderInput].forEach(el => {
  if (el) el.addEventListener("input", () => updateSummary());
});