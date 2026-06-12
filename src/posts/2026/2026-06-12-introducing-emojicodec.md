---
date: 2026-06-12T11:30:00-05:00
title: Introducing EmojiCodec, a Bidirectional Emoji Converter for VS Code
description: I built EmojiCodec to convert emoji between native characters, hexadecimal, Unicode escapes, HTML entities, and Markdown shortcodes without leaving VS Code.
searchIntent: Help VS Code users convert emoji and encoded emoji representations in either direction without relying on an online lookup tool.
featuredImage: /assets/images/emojicodec-logo.webp
featuredImageAlt: EmojiCodec logo showing an emoji converting to and from encoded text
tags: [open-source, projects]
category: projects
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116738180543951399"
mastodon_tags: [VSCode, OpenSource, Emoji, DeveloperTools]
---

I use emoji in more places than I probably realize.

They show up in my Weekly Notes, Markdown files, website templates, little interface details, and the occasional bit of code. The annoying part is that the emoji I can see is not always the format I actually need.

Maybe I need `&#x1F600;` for HTML. Maybe I need `\u{1F600}` for code. Maybe I am staring at an encoded value and just want to know which emoji it represents. The usual workflow is to leave VS Code, find a converter or reference page, paste the value, copy the result, and go back to what I was doing.

That is a lot of interruption for a tiny conversion.

So I built **EmojiCodec**, a VS Code extension that converts emoji and encoded emoji representations without making me leave the editor.

You can view the source and follow the project on [GitHub](https://github.com/kylereddoch/EmojiCodec). I also added a shorter [EmojiCodec project page](/projects/emojicodec/) here on the site.

## What EmojiCodec does

EmojiCodec converts selected text between six formats:

| Format | Example |
| --- | --- |
| Emoji | `😀` |
| Hexadecimal | `0x1F600` |
| Unicode escapes | `\u{1F600}` |
| HTML decimal entities | `&#128512;` |
| HTML hexadecimal entities | `&#x1F600;` |
| Markdown shortcodes | `:grinning_face:` |

The important part is that the conversion works in either direction.

It can turn `🚀` into `&#x1F680;`, turn `:rocket:` into an emoji, or convert `:rocket:` directly into an HTML entity. Every command first decodes any recognized emoji representation and then converts the result into the format you chose.

That makes it useful whether I am writing Markdown, working in a template, checking a Unicode value, or cleaning up content that arrived in a different format.

## The workflow stays inside VS Code

Using EmojiCodec is intentionally simple:

1. Select an emoji or supported encoded value.
2. Open the Command Palette and run **EmojiCodec: Convert Selection...**
3. Choose the format you want.

There are also direct commands for each output format, and the extension can convert multiple selections in one edit.

That last part is useful when the same format appears in several places. I can select each value, run one command, and replace all of them together instead of working through the file one conversion at a time.

## Emoji are more complicated than they look

A basic emoji can be represented by one code point. Plenty of emoji are not basic.

Flags, keycaps, skin-tone variants, and zero-width-joiner sequences can combine several code points into the one character or symbol we see on screen. For example, `👩🏽‍💻` is a sequence that combines a person, a skin-tone modifier, a zero-width joiner, and a laptop.

A converter that treats those pieces independently can easily produce the wrong result or lose information on the return trip.

EmojiCodec uses Unicode RGI emoji sequence recognition so those compound emoji stay together. It can convert them into a sequence of encoded code points and then accurately turn that sequence back into the original emoji.

For Markdown, it uses readable shortcodes where a unique name is available. When a specific variant or sequence does not have one, it creates a lossless `:unicode_...:` shortcode instead of pretending the information does not matter.

## I wanted it to be careful with ordinary text

Bidirectional conversion is useful, but it also creates an easy mistake to make: not every hexadecimal number, HTML entity, or Unicode escape is an emoji.

`0x41`, `&#65;`, and `\u{41}` all represent the letter `A`. EmojiCodec leaves them alone.

Before decoding an encoded value, the extension checks that the code points are valid and that the complete result is a recognized emoji sequence. Unknown Markdown shortcodes and invalid values stay unchanged too.

That validation matters because I want to be able to use the command on real text without worrying that it will quietly convert unrelated values just because they happen to use a familiar syntax.

## Local-only by design

The original annoyance could have been solved by bookmarking another conversion website, but I did not want a workflow that sends selected text somewhere else just to translate a Unicode value.

EmojiCodec does all of its work locally and makes no network requests. It has no telemetry, webviews, shell commands, secret storage, or dynamic code execution. It only reads and replaces text I explicitly select in the active editor.

There is also a configurable maximum selection length to reduce the chance of accidentally asking it to process an enormous block of text.

That security model is deliberately boring, which is exactly what I want from a focused editor utility.

## Building a small tool for a real annoyance

EmojiCodec is not trying to reinvent how anyone writes code. It solves one specific problem that kept pulling me away from the thing I was working on.

That is usually my favorite kind of project to build. The useful part is not that the conversion itself is flashy. The useful part is removing a small, repeated interruption and making the safer workflow the easier one.

The source is available now in the [EmojiCodec GitHub repository](https://github.com/kylereddoch/EmojiCodec), along with its tests, security notes, and development instructions. The Visual Studio Marketplace listing is the next part of the publishing path.
