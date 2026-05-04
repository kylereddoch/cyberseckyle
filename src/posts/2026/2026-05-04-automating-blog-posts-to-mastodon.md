---
date: 2026-05-04T11:47:55-05:00
title: Automating Blog Posts to Mastodon From My Website
description: I added an opt-in workflow that can publish new blog posts to Mastodon, save the returned Mastodon URL back into the post front matter, and rebuild the site with the discussion thread already connected.
tags: [personal, indie-web, mastodon, eleventy]
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116517435476556765"
mastodon_tags: [IndieWeb, Eleventy, Mastodon, Website]
---

I have been slowly removing little bits of friction from my website.

Not the fun friction. I still like writing in Markdown. I still like having the site live in a GitHub repo. I still like that this place is built with Eleventy and plain files instead of being hidden behind a dashboard somewhere.

But there are a few parts of the publishing flow that have started to feel a little silly.

One of them was Mastodon.

For a while, my process looked like this:

1. Write the article.
2. Commit it to GitHub.
3. Wait for the site to build.
4. Open the finished article.
5. Post it to Mastodon.
6. Copy the Mastodon status URL.
7. Paste that URL back into the article front matter.
8. Commit again.
9. Wait for the site to build again.

That works.

It is also exactly the kind of tiny repetitive workflow that eventually makes me sigh at my own website.

So I added a way for the site to handle that loop for me.

## What I wanted

I did not want every post to automatically go to Mastodon.

Some posts are more personal. Some are drafts that I am still thinking through. Some are small notes that I want to live on the website first without necessarily pushing them into a social feed.

So this needed to be opt-in.

The front matter I landed on looks like this:

```yaml
mastodon_post: true
mastodon_url:
mastodon_tags: [Cybersecurity, InfoSec]
```

That says:

- yes, post this one to Mastodon
- the Mastodon URL is still blank
- use these tags in the Mastodon post

The `mastodon_url` field still matters because it becomes the source of truth after the automation runs. Once the post is published to Mastodon, the workflow writes the returned Mastodon status URL back into that field.

That means the Discuss on Mastodon section on the article can show up right away after the second build.

## The general flow

The workflow is basically:

```txt
Commit article
  -> GitHub Actions builds the site
  -> GitHub Pages deploys the article
  -> Action posts the final URL to Mastodon
  -> Mastodon returns the status URL
  -> Action writes mastodon_url back into front matter
  -> Action rebuilds and redeploys the site
```

The important part is that the site deploys before the Mastodon post goes out.

I wanted the Mastodon post to link to the real article URL, not a URL that might exist in a minute if the build behaves itself. Publishing the site first makes the whole thing feel much safer.

## The Mastodon post format

I also wanted the Mastodon post itself to stay simple.

Right now, the default format is:

```txt
New by me: {Title}

{url}

{mastodon tags from front matter}
```

So a post might look like this:

```txt
New by me: Automating Blog Posts to Mastodon From My Website

https://www.kylereddoch.me/blog/automating-blog-posts-to-mastodon-from-my-website/

#IndieWeb #Mastodon #Eleventy
```

I originally considered including the description too, but it made the Mastodon post feel heavier than I wanted. The title and link are enough. The article can do the article work.

## The script

The core of this is a small Node script.

It scans the Markdown files, reads the front matter, and only does something when it finds:

```yaml
mastodon_post: true
mastodon_url:
```

If `mastodon_url` already has a value, the script skips the file. That keeps it from posting the same article again later.

The status text is built from the title, URL, and Mastodon-specific tags:

```js
function getStatusText(data, postUrl) {
  const title = String(data.title || '').trim();
  const description = String(data.description || '').trim();
  const tags = formatTags(data.mastodon_tags || defaultTags);
  const customStatus = String(data.mastodon_status || '').trim();

  if (customStatus) {
    return customStatus
      .replaceAll('{title}', title)
      .replaceAll('{description}', description)
      .replaceAll('{url}', postUrl);
  }

  const heading = `New by me: ${title}`;

  return [heading, postUrl, tags].filter(Boolean).join('\n\n');
}
```

There is also support for a custom status if I want one:

```yaml
mastodon_status: "New post: {title}\n\n{url}"
```

Most of the time I probably will not need that, but I like having the escape hatch.

## Posting to Mastodon

Mastodon has a clean API endpoint for posting statuses:

```txt
POST /api/v1/statuses
```

The script sends the post using a token stored in GitHub Secrets:

```js
const response = await fetch(`${instance}/api/v1/statuses`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Idempotency-Key': `cyberseckyle-${path.basename(file, '.md')}`
  },
  body: JSON.stringify({
    status,
    visibility: 'public',
    language: 'en'
  })
});
```

The `Idempotency-Key` is there to help avoid accidental duplicate posts if something weird happens during the request. I like that little safety rail.

The Mastodon API returns a status object, and that response includes the URL I need:

```js
const mastodonStatus = await response.json();
const mastodonUrl = mastodonStatus.url || mastodonStatus.uri;
```

Then the script writes it back into the article:

```yaml
mastodon_url: "https://infosec.exchange/@cyberseckyle/..."
```

That is the part that removes the old copy-paste step.

## The GitHub Actions part

The workflow does a two-pass deploy.

First it builds and deploys the site like normal:

```yaml
- name: Build site
  run: npm run build-ghpages

- name: Deploy to gh-pages
  run: bash scripts/deploy-gh-pages.sh "Deploy ${GITHUB_SHA}"
```

Then it posts eligible articles to Mastodon:

```yaml
- name: Post eligible articles to Mastodon
  id: post_mastodon
  run: node scripts/post-to-mastodon.mjs
  env:
    MASTODON_ACCESS_TOKEN: ${{ secrets.MASTODON_ACCESS_TOKEN }}
    MASTODON_INSTANCE: ${{ secrets.MASTODON_INSTANCE }}
    MASTODON_SITE_URL: https://www.kylereddoch.me
```

If anything was posted, the workflow commits the updated Markdown file:

```yaml
- name: Commit Mastodon URLs
  if: ${{ steps.post_mastodon.outputs.posted_count != '0' }}
  run: |
    git add src/posts src/notes
    git commit -m "Add Mastodon URLs for published posts"
    git push
```

Then it rebuilds and deploys again so the live article includes the Mastodon discussion section right away.

That second deploy is important because GitHub Actions does not always trigger a fresh workflow from a push made by `GITHUB_TOKEN`. Keeping the second build in the same workflow makes the behavior predictable.

## The secrets

The token does not live in the repo.

Locally, I can test with a private `.env` file if I need to, but GitHub gets the real values from repo secrets:

```txt
MASTODON_INSTANCE=https://infosec.exchange
MASTODON_ACCESS_TOKEN=...
```

The access token needs permission to write statuses.

That is all the workflow needs to post on my behalf.

## Why this feels right for my site

This is one of those small automations that makes the site feel more like a system I actually enjoy using.

It does not replace writing.

It does not replace the blog.

It does not force everything onto Mastodon.

It just removes the repetitive part when I already know a post should go there.

I still get to decide which articles are shared. I still get to keep the website as the source of truth. I still get the Mastodon discussion section on the article. I just do not have to do the weird little publish-copy-paste-rebuild dance every time.

That is the sweet spot I keep chasing with this site.

Not automation for its own sake.

Automation that makes the human part easier to keep doing.
