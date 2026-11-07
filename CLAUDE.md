# stefantasevski.com

Personal SEO/AEO portfolio and blog for Stefan Tasevski. Eleventy site in `src/`,
deployed to Vercel (stefantasevski.com) on every push to `main`. See README.md for
how posts, case studies and share cards work.

## Writing for Stefan (applies to all copy, posts, LinkedIn text and replies)

Stefan wants everything written for him to read as written by a person, not by AI.

- **No em dashes (—), ever.** Use a comma, period, colon or parentheses. En dash (–) only
  for number and date ranges.
- Plain, direct, first-person voice. Short sentences mixed with longer ones.
- Avoid AI tells: "it's not X, it's Y" reveals, "no X, no Y, no Z" lists, rule-of-three
  padding, sentences trailing into extra comma clauses, "delve", "landscape", "unlock",
  "elevate", "seamless", "robust", "in today's fast-paced world", "game-changer".
- Specific numbers and facts over adjectives. Never invent results; only use figures
  Stefan has given (CV, case studies, screenshots) and mark estimates as estimates.
- Keep his own wording when he supplies text (blog drafts, quotes). Don't rewrite his posts.
- Short is better: he prefers concise LinkedIn and site copy.

## Humanizer skill (`.claude/skills/humanizar-es`)

Installed from https://github.com/ervin-mo/humanizar-es. For long-form AI-drafted text
(blog posts, case studies, articles over ~300 words), run its pipeline before
publishing, following its SKILL.md exactly (the scripts rewrite, Claude only reviews
and fixes 1–3 words). Not for short copy (titles, meta descriptions, LinkedIn blurbs),
where the writing rules above apply instead.

Requirements: llama.cpp and the ~4.6 GB model (`scripts/install_model.py`, downloads
from huggingface.co). In cloud sessions huggingface.co must be allowed by the
environment's network settings, and the model is re-downloaded per new container
unless a setup script installs it. Its own limits: English text is not yet passed on
GPTZero; it lengthens sentences. Tell Stefan if a run isn't possible rather than
skipping it silently.
