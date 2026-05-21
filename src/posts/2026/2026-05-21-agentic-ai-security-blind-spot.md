---
date: 2026-05-21T13:15:00-05:00
title: Agentic AI Is Security's Next Blind Spot Because It Can Act
description: "Agentic AI is not just another chatbot risk. Once AI systems can use tools, hold memory, call APIs, and act across business workflows, they become a new identity, access, and accountability problem for security teams."
featuredImage: /assets/images/ai_in_soc.png
featuredImageAlt: A glowing artificial intelligence brain hovering in the middle of a security operations center while analysts monitor dashboards around it.
featuredImageCaption:
tags: [ai, cybersecurity, security, MSP]
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116614071156406578"
mastodon_tags: [Cybersecurity, InfoSec, AISecurity, MSP]
---

> Agentic AI is not scary because it can write a better paragraph than a chatbot from two years ago. It is scary because it can read, decide, click, call tools, remember context, and take action inside systems we already struggle to secure.

I have been thinking a lot about a recent piece in [The Hacker News](https://thehackernews.com/2026/05/why-agentic-ai-is-securitys-next-blind.html) that frames agentic AI as security's next blind spot. I agree with the core idea, but the part that really sticks with me is not the "AI" part.

It is the **blind spot** part.

Security teams have a long history of arriving late to the thing the rest of the business already adopted. Cloud was like that. SaaS was like that. Browser extensions were like that. Shadow IT was absolutely like that. The first phase is always the same: people find a useful tool, the tool makes work easier, adoption spreads faster than governance, and security gets pulled in after the architecture, access model, and business expectations are already set.

Agentic AI is following that pattern, but faster.

The difference is that this time the tool is not just storing data or presenting an interface. It can act.

## This is not just chatbot risk anymore

The older generative AI security conversation was already messy enough. Teams had to think about sensitive data in prompts, model outputs, hallucinations, policy, vendor terms, and users pasting things into tools they should not have been using for work.

Agentic AI adds a new layer.

An agent is not only answering a question. It may be reading from a ticketing system, querying a database, searching files, calling an API, drafting an email, opening a pull request, updating a calendar, running a command, or handing work to another agent. The joint Five Eyes guidance on [careful adoption of agentic AI services](https://www.cyber.gov.au/business-government/secure-design/artificial-intelligence/careful-adoption-of-agentic-ai-services) describes these systems as LLM-based agents combined with tools, external data sources, memory, and planning workflows that can operate without continuous human involvement.

That is a different security animal.

A chatbot can give a bad answer. An agent can give a bad answer and then do something with it.

That is why I think the industry needs to stop treating agentic AI as a normal software rollout with a slightly weirder interface. The risk is not only whether the model says something wrong. The risk is whether the system has enough access to turn a wrong answer, poisoned instruction, or manipulated workflow into a real action.

## The old boundaries get blurry fast

Traditional application security depends on boundaries that are at least somewhat understandable:

- this user has these permissions
- this service account can call this API
- this app writes to this database
- this workflow requires this approval
- this log shows who did what

Agentic AI puts pressure on all of those assumptions.

An agent may act on behalf of a person, but it is not the person. It may call tools through a platform, but it is not the platform. It may read a web page, a document, an email, a Slack message, a Jira ticket, or a calendar invite and treat that content as context for its next action. It may keep memory across sessions. It may chain multiple tools together in a way no single human would have done manually.

That creates a weird accountability problem. When something goes wrong, who actually did it?

Was it the user who gave the initial prompt? The agent that interpreted it? The tool that executed the API call? The developer who wrote the system prompt? The vendor that shipped the connector? The business unit that approved the workflow? The security team that never saw it until after the fact?

The Five Eyes guidance calls this out directly: agentic architecture can make it harder to trace why an action happened because decisions may be spread across planning, retrieval, execution, and other components. That is not a philosophical problem. That is an incident response problem.

If you cannot answer "what happened, why did it happen, what identity did it use, what data did it touch, and what else could it have done?" then you do not have a controlled system. You have a mystery with an API token.

## Prompt injection becomes an access problem

Prompt injection has been discussed so much that people are starting to tune it out, which is unfortunate because the agentic version is much more operationally serious.

The simple version is this: models still struggle to keep instructions and data cleanly separated. Microsoft describes the risk in its own agentic Windows documentation, warning that [cross-prompt injection](https://support.microsoft.com/en-us/windows/experimental-agentic-features-a25ede8a-e4c2-4841-85a8-44839191dfb3) can happen when malicious content embedded in UI elements or documents overrides agent instructions and leads to unintended actions like data exfiltration or malware installation.

That is not just a clever prompt trick. It is an access control failure waiting to happen.

Imagine an agent that can read email and create tickets. A malicious email tells it to ignore prior instructions and file a fake urgent support request. Annoying, but maybe contained.

Now imagine an agent that can read email, access a knowledge base, query customer data, create tickets, and trigger a remote management workflow. The same class of attack has a very different blast radius.

The prompt is not the vulnerability by itself. The vulnerability is the combination of untrusted input, trusted tool access, broad permissions, and an agent that can bridge systems that were not meant to trust each other.

That is why "we have a prompt filter" does not make me feel warm and fuzzy. Prompt filters can help, but they are not a substitute for real permission boundaries. If an agent can be tricked, the damage should still be boring, narrow, logged, reversible, and easy to understand.

## MCP is useful, and that is exactly why it matters

The Model Context Protocol has become one of the big pieces of this conversation because it gives agents a standard way to connect to tools and data sources. That is useful. It also means MCP servers, connectors, scopes, tokens, and local runtimes become part of the security boundary.

The official MCP [security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) already read like a reminder that this is not a toy integration layer. They cover risks like confused deputy problems, token passthrough, SSRF, session hijacking, prompt injection through sessions, and local MCP server compromise.

That should get every defender's attention.

The security issue is not that MCP exists. Standards can be good. The issue is that a standard way to connect agents to tools also becomes a standard place where bad assumptions can scale.

If an employee installs a local MCP server from a random repository, what does it have access to? If a coding agent gets a GitHub connector, is it read-only or can it push changes? If an agent can reach both a file system and an external messaging tool, can it be tricked into moving data from one to the other? If a connector asks for broad OAuth scopes because that is easier for the vendor, who is reviewing that?

Those are not future questions. They are current questions.

## The real blind spot is identity

The part I keep coming back to is identity.

Most organizations already have too many human accounts, too many service accounts, too many stale groups, too many over-permissioned roles, and too many secrets nobody wants to rotate because something important might break. Agentic AI lands directly on top of that mess and adds a new category of actor.

Microsoft's security blog says more than [80% of Fortune 500 companies use active AI agents](https://www.microsoft.com/en-us/security/blog/2026/02/10/80-of-fortune-500-use-active-ai-agents-observability-governance-and-security-shape-the-new-frontier/) built with low-code or no-code tools, and it argues agents should be held to the same standards as employees or service accounts. That is the right framing.

An agent needs an identity.

Not just "Kyle used the agent." Not just "the automation ran." Not just "the API key worked." A real identity with ownership, purpose, scope, expiration, logs, and revocation.

NIST's NCCoE has been looking at this through its concept paper on [software and AI agent identity and authorization](https://csrc.nist.gov/pubs/other/2026/02/05/accelerating-the-adoption-of-software-and-ai-agent/ipd), which focuses on the risks of giving agents access to tools, applications, and data without the right identification and authorization controls. That is where this conversation has to go.

If an agent has no distinct identity, you cannot govern it cleanly.

If you cannot govern it cleanly, you cannot revoke it cleanly.

If you cannot revoke it cleanly, you are going to have a bad day when it misbehaves, gets compromised, or quietly keeps running long after the person who created it moved on.

## Over-permissioned agents are going to hurt people

This is where the risk stops being abstract.

Teleport's 2026 research says organizations with over-privileged AI systems reported a much higher incident rate than organizations that limited AI to only the access needed for the task. The vendor's own summary says over-permissioned AI systems were associated with [4.5x more security incidents](https://goteleport.com/about/newsroom/press-releases/2026-state-of-ai-in-enterprise-security-report/), and 70% of security leaders said AI systems had more access than a human in the same role.

Even if you treat vendor research with the usual caution, the direction is completely believable.

Least privilege is hard with humans. It is harder with service accounts. It may be even harder with agents, because people are going to over-scope them in the name of usefulness.

That is the tradeoff everyone wants to dodge. The more an agent can access, the more impressive the demo. The narrower its permissions, the more often it has to stop and ask for help. Business teams want the magic. Security teams have to care about the blast radius.

Both sides are going to have to get more honest.

- An agent that can summarize public web pages does not need access to your email.
- An agent that triages support tickets does not need write access to your code repositories.
- An agent that drafts calendar responses does not need terminal access.
- An agent that helps with incident notes should not be able to disable controls, rotate credentials, or make infrastructure changes without a human approval step that actually means something.

This is basic security, but agentic AI makes basic security easier to forget because the interface feels conversational and helpful.

## Why this is especially messy for MSPs

The MSP angle worries me because MSPs already sit in a strange trust position. One provider may have access to many clients, many tenants, many admin portals, many remote management tools, many documentation systems, and many ticketing workflows.

Now add agents.

An MSP technician using an AI assistant to summarize tickets is one thing. An MSP technician using an agent that can read tickets, search documentation, open admin portals, draft customer emails, run scripts, and interact with an RMM platform is something else entirely.

That agent may be useful. It may save time. It may reduce repetitive work. It may help a small team keep up.

It may also become a new privileged operator sitting inside the exact workflow attackers already want to abuse.

The risk is not only a science-fiction scenario where the agent "goes rogue." The boring scenarios are enough:

- a poisoned ticket comment influences the agent's next action
- a malicious customer email gets treated as trusted operational context
- an over-scoped connector exposes documentation from the wrong client
- an agent uses a technician's broad permissions instead of a narrower task identity
- a helpful automation makes a change across multiple tenants before anyone notices the premise was wrong

That is the kind of problem MSPs cannot afford to hand-wave. Cross-client trust is fragile. Agentic AI can make that trust more efficient, but it can also make mistakes and abuse scale faster.

## What I would do before approving agentic AI in a real environment

I do not think the answer is "ban it all." That will fail in the same way every broad shadow IT ban fails. People will use tools that help them do their jobs.

The better answer is to make the first approved path safer than the unofficial path.

Here is where I would start.

### 1. Build an agent inventory

You cannot secure what you cannot name. Track every approved agent, who owns it, what business process it supports, what model or platform it uses, what data sources it reads, what tools it can call, what identity it runs under, and when it expires.

If that sounds boring, good. Boring governance is how you avoid dramatic incidents.

### 2. Treat every agent like a non-human identity

Agents should have distinct identities where possible, not shared API keys buried in a connector nobody owns. They should have least privilege, short-lived credentials, clear ownership, and revocation paths.

If an agent is important enough to act in production, it is important enough to appear in identity governance.

### 3. Separate read, suggest, and act

Do not jump from "summarize this" to "go do it" in one permission tier.

Reading data, drafting a recommendation, and taking action should be separate capability levels. The approval path for a read-only research assistant should not look like the approval path for an agent that can modify infrastructure, send external messages, or change customer records.

### 4. Put human approval at the point of impact

Human-in-the-loop only matters if the human sees the actual action, the target, the data involved, and the consequence.

"Approve this plan" is weak if the plan hides the meaningful details. "Approve sending this exact email to this recipient with these attachments" is better. "Approve running this script against these devices in this tenant" is better. The approval needs to sit where the risk lives.

### 5. Log tool calls like you expect to investigate them

Security teams do not need a vague transcript that says the agent "helped with a task." They need action-level logs: tool invoked, identity used, parameters passed, data touched, external destination, approval gate, result, timestamp, and correlation back to the user or workflow.

Microsoft's [agentic risk guidance](https://learn.microsoft.com/en-us/security/zero-trust/sfi/manage-agentic-risk) emphasizes actions, tools, outcomes, auditability, and post-execution logs for a reason. Without that, incident response becomes guesswork with nicer branding.

### 6. Treat memory as a security boundary

Long-lived memory is powerful, but it is also a place where bad context can persist. If an agent remembers the wrong thing, stores sensitive data, or carries poisoned instructions forward, the failure can survive beyond one session.

Memory needs governance: what can be stored, who can inspect it, how long it lives, how it is cleared, and what sources are allowed to influence it.

### 7. Red-team the workflow, not just the prompt

Testing one prompt is not enough. Test the whole chain.

What happens if a malicious instruction appears in an email? A PDF? A web page? A ticket comment? A calendar invite? A tool response? A repository README? A customer-provided log file?

The question is not "can the model be tricked?" It can. The better question is "when it is tricked, what can it actually do?"

## My take

Agentic AI is going to be useful. I am not interested in pretending otherwise. Security teams will use it. MSPs will use it. Developers will use it. Business teams will build small agents for workflows security may not even know exist yet.

That is exactly why this has to be taken seriously now.

The blind spot is not that security people have never heard of AI agents. The blind spot is that many organizations are still trying to fit agents into old categories: chatbot, automation, SaaS feature, browser assistant, workflow helper, service account.

Agents are a little bit of all of those, and that is the problem.

- Software that can reason over messy input.
- Identities that can touch data.
- Automation that can call tools.
- Users that do not think like users.
- Supply chain dependencies with memory and permissions.

That combination deserves its own security model.

For defenders, the practical move is not panic. It is fluency. Build a small agent. Break a small agent. Connect one to a harmless tool and watch what actually happens. Read the logs. Look at the permissions. Try to inject bad instructions through a document or tool response. See where your assumptions fall apart.

Security cannot govern agentic AI from a distance. The teams that understand how these systems are built will be able to ask better questions, design better controls, and become useful partners instead of late-stage blockers.

The teams that do not will get pulled in later, after the agents are already working, already connected, already trusted, and already hard to unwind.

We have seen that movie before.

This time, the software can act on our behalf.

That should be enough reason to pay attention.
