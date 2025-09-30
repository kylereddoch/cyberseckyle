---
date: 2025-09-30T09:00:00-05:00
title: 'How to Check Who Blocked You on Mastodon with Python'
description: "You cannot get a complete list of who blocked you on Mastodon, but you can verify specific accounts and check whether specific servers block your instance. This is a practical, code-first guide with Python scripts for single and batch checks."
tags: [mastodon, tutorials, python, social media]
mastodon_url: https://infosec.exchange/@cyberseckyle/115293684055517553
---

> **Quick disclaimer:** Mastodon does not provide a master list of “who blocked me.” That is a privacy and anti-harassment design choice. You can only verify specific accounts, and you can sometimes see if specific servers publish that they block your home instance. Treat this as a diagnostic guide, not a call-out kit.

{% image "/assets/images/check-mastodon-block-hero-image.jpg", "Hero image: Illustration on a solid #563ACC purple background. A large black Mastodon ‘m’ logo sits in the center. On the left, a black server-rack icon bears a red circle with a white X, and a curved arrow points from this server toward the Mastodon logo. On the right, a black user-group icon also carries a red circle with a white X, with another curved arrow pointing from the Mastodon logo toward the users. Lower-right corner shows the credit text ‘Kyles Tech Korner @cyberseckyle’.", null, "eager" %}

## TL;DR

- There is no supported way to enumerate every account or server that blocked you.  
- You can check a specific handle with the `relationships` API and read the `blocked_by` flag.  
- Some servers publicly list moderated domains at `/api/v1/instance/domain_blocks`. Many do not.  
- I include two Python paths: using `Mastodon.py` and using `requests`. Batch options included.

## What you cannot do

- You cannot fetch a complete list of accounts that have blocked you. The API does not expose such an endpoint.  
- You cannot reliably discover every server that blocks your instance. Some servers disclose blocks. Others keep them private or logged-in only.

## What you can do

1) **Account-level:** For a given handle, resolve it to an account ID, then query your relationship with that ID. If `blocked_by` is `true`, that account has blocked you.  
2) **Server-level:** For a given server, check if it exposes `GET /api/v1/instance/domain_blocks`. If your domain appears with a severity like `suspend`, that server blocks your instance. Many servers hide this list.

---

## Setup: Create a token and pick your tooling

1) **Create a personal access token** on your home instance (for me, `infosec.exchange`):  
   - Preferences → Development → New application → create a token.  
   - Scopes to request here: `read:follows` for relationships, and `read:search` if you use the Search API with `resolve=true`.

2) **Install Python tooling**  
   - Preferred: `pip install Mastodon.py` (a well-maintained wrapper).  
   - Minimal deps: just `requests`.

Set your token in the environment before running the scripts:

**macOS/Linux (bash or zsh):**

```bash
export MASTODON_BASE_URL="https://infosec.exchange"
export MASTODON_TOKEN="YOUR_PERSONAL_ACCESS_TOKEN"
```

**Windows PowerShell:**

```powershell
$env:MASTODON_BASE_URL="https://infosec.exchange"
$env:MASTODON_TOKEN="YOUR_PERSONAL_ACCESS_TOKEN"
```

---

## Part A. Check if a specific account blocked you

### Option A1. Python with `Mastodon.py`

Save as `check_block.py`:

```python
#!/usr/bin/env python3
import os, sys
from mastodon import Mastodon, MastodonError

HOME  = os.environ.get("MASTODON_BASE_URL", "https://infosec.exchange")
TOKEN = os.environ.get("MASTODON_TOKEN")  # scopes: read:follows read:search

if not TOKEN:
    sys.exit("Set MASTODON_TOKEN with scopes read:follows and read:search.")

mast = Mastodon(api_base_url=HOME, access_token=TOKEN)

def resolve_account_id(handle: str):
    q = handle.lstrip("@").strip()
    results = mast.account_search(q, resolve=True, limit=5)  # WebFinger lookup
    if not results:
        return None, None
    if "@" in q:
        for acct in results:
            if getattr(acct, "acct", "").lower() == q.lower():
                return acct.id, acct
    return results[0].id, results[0]

def blocked_by_me(account_id: str) -> bool:
    rel = mast.account_relationships(account_id)[0]
    return bool(getattr(rel, "blocked_by", False))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python check_block.py <user[@domain]> [more handles...]")
        sys.exit(1)

    for handle in sys.argv[1:]:
        acct_id, acct_obj = resolve_account_id(handle)
        if not acct_id:
            print(f"{handle}: not found or not resolvable.")
            continue
        try:
            print(f"{acct_obj.acct}: blocked_by={blocked_by_me(acct_id)}")
        except MastodonError as e:
            print(f"{acct_obj.acct}: error: {e}")
```

Run it:

```bash
python check_block.py gargron@mastodon.social
python check_block.py someone@fosstodon.org another@hachyderm.io
```

### Option A2. Python with `requests` only

Save as `check_block_requests.py`:

```python
import os, sys, requests

HOME  = os.environ.get("MASTODON_BASE_URL", "https://infosec.exchange")
TOKEN = os.environ["MASTODON_TOKEN"]
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

def find_account(handle):
    q = handle.lstrip("@")
    r = requests.get(
        f"{HOME}/api/v2/search",
        params={"q": q, "type": "accounts", "resolve": "true", "limit": 5},
        headers=HEADERS, timeout=20
    )
    r.raise_for_status()
    accounts = r.json().get("accounts", [])
    if not accounts:
        return None
    if "@" in q:
        for a in accounts:
            if a.get("acct", "").lower() == q.lower():
                return a
    return accounts[0]

def blocked_by_me(acct_id):
    r = requests.get(
        f"{HOME}/api/v1/accounts/relationships",
        params={"id[]": acct_id}, headers=HEADERS, timeout=20
    )
    r.raise_for_status()
    return bool(r.json()[0].get("blocked_by", False))

if __name__ == "__main__":
    for h in sys.argv[1:]:
        a = find_account(h)
        if not a:
            print(f"{h}: not found")
            continue
        print(f"{a['acct']}: blocked_by={blocked_by_me(a['id'])}")
```

---

## Part B. Batch check many accounts at once

Create a `handles.txt` file with one handle per line. Then run this script to print a tidy CSV-like readout:

```python
# batch_check.py
from mastodon import Mastodon, MastodonError
import os

HOME  = os.environ.get("MASTODON_BASE_URL", "https://infosec.exchange")
TOKEN = os.environ["MASTODON_TOKEN"]

mast = Mastodon(api_base_url=HOME, access_token=TOKEN)

def acct_id(handle):
    q = handle.lstrip("@").strip()
    res = mast.account_search(q, resolve=True, limit=5)
    if not res:
        return None, None
    for a in res:
        if getattr(a, "acct", "").lower() == q.lower():
            return a.id, a
    return res[0].id, res[0]

with open("handles.txt") as f:
    for raw in f:
        h = raw.strip()
        if not h:
            continue
        try:
            aid, obj = acct_id(h)
            if not aid:
                print(f"{h},not_found")
                continue
            rel = mast.account_relationships(aid)[0]
            print(f"{obj.acct},blocked_by={rel.blocked_by},following={rel.following},followed_by={rel.followed_by}")
        except MastodonError as e:
            print(f"{h},error={e}")
```

Tip: search and relationship endpoints are paginated in different ways across the API. The examples above do not need pagination, but if you expand this pattern, be ready to handle `Link` headers or `max_id` and `min_id` parameters where applicable.

---

## Part C. Check if specific servers block your instance

Some servers publish a list of moderated servers at:

```
https://TARGET_SERVER/api/v1/instance/domain_blocks
```

Availability is up to each admin. If it is available, entries look like:

```json
{"domain":"infosec.exchange","severity":"suspend","comment":"..."}
```

A quick probe script that looks for your domain on a short list of popular tech or cybersec adjacent servers:

```python
# server_blocks.py
import requests

TARGETS = [
    "mastodon.social", "mas.to", "fosstodon.org", "hachyderm.io",
    "mstdn.social", "techhub.social"
]
YOUR_DOMAIN = "infosec.exchange"

for host in TARGETS:
    url = f"https://{host}/api/v1/instance/domain_blocks"
    try:
        r = requests.get(url, timeout=15)
        ctype = r.headers.get("content-type","")
        if r.status_code == 200 and ctype.startswith("application/json"):
            blocks = r.json()
            hit = next((b for b in blocks if b.get("domain") == YOUR_DOMAIN), None)
            if hit:
                print(f"{host} blocks {YOUR_DOMAIN} (severity: {hit.get('severity')})")
            else:
                print(f"{host} does not list a block on {YOUR_DOMAIN} (first page).")
        else:
            print(f"{host} hides domain blocks or requires login (HTTP {r.status_code}).")
    except requests.RequestException as e:
        print(f"{host}: error {e}")
```

Notes:

- Very long block lists can be paginated. Follow `Link` headers if present.  
- Some software stacks adjacent to Mastodon have similar features but differ in disclosure. Do not assume uniform behavior across Akkoma, Pleroma, or GoToSocial.

---

## Troubleshooting

- **Search cannot find a handle:** Use the full `user@domain` format and set `resolve=true`. Discovery happens via WebFinger and may take a moment the first time.  
- **401 or 403 errors:** Verify the token scopes and that your API base URL is your home instance.  
- **Domain blocks endpoint returns 404 or empty:** The server probably does not expose moderated servers publicly, or only to logged-in local users. That is allowed.

---

## Ethics and expectations

- **Blocking is normal.** People block for many reasons. Respect that boundary and avoid naming-and-shaming.  
- **Least privilege.** Request the smallest set of scopes you need. Keep tokens private. Rotate them if you accidentally leak one.  
- **Focus on your audience.** Use these checks to tune your outreach, not to chase people who opted out.

---

### References

- Mastodon API: **Relationships** endpoint and **Relationship** entity (`blocked_by` attribute)  
  - https://docs-p.joinmastodon.org/methods/accounts/  
  - https://docs.joinmastodon.org/entities/Relationship/  
- Mastodon API: **Search v2** with `resolve=true`  
  - https://docs.joinmastodon.org/methods/search/  
  - https://docs-p.joinmastodon.org/methods/search/  
- Mastodon API: **Instance → Domain Blocks**  
  - https://docs.joinmastodon.org/methods/instance/  
- Mastodon API: **OAuth scopes** and OAuth overview  
  - https://docs.joinmastodon.org/api/oauth-scopes/  
  - https://docs.joinmastodon.org/methods/oauth/  
- Python wrapper: **Mastodon.py**  
  - https://mastodonpy.readthedocs.io/  
  - https://github.com/halcy/Mastodon.py  
- Moderation UX and safety basics  
  - https://docs.joinmastodon.org/user/moderating/
