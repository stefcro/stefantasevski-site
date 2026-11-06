import postCover from "./src/_includes/postCover.js";

export default function (eleventyConfig) {
  // Static files copied as-is
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets", "src/styles.css": "styles.css", "src/main.js": "main.js" });

  // Blog collection: every Markdown file in src/blog/posts that is not a draft, newest first
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/blog/posts/*.md")
      .filter((p) => !p.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }));
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
  eleventyConfig.addFilter("head", (arr = [], n) => arr.slice(0, n));
  eleventyConfig.addFilter("absUrl", (path, base) => new URL(path, base).toString());
  eleventyConfig.addFilter("jsonString", (s = "") => JSON.stringify(String(s)));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
