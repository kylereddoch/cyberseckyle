---
date: 2026-05-04T11:00:50-05:00
title: Adding Quick Notes to My Website
description: I added a quick-note workflow to my website so I can publish smaller thoughts, little updates, and weekend notes without turning every idea into a full blog post.
tags: [personal, indie-web, notes]
---

I added a small thing to my website recently that I am probably more excited about than the size of the feature suggests.

I can now publish quick notes to the site without sitting down at my laptop, opening the repo, creating a new Markdown file by hand, filling out the front matter, committing it, pushing it, and waiting for the site to build.

That whole process works fine for regular posts. Honestly, I still like it for regular posts. There is something nice about writing in Markdown, committing the work, and treating the site like a real little home on the web.

But it is not exactly friendly to small thoughts.

Sometimes I just want to post a quick note. A small update. A weekend thought. A "hey, this thing happened" kind of post. Something that belongs on my website, but does not need to become a full article with headings, links, structure, and a whole production around it.

That is what this new workflow is for.

## What these little notes are

The notes section on my site has always been a little more casual than the main blog.

It is where my weekly notes live, but I also wanted it to become a place for smaller updates. Not everything needs to be a Big Blog Post. Some things are just a paragraph or two. Some things are more like a status update. Some things are a quick thought I want to keep on my own site instead of handing it straight to a social network.

That distinction matters to me.

I like Mastodon. I still use Mastodon. But I also do not want every small thing I write to start there. I want my website to be the main place again. The place where my writing lives first. The place I can link back to. The place that does not depend on whether a social platform changes something later.

So these quick notes are meant to give me a lower-friction way to publish small things here.

They might be personal updates. They might be quick tech thoughts. They might be small project notes. They might be tiny "I figured this out" posts. They might just be a moment I want to remember.

Basically, they are the stuff that used to get lost because it was too small for a blog post and too useful or personal to vanish into a social feed.

## Why I added the workflow

The main reason is simple: if publishing something takes too many steps, I will talk myself out of doing it.

That is not because I do not want to write. It is because friction adds up.

Opening the repo, remembering the exact file path, creating the front matter, getting the date right, slugging the title, committing the file, pushing it, and waiting for the deploy is fine when I am already in writing mode.

It is a lot when I am on my phone.

It is even more when the idea is small.

So I added a GitHub Actions workflow that can create the note for me. I give it a title and body, and it handles the boring parts:

- creates the Markdown file
- adds the front matter
- puts it under the notes section
- commits it to the repo
- triggers the site build

The note still lives in the same codebase as everything else. It is still plain Markdown. It still gets deployed with the rest of the site. I am not moving away from the static-site setup. I am just making it easier to feed the site from wherever I happen to be.

That feels like the right balance for me.

## Why there are two ways to publish

We landed on two options because I wanted this to work from both sides of my life.

The first option is the more manual one inside GitHub. I can open the workflow, fill in the title and body, run it, and let GitHub create the note. That is useful when I am already in GitHub or when I want a little more control.

The second option is the one I am most excited about day to day: an iOS Shortcut.

That means I can write a note from my phone and send it straight into the workflow. The shortcut packages up the title and body, sends it to GitHub, and GitHub does the rest.

That is the part that makes this feel less like "maintaining a website" and more like actually using my website.

I can be away from my desk, think of something worth saving, and post it without turning it into a whole project.

That is the kind of small quality-of-life improvement that makes a personal site feel alive.

## Why the iOS Shortcut matters

I use my phone all the time for little thoughts.

That is usually where the small stuff starts. Not in VS Code. Not in a browser tab full of documentation. Not in a quiet little writing session with coffee and perfect lighting.

It starts while I am out somewhere. Or sitting on the couch. Or waiting on something. Or thinking about an idea between other things.

If the only way to publish those thoughts is to remember them until I am back at my laptop, a lot of them will never make it.

The shortcut gives those thoughts a path.

It does not mean everything I type on my phone should become a post. It just means the site is no longer locked behind my desk.

That is a big deal for how I want to use this place.

## Not everything will go to Mastodon

One other thing worth mentioning: these notes will not always be posted on Mastodon.

Some might be. Some probably will be. But I do not want Mastodon to be the default gatekeeper for whether a small thought exists.

That means if you follow me there, you may not see every little note I publish here.

And honestly, I kind of like that.

It gives the website its own reason to exist. There can be things here that are quieter. Smaller. Less optimized for a timeline. More like a notebook sitting out in the open.

So if you enjoy the personal updates, project notes, weekly notes, and little bits of website tinkering, keep an eye on the [notes section](/notes/).

That is where more of this will start showing up.

It feels good to make the site easier to use from real life instead of only from my desk.

And that is really the whole point.
