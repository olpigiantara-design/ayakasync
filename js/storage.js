/* ============================================================
   STORAGE.JS — Helper untuk localStorage & session
============================================================ */

const Store = {
  get(k, def) {
    try {
      const v = localStorage.getItem(k);
      return v === null ? def : JSON.parse(v);
    } catch (e) { return def; }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  },
  remove(k) {
    try { localStorage.removeItem(k); } catch (e) {}
  }
};

/* ============================================================
   SESSION HELPERS
============================================================ */
function getSession() {
  const raw = localStorage.getItem(CONFIG.KEYS.SESSION);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

function setSession(data) {
  localStorage.setItem(CONFIG.KEYS.SESSION, JSON.stringify(data));
}

function clearSession() {
  localStorage.removeItem(CONFIG.KEYS.SESSION);
}

function isLoggedIn() {
  return !!localStorage.getItem(CONFIG.KEYS.SESSION);
}