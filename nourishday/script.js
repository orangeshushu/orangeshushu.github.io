(() => {
  document.documentElement.classList.add("js");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const zh = document.documentElement.lang.startsWith("zh");
  const kcal = zh ? "千卡" : "kcal";
  const grams = zh ? "克" : "g";
  const animate = element => {
    if (!motion.matches && element?.animate) element.animate(
      [{ opacity: .45, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 250, easing: "cubic-bezier(.22,1,.36,1)" }
    );
  };
  function fillRing(target, source) {
    if (!target || !source) return;
    ["energy", "protein", "fiber"].forEach(key => {
      target.style.setProperty("--" + key, Math.min(Number(source.dataset[key]), 100) + "%");
    });
  }
  function revealRings() {
    document.querySelectorAll(".ring-calendar button").forEach((button, index) => {
      const rings = button.querySelector(".day-rings");
      if (!motion.matches) rings.style.transitionDelay = index * 32 + "ms";
      fillRing(rings, button);
    });
  }
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }), { threshold: .08, rootMargin: window.matchMedia("(max-width:720px)").matches ? "100px 0px" : "0px 0px -3%" });
    reveals.forEach(item => observer.observe(item));
    const calendar = document.querySelector(".ring-calendar");
    if (calendar) {
      const rings = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        revealRings();
        rings.disconnect();
      }, { threshold: .15 });
      rings.observe(calendar);
    }
  } else {
    reveals.forEach(item => item.classList.add("is-visible"));
    revealRings();
  }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll(".ring-animate").forEach(card => fillRing(card.querySelector(".large-rings"), card));
  }));

  // A self-contained illustrative day. No personal data or API requests.
  const dayParts = [
    { energy: 22, protein: 32, fiber: 18, calories: "440", proteinG: "16", fiberG: "5", meals: 1 },
    { energy: 53, protein: 76, fiber: 61, calories: "1,060", proteinG: "38", fiberG: "17", meals: 2 },
    { energy: 86, protein: 92, fiber: 79, calories: "1,720", proteinG: "46", fiberG: "22", meals: 3 }
  ];
  document.querySelectorAll("[data-day-part]").forEach(button => {
    button.addEventListener("click", () => {
      const part = dayParts[Number(button.dataset.dayPart)];
      const card = document.querySelector(".today-card");
      if (!part || !card) return;
      document.querySelectorAll("[data-day-part]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
      ["energy", "protein", "fiber"].forEach(key => { card.dataset[key] = part[key]; });
      fillRing(card.querySelector(".large-rings"), card);
      card.querySelector(".large-rings > b").textContent = part.energy + "%";
      card.querySelector(".today-total strong").textContent = part.calories;
      card.querySelector(".today-card-head small").textContent = part.meals + (zh ? " 餐" : part.meals === 1 ? " meal" : " meals");
      [["energy", part.energy, part.calories + " / 2,000 " + kcal],
       ["protein", part.protein, part.proteinG + " / 50 " + grams],
       ["fiber", part.fiber, part.fiberG + " / 28 " + grams]].forEach(([key, percent, value]) => {
        const row = card.querySelector("." + key);
        row.querySelector("b").textContent = percent + "%";
        row.querySelector("span").textContent = value;
      });
      animate(card.querySelector(".today-data ul"));
    });
  });

  const flow = document.querySelector(".product-flow");
  function setFlow(index) {
    if (!flow) return;
    flow.dataset.flowStep = index;
    flow.querySelectorAll("[data-flow]").forEach(button => button.setAttribute("aria-pressed", String(Number(button.dataset.flow) === index)));
    flow.querySelector(".flow-caption").textContent = flow.querySelector('[data-flow="' + index + '"] small').textContent;
    flow.querySelector(".meal-result").hidden = index === 2;
    flow.querySelector(".demo-saved").hidden = index !== 2;
    if (index !== 2) animate(flow.querySelector(".meal-result"));
  }
  flow?.querySelectorAll("[data-flow]").forEach(button => button.addEventListener("click", () => setFlow(Number(button.dataset.flow))));
  flow?.querySelector(".demo-save").addEventListener("click", () => {
    setFlow(2);
    // Keep focus on an available control when the save button becomes hidden.
    flow.querySelector(".demo-reset").focus({ preventScroll: true });
  });
  flow?.querySelector(".demo-reset").addEventListener("click", () => {
    setFlow(1);
    flow.querySelector(".demo-save").focus({ preventScroll: true });
  });
  document.getElementById("demo-portion")?.addEventListener("input", event => {
    const amount = Number(event.target.value);
    if (!Number.isFinite(amount) || amount < .5 || amount > 1.5) return;
    document.getElementById("portion-value").textContent = amount + (zh ? " 份" : amount === 1 ? " serving" : " servings");
    document.getElementById("meal-energy").textContent = Math.round(619 * amount) + " " + kcal;
    document.getElementById("meal-protein").textContent = Number((52 * amount).toFixed(1)) + " " + grams;
    document.getElementById("meal-fiber").textContent = Number((9.2 * amount).toFixed(1)) + " " + grams;
  });

  const dates = [...document.querySelectorAll(".ring-calendar button")];
  dates.forEach(button => button.setAttribute("aria-pressed", String(button.classList.contains("selected"))));
  const play = document.querySelector(".calendar-play");
  let timer = null;
  let cursor = 0;
  function selectDate(button) {
    dates.forEach(item => {
      const selected = item === button;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    document.getElementById("detail-day").textContent = button.dataset.day;
    document.getElementById("detail-energy").textContent = button.dataset.energy + "% · " + button.dataset.kcal + " " + kcal;
    document.getElementById("detail-protein").textContent = button.dataset.protein + "% · " + button.dataset.proteinG + " " + grams;
    document.getElementById("detail-fiber").textContent = button.dataset.fiber + "% · " + button.dataset.fiberG + " " + grams;
    animate(document.querySelector(".day-detail ul"));
  }
  function stopPlayback() {
    clearTimeout(timer);
    timer = null;
    if (play) {
      play.setAttribute("aria-pressed", "false");
      play.querySelector(".play-label").textContent = play.dataset.playLabel;
      play.querySelector("[aria-hidden]").textContent = "▶";
    }
  }
  function tick() {
    if (document.hidden || cursor >= dates.length) return stopPlayback();
    const button = dates[cursor++];
    selectDate(button);
    // Move only the small calendar's horizontal scroller, never the page.
    const scroller = document.querySelector(".calendar-scroll");
    if (scroller && scroller.scrollWidth > scroller.clientWidth) {
      const cell = button.getBoundingClientRect();
      const bounds = scroller.getBoundingClientRect();
      if (cell.left < bounds.left || cell.right > bounds.right) {
        scroller.scrollTo({ left: scroller.scrollLeft + cell.left - bounds.left - 8, behavior: motion.matches ? "auto" : "smooth" });
      }
    }
    timer = setTimeout(tick, 1050);
  }
  dates.forEach(button => button.addEventListener("click", () => { stopPlayback(); selectDate(button); }));
  play?.addEventListener("click", () => {
    if (timer !== null) return stopPlayback();
    cursor = 0;
    play.setAttribute("aria-pressed", "true");
    play.querySelector(".play-label").textContent = play.dataset.pauseLabel;
    play.querySelector("[aria-hidden]").textContent = "Ⅱ";
    tick();
  });
  if (play && "IntersectionObserver" in window) {
    const playbackObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) stopPlayback();
    });
    playbackObserver.observe(document.querySelector(".nutrition-dashboard"));
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopPlayback(); });
  motion.addEventListener?.("change", () => {
    stopPlayback();
    if (motion.matches) {
      reveals.forEach(item => item.classList.add("is-visible"));
      revealRings();
    }
  });

  const tabs = [...document.querySelectorAll(".showcase-tabs [role=tab]")];
  let selectedFeature = 0;
  function selectFeature(index, focus = false) {
    if (!tabs.length) return;
    selectedFeature = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const active = i === selectedFeature;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
    });
    document.querySelector(".showcase-position").textContent = String(selectedFeature + 1).padStart(2, "0") + " / 06";
    if (focus) tabs[selectedFeature].focus({ preventScroll: true });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectFeature(index));
    tab.addEventListener("keydown", event => {
      let target;
      if (event.key === "ArrowRight") target = index + 1;
      if (event.key === "ArrowLeft") target = index - 1;
      if (event.key === "Home") target = 0;
      if (event.key === "End") target = tabs.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      selectFeature(target, true);
    });
  });
  document.querySelector(".showcase-prev")?.addEventListener("click", () => selectFeature(selectedFeature - 1));
  document.querySelector(".showcase-next")?.addEventListener("click", () => selectFeature(selectedFeature + 1));

  const dialog = document.querySelector(".screenshot-dialog");
  let zoomTrigger;
  document.querySelectorAll(".screen-expand").forEach(button => button.addEventListener("click", () => {
    const source = button.querySelector("img");
    if (typeof dialog?.showModal !== "function") {
      window.open(source.currentSrc || source.src, "_blank", "noopener");
      return;
    }
    zoomTrigger = button;
    dialog.querySelector("img").src = source.currentSrc || source.src;
    dialog.querySelector("img").alt = source.alt;
    document.getElementById("screenshot-title").textContent = button.dataset.zoomTitle;
    dialog.showModal();
    dialog.scrollTop = 0;
  }));
  dialog?.addEventListener("close", () => zoomTrigger?.focus({ preventScroll: true }));

  // Passive scroll work is bounded to one frame, and does not change scrolling.
  const header = document.querySelector(".site-header");
  const progress = document.createElement("div");
  progress.className = "reading-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);
  const dock = document.querySelector(".download-dock");
  const hero = document.querySelector(".hero");
  const availability = document.getElementById("availability");
  let scrollFrame = 0;
  let previousScroll = Math.max(0, scrollY);
  let directionDistance = 0;
  function updateScroll() {
    scrollFrame = 0;
    const currentScroll = Math.max(0, scrollY);
    const delta = currentScroll - previousScroll;
    if (delta) {
      directionDistance = Math.sign(delta) === Math.sign(directionDistance) ? directionDistance + delta : delta;
    }
    previousScroll = currentScroll;
    const range = document.documentElement.scrollHeight - innerHeight;
    const fraction = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
    const heroBottom = hero?.getBoundingClientRect().bottom ?? 0;
    const endTop = availability?.getBoundingClientRect().top ?? Infinity;
    progress.style.transform = "scaleX(" + fraction + ")";
    header?.classList.toggle("is-scrolled", scrollY > 40);
    // Hide only the web header while reading down a phone screen. Native
    // scrolling is untouched; upward movement or keyboard focus restores it.
    if (header) {
      if (innerWidth > 720 || currentScroll < 160 || motion.matches || header.contains(document.activeElement)) {
        header.classList.remove("is-reading-down");
        directionDistance = 0;
      } else if (directionDistance > 28) header.classList.add("is-reading-down");
      else if (directionDistance < -12) header.classList.remove("is-reading-down");
    }
    if (dock) dock.hidden = !(heroBottom < 0 && endTop > innerHeight && !dialog?.open);
  }
  const requestScrollUpdate = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); };
  addEventListener("scroll", requestScrollUpdate, { passive: true });
  addEventListener("resize", requestScrollUpdate, { passive: true });
  header?.addEventListener("focusin", () => header.classList.remove("is-reading-down"));
  motion.addEventListener?.("change", requestScrollUpdate);
  dialog?.addEventListener("close", requestScrollUpdate);
  updateScroll();
  if ("IntersectionObserver" in window) {
    const sections = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".site-header nav a, .section-nav a").forEach(link => {
        if (link.getAttribute("href") === "#" + entry.target.id) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }), { rootMargin: "-10% 0px -65% 0px", threshold: 0 });
    document.querySelectorAll("#experience, #nutrition-rhythm, #inside, #plans").forEach(section => sections.observe(section));
  }
  document.querySelectorAll(".faq-list details").forEach(details => details.addEventListener("toggle", () => {
    if (!details.open) return;
    document.querySelectorAll(".faq-list details").forEach(other => { if (other !== details) other.open = false; });
  }));
})();
