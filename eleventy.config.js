import fs from "node:fs";
import path from "node:path";
import postCover from "./src/_includes/postCover.js";
import { renderOgCard, ogSlug } from "./src/_includes/ogCard.js";

export default function (eleventyConfig) {
  // Static files copied as-is
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets", "src/styles.css": "styles.css", "src/main.js": "main.js" });
  // Favicons and web app manifest at the site root
  eleventyConfig.addPassthroughCopy({
    "src/favicon.ico": "favicon.ico", "src/favicon-96x96.png": "favicon-96x96.png",
    "src/apple-touch-icon.png": "apple-touch-icon.png", "src/icon-192.png": "icon-192.png",
    "src/icon-512.png": "icon-512.png", "src/site.webmanifest": "site.webmanifest",
  });

  // Blog collection: every Markdown file in src/blog/posts that is not a draft, newest first
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/blog/posts/*.md")
      .filter((p) => !p.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  eleventyConfig.addFilter("readableDate", (d) => {
    const x = new Date(d);
    return `${x.getUTCDate()} ${MONTHS[x.getUTCMonth()]} ${x.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString());
  eleventyConfig.addFilter("rfcDate", (d) => new Date(d).toUTCString());
  eleventyConfig.addFilter("readingTime", (html = "") =>
    Math.max(1, Math.round(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 220)));
  // Abstract cover per post (or the post's own `image:` if set)
  eleventyConfig.addFilter("postCover", (post) => {
    const d = post.data || post;
    const slug = (post.page || d.page || {}).fileSlug || d.title;
    if (d.image) return `<img class="post-cover-img" src="${d.image}" alt="" loading="lazy">`;
    return postCover(slug, (d.tags || []).filter((t) => t !== "posts"));
  });
  // ---- Social share cards ----
  // Absolute URL of a page's generated share image
  eleventyConfig.addFilter("ogImageUrl", (url, base) => new URL(`/og/${ogSlug(url)}.png`, base).toString());
  // Card description, embedded in the page as base64 JSON and removed after the build
  eleventyConfig.addFilter("ogCardMeta", (card) => Buffer.from(JSON.stringify(card)).toString("base64"));
  eleventyConfig.on("eleventy.after", async ({ dir, results }) => {
    const pages = [];
    for (const r of results || []) {
      if (!r.outputPath || !r.outputPath.endsWith(".html")) continue;
      const m = String(r.content).match(/<meta name="x-og-card" content="([^"]+)">\n?/);
      if (!m) continue;
      const card = JSON.parse(Buffer.from(m[1], "base64").toString("utf8"));
      card.tags = (card.tags || []).filter((t) => t !== "posts");
      pages.push({ r, card, tag: m[0] });
    }
    const posts = pages.filter((p) => p.card.kind === "post").map((p) => p.card)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    const outDir = path.join(dir.output, "og");
    fs.mkdirSync(outDir, { recursive: true });
    for (const { r, card, tag } of pages) {
      if (card.kind === "hub") card.covers = posts;
      fs.writeFileSync(path.join(outDir, `${ogSlug(r.url)}.png`), await renderOgCard(card));
      fs.writeFileSync(r.outputPath, String(r.content).replace(tag, ""));
    }
    console.log(`[og] ${pages.length} share cards`);
  });

  eleventyConfig.addFilter("head", (arr = [], n) => arr.slice(0, n));
  eleventyConfig.addFilter("absUrl", (path, base) => new URL(path, base).toString());
  eleventyConfig.addFilter("jsonString", (s = "") => JSON.stringify(String(s)));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
