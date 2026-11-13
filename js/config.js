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
  SUPABASE_URL: "https://xxxxxxxxxxxxxxxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxx",
  // ↑ Ganti dengan URL & anon key dari Supabase Dashboard → Settings → API

  /* ----- Uptime Config (BARU) ----- */
  UPTIME_HEARTBEAT_INTERVAL: 60 * 1000,           // 60 detik
  UPTIME_FETCH_INTERVAL: 5 * 60 * 1000,           // 5 menit re-fetch

  /* ----- Alight Motion Internal API (Direct) ----- */
  ALIGHT: {
    ORDER_ID: "GPA",
    API_KEY: "AIzaSyDtG1AU22ErnQZ60AzBAcaknySiz9_CEq0",
    PRODUCT_ID: "am.full.sub.annual.19q4",
    TOKEN: "mmgaobamlahbbeccfplmbkbb.AO-J1OzqG0or_GJJIx-ms8GrTm-jaglCRfhQSRPUZKpl2YspYS-oN7_94uv8RC5vQbvd_Ios2pPDStZ2n7F0hLE3FiOU7HS3R6Fquulv5xLXFECSv4ctElw",
    SKU_TYPE: "subs",
    FIREBASE_INSTANCE_ID_TOKEN: "cSDnCyp3T-uwp07z3tL86T:APA91bFkmvvsHw5nnqa1SBFci-99DRsKClLiETdRrVcJjS5yBx1v_FbCb1d8WhBuea_zmwnYBktyTIzcRhN4b6uNOUur9wPc0gKXmJDoZic0LhNq5V2s0xI",
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