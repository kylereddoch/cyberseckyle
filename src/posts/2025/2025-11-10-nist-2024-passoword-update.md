---
date: 2025-11-10T16:00:00-05:00
title: 'Responding to NIST’s 2025 Password Standard Update (SP 800-63B-4)'
description: "What changed in NIST’s 2025 password guidance, why it matters, and how to update policies, controls, and user experience without breaking your estate."
tags: [nist, passwords, mfa, cybersecurity, MSP, IT, news]
mastodon_url: https://infosec.exchange/@cyberseckyle/115528153554395143
---

>This article covers the changes in NIST’s July 2025 revision of the Digital Identity Guidelines for authentication (SP 800-63B-4), why they matter, and how to update your policies and controls accordingly. It is aimed at security leaders, IT teams, and MSPs who manage authentication for users.
>
>I have read it so you don’t have to. Here are the key takeaways and action items.

![NISTs New 2025 Password Standards](/assets/images/nist_800-63b-4_hero.png){loading="eager" eleventy:widths="auto"}

NIST finalized the 2025 revision of the Digital Identity Guidelines for authentication, [**SP 800-63B-4**](https://pages.nist.gov/800-63-3/sp800-63b.html). The headline is simple: length and screening beat complexity rules, forced resets are out unless there is evidence of compromise, and the experience must support password managers and modern character sets. NIST also states clearly that passwords are **not** phishing-resistant, so they are a floor, not the ceiling, of your authentication strategy.[^sp80063b_html]

## What changed in 2025

NIST tightened and clarified several requirements and reorganized the presentation. The big shifts you should act on now:

- **Minimum length**
  - Passwords used as the **only** factor must be **at least 15 characters**.
  - Passwords used **only as one factor in MFA** may be shorter but must be **at least 8 characters**.[^sp80063b_html]

- **Maximum length and character acceptance**
  - Verifiers should permit **at least 64 characters**.
  - Accept **all printing ASCII characters plus spaces**, and NIST **recommends accepting Unicode**; count each Unicode code point as a single character.[^sp80063b_html]

- **No composition rules**
  - Do not require mixtures of character types. Replace brittle complexity rules with smarter screening and rate limiting.[^sp80063b_html]

- **No arbitrary periodic resets**
  - Do not force periodic password changes. Require a change **only** when there is evidence of compromise or upon user request.[^sp80063b_html]

- **Blocklist screening is mandatory**
  - Screen new passwords against a **blocklist** that includes breach corpuses, dictionary words, and context-specific terms such as the service name and username derivatives. Reject and explain why.[^sp80063b_html]

- **Support password managers and usability**
  - Allow paste and autofill. Offer a show-password option. Normalize Unicode before hashing if accepted.[^sp80063b_html]

- **Storage and verification**
- Use salted, modern password hashing with tunable work factors, and keep versioning metadata so you can migrate safely later.[^sp80063b_pdf]

## Why this matters

Short minimums, quirky composition rules, blocked paste, and monthly resets train users into predictable behavior and make defenders chase noise. Attackers exploit those patterns. The 2025 guidance centers controls on the math that matters: longer secrets, denial of weak choices, and throttling that makes online guessing expensive. It also aligns UX with real behavior through managers, passphrases, and Unicode acceptance.[^sp80063b_html]

## Policy text you can adopt today

Use language like the following to align with SP 800-63B-4:

1. **Length**
   - Single-factor passwords must be **15+ characters**.
   - Passwords used only as one factor in MFA must be **8+ characters**.[^sp80063b_html]

2. **Acceptance**
   - Permit **≥64 characters**; accept all printing ASCII and spaces.
   - Accept Unicode; count by code point.[^sp80063b_html]

3. **Creation rules**
   - Do **not** impose character class requirements.
   - Do **not** use password hints or knowledge-based questions.[^sp80063b_html]

4. **Screening**
   - Compare proposed passwords against a **blocklist** of commonly used, expected, or compromised values. Provide actionable feedback on rejection.[^sp80063b_html]

5. **Reset policy**
   - No periodic changes unless there is evidence of compromise, or the user requests it.[^sp80063b_html]

6. **UX and managers**
   - Permit paste and autofill. Provide a show-password toggle. Normalize Unicode before hashing.[^sp80063b_html]

7. **Rate limiting**
   - Throttle failed attempts per account with sensible lockout and messaging. Follow the verifier controls in Section 3.[^sp80063b_html]

8. **Storage**
   - Hash with a modern algorithm and unique salt; record algorithm and parameters for future migration.[^sp80063b_pdf]

## Engineering checklist

- **Enrollment and change flows**
  - Add a breach-corpus screen to every new or changed password. Combine with rate limiting.[^sp80063b_html]

- **Input controls**
  - Enable paste and autofill. Add a show-password control. Avoid truncation. Accept spaces and do not strip intended Unicode.[^sp80063b_html]

- **Normalization**
  - If Unicode is accepted, apply NFC normalization before hashing.[^sp80063b_html]

- **Hashing**
  - Use a modern password hashing scheme with strong, tunable cost factors and unique per-secret salts. Track parameters to raise costs over time.[^sp80063b_pdf]

- **Abuse controls**
  - Enforce attempt throttling per account. Keep error messages non-revealing.[^sp80063b_html]

### Strategy for leaders

1. **Treat passwords as a legacy factor**
   - Passwords are not phishing-resistant. Raise the bar with phishing-resistant authenticators such as passkeys and FIDO2 security keys for material risk, while keeping passwords to reduce support friction where needed.[^sp80063b_html]

2. **Make policy humane**
   - Replace composition rules and arbitrary rotation with screening, length, and throttling. Users respond to friction by choosing predictable patterns. The 2025 model is designed to break those patterns.[^sp80063b_html]

3. **Instrument the pipeline**
   - Log password creation outcomes, rejection reasons, and throttling events. Use the telemetry to tune blocklists and cost factors.

4. **Roll out in phases**
   - Phase 1: Enable paste, show-password, and Unicode acceptance.
   - Phase 2: Add breach screening and rate limiting.
   - Phase 3: Raise minimums to 15 for single-factor flows, keep 8 for MFA-only flows.
   - Phase 4: Move priority populations to phishing-resistant authenticators.

### Frequently asked questions

**Do we really have to allow 64 characters and spaces?**
NIST’s usability and security guidance calls for at least 64, allows spaces, and recommends accepting Unicode. This supports passphrases and password managers.[^sp80063b_html]

**Can we still require a number and a special character?**
No. Composition rules are out. Use a blocklist and length requirements instead.[^sp80063b_html]

**What about quarterly password changes?**
Stop doing that unless there is evidence of compromise. That is explicit in the new text.[^sp80063b_html]

**Are passwords enough if we screen and throttle correctly?**
They reduce risk when done right, but they are not phishing-resistant. Use phishing-resistant MFA for accounts with meaningful privileges or sensitive data.[^sp80063b_html]

---

#### Footnotes

[^sp80063b_html]: NIST SP 800-63B-4, *Digital Identity Guidelines: Authentication and Authenticator Management* (final, July 2025). Online HTML reference with normative requirements for password length, composition, screening, resets, Unicode, and usability: [https://pages.nist.gov/800-63-4/sp800-63b.html](https://pages.nist.gov/800-63-4/sp800-63b.html).

[^sp80063b_pdf]: NIST SP 800-63B-4, *Digital Identity Guidelines: Authentication and Authenticator Management* (final, July 2025). PDF for archival citation: [https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63B-4.pdf](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63B-4.pdf).

[^sp80063_landing]: NIST SP 800-63-4 family landing page, revision overview and cross-references for SP 800-63A/B/C:
[https://pages.nist.gov/800-63-4/](https://pages.nist.gov/800-63-4/).
