/* ============================================================
   CHAT.JS — Chat AI Ayaka
============================================================ */

const chatMessages = document.getElementById("chatMessages");
const chatInput    = document.getElementById("chatInput");
const btnSendChat  = document.getElementById("btnSendChat");

const SYSTEM_PROMPT = `Halo, ada yang bisa Ayaka bantu hari ini?  Kamu adalah Ayaka, asisten resmi dari Ayaka Sync. Tugas kamu adalah membantu user untuk aktivasi akun ke premium.  Cara kamu bantu: 1. Kalau user mau aktivasi, minta email aktifnya. 2. Jelaskan kalau kita akan kirim magic link ke email tersebut. 3. Kalau user tanya soal premium, jelaskan benefitnya: tanpa watermark, export 4K 60FPS, semua efek terbuka, dan semua fitur premium aktif. 4. Kalau user bilang link tidak masuk, suruh cek spam / folder promosi, atau tawarkan kirim ulang link. 5. Kalau user tanya harga, tanya dulu mau paket yang mana, lalu arahkan ke halaman aktivasi. 6. Kalau user ada masalah aktivasi, tanya email dan kode aktivasi yang dia pakai, lalu bantu cek statusnya.  Gaya bicara kamu: - Pakai Bahasa Indonesia yang santai, ramah, dan simpel. - Panggil user dengan sebutan "kang" atau "kak" sesuai cara user manggil kamu. - Jawaban singkat, jelas, tidak bertele-tele. - Jangan pernah minta password, OTP, atau kata sandi Google user. - Kalau tidak tahu jawaban, bilang jujur dan arahkan ke admin Ayaka Sync.  Contoh pembuka kamu: "Halo, ada yang bisa Ayaka bantu hari ini? Mau aktivasi akun ke premium, cek status, atau ada kendala?"`;

function appendChat(role, text) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}

async function sendChat() {
  const text = chatInput.value.trim();
  if (!text) return;

  appendChat("user", text);
  chatInput.value = "";
  btnSendChat.disabled = true;

  const loadingBubble = appendChat("ai loading", "Ayaka sedang mengetik...");

  try {
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${text}\nAyaka:`;
    const data = await chatWithAi(fullPrompt);

    loadingBubble.remove();

    if (data.status && data.result) {
      appendChat("ai", data.result);
    } else {
      appendChat("ai", "Maaf kak, Ayaka lagi ada kendala koneksi. Coba lagi nanti atau hubungi admin ya.");
    }
  } catch (err) {
    loadingBubble.remove();
    appendChat("ai", "Terjadi kesalahan jaringan. Pastikan internet lancar dan coba lagi ya kak.");
    console.error(err);
  } finally {
    btnSendChat.disabled = false;
    chatInput.focus();
  }
}