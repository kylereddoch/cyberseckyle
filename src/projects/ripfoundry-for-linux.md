---
title: RipFoundry for Linux
description: RipFoundry for Linux is my command-line workflow for ripping DVDs I own, preserving the original remux, creating optional playback-friendly versions, and safely transferring finished movies into Jellyfin.
summary: A careful DVD-to-Jellyfin workflow for Ubuntu and Debian that keeps the original rip, validates every result, and verifies the final transfer.
date: 2026-08-12T10:21:12-05:00
projectOrder: 1
projectType: Linux CLI
projectStatus: Active
badgeClasses: bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200
featuredImage: /assets/images/ripfoundry-linux-hero.png
featuredImageAlt: RipFoundry logo showing a disc moving toward a digital media library
techStack:
  - Bash
  - MakeMKV
  - FFmpeg
  - HandBrakeCLI
  - TMDB API
  - Jellyfin
  - Open Source
projectLinks:
  - label: View on GitHub
    url: https://github.com/kylereddoch/RipFoundry-for-Linux
  - label: Read the introduction
    url: /blog/i-built-ripfoundry-for-linux-to-get-dvds-into-jellyfin/
  - label: See the Windows version
    url: /projects/ripfoundry-for-windows/
---

RipFoundry for Linux handles the complete trip from a physical DVD to a movie folder that Jellyfin understands.

I built it because the ripping command was never the only part of the job. I still had to identify the right title, name the movie correctly, decide which versions to keep, validate the files, and move a very large result across the network without wondering whether the copy finished cleanly.

RipFoundry turns that routine into two commands: `ripdvd` for new discs and `upscale1080` for adding a playback-friendly version beside an existing movie.

## What it does

- Scans DVDs through MakeMKV and lets me choose one or several movie titles
- Uses the disc label as a starting point and searches TMDB for the correct movie
- Supports manual title, year, and TMDB ID entry when a search is not useful
- Creates Jellyfin movie folders with the `[tmdbid-ID]` naming hint
- Preserves the untouched MakeMKV remux as the original version
- Can create an Enhanced DVD H.264 copy at the disc's native resolution
- Can create an aspect-correct 1080-height H.264 copy with FFmpeg
- Carries audio, subtitles, metadata, and chapters forward where the encoder supports them
- Validates codecs, resolution, duration, and tracks with FFprobe
- Transfers finished files with a temporary name and SHA-256 verification

Collection discs are supported too. Each selected title gets its own TMDB match and Jellyfin destination rather than assuming every useful title belongs to one movie.

## Three ways to process a disc

The original MakeMKV remux is the starting point. From there, RipFoundry can keep only that original, add an Enhanced DVD version, or add a 1080p version.

Enhanced DVD mode creates a more playback-friendly H.264 copy while staying at the source resolution. The 1080p mode scales the video to a height of 1080 pixels while preserving its aspect ratio. It can improve compatibility with a playback setup, but it cannot recover detail the DVD never contained. The original remux remains the archival copy.

Jellyfin sees the results as versions of one movie:

```text
Movies/
  Movie Name (Year) [tmdbid-123]/
    Movie Name (Year) [tmdbid-123] - 480p.mkv
    Movie Name (Year) [tmdbid-123] - 1080p.mkv
```

PAL sources use a `576p` label, and Enhanced DVD copies use the same native-resolution label with `Enhanced` added.

## The library only gets completed files

Ripping and encoding happen in local staging. If a job fails, RipFoundry leaves the staging files in place so I can inspect them instead of deleting the most useful evidence.

A completed file is copied to the library with a `.partial` suffix. RipFoundry calculates SHA-256 on the local file and the destination copy, compares the results, and only then gives the destination its final Jellyfin filename. It also stops before overwriting an existing movie version.

The tool does not configure or mount a NAS on its own. The movie directory has to be mounted and writable first, which keeps storage administration separate from the ripping workflow.

## Built for Ubuntu and Debian

RipFoundry uses Bash along with MakeMKV, FFmpeg and FFprobe, HandBrakeCLI, `curl`, `jq`, and standard Linux utilities. The repository includes an installer, configuration example, diagnostics, NAS/CIFS guidance, troubleshooting notes, tests, and release-packaging instructions.

The commands keep their original generations: `ripdvd-v3` and `upscale1080-v2`. That matters because this project packages the workflow I already relied on instead of quietly replacing it with a different one.
