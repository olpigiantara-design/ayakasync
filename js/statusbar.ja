/* ============================================================
   STATUSBAR.JS — Clock, Uptime (Supabase), Battery
============================================================ */

/* ----- Clock & Date ----- */
function updateStatusBar() {
  const now = new Date();
  const timeEl = document.getElementById("sb-time");
  const dateEl = document.getElementById("sb-date");
  if (timeEl) timeEl.textContent = now.toLocaleTimeString("id-ID", { hour12: false });
  if (dateEl) dateEl.textContent = now.toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric"
  });
}
setInterval(updateStatusBar, 1000);
updateStatusBar();

/* ============================================================
   GLOBAL UPTIME — dari Supabase (system_uptime.started_at)
============================================================ */
let globalStartedAt = null;      // timestamp (ms) awal sistem hidup
let uptimeSynced   = false;

/**
 * Init: fetch started_at dari Supabase.
 */
async function initUptime() {
  const started = await fetchUptime();
  if (started) {
    globalStartedAt = new Date(started).getTime();
    uptimeSynced = true;
    console.log("[Uptime] Synced from Supabase:", started);
  } else {
    // Fallback sementara (akan otomatis tersinkron setelah heartbeat pertama)
    globalStartedAt = Date.now();
    console.warn("[Uptime] Fetch gagal, pakai fallback lokal sementara.");
  }
  tickUptime();
}

/**
 * Hitung & tampilkan uptime (dipanggil tiap detik).
 */
function tickUptime() {
  const el = document.getElementById("sb-uptime");
  if (!el) return;

  if (!globalStartedAt) {
    el.textContent = "--:--:--";
    return;
  }

  const diff = Math.floor((Date.now() - globalStartedAt) / 1000);
  if (diff < 0) { el.textContent = "00:00:00"; return; }

  const d = Math.floor(diff / 86400);
  const h = Math.floor((diff % 86400) / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;

  const pad = n => String(n).padStart(2, "0");
  el.textContent = d > 0
    ? `${d}h ${pad(h)}:${pad(m)}:${pad(s)}`
    : `${pad(h)}:${pad(m)}:${pad(s)}`;
}
setInterval(tickUptime, 1000);

/**
 * Heartbeat: dipanggil tiap 60 detik.
 * Kalau gap > 5 menit, Supabase reset started_at → sinkron lagi.
 */
async function uptimeHeartbeat() {
  const started = await heartbeatUptime();
  if (started) {
    const ts = new Date(started).getTime();
    if (!globalStartedAt || Math.abs(ts - globalStartedAt) > 3000) {
      // Berubah signifikan → update
      globalStartedAt = ts;
      uptimeSynced = true;
      console.log("[Uptime] Heartbeat updated started_at:", started);
    }
  }
}

setInterval(uptimeHeartbeat, CONFIG.UPTIME_HEARTBEAT_INTERVAL);

/**
 * Re-fetch berkala (antisipasi clock drift / reset admin).
 */
setInterval(async () => {
  const started = await fetchUptime();
  if (started) {
    globalStartedAt = new Date(started).getTime();
  }
}, CONFIG.UPTIME_FETCH_INTERVAL);

/* ----- Battery ----- */
if (navigator.getBattery) {
  navigator.getBattery().then(battery => {
    function updateBattery() {
      const level = Math.round(battery.level * 100);
      const charging = battery.charging ? "⚡" : "🔋";
      const el = document.getElementById("sb-battery");
      if (el) el.textContent = `${charging} ${level}%`;
    }
    updateBattery();
    battery.addEventListener("levelchange", updateBattery);
    battery.addEventListener("chargingchange", updateBattery);
  });
} else {
  const el = document.getElementById("sb-battery");
  if (el) el.textContent = "🔋 100%";
}