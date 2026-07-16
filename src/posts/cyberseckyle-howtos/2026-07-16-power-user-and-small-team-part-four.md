---
date: 2026-07-16T10:00:00-05:00
title: 'CybersecKyle Security How-To Series: Power User and Small Team, Part 4 - Light Self Hosting Behind a Reverse Proxy'
seoTitle: Light Self Hosting Behind a Reverse Proxy
description: 'A practical guide to safer light self-hosting: use a reverse proxy, TLS, limited exposure, patching, backups, access control, and a validation checklist before putting services on the internet.'
searchIntent: Help homelab users and small teams expose self-hosted services more safely with reverse proxies, TLS, access controls, updates, backups, and basic monitoring.
featuredImage: /assets/images/server-room.png
featuredImageAlt: Server room image representing self-hosted services, infrastructure, and controlled exposure.
featuredImageCaption: Publishing a service is easy. Owning the exposure is the real work.
tags: [cyberseckyle-howto-series, cybersecurity, security, networking, network-security, how-to]
lastModified: 2026-07-16T12:16:16-05:00
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116930664158208554"
mastodon_tags: [Cybersecurity, InfoSec, SelfHosting, Networking, CybersecKyleHowTo]
publishedAt: "2026-07-16T16:45:39.332Z"
---

> Part 4 of the Power User and Small Team track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/) is about the point where a useful local service becomes an internet-facing system you are responsible for operating.

A self-hosted notes app or dashboard usually begins as a process listening on a local port. The risky step comes later: a router forward is added for convenience, an admin page is exposed along with the application, and nobody writes down which component renews the certificate or where the data is backed up.

A reverse proxy improves that design by giving web traffic one managed entry point. It can terminate TLS and route `notes.example.com` to one internal service and `status.example.com` to another. It does not patch either application, strengthen their login systems, or make a public admin panel private. Those remain separate jobs.

This guide is for a few services that one person or a small team can reasonably maintain. If the service handles regulated data, money, customer production workloads, or an availability commitment, the design needs more than a homelab checklist.

## Decide what is allowed to be public

Inventory the current environment before changing DNS or the router:

```txt
Service:
Owner:
Host and internal port:
Public hostname:
Data handled:
Authentication:
Admin path:
Update method:
Backup and restore method:
Required exposure: public / private remote / local only
```

The final field is the important one. A public status page may need anonymous internet access. A family document service may need remote access but only through a VPN or identity-aware gateway. A container dashboard, database, hypervisor, NAS console, router interface, or Docker socket should stay on a management network or local host unless there is a carefully designed reason otherwise.

Review the router while this list is open. Remove stale forwards rather than assuming every existing rule still supports something. For a conventional public web setup, the expected inbound surface is normally TCP 443 and, when the certificate flow or HTTP redirect requires it, TCP 80. [Let's Encrypt recommends keeping port 80 available for general web servers](https://letsencrypt.org/docs/allow-port-80/) and redirecting requests to HTTPS; DNS-01 or TLS-ALPN-01 are alternatives when port 80 cannot be used.

Do not forward each application's internal port. The reverse proxy should be the only public web listener, and the applications should accept connections only from the proxy or the private network.

## Put a named front door in front of each service

Create a DNS name for every service that is intentionally public:

```txt
notes.example.com
status.example.com
photos.example.com
```

Caddy, Nginx, Nginx Proxy Manager, and Traefik can all fill the reverse-proxy role. The choice matters less than being able to read the configuration, update the software, and restore it. A minimal Caddy configuration for a service listening only on the same host might look like this:

```caddyfile
notes.example.com {
  reverse_proxy 127.0.0.1:3000
}
```

With working public DNS and the required ports reaching Caddy, its [automatic HTTPS flow](https://caddyserver.com/docs/quick-starts/reverse-proxy) can obtain and renew the certificate. Other proxies need their own certificate configuration. In either case, confirm renewal rather than treating the first successful certificate as permanent.

Binding the application to `127.0.0.1:3000` in this example prevents it from becoming a second network entry point on the host. If the proxy and application run in separate containers or machines, restrict the backend port with the container network or host firewall so only the proxy can reach it.

## Keep administration on a different path

An application's public page and its administration surface do not deserve the same exposure. Prefer one of these patterns for management:

- Connect through a VPN and administer the service on its private address.
- Put the admin hostname behind an identity-aware access gateway with MFA.
- Restrict the admin listener to a management network and use a named administrator account.
- If the application cannot separate public and admin access, reconsider whether it belongs on the public internet.

Built-in authentication remains necessary even when a proxy performs an extra authentication check. A proxy login can protect a dashboard, but it cannot repair weak session handling or an overpowered shared administrator inside the application. Also verify how the proxy sets client IP and forwarded headers; trusting those headers from arbitrary sources can make application logging and access rules misleading.

URLs are not controls. An unlinked admin path can appear in browser history, logs, source maps, documentation, and automated scans.

## Operate the whole service, not only the container

A container image is replaceable. The state around it is what makes recovery difficult:

```txt
Application version and image tag
Reverse-proxy configuration
Compose or service definition
Environment variable names
Secret storage location
Database and uploaded data
Certificate method
DNS records
Firewall and router rules
```

Back up the configuration and data, then restore both to a test location. A successful backup job only proves that files were written somewhere. A restore proves that the files are usable and that the rebuild instructions contain enough information.

Keep the host operating system, reverse proxy, application, database, and container runtime on an update schedule. Pinning a container to `latest` does not create an update process; it only makes the next pull less predictable. Record the currently deployed version, review release notes, take a backup, update, and test the public and administrative workflows.

Secrets should stay out of Compose files and Git history. Part 3 covers the [credential inventory, secret storage, and rotation path](/blog/cyberseckyle-security-how-to-series-power-user-and-small-team-part-3-secrets-management-101-for-side-projects/) in more detail.

## Collect enough evidence to troubleshoot and respond

At minimum, keep access and error logs from the proxy, authentication events from the application, update history, backup results, certificate-renewal failures, disk usage, and service restarts. Decide how long each log is useful and protect it accordingly; URLs, addresses, email identifiers, and session details can make logs sensitive.

The alerts should correspond to actions you will take. A certificate renewal failure needs attention before expiration. Repeated failed logins deserve review. A full disk or restart loop needs an operational response. A stream of ordinary `200` responses does not need to wake anyone.

Part 5 will build a small review routine around these signals. For now, make sure each important failure has a place where you would actually see it.

## Validate from both sides of the boundary

Run the checks from a connection outside the home or office network; testing only from inside can hide router, DNS, and certificate problems.

```txt
[ ] Public DNS resolves to the intended entry point
[ ] HTTP redirects to HTTPS where port 80 is used
[ ] Each hostname presents a valid certificate for that name
[ ] Each hostname routes to the intended application
[ ] Unknown hostnames do not reveal another internal service
[ ] Only intended public ports answer from the internet
[ ] Backend application ports do not answer directly
[ ] Admin interfaces require the private management path or stronger gateway
[ ] A failed login appears in the expected application or proxy log
[ ] Configuration and application data have been restored to a test location
```

Use `curl` to inspect routing and headers without relying only on the browser:

```bash
curl -I http://notes.example.com
curl -I https://notes.example.com
```

The first request should redirect when HTTP is enabled. The second should reach the expected service without a certificate warning. Follow that with an external port check limited to the address you own and the ports you intend to expose.

The useful result is not simply that the application loads. It is that the public surface matches the inventory, the management surface stays private, and the system can be rebuilt when the host or storage fails.
