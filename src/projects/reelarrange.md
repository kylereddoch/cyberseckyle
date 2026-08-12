---
title: ReelArrange
description: ReelArrange is my Windows desktop helper for matching downloaded movies and TV shows with TMDB, previewing a Jellyfin-ready library layout, and copying or moving the media into place.
summary: A Windows desktop app that turns downloaded movies and TV shows into a clean Jellyfin library layout without hiding what it plans to do.
date: 2026-08-10T10:51:26-05:00
projectOrder: 2
projectType: Windows App
projectStatus: Early Access
badgeClasses: bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-200
featuredImage: /assets/images/reelarrange-hero.webp
featuredImageAlt: ReelArrange showing a preview of a Jellyfin-ready movie folder and its transfer options
techStack:
  - PowerShell
  - Windows Forms
  - TMDB API
  - Jellyfin
  - Open Source
projectLinks:
  - label: Download version 0.1.0
    url: https://github.com/kylereddoch/reelarrange/releases/tag/v0.1.0
  - label: View on GitHub
    url: https://github.com/kylereddoch/reelarrange
  - label: Read the introduction
    url: /blog/i-built-reelarrange-to-get-downloads-ready-for-jellyfin/
---

ReelArrange handles the awkward stretch between a finished download and a Jellyfin library that can actually make sense of it.

I built it because I was tired of doing the same cleanup by hand: finding the right title, checking the year, creating the expected folder structure, renaming episodes, carrying over subtitles and artwork, and making sure extras did not end up in the wrong place.

The app does that planning in one Windows interface, shows me the complete result, and waits for approval before it transfers anything.

## What it does

- Searches TMDB and asks me to confirm the movie or series match
- Builds Jellyfin-friendly movie, show, season, and episode names
- Adds the TMDB identifier to the main media folder
- Retrieves episode titles when TMDB has them
- Keeps matching subtitles, NFO files, and artwork with the video
- Recognizes extras such as trailers, featurettes, interviews, deleted scenes, and theme music
- Copies or moves files to a local folder, mapped drive, or UNC network share

ReelArrange can start with a single movie file, a complete movie folder, selected episodes, a season folder, or a complete show folder. Selecting the full release folder works best when artwork and extras are part of the download.

## How it works

1. Choose whether the source is a movie or TV show.
2. Select the file or folder that finished downloading.
3. Confirm the TMDB match by checking the title, year, overview, and ID.
4. Choose the Jellyfin library folder and whether to copy or move the files.
5. Review every planned destination in the preview.
6. Start the transfer and follow the live file and byte progress.

The app does not need to run on the Jellyfin server. It works from a Windows 10 or Windows 11 PC and can send media to a network library.

## The preview is there for a reason

Media tools can make a large mess very quickly when they are too eager. ReelArrange does not begin with the assumption that it knows better than the person using it.

Before a transfer starts, it shows the planned folder and filename for every file. Copy is the recommended mode so an active torrent can keep seeding. If a destination already exists, I can add only missing files, stop the complete operation, or choose overwrite and confirm it again after the real destination plan has been built.

Add-missing never changes an existing destination file. Duplicate targets stop the plan before the transfer begins. ReelArrange also works with individual files rather than recursively moving a whole folder and hoping for the best.

## Local by default

TMDB is the only network service ReelArrange needs. The saved TMDB credential is encrypted for the current Windows account, and the app does not include telemetry.

The activity log records completed file operations and errors, but it does not record the saved credential. ReelArrange renames and transfers files; it does not inspect, remux, or modify the media inside them.

Version 0.1.0 is the first public release, so I still consider the project early. The preview deserves a careful look before any move operation. That is good advice for any media organizer, and ReelArrange makes the check difficult to skip.
