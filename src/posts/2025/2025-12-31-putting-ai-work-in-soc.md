---
date: 2025-12-31T09:00:00-05:00
title: 'Putting AI to Work in the SOC'
description: "Practical ways to integrate AI into SOC workflows for faster triage, better investigations, and safer automation, with the guardrails that keep humans in control."
tags: [soc, ai, security-operations, incident-response, threat-detection]
mastodon_url:
---

{% image "/assets/images/soc.png", "Analysts work at desks in a dimly lit security operations center, facing a wall of large monitors displaying maps, alerts, and network activity dashboards.", null, "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

People tend to file “AI” into one of two buckets: magic oracle or job-stealing robot. Both are wrong in the same way. They treat AI like an independent actor instead of what it actually is in a SOC: a capability you wire into your process.

Used poorly, AI becomes an expensive confidence machine that hallucinates, leaks data, and creates new failure modes. Used well, AI is a force multiplier for tired humans dealing with high alert volume, thin staffing, and increasingly complex environments. That is today’s SOC reality.

This post breaks down where AI fits in a modern SOC, what workflows get the biggest payoff, and the guardrails that keep it from turning incident response into improv theater.

## Why AI belongs in today’s SOC

### The SOC is already an information bottleneck

Your tools are great at generating telemetry. Humans are not great at reading 400 alerts, pivoting across five consoles, and maintaining perfect judgment at 2:13 a.m. The job is often less “deep investigation” and more “gluing context together fast enough to make a decision.”

AI’s sweet spot is compressing and connecting information:

- summarizing what happened
- pulling the most relevant evidence
- proposing likely hypotheses
- suggesting next pivots
- drafting the boring parts (tickets, timelines, notifications)

Done right, that moves analysts from copy/paste operators to decision makers.

### The workforce gap is the background radiation of modern security

The staffing problem is not “coming.” It has been here. Reports like the [ISC2 Cybersecurity Workforce Study](https://www.isc2.org/Insights/2025/12/2025-ISC2-Cybersecurity-Workforce-Study) are a recurring reminder that many teams are still constrained by hiring, budgets, and skills gaps. If you cannot scale headcount as fast as the threat surface scales, you either accept slower response or you improve throughput.

AI is one of the few levers that can increase throughput without rewriting your entire security program.

### SOC maturity is now partly “how well you operationalize knowledge”

SOC performance is shaped by whether your institutional knowledge is usable:

- What does “normal” look like here?
- Which alert sources are noisy in our environment?
- What is the correct containment step for this system?
- What do we tell the client when this happens?

This is the same mindset I use on the governance side: build one backbone, then map tools and processes into it. If you have read my [GRC work on convergence](/blog/grc-in-the-real-world-making-hipaa-pci-nist-csf-ftc-safeguards-and-nis2-work-together/), this will feel familiar because AI in the SOC still needs governance, measurement, and auditability.

## Reality check: what AI is good at, and what it is not

AI is good at:

- language tasks (summaries, translation between human language and query languages)
- ranking and grouping (prioritization, clustering similar alerts)
- retrieval and synthesis (when paired with your knowledge base)
- drafting and documentation

AI is not good at:

- being correct just because it sounds confident
- making high-risk changes without oversight
- understanding your environment unless you feed it real context
- staying safe if you give it too much agency and too few rules

If you remember only one sentence: **AI should reduce uncertainty, not introduce it.**

For risk framing, start with the [NIST AI Risk Management Framework (AI RMF)](https://www.nist.gov/itl/ai-risk-management-framework). If you are using generative AI specifically, pair it with the [NIST Generative AI Profile (NIST AI 600-1)](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf).

## Where AI plugs into a SOC workflow

A simple SOC loop looks like this:

**Signal → Triage → Enrich → Investigate → Decide → Respond → Learn**

AI can help at every step, but the biggest wins usually come from triage, enrichment, investigation, and documentation.

### Use case 1: Alert triage that produces a decision-ready summary

**Goal:** turn a noisy alert into a crisp “what happened + why it matters + what to do next.”

What AI does well here:

- summarize the alert
- identify likely entity relationships (user, host, IP, process, mailbox, device)
- extract indicators (IOCs) and likely intent
- draft a recommended next-step checklist

Guardrails to require:

- every claim must point to evidence (links to logs, event IDs, artifacts)
- uncertainty must be explicit (“likely”, “possible”, “insufficient evidence”)
- the output is a recommendation, not an action

This is the “assistive copilot” model a lot of vendors are aiming for. One example is [Microsoft Security Copilot](https://learn.microsoft.com/en-us/copilot/security/), which is built around investigation and response workflows.

If you care about quality triage, you also care about endpoint and browser integrity, because compromised endpoints poison your telemetry. That is why my [extension deep dive](/tags/extensions/) still matters in a SOC context.

### Use case 2: Faster pivots in the SIEM with natural language to query translation

Most SOC delays are pivot delays. You are not waiting on CPU, you are waiting on “what query do I run next?” AI can shrink that gap fast.

Examples:

- [Splunk AI Assistant for SPL](https://help.splunk.com/en/splunk-cloud-platform/search/splunk-ai-assistant-for-spl/1.0.5/about-splunk-ai-assistant-for-spl/about-splunk-ai-assistant-for-spl) supports natural language to SPL translation and SPL help.
- In Google SecOps, Gemini can assist with search generation and detection creation, including [Generate search queries with Gemini](https://cloud.google.com/chronicle/docs/investigation/generate-udm-search-queries-gemini) and [Generate a YARA-L rule using Gemini](https://cloud.google.com/chronicle/docs/detection/generate-yara-l-with-gemini).

Guardrails that matter:

- treat generated queries as drafts
- require review for detection rules before production
- log prompts and outputs so you can audit how a rule was created
- test for performance impact (bad queries can DoS your own SIEM)

### Use case 3: Investigation assistance and case building

AI can be your “junior analyst who never gets tired,” as long as you do not let it hallucinate its way into decisions.

High-value tasks:

- build a timeline (events in order with timestamps)
- correlate telemetry sources into a single narrative
- summarize threat intel on an IOC or actor
- propose plausible hypotheses and what evidence would confirm or refute each one

Using [MITRE ATT&CK](https://attack.mitre.org/) as a shared language helps when labeling activity, but tactic and technique mapping should be treated as a hypothesis until confirmed.

A habit I like: force questions before conclusions.

- What do we know for sure?
- What are the top 3 hypotheses?
- What evidence would confirm each hypothesis?
- What is the safest containment step that preserves forensics?

### Use case 4: Response playbooks that are safer and more consistent

This is where people get tempted to go full “AI agent that fixes everything.” Slow down.

A safer model:

1) AI drafts response steps based on your playbook library  
2) SOAR executes only pre-approved actions  
3) a human approves anything destructive or high-impact

To keep response aligned to risk management, anchor your program to [NIST CSF 2.0](https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final) and modern IR guidance like [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). If your GRC and your SOC already speak the same language, this gets dramatically easier (again, the convergence mindset from [/tags/grc/](/tags/grc/) pays dividends here).

### Use case 5: Post-incident work that people hate, but auditors love

AI is excellent at the paperwork gravity after incidents:

- draft the incident report
- generate an executive summary and a technical appendix
- extract lessons learned and propose control improvements
- map findings to your governance framework

CSF 2.0 (Govern, Identify, Protect, Detect, Respond, Recover) gives you a clean structure for consistent reporting across incidents.

## A practical mapping: SOC task → AI output → required guardrails

<table>
  <thead>
    <tr>
      <th>SOC task</th>
      <th>AI helps by producing</th>
      <th>Guardrails that keep you safe</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="SOC task">Triage</td>
      <td data-label="AI helps by producing">Evidence-linked summary + severity rationale</td>
      <td data-label="Guardrails that keep you safe">Cite event IDs/logs, show uncertainty, no auto-close without rules</td>
    </tr>
    <tr>
      <td data-label="SOC task">Threat hunting</td>
      <td data-label="AI helps by producing">Draft queries + pivot suggestions</td>
      <td data-label="Guardrails that keep you safe">Human review, query linting, time-bounded searches</td>
    </tr>
    <tr>
      <td data-label="SOC task">Detection engineering</td>
      <td data-label="AI helps by producing">Draft detection logic + test cases</td>
      <td data-label="Guardrails that keep you safe">Peer review, staging environment tests, change control</td>
    </tr>
    <tr>
      <td data-label="SOC task">Incident response</td>
      <td data-label="AI helps by producing">Draft playbook steps + comms templates</td>
      <td data-label="Guardrails that keep you safe">Allow-listed actions only, human approval for destructive steps</td>
    </tr>
    <tr>
      <td data-label="SOC task">Reporting</td>
      <td data-label="AI helps by producing">Timelines, narratives, exec summaries</td>
      <td data-label="Guardrails that keep you safe">Source citations, redact sensitive data, approval workflow</td>
    </tr>
  </tbody>
</table>

## The part people skip: securing the AI layer

If you integrate AI into SOC workflows, you have created a new system that can be attacked.

Start with the [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/). Prompt injection and insecure output handling are not theoretical problems. If your AI can read tickets, emails, web pages, or threat intel feeds, attackers can plant instructions inside that content.

Also consider AI-specific threat modeling. [MITRE ATLAS](https://atlas.mitre.org/) is worth reading if you are taking AI enablement seriously.

The “looks legitimate until it is not” problem is not new. I covered that same trust failure mode in the browser world with [sleeper extensions and long-running campaigns](/blog/sleeper-browser-extensions-how-a-7-year-campaign-turned-chrome-and-edge-into-spyware/). The mental model transfers cleanly: anything that ingests content can be influenced by content.

Minimum viable guardrails I strongly recommend:

- **Data boundaries:** do not send sensitive logs to public chatbots. Prefer enterprise controls and documented data handling.
- **Least privilege tools:** the AI should not have broad permissions “just in case.”
- **Action allow-lists:** only permit specific, reversible actions without human approval.
- **Output validation:** treat AI output as untrusted input. Validate before execution, especially for generated queries, scripts, or remediation steps.
- **Prompt and output logging:** you need auditability, tuning, and incident review for the AI itself.
- **Human-in-the-loop gates:** if the action can break production, lock an account, wipe a host, or notify a customer, a human approves it.

## One more angle people miss: protect the analyst workstation

If your SOC is using AI copilots in a browser, your analysts are about to spend even more time in a place attackers love: the browser.

- If you want to shrink browser attack surface without piling on extensions, see [/tags/vivaldi/](/tags/vivaldi/) and [/tags/privacy/](/tags/privacy/).
- If you want repeatable “day-to-day” habits that keep analysts from getting popped during busy weeks, browse [/tags/how-to/](/tags/how-to/).

This matters because the AI layer does not exist in a vacuum. It sits on top of endpoints, identities, browsers, and the same messy human workflows you already have.

## How to implement AI in a SOC without chaos

### Step 1: Pick 2 workflows where time is obviously wasted

Good starters:

- alert summary + evidence pack for triage
- SIEM query drafting and pivot suggestions
- incident report drafting and timeline generation

Avoid “auto-remediation agent” as your first project. That is how you learn pain.

### Step 2: Define success metrics that humans actually care about

Examples:

- MTTA (mean time to acknowledge)
- time from alert to decision (close vs escalate)
- false positive reduction
- analyst time saved per case
- quality score from peer review (did the summary cite evidence, did it miss key context?)

### Step 3: Build your “SOC brain” first (knowledge base + retrieval)

The most effective pattern is retrieval-augmented generation (RAG): the AI answers using your approved internal sources (playbooks, SOPs, past incidents, environment notes) instead of guessing.

If you want the blunt version: **an LLM without your SOC knowledge base is a very confident intern.**

### Step 4: Start with assistive, then graduate to constrained automation

Maturity curve:

1) Assistive: summarize, draft, suggest  
2) Semi-automated: enrich + open tickets + propose actions  
3) Constrained automation: execute only allow-listed steps  
4) Agentic: broader autonomy (only after you have earned it)

## Prompt patterns that actually work in real SOC life

> **Triage summary (evidence-first)**  
> Summarize this alert for a Tier 1 analyst.  
> Output: (1) What happened, (2) why it might matter, (3) top 5 evidence items with links or IDs, (4) 3 next pivots, (5) confidence and what would increase confidence.

> **Investigation timeline**  
> Build a timeline from these events.  
> Highlight first-seen, lateral movement indicators, privilege changes, and data access.  
> If evidence is missing, list exactly what to collect next.

> **Response draft (playbook-aligned)**  
> Using our containment playbook, draft the safest containment steps for this scenario.  
> Mark which steps are reversible and which require human approval.

The trick is not clever prompts. The trick is forcing structure, evidence, and uncertainty every time.

## Bottom line

AI in the SOC is not about replacing humans. It is about converting human effort from repetitive glue-work into higher-quality decisions, faster investigations, and more consistent response.

The winning pattern is simple:

- assist first
- ground in your data and playbooks
- measure outcomes
- lock down agency
- treat the AI layer as attackable

Do that, and AI stops being hype and becomes something much rarer in security: a tool that actually makes Tuesday night less terrible.