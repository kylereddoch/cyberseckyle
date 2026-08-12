---
date: 2026-08-12T10:21:12-05:00
title: I Built RipFoundry for Linux to Get DVDs Into Jellyfin
seoTitle: RipFoundry for Linux Rips DVDs for Jellyfin
description: RipFoundry is my Ubuntu and Debian workflow for preserving DVD remuxes, creating optional playback versions, and safely transferring verified movies into Jellyfin.
searchIntent: Introduce RipFoundry for Linux and explain how it rips DVDs, matches movies with TMDB, creates Jellyfin versions, validates output, and verifies library transfers.
featuredImage: /assets/images/ripfoundry-linux-hero.png
featuredImageAlt: RipFoundry logo showing a disc moving toward a digital media library
tags: [projects, open-source, self-hosting, jellyfin, linux]
category: projects
mastodon_post: true
mastodon_tags: [RipFoundry, Jellyfin, SelfHosting, OpenSource, Linux]
mastodon_url: "https://infosec.exchange/@cyberseckyle/117083352364971183"
publishedAt: "2026-08-12T15:56:16.472Z"
---

I have a shelf of DVDs and a Jellyfin server. The part between those two things used to be a pile of commands, notes, and small decisions I had to remember every time I wanted to add a movie.

Ripping the disc was only the beginning. I still had to find the correct title on it, match the movie, create the folder Jellyfin expected, decide whether I wanted another playback version, check the finished files, and move everything across the network without trusting a large copy just because the progress bar disappeared.

I built **RipFoundry for Linux** to make that complete routine repeatable. You can read the shorter [project page](/projects/ripfoundry-for-linux/) or browse the [source on GitHub](https://github.com/kylereddoch/RipFoundry-for-Linux).

## It started with the workflow I was already using

RipFoundry did not begin as an attempt to build a general media server tool. It began with two commands I already depended on: `ripdvd-v3` for new discs and `upscale1080-v2` for movies that were already in my library.

I wanted to package those commands without changing their generations or quietly replacing the behavior that made them useful. The Linux repository is the documented, installable version of that existing workflow. It includes configuration examples, diagnostics, tests, NAS guidance, troubleshooting, and an installer, but the main job remains the same.

Put a physical disc in. Identify the movie. Preserve the source. Create optional versions. Validate the results. Transfer only the files that actually finished.

That sounds obvious when it is written as one line. Making every part happen reliably is where the project lives.

## One disc is not always one movie

MakeMKV can report several titles on a DVD. Sometimes most of those are menus, short extras, or repeated cuts. Sometimes the disc is a collection with multiple movies that I genuinely want to keep.

`ripdvd` scans the disc in MakeMKV's robot mode and presents the usable titles. I can choose one or several. Each selected title gets its own movie match instead of forcing one disc label onto every output.

The disc label provides a useful search suggestion, but it is not treated as truth. RipFoundry searches TMDB and lets me choose the correct title, year, and ID. If the search is not useful or I do not have a token configured, I can enter the metadata manually.

That match produces a Jellyfin folder like this:

```text
Movies/
  The Movie (2004) [tmdbid-123]/
    The Movie (2004) [tmdbid-123] - 480p.mkv
```

The `[tmdbid-123]` hint gives Jellyfin an exact identity instead of asking it to make another guess from the filename.

## I wanted to keep the real original

MakeMKV creates the original remux. RipFoundry keeps it.

That point matters because the other processing options are not replacements for the source. Enhanced DVD mode creates a second H.264 file at the DVD's native resolution with HandBrakeCLI. The 1080p mode creates an aspect-correct 1080-height H.264 version with FFmpeg. Both can be useful when a playback device handles H.264 more easily than the codecs on the disc.

Neither mode turns DVD detail into HD detail. A scaled 1080p frame may be more convenient for playback, but it cannot restore information that was never on the disc. I would rather state that plainly than call ordinary scaling an AI remaster or pretend a bigger number is an archival improvement.

The original MakeMKV remux remains beside the additional version. Jellyfin can group them as one movie:

```text
The Movie (2004) [tmdbid-123] - 480p.mkv
The Movie (2004) [tmdbid-123] - 1080p.mkv
```

For PAL discs, the source version uses `576p`. Enhanced copies keep the native-resolution label and add `Enhanced` to the name.

## Validation comes before the library

The safety behavior is the part I care about most.

Rips and encodes happen in a local staging directory. FFprobe checks the finished media for the expected duration, dimensions, codecs, and streams. Audio, subtitles, metadata, and chapters are carried forward where the selected encoder supports them.

If something fails, RipFoundry leaves the staging output in place. That uses more disk space than immediately cleaning up, but a failed file and a useful log are better than a clean directory with no evidence.

The network transfer gets its own check. RipFoundry copies the finished media to the Jellyfin destination with a `.partial` suffix, calculates SHA-256 for both the local file and the destination copy, and compares the hashes. Only a matching copy gets renamed to the final Jellyfin filename.

An existing version stops the operation. RipFoundry does not assume that a same-named file is disposable just because it has a new one ready.

The DVD ejects only after every selected title succeeds. That is a small detail, but it makes the final eject mean something useful: the workflow really is done.

## Linux still makes sense for this job

The Linux version is designed for Ubuntu and Debian. It uses Bash and the command-line tools I would already choose for the work: MakeMKV, FFmpeg and FFprobe, HandBrakeCLI, `curl`, `jq`, `rsync`, and standard checksum utilities.

It does not try to mount a NAS behind my back or bypass Linux permissions. The Jellyfin movie directory needs to be mounted and writable before RipFoundry starts. The repository includes CIFS guidance and diagnostics because storage setup is part of making the workflow reliable, but it remains an administrator decision.

Once the configuration points to local staging and the movie library, the normal starting point is deliberately boring:

```bash
ripdvd
```

For an existing movie, `upscale1080` can take an MKV path directly or search the configured library interactively. It reads the source, encodes in staging, validates the result, and transfers the additional version back beside the original.

## This is the foundation

RipFoundry for Linux is now public on [GitHub](https://github.com/kylereddoch/RipFoundry-for-Linux). The repository has the installation steps, configuration reference, architecture and safety notes, NAS setup, troubleshooting, contribution guidance, and release-packaging instructions.

There is also a [Windows version](/projects/ripfoundry-for-windows/) for doing the same expensive work on the Windows PC attached to the DVD drive. The interface is different, but the important rules carry over: preserve the source, stage locally, validate before transfer, and verify the final copy.

I built RipFoundry because I wanted adding a DVD to Jellyfin to feel like a process I could trust, not a sequence I hoped I remembered correctly. Now the shelf-to-library path has a tool of its own.

