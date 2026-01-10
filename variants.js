/* ===== variants.js (generated) ===== */

/* --- sim-income.js --- */
(function () {
  const root = document.querySelector('[data-component="sim-income"]');
  if (!root) return;
  const elements = {
    dailyWage: root.querySelector('[data-role="daily-wage"]'),
    weeklyDays: root.querySelector('[data-role="weekly-days"]'),
    displayDaily: root.querySelector('[data-role="display-daily"]'),
    displayWeekly: root.querySelector('[data-role="display-weekly"]'),
    resultMonthly: root.querySelector('[data-role="result-monthly"]'),
    resultYearly: root.querySelector('[data-role="result-yearly"]'),
  };
  const fmt = (num) => num.toLocaleString("ja-JP");
  const calculate = () => {
    const daily = parseInt(elements.dailyWage.value, 10);
    const weekly = parseInt(elements.weeklyDays.value, 10);
    const monthly = Math.floor(daily * weekly * 4.3);
    const yearly = monthly * 12;
    elements.displayDaily.textContent = fmt(daily);
    elements.displayWeekly.textContent = weekly;
    elements.resultMonthly.textContent = fmt(monthly);
    elements.resultYearly.textContent = fmt(yearly);
  };
  elements.dailyWage.addEventListener("input", calculate);
  elements.weeklyDays.addEventListener("input", calculate);
  calculate();
})();

/* --- job-spec.js --- */
(function () {
  const root = document.querySelector("[data-accordion-root]");
  if (!root) return;
  const btn = root.querySelector("[data-accordion-toggle]");
  const panel = root.querySelector("[data-accordion-panel]");
  const textSpan = root.querySelector("[data-text-open]");
  if (!btn || !panel || !textSpan) return;

  btn.addEventListener("click", () => {
    const isExpanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", !isExpanded);
    panel.hidden = isExpanded;
    const textOpen = textSpan.getAttribute("data-text-open");
    const textClose = textSpan.getAttribute("data-text-close");
    textSpan.textContent = !isExpanded ? textClose : textOpen;
  });
})();

/* --- apply-flow.js --- */


