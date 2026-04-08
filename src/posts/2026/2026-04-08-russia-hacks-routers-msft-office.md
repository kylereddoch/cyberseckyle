---
date: 2026-04-08T11:00:00-05:00
title: Russia’s Router Campaign Should Be a Wake-Up Call for Every Office
description: APT28 did not need to break Microsoft to create real risk. By abusing neglected routers, hijacking DNS, and sitting in the middle of web traffic, the group turned cheap edge hardware into a serious credential theft and surveillance problem.
featuredImage: /assets/images/russia-router-hack.png
tags: [cybersecurity, threat-intelligence, MSP]
mastodon_url: https://infosec.exchange/@cyberseckyle/116370250112131094
---

One of the biggest mistakes I see in small business IT and even in some larger environments is that routers are still treated like background equipment. I have been circling this theme for a while in posts like [The FCC’s Router Crackdown Shouldn’t Surprise Anyone in Cybersecurity](/blog/the-fccs-router-crackdown-shouldnt-surprise-anyone-in-cybersecurity/) and [The Network Edge Cleanup Most Teams Cannot Keep Putting Off](/blog/the-network-edge-cleanup-most-teams-cannot-keep-putting-off/), and this campaign is exactly why.

They get installed, they blink, they pass traffic, and as long as the internet “works,” nobody wants to think about them again. The attention goes to endpoints, MFA, email filtering, backups, and cloud security. Those things matter a lot, obviously, but the newest reporting on Russia-linked router compromises is a reminder that the edge still matters more than many people want to admit. It is the same reason I keep arguing that [the biggest cybersecurity risk for SMBs still is not the fancy stuff](/blog/the-biggest-cybersecurity-risk-for-smbs-still-isnt-the-fancy-stuff/).

According to [KrebsOnSecurity](https://krebsonsecurity.com/2026/04/russia-hacked-routers-to-steal-microsoft-office-tokens/), [Microsoft Threat Intelligence](https://www.microsoft.com/en-us/security/blog/2026/04/07/soho-router-compromise-leads-to-dns-hijacking-and-adversary-in-the-middle-attacks/), the [U.K. National Cyber Security Centre](https://www.ncsc.gov.uk/news/apt28-exploit-routers-to-enable-dns-hijacking-operations), and the [FBI/IC3 public warning](https://www.ic3.gov/PSA/2026/PSA260407), the Russian state-linked group APT28, also tracked as Forest Blizzard and Fancy Bear, has been exploiting vulnerable small office and home office routers to overwrite DHCP and DNS settings. That let the attackers redirect traffic through infrastructure they controlled, selectively intercept requests, and steal passwords, OAuth tokens, and other credentials tied to web and email services. Microsoft also said the activity supported adversary-in-the-middle attacks against Transport Layer Security connections tied to Outlook on the web.

## This Is Bigger Than a Microsoft Story

That is the part I think people are going to undersell if they only skim the headlines.

This is not just another “Russia hacked something” story. It is a story about how neglected infrastructure at the edge can quietly erode the security of everything behind it. The attackers did not need to start with a workstation or break into Microsoft’s own services. Microsoft explicitly said its telemetry did not indicate compromise of Microsoft-owned assets or services. Instead, the group went after weaker, less monitored devices upstream of the real targets and used that position to collect visibility, redirect traffic, and steal credentials.

That is a smart attack path, and honestly, it is a very practical one.

Attackers know a lot of organizations have gotten better about endpoint controls and identity protections. They know more businesses are using MFA, conditional access, EDR, and stronger cloud security baselines. So what do they do? They look for the piece of the environment that still gets treated like an appliance instead of a security boundary.

That piece is often the router.

## Why the Scale Matters

Microsoft said the campaign has been active since at least August 2025, and [The Hacker News](https://thehackernews.com/2026/04/russian-state-linked-apt28-exploits.html) reported that activity appears to have started in a more limited fashion by May 2025 before ramping up. At its peak in December 2025, more than 18,000 unique IP addresses across at least 120 countries were observed communicating with the malicious infrastructure. Microsoft also said it identified more than 200 organizations and 5,000 consumer devices affected by the campaign. That scale is also a reminder that [unsupported or weakly managed edge devices](/blog/the-network-edge-cleanup-most-teams-cannot-keep-putting-off/) do not stay "small" problems for very long.

That kind of scale matters for two reasons.

First, it shows this was not a narrow boutique operation. This was broad, opportunistic, and built to give the attackers a large pool of possible victims. The NCSC said the activity appears opportunistic, with the actor gaining visibility into a wide victim pool and then filtering down toward users of likely intelligence value.

Second, it shows just how many organizations still have weak or aging edge gear in the wild.

That is where my opinion gets stronger: unsupported or weakly managed routers are one of the most quietly dangerous blind spots in small business security.

Not because they are glamorous. Not because every router compromise turns into a breach headline. But because they are trusted by default. They sit in a position where they can shape traffic for every laptop, phone, and browser behind them. If an attacker can tamper with DNS there, they do not need to win at every endpoint. They just need to get in the middle at the right moment.

## Why This Technique Is So Dangerous

The official advisories make that pretty clear. The [FBI/IC3 notice](https://www.ic3.gov/PSA/2026/PSA260407) says the attackers changed DHCP and DNS settings on vulnerable routers so connected laptops and phones inherited malicious resolver settings. For certain domains and services, including Microsoft Outlook Web Access, the actor-controlled infrastructure could provide fraudulent DNS answers and enable adversary-in-the-middle attacks if users continued through certificate warnings. That gave the attackers a chance to view traffic unencrypted and steal sensitive data.

This is also why I do not like framing the story as only a Microsoft 365 issue.

Yes, Microsoft 365 and Outlook on the web were part of it. Yes, authentication tokens and Office-related access are what grabbed the headline. But the deeper lesson is bigger than Microsoft. The technique matters more than the brand name in the headline. Once an attacker controls or influences DNS and can selectively manipulate where traffic goes, that becomes an identity problem, a browser trust problem, a remote work problem, and potentially a much broader business risk problem. That is part of why I think [your help desk is now part of the attack surface](/blog/your-help-desk-is-now-part-of-the-attack-surface/) too: modern attacks keep chaining together trust, routing, and identity instead of staying in one neat bucket.

That matters a lot for MSPs, internal IT teams, and security people supporting hybrid environments.

## Remote Work Did Not Create This Problem

Microsoft specifically warned that unmanaged SOHO devices used by remote and hybrid employees can expose cloud access and sensitive data even when the enterprise environment and cloud services themselves remain secure. That is one of the strongest takeaways in the whole write-up, in my opinion. A company can do a lot of things right on the corporate side and still inherit risk through home or small-office routing equipment that nobody is monitoring closely.

That does not mean remote work is the problem. I do not buy that lazy conclusion.

The problem is pretending that home networks and tiny branch networks are somehow outside the real threat model. They are not. If people are accessing business email, files, SaaS apps, and administrative portals through those networks, then those routers are part of the trust chain whether leadership wants to think about them that way or not.

Another important point here is how little malware was required to make this dangerous. Krebs reported that the campaign allowed token harvesting across more than 18,000 networks without deploying malware or code onto the victim endpoints. That is a detail security teams should not ignore, because it reinforces a truth we sometimes forget: not every serious intrusion starts with obvious malware on a workstation. Sometimes the attacker gets what they need by abusing trust, positioning, and traffic flow instead.

## The Real Lesson Is Architectural

That is a major reason I think this story deserves more than a short “patch your router” post.

The real lesson is architectural.

For years, the industry has pushed toward identity-centric security, zero trust ideas, and better endpoint visibility. I agree with that direction. But stories like this are a reminder that the humble router still sits in a powerful place. If it is compromised, it can become a surveillance point, a redirector, and a stepping stone into account theft, session abuse, and possibly follow-on attacks.

That is exactly why I think too many businesses still underestimate network edge security. There is a tendency to separate “networking” from “security” as if they are different conversations, but in real environments they overlap constantly. The router decides where traffic goes, which systems get trusted name resolution, and in many small businesses it is one of the most privileged devices in the entire environment. If that box is weak, the environment is weaker than people think.

And once an attacker is in an adversary-in-the-middle position, credential theft is not the only possible outcome. Microsoft noted that while it observed the campaign being used for information collection, an attacker in that position could potentially use it for other outcomes too, including malware delivery or denial-of-service style impacts.

That point deserves more attention too. A lot of people read a story like this and focus only on the Microsoft token angle because it sounds specific and current. But once you accept that the attacker can manipulate traffic and selectively intercept requests, the discussion gets bigger fast. This is not only about one cloud platform. It is about what becomes possible when a threat actor gets upstream of user trust.

## What Businesses and MSPs Should Do Now

So what should businesses, home offices, and IT providers take from this?

My view is that the practical response is not complicated, but it does require discipline.

Replace end-of-life and end-of-support routers. The [Department of Justice](https://www.justice.gov/opa/pr/justice-department-conducts-court-authorized-disruption-dns-hijacking-network-controlled) explicitly called that out in its remediation guidance, along with upgrading firmware, verifying DNS resolvers, and reviewing firewall rules to reduce remote management exposure. That is basic advice, but it is the right advice. If a router is too old to receive meaningful security updates, keeping it in service because it still powers on is not thrift. It is risk acceptance, whether the business realizes it or not. That is also why I keep tying router hygiene back to [managing vulnerabilities in an MSP environment](/blog/managing-vulnerabilities-in-an-msp-environment/) instead of treating it like a separate networking chore.

Review DNS and DHCP settings on office, branch, and small-site routers. The [NCSC advisory](https://www.ncsc.gov.uk/news/apt28-exploit-routers-to-enable-dns-hijacking-operations) centers on overwriting DHCP/DNS settings and redirecting traffic through attacker-controlled resolvers. If nobody in the environment knows what the expected resolver configuration should be, that is a governance problem as much as a technical one.

Disable internet-exposed remote administration unless there is a very specific operational need for it, and even then, lock it down hard. A surprising amount of edge-device risk still comes from management surfaces being far too reachable. If teams are not even sure which services and admin paths are exposed, that is where a basic [common network ports you must know and secure](/blog/20-common-network-ports-you-must-know-and-secure/) review becomes useful.

Take certificate warnings seriously. The FBI/IC3 advisory made it clear that some of the encrypted traffic interception relied on the victim proceeding through certificate errors. A lot of users have been trained, often by bad internal practices, to dismiss certificate warnings like they are just annoying popups. That culture needs to die.

Use stronger identity controls anyway. This campaign abused routers to get closer to tokens and credentials, but that does not make MFA, passkeys, and conditional access less important. It makes them more important. Strong identity controls are still part of how you reduce what stolen credentials can do once they are captured.

Segment where it makes sense. In larger environments, especially those with branch offices or mixed-use networks, it is worth rethinking whether critical business devices should be living on the same flat network as everything else. Segmentation is not a silver bullet, but it can make opportunistic abuse less fruitful.

Monitor edge devices like they actually matter. That includes firmware lifecycle management, configuration review, admin exposure checks, DNS sanity checks, and documentation. One reason routers are such good footholds is because too many businesses do not really monitor them unless the internet goes down. If you are trying to operationalize that visibility, this is exactly where [making SIEM useful](/blog/making-siem-useful-how-it-works-what-it-does-and-why-you-should-care/) stops being a theory post and becomes practical.

And just as important, stop assuming that because a device is “network gear,” it falls outside the normal patching and governance conversation. I think that mindset causes more trouble than many people realize.

## Stop Treating Routers Like Background Hardware

Finally, stop thinking of the router as “just networking gear.”

That mindset is old, and I think it is one of the reasons campaigns like this work as well as they do. Your router is not just there to hand out IP addresses and blink in a closet. It is part of your security boundary. It is part of your identity perimeter. It is part of your trust model.

For MSPs and internal IT teams, I think that means changing how these devices are talked about with clients and leadership. They should not be framed as cheap utility hardware that gets replaced only when it dies. They should be framed the same way we frame other security-sensitive infrastructure: something with lifecycle planning, configuration standards, review intervals, and clear ownership.

On April 7, 2026, the Department of Justice and FBI announced a court-authorized operation to neutralize the U.S. portion of this malicious router network, including resetting malicious DNS settings on compromised U.S. routers and working with partners to cut off the GRU’s access. That is good news, but it should not make anyone feel finished with the problem. Disruption is not the same thing as fixing the habits that made the campaign possible in the first place.

To me, that is the real takeaway.

APT28 did not need some wildly exotic Hollywood-grade exploit chain to create real risk here. They needed vulnerable routers, weak edge hygiene, and enough organizations willing to ignore infrastructure that “seemed fine.” That should hit home for a lot of businesses, because I can promise there are still plenty of offices and home work setups out there running exactly the kind of hardware this campaign was built to abuse.

And that is why this story matters.

Not because it is dramatic. Not because “Russia” in the headline guarantees clicks. But because it is a very real reminder that security failures do not always begin where people are looking. Sometimes they begin at the edge, on the forgotten device everyone assumed was too boring to matter.