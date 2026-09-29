---
date: 2026-09-29T14:50:00-05:00
title: I Built Drift to Share Articles and Passages to Mastodon
seoTitle: Drift for Chrome Makes Sharing to Mastodon Less Repetitive
slug: drift-share-to-mastodon
description: I built Drift for Chrome to turn a highlighted passage, title, and link into an editable Mastodon draft. Here is how it works and what stays in your browser.
searchIntent: Explain how Drift shares articles and highlighted passages from Chrome to Mastodon, including installation, server selection, privacy, and current store availability.
featuredImage: /assets/images/drift-hero.png
featuredImageAlt: Drift's white rising quotation marks and wordmark on a blue background
featuredImageCaption: 'Original Drift promotional artwork from my <a href="https://github.com/kylereddoch/drift">Drift project</a>, released under the <a href="https://github.com/kylereddoch/drift/blob/main/LICENSE">MIT license</a>.'
tags: [projects, open-source, mastodon, fediverse, browsers]
category: projects
social:
  post_to: [mastodon, x, linkedin]
  tags: [Mastodon, Fediverse, OpenSource]
  status:
    mastodon: |-
      I built Drift for Chrome. Highlight a passage, click the icon, and edit a Mastodon draft with the quote first, then the title and link.

      It opens your server's composer for the final review. Version 1.0.0 is submitted for store review; the GitHub build is available now.

      {url}

      #Mastodon #Fediverse #OpenSource
    x: |-
      I built Drift: highlight a passage in Chrome, click the icon, and edit a Mastodon draft with the quote, title, and link. Submitted for store review; GitHub build available.

      {url}

      #Mastodon #OpenSource
    linkedin: |-
      My newest project is Drift, a Chrome extension for sharing articles and selected passages to Mastodon.

      I wanted the passage that prompted a share to appear first, with the title and link beneath it. Drift prepares that draft, lets you edit it and choose a saved server, then opens Mastodon for the final review and publication.

      The implementation uses temporary access to the page you choose to share, local preferences, and session-only drafts. It needs no Mastodon password or API token. The post explains the tradeoff of passing a draft through a share URL, along with installation and the limits of selected-text capture.

      Version 1.0.0 has been submitted for Chrome Web Store review. The source and submission build are available on GitHub.

      {url}

      #Mastodon #Fediverse #OpenSource
---

Sharing a passage from an article can mean copying the quote, opening Mastodon, finding the article again for its title and URL, and assembling the post by hand. I wanted to highlight the part worth sharing, click an extension icon, and have those pieces waiting in an editable draft.

That is the workflow behind **Drift — Share to Mastodon**, my new Chrome extension. The highlighted passage comes first, followed by the title and link. You can add your thoughts, choose a saved server, and continue to Mastodon to review and publish.

I have submitted version 1.0.0 for Chrome Web Store review. While that is pending, the [source and submission build are available on GitHub](https://github.com/kylereddoch/drift/releases/tag/v1.0.0). There is also a [project page](/projects/drift/) here with the shorter overview and installation steps.

## The passage belongs before the headline

I already built an [Eleventy plugin for sharing posts to Mastodon](/blog/i-built-an-eleventy-plugin-for-sharing-posts-to-mastodon/). That lets a site owner add an instance-aware share button. Drift puts the tool in the reader's browser, where it can work on ordinary articles regardless of whether the publisher added a Mastodon button.

The existing [Share to Mastodon extension](https://chromewebstore.google.com/detail/bibnjflclpdmbbcncejifemmbggkcjde) helped shape what I wanted. Its highlight-and-click flow was the feature I specifically wanted to keep. Drift has its own implementation and artwork, with an editable draft, saved servers, link cleanup, and help built into the extension.

An early version put the title before the selection. After looking at the draft, I asked for the passage to move above it. If a particular paragraph is why I am sharing an article, it makes sense for that paragraph to be the first thing someone reads. The title and link still provide the source underneath.

The [draft composition code](https://github.com/kylereddoch/drift/blob/v1.0.0/extension/lib/core.js) reflects that order:

```js
export function composeText(source, settings = DEFAULT_SETTINGS) {
  const url = settings.cleanLinks ? cleanURL(source.url) : pageURL(source.url);
  const title = settings.includeTitle ? String(source.title ?? '').trim() : '';
  const quote = String(source.selection ?? '').trim();
  return [quote ? `“${quote}”` : '', title, url].filter(Boolean).join('\n\n');
}
```

Without a selection, the draft contains the title and URL. Title inclusion is optional, and the whole draft is editable. Drift does not summarize the article or write commentary on my behalf; it gives me the text I selected and room to explain why I am passing it along.

<figure>
  <img src="/assets/images/drift-composer-dark.png" alt="Drift's dark composer showing a sample passage before the article title and URL, with a server selector, link cleanup, and Continue to Mastodon and Copy buttons" loading="lazy" width="1280" height="800">
  <figcaption>The separate-tab composer used by right-click sharing, captured from Drift 1.0.0 with sample text and server settings. This is the packaged extension's interface; the article shown is an example. Screenshot from my MIT-licensed <a href="https://github.com/kylereddoch/drift">Drift project</a>.</figcaption>
</figure>

## The small things around a draft

Drift remembers up to 12 Mastodon server addresses and a default choice. Those are destinations, not connected accounts: the server uses whichever account is already signed in there. That makes the final composer a useful place to check where the post is going, along with its audience and any content warning.

Link cleanup is optional. It removes known tracking parameters such as `utm_*` tags and common click identifiers while retaining other query parameters and fragments. Removing every query parameter would break too many useful links. There is also a toggle to restore the original URL for a draft if the cleaned version is not what you want.

The toolbar popup can recover edits when you reopen it on the same page with the same selection during a browser session. That saves a draft from an accidental click outside the popup, but it is temporary storage. Closing the source tab, restarting Chrome, or reloading the extension clears it. Copy is available when you want to keep the text elsewhere.

Right-click sharing covers pages, selected text, and link targets, opening the draft in a separate extension tab. A link target gets its URL without the surrounding page's title, because that title may describe something entirely different. The suggested keyboard shortcut is `Alt+Shift+M`; Chrome's shortcut settings let you change it if another extension already has it.

I also wanted the welcome page to be useful after installation. It holds the server settings, instructions, release notes, a link to the GitHub changelog, and help. Optional support buttons sit alongside that information in the order I chose: Ko-fi, Buy Me a Coffee, then GitHub Sponsors. All features are available without a donation.

## What the extension gets access to

Drift's [Manifest V3 permission list](https://github.com/kylereddoch/drift/blob/v1.0.0/extension/manifest.json) has four entries: `activeTab`, `scripting`, `storage`, and `contextMenus`. Together they let it read the chosen page's title, URL, and selection when invoked, save preferences and temporary drafts, and offer the right-click actions. It requests no persistent website access or browsing-history permission, and its executable code ships with the extension.

Preferences use local extension storage; drafts use session storage. Drift does not sync either. It also has no usage analytics inside the extension. Links to my website do carry fixed referral tags so the site's existing Tinylytics installation can tell that a visit came from Drift. Those tags are the same for everyone and contain no article URL, selected passage, draft, server, or user identifier. They measure visits after a click, not extension installs or shares.

The handoff uses the selected server's `/share?text=...` page, so Drift needs no Mastodon password or API token. The tradeoff is that the draft travels in a URL.

{% articleCallout "The draft reaches your server before you publish", "caution" %}
Selecting **Continue to Mastodon** sends the draft to that server in an HTTPS URL. It can appear in browser history and server logs even if you never publish the post. Check for private text or confidential links before continuing. The [privacy policy](https://kylereddoch.github.io/drift/privacy.html) explains this and the local storage behavior.
{% endarticleCallout %}

## Trying Drift while the store review is pending

The [1.0.0 GitHub release](https://github.com/kylereddoch/drift/releases/tag/v1.0.0) includes `drift-1.0.0.zip`. For a manual install, extract that ZIP, open `chrome://extensions`, enable **Developer mode**, and choose **Load unpacked**. Select the extracted folder containing `manifest.json`, add your server on the welcome page, and pin Drift from Chrome's Extensions menu. The store listing will provide the normal install path once it is approved and live.

There are limits to the highlight flow. Some PDF viewers, protected pages, and embedded frames prevent Chrome from reading the selection. Browser settings pages and local files cannot be shared. Drift targets Mastodon's share composer; other Fediverse software and alternative clients have not been tested. Its character count describes the draft, while the server applies its own posting limit. Very long share URLs are rejected with a suggestion to shorten or copy the text instead of silently cutting a passage off.

If you try it and a page behaves differently, [open an issue](https://github.com/kylereddoch/drift/issues) with the browser version and steps to reproduce it. A public example page is especially useful for selection problems. Leave private passages and confidential URLs out of the report; what helps me fix the capture behavior is knowing where and how it failed.
