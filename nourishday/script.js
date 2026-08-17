document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function fillRing(target, source) {
  if (!target || !source) return;
  target.style.setProperty("--energy", `${Math.min(Number(source.dataset.energy), 100)}%`);
  target.style.setProperty("--protein", `${Math.min(Number(source.dataset.protein), 100)}%`);
  target.style.setProperty("--fiber", `${Math.min(Number(source.dataset.fiber), 100)}%`);
}

function revealRings() {
  document.querySelectorAll(".ring-calendar button").forEach((button, index) => {
    const rings = button.querySelector(".day-rings");
    if (!reduceMotion) rings.style.transitionDelay = `${index * 42}ms`;
    fillRing(rings, button);
  });
}

function revealHeroRing() {
  document.querySelectorAll(".ring-animate").forEach(card => fillRing(card.querySelector(".large-rings"), card));
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5%" });
  revealItems.forEach(item => revealObserver.observe(item));

  const ringCalendar = document.querySelector(".ring-calendar");
  if (ringCalendar) {
    const ringObserver = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      revealRings();
      ringObserver.disconnect();
    }, { threshold: 0.35 });
    ringObserver.observe(ringCalendar);
  }
  requestAnimationFrame(() => requestAnimationFrame(revealHeroRing));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
  revealHeroRing();
  revealRings();
}

const calendarButtons = [...document.querySelectorAll(".ring-calendar button")];
const isChinese = document.documentElement.lang.startsWith("zh");
calendarButtons.forEach(button => {
  button.addEventListener("click", () => {
    calendarButtons.forEach(item => {
      item.classList.toggle("selected", item === button);
      if (item === button) item.setAttribute("aria-pressed", "true");
      else item.removeAttribute("aria-pressed");
    });

    document.getElementById("detail-day").textContent = button.dataset.day;
    document.getElementById("detail-energy").textContent = `${button.dataset.energy}% · ${button.dataset.kcal} ${isChinese ? "千卡" : "kcal"}`;
    document.getElementById("detail-protein").textContent = `${button.dataset.protein}% · ${button.dataset.proteinG} ${isChinese ? "克" : "g"}`;
    document.getElementById("detail-fiber").textContent = `${button.dataset.fiber}% · ${button.dataset.fiberG} ${isChinese ? "克" : "g"}`;
  });
});

document.querySelectorAll(".faq-list details").forEach(details => {
  details.addEventListener("toggle", () => {
    if (!details.open) return;
    document.querySelectorAll(".faq-list details").forEach(other => {
      if (other !== details) other.open = false;
    });
  });
});
