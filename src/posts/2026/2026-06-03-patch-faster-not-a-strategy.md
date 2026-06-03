---
date: 2026-06-03T15:50:13-05:00
title: '"Patch Faster" Is Not a Strategy Anymore'
seoTitle: Patch Faster Is Not Enough for Vulnerability Management
description: "AI-assisted vulnerability discovery and faster exploitation are shrinking the defender window. Patching still matters, but teams need exposure validation, prioritization, mitigation, and better change discipline."
searchIntent: Help IT, cybersecurity, and MSP practitioners understand why patching alone is not enough against faster exploitation and how to build a practical vulnerability response workflow.
featuredImage: /assets/images/cybersecurity_risk_maze.png
featuredImageAlt: A person standing in a dark cybersecurity maze facing a glowing red warning sign, with blue security icons in nearby corridors.
featuredImageCaption: "Modern vulnerability response is less about patching everything at once and more about finding the path that reduces real exposure first."
tags: [cybersecurity, vulnerability-management, patch-management, MSP, ai, risk-management]
mastodon_post: true
mastodon_url:
mastodon_tags: [Cybersecurity, InfoSec, VulnerabilityManagement, PatchManagement, MSP]
---

I still believe in patching. Let me get that out of the way first.

Patching is one of the most basic security controls we have, and it is basic for a reason. If a vendor ships a fix for a vulnerability that attackers are using in the wild, applying that fix is usually the cleanest way to close the door. No amount of clever detection engineering, firewall wizardry, or policy language changes that.

But I also think the phrase "patch faster" has become one of those security sayings that sounds useful until you have to operate it in the real world.

If you work in IT, security, or the MSP world, you already know the problem. Patches are not applied in a vacuum. They touch production systems, business applications, remote users, medical devices, manufacturing gear, firewalls, VPN appliances, accounting software, line-of-business apps, and the one server nobody wants to reboot because it has been "special" since 2017.

So when the industry says "just patch faster," my first reaction is usually: faster than what, with what testing, with what rollback plan, and against which actual risk?

That question matters more now because the defender timeline is getting squeezed.

## The patching gap is where exploitation happens

The 2026 security news cycle has been full of the same pattern: more vulnerability discovery, faster exploitation, and less patience from attackers. [Verizon's 2026 DBIR coverage](https://www.verizon.com/about/news/breach-industry-wide-dbir-finds) says vulnerability exploitation has overtaken stolen credentials as the top breach entry point for the first time in the report's 19-year history, with software flaws involved in 31% of breaches. That is a big shift.

At the same time, AI is changing the scale of vulnerability research. Cisco said it used AI-assisted methods to scan [1.8 billion lines of code in eight weeks](https://blogs.cisco.com/news/8-years-of-security-research-in-8-weeks-transforming-cybersecurity-with-ai), work it said would have taken its security research team eight years by its previous process. Cisco also announced a [scheduled twice-monthly security disclosure model](https://blogs.cisco.com/security/strengthening-the-foundation-a-predictable-customer-focused-response-to-ai-accelerated-vulnerability-discovery) because frontier AI models and agentic analysis are surfacing bugs at a rate the old ad-hoc disclosure model was not designed to absorb.

That does not mean AI is magically hacking everything by itself. I do not find that framing useful. The practical point is simpler: the cost of finding, validating, and operationalizing vulnerabilities is dropping. Defenders get some benefit from that, but attackers get the same speed advantage.

That is why [The Hacker News piece that kicked this idea loose for me](https://thehackernews.com/2026/06/ai-driven-exploitation-is-destroying.html) landed so well. The article makes the case that defenders are still operating on patching timelines measured in weeks while attackers are increasingly operating on exploitation timelines measured in hours. It also points to the 2026 DBIR's finding that median remediation time for critical vulnerabilities increased from 32 days to 43 days.

That is the gap.

Not the CVSS score. Not the advisory headline. Not the social media panic.

> The real risk lives in the space between "we now know about this vulnerability" and "our exposed systems are no longer exploitable."

## Patching is necessary, but it is not the whole workflow

I think this is where vulnerability management conversations get sloppy.

There are two bad answers:

- "Patch everything immediately."
- "We cannot patch quickly, so we will wait for the normal cycle."

The first answer ignores operational reality. The second ignores attacker reality.

Most teams need something in between. They need a vulnerability response workflow that can answer a few questions very quickly:

- Do we actually use the affected product or component?
- Is it exposed to the internet or reachable from a lower-trust network?
- Is there evidence of active exploitation?
- Does CISA KEV list it?
- Is there a reliable exploit or public proof of concept?
- Can we patch now without breaking something important?
- If we cannot patch now, what control buys us time?

> That is not "patch slower." That is "make better decisions faster."

The difference matters.

## CVSS alone is not enough

CVSS is useful. It gives us a common language for severity. I do not want to throw it away.

But if your vulnerability management program is mostly "sort by CVSS and start at the top," you are going to waste time. Attackers do not only exploit the highest-scoring bugs. They exploit what is reachable, reliable, valuable, and easy enough to turn into access.

FIRST's [EPSS user guide](https://www.first.org/epss/user-guide.html) says this pretty plainly: CVSS captures properties of a vulnerability, but it should be combined with threat data like EPSS to better prioritize remediation. EPSS estimates the probability that a CVE will be exploited in the wild, while also warning that EPSS is not a complete risk score by itself.

That is the right mindset.

A good prioritization model needs multiple inputs:

- **Exploit status:** Is this being exploited in the wild?
- **Exposure:** Can attackers reach the vulnerable system?
- **Business impact:** What happens if this system goes down or gets compromised?
- **Privilege and blast radius:** Does this lead to admin access, code execution, data theft, or lateral movement?
- **Prevalence:** How many of these do we run?
- **Compensating controls:** Is there segmentation, WAF coverage, EDR visibility, conditional access, or other friction?
- **Operational risk:** What is the risk of applying the patch right now?

That last one is not an excuse. It is part of honest risk management.

If a patch can break a hospital system, manufacturing process, payment flow, or a client's only working line-of-business app, "apply it now and hope" is not mature security. It is gambling with different branding.

## CISA KEV should be treated like a fire alarm

One of the cleanest signals defenders have is the [CISA Known Exploited Vulnerabilities catalog](https://www.cisa.gov/known-exploited-vulnerabilities). CISA maintains it as an authoritative source for vulnerabilities that have been exploited in the wild, and it strongly recommends that all organizations prioritize remediation of listed vulnerabilities.

I like KEV because it cuts through a lot of noise.

There are thousands of new CVEs. There are fewer CVEs with reliable evidence of active exploitation. When something lands in KEV, the question should not be "is this a theoretical risk?" The question should be "where are we exposed, who owns it, and what are we doing today?"

Federal civilian agencies have mandatory due dates under [BOD 22-01](https://www.cisa.gov/news-events/directives/bod-22-01-reducing-significant-risk-known-exploited-vulnerabilities), but the rest of us should not dismiss it as a government-only thing. The federal deadline is not magic. It is a forcing function. For MSPs and SMBs, KEV is still one of the best public signals that a vulnerability has crossed from "possible" to "someone is using this."

That does not mean every KEV item gets the exact same treatment in every environment. A KEV-listed vulnerability on an internet-facing firewall is not the same operational situation as the same class of issue on an isolated lab system. But KEV should change the tempo. It should move the issue out of ordinary patch management and into active vulnerability response.

## The real strategy is exposure reduction

The phrase I keep coming back to is exposure reduction.

Patching is one way to reduce exposure. Usually the best way. But it is not the only lever, and sometimes it is not the first lever you can safely pull.

If an actively exploited vulnerability hits an internet-facing system and the patch needs testing, you still have options:

- restrict access by source IP or geography
- disable the vulnerable feature
- remove the system from the public internet
- put access behind VPN, ZTNA, or an identity-aware proxy
- add a WAF or reverse proxy rule based on known exploit patterns
- isolate the asset from sensitive internal networks
- increase logging and alerting around likely exploit behavior
- rotate credentials or tokens that may be reachable from the affected system
- temporarily shut down a non-essential service

None of those are permanent replacements for patching. They are ways to buy time without pretending time does not matter.

I made a similar point when writing about the [actively exploited WSUS mess](/blog/wsus-just-became-an-attackers-dream-stop-publishing-your-patch-pipeline-to-the-internet/): if a critical management service is exposed to the internet, the first win may be killing exposure before you even finish the full patch process. Asset management and network design beat hero patching because they change how much a single bug can hurt you.

That is the part I think MSPs especially need to operationalize.

Clients do not only need someone to install updates. They need someone who can say, "This system is exposed, this vulnerability is being exploited, this patch is risky, and here is the temporary control we are applying while we validate the fix."

That is a different level of service.

## A practical vulnerability response model

Here is the workflow I would want in a real MSP or internal IT environment.

### 1. Know what you own before the advisory drops

You cannot respond quickly to a vulnerability if you spend the first 48 hours trying to figure out whether you run the product.

Minimum viable inventory should include:

- internet-facing assets
- firewalls, VPNs, remote access tools, and edge devices
- identity systems
- endpoint management platforms
- backup systems
- externally hosted SaaS and admin portals
- core business applications
- unsupported or hard-to-patch systems

This does not have to be perfect on day one, but it has to exist. Vulnerability response starts with knowing what is in scope.

### 2. Separate emergency response from routine patching

Routine patching and emergency vulnerability response are related, but they are not the same process.

Routine patching can follow a normal cadence: test, schedule, deploy, verify, document.

Emergency response needs a faster lane:

- confirm product exposure
- identify affected versions
- check KEV, vendor advisories, EPSS, and threat intel
- assign an owner
- choose patch, mitigation, isolation, or shutdown
- define the verification step
- document the decision

This should not require a brand-new meeting every time. Build the lane before you need it.

### 3. Rank by exploitability and exposure, not just severity

If everything is urgent, nothing is.

A better first-pass triage looks like this:

<table>
  <thead>
    <tr>
      <th>Signal</th>
      <th>Why It Matters</th>
      <th>Default Response</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Signal">KEV listed + internet-facing</td>
      <td data-label="Why It Matters">Active exploitation signal plus attacker reachability.</td>
      <td data-label="Default Response">Emergency patch or immediate mitigation.</td>
    </tr>
    <tr>
      <td data-label="Signal">Public exploit + critical business system</td>
      <td data-label="Why It Matters">Repeatable exploit path against an asset that matters.</td>
      <td data-label="Default Response">Expedited patch, exposure validation, and detection.</td>
    </tr>
    <tr>
      <td data-label="Signal">High EPSS + exposed component</td>
      <td data-label="Why It Matters">Higher likelihood of exploitation with reachable attack surface.</td>
      <td data-label="Default Response">Prioritize above ordinary high/critical backlog.</td>
    </tr>
    <tr>
      <td data-label="Signal">Critical CVSS + internal only</td>
      <td data-label="Why It Matters">Potentially severe, but may require internal access first.</td>
      <td data-label="Default Response">Patch on accelerated schedule based on business impact.</td>
    </tr>
    <tr>
      <td data-label="Signal">No exploit signal + low exposure</td>
      <td data-label="Why It Matters">Still real, but probably not the first fire.</td>
      <td data-label="Default Response">Handle through normal vulnerability management.</td>
    </tr>
  </tbody>
</table>

That table will not solve every edge case, but it gives teams a starting point that is better than panic sorting by score.

### 4. Mitigate when patching has to wait

This is where a lot of organizations get stuck. They treat "we cannot patch today" as the end of the conversation.

It should be the beginning of the mitigation conversation.

If the business cannot accept the patch yet, the business should have to accept another control. That might be segmentation, access restriction, feature disablement, additional monitoring, or a temporary outage window for a non-critical service.

What should not be acceptable is doing nothing because the perfect fix is inconvenient.

This is also where governance matters. In my [GRC in the real world](/blog/grc-in-the-real-world-making-hipaa-pci-nist-csf-ftc-safeguards-and-nis2-work-together/) piece, I wrote about using risk-based programs instead of disconnected compliance checklists. Vulnerability response is exactly where that shows up. Someone has to own the decision, understand the risk, and document why a patch was delayed and what control was used instead.

### 5. Verify the outcome

"Patch deployed" is not the same thing as "risk reduced."

After the patch or mitigation, verify:

- the asset is on the expected version
- the vulnerable service is no longer exposed
- exploit attempts are blocked or alerted
- no known indicators of compromise are present
- the ticket includes evidence, not just a checkbox
- any temporary mitigation has an expiration date or review date

This matters because a surprising amount of patch work fails quietly. A server misses the reboot. A cluster node stays old. A firewall rule applies to one interface but not another. A SaaS connector remains authorized. An appliance says it updated, but the vulnerable service is still listening.

Trust, but verify. Then screenshot, export, or log the proof somewhere future-you can find it.

## What MSPs should be selling here

For MSPs, this is bigger than a patch management line item.

> The valuable service is not "we install updates." The valuable service is "we reduce client exposure when the threat landscape moves faster than their business can."

That means MSPs should be able to explain:

- which client systems are internet-facing
- which clients are affected by a major advisory
- which vulnerabilities are actively exploited
- which systems are patched, mitigated, or still exposed
- what compensating controls are in place
- what business approval is needed for high-risk change windows
- what evidence proves the work was done

That is the difference between reactive IT and security operations.

It is also a better conversation with business owners. Most SMB leaders do not want a lecture about CVSS math. They want to know: Are we exposed? How bad is it? Can we fix it without breaking payroll, billing, phones, or production? What happens if we wait?

That is where practitioners earn trust.

## What I would do this week

If you are looking at your own environment or client base, here is where I would start.

1. **Build an internet-facing asset list.** Start with firewalls, VPNs, remote access, web apps, mail, identity, file transfer, RMM, backup portals, and anything with admin access.

2. **Map those assets to owners.** If nobody owns it, nobody patches it under pressure.

3. **Monitor CISA KEV.** Treat KEV additions as vulnerability response triggers, not just interesting news.

4. **Add EPSS to triage.** Do not use it as the only answer, but use it to separate likely exploitation from generic severity.

5. **Define emergency change rules.** Decide ahead of time who can approve emergency patches, mitigations, isolation, and temporary outages.

6. **Create mitigation playbooks.** Have patterns ready for WAF rules, access restrictions, feature disablement, segmentation, and increased monitoring.

7. **Verify and document.** Version checks, exposure checks, screenshots, EDR hunts, and ticket notes should prove the risk was reduced.

8. **Review the exceptions.** Every delayed patch should have an owner, reason, compensating control, and review date.

This does not require a Fortune 500 budget. It requires discipline.

## Closing thoughts

Patching is still essential. I am not arguing otherwise.

But "patch faster" by itself is not a strategy anymore. It is a slogan.

The better strategy is to reduce exploitable exposure faster than attackers can turn a disclosure into access. Sometimes that means patching immediately. Sometimes it means taking a system off the internet, disabling a vulnerable feature, adding a temporary control, isolating an asset, or escalating a business decision that has been avoided for too long.

AI-assisted vulnerability discovery is going to keep increasing the volume and speed of this work. Attackers are going to keep looking for the systems that are reachable, valuable, and slow to change. The teams that handle this well will not be the teams that pretend every patch can be applied instantly. They will be the teams that know what they own, know what is exposed, know what is being exploited, and have a practiced way to reduce risk while the rest of the business keeps running.

That is the real goal.

Patch, yes.

But more importantly: know where you are exposed, decide faster, mitigate when needed, and prove the risk actually went down.
