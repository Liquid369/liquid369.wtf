/* ============================================================================
   mesh.js — the gossip network constellation
   Nodes drift, nearby nodes link, and packets travel the edges like CRDS
   pushes propagating through the validator mesh. Accent color is read live
   from CSS so it re-tints as the active section changes.
   ========================================================================== */
(function () {
  const canvas = document.getElementById("mesh");
  if (!canvas) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return; // no 2D context → skip the decorative mesh gracefully

  let W = 0, H = 0, DPR = 1;
  let nodes = [];
  let packets = [];
  let raf = null;
  let running = true;

  // Active accent, read from CSS variables (kept fresh on section change)
  let accent = [98, 228, 255];
  // Edges are drawn in alpha buckets: one stroke() per bucket, with the rgba
  // strings precomputed on accent change — so the O(n^2) hot loop allocates none.
  const BUCKETS = 5;
  const MAXA = 0.22;
  let edgeStyles = [];
  const bucketPts = Array.from({ length: BUCKETS }, () => []);
  function buildEdgeStyles() {
    const [r, g, b] = accent;
    edgeStyles = [];
    for (let k = 0; k < BUCKETS; k++) {
      const alpha = (((k + 0.5) / BUCKETS) * MAXA).toFixed(3);
      edgeStyles.push(`rgba(${r},${g},${b},${alpha})`);
    }
  }
  function refreshAccent() {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-rgb").trim();
    if (v) {
      const parts = v.split(",").map((n) => parseInt(n, 10));
      if (parts.length === 3 && parts.every((n) => !isNaN(n))) accent = parts;
    }
    buildEdgeStyles();
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth = window.innerWidth;
    H = canvas.clientHeight = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed();
  }

  function seed() {
    // Density scales with viewport but is capped for performance.
    const target = Math.min(86, Math.round((W * H) / 19000));
    nodes = [];
    for (let i = 0; i < target; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.6,
        hub: Math.random() < 0.12, // a few brighter "hub" validators
      });
    }
    packets = [];
  }

  const LINK = 132;          // max distance for an edge
  const LINK2 = LINK * LINK;

  function spawnPacket() {
    if (packets.length > 14 || nodes.length < 2) return;
    const a = nodes[(Math.random() * nodes.length) | 0];
    // pick a nearby node as destination
    let best = null, bestD = LINK2;
    for (let i = 0; i < nodes.length; i++) {
      const b = nodes[i];
      if (b === a) continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = dx * dx + dy * dy;
      if (d < bestD) { bestD = d; best = b; }
    }
    if (best) packets.push({ a, b: best, t: 0, speed: 0.012 + Math.random() * 0.02 });
  }

  let frame = 0;
  function tick() {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    frame++;

    ctx.clearRect(0, 0, W, H);
    const [r, g, b] = accent;

    // move nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
    }

    // edges — bucket by alpha, then one stroke() per bucket
    ctx.lineWidth = 1;
    for (let k = 0; k < BUCKETS; k++) bucketPts[k].length = 0;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const c = nodes[j];
        const dx = a.x - c.x, dy = a.y - c.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK2) {
          let bkt = ((1 - d2 / LINK2) * BUCKETS) | 0;
          if (bkt >= BUCKETS) bkt = BUCKETS - 1;
          bucketPts[bkt].push(a.x, a.y, c.x, c.y);
        }
      }
    }
    for (let k = 0; k < BUCKETS; k++) {
      const pts = bucketPts[k];
      if (!pts.length) continue;
      ctx.strokeStyle = edgeStyles[k];
      ctx.beginPath();
      for (let m = 0; m < pts.length; m += 4) {
        ctx.moveTo(pts[m], pts[m + 1]);
        ctx.lineTo(pts[m + 2], pts[m + 3]);
      }
      ctx.stroke();
    }

    // nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const rad = n.hub ? n.r + 1.1 : n.r;
      ctx.beginPath();
      ctx.arc(n.x, n.y, rad, 0, Math.PI * 2);
      ctx.fillStyle = n.hub
        ? `rgba(${r},${g},${b},0.95)`
        : `rgba(200,210,225,0.5)`;
      ctx.fill();
      if (n.hub) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, rad + 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.22)`;
        ctx.stroke();
      }
    }

    // packets travelling along edges — shadow configured once per frame, not per packet
    if (frame % 22 === 0) spawnPacket();
    if (packets.length) {
      ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
      ctx.shadowBlur = 8;
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.speed;
        if (p.t >= 1) { packets.splice(i, 1); continue; }
        const x = p.a.x + (p.b.x - p.a.x) * p.t;
        const y = p.a.y + (p.b.y - p.a.y) * p.t;
        const fade = Math.sin(p.t * Math.PI);
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${fade})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
  }

  function start() {
    refreshAccent();
    resize();
    if (reduce) {
      // draw a single static frame, no animation loop
      running = false;
      drawStatic();
      return;
    }
    running = true;
    if (!raf) tick();
  }

  function drawStatic() {
    ctx.clearRect(0, 0, W, H);
    const [r, g, b] = accent;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const c = nodes[j];
        const dx = a.x - c.x, dy = a.y - c.y, d2 = dx * dx + dy * dy;
        if (d2 < LINK2) {
          ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d2 / LINK2) * 0.18})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,210,225,0.45)`;
      ctx.fill();
    }
  }

  // Pause when tab hidden; refresh accent when section theme swaps.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }
    else if (!reduce) { running = true; if (!raf) tick(); }
  });
  window.addEventListener("mesh:accent", () => {
    refreshAccent();
    if (!running) drawStatic(); // paused (reduced-motion / tab hidden) → repaint with new accent
  });

  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => { resize(); if (reduce) drawStatic(); }, 160);
  });

  start();
})();
