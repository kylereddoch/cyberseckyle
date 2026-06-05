---
date: 2026-06-05T12:25:02-05:00
title: "Shadow AI Is the New Shadow IT, but Blocking It Won't Work"
seoTitle: Shadow AI Is the New Shadow IT, But Blocking Won't Work
description: Shadow AI is spreading because employees are trying to work faster. Blocking every tool will push usage deeper into the dark, so IT, security, and MSP teams need visibility, approved paths, data rules, and practical guardrails.
searchIntent: Help IT, cybersecurity, and MSP practitioners understand shadow AI risks and build a practical governance program that enables safe AI use instead of relying on blanket bans.
featuredImage: /assets/images/ai_robot_hero.jpg
featuredImageAlt: A futuristic AI robot with a glowing brain standing in front of digital network lines.
featuredImageCaption: "Shadow AI is not just an AI problem. It is a visibility, data, identity, and workflow problem."
tags: [cybersecurity, ai, IT, MSP]
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116698708143283118"
mastodon_tags: [Cybersecurity, InfoSec, AISecurity, ShadowAI, MSP]
---

Most shadow technology starts with somebody trying to get their job done.

That is the part I think security teams forget when this conversation gets too policy-heavy. A user finds a faster way to summarize meeting notes. A developer tries a coding assistant that helps with boilerplate. A sales team uses an AI writing tool to clean up follow-up emails. A manager pastes a messy spreadsheet into a chatbot because they need the answer before the next meeting.

From their side, this does not feel like rebellion. It feels like productivity.

From the security side, it can look like sensitive data moving into tools nobody reviewed, OAuth grants nobody approved, browser extensions nobody inventoried, and business processes quietly depending on AI systems nobody can monitor.

That is shadow AI.

And yes, it has a lot in common with shadow IT.

But I do not think the answer is to yell "no AI tools" into the void and hope employees suddenly become less curious, less busy, and less pressured to move faster. That is not going to happen. The business wants the productivity boost. Employees want the workflow help. Vendors are embedding AI into tools that were already approved. Blocking everything just pushes the behavior into personal accounts, unmanaged browsers, and side channels where security has even less visibility.

> Shadow AI is not a sign that employees hate security. It is usually a sign that the approved path is slower than the work.

That is the part we need to fix.

## Shadow AI is not just another tool problem

Shadow IT was already painful enough. Someone signed up for a SaaS app with a company email address, uploaded a spreadsheet, invited a few coworkers, and suddenly IT had another unofficial system to worry about. That was not great, but at least most shadow IT had a somewhat familiar shape: users, apps, files, permissions, billing, and maybe some SSO if you were lucky.

Shadow AI is messier because the tool may not only store data. It may transform it, summarize it, generate from it, connect to other apps, remember context, install as a browser extension, request OAuth scopes, or act through an agentic workflow.

That means the risk is not only "where did the data go?"

It is also:

- What data did the AI tool see?
- Did it receive customer information, source code, credentials, contracts, financial data, tickets, or internal strategy?
- Does the vendor use prompts or outputs for training by default?
- What retention controls exist?
- Which third-party app permissions were granted?
- Did the tool connect to Microsoft 365, Google Workspace, Slack, GitHub, Jira, or a file share?
- Is it running as a browser extension?
- Is it bundled inside a product we already approved?
- Can it take action, or only answer questions?
- Can we see logs?
- Can we revoke access?

That is a very different problem than "someone used an app without asking."

[The Hacker News article on managing shadow AI tools](https://thehackernews.com/2026/05/5-steps-to-managing-shadow-ai-tools.html) framed the issue in a practical way: employees are using AI writing assistants, coding copilots, browser tools, and meeting summarizers because they help people work faster, while security teams often lack visibility into the tools, OAuth connections, browser sessions, and data access behind them. The article also points out something MSPs and IT teams should take seriously: the official review process has to move fast enough that employees do not feel forced to work around it.

ReliaQuest makes a similar structural argument in its piece on how [software has a shadow AI problem](https://reliaquest.com/blog/shadow-ai-is-the-new-shadow-it/): policy alone will not solve this because AI adoption is moving faster than quarterly audits and manual enforcement. I think that is exactly right.

That is the real lesson.

If your AI approval process takes six weeks and the business problem is due Friday, people are going to solve the Friday problem.

## Blocking everything creates worse visibility

Blanket bans sound clean. They are easy to explain. They make policy documents look decisive.

They also fail in the real world.

If employees believe the only answer from IT is "no," they do not stop wanting the productivity gain. They just stop asking. That is how you end up with work happening in personal ChatGPT accounts, unmanaged browser sessions, consumer-grade tools, private Slack workspaces, unapproved extensions, and random SaaS trials paid for with a company card.

That is not safer. It is just quieter.

Security people need to be honest about incentives here. AI tools are useful. Not every use case is safe, but many are legitimate. If an employee wants help rewriting a public marketing paragraph, summarizing a vendor's public documentation, drafting a generic email, or brainstorming a project plan without sensitive data, that is not the same risk as pasting customer records, legal contracts, source code, or incident notes into an unknown tool.

Treating all of those use cases the same is how security loses credibility.

The better answer is not "everything is allowed" or "nothing is allowed."

The better answer is controlled enablement.

That means approved tools, plain-language rules, visibility into usage, clear data boundaries, and a fast way to review new requests.

## The browser is where this gets real

A lot of shadow AI happens in the browser, and that is why I keep coming back to browser security as a control point.

People do not need to install a traditional application anymore. They can open a web app, sign in with Google or Microsoft, approve an OAuth consent prompt, install a browser extension, and start moving data before the endpoint management stack sees anything useful.

That is exactly why I wrote that [secure browsers push zero trust past the login screen](/blog/secure-browsers-push-zero-trust-past-the-login-screen/). Modern work happens after the login prompt. Users are copying, pasting, uploading, exporting, sharing, and interacting with AI tools inside live browser sessions. If zero trust is supposed to follow the resource and the action, then the browser has to be part of the conversation.

For shadow AI, the browser gives you three big risk areas:

- **OAuth connections:** AI tools may request access to email, files, calendars, documents, source code, or workspace data.
- **Extensions:** AI browser extensions can read pages, inject content, summarize sensitive screens, or act in ways traditional software inventory misses.
- **Session-level data movement:** Users can paste or upload sensitive data without installing anything.

This is not a reason to turn the browser into a miserable locked-down experience for everyone. It is a reason to know which tools are being used, which permissions they have, and where sensitive workflows need tighter controls.

## Vendor promises matter, but they are not the whole answer

One of the first questions people ask is whether AI vendors train on business data.

That is a fair question. It should absolutely be part of the review.

For example, OpenAI says its [business data privacy commitments](https://openai.com/business-data/) mean it does not train models on ChatGPT Enterprise, ChatGPT Business, ChatGPT Edu, healthcare, teachers, or API data by default, and it describes encryption and retention controls for business customers. That kind of vendor-specific commitment matters. So do equivalent statements from Microsoft, Google, Anthropic, and every other AI provider a business wants to use.

But vendor promises are not the whole risk model.

Even if a vendor does not train on your data, you still need to care about:

- what users are allowed to enter
- what data the tool can retrieve through connectors
- how long data is retained
- who can view shared chats or generated outputs
- whether admin controls exist
- what logs are available
- whether DLP can inspect or block sensitive prompts
- whether the tool is approved for regulated data
- how access is revoked when a user leaves

This is where a lot of small businesses and MSP clients can get tripped up. They hear "enterprise AI" and assume the risk is solved. It is not solved. It is moved into a governed environment where you have better controls, contracts, and visibility.

That is still a huge improvement over employees using random consumer tools, but it does not remove the need for policy and monitoring.

## AI risk is not only privacy risk

Data privacy gets most of the attention because it is easy to understand. Do not paste sensitive data into random tools. That is a good rule.

But shadow AI also creates security risks that are more technical.

The [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) calls out risks like prompt injection, insecure output handling, sensitive information disclosure, insecure plugin design, excessive agency, overreliance, and supply chain vulnerabilities. Those risks matter even when the user is not intentionally doing anything reckless.

Prompt injection is a good example. If an AI tool reads untrusted content from a web page, email, document, ticket, or repository, that content may try to influence the model's behavior. If the tool only summarizes text, the blast radius may be limited. If the tool can access files, send messages, create tickets, query data, or run commands, the risk changes fast.

That is why I wrote in [my agentic AI piece](/blog/agentic-ai-is-securitys-next-blind-spot-because-it-can-act/) that the scary part is not that AI can write a better paragraph. The scary part is when AI can read, decide, click, call tools, remember context, and take action inside systems we already struggle to secure.

Shadow AI gets more serious when it becomes shadow agentic AI.

A user trying an unapproved summarizer is one level of risk. A developer wiring an unapproved agent into GitHub, Slack, Jira, and a local file system is another.

## AI adoption is a workflow signal

Here is the part I would want IT leaders and MSPs to sit with.

Shadow AI is feedback.

It tells you where people are overloaded, where processes are slow, where documentation is hard to search, where ticket writing is painful, where reporting is manual, where meetings create too much follow-up work, where developers are buried in boilerplate, and where employees think the official tooling does not meet the moment.

That does not mean every shadow tool should be allowed. It means the demand is telling you something useful.

If an entire department is using an unapproved AI note-taker, maybe they need an approved meeting summarization option with retention controls. If developers are using random coding assistants, maybe the business needs an approved AI-assisted development path with secure coding guidance, repository controls, and review expectations. If sales teams are using AI to draft client emails, maybe they need a safe content workflow that keeps customer data out of prompts.

This is the same point I made in [AI is not the reason an MSP succeeds](/blog/ai-is-not-the-reason-an-msp-succeeds-but-it-may-decide-which-ones-pull-ahead/): AI rewards teams that already have process discipline. If your intake process, access reviews, documentation, and data classification are a mess, AI will not magically fix that. It will amplify the mess.

> Shadow AI is not only a risk to contain. It is a map of where the business is trying to move faster than IT can support.

Use the map.

## What a practical shadow AI program looks like

I would not start with a 40-page AI policy.

Most organizations need a working program before they need a perfect document.

Here is the shape I would use.

### 1. Build the inventory

Start by finding what is actually in use.

Look at:

- OAuth app grants in Microsoft 365 and Google Workspace
- browser extensions
- DNS and proxy logs where available
- endpoint telemetry
- SaaS spend and credit card reports
- SSO app usage
- developer tools and IDE extensions
- GitHub/GitLab app integrations
- employee surveys
- department-level workflows

Do not frame the survey like a confession booth. Frame it like you are trying to help employees get approved tools that work.

Ask:

- What AI tools help you do your job?
- What do you use them for?
- What data do you put into them?
- Are they connected to company accounts?
- What approved tool would make this easier?

You will learn more from that than from a threatening policy email.

### 2. Define data rules people can remember

Data rules need to be simple enough to apply while someone is working.

A usable version might look like this:

- Public information can go into approved AI tools.
- Internal information can go into approved business AI tools if the use case is allowed.
- Customer data, employee data, financial data, legal documents, source code, credentials, incident details, and regulated data require specific approval.
- Secrets, passwords, tokens, API keys, private keys, and recovery codes never go into AI tools.

That is not the whole policy, but it is the part people can remember.

The detailed policy can map to NIST, legal requirements, contracts, and compliance needs. NIST's [AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) and its Generative AI Profile are useful anchors because they push organizations to identify AI-specific risks and align risk management actions with business priorities. But the employee-facing rule still has to be plain.

If people need a lawyer to interpret the AI policy, they will use the tool before they finish reading it.

### 3. Create an approved tool list

Employees should know where to go.

The approved list should include:

- approved AI tools
- approved use cases
- data categories allowed for each tool
- whether business data is used for training
- retention settings
- whether SSO is required
- owner and renewal date
- support path
- request path for new tools

This is where security can make the secure choice easier.

If someone asks, "Can I use AI to summarize meeting notes?" the answer should not require three weeks of Slack archaeology. The approved path should be obvious.

### 4. Build a fast review lane

Shadow AI grows when the official path is slow.

Not every AI request needs a full procurement and legal review. Some do, especially tools that process sensitive data, connect to business systems, or act on behalf of users. But lower-risk tools and use cases need a faster path.

Use a lightweight intake form that asks:

- What problem are you solving?
- What tool do you want to use?
- What data will it touch?
- Does it connect to company accounts?
- Does it use business data for model training?
- What permissions does it request?
- Who owns the workflow?
- Is there an approved tool that already does this?

Then define risk tiers.

Low-risk brainstorming with no sensitive data should not be reviewed the same way as an AI agent with access to source code, customer records, and ticketing systems.

### 5. Treat AI access like identity and third-party risk

Shadow AI is not only a user-awareness problem. It is an access problem.

Every approved AI tool should have an owner, a business purpose, scoped access, SSO where possible, logging, and a revocation process. OAuth app grants should be reviewed. Admin consent should be controlled. High-risk scopes should be restricted. Browser extensions should be allow-listed or at least monitored. Agents should not get broad permissions just because broad permissions make the demo easier.

[Microsoft's Build 2026 security post](https://www.microsoft.com/en-us/security/blog/2026/06/02/microsoft-build-2026-securing-code-agents-and-models-across-the-development-lifecycle/) is a useful signal here. Microsoft described agents as a new layer of the application stack and emphasized visibility, access control, governance, runtime protections, and data-loss controls across agent development and operations. The important takeaway is not "buy this Microsoft thing." The important takeaway is that the industry is moving toward AI and agent governance as a normal security control plane, not a side policy.

That is where MSPs should be heading too.

### 6. Use coaching, not only punishment

Training still matters, but quarterly training is too slow for a tool landscape that changes every week.

Employees need just-in-time guidance:

- "This tool is not approved for customer data."
- "This browser extension requests access to all pages you visit."
- "Use this approved alternative instead."
- "You can request a review here."
- "Do not paste source code or credentials into this tool."

That is much more useful than a vague annual reminder that "AI can be risky."

Good coaching explains the reason. If people understand that an OAuth grant can expose a whole mailbox or shared drive, they can apply that judgment to the next tool they encounter.

## What MSPs should do for clients

For MSPs, shadow AI is going to become one of those advisory areas that separates reactive providers from mature ones.

Clients are already using AI. Some know it. Some do not. Some think "we do not use AI" while employees are using AI tools every day through browsers, phones, SaaS features, and personal accounts.

The MSP opportunity is to make the invisible visible and turn panic into a manageable program.

I would start with a basic client package:

- AI usage discovery across OAuth apps, browser extensions, SaaS apps, and endpoint/browser signals
- approved tool and use-case matrix
- AI acceptable-use policy written in plain language
- data classification rules for AI prompts and uploads
- Microsoft 365 or Google Workspace OAuth review
- browser extension review
- admin consent controls
- DLP and sensitivity label alignment where available
- employee coaching material
- quarterly review of new tools and exceptions

This does not have to be huge. It just has to be real.

The goal is to move clients from "we hope nobody is pasting sensitive data into AI tools" to "we know what is approved, what is risky, and how new tools get reviewed."

## A practical starting plan

If you are trying to get this under control this month, here is where I would start.

1. **Inventory OAuth apps.** Look for AI tools, broad scopes, unused grants, and apps nobody owns.

2. **Review browser extensions.** AI extensions are easy to miss and can sit directly in the user's workflow.

3. **Publish an approved AI list.** Even if it starts with two tools and three use cases, give employees a path.

4. **Write the plain-language data rules.** Make it clear what can and cannot go into AI tools.

5. **Create a fast request form.** If employees need a new AI tool, give them a lightweight way to ask.

6. **Turn on SSO and admin controls.** Do not let business AI usage live entirely in unmanaged personal accounts.

7. **Audit training and retention settings.** Verify vendor settings instead of assuming the sales page matches your tenant configuration.

8. **Monitor the riskiest workflows.** Start with customer data, source code, legal, finance, HR, incident response, and admin workflows.

9. **Coach at the point of use.** A timely warning beats a policy nobody remembers.

10. **Review exceptions.** If people keep requesting the same blocked tool, figure out what need the approved stack is not meeting.

That last step matters. Sometimes the exception is the threat. Sometimes the exception is a product-management clue.

## Closing thoughts

Shadow AI is not going away.

The business pressure is too strong, the tools are too useful, and the barrier to adoption is too low. A user does not need a server, a purchase order, or a software install to start using AI. They need a browser tab and a problem to solve.

Security teams can either pretend a ban will hold, or they can build a program that matches how people actually work.

I know which one I would bet on.

Block the truly dangerous use cases. Restrict sensitive data. Review vendors. Control OAuth. Watch browser extensions. Govern agents. Use approved tools. Coach employees. Move fast enough that people do not feel like working around security is the only way to get their job done.

> The goal is not to make AI use disappear. The goal is to make safe AI use easier than shadow AI.

That is the difference between policy theater and a security program that can survive contact with real work.
