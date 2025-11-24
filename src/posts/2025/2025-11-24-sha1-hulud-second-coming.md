---
date: 2025-11-24T11:30:00-05:00
title: 'Sha1-Hulud: The Second Coming Of The Shai-Hulud NPM Worm'
description: "A practical breakdown of the new “Sha1-Hulud: The Second Coming” supply chain campaign, how it builds on the original Shai-Hulud npm worm, what is actually happening under the hood, and what dev teams, MSPs, and orgs should do right now."
tags: [security, npm, javascript, incident-response, malware, devsecops, news]
mastodon_url: https://infosec.exchange/@cyberseckyle/115606020346420806
---

{% image "/assets/images/sha1_hulud_second_hero.png", "Chrome DL Autofill Hero", null, "eager", "text-center", "!important", auto, "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

The Shai-Hulud npm worm is back, and the sequel is nastier.

Security teams are tracking a new wave branded by the attackers themselves as **“Sha1-Hulud: The Second Coming.”** It builds directly on the original Shai-Hulud npm supply chain attack from September and pushes the blast radius from hundreds of packages to **hundreds of npm packages and tens of thousands of GitHub repositories** stuffed with stolen secrets.[^1][^2][^3][^4][^5]

In my earlier write up on the **first Shai-Hulud wave**, I walked through how a self replicating worm in the npm ecosystem used compromised maintainer accounts to push malicious package versions that exfiltrated credentials and then spread further via developer tooling.[^1]

👉 **Previously:** *[Background on the original Shai-Hulud npm worm](/blog/the-npm-shai-hulud-supply-chain-meltdown-what-it-broke-what-it-means-and-what-we-fix-next/)*

This post picks up from there and focuses on what is new in the **Sha1-Hulud “Second Coming”** campaign, how it actually works, and what I think teams should do immediately.

## Quick recap: what Shai-Hulud was doing the first time

If you missed the first round, here is the short version.

Researchers in September identified a novel **self replicating worm** in the npm ecosystem. It targeted popular packages, stole credentials and tokens from developers and CI environments, and then used those same secrets to:

- Publish trojanized npm package versions  
- Modify or create GitHub repos  
- Spread further through whatever developer workflows those tokens could touch[^1][^3]

It was noisy, ugly, and a clear signal that the “supply chain attack” story has moved from theory to automation.

The good news: platforms and vendors coordinated, removed malicious packages, and many orgs rotated tokens.

The bad news: the attackers learned from that response and came back smarter.

## What is “Sha1-Hulud: The Second Coming”?

The new campaign is essentially **Shai-Hulud 2.0** under a slightly different banner. Various research teams now refer to it as **“Sha1-Hulud: The Second Coming”** after the description that appears on attacker controlled GitHub repositories full of stolen secrets.[^2][^4]

Key points from the latest reporting:

- **Scope**  
  - More than **800 trojanized npm packages** have been observed in this wave[^5]  
  - Impacted ecosystems include packages tied to **Zapier, ENS Domains, PostHog, Postman, and others**, which means deep integration with SaaS, low code platforms, and analytics tooling[^1][^2]  
  - The attack has spawned **tens of thousands of GitHub repos** that contain exfiltrated credentials and project data[^1][^2][^4][^5]

- **Branding and signaling**  
  - New GitHub repos created by the malware often include descriptions like **“Sha1-Hulud: The Second Coming”** which is how researchers linked this variant to the original Shai-Hulud line[^2][^4]

- **Likely lineage**  
  - Code identifiers such as `SHA1HULUD`, similar tactics, and the same obsession with GitHub based exfiltration strongly suggest the same or closely related actor.[^1][^3]

In short, this is not a random copycat. It looks like an iteration from someone who watched the first incident response play out and tuned their malware accordingly.

## How the new wave works under the hood

Vendors have slightly different write ups, but the core flow of **Sha1-Hulud: The Second Coming** is fairly consistent across reports.[^1][^2][^3][^4][^5]

### 1. Compromised npm packages

Attackers either compromise maintainer accounts or reuse previously compromised tokens to publish malicious versions of legitimate packages. These are not obviously shady “totally cool crypto miner” packages. Many have real users and real dependencies further downstream.

During `npm install` or similar flows, the trojanized package runs **install lifecycle scripts** that pull down and execute additional payloads. Researchers have seen new payload files like `setup_bun.js` and `bun_environment.js` referenced in this second wave.[^1][^3]

### 2. Credential theft and project data exfiltration

Once the payload executes on a developer machine or CI runner, it goes after credentials and local project data. Different analyses have seen it target things like:

- Auth tokens and API keys  
- Cloud provider credentials  
- CI and deployment secrets  
- Local configuration and environment files  

Some variants write collected data into JSON blobs such as `environment.json` or `truffleSecrets.json` before exfiltration, which gives you nice forensic breadcrumbs if you catch it.[^2][^3][^4]

### 3. Abuse of GitHub as a data mule and replication engine

Instead of shipping data to some sketchy VPS, the malware:

1. Uses stolen credentials to authenticate to GitHub  
2. Creates new repos with random names and a description like **“Sha1-Hulud: The Second Coming”**  
3. Commits the stolen data into these repos, often in bulk JSON files  
4. In some cases, uses those same repos and tokens to compromise additional packages and spread further  

This has a few nasty side effects:

- It hides exfiltration in what looks like “normal” developer traffic  
- It spreads secrets across thousands of repos that may be discovered later by other attackers who are hunting for easy credentials  
- It gives defenders a messy cleanup job, because those repos often live under multiple user accounts and orgs[^1][^2][^4][^5]

### 4. Blast radius and persistence

The scary part is not just the initial theft. Once an attacker has your:

- Cloud tokens  
- CI tokens  
- Repository access  

they can **pivot** into other services, inject code into pipelines, and create backdoors that survive long after the original npm packages are taken down.

This is the definition of “supply chain plus identity compromise”, not a one and done package removal.

## How this variant is different from the first wave

From a defender’s point of view, the Second Coming has a few important differences.

### Higher scale and more automation

The first Shai-Hulud wave hit hundreds of packages and created a meaningful number of malicious repos. This one scales into **tens of thousands of repos** and compromises across multiple major ecosystems, with growth that has been measured in **thousands of new repos per hour** at certain points.[^1][^2][^4][^5]

Translation: the attacker fully embraced automation.

### Better tuned to low code and SaaS centric workflows

By hitting packages that plug into **Zapier, ENS, PostHog, Postman, and similar ecosystems**, the malware lands in workflows that often sit close to:

- Production data  
- Customer integration logic  
- Sensitive operational dashboards[^1][^2]

That is a very different threat model than “just” targeting a random logging utility.

### More resilient to cleanup

Publishing secrets to many public or private repos makes cleanup slower and easier to miss. You can remove the bad npm packages and still have dozens of GitHub repos out there holding your old tokens.[^4][^5]

That slow burn is part of what makes this wave dangerous.

## How to tell if you might be affected

Here is where I would start, in roughly this order.

### 1. Search GitHub for obvious markers

In your org and user accounts, search for repos that:

- You do not recognize, **and**  
- Have descriptions like `Sha1-Hulud: The Second Coming` or similar wording.[^2][^4]

Useful queries for GitHub search:

- `org:<YOUR_ORG_NAME> "Sha1-Hulud: The Second Coming"`  
- `"Sha1-Hulud" "Second Coming" in:readme,description`

If you find repos that you did not intentionally create, assume the secrets inside are compromised and treat that as an incident.

### 2. Check if you depend on known bad packages

Several vendors are publishing regularly updated lists of compromised packages for both the original Shai-Hulud wave and the Sha1-Hulud Second Coming wave.[^1][^2][^3][^5]

Practical steps:

- Pull a list of all npm dependencies from:
  - `package.json`  
  - `package-lock.json` or `npm-shrinkwrap.json`  
  - `pnpm-lock.yaml` or equivalent  
- Compare against vendor or community lists  
- Pay special attention to packages that connect to:
  - Automation platforms like Zapier or similar  
  - Identity, secret management, or deployment tooling  

If you find a match, check install logs and CI logs to see whether the malicious version ran in your environment.

### 3. Hunt for exfil and weird installs in logs

Look for:

- `npm install` runs that suddenly include extra network calls during install  
- Outbound traffic from CI or developer machines to GitHub API endpoints that do not match normal patterns  
- Creation of repos from CI tokens, especially in user accounts or orgs that do not normally auto create repos  

Depending on your logging maturity, this can range from trivial to painful. If you have GitHub audit logs, start there.

## Immediate response steps if you see signs of Sha1-Hulud activity

If you find suspicious repos, compromised packages, or install logs that line up with this campaign, here is the minimum I would treat as non negotiable.

### 1. Rotate everything that could be in those repos

Assume the attacker has read any token, key, cookie, or config value stored in those GitHub repos.

- Rotate:
  - GitHub personal access tokens  
  - CI and build system secrets  
  - Cloud provider keys  
  - Database and message queue credentials  
- Invalidate old tokens and audit for reuse after rotation  

Credential rotation is annoying. Leaving stolen tokens active is worse.

### 2. Lock down GitHub and npm access

- Enforce **strong MFA** on GitHub and npm accounts  
- Use **fine grained PATs** and GitHub app tokens instead of broad classic tokens where possible  
- Limit which CI runners and machines can publish to npm or create repos in your org  

The whole campaign thrives on over privileged, long lived tokens.

### 3. Rebuild from a known good state

For critical systems:

- Rebuild containers and artifacts from clean, verified sources  
- Scan for backdoors such as:
  - Unexpected Git hooks  
  - Extra npm scripts  
  - Suspicious files like `setup_bun.js` dropped in random places[^1][^3]  

Do not trust build artifacts that passed through compromised environments without fresh validation.

### 4. Close the “surprise repo” loophole

Add guardrails so that:

- CI tokens cannot create new repos without going through a workflow you monitor  
- You get alerts when:
  - New repos appear under your org  
  - Private repos are made public  
  - Repos are created from unusual IPs or locations  

GitHub audit logs and security center features are your friend here, even if you have to tune the noise.

## What this means for npm, open source, and MSPs

From my perspective in MSP and cybersecurity work, there are a few uncomfortable truths this campaign reinforces.

### npm is part of your identity surface now

Package managers are no longer “just code”. They are a direct path to:

- Developer laptops  
- CI systems  
- Cloud accounts  

If you treat npm and similar ecosystems as trusted by default, attackers will happily keep shipping credential stealing worms packaged as “normal dependencies”.

### Open source maintainers cannot carry this alone

This is not a maintainer morality tale. Yes, some accounts were compromised. Yes, supply chain hygiene on the publisher side matters.

But if you are an organization:

- You cannot outsource basic identity and token hygiene  
- You cannot pretend your dependency tree is someone else’s risk  
- You must have a story for how you detect and respond to this kind of attack  

### MSPs need supply chain playbooks, not ad hoc cleanups

If you manage multiple client environments, you should treat Sha1-Hulud and its sequel as a pattern:

- First wave: proof of concept at scale  
- Second wave: more automation, deeper integration, wider blast radius  

There will be a third wave from someone, even if the branding is different.

Your team needs:

- A reusable checklist for supply chain incidents  
- Scripts or tools to:
  - Enumerate dependencies  
  - Cross check against known bad lists  
  - Search GitHub orgs for suspicious repos and descriptions  
- A communication template for clients that explains what happened in plain language and what you did about it  

## How this ties back to the first Shai-Hulud article

In the **first article** I talked about Shai-Hulud as a turning point for npm and software supply chain security in general. We went from “a few compromised packages here and there” to a **self replicating worm** that treats developer ecosystems as a playground.

Sha1-Hulud: The Second Coming confirms where this is heading:

- Attackers are comfortable chaining **package compromise plus identity theft plus cloud abuse**  
- GitHub and other developer platforms are now high value data stores for stolen secrets  
- The line between “app security”, “identity security”, and “supply chain security” is mostly a paperwork distinction  

If you have not read that earlier breakdown or want to refresh how the first wave worked and how we got here, you can start there and then come back to this piece.

👉 *[Read my earlier Shai-Hulud npm worm article](/blog/the-npm-shai-hulud-supply-chain-meltdown-what-it-broke-what-it-means-and-what-we-fix-next/)*

## Practical checklist to take away

To keep this grounded, here is a short checklist you can adapt for your team:

1. **Inventory**  
   - Enumerate npm dependencies across projects  
   - Compare against current Sha1-Hulud and Shai-Hulud compromise lists from reputable vendors  

2. **Hunt**  
   - Search GitHub orgs and user accounts for repos with “Sha1-Hulud” or “The Second Coming” in descriptions or files  
   - Look for unusual repo creation events and install time network behavior  

3. **Respond**  
   - Rotate any tokens or keys exposed in suspicious repos  
   - Remove malicious npm versions and rebuild from known good sources  

4. **Harden**  
   - Enforce MFA, short lived tokens, and least privilege scopes  
   - Limit which identities can publish packages or create repos  
   - Add monitoring for new repos, public repo changes, and token use anomalies  

5. **Document**  
   - Turn what you learn into a runbook for the next supply chain event  
   - Train devs on why “just adding one more dependency” is not a free move anymore  

The Sha1-Hulud Second Coming is ugly, but it is also a chance to tighten practices that have been too loose for a long time. Supply chain security is not a niche concern now. It is part of basic hygiene for any team that ships code.

---

#### Further reading

- Wiz Research: *Shai-Hulud 2.0 supply chain attack on npm*[^1]  
- StepSecurity: *Sha1-Hulud: The Second Coming*[^2]  
- BleepingComputer: coverage of Shai-Hulud and “Second Coming” exfiltration behavior[^3]  
- Koi Security: live incident tracking and IoC feed for Sha1-Hulud Second Coming[^4]  
- Cybersecurity News: summary of 800+ npm packages and thousands of repos compromised[^5]  

[^1]: Wiz Research. Shai-Hulud npm and Shai-Hulud 2.0 supply chain campaign analysis. Wiz security blog. <https://www.wiz.io/>  
[^2]: StepSecurity. *Sha1-Hulud: The Second Coming* and related npm supply chain indicators. <https://stepsecurity.io/>  
[^3]: BleepingComputer. Coverage of the Shai-Hulud npm worm campaigns and GitHub exfiltration behavior. <https://www.bleepingcomputer.com/>  
[^4]: Koi Security. Live tracking dashboard and indicator set for the Sha1-Hulud “Second Coming” campaign. <https://koisecurity.com/>  
[^5]: Cybersecurity News. Article summarizing the compromise of 800+ npm packages and tens of thousands of GitHub repositories in the Sha1-Hulud campaigns. <https://cybersecuritynews.com/>