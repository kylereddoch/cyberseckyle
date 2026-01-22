---
date: 2026-01-22T14:00:00-05:00
title: '20 Common Network Ports You Must Know (and Secure)'
description: "A practical, security-first cheat sheet for the 20 ports you see everywhere, what they do, why they get abused, and how to lock them down without breaking the business."
tags: [networking, cybersecurity, IT, tech]
mastodon_url: https://infosec.exchange/@cyberseckyle/115940630752567216
---

{% image "/assets/images/network-ports.jpg", "Close-up of a network switch with dozens of blue Ethernet cables plugged in, LED link lights glowing across the ports.", "A busy switch full of connections, every lit port is a service path you should inventory, control, and monitor. (Photo by Scott Rodgerson on Unsplash)", "eager", "text-center", "!important", [850], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

Ports are the “doors” your services listen on. Some doors should be inside the building only. Some should be behind a badge reader. Some should be welded shut and buried under concrete.

The tricky part is that a port number does not magically equal a protocol or safety level. It is just a rendezvous point. Security comes from what is listening, how it is configured, and who can reach it. The official source of truth for common service-to-port mappings is the IANA Service Name and Transport Protocol Port Number Registry, which is worth bookmarking. [IANA registry](https://www.iana.org/assignments/service-names-port-numbers).

## The rules that keep you out of trouble

1. **Default deny, then allow only what you need.** This is straight out of firewall best practice: allow only necessary traffic, block the rest. [NIST SP 800-41 Rev.1](https://csrc.nist.gov/pubs/sp/800/41/r1/final)
2. **Never expose “management” ports directly to the internet.** Put them behind a VPN, a jump host, a zero-trust access proxy, and MFA. Logging is not optional.
3. **Prefer modern, encrypted protocols.** Telnet and plain FTP are museum pieces. If you must use older stuff internally, segment it, restrict it, and plan its retirement.
4. **Bind services to the right interfaces.** Many “oops” incidents happen because a service listens on `0.0.0.0` when it only needed localhost or a private VLAN.
5. **Treat internal networks as hostile.** Modern ransomware does.

## The 20 ports (cheat sheet)

<table>
  <thead>
    <tr>
      <th>Port</th>
      <th>Proto</th>
      <th>Typical service</th>
      <th>Why defenders care</th>
      <th>Secure it like you mean it</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Port">20</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">FTP data</td>
      <td data-label="Why defenders care">Legacy file transfer, messy firewalling</td>
      <td data-label="Secure it like you mean it">Avoid if possible; prefer SFTP/HTTPS; restrict to internal segments</td>
    </tr>
    <tr>
      <td data-label="Port">21</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">FTP control</td>
      <td data-label="Why defenders care">Cleartext creds possible, brute force magnet</td>
      <td data-label="Secure it like you mean it">Disable; if required: FTPS, strong auth, IP allowlist, monitoring</td>
    </tr>
    <tr>
      <td data-label="Port">22</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">SSH</td>
      <td data-label="Why defenders care">Real admin access, brute force, key theft</td>
      <td data-label="Secure it like you mean it">Keys over passwords, MFA where possible, restrict by IP/VPN, harden ciphers</td>
    </tr>
    <tr>
      <td data-label="Port">23</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">Telnet</td>
      <td data-label="Why defenders care">Cleartext remote login</td>
      <td data-label="Secure it like you mean it">Disable everywhere you can</td>
    </tr>
    <tr>
      <td data-label="Port">25</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">SMTP relay</td>
      <td data-label="Why defenders care">Spam abuse, open relay risk</td>
      <td data-label="Secure it like you mean it">Not for end users; lock relays, SPF/DKIM/DMARC, rate limits</td>
    </tr>
    <tr>
      <td data-label="Port">53</td>
      <td data-label="Proto">TCP/UDP</td>
      <td data-label="Typical service">DNS</td>
      <td data-label="Why defenders care">Redirection, data exfil, amplification if exposed</td>
      <td data-label="Secure it like you mean it">Restrict recursion, limit zone transfers, validate logging; authoritative should answer TCP+UDP</td>
    </tr>
    <tr>
      <td data-label="Port">67</td>
      <td data-label="Proto">UDP</td>
      <td data-label="Typical service">DHCP server</td>
      <td data-label="Why defenders care">Rogue DHCP = instant network chaos</td>
      <td data-label="Secure it like you mean it">DHCP snooping, trusted ports only, segment guest networks</td>
    </tr>
    <tr>
      <td data-label="Port">68</td>
      <td data-label="Proto">UDP</td>
      <td data-label="Typical service">DHCP client</td>
      <td data-label="Why defenders care">Client side of DHCP</td>
      <td data-label="Secure it like you mean it">Same as above; watch for strange DHCP offers</td>
    </tr>
    <tr>
      <td data-label="Port">80</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">HTTP</td>
      <td data-label="Why defenders care">Cleartext, often “temporary” then forgotten</td>
      <td data-label="Secure it like you mean it">Redirect to 443, HSTS at the app layer, keep 80 only for redirects if needed</td>
    </tr>
    <tr>
      <td data-label="Port">110</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">POP3</td>
      <td data-label="Why defenders care">Cleartext mailbox access</td>
      <td data-label="Secure it like you mean it">Avoid; use 995 or modern auth; disable basic auth where possible</td>
    </tr>
    <tr>
      <td data-label="Port">123</td>
      <td data-label="Proto">UDP</td>
      <td data-label="Typical service">NTP</td>
      <td data-label="Why defenders care">Time poisoning, reflection if exposed</td>
      <td data-label="Secure it like you mean it">Use trusted upstreams, restrict who can query, prefer authenticated NTP where supported</td>
    </tr>
    <tr>
      <td data-label="Port">135</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">MS RPC Endpoint Mapper</td>
      <td data-label="Why defenders care">Gateway to many Windows services</td>
      <td data-label="Secure it like you mean it">Keep internal only, restrict by subnet, monitor lateral movement</td>
    </tr>
    <tr>
      <td data-label="Port">139</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">NetBIOS Session Service</td>
      <td data-label="Why defenders care">Legacy Windows file sharing surface</td>
      <td data-label="Secure it like you mean it">Disable where possible; block at boundaries; migrate to 445-only</td>
    </tr>
    <tr>
      <td data-label="Port">143</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">IMAP</td>
      <td data-label="Why defenders care">Mailbox access, creds and data exposure</td>
      <td data-label="Secure it like you mean it">Prefer 993, modern auth, disable basic auth</td>
    </tr>
    <tr>
      <td data-label="Port">161</td>
      <td data-label="Proto">UDP</td>
      <td data-label="Typical service">SNMP</td>
      <td data-label="Why defenders care">Default community strings, device intel leak</td>
      <td data-label="Secure it like you mean it">Use SNMPv3, restrict to management VLAN, block from users</td>
    </tr>
    <tr>
      <td data-label="Port">389</td>
      <td data-label="Proto">TCP/UDP</td>
      <td data-label="Typical service">LDAP</td>
      <td data-label="Why defenders care">Cleartext binds, directory exposure</td>
      <td data-label="Secure it like you mean it">Require signing and TLS (STARTTLS), restrict clients, monitor binds</td>
    </tr>
    <tr>
      <td data-label="Port">443</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">HTTPS</td>
      <td data-label="Why defenders care">Your public face, high-value target</td>
      <td data-label="Secure it like you mean it">Patch fast, strong TLS, WAF where needed, least privileges, good headers</td>
    </tr>
    <tr>
      <td data-label="Port">445</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">SMB</td>
      <td data-label="Why defenders care">Ransomware’s favorite hallway</td>
      <td data-label="Secure it like you mean it">Never internet-exposed, restrict internal, disable SMBv1, monitor shares</td>
    </tr>
    <tr>
      <td data-label="Port">587</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">SMTP submission</td>
      <td data-label="Why defenders care">Client outbound mail</td>
      <td data-label="Secure it like you mean it">Require auth, STARTTLS, rate limit, monitor abuse</td>
    </tr>
    <tr>
      <td data-label="Port">3389</td>
      <td data-label="Proto">TCP</td>
      <td data-label="Typical service">RDP</td>
      <td data-label="Why defenders care">Credential theft, brute force, ransomware staging</td>
      <td data-label="Secure it like you mean it">Put behind RD Gateway/VPN, MFA, NLA, lockouts, geo/IP allowlists</td>
    </tr>
  </tbody>
</table>

Here is a downloadable PDF version of the cheat sheet for easy reference: [20 Common Network Ports You Must Know (and Secure) - PDF](/assets/downloads/20-common-network-ports-cheatsheet-printable.pdf)

## What “secure” looks like, in human terms

### Remote admin ports (22, 3389, 135, 139, 445)

If these are reachable from everywhere, you are living dangerously.

- **SSH (22):** keys only, no root login, limit who can attempt auth, and keep it off the public edge unless you have a strong access broker. SSH is designed for secure remote login, but only if you run it like you expect attackers. [RFC 4251](https://datatracker.ietf.org/doc/html/rfc4251)
- **RDP (3389):** assume it will be hammered. Prefer RD Gateway or a ZTNA solution, require MFA, and treat exposed RDP as an incident waiting to happen. Microsoft documents 3389 as a core Remote Desktop Services port. [Ports used by RDS](https://learn.microsoft.com/en-us/troubleshoot/windows-server/remote/ports-used-by-rds)
- **Windows RPC (135):** it is often necessary inside Windows environments, but it should not be “open season.” Microsoft describes 135 as the well-known entry point used to discover the dynamic port for a given RPC service. [Microsoft RPC explanation](https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/restrict-ad-rpc-traffic-to-specific-port)
- **NetBIOS (139) and SMB (445):** keep them inside. Modern SMB runs on 445, while 139 is part of the older NetBIOS stack. Microsoft’s own guidance lays out those port roles clearly. [Direct hosting of SMB over TCP/IP](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/direct-hosting-of-smb-over-tcpip)

**Practical hardening wins:**

- Segment “user VLANs” away from “server VLANs.”
- Block 445/139 at every boundary you control (especially to and from the internet).
- Turn on logging where it matters (Windows event logs for logons and share access, plus firewall logs).

### Web ports (80, 443)

- **HTTP (80):** the only sane modern use is redirecting to HTTPS. If an app is still serving real content over 80, treat it as a bug.
- **HTTPS (443):** this is where attackers live because it is where business lives. Patch quickly, minimize exposed endpoints, and make sure admin panels are not sitting on the same public hostname as marketing pages. Port 443 is formally registered as HTTPS in IANA. [IANA 443 entry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=443)

**Practical hardening wins:**

- Use TLS configs that disable obsolete protocols and weak ciphers.
- Put management interfaces on a different listener and restrict them.
- Monitor 4xx and 5xx spikes, auth failures, and weird paths.

### Email ports (25, 110, 143, 587)

Email infrastructure is half plumbing, half spam battlefield.

- **SMTP relay (25):** primarily server-to-server mail transport, and a classic target for abuse if misconfigured (open relays, weak policies). SMTP explicitly references port 25 as the SMTP port in the standards. [RFC 5321](https://www.rfc-editor.org/rfc/rfc5321.html)
- **SMTP submission (587):** intended for authenticated client submission, and formally reserved for that purpose. [RFC 6409](https://www.rfc-editor.org/rfc/rfc6409.html)
- **POP3 (110) and IMAP (143):** mailbox access ports that are still common in the real world, and still frequently misused with legacy authentication. POP3 listening on TCP 110 is described in the POP3 standard. [RFC 1939](https://www.ietf.org/rfc/rfc1939.txt) IMAP port registration is covered in the current IMAP RFC. [RFC 9051](https://www.ietf.org/rfc/rfc9051.html)

**Practical hardening wins:**

- Disable basic auth wherever possible.
- Require TLS for submission and retrieval.
- Rate limit auth attempts and alert on password spraying patterns.

### Core network services (53, 67, 68, 123, 161)

These ports are “infrastructure.” If they go sideways, everything goes sideways.

- **DNS (53):** authoritative servers must answer on both UDP and TCP 53, and DNS is a favorite for weird edge cases and abuse. IANA explicitly requires authoritative name servers to answer over UDP and TCP on port 53. [IANA nameserver reachability](https://www.iana.org/help/nameserver-requirements)
- **DHCP (67/68):** DHCP uses UDP and specifies the client-to-server and server-to-client port pair directly in the RFC. [RFC 2131](https://www.rfc-editor.org/rfc/rfc2131.html)
- **NTP (123):** time matters more than people think. Kerberos, certificate validation, log correlation, incident response timelines, all of it depends on sane time. NTP’s IANA port assignment is noted in the NTPv4 spec. [RFC 5905](https://datatracker.ietf.org/doc/html/rfc5905)
- **SNMP (161):** SNMP is incredibly useful and incredibly dangerous when configured lazily. SNMP’s modern security architecture is defined in the SNMP framework RFC set. [RFC 3411](https://www.ietf.org/rfc/rfc3411.txt)

**Practical hardening wins:**

- Put these on a management or infrastructure VLAN.
- Restrict queries to known management hosts.
- Turn off features you do not use (DNS recursion on authoritative servers, SNMP write access, NTP modes you do not need).

### Directory services (389)

- **LDAP (389):** the LDAP standard recommends listening on IANA-assigned port 389. [RFC 4511](https://datatracker.ietf.org/doc/html/rfc4511) Security-wise, your goal is simple: do not allow cleartext authentication on untrusted networks, require signing where supported, and use TLS (often via STARTTLS).

**Practical hardening wins:**

- Limit which hosts can talk to LDAP.
- Monitor bind failures and unusual query volume.
- Prefer modern identity patterns when possible, but secure what you have today.

#### A simple workflow you can actually use

1. **Inventory what is listening** (servers, network gear, cloud security groups).
2. **Decide who truly needs access** (by role, subnet, device posture).
3. **Enforce with controls in layers**: security groups, network firewall, host firewall, and app-level auth.
4. **Log and alert** on authentication failures, unusual connection spikes, and new listeners.
5. **Review quarterly** because “temporary” ports love to become permanent.

If you secure nothing else, secure the management ports and SMB. Attackers adore the shortest path to credentials and lateral movement, and those doors are basically neon signs when left wide open.