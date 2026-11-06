# stefantasevski.com

Personal SEO/AEO portfolio + blog. Built with [Eleventy](https://www.11ty.dev/), hosted on Vercel.
Every commit to `main` publishes automatically.

## Како да објавиш нов блог пост (без CMS)

1. На GitHub отвори ја папката **`src/blog/posts/`**.
2. Отвори го **`_TEMPLATE.md`**, копирај ја целата содржина.
3. Кликни **Add file → Create new file**. Името на фајлот е URL-то на постот, на пример
   `ai-overviews-za-ecommerce.md` → `/blog/ai-overviews-za-ecommerce/`
   (мали букви, латиница, цртички наместо празни места).
4. Залепи го шаблонот и пополни:
   - `title` – наслов (до ~60 знаци)
   - `description` – 1–2 реченици, ова е meta description во Google
   - `date` – датум во формат `2026-11-05`
   - `tags` – на пример `["AEO", "eCommerce"]`
   - `draft: false` – за да се објави (`true` = скриен нацрт)
5. Пиши го текстот под линијата `---`.
6. Кликни **Commit changes**. За околу 30 секунди постот е live.

### Форматирање (Markdown)

| Пишуваш | Добиваш |
|---|---|
| `## Наслов` | поднаслов H2 |
| `### Наслов` | поднаслов H3 |
| `**текст**` | **болд** |
| `*текст*` | *италик* |
| `[текст](https://...)` | линк |
| `- ставка` | листа со точки |
| `1. чекор` | нумерирана листа |
| `> цитат` | истакнат цитат |
| `![опис](/assets/slika.png)` | слика (прво прикачи ја во `src/assets/`) |

### Што се случува автоматски
- Постот се појавува на `/blog/` и во „Latest from the blog“ на почетната.
- Добива свој meta title/description, Open Graph, BlogPosting schema, време на читање.
- Се додава во `sitemap.xml` и `feed.xml` (RSS).

### Измена или бришење
Отвори го фајлот на GitHub → икона молив → измени → Commit.
За да го тргнеш постот, стави `draft: true` или избриши го фајлот.

## Локално (опционално)
```
npm install
npm run dev   # http://localhost:8080
```
