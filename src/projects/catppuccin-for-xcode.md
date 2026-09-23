---
title: Catppuccin for Xcode
description: Four native Xcode 27 workspace themes built from the Catppuccin palette, with a light Latte option and three dark flavors.
summary: Four Catppuccin workspace themes for Xcode 27, with native color assignments, a selective installer, and guides for every flavor.
date: 2026-09-23T16:22:00-05:00
projectOrder: 2
projectType: Xcode Theme
projectStatus: Active
badgeClasses: bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-200
techStack:
  - Xcode 27
  - Catppuccin
  - Python
  - Theme Design
projectLinks:
  - label: View themes and installation steps
    url: https://github.com/kylereddoch/catppuccin-xcode
  - label: Explore the color guides
    url: https://github.com/kylereddoch/catppuccin-xcode/tree/main/docs/themes
---

I wanted my Xcode workspace to feel like the rest of the tools I enjoy using, so I built four native workspace themes using the [Catppuccin palette](https://github.com/catppuccin/palette): light **Latte** and dark **Frappé**, **Macchiato**, and **Mocha**.

These are `.xcworkspacecolortheme` files for **Xcode 27**. They assign 38 colors across syntax, documentation, selection, the cursor, diffs, and the debugger. Xcode derives some other interface colors from the theme, so those surfaces are not individually mapped to exact palette values. The themes do not change fonts or system controls.

<figure>
  <img src="/assets/svg/catppuccin-xcode-mocha-guide.svg" alt="Illustrated Catppuccin Mocha color guide with Swift syntax colors and labeled palette swatches; this is not an Xcode screenshot" loading="lazy" width="1100" height="1190">
  <figcaption>Mocha color guide. This illustration shows the palette assignments, not a screenshot of Xcode.</figcaption>
</figure>

## Getting started

The [GitHub repository](https://github.com/kylereddoch/catppuccin-xcode) includes all four theme files and installation steps. You can download the repository and run its installer for all four flavors or just one. Manual installation is also documented. After installing, restart Xcode and select a theme in **Settings → Appearance → Theme → Choose…**.

In the Xcode 27.0 build I tested, the Appearance **Import…** button interpreted the native file as a classic theme and replaced colors with defaults. Copying the file into Xcode's theme folder, as the repository instructs, loaded the intended colors.

## Current status

All four flavors have been loaded in Xcode 27.1. Their plain-text and debugger colors matched the intended values, and Latte's light syntax colors received additional spot checks. Automated palette and file checks also pass. A broader visual review of real Xcode workspaces, especially derived interface colors and light/dark switching, remains on the [roadmap](https://github.com/kylereddoch/catppuccin-xcode/blob/main/docs/ROADMAP.md).

The [official Catppuccin Xcode port](https://github.com/catppuccin/xcode) is a separate project with classic theme files for older Xcode versions. My themes use **Xcode 27's native workspace format**. I opened [PR #24](https://github.com/catppuccin/xcode/pull/24) to contribute native versions of all four flavors to the official port alongside its existing files. The PR is open for maintainer review; I hope the themes can become part of that project.
