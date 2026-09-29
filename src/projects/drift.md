---
title: Drift — Share to Mastodon
seoTitle: Drift — Share Articles and Passages to Mastodon in Chrome
description: A Chrome extension that turns a highlighted passage, page title, and link into an editable Mastodon draft, with a choice of saved servers.
summary: Highlight a passage, click Drift, and edit a Mastodon draft with the quote, title, and link. Choose your server and review the post there before publishing.
date: 2026-09-29T14:50:00-05:00
projectOrder: 0
projectType: Chrome Extension
projectStatus: Store review pending
badgeClasses: bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200
featuredImage: /assets/images/drift-hero.png
featuredImageAlt: Drift's white rising quotation marks and wordmark on a blue background
techStack:
  - JavaScript
  - Manifest V3
  - Mastodon
  - Open Source
projectLinks:
  - label: Visit the Drift website
    url: https://kylereddoch.github.io/drift/
  - label: Download the 1.0.0 submission build
    url: https://github.com/kylereddoch/drift/releases/tag/v1.0.0
  - label: View on GitHub
    url: https://github.com/kylereddoch/drift
  - label: Read about building Drift
    url: /blog/drift-share-to-mastodon/
---

I built Drift around the part of sharing an article that I wanted to keep: the passage that made it worth passing along. Highlight some text, click the toolbar icon, and Drift puts that passage first in an editable draft, followed by the page title and URL.

You can add your own thoughts, choose a saved Mastodon server, and select **Continue to Mastodon**. Your server opens its composer, where you check the account, audience, content warning, and final text before publishing. With no highlighted text, Drift prepares just the title and link.

{% articleCallout "Chrome Web Store review", "note" %}
I submitted Drift 1.0.0 for Chrome Web Store review on September 29, 2026. Approval and a public store listing are still pending. The [1.0.0 submission build is available on GitHub](https://github.com/kylereddoch/drift/releases/tag/v1.0.0) for manual installation.
{% endarticleCallout %}

## Sharing without the repeated setup

Drift saves up to 12 server addresses and a default choice. It uses the account already signed in on the selected server, so it does not need a Mastodon password or API token.

Optional link cleanup removes known tracking parameters while keeping other query parameters and fragments. You can restore the original link for a draft. Right-click actions handle pages, selected text, and link targets; a link target gets its own URL without borrowing the title of the page you found it on.

Closing the toolbar popup does not immediately discard your edits. Reopening Drift on the same page with the same selection can recover the draft during that browser session. Closing the source tab, restarting Chrome, or reloading the extension clears it.

<figure>
  <img src="/assets/images/drift-composer-dark.png" alt="Drift's dark composer with a sample passage above the title and link, a tracking cleanup option, server selection, and Continue to Mastodon and Copy buttons" loading="lazy" width="1280" height="800">
  <figcaption>Drift 1.0.0's separate-tab composer, used by right-click sharing. Captured from the packaged extension with sample text and server settings. Screenshot and artwork from my MIT-licensed <a href="https://github.com/kylereddoch/drift">Drift project</a>.</figcaption>
</figure>

## Try the current build

1. Download `drift-1.0.0.zip` from the [GitHub release](https://github.com/kylereddoch/drift/releases/tag/v1.0.0) and extract it to a folder you will keep.
2. Open `chrome://extensions`, enable **Developer mode**, and choose **Load unpacked**. Select the extracted folder containing `manifest.json`.
3. Add your Mastodon server on the welcome page and pin Drift from Chrome's Extensions menu.
4. Open an ordinary web article, highlight a passage, and click Drift. Edit the draft, then continue to Mastodon to review and publish.

Some protected pages, PDF viewers, and embedded frames prevent selected-text capture. Drift targets Mastodon's `/share` composer; other Fediverse software and alternative clients have not been tested. Very long drafts may need to be shortened or copied, and the character count is not your server's exact remaining allowance.

## Privacy and support

Preferences stay in local extension storage, and drafts use temporary session storage. Drift has no usage analytics inside the extension, persistent website access, or background browsing collection. Links to my website carry fixed referral tags so its existing analytics can attribute a visit to Drift; those tags contain no draft text, article URL, or user identifier.

Choosing **Continue to Mastodon** sends the draft to your server in an HTTPS URL before you publish. That URL can appear in browser history and server logs. The [privacy policy](https://kylereddoch.github.io/drift/privacy.html) explains the storage and sharing behavior in detail.

Drift is free, [MIT-licensed](https://github.com/kylereddoch/drift/blob/main/LICENSE), and independent of Mastodon. The welcome page includes setup help, release notes, and optional donations through Ko-fi, Buy Me a Coffee, and GitHub Sponsors. Bug reports and feature requests belong in [GitHub issues](https://github.com/kylereddoch/drift/issues).
