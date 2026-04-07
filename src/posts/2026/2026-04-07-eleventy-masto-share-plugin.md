---
date: 2026-04-07T13:00:00-05:00
title: 'I Built an Eleventy Plugin for Sharing Posts to Mastodon'
description: "A new Eleventy plugin that adds a Mastodon share button with an instance picker, saved instance support, and shortcode helpers."
featuredImage: /assets/images/eleventy-masto-share-img.png
tags: [eleventy, mastodon, open-source, plugin, fediverse]
category: projects
mastodon_url: 
---

I am happy to share a new open source project I have been working on: `@kylereddoch/eleventy-plugin-mastodon-share`.

You can browse the source on [GitHub](https://github.com/kylereddoch/eleventy-plugin-mastodon-share) and try the [live demo](https://eleventy-plugin-mastodon-share.vercel.app/).

It is a small Eleventy plugin that makes it easier for people to share posts from your site to Mastodon.

If you have ever tried to add Mastodon sharing to a website, you already know the awkward part: there is no single universal destination the way there is with some other social platforms. People need to post through their own Mastodon instance, which means a simple "share this post" button is usually not enough.

That is the problem I wanted to solve.

## What This Plugin Does

This plugin adds a Mastodon share button to an Eleventy site, along with a small instance picker that helps visitors choose where they want to post.

It includes:

- a main "Share on Mastodon" button
- a prompt for entering a custom Mastodon instance
- a list of popular instances to choose from
- the ability to save a preferred instance for future shares
- shortcode helpers so Eleventy users do not have to hand-build all of the markup and logic themselves

The goal was to make this feel easy for both sides:

- easy for site owners to install and use
- easy for readers to actually share something without confusion

## Why I Built It

I wanted a Mastodon sharing experience that fit naturally into Eleventy.

There are plenty of ways to build your own share button, but once you start dealing with instance selection, remembering preferences, progressive enhancement, and reusable templates, it becomes more work than it should be.

I wanted something I could drop into an Eleventy site and feel good about sharing with the broader community too.

## How It Works

Once the plugin is added to an Eleventy project, you can load its assets in your layout and render the share UI with a shortcode.

For a basic post layout, it can look like this:

{% raw %}

```njk
{% mastodonSharePost title=title, description=description, hashtags=mastodon_hashtags %}
```

{% endraw %}

The plugin can build the share text from your page data, include the page URL, and pass hashtags through to Mastodon.

For people visiting your site:

1. If they already saved an instance, the button opens that instance directly.
2. If they have not saved one yet, they can enter their own instance.
3. They can also choose from a list of popular instances and save one for next time.

That means the share flow is much smoother than dropping people onto a generic page and expecting them to figure everything out on their own.

## Built for Eleventy

One thing that mattered to me with this project was making it feel like an Eleventy plugin, not just a chunk of copied template code.

It supports:

- Nunjucks
- Liquid
- Eleventy JavaScript templates

It also includes helper shortcodes for:

- rendering the share UI
- rendering the stylesheet
- rendering the script
- rendering both assets together

So instead of rebuilding the same pattern in each project, users can install the plugin and get going much faster.

## A Few Things I Wanted to Get Right

I wanted this to be practical, lightweight, and approachable.

So the plugin is designed around a few simple ideas:

- it should work well with regular Eleventy projects
- it should not require a heavy setup
- it should offer sensible defaults
- it should still be customizable if someone wants to adapt it to their site
- it should help readers share to Mastodon in a way that makes sense

It also uses progressive enhancement, so the experience still has a fallback even if JavaScript is unavailable.

## Who This Is For

This plugin is for Eleventy users who:

- publish blog posts or articles
- want to encourage sharing on Mastodon
- do not want to reimplement instance selection from scratch
- want a reusable solution they can drop into layouts and templates

If you write on the open web and care about the fediverse, I hope this makes your site a little more helpful to your readers.

## Getting Started

Install the package:

```bash
npm install @kylereddoch/eleventy-plugin-mastodon-share
```

Register it in your Eleventy config:

```js
import mastodonShare from "@kylereddoch/eleventy-plugin-mastodon-share";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(mastodonShare, {
    siteUrl: "https://example.com",
    emitStylesheetLink: false,
  });
}
```

Then load the assets in your layout:

{% raw %}

```njk
{% mastodonShareAssets %}
```

{% endraw %}

And render the share UI where you want it:

{% raw %}

```njk
{% mastodonSharePost title=title, description=description, hashtags=mastodon_hashtags %}
```

{% endraw %}

If you want more control, the plugin also supports a lower-level shortcode for custom share text and additional configuration options.

## Open Source and Community

This project is open source, and I built it with the Eleventy community in mind.

I want it to be genuinely useful, easy to understand, and easy to improve over time.

If you try it and have ideas, feedback, bug reports, or suggestions, I would love to hear from you.

## Links

- [GitHub Repository](https://github.com/kylereddoch/eleventy-plugin-mastodon-share)
- [Live Demo](https://eleventy-plugin-mastodon-share.vercel.app/)
- [npm Package](https://www.npmjs.com/package/@kylereddoch/eleventy-plugin-mastodon-share)

## Final Thoughts

I love small tools that solve specific problems well, especially when they help make the open web a little easier to use.

That is what I hope this plugin does.

If you use Eleventy and want a cleaner Mastodon sharing experience on your site, I hope `eleventy-plugin-mastodon-share` is helpful.
