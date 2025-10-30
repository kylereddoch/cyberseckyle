---
date: 2025-10-30T10:00:00-05:00
title: "Embedding Mastodon Posts in Eleventy: My Journey"
description: "What finally worked to embed Mastodon posts in Eleventy: a tiny shortcode that lets embed.js set height and supports a clean full-bleed layout."
tags: [eleventy, mastodon, tutorials]
#mastodon_url: https://infosec.exchange/@cyberseckyle/115452568772511610
---

![Mastodon Embed hero](/assets/images/mastodon_embed_eleventy_hero.png){loading="eager" eleventy:widths="auto"}

I wanted a Mastodon status to sit inside an Eleventy post without breaking my layout or forcing weird fixed sizes. I tried the usual suspects and hit the same walls each time. In the end, a simple shortcode solved it. The page controls width and Mastodon’s script sets height. It also supports a full-bleed option when I want the embed to break out of the narrow reading column.

This write-up documents what failed fast, what finally worked, and the exact code I am using now.

## What I tried first

- oEmbed or plugin output that injected an iframe with fixed width and height. Looked fine at one breakpoint, broke at others.
- CSS overrides on the iframe. As soon as the script rerendered, my sizes lost.
- Loading the iframe before the embed script. The first height message went missing, so the card stayed short.

## The working approach

- I control **width** with the container. Inside the prose column it uses the column width. In full-bleed mode it uses `min(100vw, cap)`.
- Mastodon controls **height**. No fixed height is set. Height is updated by `embed.js` via `postMessage`.
- I load `embed.js` **before** the iframe so the listener is ready when the first message arrives.

## Step 1: Add the shortcode to eleventy.js

Paste this function into your Eleventy config and register it. It guards against loading the script twice per origin and supports an optional `bleed` layout.

```js
// Mastodon Direct-Embed: bleed-friendly, auto-height reliable
async function mastodonEmbedShortcode(statusUrl, maxWidth = 720, layout = 'normal') {
  try {
    const u = new URL(String(statusUrl));
    const embedSrc  = `${u.origin}${u.pathname}/embed";
    const scriptSrc = `${u.origin}/embed.js`;
    const w = Math.max(1, Number(maxWidth) || 720);
    const bleed = String(layout).toLowerCase() === 'bleed';

    // Wrapper: normal uses a capped box; bleed escapes the prose column and centers content
    const wrapperStyle = bleed
      ? `style="width:100vw; position:relative; left:50%; right:50%; margin-left:-50vw; margin-right:-50vw; display:grid; place-items:center;"`
      : `style="max-width:${w}px; margin:0 auto;"`;

    // Iframe: do not fix height; let embed.js resize it. Give a small min-height to avoid a flash.
    const iframeStyle = bleed
      ? `style="width:min(100vw, ${w}px); border:0; display:block; overflow:hidden; min-height:300px;"`
      : `style="width:100%; border:0; display:block; overflow:hidden; min-height:300px;"`;

    // Load embed.js first (non-async), once per origin
    const loaderId = `masto-embed-loader-${u.origin.replace(/[^a-z0-9]/gi, '')}`;
    const loader = \`
<script>
  (function(id, src){
    if (!document.getElementById(id)) {
      var s = document.createElement('script');
      s.id = id; s.src = '\${scriptSrc}';
      document.head.appendChild(s);
    }
  })('\${loaderId}', '\${scriptSrc}');
</script>\`.trim();

    return \`
\${loader}
<div class="mastodon-embed-wrapper" \${wrapperStyle}>
  <iframe
    class="mastodon-embed"
    src="\${embedSrc}"
    \${iframeStyle}
    sandbox="allow-scripts allow-same-origin allow-popups"
    allow="fullscreen"
    loading="lazy"
  ></iframe>
</div>\`.trim();

  } catch {
    return \`<p><a href="\${statusUrl}">\${statusUrl}</a></p>\`;
  }
}

// Register for all template engines you use
eleventyConfig.addNunjucksAsyncShortcode('mastodon', mastodonEmbedShortcode);
eleventyConfig.addLiquidShortcode('mastodon', (url, w, layout) => mastodonEmbedShortcode(url, w, layout));
eleventyConfig.addJavaScriptFunction('mastodon', mastodonEmbedShortcode);
```

## Step 2: Use it in content

Inside the regular reading column:

{% raw %}

```njk
{% mastodon "https://mastodon.social/@deejayy/115454110249651937" %}
```

{% endraw %}

Full-bleed across the viewport, capped at 720:

{% raw %}

```njk
{% mastodon "https://mastodon.social/@deejayy/115454110249651937", 720, "bleed" %}
```

{% endraw %}

## Result

Here is how the embed would look on your page:

Regular width:
{% mastodon "https://infosec.exchange/@cyberseckyle/115452568772511610" %}

Full-bleed:
{% mastodon "https://infosec.exchange/@cyberseckyle/115452568772511610", 720, "bleed" %}

## Troubleshooting quick hits

- If the height never adjusts, check for a global CSS rule that forces `iframe { height: ... !important }`.
- Make sure your Content Security Policy allows `<instance>/embed.js`.
- Ad blockers can sometimes block the script. Allow it.
- If you use multiple Mastodon instances on one page, this loader only injects one script per origin.

## Why I skipped plugins this time

I like batteries-included tools, but the layout rules in my theme are opinionated. A small shortcode gave me reliable control over width while letting Mastodon handle height correctly. Less glue, fewer surprises.

## References

- Eleventy Plugin: Embed Everything  
  https://gfscott.com/embed-everything/
- eleventy-plugin-embed-everything (npm)  
  https://www.npmjs.com/package/eleventy-plugin-embed-everything
- eleventy-plugin-embed-mastodon (npm)  
  https://www.npmjs.com/package/eleventy-plugin-embed-mastodon
- Andy Piper — Mastodon oEmbed examples  
  https://andypiper.org/mastodon-embeds-examples/single-post-oembed.html
