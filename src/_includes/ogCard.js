// Branded 1200x630 social share cards (LinkedIn, X, Slack, WhatsApp...).
// Rendered at build time with satori (layout -> SVG) and resvg (SVG -> PNG),
// so every page, including new blog posts, gets its own image automatically.
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import postCover from "./postCover.js";

const W = 1200, H = 630;
const LIME = "#c8f169", INK = "#0d0d0d", BG_DARK = "#0b0b0c", BG_LIGHT = "#f4f4f2";
const DOMAIN = "stefantasevski.com";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const fontFile = (p) => fs.readFileSync(path.join(root, "node_modules/@expo-google-fonts", p));
const FONTS = [
  { name: "Archivo", data: fontFile("archivo/900Black/Archivo_900Black.ttf"), weight: 900, style: "normal" },
  { name: "Archivo", data: fontFile("archivo/800ExtraBold/Archivo_800ExtraBold.ttf"), weight: 800, style: "normal" },
  { name: "Inter Tight", data: fontFile("inter-tight/400Regular/InterTight_400Regular.ttf"), weight: 400, style: "normal" },
  { name: "Inter Tight", data: fontFile("inter-tight/500Medium/InterTight_500Medium.ttf"), weight: 500, style: "normal" },
  { name: "Inter Tight", data: fontFile("inter-tight/600SemiBold/InterTight_600SemiBold.ttf"), weight: 600, style: "normal" },
];

const dataUri = (file, mime) => `data:${mime};base64,${fs.readFileSync(path.join(root, file)).toString("base64")}`;
const svgUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
const AVATAR = dataUri("src/_og/avatar.png", "image/png");

// tiny element helper: h("div", {style}, ...children)
// (satori wants a single child passed directly, and every <div> to declare its display)
const h = (type, props = {}, ...children) => {
  const kids = children.flat().filter((c) => c !== null && c !== undefined && c !== false && c !== "");
  const style = type === "div" ? { display: "flex", ...(props.style || {}) } : props.style;
  const out = { ...props, style };
  if (kids.length === 1) out.children = kids[0];
  else if (kids.length > 1) out.children = kids;
  return { type, props: out };
};

/** URL path -> share image slug, e.g. "/blog/my-post/" -> "blog-my-post", "/" -> "home". */
export function ogSlug(url = "/") {
  const s = String(url).replace(/\.html$/, "").replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  return s || "home";
}

const titleSize = (t, sizes) => {
  const n = t.length;
  return n < 34 ? sizes[0] : n < 56 ? sizes[1] : n < 80 ? sizes[2] : sizes[3];
};

const pill = (text, dark) =>
  h("div", { style: { display: "flex", alignItems: "center", gap: 10, fontFamily: "Inter Tight", fontWeight: 600, fontSize: 20, letterSpacing: 2, textTransform: "uppercase", color: dark ? "#d4d4d4" : "#3b3b3b" } },
    h("div", { style: { width: 12, height: 12, borderRadius: 6, background: LIME } }),
    text);

const author = (sub, dark = true) =>
  h("div", { style: { display: "flex", alignItems: "center", gap: 16 } },
    h("img", { src: AVATAR, width: 64, height: 64, style: { borderRadius: 32, border: `3px solid ${dark ? "#222" : "#fff"}` } }),
    h("div", { style: { display: "flex", flexDirection: "column", gap: 2 } },
      h("div", { style: { fontFamily: "Inter Tight", fontWeight: 600, fontSize: 24, color: dark ? "#fff" : INK } }, "Stefan Tasevski"),
      h("div", { style: { fontFamily: "Inter Tight", fontWeight: 400, fontSize: 20, color: dark ? "#a3a3a3" : "#5a5a5a" } }, sub)));

const domainTag = (dark = true) =>
  h("div", { style: { display: "flex", fontFamily: "Inter Tight", fontWeight: 600, fontSize: 20, color: INK, background: LIME, padding: "10px 18px", borderRadius: 999 } }, DOMAIN);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDate = (d) => { if (!d) return ""; const x = new Date(d); return `${x.getUTCDate()} ${MONTHS[x.getUTCMonth()]} ${x.getUTCFullYear()}`; };

// ---------- layouts ----------

function postCard(c) {
  const art = c.image && /\.(png|jpe?g)$/i.test(c.image)
    ? dataUri(path.join("src", c.image), /\.png$/i.test(c.image) ? "image/png" : "image/jpeg")
    : svgUri(postCover(c.slug, c.tags || [], 560, 630));
  const tag = (c.tags || [])[0];
  const sub = [fmtDate(c.date), c.readMins ? `${c.readMins} min read` : null].filter(Boolean).join(" · ");
  return h("div", { style: { display: "flex", width: W, height: H, background: BG_DARK } },
    h("div", { style: { display: "flex", flexDirection: "column", justifyContent: "space-between", width: 680, padding: "60px 56px 56px" } },
      pill(tag ? `Blog · ${tag}` : "Blog", true),
      h("div", { style: { display: "flex", fontFamily: "Archivo", fontWeight: 900, fontSize: titleSize(c.title, [72, 62, 52, 44]), lineHeight: 1.02, letterSpacing: -1.5, color: "#fff" } }, c.title),
      author(sub || "SEO & AEO", true)),
    h("div", { style: { display: "flex", position: "relative", width: 520, height: H } },
      h("img", { src: art, width: 560, height: 630, style: { position: "absolute", left: 0, top: 0, width: 560, height: 630, objectFit: "cover" } }),
      h("div", { style: { position: "absolute", left: 0, top: 0, width: 200, height: H, background: `linear-gradient(90deg, ${BG_DARK}, rgba(11,11,12,0))` } }),
      h("div", { style: { position: "absolute", right: 40, bottom: 48, display: "flex" } }, domainTag(true))));
}

function caseCard(c) {
  const bg = c.bg ? dataUri(c.bg, /\.png$/i.test(c.bg) ? "image/png" : "image/jpeg") : svgUri(postCover(c.slug, ["analytics"], W, H));
  return h("div", { style: { display: "flex", position: "relative", width: W, height: H, background: BG_DARK } },
    h("img", { src: bg, width: W, height: H, style: { position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover" } }),
    h("div", { style: { position: "absolute", left: 0, top: 0, width: W, height: H, background: "linear-gradient(90deg, rgba(11,11,12,.97) 0%, rgba(11,11,12,.9) 45%, rgba(11,11,12,.25) 80%, rgba(11,11,12,.1) 100%)" } }),
    h("div", { style: { position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: W, height: H, padding: "60px 64px 56px" } },
      pill(c.kicker || "Case study", true),
      h("div", { style: { display: "flex", flexDirection: "column" } },
        h("div", { style: { display: "flex", alignItems: "flex-end", gap: 24 } },
          h("div", { style: { display: "flex", fontFamily: "Archivo", fontWeight: 900, fontSize: 168, lineHeight: 0.85, letterSpacing: -6, color: LIME } }, c.metric || ""),
          h("div", { style: { display: "flex", maxWidth: 380, fontFamily: "Inter Tight", fontWeight: 500, fontSize: 30, lineHeight: 1.2, color: "#fff", paddingBottom: 8 } }, c.metricLabel || "")),
        h("div", { style: { display: "flex", maxWidth: 760, marginTop: 30, fontFamily: "Archivo", fontWeight: 800, fontSize: titleSize(c.title, [44, 40, 34, 30]), lineHeight: 1.1, letterSpacing: -0.5, color: "#e5e5e5" } }, c.title)),
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
        author("SEO & AEO case study", true),
        domainTag(true))));
}

function homeCard(c) {
  const portrait = dataUri("src/_og/portrait.png", "image/png");
  const chip = (b, s, hl) => h("div", { style: { display: "flex", flexDirection: "column", padding: "14px 20px", borderRadius: 18, background: hl ? LIME : "#fff", border: hl ? "none" : "1px solid #e3e3df" } },
    h("div", { style: { fontFamily: "Archivo", fontWeight: 800, fontSize: 34, color: INK, lineHeight: 1 } }, b),
    h("div", { style: { fontFamily: "Inter Tight", fontWeight: 500, fontSize: 17, color: "#3b3b3b", marginTop: 6 } }, s));
  return h("div", { style: { display: "flex", position: "relative", width: W, height: H, background: BG_LIGHT } },
    h("div", { style: { position: "absolute", right: -80, top: -120, width: 620, height: 620, borderRadius: 310, background: LIME, opacity: 0.55 } }),
    h("img", { src: portrait, width: 560, height: 505, style: { position: "absolute", right: 0, bottom: 0, width: 560, height: 505 } }),
    h("div", { style: { position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700, height: H, padding: "60px 0 56px 64px" } },
      pill("SEO Lead at Socially Powerful", false),
      h("div", { style: { display: "flex", flexDirection: "column" } },
        h("div", { style: { display: "flex", fontFamily: "Archivo", fontWeight: 900, fontSize: 96, lineHeight: 0.9, letterSpacing: -3, color: INK } }, "Stefan"),
        h("div", { style: { display: "flex", fontFamily: "Archivo", fontWeight: 900, fontSize: 96, lineHeight: 0.9, letterSpacing: -3, color: INK } }, "Tasevski"),
        h("div", { style: { display: "flex", marginTop: 22, fontFamily: "Inter Tight", fontWeight: 600, fontSize: 34, color: INK } }, c.headline || "SEO & AEO Expert for B2B & eCom")),
      h("div", { style: { display: "flex", gap: 12 } },
        chip("10+ yrs", "organic growth", true), chip("298", "top-3 rankings, one client"), chip("50+", "SEO projects"))));
}

function hubCard(c) {
  const covers = (c.covers || []).slice(0, 3);
  return h("div", { style: { display: "flex", position: "relative", width: W, height: H, background: BG_DARK } },
    h("div", { style: { display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640, padding: "60px 0 56px 64px" } },
      pill("Blog", true),
      h("div", { style: { display: "flex", flexDirection: "column" } },
        h("div", { style: { display: "flex", fontFamily: "Archivo", fontWeight: 900, fontSize: 84, lineHeight: 0.92, letterSpacing: -3, color: "#fff" } }, "SEO & AEO,"),
        h("div", { style: { display: "flex", fontFamily: "Archivo", fontWeight: 900, fontSize: 84, lineHeight: 0.92, letterSpacing: -3, color: LIME } }, "from the field."),
        h("div", { style: { display: "flex", marginTop: 24, fontFamily: "Inter Tight", fontWeight: 400, fontSize: 28, color: "#bdbdbd", maxWidth: 520 } }, "What actually moves rankings, AI citations and revenue.")),
      author(DOMAIN + "/blog", true)),
    h("div", { style: { display: "flex", position: "relative", width: 560, height: H } },
      ...covers.map((cv, i) => h("img", {
        src: svgUri(postCover(cv.slug, cv.tags || [], 480, 300)), width: 400, height: 250,
        style: { position: "absolute", left: 70 + i * 45, top: 56 + i * 140, width: 400, height: 250, borderRadius: 22, border: "2px solid #2a2a2a", boxShadow: "0 30px 60px rgba(0,0,0,.6)" },
      }))));
}

const LAYOUTS = { post: postCard, case: caseCard, home: homeCard, hub: hubCard };

export async function renderOgCard(card) {
  const layout = LAYOUTS[card.kind] || postCard;
  const svg = await satori(layout(card), { width: W, height: H, fonts: FONTS });
  return new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
}
