---
date: 2025-08-29
draft: true
title: 'From Start to Finish: Moving My Blog to Eleventy + GitHub Pages'
description: "A step-by-step guide on migrating my blog from using Weblog by OMGlol to Eleventy, hosted on GitHub Pages."
tags: [eleventy, github pages, web development, tutorials]
#mastodon_url: https://infosec.exchange/@beardedtechguy/114915822528845707
---

For the longest time, my blog lived in a half-custom setup. I wanted something cleaner, faster, and developer-friendly. Enter **[Eleventy](https://www.11ty.dev/)**, specifically the [Eleventy Excellent theme](https://github.com/madrilene/eleventy-excellent). Here’s how I moved my site, customized it, and deployed it to GitHub Pages with a custom domain.

---

## Why Eleventy Excellent?

Eleventy is a static site generator that’s simple but flexible. Excellent adds:

- A great design system out of the box  
- Organized config structure  
- Useful plugins (RSS, syntax highlighting, drafts, etc.)

That meant I could focus on writing, not reinventing a theme.

---

## Setting Up the Repo

I started by forking the theme and cloning it locally:

```bash
git clone https://github.com/madrilene/eleventy-excellent.git my-blog
cd my-blog
npm install
```

The theme builds with:

```bash
npm run start    # dev server
npm run build    # production build
```

---

## Customizing `eleventy.config.js`

Eleventy Excellent organizes config in `src/_config/`. To add features, you extend `eleventy.config.js`. For example, I wanted **reading time** filters:

```js
// eleventy.config.js
import readingTime from 'eleventy-plugin-reading-time';

export default function(eleventyConfig) {
  // existing plugins...
  eleventyConfig.addPlugin(readingTime);

  // custom filter
  eleventyConfig.addFilter('readTime', (html) => {
    const words = html.split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 225));
    return `${minutes} min read`;
  });
}
```

In my post layout (`post.njk`):

```njk
<p class="meta">
  {{ date | formatDate("LLLL d, yyyy") }} · {{ content | readTime }}
</p>
```

---

## Building Helpers

I wanted my pages to show build time in two formats—human-friendly and file-name style. In `src/_data/helpers.js`:

```js
function buildTimeHuman() {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium',
    timeZone: 'America/Chicago'
  }).format(new Date());
}

function buildTimeFile() {
  const d = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    year: '2-digit', month: '2-digit', day: '2-digit'
  }).formatToParts(d).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});
  return `${parts.month}-${parts.day}-${parts.year}`;
}

export default { buildTimeHuman, buildTimeFile };
```

Usage in a template:

```njk
$ buildtime
{{ helpers.buildTimeHuman() }}

Report saved to /opt/kyle/intel/summary-{{ helpers.buildTimeFile() }}.log
```

---

## Deploying to GitHub Pages

I used [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) to publish the built `dist/` folder.

Workflow file: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci
      - run: ELEVENTY_ENV=production npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: kylereddoch.me
          enable_jekyll: false
```

Key parts:

- **`ELEVENTY_ENV=production`**: ensures minify and prod-only transforms run.  
- **`cname:`**: keeps my custom domain from disappearing each deploy.  
- **`.nojekyll`**: prevents GitHub from hiding files like `_includes`.

---

## Custom Domain

In GitHub repo **Settings → Pages**, I set my domain: `kylereddoch.me` and checked “Enforce HTTPS.”  

On the DNS side, I pointed my domain’s A records to GitHub Pages IPs.

---

## Lessons Learned

- Pin dependencies like `html-minifier-terser` so an update doesn’t suddenly break builds.  
- Use `minifyJS: false` in your HTML minify transform to avoid inline JS errors.  
- Always include a `CNAME` in your published branch if you use a custom domain.

---

## Final Thoughts

The move to Eleventy Excellent plus GitHub Pages gave me a clean, blazing-fast, version-controlled blog. I have full control, from custom filters to build helpers, and deployment is 100% automated.