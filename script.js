// ==============================
// Safe Helpers
// ==============================
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ==============================
// 1. Header / Mobile Menu Logic
// ==============================
(function () {
  const toggle = document.querySelector(".header__toggle");
  const nav = document.querySelector(".header__nav");
  const body = document.body;

  if (!toggle || !nav) return;

  const toggleMenu = () => {
    const isOpen = nav.classList.contains("is-open");
    if (isOpen) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      body.style.overflow = ""; // ロック解除
    } else {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      body.style.overflow = "hidden"; // スクロールロック
    }
  };

  toggle.addEventListener("click", toggleMenu);

  // リンククリックで閉じる
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("is-open")) {
        toggleMenu();
      }
    });
  });
})();

// ==============================
// 2. FAQ Accordion
// ==============================
(function () {
  const toggles = document.querySelectorAll('.faq__q');
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const answer = toggle.nextElementSibling;
      if (!answer) return;
      toggle.setAttribute('aria-expanded', !isExpanded);
      answer.hidden = isExpanded;
    });
  });
})();

// ==============================
// 3. GA4 Event Tracking
// ==============================
(function () {
  const PAGE_ID = document.body?.dataset?.pageId || "";

  const inferLoc = (el) => {
    const sec = el.closest("[data-section], section, main, header, footer");
    if (!sec) return window.location.pathname || "";
    return sec.getAttribute("data-section") || sec.id || sec.className || window.location.pathname || "";
  };

  const inferLabel = (el) => {
    return (
      el.dataset.eventLabel ||
      el.dataset.label ||
      el.getAttribute("aria-label") ||
      el.getAttribute("href") ||
      (el.textContent || "").trim().slice(0, 60) ||
      window.location.pathname
    );
  };

  const track = (name, el) => {
    if (typeof gtag !== "function" || !name) return;
    const label = inferLabel(el);
    const loc = el.dataset.eventLoc || inferLoc(el);
    gtag("event", name, {
      event_category: "lp",
      event_label: label,
      event_loc: loc,
      page_id: PAGE_ID,
    });
  };

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-event], a, button");
    if (!el) return;
    
    // 1) 明示イベント
    const name = el.dataset && el.dataset.event;
    if (name) track(name, el);

    // 2) 自動付与
    const href = (el.getAttribute && el.getAttribute("href")) || "";
    if (href.startsWith("tel:")) track("click_tel", el);
    if (/line\.me|lin\.ee/i.test(href)) track("click_line", el);
  });
})();

// ==============================
// 4. Contact Form Logic (Full)
// ==============================
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;
  if (form.dataset.bound === "1") return;
  form.dataset.bound = "1";

  // ▼ GAS URL（プレースホルダー）
  const scriptURL = "https://script.google.com/macros/s/XXXXXXXX/exec"; 
  const thanksPage = "thanks.html"; 
  const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

  const TIMEOUT_MS = 15000;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn ? submitBtn.textContent : "送信する";

  // GA4 Client ID 取得ロジック
  const readGaClientIdFromCookie = () => {
    try {
      const m = document.cookie.match(/(?:^|; )_ga=([^;]+)/);
      if (!m) return "";
      const v = decodeURIComponent(m[1]);
      const parts = v.split(".");
      if (parts.length >= 4 && /^\d+$/.test(parts[2]) && /^\d+$/.test(parts[3])) {
        return `${parts[2]}.${parts[3]}`;
      }
      return "";
    } catch (_) { return ""; }
  };

  const getGaClientId = (timeoutMs = 1500) => {
    return new Promise((resolve) => {
      const cookieCid = readGaClientIdFromCookie();
      if (typeof gtag !== "function" || !GA_MEASUREMENT_ID) return resolve(cookieCid);
      let done = false;
      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        resolve(cookieCid);
      }, timeoutMs);
      try {
        gtag("get", GA_MEASUREMENT_ID, "client_id", (cid) => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          resolve(cid || cookieCid || "");
        });
      } catch (e) {
        clearTimeout(timer);
        resolve(cookieCid);
      }
    });
  };

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? "送信中..." : originalText;
  }

  function validateForm({ name, email, phone, message }) {
    const errors = [];
    if (!name || name.trim().length < 1) errors.push("お名前は必須です。");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("メールアドレスの形式が正しくありません。");
    const digits = (phone || "").replace(/[^\d]/g, "");
    if (!digits || digits.length < 10) errors.push("電話番号を正しく入力してください。");
    return errors;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.dataset.submitting === "1") return;
    form.dataset.submitting = "1";
    setSubmitting(true);

    const formData = new FormData(form);
    if (formData.get("honeypot")) {
      form.dataset.submitting = "0";
      setSubmitting(false);
      return;
    }

    formData.append("ua", navigator.userAgent);
    formData.append("page_id", document.body?.dataset?.pageId || "");

    // GA4 ID付与
    const clientId = await getGaClientId();
    if (clientId) formData.append("client_id", clientId);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };
    
    const errors = validateForm(payload);
    if (errors.length) {
      alert(errors[0]);
      form.dataset.submitting = "0";
      setSubmitting(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new Error("timeout")), TIMEOUT_MS);

    try {
      await fetch(scriptURL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
        signal: controller.signal,
        cache: "no-store",
        keepalive: true,
      });
      if(thanksPage) window.location.href = thanksPage;
      else alert("送信完了しました！担当者からの連絡をお待ちください。");
    } catch (err) {
      console.error("Send Error:", err);
      alert("送信に失敗しました。電波状況をご確認のうえ、再度お試しください。");
      form.dataset.submitting = "0";
      setSubmitting(false);
    } finally {
      clearTimeout(timer);
    }
  });
})();

/* script.base.js の末尾に追加 */

// ==============================
// Scroll Reveal Animation
// ==============================
(function () {
  // 監視対象：.js-fade クラスがついている要素
  const targets = document.querySelectorAll('.js-fade');
  
  if (!targets.length) return;

  const options = {
    root: null, // ビューポートを基準
    rootMargin: '0px 0px -10% 0px', // 画面の下10%くらいに来たら発火（少し早め）
    threshold: 0 // 少しでも見えたら
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // 一度出たら監視をやめる（負荷軽減）
      }
    });
  }, options);

  targets.forEach(target => observer.observe(target));
})();