/* ============================================================
   CONFIG.JS — Semua konfigurasi & API key terpusat di sini
   Ubah BASE_URL, AM_API_KEY, SUPABASE_URL, dll sesuai kebutuhan.
============================================================ */

const CONFIG = {
  /* ----- API Base URLs ----- */
  BASE_URL: "https://api.izzxd.my.id",          // API utama (bulk, dll)
  AI_BASE_URL: "https://api.ikyyxd.my.id",       // API endpoint AI Chat

  /* ----- API Keys ----- */
  AM_API_KEY: "ayakasync",                        // API key untuk endpoint bulk
  AI_SESSION_ID: "Ayaka-Sync",                    // Session ID chat AI

  /* ----- SUPABASE (BARU) ----- */
  SUPABASE_URL: "https://mgvnfcaxxiekkiwilmyh.supabase.co",
  SUPABASE_SBP_KEY: "sb_publishable_DyRpOSMGh7-xilTyyQgusg_FwMn4sQV",
  // ↑ Ganti dengan URL & anon key dari Supabase Dashboard → Settings → API

  /* ----- Uptime Config (BARU) ----- */
  UPTIME_HEARTBEAT_INTERVAL: 60 * 1000,           // 60 detik
  UPTIME_FETCH_INTERVAL: 5 * 60 * 1000,           // 5 menit re-fetch

  /* ----- Alight Motion Internal API (Direct) ----- */
  ALIGHT: {
    ORDER_ID: "GPA",
    API_KEY: "",
    PRODUCT_ID: "am.full.sub.annual.19q4",
    TOKEN: "",
    SKU_TYPE: "subs",
    FIREBASE_INSTANCE_ID_TOKEN: "",
    HEADERS: {
      "Content-Type": "application/json",
      "X-Android-Package": "com.alightcreative.motion",
      "X-Android-Cert": "ECA6BF91B8715A6F810ED0BBFC65B6CD578F52A8",
      "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 15; 23127PN0CC Build/BP1A.250505.005)"
    }
  },

  /* ----- Storage Keys ----- */
  KEYS: {
    SESSION: "am_session",
    ACTIVE_EMAIL: "am_active_email",
    PLANS: "am_plans_v2",
    ACTIVE_PLAN: "am_active_plan",
    USED_COUNT: "am_used_count"
    // HISTORY: dihapus → sekarang pakai Supabase
  },

  /* ----- Plan Defaults ----- */
  DEFAULT_PLANS: { free: 20, pro: 1000, vip: 2000 },
  PLAN_LABEL: { free: "FREE", pro: "PRO", vip: "VIP" }
};