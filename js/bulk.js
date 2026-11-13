/* ============================================================
   BULK.JS — Logika halaman Bulk Akun
============================================================ */

function updateBulkAmount(dir) {
  const input = document.getElementById("bulkAmount");
  const hint  = document.getElementById("bulkLimitHint");
  let val = parseInt(input.value) || 1;

  val += dir;
  if (val < 1)   val = 1;
  if (val > 100) val = 100;

  input.value = val;
  hint.textContent = `Memakai ${val} limit.`;
}

async function processBulk() {
  if (active === 'free') {
    toast("Menu Bulk khusus Plan Pro & VIP!");
    log("Akses Ditolak: Bulk Akun memerlukan Plan Pro / VIP.", "warn");
    return;
  }

  const amount = parseInt(document.getElementById("bulkAmount").value);
  const resultContainer = document.getElementById("bulkResult");
  const btn = document.getElementById("btnProcessBulk");

  if (amount > plans[active]) {
    toast(`Limit kamu tidak cukup! Sisa limit: ${plans[active]}`);
    log(`Gagal: Sisa limit (${plans[active]}) tidak cukup untuk generate ${amount} akun.`, "error");
    return;
  }

  setLoading(btn, true);
  resultContainer.style.display = "block";
  resultContainer.innerHTML =
    '<div style="text-align:center; font-size:12px; font-weight:600; opacity:0.7;">Memproses...</div>';

  try {
    const data = await bulkGenerate(amount);

    if (data.status && data.result && data.result.result) {
      const accounts = data.result.result;
      resultContainer.innerHTML = "";

      // Simpan ke Supabase (loop dengan await)
      for (let idx = 0; idx < accounts.length; idx++) {
        const acc = accounts[idx];

        // Insert ke Supabase (async)
        await saveToHistory(acc.email, acc.orderId, active, "bulk");

        const div = document.createElement("div");
        div.style.marginBottom  = "10px";
        div.style.paddingBottom = "10px";
        div.style.borderBottom  = idx < accounts.length - 1 ? "1px dashed #ccc" : "none";
        div.innerHTML = `
          <div style="font-weight:700; font-size:12px; color:var(--blue); margin-bottom:4px;">
            ${acc.type} (${acc.email})
          </div>
          <div style="font-size:11px; font-family:monospace; opacity:0.7; margin-bottom:4px;">
            Order: ${acc.orderId}
          </div>
          <a href="${acc.login_url}" target="_blank"
             style="font-size:11px; color:var(--green); text-decoration:underline; font-weight:700;">
            Buka Link Login
          </a>`;
        resultContainer.appendChild(div);
      }

      plans[active] -= amount;
      used += amount;
      saveState();
      renderPlans();

      toast(`Berhasil generate ${accounts.length} akun`);
      log(`Bulk sukses: ${accounts.length} akun digenerate. Limit terpotong ${amount}.`, "success");
    } else {
      resultContainer.innerHTML =
        '<div style="color:var(--red); font-size:12px; text-align:center; font-weight:700;">Gagal generate. Cek API.</div>';
      toast("Gagal generate akun");
    }
  } catch (err) {
    resultContainer.innerHTML =
      '<div style="color:var(--red); font-size:12px; text-align:center; font-weight:700;">Error jaringan.</div>';
    toast("Request gagal");
  } finally {
    setLoading(btn, false);
  }
}