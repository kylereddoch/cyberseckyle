---
title: Privacy
permalink: /privacy/index.html
description: "How CybersecKyle handles privacy, analytics, guestbook messages, Webmentions, and future app privacy links."
layout: page
---

Last updated: July 30, 2026

CybersecKyle is my personal website, and I try to keep it respectful of your privacy. This page explains what the site collects, what it does not collect, and how services like Tinylytics, Guestbooks, and Webmentions fit into the picture.

The short version: I do not track you around the web, I do not sell your data, and I do not run advertising trackers here. I want enough information to understand whether the site is working and what people find useful, without building profiles of individual visitors.

## Website analytics

This site uses [Tinylytics](https://tinylytics.app/) for simple, privacy-focused analytics. Tinylytics describes its analytics as cookie-free and privacy-first, and its [privacy compliance documentation](https://tinylytics.app/docs/privacy_compliance) says it does not store IP addresses in hits, limits geographic data to country level, purges user agent strings after 7 days, and does not use advertising or tracking mechanisms.

Tinylytics may collect basic page-view information such as the page path, page title, referrer when available, timestamp, truncated browser user agent, and country-level location. Its [unique hits documentation](https://tinylytics.app/docs/unique_hits) says unique visit counts are generated with anonymized request data, a rotating salt, and no cookies or local storage.

I use those numbers to answer boring-but-useful site owner questions like: Did anyone read this post? Is a page suddenly popular? Did something break? I do not use Tinylytics to identify you personally.

Tinylytics also powers the small kudos buttons and Tinylytics webring link on parts of the site. Those are meant to add a little IndieWeb fun without turning the site into a surveillance machine.

## Cookies and local storage

I do not set tracking cookies.

The site does use your browser's local storage for preferences you choose, such as theme, font size, contrast, reduced motion, system fonts, and the Mastodon sharing helper. Those preferences stay in your browser so the site can remember how you like to read it. They are not sent to me as a personal profile.

## Things you choose to send

If you email me, contact me through another platform, leave a guestbook message, or interact with one of my posts elsewhere on the web, I may receive whatever information you choose to include.

The [guestbook](/guestbook/) is powered by [Guestbooks](https://guestbooks.meadow.cafe/). If you use it, your name, optional website, and message are submitted to that service and may be displayed publicly on the guestbook page.

Some posts show public Webmentions, replies, likes, reposts, bookmarks, or mentions from other sites. Those responses are collected through [webmention.io](https://webmention.io/) and displayed so the conversation around a post can live with the post. If you interact publicly with my content elsewhere, that public interaction may appear here.

## Newsletter subscriptions

If you subscribe to [The Defender’s Dispatch](/newsletter/), I collect the email address you provide and, if you choose to enter it, your first name. I also store basic signup details such as the page where you subscribed, when you confirmed, and whether you joined during the founding-reader period.

The newsletter uses double opt-in. Submitting the form creates a pending signup and sends a confirmation link. You are not added to the active subscriber list until you use that link. Pending confirmation records are stored temporarily in Cloudflare Workers KV and expire after 24 hours.

[Resend](https://resend.com/) processes subscriber information, sends confirmation and welcome messages, manages subscriptions and preferences, and delivers newsletter issues. Click tracking is enabled so I can understand which stories readers found useful. Open tracking is disabled. You can unsubscribe or change newsletter preferences using the links included in newsletter emails.

The signup form uses [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) to reduce automated abuse. Cloudflare receives the technical information needed to verify that security check. The newsletter service also applies short-lived rate limits without keeping a permanent log of signup IP addresses.

## Reader-submitted stories

If you use the [Submit a Story](/submit-news/) form, I collect the article link, headline, source, category, your explanation of why it matters, the name or handle you provide, your email address, your credit preference, and any relationship or disclosure information you include.

I use that information to review the submission, verify its context, decide whether it belongs in The Defender’s Dispatch, credit you according to your preference, and contact you when clarification is needed. Submitting a story does not subscribe you to the newsletter. Resend sends the submission receipt and the private editorial notification, while Cloudflare Workers, Workers KV, and Turnstile provide the protected submission endpoint, short-lived duplicate protection, and abuse controls.

Do not submit confidential information, private customer details, attachments, or material you are not authorized to share. A submission may be retained as part of the editorial record even when it is not selected for publication. You can request deletion by emailing the address at the bottom of this page.

## Third-party services

Because this is a real website and not a text file on a desk, a few third-party services help keep things running:

- [Tinylytics](https://tinylytics.app/) for privacy-focused analytics, kudos, and the webring.
- [Guestbooks](https://guestbooks.meadow.cafe/) for the guestbook page.
- [webmention.io](https://webmention.io/) for Webmentions and social responses.
- [Resend](https://resend.com/) for newsletter subscriptions, delivery, preferences, engagement reporting, and reader-submission email receipts.
- Cloudflare Workers, Workers KV, and Turnstile for the newsletter signup, confirmation, and reader-submission flows.
- GitHub Pages and related delivery infrastructure for hosting the site.

Those services may process technical information needed to deliver their part of the site. I try to keep third-party dependencies limited and privacy-respecting.

## Apps and future projects

This page may also be used as the privacy policy link for apps, extensions, or small projects I build. Unless a specific app has its own privacy policy, the same general promise applies: I do not want to collect personal information unless it is necessary for the thing to work, and I will describe the important details clearly when a project needs something more specific.

If a future app collects different information, uses a separate analytics provider, stores account data, or needs permissions that change this story, I will update this page or publish a dedicated privacy page for that app.

## Questions

If you have questions about this privacy page, email me at [kyle@kylereddoch.me](mailto:kyle@kylereddoch.me).
