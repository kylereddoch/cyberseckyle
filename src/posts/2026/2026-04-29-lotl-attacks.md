---
date: 2026-04-29T10:00:00-05:00
title: Living Off the Land Attacks Are a Reminder That Trust Is an Attack Surface
description: Living off the land attacks abuse the same tools administrators depend on every day, making identity, logging, privilege control, and application control critical parts of modern defense.
featuredImage: /assets/images/living_off_the_land_attacks.png
featuredImageAlt: A young plant growing in a field with glowing digital roots spreading beneath the soil, symbolizing hidden cyber threats using trusted system tools.
featuredImageCaption: A visual metaphor for living off the land attacks, where adversaries operate beneath the surface by abusing trusted tools already present in the environment.
tags: [cybersecurity, security, incident-response, MSP]
mastodon_url: https://infosec.exchange/@cyberseckyle/116488653743109824
---

The part that makes living off the land attacks so dangerous is not that they are magic. *It is that they are ordinary.*

> That is the uncomfortable truth. A lot of attacks do not start with some flashy custom malware that screams for attention. They start with a phished credential, an exposed remote access path, an unpatched edge device, or a user clicking through something that looked close enough to normal.

Once the attacker gets inside, they do not always need to bring a big toolbox with them. They can use the tools we already gave them.

**PowerShell. WMI. Certutil. Bitsadmin. Mshta. Rundll32. Scheduled tasks. Registry run keys. Remote management tools. Browser sessions. Admin consoles. Identity tokens.**

Those are not inherently evil tools. That is the problem.

They are trusted because administrators, support teams, automation platforms, and Windows itself rely on them. *Living off the land attacks abuse that trust.* Instead of forcing their way through the front door with obvious malware, attackers put on the uniform of normal system activity and walk around like they belong there.

For MSPs, small businesses, and internal IT teams, this should be a major wake-up call. If your security strategy still leans too heavily on “did antivirus find malware?” then you are already behind. Modern attackers are not always trying to beat your tools with a suspicious file. Sometimes they are trying to avoid creating one in the first place.

## What living off the land actually means

Living off the land, often shortened to LOTL, is when an attacker uses legitimate tools, scripts, binaries, and system functions already present in the environment to carry out malicious activity.

The [LOLBAS project](https://lolbas-project.github.io/) keeps a catalog of Windows binaries, scripts, and libraries that can be abused for these kinds of techniques. That list includes tools that can be used for downloading files, executing code, bypassing application controls, copying data, dumping credentials, modifying registry behavior, and blending into normal administrative workflows.

This is why LOTL is often tied to the phrase “fileless malware,” although I think that phrase can be a little misleading. Not every LOTL attack is truly fileless from start to finish. Some attacks touch disk. Some use scripts. Some use native binaries to stage or execute another payload. The better way to think about it is this: the attacker is reducing the number of obvious artifacts they introduce into the environment.

> **No malware required. No obvious payload. Just abuse of what already exists.**

Microsoft’s guidance on [fileless threats](https://learn.microsoft.com/en-us/defender-endpoint/malware/fileless-threats) makes a useful distinction here. Some threats leave little or no file activity, while others abuse scripts, exploits, legitimate applications, or memory-resident behavior as part of a larger attack chain. That matters because defenders cannot treat “no malicious file found” as proof that nothing happened.

**No malware found does not mean no compromise.**

## Why attackers love this approach

Living off the land works because it attacks one of the hardest things in cybersecurity: **context**.

A tool like PowerShell can be completely normal. It can also be the thing an attacker uses to discover systems, execute commands, pull down additional tooling, or run encoded instructions. WMI can be used for legitimate management. It can also be used for remote execution and lateral movement. Certutil can be used for certificate-related tasks. It can also be abused to download or decode content.

> **The tool is not the signal. The context is.**

That is why LOTL attacks are hard for traditional defenses to handle. Signature-based antivirus is strongest when there is a known bad file, known bad hash, or known bad behavior pattern. LOTL activity lives in the gray area. The binary may be Microsoft-signed. The process may be allowed. The command may look administrative. The account may be valid.

The attacker is not just bypassing technology. **They are abusing trust.** They are using the fact that these tools are necessary for normal operations to hide in plain sight. That is why defenders need to focus on context, behavior, and risk-based controls instead of just looking for “bad files.”

This also lines up with the larger trend in modern intrusions. CrowdStrike’s [2026 Global Threat Report](https://www.crowdstrike.com/en-us/global-threat-report/) says 82% of detections in 2025 were malware-free, and the average eCrime breakout time dropped to 29 minutes. That is not a lot of time for a help desk ticket, an alert review, a manager approval, and a manual response process.

Attackers have compressed the timeline. Defenders need to stop pretending next-day review is enough.

## The typical LOTL attack path

A living off the land attack can begin in a lot of ways, but the pattern usually looks familiar.

First, the attacker gets a foothold. That may happen through phishing, stolen credentials, password spraying, exposed remote access, an unpatched VPN or firewall, a vulnerable web app, or a compromised third-party tool.

Then they start blending in. Instead of dropping obvious malware immediately, they use trusted utilities to learn the environment. They may enumerate users, groups, running processes, mapped drives, domain relationships, endpoint tools, and remote access paths.

After that, they move toward privilege. This is where credential theft, token abuse, LSASS access, Kerberos abuse, local admin rights, and over-permissive service accounts become extremely dangerous. If the attacker can turn one compromised account into several, they can move from “one bad login” to “domain-wide problem” quickly.

Finally, they establish persistence and move laterally. Registry run keys, scheduled tasks, services, remote management tools, and legitimate admin utilities can all become part of the attack path.

The CyberFOX eBook makes a strong point here by comparing these attacks to termites eating from the inside out. That analogy works because the visible damage often shows up late.

> By the time someone notices the obvious impact, the attacker may already have harvested credentials, staged data, created persistence, or moved to other systems.

## Common tools and techniques defenders should understand

This is not a complete list, but these are the types of LOTL activity I would want any IT or security team to understand.

### PowerShell and command interpreters

PowerShell is one of the most powerful administrative tools in Windows. That is why attackers love it. MITRE ATT&CK notes that adversaries may abuse [PowerShell](https://attack.mitre.org/techniques/T1059/001/) for discovery, execution, and other actions. The broader [Command and Scripting Interpreter](https://attack.mitre.org/techniques/T1059/) category includes behavior like PowerShell, cmd.exe, and wscript.exe running from abnormal contexts, unusual parent processes, suspicious arguments, or unexpected user sessions.

I do not think the answer is “ban PowerShell everywhere.” That sounds good in a policy meeting and falls apart in real operations. The better approach is to control who can use it, log it properly, monitor suspicious patterns, restrict dangerous behaviors, and make sure standard users do not have more scripting freedom than they need.

### LOLBins

LOLBins are legitimate binaries that can be abused by attackers. The obvious examples include utilities like:

- bitsadmin
- certutil
- mshta
- rundll32
- regsvr32
- installutil
- msiexec
- and wscript

The important part is not memorizing every binary. The important part is asking better questions like:

- Why is this user running this tool?
- Why is this tool making a network connection?
- Why is this binary launching from this parent process?
- Why is an Office document spawning script execution?
- Why is a standard workstation using a tool normally reserved for admin activity?

Those questions are where detection starts getting useful.

### Registry run keys and scheduled tasks

Registry run keys and scheduled tasks are common persistence paths. They are not automatically malicious, but they are worth monitoring because attackers use them to make code run again after reboot or user login.

This is one of those areas where baseline behavior matters. If you do not know what normal startup entries look like across your fleet, it is much harder to spot the weird ones.

### Credential dumping and LSASS abuse

Credential theft is where a small incident turns into a much larger one.

The CyberFOX PDF calls out credential dumping, pass-the-hash, pass-the-ticket, overpass-the-hash, and golden ticket attacks as common accomplices to LOTL activity. That matters because once an attacker gets credential material, the environment changes. You are no longer just cleaning up one endpoint. You may be dealing with identity compromise across the domain.

Microsoft recently reported that Storm-1175, a threat actor tied to Medusa ransomware operations, used living-off-the-land techniques such as modifying WDigest-related registry behavior and using Task Manager to dump LSASS credentials. That kind of example is a reminder that LOTL is not theoretical. It shows up in real ransomware operations.

> **Once credentials are compromised, the blast radius expands quickly.**

### Mimikatz and similar tooling

Mimikatz started as a security research tool, but attackers have used it for years to extract credentials, abuse Kerberos, and support lateral movement. Even when the original tool is not present, the techniques it popularized are still part of the defender’s reality.

> **Blocking one tool name is not enough. You have to defend the credential paths.**

That means reducing local admin rights, enabling protections like Credential Guard where appropriate, protecting LSASS, rotating local admin passwords with Windows LAPS, limiting credential exposure, and watching for suspicious access to sensitive authentication processes.

## Why “we have EDR” is not a complete answer

EDR matters. I am not downplaying it.

But EDR is not a magic force field. If a valid user runs a trusted binary from a trusted path, the EDR still has to decide whether the behavior is malicious enough to stop. That decision depends on telemetry, behavior, policy, reputation, tuning, and context.

This is where I see a lot of organizations get too comfortable. They install an endpoint tool and mentally check the security box. The problem is that LOTL attacks are designed to live in the space between “obviously bad” and “technically allowed.”

Strong endpoint detection should be paired with:

- identity monitoring
- privileged access management
- least privilege
- application control
- script control
- centralized logging
- alert tuning
- remote access auditing
- vulnerability management
- tested incident response

A tool can help you see the problem. It cannot replace knowing what normal looks like.

This is also why [zero trust cannot stop at login](/blog/secure-browsers-push-zero-trust-past-the-login-screen/). A valid sign-in is not the same thing as a trustworthy session. Once an attacker has credentials, the real test becomes what that identity is allowed to do, what the device is allowed to run, what telemetry is collected, and how fast the organization can respond when behavior stops making sense.

## Blocklisting helps, but it is not a whole strategy

The CyberFOX eBook leans heavily into blocklisting and privileged access management, which makes sense given the product angle. I agree with the core idea: many users do not need access to every native Windows binary, script host, or administrative utility. Blocking or restricting high-risk tools can reduce the attacker’s options.

But I would be careful about **treating blocklisting as the strategy**.

Blocklisting is useful when it is targeted, tested, maintained, and paired with exceptions for real business needs. It becomes painful when it is thrown into production without understanding what breaks. It also becomes weak when teams block a handful of obvious tools and assume the job is done.

The better model is layered control.

Use blocklisting to reduce obvious abuse paths. Use allowlisting or application control where the environment can support it. Use PAM to keep users out of local admin. Use identity controls to limit blast radius. Use logs and detections to catch abnormal behavior. Use response playbooks so alerts do not sit around waiting for someone to “take a look tomorrow.”

## A practical control map for LOTL defense

<div class="table-wrap" role="region" aria-label="Living off the land defense control map" tabindex="0">
<table>
  <thead>
    <tr>
      <th>Control area</th>
      <th>What it helps prevent</th>
      <th>What I would monitor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Control area">Least privilege and PAM</td>
      <td data-label="What it helps prevent">Standard users becoming easy launch points for admin-level abuse</td>
      <td data-label="What I would monitor">Local admin changes, privilege elevation requests, new admin accounts, unusual admin logons</td>
    </tr>
    <tr>
      <td data-label="Control area">Application control</td>
      <td data-label="What it helps prevent">Unapproved binaries, scripts, and suspicious execution paths</td>
      <td data-label="What I would monitor">Blocked execution attempts, new allowlist exceptions, signed binaries behaving abnormally</td>
    </tr>
    <tr>
      <td data-label="Control area">LOLBAS-aware blocklisting</td>
      <td data-label="What it helps prevent">Abuse of rarely needed native Windows utilities</td>
      <td data-label="What I would monitor">Certutil, bitsadmin, mshta, regsvr32, rundll32, installutil, wscript, and similar tools used by non-admin users</td>
    </tr>
    <tr>
      <td data-label="Control area">PowerShell logging and restrictions</td>
      <td data-label="What it helps prevent">Untracked script execution and encoded command abuse</td>
      <td data-label="What I would monitor">Encoded commands, unusual parent processes, script execution from temp paths, PowerShell spawned by Office or browsers</td>
    </tr>
    <tr>
      <td data-label="Control area">Credential protection</td>
      <td data-label="What it helps prevent">Credential dumping and lateral movement</td>
      <td data-label="What I would monitor">LSASS access, Kerberos anomalies, NTLM abuse, suspicious authentication patterns, new service tickets</td>
    </tr>
    <tr>
      <td data-label="Control area">Centralized logging</td>
      <td data-label="What it helps prevent">Blind spots during investigation</td>
      <td data-label="What I would monitor">Process creation, command line arguments, registry changes, scheduled task creation, remote logons, EDR alerts</td>
    </tr>
    <tr>
      <td data-label="Control area">Remote access governance</td>
      <td data-label="What it helps prevent">Attackers hiding inside legitimate support tools</td>
      <td data-label="What I would monitor">New remote access tools, after-hours sessions, unmanaged remote software, logons from unusual geography or devices</td>
    </tr>
  </tbody>
</table>
</div>

## What I would prioritize in a real MSP or small business environment

For a small business or MSP-managed client, I would not start with the most complicated version of this. I would start with the controls that reduce the most risk without wrecking operations.

First, **remove everyday local admin rights**. This is still one of the biggest practical improvements a business can make. If users run as local admin all day, attackers inherit that convenience. Privileged access management gives you a way to approve what needs elevation without handing every user the keys permanently.

Second, get serious about identity. **Enforce MFA, but do not stop there**. Watch for impossible travel, suspicious sign-ins, risky OAuth grants, stale accounts, shared accounts, and service accounts with too much access. Identity is the control plane, and I have written before about why [weak identity turns everything else into expensive theater](/blog/protecting-your-enterprise-from-employee-actions-on-network-devices/).

Third, **deploy and tune EDR**. Do not just install it. Make sure alerts go somewhere. Make sure someone owns triage. Make sure high-confidence detections can trigger fast containment. If the average breakout window is measured in minutes, your response process cannot be measured in business days.

Fourth, **enable useful logging**. At minimum, I want process creation, command line details, PowerShell logs, registry persistence changes, scheduled task creation, authentication events, and endpoint detection telemetry. Logs are not glamorous, but when something goes wrong, they are the difference between “we know what happened” and “we wiped the machine and hoped.”

Fifth, **block or restrict high-risk native tools** where normal users do not need them. This should be tested in phases. Start with audit mode where possible. Identify business-critical exceptions. Then move toward enforcement. Do not let perfect application control become the excuse for doing nothing.

Sixth, **keep patching edge devices and exposed services**. LOTL is often a post-compromise technique, but initial access still matters. If attackers come in through a VPN, firewall, router, exposed RDP path, or vulnerable web-facing service, they can start living off the land from there. This is where a disciplined [vulnerability management process](/blog/managing-vulnerabilities-in-an-msp-environment/) still matters.

## Detection has to focus on behavior, not just tools

> The defensive mindset has to change from “is this file bad?” to “does this behavior make sense?”

A few examples:

- PowerShell launched by an IT admin during a maintenance window may be normal.
- PowerShell launched by Word from a user Downloads folder is a different story.
- Certutil used by a certificate admin may be expected.
- Certutil making an outbound connection from a receptionist’s workstation deserves attention.
- A scheduled task created by RMM may be normal.
- A scheduled task created after a suspicious login from an unusual source should be investigated.
- Rundll32 loading expected Windows components is normal.
- Rundll32 executing from odd paths or making unusual network connections is not something I would ignore.

This is where baseline behavior matters. You cannot detect abnormal if you refuse to define normal.

For MSPs, the challenge is even harder because every client has a different version of normal. Some clients have old line-of-business apps. Some have strange vendor tools. Some have remote workers everywhere. Some have half-modern cloud environments and half-ancient on-prem systems that everyone is afraid to touch.

That mess is real. But it is not an excuse to stay blind.

Start with the common high-risk patterns, tune from there, and document exceptions like they matter. Because they do.

## The browser and SaaS angle cannot be ignored

A lot of LOTL discussion focuses on Windows endpoints, and for good reason. But modern work does not live only on the endpoint anymore. It lives in the browser, SaaS apps, identity providers, cloud dashboards, documentation platforms, finance portals, and support tools.

That means attackers can *“live off the land” in the cloud too*.

They can abuse legitimate OAuth grants. They can use valid sessions. They can create inbox rules. They can add MFA methods. They can use admin portals. They can create API tokens. They can move through SaaS environments without ever touching the traditional endpoint in a way that generates a classic malware alert.

This is why secure browser controls, SaaS logging, identity telemetry, and conditional access policies belong in the same conversation as EDR and application control. The attacker does not care which console your team thinks owns the problem.

They care where the trust is.

## The uncomfortable part: people are still part of the attack path

The PDF spends time on phishing examples, including fake delivery notices and Microsoft 365 credential scams. That is worth keeping in the article because the human side still matters.

I do not like security awareness programs that shame users. People are busy, distracted, tired, and targeted by messages designed to create urgency. Attackers know how to make something look close enough to normal. Blaming users after the fact is lazy security.

> But pretending users are not part of the attack path is also lazy security.

The answer is layered protection:

- better email filtering
- phishing-resistant MFA where possible
- password managers
- conditional access
- browser protections
- user reporting buttons
- fast response to reported phishing
- clear training that explains what to do, not just what not to click

A user should not be the only thing standing between an attacker and the business.

## My strong opinion: LOTL defense is mostly boring work done consistently

Living off the land attacks sound advanced, and sometimes they are. But a lot of the defense work is not exotic.

Remove local admin.
Enforce MFA.
Patch exposed systems.
Control scripts.
Restrict risky binaries.
Log process behavior.
Watch identity.
Audit remote access.
Protect credentials.
Tune EDR.
Test response.

None of that is shiny. All of it matters.

The organizations that struggle the most are usually not missing one magical product. They are missing operational discipline. They have tools deployed but not tuned. Logs collected but not reviewed. Admin rights granted but not revisited. Remote access installed but not audited. Alerts firing but not owned. Policies written but not enforced.

> LOTL attacks punish that gap between having security tools and running a security program.

## Final thought

**Living off the land attacks are a reminder that trust is an attack surface**.

The operating system trusts its own tools. Admins trust their scripts. Users trust familiar login pages. Businesses trust remote access platforms. Security teams trust signed binaries. Attackers know all of that, and they build their tradecraft around it.

That does not mean we should panic and block every tool in sight. It means we need to become more intentional about what is allowed, who can run it, when it should run, and what should happen when behavior falls outside the norm.

The goal is not to make every endpoint unusable.

The goal is to make the attacker’s life harder, louder, and shorter.

Because if an attacker is going to live off your land, the least you can do is stop leaving the doors open.