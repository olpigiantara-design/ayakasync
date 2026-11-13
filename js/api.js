/* ============================================================
   API.JS — Semua interaksi dengan Alight Motion & API eksternal
============================================================ */

const AlightMotionAuth = {
  /* --- Generate kode order acak 5 digit --- */
  generateCodeOrder: function () {
    return Math.floor(10000 + Math.random() * 90000).toString();
  },

  /* --- Ekstrak oobCode dari link verifikasi --- */
  extractOobCode: function (fullUrl) {
    if (!fullUrl) return null;
    try {
      let cleanUrl = fullUrl.replace(/&amp;/g, '&');
      try { cleanUrl = decodeURIComponent(cleanUrl); } catch (e) {}

      try {
        const urlObj = new URL(cleanUrl);
        let oobCode = urlObj.searchParams.get('oobCode');
        if (!oobCode) {
          const nestedLink = urlObj.searchParams.get('link')
                          || urlObj.searchParams.get('q')
                          || urlObj.searchParams.get('url');
          if (nestedLink) {
            try {
              const innerUrlObj = new URL(nestedLink);
              oobCode = innerUrlObj.searchParams.get('oobCode');
            } catch (e) {}
          }
        }
        if (oobCode) return oobCode.replace(/[^a-zA-Z0-9_-]/g, '');
      } catch (e) {}

      const match = cleanUrl.match(/[?&]oobCode=([a-zA-Z0-9_-]+)/i)
                 || cleanUrl.match(/oobCode=([a-zA-Z0-9_-]+)/i);
      if (match && match[1]) return match[1];
      return null;
    } catch (e) {
      return null;
    }
  },

  /* --- Kirim Magic Link --- */
  sendMagicLink: async function (email) {
    try {
      const A = CONFIG.ALIGHT;

      let res1 = await fetch(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/createAuthUri?key=${A.API_KEY}`,
        {
          method: "POST",
          headers: A.HEADERS,
          body: JSON.stringify({ identifier: email, continueUri: "http://localhost" })
        }
      );
      if (!res1.ok) throw new Error(await res1.text());

      let res2 = await fetch(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=${A.API_KEY}`,
        {
          method: "POST",
          headers: A.HEADERS,
          body: JSON.stringify({
            requestType: 6,
            email: email,
            androidInstallApp: true,
            canHandleCodeInApp: true,
            continueUrl: "https://alightcreative.com?ui_sid=0366624874&ui_sd=0",
            iosBundleId: "com.alightcreative.motion",
            androidPackageName: "com.alightcreative.motion",
            androidMinimumVersion: "585",
            clientType: "CLIENT_TYPE_ANDROID"
          })
        }
      );
      if (!res2.ok) throw new Error(await res2.text());

      return { success: true, message: "Link berhasil dikirim." };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /* --- Verifikasi Link & Ambil Profile --- */
  verifyAndFetchProfile: async function (email, rawLink) {
    try {
      const A = CONFIG.ALIGHT;
      const oobCode = this.extractOobCode(rawLink);
      if (!oobCode) throw new Error("Gagal mengekstrak oobCode.");

      let res1 = await fetch(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/emailLinkSignin?key=${A.API_KEY}`,
        {
          method: "POST",
          headers: A.HEADERS,
          body: JSON.stringify({
            email: email,
            oobCode: oobCode,
            clientType: "CLIENT_TYPE_ANDROID"
          })
        }
      );
      if (!res1.ok) throw new Error(await res1.text());
      let signinData = await res1.json();

      let res2 = await fetch(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${A.API_KEY}`,
        {
          method: "POST",
          headers: A.HEADERS,
          body: JSON.stringify({ idToken: signinData.idToken })
        }
      );
      if (!res2.ok) throw new Error(await res2.text());
      let accountData = await res2.json();

      return { success: true, idToken: signinData.idToken, user: accountData.users[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /* --- Apply Premium --- */
  applyPremium: async function (idToken) {
    try {
      const A = CONFIG.ALIGHT;
      const codeorder = this.generateCodeOrder();
      const url = 'https://us-central1-alight-creative.cloudfunctions.net/verifyPurchase';
      const headers = {
        "authorization": "Bearer " + idToken,
        "firebase-instance-id-token": A.FIREBASE_INSTANCE_ID_TOKEN,
        "content-type": "application/json; charset=utf-8",
        "accept-encoding": "gzip",
        "user-agent": "okhttp/3.12.1"
      };

      let res = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          data: {
            productId: A.PRODUCT_ID,
            token: A.TOKEN,
            skuType: A.SKU_TYPE,
            orderId: A.ORDER_ID + "-" + codeorder
          }
        })
      });
      if (!res.ok) throw new Error(await res.text());
      let data = await res.json();
      return { success: true, data: data, codeorder: codeorder };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

/* ============================================================
   BULK API
============================================================ */
async function bulkGenerate(amount) {
  const url = `${CONFIG.BASE_URL}/api/am/bulk?amount=${amount}&apikey=${CONFIG.AM_API_KEY}`;
  const res = await fetch(url);
  return res.json();
}

/* ============================================================
   AI CHAT API
============================================================ */
async function chatWithAi(fullPrompt) {
  const url = `${CONFIG.AI_BASE_URL}/ai/gemini?text=${encodeURIComponent(fullPrompt)}&sessionsId=${CONFIG.AI_SESSION_ID}`;
  const res = await fetch(url);
  return res.json();
}