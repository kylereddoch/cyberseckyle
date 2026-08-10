---
date: 2026-08-10T10:51:26-05:00
title: I Built ReelArrange to Get Downloads Ready for Jellyfin
seoTitle: ReelArrange Organizes Downloads for Jellyfin
description: ReelArrange is my Windows app for matching downloaded movies and TV shows with TMDB, previewing a Jellyfin-ready layout, and copying or moving everything into place.
searchIntent: Introduce ReelArrange and explain how it safely organizes downloaded movies, TV shows, extras, artwork, and sidecars for a Jellyfin library.
featuredImage: /assets/images/reelarrange-hero.webp
featuredImageAlt: ReelArrange showing a preview of a Jellyfin-ready movie folder and its transfer options
tags: [projects, open-source, self-hosting, jellyfin, windows]
category: projects
mastodon_post: true
mastodon_url:
mastodon_tags: [Jellyfin, SelfHosting, OpenSource, Windows]
---

I like Jellyfin. I do not like the part right before Jellyfin gets involved.

A download finishes, but the name is full of release details Jellyfin does not need. The folder may have subtitles, artwork, a trailer, a featurette, or several episodes scattered through a season directory. Before any of it lands in the library, I still need to identify the right title, rename things, create the proper folders, and make sure I did not leave a useful sidecar behind.

None of that is especially difficult. It is just repetitive, easy to get slightly wrong, and tedious enough that I kept wishing the same tool existed every time I did it.

So I built **ReelArrange**.

ReelArrange is a Windows desktop app that identifies downloaded movies and TV shows with TMDB, builds a Jellyfin-ready destination plan, and then copies or moves the media into place. You can read the shorter [ReelArrange project page](/projects/reelarrange/), browse the [source on GitHub](https://github.com/kylereddoch/reelarrange), or [download version 0.1.0](https://github.com/kylereddoch/reelarrange/releases/tag/v0.1.0).

## It started as a tool for my own library

The first version was a private utility called Jellyfin Media Prep. That name was accurate, if a little lifeless. I made it to remove the same manual cleanup from my own routine and kept adjusting it as I ran into more realistic media folders.

A single movie is easy. A complete release folder is where the edges start showing up.

There might be a poster at the root, a subtitle named after the original video, a `featurettes` folder, a loose trailer, or a movie split into `cd1` and `cd2`. TV gets more complicated because extras can belong to the full series or one season, and episode files need more than a show title to be useful.

The private tool kept growing because the downloads I wanted it to handle were not tidy test cases. Eventually it made more sense to clean up the project, document its behavior, put safety rules around the transfer step, and release it as ReelArrange.

## What ReelArrange actually does

The app begins by asking whether I am preparing a movie or a TV show. I can select one file, several episodes, a season folder, or the complete release folder.

ReelArrange cleans up the source name enough to search TMDB, but it does not quietly trust the first result. It shows the matches and asks me to confirm the title, year, overview, and numeric ID. That confirmed match becomes the basis for the folder and file names.

A movie can end up like this:

```text
Movies/
  Movie Title (2026) [tmdbid-123456]/
    Movie Title (2026) [tmdbid-123456].mkv
    poster.jpg
    featurettes/
      Making Of.mkv
```

For TV, ReelArrange reads common episode patterns such as `S01E01` and `1x01`, retrieves episode titles from TMDB when they are available, and builds the show and season structure Jellyfin expects.

It also carries the parts that are easy to miss during a manual move:

- matching subtitles, NFO files, and artwork sidecars
- posters, backdrops, banners, logos, and other recognized artwork
- trailers, featurettes, interviews, deleted scenes, clips, shorts, samples, and theme music
- movie versions and common split-part names
- show-level and season-level extras in their proper folders

That is the difference between merely renaming the main video and preparing the release as a whole.

## The preview is the important part

I did not want ReelArrange to be a black box that announces it has “organized” a folder after the damage is already done.

Before anything moves, the app shows the complete planned Jellyfin structure. Every source has a destination. I can inspect the names, the season placement, the extras, and the library root before starting the transfer.

The same caution applies when a destination already exists. ReelArrange offers three choices:

- add missing files while leaving existing media alone
- stop the entire operation if any destination already exists
- overwrite existing files after a separate confirmation

Add-missing is useful when the movie is already in Jellyfin and I only found artwork or extras later. Stop-on-conflict is the cautious option. Overwrite is available, but it has to be deliberately selected and confirmed against the real plan.

ReelArrange also recommends **Copy** instead of **Move**. Copy keeps the download intact, which matters if a torrent should continue seeding. Move is there when I want it, along with a warning about what it means.

The transfer window reports the current file, bytes transferred, percentage, and overall file count. That matters with large files and network shares, where Explorer can make a transfer look finished before Windows is actually done writing.

## A Windows app without a command-line requirement

ReelArrange is built with Windows PowerShell 5.1 and Windows Forms. A small C# launcher starts it without leaving a PowerShell console hanging around behind the interface.

That choice keeps the app compatible with Windows 10 and Windows 11 without asking someone to install a development stack just to use it. The installer builds the launcher, places the runnable files under the current Windows profile, and creates a desktop shortcut.

The app can transfer to a local folder, mapped drive, or UNC network share, so it does not need to run on the Jellyfin server itself.

TMDB is its only required network service. The API credential is encrypted with Windows Data Protection for the current user, and it never gets written to the activity log. There is no telemetry. ReelArrange deals with filenames and file transfers; it does not open, remux, or change the contents of the media.

## This is the first public release

ReelArrange 0.1.0 is early, and I mean that in the useful sense rather than the permanent-beta sense. The movie and TV workflows are working, the safety checks are in place, and the complete local test suite runs on Windows. There are still rough edges I want to improve, including signed release files and a poster preview in the TMDB match window.

For now, I would still inspect the preview carefully before moving a large library. ReelArrange makes that review part of the normal workflow because a media organizer should earn trust before it gets permission to rearrange terabytes of files.

The project is available on [GitHub](https://github.com/kylereddoch/reelarrange), including installation instructions, the user guide, privacy notes, and the issue templates. The [ReelArrange project page](/projects/reelarrange/) has the shorter version if you only need the overview and links.

I built ReelArrange because the work between “download finished” and “Jellyfin understands it” was annoying me. Now that gap has its own app.
