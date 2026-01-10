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