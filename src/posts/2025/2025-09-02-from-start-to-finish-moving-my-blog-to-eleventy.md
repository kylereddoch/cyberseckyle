---
date: 2025-08-29
draft: true
title: 'From Start to Finish: Moving My Blog to Eleventy + GitHub Pages'
description: "A step-by-step guide on migrating my blog from using Weblog by OMGlol to Eleventy, hosted on GitHub Pages."
tags: [eleventy, github-pages, web development, tutorials]
#mastodon_url: https://infosec.exchange/@beardedtechguy/114915822528845707
---

{% raw %}

For the longest time, my blog lived in on a variety of platforms, with the latest being [OMG.lol](https://omg.lol/). Having a history of web development, I wanted something cleaner, faster, and developer-friendly. I have had my eye on **[Eleventy](https://www.11ty.dev/)** for quite a while, I just needed time for one and a solid theme to start with. Enter [Eleventy Excellent theme](https://github.com/madrilene/eleventy-excellent). I came across this theme on Mastodon and it seemed like the perfect fit. As I started exploring it, I realized it had everything I needed to make the transition smoothly. Or so I thought. I ran into some challenges along the way, especially getting it to work with GitHub Pages. So I thought I would document the process for others who might be in the same boat.

Here’s how I moved my site, customized it, and deployed it to GitHub Pages with a custom domain.

## Why Eleventy Excellent?

Eleventy is a static site generator that’s simple but flexible. Eleventy Excellent adds:

- A great design system out of the box  
- Organized config structure  
- Useful plugins (RSS, syntax highlighting, drafts, etc.)

That meant I could focus on writing, not reinventing a theme. I did some customization to make it my own though. More on that later.

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

## Customizing eleventy.config.js

Eleventy Excellent organizes config in `src/_config/`. To add features, you extend `eleventy.config.js`. For example, I wanted a **reading time** feature that displayed under the post title. Here’s how I added it.

First, I installed the `eleventy-plugin-reading-time` plugin. I ran this from the root of my project using my terminal utility Ghostty but you can use whatever terminal you prefer.

```bash
npm install eleventy-plugin-reading-time
```

Then, I updated `eleventy.config.js` with the following, this allows me to use the reading time feature in my templates.

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

From there you will need to update the template that displays the post metadata. This is found in `src/_includes/post.njk`. There I added the following code alongside the existing metadata which was for the date.

```njk
<p class="meta">
  {{ date | formatDate("LLLL d, yyyy") }} · {{ content | readTime }}
</p>
```

Now I have a nice reading time estimate for each post.

## Building a Helper for Build Time

On the [home page](/), you probably notice the geekly little about section. At the end of that, I wanted to show a `build time` indicator. There is also a part in there that export the details to a log file. I wanted both of these "dates" to be shown differently. One in human-friendly format and the other in a file-name style.

To accomplish that, I created two helper functions in `src/_data/helpers.js`.

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

Then, I used these helpers in my `src/index.njk` template like so:

```njk
$ buildtime
{{ helpers.buildTimeHuman() }}

Report saved to /opt/kyle/intel/summary-{{ helpers.buildTimeFile() }}.log
```

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

## Custom Domain

In GitHub repo **Settings → Pages**, I set my domain: `kylereddoch.me` and checked “Enforce HTTPS.”  

On the DNS side, I pointed my domain’s A records to GitHub Pages IPs.

---

## Lessons Learned

- Pin dependencies like `html-minifier-terser` so an update doesn’t suddenly break builds.  
- Use `minifyJS: false` in your HTML minify transform to avoid inline JS errors.  
- Always include a `CNAME` in your published branch if you use a custom domain.

## Final Thoughts

The move to Eleventy Excellent plus GitHub Pages gave me a clean, blazing-fast, version-controlled blog. I have full control, from custom filters to build helpers, and deployment is 100% automated.

{% endraw %}