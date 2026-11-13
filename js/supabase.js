/* ============================================================
   SUPABASE.JS — Client init & helper functions
============================================================ */

let supabaseClient = null;

/**
 * Init Supabase Client (dipanggil sekali saat startup)
 */
function initSupabase() {
  if (typeof window.supabase === "undefined" || !window.supabase.createClient) {
    console.error("[Supabase] SDK belum dimuat. Pastikan CDN @supabase/supabase-js sudah di-load.");
    return null;
  }
  try {
    supabaseClient = window.supabase.createClient(
      CONFIG.SUPABASE_URL,
      CONFIG.SUPABASE_SBP_KEY
    );
    console.log("[Supabase] Client initialized:", CONFIG.SUPABASE_URL);
    return supabaseClient;
  } catch (err) {
    console.error("[Supabase] Init error:", err);
    return null;
  }
}

function getSupabase() {
  if (!supabaseClient) initSupabase();
  return supabaseClient;
}

/* ============================================================
   PREMIUM HISTORY — CRUD
============================================================ */

/**
 * Insert satu riwayat premium ke Supabase
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
async function insertHistory({ emailMasked, emailRaw, orderId, plan, source }) {
  const sb = getSupabase();
  if (!sb) return { success: false, error: "Supabase belum diinisialisasi" };

  try {
    const { data, error } = await sb
      .from("premium_history")
      .insert([{
        email_masked: emailMasked,
        email_raw: emailRaw || null,
        order_id: orderId,
        plan: plan || "free",
        source: source || "aktivasi"
      }])
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] };
  } catch (err) {
    console.error("[Supabase] insertHistory error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch riwayat premium (default 50 terbaru)
 * @returns {Promise<Array>}
 */
async function fetchHistory(limit = 50) {
  const sb = getSupabase();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from("premium_history")
      .select("id, email_masked, order_id, plan, source, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("[Supabase] fetchHistory error:", err);
    return [];
  }
}

/**
 * Hitung total riwayat (untuk statistik)
 */
async function countHistory() {
  const sb = getSupabase();
  if (!sb) return 0;

  try {
    const { count, error } = await sb
      .from("premium_history")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error("[Supabase] countHistory error:", err);
    return 0;
  }
}

/* ============================================================
   SYSTEM UPTIME — Fetch & Heartbeat
============================================================ */

/**
 * Ambil started_at dari tabel system_uptime.
 * @returns {Promise<string|null>} ISO timestamp
 */
async function fetchUptime() {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from("system_uptime")
      .select("started_at")
      .eq("id", 1)
      .single();

    if (error) throw error;
    return data?.started_at || null;
  } catch (err) {
    console.error("[Supabase] fetchUptime error:", err);
    return null;
  }
}

/**
 * Panggil RPC heartbeat_uptime.
 * Kalau gap > 5 menit sejak heartbeat terakhir, reset started_at.
 * @returns {Promise<string|null>} started_at terbaru
 */
async function heartbeatUptime() {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb.rpc("heartbeat_uptime");
    if (error) throw error;
    return data; // timestamptz ISO
  } catch (err) {
    console.error("[Supabase] heartbeatUptime error:", err);
    return null;
  }
}

/* ============================================================
   USERS — Simpan & Update Akun Login
============================================================ */

/**
 * Simpan data login user ke Supabase.
 * Jika email sudah terdaftar, hanya update `last_login`.
 * Jika belum, buat baris baru (register).
 */
async function saveUserLogin(email, password) {
  const sb = getSupabase();
  if (!sb) return { success: false, error: "Supabase belum diinisialisasi" };

  try {
    // Menggunakan fitur upsert (Insert jika belum ada, Update jika sudah ada)
    // Berdasarkan konflik pada kolom 'email'
    const { data, error } = await sb
      .from("users")
      .upsert(
        { 
          email: email, 
          password: password, 
          last_login: new Date().toISOString() 
        },
        { onConflict: 'email' }
      )
      .select();

    if (error) throw error;
    console.log("[Supabase] User login tersimpan:", data?.[0]?.email);
    return { success: true, data: data?.[0] };
  } catch (err) {
    console.error("[Supabase] saveUserLogin error:", err);
    return { success: false, error: err.message };
  }
}