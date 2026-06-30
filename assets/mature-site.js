const cards = [...document.querySelectorAll(".case-card")];
const buttons = [...document.querySelectorAll("[data-country-filter]")];
const input = document.querySelector("#searchInput");
const sortMode = document.querySelector("#sortMode");
const grid = document.querySelector("#caseGrid");
const empty = document.querySelector("#emptyState");
let activeCountry = "all";
let activeRightType = "all";

cards.forEach((card, index) => card.dataset.order = String(index));

function sortedCards() {
  const mode = sortMode?.value || "default";
  const ordered = [...cards];
  if (mode === "country") {
    ordered.sort((a, b) => (a.dataset.country || "").localeCompare(b.dataset.country || "", "zh-CN-u-co-pinyin") || Number(a.dataset.order) - Number(b.dataset.order));
  } else if (mode === "caseName") {
    ordered.sort((a, b) => (a.dataset.caseSort || a.dataset.caseName || "").localeCompare(b.dataset.caseSort || b.dataset.caseName || "", "zh-CN-u-co-pinyin") || Number(a.dataset.order) - Number(b.dataset.order));
  } else if (mode === "rightType") {
    ordered.sort((a, b) => (a.dataset.rightType || "").localeCompare(b.dataset.rightType || "", "zh-CN-u-co-pinyin") || Number(a.dataset.order) - Number(b.dataset.order));
  } else if (mode === "maturity") {
    ordered.sort((a, b) => (a.dataset.maturity || "").localeCompare(b.dataset.maturity || "", "zh-CN-u-co-pinyin") || Number(a.dataset.order) - Number(b.dataset.order));
  } else if (mode === "quality") {
    ordered.sort((a, b) => (a.dataset.quality || "").localeCompare(b.dataset.quality || "") || Number(a.dataset.order) - Number(b.dataset.order));
  } else {
    ordered.sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));
  }
  return ordered;
}

function updateButtons() {
  for (const button of buttons) {
    const country = button.dataset.countryFilter || "all";
    const right = button.dataset.rightFilter || "all";
    button.classList.toggle("active", country === activeCountry && right === activeRightType);
  }
}

function updateCards() {
  const query = (input?.value || "").trim().toLowerCase();
  let visible = 0;
  for (const card of sortedCards()) {
    grid?.appendChild(card);
    const countryMatch = activeCountry === "all" || card.dataset.country === activeCountry;
    const rightMatch = activeRightType === "all" || card.dataset.rightType === activeRightType;
    const searchMatch = !query || (card.dataset.search || "").includes(query);
    const show = countryMatch && rightMatch && searchMatch;
    card.style.display = show ? "" : "none";
    if (show) visible += 1;
  }
  updateButtons();
  if (empty) empty.style.display = visible ? "none" : "block";
}

for (const button of buttons) {
  button.addEventListener("click", () => {
    activeCountry = button.dataset.countryFilter || "all";
    activeRightType = button.dataset.rightFilter || "all";
    updateCards();
  });
}
input?.addEventListener("input", updateCards);
sortMode?.addEventListener("change", updateCards);
updateCards();
