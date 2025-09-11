---
date: 2025-09-04T14:00:00-05:00
title: 'From Start to Finish: Moving My Blog to Eleventy + GitHub Pages'
description: "A step-by-step guide on migrating my blog from using Weblog by OMGlol to Eleventy, hosted on GitHub Pages."
tags: [eleventy, github-pages, web development, tutorials]
mastodon_url: https://infosec.exchange/@cyberseckyle/115146980155527998
---

![A hero image showing Eleventy and GitHub logos](/assets/images/eleventy_github@2x.jpg){loading="eager" eleventy:widths="auto"}

{% raw %}

For the longest time, my blog lived on a variety of platforms, with the latest being OMG.lol. Having a history of web development, I wanted something cleaner, faster, and developer-friendly. I have had my eye on **[Eleventy](https://www.11ty.dev/)** for quite a while, I just needed time for one and a solid theme to start with. Enter [Eleventy Excellent theme](https://github.com/madrilene/eleventy-excellent). I came across this theme on Mastodon and it seemed like the perfect fit. As I started exploring it, I realized it had everything I needed to make the transition smoothly. Or so I thought. I ran into some challenges along the way, especially getting it to work with GitHub Pages. So I thought I would document the process for others who might be in the same boat.

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

First, I installed the `eleventy-plugin-reading-time` plugin. I ran this from the root of my project using my preferred terminal utility, [Ghostty](/blog/enhancing-my-terminal-experience), but you can use whatever terminal you prefer.

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

From there I updated the template that displays the post metadata. This is found in `src/_includes/post.njk`. There I added the following code alongside the existing metadata which was for the date.

```njk
<p class="meta">
  {{ date | formatDate("LLLL d, yyyy") }} · {{ content | readTime }}
</p>
```

Now I have a nice reading time estimate for each post.

## Building a Helper for Build Time

On the [home page](/), you probably notice the geekly little about section. At the end of that, I wanted to show a `build time` indicator. There is also a part in there that exports the details to a log file. I wanted both of these "dates" to be shown differently. One in human-friendly format and the other in a file-name style.

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

Then, I used these helpers in the `src/index.njk` template like so:

```njk
$ buildtime
{{ helpers.buildTimeHuman() }}

Report saved to /opt/kyle/intel/summary-{{ helpers.buildTimeFile() }}.log
```

## Deploying to GitHub Pages

Next up was deployment. I wanted to host my blog on GitHub Pages for free hosting with a custom domain. The challenge was that GitHub Pages expects the site to be in the root, but Eleventy Excellent builds to `dist/`.

I also had issues with GitHub Pages not liking certain files. To fix this, I added a `.nojekyll` file to the `eleventy_build.yaml` file (more on this later) during the build process. This prevents GitHub from ignoring files and folders that start with an underscore, like `_includes`. Github Pages has a built-in Jekyll processor that can interfere with static sites, so this file tells GitHub to skip that step.

During building the site, I also wanted to ensure that my custom domain (`kylereddoch.me`) was preserved. To do this, I added a `CNAME` file to the `dist/` folder during the build process. Everytime I built the site, my custom domain would be removed, so this step was crucial.

While building the site, I received a random error from the `html-minifier-terser` package on one of my pages that was previous working. After some digging, I found out that the html-minifier-terser package itself was the isssue. To fix this, I did the following:

1. Made the transform resilient (try/catch + safer options), and
2. Switched the transform to a normal function so we can read page data (lets you skip minify per-post if needed).

The updated html-minifier-terser in `src/_config/plugins/html-config.js` looks like this:

```js
import htmlmin from 'html-minifier-terser';

const isProduction = process.env.ELEVENTY_ENV === 'production';

export const htmlConfig = (eleventyConfig) => {
  eleventyConfig.addTransform('html-minify', function (content, outputPath) {
    // Only run for built HTML in production
    if (!isProduction || !outputPath || !outputPath.endsWith('.html')) return content;

    // Optional: allow per-page opt-out with `no_minify: true` in front matter
    const page = this.page || {};
    if (page.data && page.data.no_minify) return content;

    try {
      return htmlmin.minify(content, {
        // Safe defaults that won’t mangle modern inline JS/attrs
        collapseWhitespace: true,
        removeComments: true,
        keepClosingSlash: true,

        // Common breakage point—turn off JS mangling for inline scripts and Alpine/HTMX attrs
        minifyJS: false,

        // Still fine to minify CSS
        minifyCSS: true,

        // Helps with custom elements / mixed-case tags
        caseSensitive: true,

        // If you literally print Nunjucks/shortcode braces in code snippets
        ignoreCustomFragments: [/{%[\s\S]*?%}/, /{{[\s\S]*?}}/],

        // (Optional) what you already had
        collapseBooleanAttributes: true,
        decodeEntities: true,
        includeAutoGeneratedTags: false
      });
    } catch (err) {
      console.warn(`[html-minify] skipped ${outputPath}: ${err?.message || err}`);
      return content; // don’t fail the build
    }
  });
};
```

**Why this helped:**

- `minifyJS: false` avoids most “worked yesterday, broken today” issues caused by inline modules or attributes like x-data="{ open: false }".
- `function (…)` instead of an arrow gives access to this.page, so you can set no_minify: true in a post’s front matter if one page is spicy.
- `try/catch` keeps one odd page from nuking the whole build.

## Workflow file: .github/workflows/eleventy_build.yml

For deployment, I used [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) as my starting point to publish Eleventy’s `dist/` folder to GitHub Pages. I made some tweaks to ensure it worked smoothly with Eleventy Excellent and the customizations I referenced earlier.

Here’s the complete workflow file I used, located at `.github/workflows/eleventy_build.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-22.04
    permissions:
      contents: write
    concurrency:
      group: ${{ github.workflow }}-${{ github.ref }}
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Persist npm cache
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package.json') }}

      - name: Persist Eleventy .cache
        uses: actions/cache@v3
        with:
          path: ./.cache
          key: ${{ runner.os }}-eleventy-fetch-cache

      - name: Install dependencies
        run: npm install

      - name: Build site
        run: npm run build-ghpages
        env:
          TZ: America/Chicago

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          publish_branch: gh-pages # default, but being explicit is nice
          cname: www.kylereddoch.me # <-- your apex (or subdomain if that’s your site)
          enable_jekyll: false # writes .nojekyll so assets aren’t hidden
```

**Key parts:**

- **`ELEVENTY_ENV=production`**: ensures minify and prod-only transforms run.  
- **`cname:`**: keeps my custom domain from disappearing each deploy.  
- **`.nojekyll`**: prevents GitHub from hiding files like `_includes`.

### Lessons Learned

- Pin dependencies like `html-minifier-terser` so an update doesn’t suddenly break builds.  
- Use `minifyJS: false` in your HTML minify transform to avoid inline JS errors.  
- Always include a `CNAME` in your published branch if you use a custom domain.

## Using my Custom Domain

In GitHub repo **Settings → Pages**, I set my domain: `www.kylereddoch.me` and checked “Enforce HTTPS.”  

On the DNS side, I pointed my domain’s A records to GitHub Pages IPs and added a CNAME record for `www.kylereddoch.me`. For more details, see [GitHub’s custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Final Thoughts

The move to Eleventy Excellent using GitHub Pages was a bit of a challenge, but it ultimately gave me a clean, blazing-fast, version-controlled blog. I have full control, from custom filters to build helpers, and deployment is 100% automated. With how customizable Eleventy is, I’m excited to keep tweaking and improving my site.

With a bit of patience and tweaking, you can get a similar setup going for your own site.

{% endraw %}