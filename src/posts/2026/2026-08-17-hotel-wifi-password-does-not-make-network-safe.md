---
date: 2026-08-17T11:00:20-05:00
title: "That Hotel Wi-Fi Password Does Not Make the Network Safe"
seoTitle: "Hotel Wi-Fi Security: Why You Should Use a VPN"
description: "A compromised hotel Wi-Fi gateway can redirect guests to fake updates, steal credentials, and deliver malware. A VPN should be part of every public Wi-Fi connection."
searchIntent: "Explain the security risks of hotel and public Wi-Fi, how the CaptiveCrunch campaign abused hospitality networks, what a VPN protects, and how travelers and IT teams should respond."
featuredImage: /assets/images/hotel-wifi-vpn-safety.webp
featuredImageAlt: Open laptop on a desk in a hotel room with a blue encrypted connection tunnel reaching a wall-mounted Wi-Fi access point while red interference surrounds the gateway.
featuredImageCaption: "A hotel network can look normal while the traffic path behind it has been compromised. A VPN adds an encrypted tunnel across that untrusted network. (Image generated using ChatGPT.)"
tags: [cybersecurity, privacy, vpn]
mastodon_post: true
mastodon_url: ""
mastodon_tags: [Cybersecurity, InfoSec, PublicWiFi, VPN, Privacy]
---

Hotel Wi-Fi asks us to make a strange trade. We trust a network we have never seen, operated by people we will never meet, using equipment we cannot inspect, because cellular service is weak and we need to answer an email.

Sometimes the network has a password printed on the room key sleeve. Sometimes the front desk confirms the network name. Neither one tells us whether the gateway is patched, the guest network is properly isolated, the DNS responses are honest, or somebody else has gained administrative control of the equipment.

That is no longer a theoretical warning.

Microsoft recently documented a campaign it calls **CaptiveCrunch**, in which attackers compromised hospitality networks and manipulated the traffic passing through captive portals. Guests were redirected to fake browser and operating system updates, device-code phishing pages, and malware delivery infrastructure. The network itself became part of the attack.

This is why I use a VPN on hotel, airport, conference, café, and other public Wi-Fi. It is not because every hotel is malicious. It is because I have no good reason to trust the path between my device and the internet.

## The hotel network was telling guests a lie

According to [Microsoft Threat Intelligence](https://www.microsoft.com/en-us/security/blog/2026/07/31/captivecrunch-midnight-blizzard-targets-travelers-worldwide-for-malware-delivery-and-credential-theft/), the CaptiveCrunch activity began showing up in early May 2026 across hospitality networks in several countries. Microsoft attributes the operation to Storm-2945, which it assesses is a sub-cluster of the Russia-linked group Midnight Blizzard.

The attackers were able to manipulate DNS and web traffic from networks served by captive portals. That matters because DNS is what helps a device turn a name such as a website address into the server it should contact. If the network can give a dishonest answer, it can try to send the device somewhere else.

In this campaign, the attackers abused automatic connectivity checks—the routine requests a laptop or phone makes after joining Wi-Fi—to redirect users to convincing fake update pages. Some pages told the victim to download a file. Others used ClickFix-style instructions that asked the victim to open a terminal or Windows utility and run a command.

The redirect did not silently infect the computer. The victim still had to execute something. That is an important distinction, but it is not much comfort when the malicious instruction appears immediately after joining a hotel network and looks like part of the connection process.

The main Windows implant, called CornFlake, was not a nuisance program. Microsoft says it could log keystrokes, record clipboard contents, steal browser cookies and saved passwords, capture screenshots, use the webcam and microphone, search removable drives, collect files, and give the attacker a remote shell. A second tool, ChocoShell, focused heavily on stealing browser data and Microsoft 365 session tokens.

Some guests were also sent into a legitimate Microsoft device-code sign-in flow. The Microsoft page was real, but the code belonged to a session started by the attacker. If the victim completed the sign-in, they could hand the attacker an MFA-satisfied session without typing a password into a fake website.

That is what makes this campaign worth paying attention to. The attacker did not have to lure someone with an email before the trip. The untrusted network created the moment of trust, then abused it.

## A Wi-Fi password only controls who can join

People tend to treat the presence of a Wi-Fi password as proof that a network is secure. It is not.

The password may encrypt the wireless connection between your device and the access point, depending on how the network is configured. It may also keep random people outside the building from joining. It does not prove that the router or captive portal is healthy. It does not prove guests are isolated from one another. It does not stop a person from setting up a look-alike network name. It does not help when an attacker has the same password as every other guest—or administrative control of the gateway.

The password on the room key is an admission control. It is not an integrity check for the entire network.

This is the same lesson behind [Russia’s earlier router campaign](/blog/russias-router-campaign-should-be-a-wake-up-call-for-every-office/). Routers and gateways are not boring background hardware. They decide where traffic goes and which DNS answers connected devices receive. When an attacker controls that position, every device behind it inherits the risk.

## HTTPS helped, but it did not make public Wi-Fi trustworthy

Public Wi-Fi is safer than it was fifteen years ago. HTTPS is now normal, and that blocks much of the casual traffic sniffing that used to make open hotspots especially dangerous. Someone sitting in the lobby with packet-capture software should not be able to read the contents of a properly protected banking session just because they share the network.

That progress is real. It is also incomplete.

HTTPS protects the connection between an application and the site it successfully reaches. It does not make the local network honest. A compromised gateway can still manipulate unencrypted connectivity checks, interfere with DNS that is not protected elsewhere, collect metadata, and place convincing social engineering in front of a user before a normal browsing session begins.

Certificate warnings are supposed to stop a network attacker from impersonating an HTTPS site. They only work if the user stops. Any captive portal that tells you to install a certificate, ignore a browser warning, download a security utility, or run a command should be treated as hostile.

This is where the [60-Second Pause Protocol](/blog/cyberseckyle-security-how-to-series-everyday-defense-part-5-scam-spotting-the-60-second-pause-protocol/) earns its keep. Disconnect, slow the moment down, and verify the request through a route the prompt did not provide.

## What a VPN changes

A VPN creates an encrypted tunnel between your device and a VPN server. When it is configured as a full tunnel and handles DNS through that tunnel, the hotel network sees an encrypted connection to the VPN provider instead of a useful stream of DNS lookups and destination traffic it can inspect or manipulate.

That is the control [ReliaQuest recommends for this exact attack path](https://reliaquest.com/blog/threat-spotlight-dns-poisoning-tactics-expand-to-hospitality/): an always-on, full-tunnel VPN that routes DNS through trusted resolvers and does not allow ordinary internet access before the tunnel is ready.

The details matter. Split tunneling can leave selected traffic and DNS paths outside the VPN. A connection that quietly falls back to the hotel network after the VPN drops defeats the purpose. Auto-connect and a kill switch are not bonus features on public Wi-Fi. They are what turn “I have a VPN app installed” into an actual network control.

Apple’s iCloud Private Relay is useful for Safari privacy, but [Private Relay is not a device-wide VPN](/blog/apples-icloud-private-relay-isnt-really-that-private/). It does not replace a full tunnel for all traffic leaving a laptop or phone.

## What a VPN does not change

A VPN is not an antivirus product, a phishing filter, or permission to trust every prompt on the screen.

If a fake update convinces you to download and execute malware, the VPN cannot make that file safe. If you enter an attacker’s device code on Microsoft’s real sign-in page, the encrypted tunnel will faithfully carry that bad decision. If the laptop is already compromised, encrypting its traffic does not clean it.

A VPN also moves trust. The hotel can see less, but the VPN provider now occupies an important place in the connection. That is why I would not install the first free VPN advertised in an app store. The provider’s ownership, logging practices, application security, and business model matter.

The right way to think about a VPN is narrow and useful: it protects the network path across infrastructure you do not control. Other controls still have their jobs.

## Why I use Proton VPN

> **Affiliate disclosure:** This is not a sponsored article. It contains an affiliate link to Proton VPN. I may be paid if you click the link or make a purchase, at no extra cost to you. I use Proton VPN myself, and this recommendation is my own.

I use [Proton VPN](https://go.getproton.me/SH2wi) for work and personal use, and public Wi-Fi is one of the main reasons I keep it available on my devices.

What matters to me while traveling is not a giant server-count graphic. I want the VPN to connect without becoming a project, send DNS through the tunnel, and stop traffic if that tunnel drops. Proton VPN gives me the auto-connect, DNS leak protection, and kill-switch controls I want, and its apps are open source.

There are other reputable VPN services. The important part is choosing one before the trip, installing it from the real vendor, learning how its kill switch behaves, and using it consistently. The worst time to research and install a security product is after an unfamiliar hotel page tells you that you need one.

## My public Wi-Fi routine

I treat every public network as untrusted, including networks with polished captive portals and passwords provided by staff. My routine is simple:

1. **Use cellular data or a personal hotspot when practical.** Removing the public network from the path is better than trying to make it safer.
2. **Verify the exact network name with the venue.** This does not prove the network is healthy, but it helps avoid obvious look-alike hotspots.
3. **Install and update the VPN before traveling.** Download it at home or over cellular data, not from a prompt that appeared after joining public Wi-Fi.
4. **Use the captive portal only to obtain access.** Do not install certificates, browser updates, troubleshooting tools, or “required” security software from it. Never paste a command into Terminal or PowerShell because a web page told you to.
5. **Connect the VPN before opening email, work applications, or sensitive sites.** Use a full-tunnel configuration, keep DNS inside the tunnel, and enable the kill switch. If the portal and VPN conflict, complete only the minimum portal step, then bring the tunnel up immediately.
6. **Keep sharing turned off.** Mark the network as public, keep the firewall enabled, and disable file, printer, and local discovery features you do not need.
7. **Question unexpected sign-ins.** A request to enter a device code or approve MFA is not normal just because it appeared while connecting. [Passkeys are still stronger than passwords](/blog/passkeys-are-better-than-passwords-but-they-are-not-a-silver-bullet/), but no authentication method fixes an approval given to the wrong session.
8. **Forget the network when you leave.** There is rarely a good reason for a device to reconnect automatically the next time it sees the same name.

If the VPN will not connect and the work is sensitive, I switch to cellular data. Convenience is not a reason to send client, administrative, financial, or personal traffic over a path I already know I do not trust.

## What IT teams should do before employees travel

Telling employees to “use the VPN” is not enough if the VPN depends on them remembering to click Connect after the laptop has already started making network requests.

For managed devices, I would want an always-on, full-tunnel configuration, trusted DNS inside the tunnel, a kill switch or equivalent traffic block, and as few split-tunnel exceptions as possible. ReliaQuest specifically recommends preventing internet access until the tunnel is established. Microsoft also recommends preferring private connectivity, blocking device-code authentication where it is not needed, and avoiding software or certificates offered through captive portals.

Travel guidance should explain the social engineering, not only the network diagram. Employees need to know that a fake Windows update, browser repair, or Microsoft sign-in can appear because the network was compromised. They should know how to contact IT through a known phone number or app when the network itself is delivering the prompt.

If someone ran a command, installed an update, or approved an unfamiliar device-code sign-in, treat it as a possible incident. Disconnect the device, notify the security or IT team, review identity sessions, and preserve enough information to investigate. A password change alone may not remove a stolen session or attacker-registered device.

## My take

I do not think people need to panic every time they join hotel Wi-Fi. I do think they need to stop treating the hotel’s password as a security guarantee.

CaptiveCrunch shows what happens when the network we normally ignore becomes an active part of the intrusion. A guest can type the correct network name, use the password supplied by the front desk, land on a professional-looking page, and still be standing in an attacker-controlled path.

A VPN closes much of that path when it is connected early, configured as a full tunnel, and backed by a kill switch. It does not excuse clicking a fake update. It does not replace endpoint protection, strong authentication, or good judgment. It does make a hostile hotel gateway far less useful.

That is enough reason for me to use one on every public Wi-Fi network, every time.
