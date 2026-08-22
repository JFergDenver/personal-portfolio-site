# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static personal portfolio site for Jeff Ferguson — plain HTML, CSS, and vanilla JS, no framework, no dependencies, no build step, no package.json. The design language is intentionally "no unnecessary frameworks, no bloat" and this is stated directly on the homepage.

## Running locally

There is no dev server, build, lint, or test tooling in this repo. To preview:

```
python3 -m http.server 8000
```

then open `http://localhost:8000/`. The blog (`js/blog.js`) uses `fetch()` to load Markdown files and `manifest.json`, which fails under `file://` due to CORS — the site must be served over HTTP to view the blog correctly. Every other page works fine opened directly as a file.

## Site structure

Each top-level `.html` file is a standalone page that repeats the same header/nav/footer markup verbatim — there is no templating, includes, or build step to share this markup. **Any change to the nav links, header, or footer must be hand-applied to every HTML file**: `index.html`, `about.html`, `blog.html`, `blog-post.html`, `contact.html`, `nfl-draft-2026.html`, `photo-collage.html`, `projects.html`.

Note: `projects.html` still exists and is linked from the homepage's "view projects" button, but was deliberately dropped from the shared nav in favor of the blog (see git history) — it's a known asymmetry, not a bug to silently "fix" by re-adding it to nav without being asked.

### CSS

- `css/style.css` is the global stylesheet loaded on every page. It defines the design tokens as CSS custom properties on `:root` (`--bg`, `--text`, `--accent`, `--radius`, `--font`, etc.) and all shared components: header/nav, hero, cards, buttons, forms, footer. The visual language is explicitly modeled on 8deuce.com (sticky accent-colored header, card shadows/radius, hover-by-brightening rather than color-swapping) — see the comments at the top of the file.
- Page-specific stylesheets (`css/blog.css`, `css/draft.css`, `css/collage.css`) are loaded in addition to `style.css`, only on the pages that need them, and build on the same custom properties.

### JS

- `js/main.js` is loaded on every page and handles three site-wide behaviors: highlighting the active nav link based on the current filename, injecting the current year into the footer, and the mobile nav toggle (collapses nav behind a hamburger button under 640px).
- Page-specific scripts (`blog.js`, `contact.js`, `draft.js`, `collage.js`, `collage-config.js`) are only included on the pages that use them.
- Scripts are self-invoking functions (`(function () { ... })()`), written in ES5-style `var`, and each one guards on the elements it needs (`if (!el) return`) so shared scripts can be safely dropped into any page without erroring when their target elements aren't present.

### Blog engine (`js/blog.js`, `blog.html`, `blog-post.html`, `blog/posts/`)

Client-side, build-free Markdown blog:

- Posts live as `.md` files in `blog/posts/`, each with simple front matter (a `---`-delimited block of flat `key: value` lines — no nested structures) for `title`, `date`, `excerpt`.
- `blog/posts/manifest.json` is a flat JSON array of post slugs. **Adding a post requires two changes**: create the `.md` file and add its slug to `manifest.json`, then commit — there's no auto-discovery.
- `blog.js` fetches the manifest, fetches each post, and runs its own minimal Markdown → HTML converter supporting only: headings, paragraphs, bold/italic, inline code, fenced code blocks, links, blockquotes, and ordered/unordered lists. It does not support images, tables, or nested lists — don't assume standard Markdown/CommonMark coverage when writing posts.
- `blog.html` renders the post list into `#blog-list`, sorted by `date` descending.
- `blog-post.html` renders a single post by reading `?slug=` from the query string and populating `#post-title`, `#post-meta`, `#post-content`.

### NFL draft board (`nfl-draft-2026.html`, `js/draft.js`, `css/draft.css`)

A large static `<table>` of fantasy football rankings. Each row has a "drafted" checkbox (`.drafted-check`) keyed by a `data-idx` attribute; `draft.js` persists checked state to `localStorage` under the key `ppr2026_drafted` as a `{idx: true}` map, and toggles a `.drafted` class on the row. Purely client-side, no backend.

### Photo collage (`photo-collage.html`, `js/collage.js`, `js/collage-config.js`, `css/collage.css`)

A client-side collage builder: tiles accept a photo via click-to-upload or drag-and-drop (read locally with `FileReader`, never uploaded anywhere), layouts are switched via a `data-layout` attribute on the `.collage` container (extra tiles hidden by CSS), and "download as image" rasterizes the visible tiles to a `<canvas>` and exports a PNG.

Preset/default images per tile are configured in `js/collage-config.js` (`COLLAGE_IMAGES`, a slot-number → filename map) and load from `images/collage/` automatically on page load. To add a preset photo: drop the file into `images/collage/` and reference its filename in `collage-config.js`.

### Contact form (`contact.html`, `js/contact.js`)

Client-side only — validates the form and shows a status message, but does not actually send anything anywhere. The submit handler is a placeholder explicitly meant to be replaced with a real endpoint (e.g. Formspree, Netlify Forms) per the comment at the top of `contact.js`.
