---
title: EmojiCodec
description: EmojiCodec is my VS Code extension for converting emoji between native characters, hexadecimal, Unicode escapes, HTML entities, and Markdown shortcodes without leaving the editor.
summary: A privacy-minded VS Code extension that converts emoji and encoded emoji representations in either direction while preserving compound sequences.
date: 2026-06-12T11:30:00-05:00
projectOrder: 3
projectType: VS Code Extension
projectStatus: Active
badgeClasses: bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200
featuredImage: /assets/images/emojicodec-logo.webp
featuredImageAlt: EmojiCodec logo showing an emoji converting to and from encoded text
techStack:
  - TypeScript
  - VS Code
  - Unicode
  - Open Source
projectLinks:
  - label: Install from the VS Code Marketplace
    url: https://marketplace.visualstudio.com/items?itemName=KyleReddoch.emojicodec
  - label: View on GitHub
    url: https://github.com/kylereddoch/EmojiCodec
  - label: Read the introduction
    url: /blog/introducing-emojicodec-a-bidirectional-emoji-converter-for-vs-code/
---

EmojiCodec grew out of a small annoyance I kept running into while writing and working in VS Code: an emoji looks simple on screen, but the format I actually need can change depending on where I am putting it.

Sometimes I need the native emoji. Other times I need a hexadecimal value, an HTML entity, a Unicode escape, or a readable Markdown shortcode. EmojiCodec keeps that conversion inside the editor instead of sending me to a lookup website every time.

You can [install EmojiCodec from the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=KyleReddoch.emojicodec).

## What it converts

- Native emoji, such as `😀`
- Hexadecimal code points, such as `0x1F600`
- Unicode escapes, such as `\u{1F600}`
- HTML decimal and hexadecimal entities
- Markdown shortcodes, such as `:grinning_face:`

Every format is bidirectional. EmojiCodec can turn an emoji into an encoded representation, decode that representation back into an emoji, or convert directly between two encoded formats.

## Built for real emoji sequences

Emoji are often more complicated than one character. Flags, keycaps, skin tones, and joined emoji can contain several code points that need to stay together.

EmojiCodec recognizes complete Unicode RGI emoji sequences and preserves those relationships during conversion. It also leaves ordinary hexadecimal values, HTML entities, Unicode escapes, and unknown Markdown shortcodes alone when they do not represent a valid emoji.

## Privacy and security choices

All conversion happens locally. EmojiCodec makes no network requests, collects no telemetry, and does not use webviews, shell commands, or dynamic code execution.

It only processes text that is explicitly selected in the editor, validates encoded values before converting them, and includes a configurable selection-length limit. I wanted the extension to solve a focused problem without asking for more access than it needs.
