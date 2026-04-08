---
date: 2026-03-24T11:00:00-05:00
title: 'The FCC’s Router Crackdown Shouldn’t Surprise Anyone in Cybersecurity'
description: "The FCC’s latest router crackdown did not come out of nowhere. Consumer Wi-Fi routers have long been a privacy and cybersecurity risk."
tags: [cybersecurity, privacy, networking, network-security]
mastodon_url: https://infosec.exchange/@cyberseckyle/116285107638412217
---

{% image "/assets/images/network_security.png", "Black Wi-Fi router on a wooden table with glowing security icons and network lines floating above it, symbolizing consumer router security and privacy risks.", null, "eager", "text-center", "!important", [875], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

For years, the home router has been treated like an appliance you set up once and then forget about. That was always a mistake.

This week, the [FCC updated its Covered List to include foreign-made consumer routers](https://docs.fcc.gov/public/attachments/DOC-420034A1.pdf), which means new models in that category are blocked from receiving FCC authorization unless they receive conditional approval. That is a big deal, but it also needs a correction right up front because a lot of the early headlines made the story sound broader than it actually is.

## No, the FCC did not suddenly ban the router already in your house

The most important nuance is that this is **not** a blanket ban on every router Americans already own. The FCC’s own fact sheet says this action does **not** affect previously purchased consumer-grade routers, and consumers can continue using any router they have already lawfully purchased or acquired. The agency also issued a waiver so previously authorized routers can continue receiving software and firmware updates that mitigate harm to consumers through at least [March 1, 2027](https://docs.fcc.gov/public/attachments/DA-26-286A1.pdf). That matters because the worst possible version of this policy would have been one that scared people away from patching devices that are already in the field.

Coverage from [Reuters](https://www.reuters.com/sustainability/boards-policy-regulation/fcc-banning-imports-new-chinese-made-routers-citing-security-concerns-2026-03-23/) and [AP News](https://apnews.com/article/fcc-foreign-router-ban-national-security-technology-7e5333aeaf82496ce6350f57699db5ba) both made that distinction in the body of their reporting, even if some of the surrounding social chatter did not. That distinction matters because getting the facts right is part of the credibility test for any cybersecurity conversation, especially one tied to policy, national security, and supply chain anxiety.

Still, the core message is real: Washington is no longer willing to treat home networking gear as harmless consumer electronics. From a security perspective, that was overdue.

## Honestly, I am not shocked

I am not surprised by this crackdown because consumer routers have been one of the internet’s favorite soft targets for years. They sit at a uniquely valuable place on the network. They are always on, often exposed, rarely monitored, and commonly left in place long after the vendor has mentally moved on to newer hardware. That is exactly the kind of product category that gets abused by both criminal operators and state-linked actors. It is the same basic lifecycle problem I have been warning about in [The Network Edge Cleanup Most Teams Cannot Keep Putting Off](/blog/the-network-edge-cleanup-most-teams-cannot-keep-putting-off/).

The [CISA advisory on Volt Typhoon](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a) made this painfully clear back in 2024 when it said PRC state-sponsored actors had been observed leveraging compromised small office and home office routers to proxy command-and-control traffic. The [Justice Department’s operation against the KV Botnet](https://www.justice.gov/archives/opa/pr/us-government-disrupts-botnet-peoples-republic-china-used-conceal-hacking-critical) told a similar story: privately owned SOHO routers were being used to conceal the origin of activity targeting U.S. critical infrastructure.

That is the part people outside security sometimes miss. Attackers do not care that your router looks boring. They care that it is trusted by default, connected all the time, and sitting between your devices and the internet. A weak router is not just a weak gadget. It is a foothold, a relay point, a surveillance opportunity, and sometimes a disguise for someone else’s attack traffic.

## Routers have been botnet fuel for a long time

The FCC action also lands in the middle of a long record of router abuse that should have ended the “just set it and forget it” mindset years ago.

The [MITRE ATT&CK entry for Quad7](https://attack.mitre.org/campaigns/C0055/) describes a campaign built on compromised SOHO routers. It was initially composed primarily of TP-Link routers and later showed a significant increase in compromised Asus routers. MITRE says the infrastructure was used by China-affiliated threat actors for password-spraying and brute-force activity. That is not a fringe case. That is a reminder that cheap edge hardware can become useful attack infrastructure at scale.

On the criminal side, the [FBI warned in 2025](https://www.fbi.gov/investigate/cyber/alerts/2025/cybercriminal-proxy-services-exploiting-end-of-life-routers) that end-of-life routers with remote administration enabled were being compromised by a new variant of TheMoon malware and turned into proxy services. Read that again, because it cuts to the heart of why this matters. Your neglected home router is not only a risk to your own network. It can also become rented infrastructure for someone else’s fraud, account abuse, credential attacks, or anonymity layer.

Just a few days before the FCC move, [Reuters reported on a multinational disruption of four botnets that had infected more than 3 million devices worldwide](https://www.reuters.com/business/media-telecom/us-says-it-disrupted-botnets-that-infected-over-3-million-devices-worldwide-2026-03-20/), including IoT devices like webcams and routers. That is the ecosystem policymakers are looking at: low-cost, internet-facing devices that stay online forever, ship with uneven security, and routinely end up woven into criminal and state-backed operations.

So when I hear that foreign-made consumer routers are being restricted because they create national security and cybersecurity risk, my first reaction is not disbelief. My first reaction is that the policy finally caught up with what practitioners have been seeing for a long time.

## This is a privacy story too, not just a national security story

A lot of the coverage is framing this as a China story or a trade story. It is definitely those things. But it is also a privacy story, and I do not think enough people are saying that out loud.

Routers are privacy-critical devices. They sit at the choke point of the modern home. They can reveal what devices are connected, where traffic is going, what DNS lookups are being made, what services a household uses, and how that household behaves online at a broad level. Even when traffic is encrypted, the router and surrounding infrastructure still occupy a privileged position in the metadata chain.

Research from [UC San Diego on DNS interception by residential routers](https://www.sysnet.ucsd.edu/~voelker/pubs/homejack-imc21.pdf) found that DNS interception can happen inside the home itself, including by customer premises equipment. UC San Diego’s write-up on the research put it plainly: [the router in your home might be intercepting some of your DNS traffic](https://jacobsschool.ucsd.edu/news/release/3379). That should make anyone pause, because DNS behavior is deeply revealing. It can tell a lot about what people do online, even when the content itself is not visible.

Consumer Reports has also spent years documenting how [many wireless routers lack basic security protections](https://www.consumerreports.org/electronics-computers/wireless-routers/wireless-routers-lack-basic-security-protections-a5027029164/) and how router privacy and security practices vary widely. That is another uncomfortable truth here: long before this became a Washington headline, home networking gear had already been a weak point for both privacy and security.

This is why I think the public conversation needs to be broader than “foreign router bad.” The deeper problem is that the average consumer has almost no practical visibility into the security lifecycle, telemetry practices, update history, and cloud dependencies of the box sitting at the edge of their home network.

## The country of manufacture matters, but it is not the whole security model

I have a pretty strong opinion on this part: geography matters, but geography alone is not a security control.

If a router is assembled in a friendlier country but still ships with poor defaults, weak update hygiene, short support windows, opaque cloud management, and a sloppy vulnerability response process, it is still a problem. Moving manufacturing does not automatically fix insecure firmware, weak software engineering, or a vendor culture that treats security as an afterthought.

Even some of the more thoughtful coverage acknowledged that tension. [The Verge](https://www.theverge.com/news/899172/fcc-foreign-router-ban) pointed out the obvious question: if the real problem is outdated software, poor patching, and weak design choices, then simply shifting where the hardware is built is only part of the answer.

That does not mean the FCC got this wrong. It means this should be the beginning of a harder conversation, not the end of one.

If regulators are serious, the next step cannot just be blocking categories of devices based on origin. It also has to include better baselines around support commitments, vulnerability disclosure, secure defaults, update mechanisms, and product transparency. The [FCC’s Cyber Trust Mark program for IoT products](https://www.federalregister.gov/documents/2024/07/30/2024-14148/cybersecurity-labeling-for-internet-of-things) is at least a move in that direction, even if voluntary labels alone are not enough.

## What this means for normal people

For most people, the immediate implication is not that they need to rip out the router they already own tonight. The more realistic implication is that buying decisions, product availability, and prices may shift if manufacturers have to rework supply chains or pursue conditional approval. [AP noted](https://apnews.com/article/fcc-foreign-router-ban-national-security-technology-7e5333aeaf82496ce6350f57699db5ba) that shortages and price hikes are possible as vendors restructure manufacturing and navigate approvals.

What consumers should take from this is simpler and more practical. If you want the office and MSP version of the same conversation, my post on [common network ports you must know and secure](/blog/20-common-network-ports-you-must-know-and-secure/) pairs well with this one.

Your router deserves the same attention you already give your phone or laptop. Check whether the model is still supported. Install firmware updates. Disable remote administration unless you absolutely need it. Use a strong, unique admin password. Turn on automatic updates if the vendor offers them. [Replace end-of-life gear](/blog/the-network-edge-cleanup-most-teams-cannot-keep-putting-off/) instead of nursing it along until it dies.

That is not flashy advice, but it is the kind of boring discipline that keeps your home network from becoming somebody else’s infrastructure.

## What this means for MSPs, IT teams, and security people

In managed services and small business environments, this should be a wake-up call to stop treating consumer-grade network gear like acceptable long-term edge infrastructure.

Plenty of small offices and budget-constrained clients still run on equipment that was effectively chosen because it was cheap, available, and easy to install. That shortcut keeps coming back to bite people. If your edge device is unsupported, under-patched, vaguely documented, or impossible to inventory cleanly, it is already a risk management problem.

For [MSPs](/tags/msp/) and internal IT teams, this is a good moment to tighten standards around router lifecycle management. Inventory what is deployed. Identify end-of-support hardware. Review whether remote administration is enabled. Confirm firmware status. Standardize on vendors with better patch discipline and clearer support commitments. Stop letting the home office or micro-branch edge become the forgotten part of the security program.

Security teams spend a lot of time talking about identity, EDR, email threats, and SaaS exposure. All of that matters. But the humble router still decides how traffic enters and leaves the environment. Ignore that box long enough and attackers will keep reminding you why it mattered.

## The bigger lesson

The biggest lesson here is not just about one country, one vendor, or one FCC vote.

It is about the fact that we built an internet full of cheap, powerful, always-on edge devices and then acted surprised when they turned into botnet nodes, proxy relays, and privacy liabilities. Consumer routers have lived in that neglected space for years. They have been treated as throwaway plumbing by buyers, lightly maintained infrastructure by vendors, and prime opportunity by attackers.

So no, I am not shocked by the FCC’s move.

What would have been shocking is if years of botnet activity, router exploitation, proxy abuse, DNS interception concerns, and supply chain scrutiny had produced no regulatory response at all.

The real challenge now is making sure this does not stop at the headline.

Because the truth is that the router problem was never only about where these devices are made. It is about what happens when the most important box in the house is also one of the least scrutinized.
