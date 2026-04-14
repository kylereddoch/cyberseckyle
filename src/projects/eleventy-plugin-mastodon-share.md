---
title: Eleventy Plugin Mastodon Share
description: This plugin makes sharing Eleventy posts to Mastodon less awkward by adding an instance-aware flow, a saved instance option, and cleaner share helpers.
summary: A drop-in plugin for adding a better Share on Mastodon flow to Eleventy sites, including an instance picker and a smoother publishing experience.
date: 2026-04-07T13:00:00-05:00
projectOrder: 3
projectType: Eleventy Plugin
projectStatus: Active
badgeClasses: bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-200
featuredImage: /assets/images/eleventy-masto-share-img.png
featuredImageAlt: Screenshot for the Eleventy Plugin Mastodon Share project
techStack:
  - Eleventy
  - Mastodon
  - Nunjucks
  - Open Source
projectLinks:
  - label: View on GitHub
    url: https://github.com/kylereddoch/eleventy-plugin-mastodon-share
  - label: View on npm
    url: https://www.npmjs.com/package/@kylereddoch/eleventy-plugin-mastodon-share
  - label: Read the launch post
    url: /blog/i-built-an-eleventy-plugin-for-sharing-posts-to-mastodon/
---

This plugin grew out of a real annoyance I kept running into: Mastodon sharing is great once you are on your instance, but the handoff from a normal website is still clunky.

I wanted a better default for Eleventy sites, especially for people who care about the fediverse but do not want to rebuild the same share flow every time.

## What the plugin solves

- Lets readers choose their Mastodon instance instead of assuming one destination
- Makes it easier to save and reuse that choice
- Gives site owners a cleaner way to add Mastodon sharing without a lot of custom wiring

## Why this project matters to me

It is a good example of the kind of tooling I enjoy making: small, practical, and aimed at a real friction point. It does not try to do everything. It tries to make one part of publishing feel noticeably better.
