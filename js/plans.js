/* ============================================================
   PLANS.JS — Modal QR & Konfirmasi Pembayaran
============================================================ */

const qrModal = document.getElementById("qrModal");
const modalTitle = document.getElementById("modalTitle");
let selectedPlanToBuy = null;

function openQRModal(planCode, planName, price) {
  selectedPlanToBuy = planCode;
  modalTitle.innerHTML = `Beli Plan <br><span style="color:var(--blue)">${planName} - Rp ${price}</span>`;
  qrModal.classList.add("show");
}

function closeQRModal() {
  qrModal.classList.remove("show");
  selectedPlanToBuy = null;
}

function confirmPayment() {
  if (selectedPlanToBuy) {
    setPlan(selectedPlanToBuy);
    closeQRModal();
    toast("Pembayaran dikonfirmasi, Plan aktif!");
  }
}

/* ----- Bind Modal Events ----- */
document.getElementById("closeModal").addEventListener("click", closeQRModal);
qrModal.addEventListener("click", (e) => {
  if (e.target === qrModal) closeQRModal();
});