---
date: 2026-08-07T08:13:52-05:00
title: "Apple's iCloud Private Relay Isn't Really That Private"
seoTitle: "Apple iCloud Private Relay Real IP Leak Explained"
description: "WebKit proxy bypasses can expose the real IP addresses of iCloud Private Relay users. The deeper problem is a privacy control that does not cover every network path a web page can trigger."
searchIntent: "Explain how WebKit proxy bypasses can reveal the real IP addresses of iCloud Private Relay users, what the risk means, and what users and defenders should do."
featuredImage: /assets/images/apple-private-relay-ip-leak.webp
featuredImageAlt: Apple-style phone and laptop sending blue traffic through two relay nodes while a red connection bypasses them and reaches an exposed network endpoint.
featuredImageCaption: "Most traffic follows the protected relay path. One bypass is enough to expose the network behind it. (Image generated using ChatGPT.)"
tags: [cybersecurity, privacy, apple, browsers]
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/117054613402410930"
mastodon_tags: [Cybersecurity, InfoSec, Apple, Privacy, BrowserSecurity]
publishedAt: "2026-08-07T14:07:34.703Z"
---

> If a privacy feature says it hides your IP address, every network request a website can trigger has to respect that promise. Protecting the main browser traffic is not enough when a side path can quietly go around it.

Apple's iCloud Private Relay is supposed to make Safari browsing harder to tie back to you. It replaces the IP address websites normally see and splits the connection across two relays, so no single party should know both who you are and which sites you visit.

That is a useful privacy design. It is also a paid feature inside iCloud+ carrying a very clear promise.

New research from Talal Haj Bakry and Tommy Mysk shows that the promise has holes. The researchers found three WebKit features that can bypass the expected proxy path: DNS prefetching, WebAuthn Related Origin Requests, and WebTransport. Two can reveal the device's real public IP address to a server. The other can send DNS lookups through the device's normal network path instead of the relay.

Their [technical write-up](https://mysk.blog/2026/08/04/webkit-proxy-icloud-private-relay-ip-leak/) explains that the same behavior affects WebKit-based browsers using Apple's proxy configuration tools and Apple's own Private Relay. [404 Media independently verified](https://www.404media.co/apples-private-relay-is-exposing-users-real-ip-addresses/) that the issues can expose a user's real IP address, and Apple told the publication it is investigating the report.

This does not mean every Safari page has been leaking every Private Relay user's IP address all along. It does mean a website can deliberately trigger network activity that steps outside the privacy boundary users thought they had.

That distinction matters, but it does not make the finding harmless.

## Private Relay protects a path, not the whole device

Private Relay is not a VPN, and Apple has never described it as one. Apple's own [Private Relay support documentation](https://support.apple.com/en-us/102602) says it protects web browsing in Safari. Apple also explains that the first relay sees the user's IP address but not the destination, while the second relay sees the destination but only receives a temporary IP address.

The separation is the security feature. A website should see the relay address, not the connection coming from your home, office, hotel, or mobile carrier.

The problem is that a modern web page does more than load HTML, images, and scripts through one neat browser connection. It can ask the browser to resolve names early. It can start newer transport protocols. It can call operating system services to support authentication. If any of those requests leave through a different door, the protection is only as strong as that unguarded door.

That is what the researchers found.

### DNS prefetching leaves through the normal resolver path

DNS prefetching is a performance feature. A website can suggest that the browser resolve a hostname before it is needed, shaving a little time off a future connection.

According to the research, WebKit can send that lookup through the device's normal DNS path instead of the configured proxy. A site can create a unique hostname for each visitor and watch for the lookup at an authoritative DNS server. That may expose the user's real DNS resolver and network relationship even though the visible page loaded through Private Relay.

This is a good example of a small performance feature crossing a privacy boundary. The page itself can look fully protected while a background optimization sends a useful tracking signal somewhere else.

### A passkey-related check can reveal the real IP without a passkey login

The WebAuthn issue is the one I find most concerning because it is easy to misunderstand.

Passkeys are not broken by this research. They are still [a strong defense against phishing and password theft](/blog/passkeys-are-better-than-passwords-but-they-are-not-a-silver-bullet/). The problem is how one supporting WebAuthn request gets routed on Apple platforms.

WebAuthn Related Origin Requests allow an organization to use a passkey across a limited group of related domains. Before allowing that, the system fetches a file from the relying party's domain to confirm the relationship. The researchers found that Apple's operating system credential service makes that request directly instead of sending it through Safari's Private Relay path.

A malicious website can point the check at infrastructure it controls and receive a connection from the device's real IP address. The research says this can happen without the user selecting a passkey, approving a login, or even seeing a prompt.

That last part is important. Telling people not to use passkeys would miss the issue. A site can pretend to support the feature and trigger the validation request in the background. This is a routing failure, not a reason to go back to weaker authentication.

### WebTransport can open a direct connection

WebTransport is a newer web API for low-latency communication over HTTP/3 and QUIC. The researchers found that WebKit can create that connection without carrying over the browser session's proxy configuration.

The result is simple: the server sees the device connecting directly instead of seeing the relay address.

Different feature, same security failure. A connection initiated by the page escapes the control that is supposed to cover the page.

## The real problem is session correlation

An IP address is not a magic identity card. Many people can share one public address. Mobile addresses change. Carrier-grade NAT can place large groups of customers behind the same address. Geolocation databases can be inaccurate.

None of that makes an IP leak meaningless.

A real public IP address can still reveal an internet provider, an approximate location, a workplace or organization, and a stable household connection. More importantly, a site that receives both the normal Private Relay traffic and a direct request can associate the protected browser session with the unprotected network address.

That gives trackers and malicious sites a correlation point they were specifically supposed to lose.

For an ordinary user, that may mean more reliable tracking and less location privacy. For a journalist, activist, abuse survivor, investigator, executive, or anyone else with a serious anonymity requirement, it can be much worse. The risk is not only that a server learns an address. It is that the server can connect a supposedly masked visit to a real network and preserve that relationship in its logs.

The impact is especially uncomfortable for iOS privacy browsers that use WebKit's application-level proxy configuration. Apple's platform rules make WebKit the foundation for iPhone and iPad browsers, so a privacy browser can build its own proxy carefully and still inherit network behavior it does not fully control. The researchers say the leaks affect iOS Tor browsers, including Onion Browser. This is not a flaw in the Tor network itself. It is traffic leaving outside the path the app intended to send through Tor.

That is a rough place for any security product to be: responsible for a privacy promise while the platform owns the escape routes.

## This is why security controls need coverage, not just good architecture diagrams

Apple's two-relay design is not the bad part. Splitting knowledge between two providers is a thoughtful way to reduce how much any one party can learn.

The failure is coverage.

Security controls rarely fail only because the main design was foolish. They fail because one protocol, helper service, compatibility path, or performance optimization did not inherit the same policy. We see the same pattern with traffic that slips around inspection, application logs that omit a secondary workflow, and identity controls that [protect sign-in but not the active session](/blog/secure-browsers-push-zero-trust-past-the-login-screen/).

The architecture can be sound on paper and still fail in production because the boundary was drawn around the expected path instead of every reachable path.

For Private Relay, the right test is not, "Does Safari send a normal page request through two relays?" The right test is, "Can a website cause any network activity that reveals the device's real connection?"

The answer should have been no.

## What Private Relay users should do now

I would not tell everyone to switch off Private Relay. It still prevents routine Safari traffic from exposing a user's normal IP address and makes passive tracking harder. Removing that protection does not fix the problem. It just removes the protection that still works.

I would change how much I trust it.

- Do not treat Private Relay as an anonymity tool or a replacement for a VPN.
- Install Apple security and browser updates when fixes for these issues become available.
- If hiding your real IP is important to your safety or work, use a reputable system-level VPN with a kill switch and verify its behavior against your threat model.
- Keep using passkeys. This finding is about the network path used by a WebAuthn support feature, not the security value of passkeys themselves.
- Be cautious with public IP leak-test pages. Testing a leak necessarily reveals network information to the test operator.

The researchers note that system-level VPNs are not affected by these three specific bypasses because they tunnel the device's network traffic below the browser layer. That does not make every VPN trustworthy, and it does not remove every iOS privacy limitation. It does explain why a device-wide control is harder for a browser feature to step around than an application-level proxy.

For users with a normal consumer privacy goal, Private Relay can still be one useful layer. For users whose safety depends on not disclosing their source network, one useful layer is not enough.

## What defenders and IT teams should take from this

There is a lesson here beyond Apple.

If your organization builds or buys a privacy proxy, secure browser, remote browser, or traffic inspection product, ask what happens to every connection the application can trigger. Include authentication helpers, DNS optimizations, HTTP/3, QUIC, WebRTC, background services, extensions, and operating system handoffs. "Browser traffic is proxied" is too vague to be a security requirement.

For MSPs and security teams supporting Apple fleets, I would also avoid treating a source IP as strong proof of identity. Private Relay already changes the addresses defenders see, and a bypass can create the opposite problem by exposing a real address when the user expects a relay. IP reputation and location checks can still contribute to a risk decision, but they should not carry it.

More broadly, [privacy claims deserve the same validation we expect from any other security claim](/blog/private-cloud-compute-is-impressive-but-it-still-needs-real-security-scrutiny/). Test the failure paths. Test new protocols. Test what happens when the browser hands work to the operating system. Test the quiet features added for speed and convenience.

Users do not care which process made the request. They turned on a feature that says it hides their IP address while they browse in Safari. From their point of view, traffic triggered by the website is browser traffic.

That is a fair expectation.

## My take

I like the idea behind Private Relay. I would rather see consumer platforms build privacy into the network path than leave everyone to figure it out on their own.

But privacy features have to be judged by what escapes them, not only by what passes through them correctly.

Apple built a strong front door and left several side doors outside the alarm system. One of them can be opened by a website without a click, a passkey login, or any warning to the user. That turns a narrow implementation detail into a real trust problem.

Private Relay is still better than sending every Safari request directly from your normal IP address. It is not the shield many users probably thought they bought with iCloud+.

Until Apple closes every WebKit path that can reveal the source network, the honest way to describe Private Relay is simple: it adds privacy, but it does not guarantee it.
