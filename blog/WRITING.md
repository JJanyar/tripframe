# Writing a blog post

Posts are Markdown files in `blog/posts/`. The file name is the URL: `blog/posts/best-dashcam-mounts.md` becomes `/blog/best-dashcam-mounts/`. The build (`npm run build`) turns every file into a page and adds it to the blog index and `sitemap.xml`. Nothing else needs to change.

```markdown
---
title: The title, also the page title in Google (aim for under 65 characters)
description: One or two sentences for search results (aim for 120 to 160 characters)
date: 2026-11-07
---

Opening paragraph...

## A section
```

`updated: YYYY-MM-DD` is optional, for posts revised later.

## Rules

- English, plain and practical. Short paragraphs, `##` sections, tables where they help.
- One clear search intent per post. Check the existing posts first and do not repeat a topic.
- Only state facts you are sure of. Give prices as rough ranges "at the time of writing". No invented specs, test results or quotes.
- Be honest about Tripframe: say what it does not do (camera settings, GPS for Thinkware/Nextbase/Garmin/70mai). Check /features/ and /dashcams/ for what it does.
- Link to two or three related posts with `/blog/<slug>/` and to the app with `/app/`.
- No images needed; the page design carries it.
- Every `##` heading becomes an entry in the table of contents next to the post, so keep headings short.

## Translations

Every post exists in all eleven languages: English in `blog/posts/<slug>.md`, the others in `blog/posts/<lang>/<slug>.md` with the **same file name** (`nl`, `de`, `fr`, `es`, `it`, `pt`, `pl`, `ru`, `ko`, `ja`). They become `/<lang>/blog/<slug>/`. A translation without an English post with the same name stops the build.

- Translate `title` and `description`; keep `date` (and `updated`) the same as the English post.
- Write natural, native text, not a word-for-word copy. Match the tone of `src/locales/<lang>.js` (for example "je" in Dutch, "du" in German, Brazilian Portuguese for `pt`). Usual words for "dashcam": 블랙박스 (ko), ドライブレコーダー / ドラレコ (ja), видеорегистратор (ru), kamera samochodowa (pl); "dashcam" elsewhere.
- Keep the Markdown structure, tables and headings in the same order.
- Do not translate brand and product names, file names, folder names and keys in `code`, or prices.
- Keep every link exactly as in the English post (`/blog/<slug>/`, `/app/`, `/#moment`). The build points them at the right language.
