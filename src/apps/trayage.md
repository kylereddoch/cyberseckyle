---
title: Trayage
description: Trayage is a native macOS app for reviewing installers, likely duplicate downloads, older files, large files, and recent downloads before deciding what belongs in the Trash.
summary: A calmer, local-first way to review the files collecting in your Downloads folder and choose what should move to the Trash.
date: 2026-09-14T09:53:00-05:00
appOrder: 0
appPlatform: macOS 14+
appStatus: Available
appPrice: US$29.99 direct purchase
badgeClasses: bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200
techStack:
  - Swift
  - SwiftUI
  - macOS
  - RelayByte
appLinks:
  - label: Visit Trayage
    url: https://trayage.app/
  - label: Download for Mac
    url: https://trayage.app/download/
  - label: View the roadmap
    url: https://trayage.app/roadmap/
---

Trayage is the first native macOS app I released through RelayByte. I built it to make Downloads-folder cleanup feel considered instead of automatic or destructive.

The app reviews one folder at a time and groups the files that may deserve attention. It can surface installers, likely duplicates, older files, large files, and recent downloads while leaving the final decision with the person using the Mac.

## What it does

- Reviews the selected folder locally on your Mac
- Groups files by the reason they may deserve attention
- Shows file details and can reveal an item in Finder
- Lets you ignore a suggestion for the current review
- Moves only selected files to the system Trash
- Requires confirmation before cleanup
- Never empties the Trash

## Built around review, not automatic deletion

Trayage does not claim that every suggestion is safe to remove. A likely duplicate is a clue based on its name and size, and an installer match is a reason to look more closely. You can review the information, reveal the file in Finder, and decide for yourself.

Selected files move to the Trash only after confirmation. That keeps the normal macOS recovery step available if you change your mind.

## Availability

Trayage supports macOS 14 and later. The direct edition is available from the Trayage website with a seven-day cleanup trial and a US$29.99 one-time license for up to three active Macs. The trial ends without an automatic charge, and file review remains available after it ends.

The Trayage website is the source for current downloads, purchase details, support, privacy information, release notes, and the public roadmap.
