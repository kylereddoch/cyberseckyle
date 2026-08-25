---
date: 2026-08-25T17:00:26-05:00
title: "The Patch Window Has Collapsed. Defenders Need to Change Now"
seoTitle: Why the Patch Window Is Collapsing and What Defenders Must Do
description: Attackers are exploiting vulnerabilities faster than most organizations can safely patch. Defenders need an emergency response model that contains exposure, hunts for compromise, deploys fixes, and proves the risk is gone.
searchIntent: Help IT, cybersecurity, and MSP teams replace slow patch-only workflows with a practical vulnerability response model for rapidly exploited flaws.
featuredImage: /assets/images/patch-window-collapsing.png
featuredImageAlt: A defender monitors a network as a huge closing clock surrounds servers, cloud systems, endpoints, and blue containment barriers stopping a red attack path.
featuredImageCaption: "The shrinking window is not only time to patch. It is time to scope, contain, hunt, remediate, and verify. (Image generated using ChatGPT.)"
tags: [cybersecurity, vulnerability-management, patch-management, incident-response, MSP, risk-management]
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/117158460669386160"
mastodon_tags: [Cybersecurity, InfoSec, VulnerabilityManagement, PatchManagement, IncidentResponse, MSP]
x_post: true
x_url: "https://twitter.com/thecyberseckyle/status/2092375799114424605"
publishedAt: "2026-08-25T22:17:18.243Z"
x_buffer_post_id: "6a8e146fce947d0974a13812"
---

On July 31, N-able detected a threat actor exploiting a previously unknown vulnerability in N-central. By August 1, the company had published guidance. Hotfix 1 arrived on August 2. Continued monitoring found a related attack path, so Hotfix 2 followed on August 6. That is already a difficult timeline for any IT or security team, and then comes the part that matters even more.

The attackers were not only getting into the N-central server. According to [N-able's incident update](https://www.n-able.com/blog/n-central-security-update-august-10-2026), they used the RMM platform's remote-access capability to reach managed devices and registered Cloudflare tunnel services for persistence. N-able warned customers that applying Hotfix 2 closed the entry point but did not remove an attacker who may already be inside.

That incident is the collapsing patch window in its most honest form. The vulnerability was unknown. Exploitation was already happening. The first fix was not the last fix, and the compromised product was itself a management plane with authority over downstream systems. By the time a defender could say “patched,” the real work might have spread into account review, endpoint hunting, persistence removal, client communication, and incident response. This is why I do not think the problem can be reduced to patch speed.

Back in June, I wrote that [“patch faster” is not a strategy anymore](/blog/patch-faster-is-not-a-strategy-anymore/). Patching is still one of the cleanest ways to close a known vulnerability, but it is only one part of reducing risk. The events since then have made that point harder to ignore.

Microsoft published [its own argument that the patch window is collapsing](https://azure.microsoft.com/en-us/blog/the-patch-window-is-collapsing-why-security-needs-a-new-control-plane/) today. The central point is right: when a workload cannot be patched immediately, another layer has to reduce exposure and buy the team time. Microsoft sees the network becoming that control plane.

I agree that the network is one of the fastest places to act, but I do not think it can carry the whole job by itself. What defenders need now is not one magical control plane. We need a practiced response system that can find exposure, change reachability, contain blast radius, hunt backward, deploy safely, and prove the vulnerable path is actually gone. That system needs to exist before the next emergency advisory lands.

## The numbers are telling us the old cadence has failed

For years, many organizations treated vulnerability management as a monthly maintenance process: scan the environment, sort the findings, send tickets, test patches, wait for a change window, deploy, and report the closure rate. That process was never perfect, but it was easier to defend when exploitation was the exception and the organization could reasonably expect a little time. The current data makes that assumption difficult to keep.

[Verizon's 2026 Data Breach Investigations Report](https://www.verizon.com/business/resources/T1e0/reports/2026-dbir-data-breach-investigations-report.pdf) says exploitation of vulnerabilities became the most common initial access vector in its reporting dataset at 31%, passing credential abuse for the first time. The same report says organizations fully remediated only 26% of critical vulnerabilities in the CISA Known Exploited Vulnerabilities catalog during 2025. Median time to full resolution rose to 43 days. Forty-three days may fit a policy. It does not fit an exploited edge device, remote-management platform, identity service, email server, or internet-facing application.

Mandiant's [time-to-exploit analysis](https://cloud.google.com/blog/topics/threat-intelligence/time-to-exploit-trends-2023) showed how far the attack side of this race had already moved. Its observed average dropped from 63 days in 2018 and 2019 to five days in 2023. Twelve percent of the n-day vulnerabilities in that dataset were exploited within one day, and 29% were exploited within a week.

That does not mean every new CVE becomes a working attack in five days, and it does not mean every loud vulnerability headline deserves an emergency change. Mandiant found that public exploit code and media attention were not reliable predictors on their own. Reachability, exploit reliability, attacker value, privilege, and affected product matter. The answer is not to panic faster; it is to stop pretending a fixed 30-day or 45-day clock reflects how attackers choose targets.

Google Threat Intelligence Group's [review of 2025 zero-days](https://cloud.google.com/blog/topics/threat-intelligence/2025-zero-day-review) adds another uncomfortable detail. Google tracked 90 vulnerabilities exploited as zero-days during the year. Forty-three affected enterprise technology, including 14 targeting edge devices. Google also noted that the edge count likely understates the problem because routers, switches, VPNs, and security appliances often lack the endpoint visibility defenders rely on elsewhere.

The individual advisories keep matching the data. In [last week's Security Signal](/blog/security-signal-weekly-august-15-21-2026/), I covered active exploitation affecting Windows IKE, MLflow, and Zimbra. One was a network-reachable Windows service, one could expose cloud credentials and internal services through an AI engineering platform, and one put an internet-facing email server at risk. Different products, same defender problem: patch quickly, but also check exposure and look for the attacker who may have arrived first.

That is the environment we are operating in: more vulnerable technology, more privileged edge and management systems under attack, less time to understand what happened, and weaker visibility on some of the assets that matter most. The monthly patch cycle can stay. It just cannot be the only lane.

## A collapsing patch window changes the definition of “done”

One of the most common mistakes I see in patch conversations is treating deployment as the finish line. A console says the update was approved. A job says it completed. A ticket is closed. Everyone moves on, even though none of those facts prove the risk is gone.

The system may still need a reboot. One cluster node may have missed the update. The vulnerable feature may still be enabled. An old appliance may have accepted the package but failed to boot into the new version. A WAF rule may protect one hostname while another route reaches the same application. An attacker may have arrived yesterday and created a second way back in.

N-central is a clean example because the vendor said this directly: the hotfix closed the vulnerability, but defenders still had to review accounts, privileges, logins, remote-control activity, password resets, newly created users, and persistence on managed endpoints. A clean indicator scan was not a guarantee that the environment was unaffected, so “done” has to mean more than installed.

For a rapidly exploited vulnerability, I want five questions answered:

1. Did we identify every affected asset that matters?
2. Did we reduce attacker reachability while permanent remediation was underway?
3. Did the fixed version or mitigation actually take effect everywhere?
4. Did we look for evidence that exploitation happened before the fix?
5. Did we remove persistence, rotate exposed credentials, and close any secondary access created by the attacker?

If the team can only answer the third question, it completed a patch task. It did not complete vulnerability response.

## The network can buy time, but it is not the whole control plane

Microsoft's network-control argument makes practical sense. A firewall, WAF, reverse proxy, load balancer, gateway, security group, or segmentation policy can often change faster than a fragile production application. Those controls can remove public exposure, restrict source networks, block an exploit pattern, rate-limit abusive behavior, or isolate a vulnerable workload from the systems behind it. That is valuable time. I would much rather restrict a vulnerable admin interface now and patch it safely tonight than leave it exposed all day because the approved maintenance window has not started. I made a similar case in [The Network Edge Cleanup Most Teams Cannot Keep Putting Off](/blog/the-network-edge-cleanup-most-teams-cannot-keep-putting-off/): lifecycle, reachability, and management access are security controls, not housekeeping details.

The limit is that not every important path crosses one network enforcement point. A local privilege-escalation bug may begin on an endpoint that is already inside. A compromised SaaS identity may use a vendor API over ordinary encrypted traffic. An attacker may abuse the legitimate remote-control functions of an RMM. A poisoned software dependency may execute on a build runner. A browser or mobile exploit may never touch the gateway where the organization hoped to enforce policy.

The network control plane can also be the target. I wrote about that in [The Cisco SD-WAN Story Is Bigger Than Cisco](/blog/the-cisco-sd-wan-story-is-bigger-than-cisco/). When attackers reach centralized network management, they are not breaking into one appliance. They are reaching for the system that defines trust and distributes policy to many others. That is why my version of the control plane is operational rather than product-specific.

It includes:

- an asset and exposure record the team trusts
- network controls that can quickly change reachability
- identity controls that can revoke sessions and restrict privileged access
- endpoint controls that can isolate devices and hunt across them
- cloud and SaaS controls that can disable risky integrations or credentials
- a change process with an emergency lane and a rollback path
- logs that are useful before, during, and after the patch
- named people who can make a risk decision without waiting for a committee to form

No single dashboard owns all of that. The organization does.

## The first clock should measure containment, not patch completion

Patch deadlines still matter, but the first question during active exploitation should be: **How quickly can we make this harder to reach and harder to turn into a larger compromise?** Sometimes the patch is the fastest answer, so apply it. Sometimes testing, uptime, vendor support, or a complex dependency means the permanent change needs hours or days. The response cannot sit still while that work happens.

Useful temporary actions may include:

- removing an administration interface from the public internet
- limiting access to known source addresses or a managed access path
- disabling the vulnerable service or feature
- putting an application behind a gateway or WAF rule
- blocking a protocol at the perimeter
- isolating the system from sensitive internal networks
- revoking exposed tokens, sessions, certificates, or service credentials
- disabling a connector or integration that expands the blast radius
- taking a nonessential service offline
- increasing logging and detection around the exploit and likely follow-on actions

These are not permanent substitutes for remediation. They are how a team stops treating the time before remediation as empty space. The temporary control also needs an owner and an expiration point. Emergency firewall rules have a bad habit of becoming permanent architecture. Disabled features quietly get re-enabled. Extra logging fills storage until someone turns it off. If nobody is responsible for removing or reviewing the mitigation, the response creates a different kind of technical debt.

## Asset inventory is now part of incident response

The fastest vulnerability response plan falls apart if the first several hours are spent asking whether the organization owns the affected product. This is not a call for a perfect CMDB; I have not met many of those in the wild. It is a call for a dependable list of the things an attacker can reach and the things that can reach everything else.

At minimum, I would keep current records for:

- internet-facing applications and services
- firewalls, VPNs, gateways, load balancers, and remote-access systems
- RMM, endpoint management, backup, identity, and security platforms
- email, file-transfer, and collaboration servers
- cloud subscriptions, public storage, exposed APIs, and SaaS administration
- high-value business applications and the dependencies that make them difficult to patch
- unsupported systems and products approaching end of support
- an owner and escalation contact for each of the above

The important detail is not simply knowing that a product exists. The team needs version, exposure, business role, management path, support status, and enough dependency context to choose a safe action.

For MSPs, this has to work at client level. “We have 240 affected devices somewhere” is not an operational answer. The team needs to know which tenants are exposed, which clients have the vulnerable feature enabled, which contracts allow emergency action, which systems require approval, and which customers need an incident call instead of a patch notification.

That is part of the reason I treat [vulnerability management in an MSP environment](/blog/managing-vulnerabilities-in-an-msp-environment/) as a service-delivery problem as much as a scanner problem. The hard part is not producing findings. It is turning the right finding into a safe, verified action across many different businesses.

## Separate routine patching from emergency vulnerability response

Most patches should not trigger an incident bridge. Routine maintenance keeps the estate healthy and prevents ordinary backlog from turning into the next emergency. The mistake is forcing an actively exploited, high-impact vulnerability through the same queue.

Build a separate trigger for emergency vulnerability response. I would expect the trigger to consider:

- confirmed exploitation, including CISA KEV status
- internet or lower-trust exposure
- unauthenticated or low-complexity attack paths
- remote code execution, authentication bypass, privilege escalation, or credential access
- control-plane authority and downstream reach
- public exploit reliability and evidence of mass scanning
- business criticality and available compensating controls

[CISA's Known Exploited Vulnerabilities catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) remains one of the cleanest public signals because inclusion means the vulnerability has crossed from possible exploitation to evidence of exploitation. It should change the tempo, especially when the affected system is exposed or privileged. KEV should not be the only trigger, though. A vendor or trusted research team may confirm exploitation before a catalog update, and a threat may be specific to your sector or product configuration. The team needs permission to act on credible evidence without waiting for every feed to agree.

## What the emergency lane should look like

I do not believe every organization needs the same minute-by-minute SLA. A hospital, factory, SaaS company, MSP, and five-person business will not patch the same way, but they should all know what happens next.

### Confirm the facts and name an owner

Verify the advisory through the vendor, CISA, a trusted government partner, or a source close to the investigation. Capture affected versions, exploit conditions, fixed versions, workarounds, indicators, and known operational problems. Then name one response owner. Several teams may do the work, but someone has to keep the scope, decisions, blockers, and next checkpoint from becoming a group-chat fog.

### Find exposure, not just installations

Search the asset inventory, vulnerability platform, RMM, EDR, cloud environment, firewall records, software inventory, and configuration data. Confirm which systems are actually reachable under the conditions the exploit requires. This is where configuration beats raw CVE count. A product may be installed everywhere while the vulnerable feature is enabled on only a few systems. Another product may exist on one forgotten public server that has no endpoint agent and no obvious owner. Those are different response problems.

### Contain what can be contained immediately

Do not wait for the permanent fix to finish before reducing obvious exposure. Restrict the interface. Disable the feature. Isolate the asset. Revoke the integration. Add the temporary block. Shut down the nonessential service. Document what changed and how to reverse it, because fast changes still need rollback discipline.

### Patch in rings, with an emergency path around the rings when needed

Start with a representative test group where possible. Check application health, service state, authentication, connectivity, logging, and business functions. Expand quickly when the result is clean. For an actively exploited internet-facing control plane, however, the normal pilot schedule may be too slow. The organization should decide ahead of time who can approve a compressed test, immediate mitigation, or emergency outage. Trying to invent that authority during the incident burns the exact resource the team no longer has: time.

### Hunt backward from the earliest possible exposure

If exploitation began before disclosure or before the patch became available, the advisory date is not the beginning of the risk window. Review the vendor's timeline, your external exposure history, logs, account changes, remote sessions, process creation, new services, scheduled tasks, persistence, outbound connections, and access to adjacent systems. Look for behaviors as well as published indicators. IP addresses and filenames change. The attacker's need to authenticate, execute, persist, discover, and move is more durable. A useful SIEM can speed this up, but only if the relevant data was already arriving and somebody knows how to query it. That is why [making SIEM useful](/blog/making-siem-useful-how-it-works-what-it-does-and-why-you-should-care/) matters long before the emergency.

### Verify the control, the version, and the absence of easy persistence

Read back the running version from the asset. Confirm the service restarted into the fixed build. Test that the vulnerable route is blocked or no longer behaves as expected. Check every node in a cluster. Confirm the temporary control applies to every hostname, interface, tenant, and region it was meant to cover. Then review the likely persistence and credential paths. If the system could reach secrets, assume the secrets were reachable until evidence says otherwise. Rotation can be disruptive, but leaving a known-reachable credential in place is not a harmless choice.

### Keep exceptions visible and expensive

Some systems will not patch on the first attempt. Some vendors will not have a complete fix. Some business owners will delay the change. An exception should name the affected asset, exposure, business reason, temporary controls, owner, approval, next review time, and condition that ends the exception. It should not disappear into a spreadsheet tab that nobody opens until the audit. If the business chooses to keep a vulnerable service running, that is a risk decision, and it should be visible enough that it cannot masquerade as a technical oversight.

## Measure the response you actually need

Patch compliance is useful, but it is too blunt for this problem. I would add a small set of measures that show whether the emergency lane works:

- **Time to scope:** How long did it take to identify affected and exposed assets?
- **Time to contain:** How long did it take to reduce reachability or blast radius?
- **Time to verified remediation:** When did the team prove the fix was active everywhere in scope?
- **Unknown exposure:** How many assets could not be quickly confirmed as affected or unaffected?
- **Hunt coverage:** Which exposed systems had enough telemetry to assess prior exploitation?
- **Exception age:** How long have emergency exceptions remained open, and are their temporary controls still in place?
- **Failed deployment rate:** How many assets reported success but did not reach the expected running state?

These measures tell a much more useful story than “97% of patches deployed.” They expose inventory gaps, slow decisions, fragile deployment, missing logs, and controls that exist only on paper.

## What I would implement now

If this still sounds like a project for next quarter, start smaller. The first version does not need a new platform, and the work does not have to be glamorous to be useful. This month, I would do six things.

1. **Build one trusted list of internet-facing and control-plane assets.** Include owners, versions, management paths, and support status.

2. **Define the emergency trigger.** Write down what moves a vulnerability out of routine patching and who can declare that change.

3. **Preapprove five containment moves.** For example: remove public access, restrict source networks, isolate an endpoint, disable a feature, and revoke a high-risk integration or credential.

4. **Create a short evidence checklist.** Running version, restart state, exposure test, cluster coverage, account review, persistence review, credential decision, and ticket evidence.

5. **Test the process against one recent advisory.** Use a real product in the environment. Measure how long it takes to answer “Do we have it, is it exposed, who owns it, and what can we change right now?”

6. **Fix the first ugly gap you find.** It may be a missing owner, an undocumented public service, a firewall nobody can change quickly, an appliance without logs, or a business application with no rollback plan. That gap is the work.

## Why this cannot wait

The patch window is not going to reopen because defenders write a better policy. Vulnerability discovery is getting faster. Exploit development is getting cheaper. Attackers are concentrating on systems with broad reach: edge devices, identity, remote management, virtualization, email, cloud control planes, and security products. Those systems are difficult to take down, difficult to monitor, or trusted to control many other systems. That is exactly why they are valuable.

At the same time, defenders still have to protect uptime. We still have to test. We still have to avoid turning an emergency security update into a business outage. We still have to coordinate across vendors, application owners, clients, compliance requirements, and exhausted people. Those operational safeguards are not the enemy; the lack of protection around them is. The answer is not reckless patching. It is building enough control around the vulnerable system that safe patching has time to happen.

That means knowing what is exposed before the news breaks. It means being able to narrow access without a three-day approval chain. It means treating a patch as the start of verification, not the end of the ticket. It means looking for the attacker who may have arrived first. It means giving someone clear authority to make the call. Patching still closes the hole, but the response system keeps that hole from becoming the whole incident while the fix is on its way. We need that system now.
