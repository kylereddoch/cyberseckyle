---
date: 2025-12-10T12:00:00-05:00
title: 'Cooling Down the Servers by Adding a Little Snow'
description: "Cool your servers off with some CSS snow as we wire up the snow-fall web component in a self hosted Eleventy setup, complete with color, count, and reduced motion tweaks."
tags: [eleventy, web-components, javascript, site-tweaks, fun]
mastodon_url: "https://infosec.exchange/@cyberseckyle/115697115782901181"
---

{% image "/assets/images/snow-fall-component.png", "Snowy digital illustration of a server stack with snow piling on and around it under falling flakes on a warm Catppuccin-Mocha background, representing adding a snow-fall effect to an Eleventy site.", null, "eager", "text-center", "!important", [750], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

Sometimes the servers are running hot, the tickets are piling up, and you just want your site to chill out a little. So I did the obvious thing and added snow.

Zach Leatherman’s [snow-fall web component](https://www.zachleat.com/web/snow-fall/) is a tiny script that lets you drop a subtle snow effect on your site with one HTML tag. It is zero-dependency and installable from npm as @zachleat/snow-fall.

In this post I walk through:

- Self-hosting `snow-fall.js` on **any** static site  
- Wiring it into an **Eleventy** site using `addPassthroughCopy`  
- A quick tour of the custom options: emoji snow, colors, sizes, and more  

No CDNs, no magic, just one small web component and some wiring.

## What is snow-fall?

At a high level:

- It is a Web Component that you load with a `<script type="module" src="snow-fall.js"></script>` tag.
- You add `<snow-fall></snow-fall>` to your HTML and it renders animated “flakes” over the page or a specific element.

By default it:

- Respects `prefers-reduced-motion` when used with `<is-land>`.
- Uses 100 flakes with a size of 10px (you can change both).
- Can render over the full page or a single element.

Now let’s make it your own.

## Self-hosting snow-fall on any static site

This is the generic “no build tools needed” version.

### 1. Download snow-fall.js

Grab the file directly from GitHub:

- Repo: [zachleat/snow-fall on GitHub](https://github.com/zachleat/snow-fall)  
- File path: `snow-fall.js` in the repo root

Download that file and drop it somewhere in your project. For example:

```text
assets/
  js/
    snow-fall.js
index.html
```

### 2. Add the script tag

In your HTML’s `<head>`, add the script tag to load the component:

{% raw %}

```html
<script type="module" src="/assets/js/snow-fall.js"></script>
```

{% endraw %}

Because it is a native web component, there is no extra framework setup.

### 3. Add snow to the whole page

Somewhere in your `<body>`:

{% raw %}

```html
<snow-fall></snow-fall>
```

{% endraw %}

That will overlay snow across the viewport.

### 4. Add snow to a specific element

If you want to keep the snow inside a section, you can nest content inside `<snow-fall>`:

{% raw %}

```html
<snow-fall>
  <div style="width: 300px; height: 300px;">
    <h2>Our “cooling zone”</h2>
    <p>Only this box gets snowed on.</p>
  </div>
</snow-fall>
```

{% endraw %}

The component will then render inside that first child element instead of the entire page.

That is the basic vanilla static-site setup.

## Using snow-fall on an Eleventy site with passthrough

Now for the Eleventy version, using npm and `addPassthroughCopy`. This is the pattern I am using so I can keep `snow-fall` as a dependency and still self-host the script.

### 1. Install snow-fall via npm

From your project root, run:

```bash
npm install @zachleat/snow-fall
```

This adds it to your `node_modules` folder.

```text
node_modules/@zachleat/snow-fall/snow-fall.js
```

### 2. Configure Eleventy to passthrough snow-fall.js

In your `eleventy.config.js` (or `eleventy.config.cjs` depending on your setup), wire up a passthrough:

```js
export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "node_modules/@zachleat/snow-fall/snow-fall.js":
      "assets/js/snow-fall.js",
  });

  // …the rest of your config
}
```

For CommonJS style:

```js
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "node_modules/@zachleat/snow-fall/snow-fall.js":
      "assets/js/snow-fall.js",
  });

  // …the rest of your config
};
```

On build, Eleventy will copy the file so it ends up at:

```text
_site/assets/js/snow-fall.js
```

### 3. Add the script tag in base layout

In something like `src/_includes/layouts/base.njk` (or whatever your main layout is), add this before `</body>`:

```html
<script type="module" src="/assets/js/snow-fall.js" defer></script>
```

f you want to keep the snow logic on specific layouts only, you can wrap it in a conditional (for example using front matter flags), but the core idea is the same.

### 4. Use snow-fall with is-land

Eleventy projects often use [is-land](https://github.com/11ty/is-land) for partial hydration and to respect prefers-reduced-motion. Zach [recommends pairing](https://www.zachleat.com/web/snow-fall/?utm_source=chatgpt.com) the two so users who prefer less motion are not stuck under a blizzard.

Drop this where you want the snow:

{% raw %}

```html
<is-land on:media="(prefers-reduced-motion: no-preference)">
  <snow-fall></snow-fall>
</is-land>
```

{% endraw %}

This keeps the snow off for users who have reduced motion enabled.

At this point your Eleventy build is self-hosting the script and rendering snow only when it is welcome.

## Tweaking the snow: emoji, color, count, and size

The fun part is that `<snow-fall>` is pretty configurable, and the API is intentionally small.

#### Use text content instead of circles

If you want snowflake emoji, or even little server icons, you can use text:

{% raw %}

```html
<snow-fall text="❄️"></snow-fall>
or
<snow-fall text="🖥️"></snow-fall>
```

{% endraw %}

This works nicely with the size variable we will touch next.

#### Change the color with a CSS variable

The default color is white, but you can set `--snow-fall-color` inline or in a stylesheet:

{% raw %}

```html
<!-- Inline style -->
<snow-fall style="--snow-fall-color: rebeccapurple;"></snow-fall>
```

{% endraw %}

Or via CSS:

```css
snow-fall.cooling-zone {
  --snow-fall-color: var(--accent-color);
}
```

{% raw %}

```html
<snow-fall class="cooling-zone"></snow-fall>
```

{% endraw %}

#### Change the number of flakes

By default it renders 100 flakes. You can bump that up or down with the `count` attribute:

{% raw %}

```html
<!-- Double the default -->
<snow-fall count="200"></snow-fall>
```

{% endraw %}

Be kind to mobile GPUs and do not go wild here.

#### Change the size of the flakes

You can control flake size using the `--snow-fall-size` CSS variable. Default is 10px, but you can increase it:

{% raw %}

```html
<snow-fall style="--snow-fall-size: 20px;"></snow-fall>
```

{% endraw %}

This also affects emoji mode, so you can scale your ❄️ or other glyphs just by changing this value.

## Wrapping up

From a practical standpoint, `<snow-fall>` is exactly the kind of thing I like on a production site: small, zero-dependency, and easy to shut off if something breaks. No extra frameworks, no build-step gymnastics, just a single file and a custom element.

On a busy day in the SOC or the MSP trenches, sometimes it is nice to look at your own homepage and see the servers “cooling down” under a quiet snowfall, even if you know the CPUs are still doing their thing in the background.

If you want to go deeper, check out:

- Zach’s blog post about the component: [snow-fall Web Component](https://www.zachleat.com/web/snow-fall/)
- The GitHub repo with the full README and demo links: [zachleat/snow-fall](https://github.com/zachleat/snow-fall)

Now your site can be as chill as you pretend you are during year-end change freezes.