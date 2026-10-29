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
- Be honest about Tripframe: say what it does not do (GPS export, GPS for Thinkware/Nextbase/Garmin/70mai).
- Link to two or three related posts with `/blog/<slug>/` and to the app with `/app/`.
- No images needed; the page design carries it.
