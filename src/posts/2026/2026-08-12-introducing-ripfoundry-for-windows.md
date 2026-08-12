---
date: 2026-08-12T10:22:12-05:00
title: I Brought RipFoundry to Windows
seoTitle: RipFoundry for Windows Rips DVDs for Jellyfin
description: RipFoundry for Windows brings my DVD-to-Jellyfin workflow into a guided desktop app that rips and encodes locally, validates the results, and verifies every library transfer.
searchIntent: Introduce RipFoundry for Windows and explain its guided DVD ripping, TMDB matching, local processing, optional versions, validation, and safe Jellyfin transfers.
featuredImage: /assets/images/ripfoundry-windows.png
featuredImageAlt: RipFoundry for Windows showing the Rip DVD screen, processing options, and activity area
tags: [projects, open-source, self-hosting, jellyfin, windows]
category: projects
mastodon_post: true
mastodon_tags: [RipFoundry, Jellyfin, SelfHosting, OpenSource, Windows]
---

My DVD drive is attached to a Windows PC. My Jellyfin server runs somewhere else. For a while, the gap between them meant the server was still getting pulled into work the Windows machine was better positioned to do.

Ripping and video encoding are not lightweight background chores. They need local storage, sustained CPU time, and direct access to the optical drive. Sending that work toward the media server made the setup more complicated without making the result safer.

So I brought RipFoundry to Windows.

**RipFoundry for Windows** is the desktop companion to my Linux workflow. It scans a DVD, matches the selected titles with TMDB, preserves the MakeMKV remux, creates an optional playback-friendly version, validates the result, and transfers only the completed files into the Jellyfin library. The [project page](/projects/ripfoundry-for-windows/) has the short version, and [version 1.1.0 is available on GitHub](https://github.com/kylereddoch/RipFoundry-for-Windows/releases/tag/v1.1.0).

## The Windows PC does the expensive part

RipFoundry stages the complete job on the Windows machine.

MakeMKV reads the disc and creates the original MKV locally. If I choose Enhanced DVD mode, HandBrakeCLI creates the additional H.264 version there. If I choose 1080p, FFmpeg does that encode locally too. FFprobe checks the result before anything is copied to the media library.

The Jellyfin destination only sees completed output. It can be a UNC path, a mapped drive, or a local folder, but it is not used as an active encoding workspace.

That separation is useful for more than performance. A network interruption during a long encode does not leave half of an encoder's output sitting in the movie library. A failed job stays in local staging where I can inspect it.

## A GUI should explain what it is doing

The Linux commands assume I am comfortable configuring paths and working in a terminal. The Windows version needed a guided interface without hiding the choices that matter.

The Rip DVD tab lists detected optical drives with normal Windows drive letters. Underneath, RipFoundry translates that choice into the `disc:N` source MakeMKV expects. That means I can select `D:` without having to remember whether MakeMKV calls it `disc:0` or `disc:1`.

After a scan, the app lists the usable DVD titles. I can select one movie or Ctrl-click several titles on a collection disc. Each selection gets its own TMDB match, including a manual title, year, and ID fallback when search is not the right answer.

Before the rip starts, RipFoundry shows the title-to-movie plan and asks me to confirm the processing mode. It is still possible to make the wrong match, but the app does not make that decision silently.

The Settings screen does the same thing for dependencies. MakeMKV, FFmpeg, FFprobe, and HandBrakeCLI each get a clear Ready or Not found state. RipFoundry checks common Windows locations and `PATH`, and each row has a Locate button for tools installed somewhere else.

HandBrakeCLI is only required for Enhanced DVD mode. The interface says that instead of treating every optional tool as a reason the entire app cannot run.

## The original stays original

RipFoundry offers three processing modes.

Original DVD only keeps the untouched MakeMKV remux and does no additional encode. It is the fastest option and the one with the smallest local staging requirement.

Original DVD + Enhanced DVD keeps that remux and creates a second H.264 file at the DVD's native resolution. HandBrakeCLI can deinterlace when needed and produce a version that is easier for some clients to play directly.

Original DVD + 1080p keeps the remux and creates an aspect-correct 1080-height H.264 version with FFmpeg.

That last option needs an honest label. Scaling a DVD does not recover HD detail. It may produce a version that fits a playback setup better, and the encoder may handle interlaced material more cleanly, but the original disc is still the source. RipFoundry keeps the MakeMKV remux because I do not want a convenience encode to become the only copy.

Jellyfin can group the files as versions of one movie:

```text
Movie Name (Year) [tmdbid-123]/
  Movie Name (Year) [tmdbid-123] - 480p.mkv
  Movie Name (Year) [tmdbid-123] - 1080p.mkv
```

The TMDB identifier gives Jellyfin an exact match hint, and the suffixes make the versions understandable without opening the files.

## A copy is not finished until it verifies

RipFoundry validates the media with FFprobe before transfer, but a good local file does not prove a network copy arrived intact.

The destination copy starts with a `.partial` filename. RipFoundry calculates SHA-256 on the completed local file and the temporary destination copy. Only matching hashes allow that temporary file to become the final Jellyfin version.

If the destination version already exists, the operation stops instead of silently replacing it. If ripping, encoding, validation, or transfer fails, the local staging files remain available for troubleshooting.

This is slower than treating a successful copy call as proof. It is also the point of the app. A workflow that saves me a few clicks but leaves me wondering about a multi-gigabyte transfer has not solved the job.

## It also works with movies already in Jellyfin

The Add 1080p Version tab handles a second use case. I can search the configured movie library, select an existing native-resolution MKV, and create an additional 1080p H.264 version without replacing the source.

RipFoundry reads the original from the library, encodes in local Windows staging, validates the result, and checksum-verifies the new copy back into the movie folder.

For an older single-version movie whose filename does not include a resolution suffix, RipFoundry renames that original only after the new encode succeeds. The library does not get reorganized before there is a verified second version to justify it.

## The current release is portable

RipFoundry for Windows 1.1.0 requires Python 3.10 or newer along with the media tools used by the selected workflow. The release includes a batch launcher, a PowerShell shortcut helper, and a build script that can create a windowless Windows executable with PyInstaller.

It is a portable project package, not a traditional Windows installer. I would rather describe that accurately than wrap the same folder in something that only looks more finished. A normal installer with Start menu integration, upgrades, and an uninstaller is a possible later improvement.

For now, [the 1.1.0 release](https://github.com/kylereddoch/RipFoundry-for-Windows/releases/tag/v1.1.0) includes both a portable package and the project package, along with published SHA-256 sums. The [repository](https://github.com/kylereddoch/RipFoundry-for-Windows) has the complete setup and build instructions.

The [Linux version](/projects/ripfoundry-for-linux/) is still there for the command-line workflow. Windows did not replace it. This version puts the optical drive, local staging, and encoding work on the Windows machine where I wanted them, while keeping the rules that made RipFoundry worth trusting in the first place.

