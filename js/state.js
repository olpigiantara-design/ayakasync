/* ============================================================
   STATE.JS — State plan, statistik, dan riwayat (Supabase)
============================================================ */

/* ----- State Plan ----- */
let plans  = Store.get(CONFIG.KEYS.PLANS, { ...CONFIG.DEFAULT_PLANS });
let active = Store.get(CONFIG.KEYS.ACTIVE_PLAN, "free");
let used   = Store.get(CONFIG.KEYS.USED_COUNT, 0);

if (!plans || typeof plans !== "object") plans = { ...CONFIG.DEFAULT_PLANS };
Object.keys(CONFIG.DEFAULT_PLANS).forEach(k => {
  if (typeof plans[k] !== "number") plans[k] = CONFIG.DEFAULT_PLANS[k];
});
if (!CONFIG.PLAN_LABEL[active]) active = "free";

/* ----- Persist Plan State (masih local, karena ini per-user) ----- */
function saveState() {
  Store.set(CONFIG.KEYS.PLANS, plans);
  Store.set(CONFIG.KEYS.ACTIVE_PLAN, active);
  Store.set(CONFIG.KEYS.USED_COUNT, used);
}

/* ----- Render Plan UI ----- */
function renderPlans() {
  document.querySelectorAll("[data-limit]").forEach(el => {
    el.textContent = plans[el.dataset.limit];
  });

  document.querySelectorAll(".plan-card").forEach(card => {
    card.classList.toggle("active", card.dataset.plan === active);
  });

  const elPlan = document.getElementById("statPlan");
  const elUsed = document.getElementById("statUsed");
  const elLeft = document.getElementById("statLeft");
  if (elPlan) elPlan.textContent = CONFIG.PLAN_LABEL[active];
  if (elUsed) elUsed.textContent = used;
  if (elLeft) elLeft.textContent = plans[active];

  const sumPlan = document.getElementById("sumPlan");
  if (sumPlan) sumPlan.textContent = CONFIG.PLAN_LABEL[active];

  const profPlan  = document.getElementById("profPlan");
  const profLimit = document.getElementById("profLimit");
  if (profPlan)  profPlan.textContent  = CONFIG.PLAN_LABEL[active];
  if (profLimit) profLimit.textContent = plans[active];
}

function setPlan(p) {
  if (!CONFIG.PLAN_LABEL[p]) return;
  active = p;
  saveState();
  renderPlans();
  toast(`Plan ${CONFIG.PLAN_LABEL[p]} diaktifkan`);
}

function consumeLimit() {
  if (plans[active] > 0) plans[active] -= 1;
  used += 1;
  saveState();
  renderPlans();
}

function resetStats() {
  if (!confirm("Reset semua statistik & limit ke default?")) return;
  plans  = { ...CONFIG.DEFAULT_PLANS };
  active = "free";
  used   = 0;
  saveState();
  renderPlans();
  toast("Statistik direset");
}

/* ============================================================
   RIWAYAT (HISTORY) — Supabase
============================================================ */

/**
 * Simpan riwayat ke Supabase lalu refresh tampilan.
 * @param {string} email
 * @param {string} orderId
 * @param {string} plan  - 'free' | 'pro' | 'vip'
 * @param {string} source - 'aktivasi' | 'bulk'
 */
async function saveToHistory(email, orderId, plan = "free", source = "aktivasi") {
  const res = await insertHistory({
    emailMasked: maskEmail(email),
    emailRaw:    email,
    orderId:     orderId,
    plan:        plan,
    source:      source
  });

  if (!res.success) {
    console.warn("[History] Gagal simpan:", res.error);
    // Fallback: tetap tampilkan di UI sementara? Tidak wajib.
  }
  await renderHistory();
}

/**
 * Render riwayat dari Supabase.
 */
async function renderHistory() {
  const container = document.getElementById("historyList");
  if (!container) return;

  container.innerHTML = `
    <div style="text-align:center; font-size:12px; font-weight:600; opacity:0.5; padding:20px 0;">
      ⏳ Memuat riwayat dari server...
    </div>`;

  const history = await fetchHistory(50);

  if (!history || history.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; font-size:12px; font-weight:600; opacity:0.5; padding:20px 0;">
        Belum ada riwayat aktivasi.
      </div>`;
    return;
  }

  container.innerHTML = history.map(item => `
    <div class="history-item">
      <div>
        <div class="h-email">${item.email_masked || "—"}</div>
        <div class="h-order">Order: ${item.order_id || "—"}</div>
        <div style="font-size:10px; opacity:0.6; margin-top:2px; font-weight:700; text-transform:uppercase;">
          ${item.source || "aktivasi"} • ${(item.plan || "free").toUpperCase()}
        </div>
      </div>
      <div class="h-date">${formatDate(item.created_at)}</div>
    </div>
  `).join("");
}

/* Helper format tanggal */
function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day:   "2-digit",
      month: "short",
      year:  "2-digit",
      hour:  "2-digit",
      minute:"2-digit"
    });
  } catch (e) {
    return iso;
  }
}