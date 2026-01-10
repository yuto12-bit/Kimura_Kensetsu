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