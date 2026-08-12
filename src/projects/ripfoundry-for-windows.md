---
title: RipFoundry for Windows
description: RipFoundry for Windows is my guided desktop app for ripping DVDs locally, creating optional enhanced or 1080p versions, validating them, and safely transferring finished movies into Jellyfin.
summary: A Windows desktop companion for turning DVDs into verified, Jellyfin-ready movie versions without making the media server do the heavy work.
date: 2026-08-12T10:22:12-05:00
projectOrder: 0
projectType: Windows App
projectStatus: Active
badgeClasses: bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200
featuredImage: /assets/images/ripfoundry-windows.png
featuredImageAlt: RipFoundry for Windows showing the Rip DVD screen, processing options, and activity area
techStack:
  - Python
  - Tkinter
  - MakeMKV
  - FFmpeg
  - HandBrakeCLI
  - TMDB API
  - Jellyfin
  - Open Source
projectLinks:
  - label: Download version 1.1.0
    url: https://github.com/kylereddoch/RipFoundry-for-Windows/releases/tag/v1.1.0
  - label: View on GitHub
    url: https://github.com/kylereddoch/RipFoundry-for-Windows
  - label: Read the introduction
    url: /blog/i-brought-ripfoundry-to-windows/
  - label: See the Linux version
    url: /projects/ripfoundry-for-linux/
---

RipFoundry for Windows brings my DVD-to-Jellyfin workflow onto the Windows PC with the optical drive and the processing power to do the work.

The app scans a disc, lets me choose one or several titles, matches each movie with TMDB, and shows the plan before anything starts. MakeMKV handles the original rip. HandBrakeCLI or FFmpeg can create an additional playback-friendly version. FFprobe validates the output before RipFoundry sends a finished file to the media library.

The goal is not to make ripping look like one magic button. It is to put the decisions in one place and make the risky parts difficult to skip.

## What it does

- Lists Windows DVD drives with their familiar drive letters
- Scans discs with MakeMKV and supports single-title or collection-disc workflows
- Searches TMDB for the movie, with manual metadata entry as a fallback
- Creates Jellyfin folder and version names with the TMDB identifier
- Keeps the untouched MakeMKV remux
- Can add an Enhanced DVD H.264 version at the source resolution
- Can add an aspect-correct 1080-height H.264 version
- Validates duration, resolution, codecs, and tracks with FFprobe
- Keeps failed work in local staging for troubleshooting
- Verifies library transfers with SHA-256 before finalizing the filename
- Adds a 1080p version beside a movie that is already in the library

## The work stays on the Windows PC

Ripping and encoding are expensive jobs. RipFoundry runs them in local Windows staging instead of making the Jellyfin server pull a disc image across the network or spend hours encoding it.

Only completed, validated output gets copied to the configured media destination. That destination can be a local folder, mapped drive, or UNC network path. The Settings screen can test that Windows can reach and write to it before a rip begins.

RipFoundry also checks for MakeMKV, FFmpeg, FFprobe, and HandBrakeCLI. Each dependency gets a clear Ready or Not found status, plus a Locate button when the executable is installed somewhere unusual.

## Original, Enhanced, or 1080p

Every processing mode starts by protecting the original MakeMKV remux.

Original DVD only is the quickest option. Enhanced DVD adds a second H.264 copy at the disc's native resolution. Original DVD + 1080p adds a scaled H.264 version that may be easier for some playback devices to handle.

Scaling a DVD to 1080p does not create HD detail. RipFoundry says that directly in the interface because a larger frame is not the same thing as a better source. The original remux remains the archival version.

## A safer final transfer

RipFoundry does not write an active encoder output into the Jellyfin library. It finishes the local job, validates it, and copies it to the destination with a `.partial` filename.

The app then calculates SHA-256 for the local file and the destination copy. The final Jellyfin filename only appears after those hashes match. If a rip or encode fails, staging stays in place, and an existing version stops the operation instead of being silently replaced.

That same approach applies to the Add 1080p Version tab. RipFoundry reads the original movie from the library, encodes locally, validates the new version, and verifies the copy back into the existing movie folder. The source remains untouched.

## Version 1.1.0

RipFoundry for Windows 1.1.0 is available as a portable project package. It runs from Python 3.10 or newer, and the included build script can create a normal windowless Windows executable with PyInstaller.

The current package is intentionally portable rather than pretending to be a traditional installed application. A full Windows installer is a possible later improvement. For now, the release includes the application, launcher, shortcut helper, artwork, and build files needed to keep the setup understandable.

