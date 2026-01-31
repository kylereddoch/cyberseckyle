---
date: 2026-01-31T10:00:00-05:00
title: 'How a Blog Post Gets Built in My Corner of the Web'
description: "My personal draft-to-deploy rhythm: Ulysses for thinking, VS Code for shaping, Eleventy for building, and GitHub Pages for shipping."
tags: [blogging, personal, indie-web, eleventy]
mastodon_url: null
---

Some nights I open my blog folder the way you open the fridge. Not because I’m starving, but because I need to see what’s in there.

A half-finished draft. A headline that felt clever yesterday. A note to myself that just says “add screenshot here” like that’s a complete thought. The usual.

I’ve always liked reading posts about other people’s blogging workflows, not because there’s one “right” way, but because it proves the internet is still made of humans doing little human systems to keep themselves creating. Robert Birming has a solid roundup of these, and it was the nudge I needed to finally write mine down: [Our Blogging Workflow](https://robertbirming.com/our-blogging-workflow/).

My setup is simple and a little nerdy: **Ulysses → VS Code → Eleventy → GitHub Pages**.

It’s not glamorous. It’s reliable. It’s the exact kind of workflow I’d build for a client if the client was… me.

## Ulysses is where I talk to myself

If I’m being honest, the hardest part of blogging is not writing. It’s starting.

Starting means you have to commit to an idea. You have to pick a direction. You have to stop “thinking about writing” and actually put words somewhere they can’t hide.

That’s why I start in [Ulysses](https://ulysses.app/). It feels like a clean desk. No tabs screaming for attention. No layout decisions. No temptation to tweak the site instead of finishing the sentence.

{% image "/assets/images/ulysses-screenshot.png", "Ulysses writing app showing a blog post draft titled “The Little Assembly Line Behind My Blog Posts,” with the library on the left and the formatted draft preview on the right.", "Where the ideas get their first heartbeat: the draft starts in Ulysses before it ever touches code, templates, or deploys.", "eager", "text-center", "!important", [975], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

This is the messy stage. The permission-to-be-bad stage.

I’ll drop a rough outline and then I write straight through, even when it’s clunky. Especially when it’s clunky. I leave myself blunt notes like:

- “this needs an example”
- “tie this back to real life”
- “future Kyle will know what I meant”

Sometimes the draft reads like a ransom note made of cybersecurity opinions and caffeine. That’s fine. Ulysses is where the post becomes true before it becomes publishable.

## VS Code is where I stop writing and start building

At some point the draft stops feeling like a thought dump and starts feeling like a post. That’s the moment I move it into [Visual Studio Code](https://code.visualstudio.com/).

{% image "/assets/images/vs-code-screenshot.png", "Visual Studio Code with an Eleventy blog project open, editing a Markdown post titled “The Little Assembly Line Behind My Blog Posts,” with front matter and headings visible.", "Draft-to-deploy in motion: polishing the post in Visual Studio Code inside my Eleventy site before committing and pushing to GitHub Pages.", "eager", "text-center", "!important", [975], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

This is the gear shift.

In Ulysses, I’m chasing the idea.
In VS Code, I’m shaping it into something that belongs on my site.

I add the front matter. I tighten the headings. I make sure the flow makes sense when you’re skimming, because people skim. I also skim. We’re all skimmers with dreams.

This is also where my brain flips into “tech mode,” which is dangerous because tech mode loves infinite tinkering. I’ve learned I need a boundary here: editing is allowed, redesigning my whole site because a paragraph feels awkward is not allowed.

VS Code is where the post gets dressed and told to stand up straight.

## Eleventy is the quiet machine in the back room

My site runs on [Eleventy](https://www.11ty.dev/), and I like it for the same reason I like reliable infrastructure: it does what it says it does, and it doesn’t ask for a ceremony about it.

When I’m working on a post, I usually have the local build running so I can preview it as a real page. This is where things become obvious:

- That heading is too long.
- That section needs breathing room.
- That sentence sounded smart in markdown but looks like a brick wall on the page.

Previewing the post in Eleventy is like checking your work in production before you actually make it production. Which, yes, is the most “me” sentence possible.

## GitHub Pages is the moment it stops being mine and starts being the internet’s

The last step is my favorite because it feels final in a satisfying way.

Commit. Push. Done.

I host on [GitHub Pages](https://pages.github.com/), which keeps everything boring in the best possible way. No complex hosting dashboard. No fragile setup that only makes sense on Tuesdays. Just a workflow I understand: changes tracked, history preserved, deployment predictable.

It scratches the same itch as good IT work. You don’t just *finish* something, you ship it.

## The small security habits I can’t turn off

Working in cybersecurity does weird things to your brain. You start noticing the attack surface of everything, including your own hobby tools.

So my blogging workflow has a few quiet rules:

- I keep my VS Code extensions minimal. If I don’t trust it, I don’t install it.
- I pay attention when a repo or tool asks me to “trust” something. Trust prompts exist because bad things happen.
- I try to keep the publishing pipeline simple. Fewer moving parts means fewer surprises.

It’s not paranoia. It’s the same kind of basic discipline I’d want any client to have. I just happen to be both the client and the tech.

## The workflow, in plain English

When I’m doing it right, it looks like this:

- Draft in Ulysses because it makes starting easy.  
- Move to VS Code when it’s time to turn it into a real post.  
- Preview with Eleventy so I can see it the way readers will.  
- Commit and push so it becomes a real URL on GitHub Pages.

That’s the whole assembly line.

And the reason I’m writing this down is simple: the workflow is part of the creativity. If the process feels heavy, you avoid it. If it feels friendly, you come back.

I want to keep coming back.