/* ============================================================================
   main.js — rendering + interactions
   ========================================================================== */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------------------------- Card rendering --------------------------- */
  function renderCards() {
    Object.values(ECOSYSTEMS).forEach((eco) => {
      const grid = $(`#cards-${eco.key}`);
      if (!grid) return;
      grid.innerHTML = eco.projects
        .map((p, i) => {
          const num = String(i + 1).padStart(2, "0");
          const linkIcon = p.href
            ? `<a class="card__link" href="${esc(p.href)}" target="_blank" rel="noopener" aria-label="${esc(p.name)} on GitHub">↗</a>`
            : "";
          const tag = `${eco.index}.${num}`;
          return `
          <article class="card reveal" data-delay="${(i % 4) + 1}">
            <div class="card__top">
              <h3 class="card__name">${esc(p.name)} ${linkIcon}</h3>
              <span class="card__role">${esc(p.role)}</span>
            </div>
            <p class="card__desc">${esc(p.desc)}</p>
            <div class="card__foot">
              <span class="card__lang">${esc(p.lang)}</span>
              <span class="card__idx">${tag}</span>
            </div>
          </article>`;
        })
        .join("");
    });
  }

  /* ------------------------------ Registry ------------------------------- */
  let activeFilter = "all";
  function renderRegistry() {
    const bar = $("#registry-bar");
    const grid = $("#registry-grid");
    if (!bar || !grid) return;

    bar.innerHTML =
      REGISTRY_FILTERS.map(
        (f) =>
          `<button class="chip" data-filter="${f.key}" aria-controls="registry-grid" aria-pressed="${f.key === "all"}">${esc(f.label)}</button>`
      ).join("") +
      `<span class="registry__count" id="registry-count" role="status" aria-live="polite" aria-atomic="true"></span>`;

    function paint() {
      const items =
        activeFilter === "all"
          ? REGISTRY
          : REGISTRY.filter(([, cat]) => cat === activeFilter);
      grid.innerHTML = items
        .map(
          ([name, cat], i) => `
          <div class="reg reg--${cat}" role="listitem" style="--i:${i}">
            <span class="reg__tick" aria-hidden="true"></span>
            <span class="reg__name">${esc(name)}</span>
          </div>`
        )
        .join("");
      // CSS drives the staggered fade via --i; the live region names the active filter
      const c = $("#registry-count");
      if (c) {
        const f = REGISTRY_FILTERS.find((x) => x.key === activeFilter);
        const label = f ? f.label : "All";
        c.textContent = `${label} — ${String(items.length).padStart(3, "0")} / ${REGISTRY.length} indexed`;
      }
    }

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      $$(".chip", bar).forEach((c) =>
        c.setAttribute("aria-pressed", String(c.dataset.filter === activeFilter))
      );
      paint();
    });
    paint();
  }

  /* ------------------------------ Marquee -------------------------------- */
  function renderMarquee() {
    const track = $("#marquee-track");
    if (!track) return;
    const one = MARQUEE.map((m) => `<span class="marquee__item">${esc(m)}</span>`).join("");
    track.innerHTML = one + one; // duplicate for seamless loop
  }

  /* ------------------------------- Stats --------------------------------- */
  function renderStats() {
    const host = $("#hud");
    if (!host) return;
    host.innerHTML = STATS.map(
      (s) => `
      <div class="hud__cell reveal">
        <div class="hud__num" data-target="${esc(s.value)}" data-suffix="${esc(s.suffix)}">0</div>
        <div class="hud__label">${esc(s.label)}</div>
      </div>`
    ).join("");
  }

  function countUp(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || "";
    if (reduce) { el.textContent = target + suffix; return; }
    const dur = 1400;
    let start = null;
    function step(ts) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* --------------------------- Reveal on scroll -------------------------- */
  function setupReveals() {
    const els = $$(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      $$(".hud__num").forEach(countUp);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            if (en.target.classList.contains("hud__cell")) {
              const num = en.target.querySelector(".hud__num");
              if (num && !num.dataset.done) { num.dataset.done = "1"; countUp(num); }
            }
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    els.forEach((e) => io.observe(e));
  }

  /* ----------------------- Section accent theming ------------------------ */
  const ACCENTS = {
    hero:   { v: "--ice",   rgb: "98, 228, 255" },
    solana: { v: "--sol",   rgb: "43, 232, 176" },
    pivx:   { v: "--pivx",  rgb: "157, 123, 255" },
    chains: { v: "--chain", rgb: "255, 180, 84" },
    index:  { v: "--ice",   rgb: "98, 228, 255" },
    about:  { v: "--ice",   rgb: "98, 228, 255" },
  };
  let curRgb = ACCENTS.hero.rgb;
  function setupTheming() {
    const root = document.documentElement;
    const targets = $$("[data-accent]");
    if (!("IntersectionObserver" in window)) return;
    const NAV_FOR = { solana: "#solana", pivx: "#pivx", chains: "#chains", index: "#index" };
    const navLinks = $$('.nav__links a:not(.nav__cta)');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const key = en.target.dataset.accent;
          const a = key && ACCENTS[key];
          // Only repaint when the resolved color actually changes (hero/index/about share ice)
          if (a && a.rgb !== curRgb) {
            curRgb = a.rgb;
            root.style.setProperty("--accent", `var(${a.v})`);
            root.style.setProperty("--accent-rgb", a.rgb);
            window.dispatchEvent(new Event("mesh:accent"));
          }
          // Expose the active section to AT / keyboard, independent of color
          if (key) {
            navLinks.forEach((el) => {
              if (el.getAttribute("href") === NAV_FOR[key]) el.setAttribute("aria-current", "location");
              else el.removeAttribute("aria-current");
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    targets.forEach((t) => io.observe(t));
  }

  /* ------------------------------- Nav state ----------------------------- */
  function setupNav() {
    const nav = $(".nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----------------- Pointer: spotlight + card glow + tilt --------------- */
  function setupPointer() {
    if (reduce) return;
    // Fine-pointer only: avoids a stuck spotlight after a tap and skips per-touch work on mobile.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const spot = $(".spotlight");
    let raf = null, mx = innerWidth / 2, my = innerHeight / 2;
    window.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (spot && !raf) {
        raf = requestAnimationFrame(() => {
          spot.style.setProperty("--cx", mx + "px");
          spot.style.setProperty("--cy", my + "px");
          spot.style.opacity = "1";
          raf = null;
        });
      }
    });
    window.addEventListener("pointerleave", () => spot && (spot.style.opacity = "0"));

    // card glow + subtle 3D tilt (event-delegated, rAF-throttled)
    let cardRaf = null, cardTarget = null, cardRect = null, tilted = null, cx = 0, cy = 0;
    const clearTilt = () => {
      if (tilted) { tilted.style.transform = ""; tilted.style.willChange = ""; tilted = null; }
      cardTarget = null; cardRect = null;
    };
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      if (card !== cardTarget) { cardTarget = card; cardRect = card.getBoundingClientRect(); } // cache rect; no layout read in the hot path
      cx = e.clientX; cy = e.clientY;
      if (cardRaf) return;
      cardRaf = requestAnimationFrame(() => {
        cardRaf = null;
        const c = cardTarget;
        if (!c) return;
        const r = cardRect || c.getBoundingClientRect();
        const px = (cx - r.left) / r.width;
        const py = (cy - r.top) / r.height;
        c.style.setProperty("--mx", px * 100 + "%");
        c.style.setProperty("--my", py * 100 + "%");
        const rx = (py - 0.5) * -5;
        const ry = (px - 0.5) * 5;
        c.style.willChange = "transform";
        c.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        tilted = c;
      });
    });
    document.addEventListener("pointerout", (e) => {
      const card = e.target.closest(".card");
      if (card && !card.contains(e.relatedTarget)) {
        card.style.transform = "";
        card.style.willChange = "";
        if (tilted === card) tilted = null;
        if (cardTarget === card) { cardTarget = null; cardRect = null; }
      }
    });
    // Reset paths so a tilt can never stick when the card leaves the pointer
    // without firing pointerout (tab blur, gesture cancel, scroll-away).
    window.addEventListener("blur", clearTilt);
    document.addEventListener("pointercancel", clearTilt);
    window.addEventListener("scroll", clearTilt, { passive: true });
  }

  /* ----------------------------- Magnetic btns --------------------------- */
  function setupMagnetic() {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    $$("[data-magnetic]").forEach((el) => {
      let raf = null, rect = null, mx = 0, my = 0;
      el.addEventListener("pointerenter", () => {
        el.style.willChange = "transform";
        rect = el.getBoundingClientRect(); // cache rect; hot path does zero layout reads
      });
      el.addEventListener("pointermove", (e) => {
        mx = e.clientX; my = e.clientY;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          const r = rect || el.getBoundingClientRect();
          const x = mx - r.left - r.width / 2;
          const y = my - r.top - r.height / 2;
          el.style.transform = `translate(${x * 0.22}px, ${y * 0.3 - 2}px)`;
        });
      });
      el.addEventListener("pointerleave", () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        el.style.transform = "";
        el.style.willChange = "";
        rect = null;
      });
    });
  }

  /* ------------------------------- Live clock ---------------------------- */
  function setupClock() {
    const el = $("#nav-clock");
    if (!el) return;
    const tick = () => {
      if (document.hidden) return; // no DOM writes while backgrounded
      const d = new Date();
      const p = (n) => String(n).padStart(2, "0");
      el.textContent = `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`;
    };
    tick();
    let clockId = setInterval(tick, 1000);
    window.addEventListener("pagehide", () => clearInterval(clockId));
    window.addEventListener("pageshow", (e) => {
      if (e.persisted) { clearInterval(clockId); tick(); clockId = setInterval(tick, 1000); } // re-arm after bfcache restore
    });
    document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });
  }

  /* -------------------------------- Boot --------------------------------- */
  function init() {
    renderCards();
    renderRegistry();
    renderMarquee();
    renderStats();
    setupReveals();
    setupTheming();
    setupNav();
    setupPointer();
    setupMagnetic();
    setupClock();
    // mark hero revealed shortly after load for the entrance stagger
    requestAnimationFrame(() =>
      $$(".hero .reveal").forEach((e) => e.classList.add("in"))
    );
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
