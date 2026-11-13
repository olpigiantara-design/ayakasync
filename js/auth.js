/* ============================================================
   AUTH.JS — Login, Logout, & Cek Session
============================================================ */

function checkLogin() {
  const session = getSession();

  if (session) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("mainApp").classList.add("logged-in");
    goTo('dashboard');
    updateProfileUI(session.email, session.loginAt);
  } else {
    document.getElementById("loginScreen").style.display = "flex";
    document.getElementById("mainApp").classList.remove("logged-in");
  }
}

function doLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const pass  = document.getElementById("loginPassword").value.trim();

  if (!email || !pass) {
    toast("Email dan Password wajib diisi!");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast("Format email tidak valid!");
    return;
  }

  setSession({ email: email, loginAt: Date.now() });
  checkLogin();
  document.getElementById("successModal").classList.add("show");
}

function doLogout() {
  if (!confirm("Yakin ingin logout?")) return;
  clearSession();
  document.getElementById("mainApp").classList.remove("logged-in");
  document.getElementById("loginScreen").style.display = "flex";
  toast("Logout berhasil");
}

function closeSuccessModal() {
  document.getElementById("successModal").classList.remove("show");
}

function updateProfileUI(email, loginAt) {
  const profEmail = document.getElementById("profEmail");
  const profTime  = document.getElementById("profTime");
  if (profEmail) profEmail.textContent = email || "—";
  if (profTime)  profTime.textContent  = loginAt ? new Date(loginAt).toLocaleString('id-ID') : "—";
}

function requireLogin(targetPage) {
  if (isLoggedIn()) {
    goTo(targetPage);
  } else {
    document.getElementById("mainApp").classList.remove("logged-in");
    document.getElementById("loginScreen").style.display = "flex";
    toast("Silakan login terlebih dahulu!");
  }
}