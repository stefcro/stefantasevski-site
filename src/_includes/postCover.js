// Generates an abstract SVG cover for a blog post, seeded by its slug so every
// post gets its own artwork. The motif follows the post's tags:
//   Search Console / Analytics / traffic -> line chart with a spike
//   AEO / AI                             -> connected entity graph
//   anything else                        -> layered waves
// Set `image:` in a post's front matter to use a real photo instead.

function rng(seed) {
  let h = 2166136261;
  for (const c of String(seed)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; };
}

const PALETTES = [
  { bg: "#0b0b0c", a: "#c8f169", b: "#7c5cff" },
  { bg: "#0d0f14", a: "#4f8bff", b: "#c8f169" },
  { bg: "#0c0b10", a: "#a78bfa", b: "#4f8bff" },
];

function motif(tags = []) {
  const t = tags.join(" ").toLowerCase();
  if (/(internal link|linking|site architecture)/.test(t)) return "links";
  if (/(search console|analytics|traffic|reporting|click)/.test(t)) return "chart";
  if (/(aeo|ai|llm|entity)/.test(t)) return "graph";
  return "waves";
}

export default function postCover(slug, tags = [], W = 1200, H = 630) {
  const r = rng(slug);
  const p = PALETTES[Math.floor(r() * PALETTES.length)];
  const id = "c" + Math.floor(r() * 1e6);
  const kind = motif(tags);
  let art = "";

  if (kind === "chart") {
    const n = 48, pts = [];
    const spikeAt = 0.62 + r() * 0.2;
    for (let i = 0; i <= n; i++) {
      const x = (i / n) * W;
      const t = i / n;
      let v = 0.18 + t * 0.12 + Math.sin(i * 0.9 + r() * 2) * 0.03 + r() * 0.03;
      const d = Math.abs(t - spikeAt);
      if (d < 0.06) v += (0.06 - d) * 9;
      pts.push([x, H - 70 - v * (H - 160)]);
    }
    const line = pts.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");
    const flat = pts.map(([x], i) => (i ? "L" : "M") + x.toFixed(1) + " " + (H - 90 - (0.2 + (i / n) * 0.1) * (H - 200)).toFixed(1)).join(" ");
    let grid = "";
    for (let y = 90; y < H - 40; y += 90) grid += `<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="#fff" stroke-opacity=".06"/>`;
    const sx = spikeAt * W;
    art = `${grid}
      <path d="${line} L${W} ${H} L0 ${H} Z" fill="url(#${id}f)"/>
      <path d="${flat}" fill="none" stroke="${p.b}" stroke-width="3" stroke-dasharray="8 10" stroke-opacity=".7"/>
      <path d="${line}" fill="none" stroke="${p.a}" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="${sx}" cy="${Math.min(...pts.map(q => q[1]))}" r="16" fill="none" stroke="${p.a}" stroke-width="3"/>
      <line x1="${sx}" x2="${sx}" y1="40" y2="${H}" stroke="#fff" stroke-opacity=".25" stroke-dasharray="4 8"/>`;
  } else if (kind === "links") {
    // a few "pages" (cards with text lines) joined by curved links into one destination
    const cardW = 230, cardH = 150;
    const dest = [W * 0.70, H * 0.42];
    const srcs = [[W * 0.12, H * 0.16], [W * 0.10, H * 0.62], [W * 0.38, H * 0.08], [W * 0.36, H * 0.70]];
    const jitter = () => (r() - 0.5) * 40;
    let links = "", cards = "";
    const lime = "#c8f169";
    const page = (x, y, w, h, hi) => {
      let lines = "";
      for (let k = 0; k < 4; k++) lines += `<rect x="${x + 22}" y="${y + 40 + k * 22}" width="${(w - 44) * (k === 3 ? 0.55 : 0.9 - r() * 0.2)}" height="7" rx="3.5" fill="#fff" fill-opacity="${hi ? .5 : .16}"/>`;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${hi ? lime : "#ffffff"}" fill-opacity="${hi ? .14 : .04}" stroke="${hi ? lime : "#ffffff"}" stroke-opacity="${hi ? .9 : .18}" stroke-width="${hi ? 3 : 1.5}"/>
        <rect x="${x + 22}" y="${y + 18}" width="${w * 0.35}" height="9" rx="4.5" fill="${hi ? lime : p.b}" fill-opacity="${hi ? 1 : .8}"/>${lines}`;
    };
    srcs.forEach(([x, y], i) => {
      x += jitter(); y += jitter();
      const sx = x + cardW, sy = y + 40 + 22 * (1 + (i % 3)), tx = dest[0], ty = dest[1] + 50 + i * 22;
      const mx = (sx + tx) / 2;
      links += `<path d="M${sx} ${sy} C${mx} ${sy} ${mx} ${ty} ${tx - 12} ${ty}" fill="none" stroke="url(#${id}l)" stroke-width="3" stroke-opacity=".85"/>
        <circle cx="${sx}" cy="${sy}" r="6" fill="${p.b}"/><path d="M${tx - 22} ${ty - 8} L${tx - 8} ${ty} L${tx - 22} ${ty + 8}" fill="none" stroke="${lime}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
      cards += page(x, y, cardW, cardH, false);
    });
    cards += page(dest[0], dest[1], cardW * 1.25, cardH * 1.35, true);
    art = links + cards;
  } else if (kind === "graph") {
    const nodes = [];
    const cx = W * (0.55 + r() * 0.15), cy = H * (0.45 + r() * 0.1);
    nodes.push([cx, cy, 30]);
    for (let i = 0; i < 16; i++) {
      const ang = r() * Math.PI * 2, dist = 120 + r() * 340;
      nodes.push([cx + Math.cos(ang) * dist * 1.4, cy + Math.sin(ang) * dist * 0.75, 5 + r() * 12]);
    }
    let edges = "";
    nodes.forEach((n, i) => {
      if (i) edges += `<line x1="${cx}" y1="${cy}" x2="${n[0].toFixed(1)}" y2="${n[1].toFixed(1)}" stroke="url(#${id}l)" stroke-width="${i % 3 ? 1.4 : 2.6}" stroke-opacity=".75"/>`;
      const j = 1 + Math.floor(r() * (nodes.length - 1));
      if (i && j !== i) edges += `<line x1="${n[0].toFixed(1)}" y1="${n[1].toFixed(1)}" x2="${nodes[j][0].toFixed(1)}" y2="${nodes[j][1].toFixed(1)}" stroke="#fff" stroke-opacity=".1"/>`;
    });
    const dots = nodes.map((n, i) => i
      ? `<circle cx="${n[0].toFixed(1)}" cy="${n[1].toFixed(1)}" r="${n[2].toFixed(1)}" fill="${i % 4 ? p.b : p.a}" fill-opacity="${i % 4 ? .55 : .9}"/>`
      : `<circle cx="${cx}" cy="${cy}" r="70" fill="${p.a}" fill-opacity=".12"/><circle cx="${cx}" cy="${cy}" r="30" fill="${p.a}"/>`).join("");
    art = edges + dots;
  } else {
    let waves = "";
    for (let k = 0; k < 14; k++) {
      let d = "";
      for (let i = 0; i <= 60; i++) {
        const x = (i / 60) * W;
        const y = H * 0.55 + Math.sin(i / 6 + k * 0.35 + r() * 0.2) * (40 + k * 4) - k * 14 + (i / 60) * -120;
        d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
      }
      waves += `<path d="${d}" fill="none" stroke="url(#${id}l)" stroke-width="${k ? 1.4 : 3}" stroke-opacity="${(0.9 - k * 0.05).toFixed(2)}"/>`;
    }
    art = waves;
  }

  return `<svg class="post-cover-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="${id}l" x1="0" x2="1"><stop offset="0" stop-color="${p.b}"/><stop offset="1" stop-color="${p.a}"/></linearGradient>
    <linearGradient id="${id}f" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${p.a}" stop-opacity=".25"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></linearGradient>
    <radialGradient id="${id}g" cx=".85" cy=".15" r=".7"><stop offset="0" stop-color="${p.a}" stop-opacity=".22"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}h" cx=".1" cy=".95" r=".7"><stop offset="0" stop-color="${p.b}" stop-opacity=".25"/><stop offset="1" stop-color="${p.b}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${p.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#${id}h)"/><rect width="${W}" height="${H}" fill="url(#${id}g)"/>
  ${art}
</svg>`;
}
