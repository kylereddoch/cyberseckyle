---
date: 2026-02-11T14:00:00-05:00
title: "Goodbye, Ring. I'm Not Buying Into Your Mass Surveillance."
description: "Ring’s Super Bowl ad tried to sell a heartwarming story. I saw default opt-in surveillance getting normalized, and I’m done."
tags: [privacy, smart-home, cybersecurity]
mastodon_url: null
---

{% image "/assets/images/no-ring-doorbell.png", "Red “no” symbol over a video doorbell, representing rejecting Ring-style mass surveillance", "(Image generated using ChatGPT)", "eager", "text-center", "!important", [875], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

I have spent years doing the boring, unsexy work of keeping systems safe: least privilege, logging, MFA, segmentation, the whole “trust nothing” routine that MSP and security folks live in.

So when Ring used the **Super Bowl LX stage** on February 8, 2026 to pitch its AI-powered **[Search Party feature](https://ring.com/support/articles/pkhj7/search-party?srsltid=AfmBOoq0K58vEqfVFW1QeDgh8x4N1SjzC7_m74cUy52iFcoED3FG4xJ7)** as a feel-good neighborhood story, I felt something I did not expect from a doorbell brand.

I felt tired.

Not “wow, that ad was cheesy” tired. More like “this is how surveillance becomes normal” tired. You could see the reaction immediately in the **[coverage of the backlash](https://www.theverge.com/tech/876866/ring-search-party-super-bowl-ad-online-backlash)** and the way privacy advocates framed it as a turning point, not a cute marketing moment.

This is my last straw with Ring. I have already taken every privacy step I reasonably can. This feature, and the way it is being marketed, crosses a line I am not willing to pretend is fine anymore.

Goodbye, Ring.

## What the ad was selling

Ring’s Super Bowl spot tried to wrap this feature in a wholesome “neighbors helping neighbors” vibe. That is the emotional pitch.

The practical pitch is different: **a neighborhood-scale camera network that can be mobilized and scanned for a target**. The public conversation did not erupt because people hate lost dogs. It erupted because people recognized the pattern. The Verge’s write-up of the ad’s reception captured that fear clearly: this looks like a friendly on-ramp to something much bigger.  

## What Search Party actually does

Ring’s own description of **[Search Party](https://ring.com/support/articles/pkhj7/search-party?srsltid=AfmBOoq0K58vEqfVFW1QeDgh8x4N1SjzC7_m74cUy52iFcoED3FG4xJ7)** is simple: outdoor Ring cameras can use AI to spot missing dogs (and signs of wildfire via Fire Watch) when a neighbor posts an alert. If a camera flags a possible match, the camera owner is notified and can choose whether to share relevant snapshots or video.

Ring and Amazon keep emphasizing that “sharing is optional.” Sure. But the privacy debate is not just about the sharing step. It is about building a system where **computer vision runs at neighborhood scale** and then selling that as normal civic behavior.

## The consent problem: enabled by default is not consent

Here is the piece that pushed a lot of security folks from “hmm” to “nope.”

Ring rolled Search Party out in a way that **[enabled it by default for many users](https://www.theverge.com/news/790928/ring-search-party-cameras-default-opt-out)**, which means opting out is on the customer, not the company.

That matters because defaults become reality. In security, we do not design safety around the assumption that millions of people will hunt through settings menus. We design around the assumption that they will not.

If you want to see how straightforward it is to shut off, **[Engadget’s quick disable guide](https://www.engadget.com/big-tech/heres-how-to-disable-rings-creepy-search-party-feature-185420455.html)** lays out the taps. But the fact that an article like that is even necessary tells you what kind of rollout this was.

## “But it’s only pets” is not a comfort, it’s a pattern

If you have been in cybersecurity long enough, you develop an allergy to “it’s only for X.”

Tools evolve. Capabilities drift. Data gets repurposed. That is not paranoia, it is the normal lifecycle of a successful surveillance-adjacent feature.

The **[EFF’s critique](https://www.eff.org/deeplinks/2026/02/no-one-including-our-furry-friends-will-be-safer-rings-surveillance-nightmare-0)** basically screams what a lot of us are thinking: you normalize the pipeline with something emotionally disarming, then you expand the pipeline once people accept the premise.

And you do not need facial recognition to create harm. Time, location, movement patterns, who visits which house, which kid walks home when, which cars come and go, all of that becomes easier to correlate once a neighborhood is treated like a searchable dataset.

## Ring’s trust problem: history matters

This is where Ring loses any benefit of the doubt.

The **[FTC’s 2023 complaint and settlement](https://www.ftc.gov/news-events/news/press-releases/2023/05/ftc-says-ring-employees-illegally-surveilled-customers-failed-stop-hackers-taking-control-users)** alleged Ring allowed broad employee and contractor access to private videos and failed to implement basic protections that enabled account takeovers and access to cameras and videos.

Then the FTC later announced **[refunds tied to that settlement](https://www.ftc.gov/news-events/news/press-releases/2024/04/ftc-sends-refunds-ring-customers-stemming-2023-settlement-over-charges-company-failed-block)**.

So when Ring says “trust our guardrails,” my response is simple: trust is a security control, and Ring has already demonstrated it does not treat that control seriously enough.

## The law enforcement gravity well

Even if you never share footage, building a giant residential camera network creates a permanent temptation for law enforcement and government agencies.

Ring has adjusted its approach under pressure. The **[Associated Press reported in 2024](https://apnews.com/article/56a128dcd77a4cb0b27d71be9384fe1a)** that Ring ended the Neighbors app “Request for Assistance” tool that let police request footage directly from users, after years of criticism.

But Ring also created new pathways. Consumer Reports has covered how **[Community Requests lets police ask for user videos](https://www.consumerreports.org/electronics/privacy/ring-community-requests-lets-police-ask-for-user-videos-a2437818485/)** again through Neighbors.

And then the ecosystem gets stickier. The Verge detailed Ring’s partnership where **[Ring now works with Flock Safety](https://www.theverge.com/news/801856/amazon-ring-partners-flock-video)**, connecting residential cameras into a broader surveillance and evidence-collection orbit.

This is what I mean by “mass surveillance.” Not one camera. Not one request. A system that keeps drifting toward “your neighborhood is an always-on sensor layer,” with more stakeholders, more integrations, and more pressure to participate.

## Why this was my breaking point

I tried to be the “reasonable security guy” about smart home gear.

I hardened the accounts. I reviewed settings. I reduced retention. I kept social features off. I treated IoT like hostile endpoints and segmented accordingly. I did the homework that vendors quietly rely on their customers to do.

Then Ring shipped a neighborhood scanning feature, rolled it out in a way that was **[on by default](https://www.theverge.com/news/790928/ring-search-party-cameras-default-opt-out)** for many people, and used the **[Super Bowl](https://www.nfl.com/super-bowl/event-info/)** to make it feel like this is just what good neighbors do.

That is the trick. Normalize it culturally, then let inertia handle the rest.

I am not playing along.

I am removing mine. Last straw.

## If you are keeping Ring, turn off Search Party today

If you keep the hardware, at least disable the feature in the app using Ring’s own steps in **[“Keeping your community safe with Search Party”](https://ring.com/support/articles/pkhj7/search-party?srsltid=AfmBOoq0K58vEqfVFW1QeDgh8x4N1SjzC7_m74cUy52iFcoED3FG4xJ7)**. If you want the quick version, **[Engadget’s walkthrough](https://www.engadget.com/big-tech/heres-how-to-disable-rings-creepy-search-party-feature-185420455.html)** is the fastest “tap here, toggle that” guide.

## What I want from smart home security instead

My north star going forward is still simple, but I’m being a lot more stubborn about it now: I want cameras and doorbells that live *inside* my smart home platform, not orbiting it.

I already run my house through **Apple Home**, and I actually like what **[HomeKit Secure Video](https://support.apple.com/guide/icloud/icloud-homekit-secure-video-mme054c72692/icloud)** is trying to do: encrypted storage, with the analysis happening locally on the home hub instead of some random cloud pipeline I can’t audit. Apple’s own documentation is pretty clear that **[HomeKit Secure Video is tied to iCloud+](https://support.apple.com/guide/icloud/icloud-homekit-secure-video-mme054c72692/icloud)** and that the recordings are **end-to-end encrypted** with the “what is in this clip” detection happening on-device. That model aligns way more with how I think about trust boundaries.

The problem is, when I originally set this all up, **good HomeKit Secure Video doorbell options were basically a ghost town**, at least for what I needed and what was actually available to buy. Ring, through **Homebridge**, worked for me at the time. It was the “duct tape that holds the internet together” approach, using the community tooling around Ring’s unofficial API so I could surface the doorbell in Apple Home. The **[dgreif/ring project](https://github.com/dgreif/ring)** and its Homebridge ecosystem made that possible, even if it still meant my doorbell was fundamentally living in Ring’s cloud world.

That tradeoff felt tolerable back then.

It does not feel tolerable now.

The good news is my options are finally growing. Companies like **Aqara** are shipping doorbells that support **HomeKit Secure Video** out of the box, like the **[Aqara Smart Video Doorbell G4](https://www.aqara.com/us/product/smart-video-doorbell-g4/)**, and even newer models like the **[Aqara G410](https://www.theverge.com/news/703741/aqaras-feature-packed-g410-video-doorbell-is-now-available)** are landing with upgraded specs while still keeping Apple Home integration in the picture. Apple also maintains a live list of doorbells that support HKSV in the Home app ecosystem, including options like **ecobee** and **Logitech** on the official **[Apple Home accessories page](https://www.apple.com/home-app/accessories/)**.

So the plan now is straightforward: go native in Apple Home with a HomeKit Secure Video doorbell, stop depending on Ring plus Homebridge as a workaround, and stop funding a company that keeps drifting toward opt-out surveillance as a business strategy.

Technology should make my home safer without turning my front porch into a participation badge for mass surveillance.

Ring is no longer aligned with that idea.

So yeah.

Goodbye, Ring.