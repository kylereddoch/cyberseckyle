---
date: 2026-05-22T10:19:43-05:00
title: Improving My RSS Feed and Making It More Human Readable
description: I cleaned up my site's web feed so feed readers get better post content and images, while humans who open the feed in a browser get something that feels like part of the site.
tags: [personal, indie-web, eleventy, rss]
mastodon_post: true
mastodon_url: 
mastodon_tags: [IndieWeb, Eleventy, 11ty]
---

I have always liked that RSS is boring in the best possible way.

It does not need a recommendation engine. It does not need a timeline ranking model. It does not care whether a platform wants to show someone my post today. A feed is just a quiet agreement between a site and a reader: when I publish something new, your reader can come check.

That is exactly the kind of web plumbing I want this site to have.

But this week I noticed my own feed had gotten a little too quiet.

The posts were showing up in some places, but the images were not behaving the way I expected. Feed readers were not consistently seeing the hero image for a post, and opening the feed directly in a browser looked like raw XML. Technically valid, maybe, but not exactly friendly.

So I cleaned it up.

## What I wanted the feed to do

The image logic was the first thing I wanted to fix.

My actual post pages use Eleventy's image transform, which means a hero image written in front matter as something like this:

```yaml
featuredImage: /assets/images/ai_in_soc.png
featuredImageAlt: A glowing artificial intelligence brain hovering in a security operations center.
```

does not stay at `/assets/images/...` in the final page. The built site serves the optimized version from `/img/...`.

That mattered because my first feed attempt was still pointing feed readers at the original source path. The browser page had a working transformed image, but the feed was telling readers to look somewhere else.

The rule I wanted was simple:

1. Use the post's hero image first.
2. If there is no hero image, use the generated post Open Graph image.
3. If neither of those can be built, use the site's default Open Graph image.

In practice, that meant giving the feed its own small image helper:

```js
export const feedImage = async (post, meta = {}) => {
  const data = post?.data || {};
  const heroImage = data.featuredImage || data.featured_image;
  const defaultImage = meta.opengraph_default || '/assets/images/template/opengraph-default.jpg';

  if (heroImage) {
    return {
      url: absoluteUrl(await transformedImageUrl(heroImage), meta.url),
      alt: data.featuredImageAlt || data.featured_image_alt || data.title || ''
    };
  }

  if (data.title) {
    return {
      url: absoluteUrl(`/assets/og-images/${slugifyString(String(data.title))}-preview.jpeg`, meta.url),
      alt: data.title
    };
  }

  return {
    url: absoluteUrl(defaultImage, meta.url),
    alt: meta.opengraph_default_alt || ''
  };
};
```

The important part is that a hero image goes through the same Eleventy image transform path as the visible page image. That keeps the feed aligned with the built site instead of leaking source asset paths into the published feed.

## Why I changed the XML feed shape

The next problem was feed reader behavior.

Feed readers are usually forgiving, but they are not all forgiving in the same way. I had an Atom feed that looked fine in a browser and had the content in the XML, but Feedbin was still showing only the title for entries. That is the kind of bug that makes you stare at perfectly visible XML and wonder what you are missing.

Rather than keep trying to convince every reader to like my Atom output, I changed `/feed.xml` to a more common RSS 2.0 shape:

```xml
<item>
  <title>Post title</title>
  <link>https://www.kylereddoch.me/blog/example/</link>
  <guid isPermaLink="true">https://www.kylereddoch.me/blog/example/</guid>
  <description><![CDATA[Short summary here.]]></description>
  <content:encoded><![CDATA[
    <p><img src="https://www.kylereddoch.me/img/example.jpeg" alt="Example image" /></p>
    <p>Full post content here.</p>
  ]]></content:encoded>
</item>
```

That gives feed readers a short summary in `description` and the full post body in `content:encoded`. The full HTML is wrapped in CDATA so the feed stays XML-safe without turning the post into a wall of escaped tags.

This is not glamorous work, but it is the kind of compatibility work that makes a personal site feel sturdier.

## Making the feed readable for people too

The other thing I wanted was a better browser experience, but I did not want to make the machine-readable feed depend on browser-only behavior.

Most people will never open `/feed.xml` directly. That is fine. It is mostly for feed readers. If someone does want a friendlier browser view, though, they should not have to stare at raw XML and wonder whether something broke.

So I kept `/feed.xml` as the canonical feed and gave it one companion format:

```txt
/feed.xml  -> the main RSS feed, styled with CSS for browsers
/feed.json -> JSON Feed for readers that prefer it
```

The XML feed points to a regular CSS file, and both feeds are limited to the latest 15 entries:

```xml
<?xml-stylesheet href="/feed.css" type="text/css"?>
```

I learned the hard way that CSS alone is not enough here. It can make XML look nicer, but it cannot turn an RSS `<link>` text node into a real browser link, and it cannot render an image from a `media:thumbnail` URL attribute.

So the browser view gets a tiny bit of namespaced XHTML inside the RSS:

```xml
<xhtml:a class="browser-title" href="https://www.kylereddoch.me/blog/example/">
  Post title
</xhtml:a>
<xhtml:img class="browser-image" src="https://www.kylereddoch.me/img/example.jpeg" alt="Example image" />
<description><![CDATA[Short summary here.]]></description>
<xhtml:a class="browser-read-link" href="https://www.kylereddoch.me/blog/example/">
  Read on kylereddoch.me
</xhtml:a>
```

Feed readers can ignore those browser-only helper elements and keep using the normal RSS fields. A person opening `/feed.xml` in a browser gets real links, visible images, and a read link after the summary without needing an XSLT transform.

That is not the same as asking the browser to transform the XML into HTML. It leaves the feed as RSS, lets feed readers ignore the styling, and gives someone opening the XML in a browser a page that feels less abandoned.

It is still a web feed. It just has a better front porch now.

## The tiny details matter

This whole change is a good reminder that owning a website means owning the little connective pieces too.

The post page can look good while the feed is quietly weird. The Open Graph image can work while the feed image is broken. The XML can be valid while a reader decides not to show the content. The browser can display something that a feed app ignores.

None of those are dramatic problems by themselves, but they shape how the site travels.

RSS is still one of my favorite parts of the web because it puts the reader in control. If I want people to follow this site that way, I should treat the feed like a real part of the site instead of an afterthought.

That is what this cleanup was about.

Better images. Better compatibility. A friendlier page for humans. A feed that feels a little more like the rest of the place it belongs to.
