---
date: 2026-09-23T17:22:00-05:00
title: I Made Catppuccin Themes for Xcode 27
description: I built four native Catppuccin workspace themes for Xcode 27 and learned why getting the colors into Xcode was more involved than clicking Import.
tags: [apple, xcode, catppuccin, themes, projects, open-source]
category: projects
draft: true
social:
  post_to: [mastodon]
  tags: [Xcode, Catppuccin, OpenSource]
  status:
    mastodon: |-
      I built four native Catppuccin themes for Xcode 27: Latte, Frappé, Macchiato, and Mocha. I also opened a PR to bring them into the official Catppuccin Xcode port.

      Here is how the project came together and what I am still testing:

      {url}

      #Xcode #Catppuccin #OpenSource
---

I spend a lot of time in Xcode, and I like my development tools to feel comfortable and familiar. Catppuccin has become one of my favorite color palettes, so I wanted to bring it into Xcode's newer workspace Appearance system.

That turned into [Catppuccin for Xcode](https://github.com/kylereddoch/catppuccin-xcode): four native themes for **Xcode 27**. There is a light **Latte** theme and three dark choices: **Frappé**, **Macchiato**, and **Mocha**.

I started with Mocha because that is the palette I wanted on my own machine. Once I had a native theme loading correctly, I built a generator around Catppuccin's pinned palette and a shared set of color assignments. That gave me a way to create and check all four flavors without hand-editing four separate theme files.

## The part that caught me out

At first, Xcode's **Import…** button looked like the obvious way to install a theme. In the Xcode 27.0 build I tested, it treated my native `.xcworkspacecolortheme` file as a classic theme and filled in colors that did not match what I had made.

The fix was to put the native file in Xcode's theme folder and restart Xcode. From there, I could select it under **Settings → Appearance → Theme → Choose…**. Mocha's text, background, and debugger colors then matched the intended Catppuccin values.

I wrote that installation path into the repository because a theme is not very useful if people cannot make it look the way the files say it should.

## What the themes cover

Each flavor has 38 explicit color assignments. They cover syntax and documentation text, selections, the cursor, the current line, diffs, and debugger colors. Xcode also derives some workspace colors from the theme. Those derived surfaces are part of what I still want to examine in real projects; they are not exact, individually specified Catppuccin colors.

The project includes a [color guide for each flavor](https://github.com/kylereddoch/catppuccin-xcode/tree/main/docs/themes), along with an installer that can add one theme or all four and back up a different file with the same name. The guides are illustrations of the palette assignments, not Xcode screenshots.

![Illustrated Catppuccin Mocha guide showing Swift syntax colors and palette swatches, not an Xcode screenshot](/assets/svg/catppuccin-xcode-mocha-guide.svg)

## Where it stands

All four themes are available and have been loaded in Xcode 27.1. Their plain-text and debugger colors matched the intended values, and I spot-checked Latte's light syntax colors. Automated checks cover the palette and generated files. I still want broader visual testing of real workspaces, including navigation, search, diffs, diagnostics, and light/dark switching.

If you want to try them or follow along, the [repository has the themes and installation instructions](https://github.com/kylereddoch/catppuccin-xcode). There is also a shorter [project page](/projects/catppuccin-for-xcode/) here on the site.

## Bringing Xcode 27 support to the official port

There is already an [official Catppuccin Xcode port](https://github.com/catppuccin/xcode). Its existing classic theme files can be imported into Xcode 27, but in my Xcode 27.1 tests the converted colors shifted away from the source palette. My project uses Xcode 27's native workspace theme format to keep those intended colors, while the older classic files remain useful for earlier Xcode versions.

I opened [PR #24](https://github.com/catppuccin/xcode/pull/24) to add native Latte, Frappé, Macchiato, and Mocha themes to the official port alongside its existing files. It includes the generation and validation work, plus notes on what still needs visual review. The PR is open, and I hope the maintainers will be able to bring this Xcode 27 support into their project.
