export default {
  layout: "post.njk",
  tags: ["posts"],
  permalink: (data) => (data.draft ? false : `/blog/${data.page.fileSlug}/`),
  eleventyComputed: {
    // Article structured data for every post
    schemaJson: (data) => JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: data.title,
      description: data.description,
      datePublished: data.page.date?.toISOString?.(),
      dateModified: (data.updated ? new Date(data.updated) : data.page.date)?.toISOString?.(),
      author: { "@type": "Person", name: "Stefan Tasevski", url: data.site.url + "/" },
      mainEntityOfPage: data.site.url + `/blog/${data.page.fileSlug}/`,
    }),
  },
};
