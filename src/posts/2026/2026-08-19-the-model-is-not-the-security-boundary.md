---
date: 2026-08-19T09:30:00-05:00
title: "The Model Is Not the Security Boundary: How to Secure AI Workflows"
seoTitle: How to Secure AI Workflows With Practical Controls
description: AI workflow security depends on the identities, data, tools, approvals, logs, and failure paths around the model. Here is how to build controls that still work when the model gets something wrong.
searchIntent: Help cybersecurity, IT, MSP, compliance, and engineering teams design practical security and audit controls for AI-powered and agentic workflows.
featuredImage: /assets/images/ai-workflow-security-boundary.png
featuredImageAlt: A secured AI workflow with data entering through filters, a contained hostile instruction, identity and tool checkpoints, human approval, and an audit trail before reaching a business system.
featuredImageCaption: "The model is only one component. The surrounding identity, tool, approval, and audit controls determine what the workflow can actually do. (Image generated using ChatGPT.)"
tags: [ai, cybersecurity, MSP, risk-management, security-operations]
---

Picture a fairly ordinary MSP automation project. The first version reads an incoming support ticket and produces a summary for the technician. It saves a little time, touches one source of information, and cannot change anything. Then the team connects it to the documentation platform so it can suggest a fix. Someone adds access to the RMM, then the ticketing system, then email. Before long, the same workflow can read a customer request, search internal documentation, choose a script, run it against an endpoint, update the ticket, and notify the customer.

Nothing in that progression sounds reckless by itself. Each addition solves a real problem, and each one makes the demonstration more impressive. Taken together, however, they create a privileged operator that receives instructions through natural language and works across several customer systems. The security question is no longer whether the model writes a good summary. It is whether the business has put reliable limits around what the complete workflow can see, decide, and do.

That distinction gets lost in a lot of conversations about AI security. Teams discuss model safety, prompt wording, or which provider performs best while paying less attention to the identities, APIs, retrieval systems, approval screens, logs, and operating procedures surrounding the model. Those components are not supporting details. They are where authority is granted and where a bad decision turns into a business action.

I have written before about why [agentic AI becomes an identity and access problem once it can act](/blog/agentic-ai-is-securitys-next-blind-spot-because-it-can-act/). This is the practical follow-up: what should a security team expect to find between a model proposing an action and a production system carrying it out?

The answer cannot be a stronger system prompt. Prompts are useful for describing a task and reinforcing expected behavior, but they are not dependable enforcement points for authorization, separation of duties, transaction limits, retention, or change control. Those protections have to exist in code, identity systems, policy engines, approval steps, and the applications receiving the request. When an instruction telling the model to behave is the only thing preventing damage, the workflow is not controlled in any meaningful security sense.

## An AI workflow is a chain of trust

The model is only one participant in a much larger process. A typical workflow may accept a request from a user, retrieve records from several systems, send selected information to a model provider, call one or more tools, store memory for later use, and pass an output into another application. Every handoff creates assumptions about which identity is acting, which data can be trusted, and how much authority should travel with the request.

The support-ticket example shows why that matters. A malicious instruction does not have to arrive through the chat box. It can be placed inside a ticket comment, attached PDF, copied log, web page, email, or knowledge-base article. If the model treats that content as part of its instructions and the workflow has access to powerful tools, prompt injection stops being an odd chatbot behavior and becomes a route to production systems.

The [OWASP Top 10 for Agentic Applications](https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/) reflects that broader view of the problem. Its risks include goal hijacking, tool misuse, identity and privilege abuse, supply-chain compromise, unexpected code execution, and memory poisoning. OWASP’s updated [Top 10 for LLM and generative AI applications](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/), released in August 2026, makes a similar point: the application around the model deserves as much scrutiny as the model itself.

That is a useful place to begin because it avoids a false choice between accidental failure and deliberate attack. A model may misunderstand a legitimate request, act on incomplete context, or select the wrong tool without anyone attacking it. An adversary may also manipulate the same weaknesses on purpose. The control design should assume both are possible and limit the consequences either way.

## Map the process that actually exists

Security cannot conduct a useful review of something described only as “the AI.” The team needs a data-flow diagram or an equally clear description of the complete process: what starts it, which systems it touches, what it remembers, whose authority it uses, and where information leaves the organization. This is basic architecture work, but it often gets skipped when a project moves quickly from a personal experiment to a departmental tool.

I would expect the workflow owner to identify every input that can influence the system, including users, customers, vendors, public websites, email, files, retrieved documents, and responses returned by tools. The review should also name the model and provider, each connector and API, the data stores involved, and any other agents that can receive or return work. It should be possible to follow the request from its original trigger to its final effect without filling gaps with phrases such as “the platform handles that.”

The same map should distinguish what the workflow can merely read from what it can change. A read-only lookup, a recommendation, a prepared draft, and an executed action are four different levels of authority even when the user experiences them through the same interface.

<table>
  <thead>
    <tr>
      <th scope="col">Capability</th>
      <th scope="col">Example</th>
      <th scope="col">Control expectation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Capability">Read</td>
      <td data-label="Example">Summarize an approved ticket or document</td>
      <td data-label="Control expectation">Scoped data access, tenant isolation, output filtering, and logging</td>
    </tr>
    <tr>
      <td data-label="Capability">Recommend</td>
      <td data-label="Example">Suggest a remediation or classify a request</td>
      <td data-label="Control expectation">Supporting evidence, visible uncertainty, and no direct execution path</td>
    </tr>
    <tr>
      <td data-label="Capability">Draft</td>
      <td data-label="Example">Prepare an email, script, firewall rule, or record change</td>
      <td data-label="Control expectation">Exact content or diff, named reviewer, and destination shown before approval</td>
    </tr>
    <tr>
      <td data-label="Capability">Act</td>
      <td data-label="Example">Send, delete, pay, disable, isolate, deploy, or change access</td>
      <td data-label="Control expectation">Deterministic authorization, narrow identity, approval at the point of impact, limits, and recovery</td>
    </tr>
  </tbody>
</table>

The risk changes each time a project moves down that table. Unfortunately, the security review does not always change with it. A read-only pilot gets approved, someone later adds a write-capable connector, and a broad service account is used because the narrower role is inconvenient. Human review is eventually removed because people approve nearly every request anyway. Six months later, the production service bears little resemblance to the system that was originally assessed.

Moving from reading to recommending, drafting, or acting should trigger a fresh look at permissions, data handling, approval, logging, testing, and recovery. The [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) calls for organizations to govern, map, measure, and manage AI risk. The mapping work is particularly important here because no team can choose proportionate controls without understanding the people, data, dependencies, and potential impact involved. The [joint NCSC and CISA guidance for secure AI system development](https://www.ncsc.gov.uk/collection/guidelines-secure-ai-system-development) carries that responsibility across secure design, development, deployment, operation, and maintenance. A successful demonstration covers only a small part of that lifecycle.

## Authority should become narrower, not broader

An AI workflow should have its own identity wherever the platform makes that possible. It should not quietly inherit every permission held by the person using it, and it should not share one permanent API key with unrelated automations. A distinct non-human identity gives the organization a place to apply policy, review access, detect unusual behavior, and revoke the workflow without disrupting everything else.

That identity needs a named business owner and technical owner, a documented purpose, and access limited to the systems and actions required for that purpose. Development, testing, and production should not use the same credentials. Short-lived credentials are preferable to permanent secrets, and the normal identity lifecycle still applies: issuance, rotation, periodic review, expiration, and revocation. For MSPs and other multi-tenant operators, the identity and its accessible data should also be separated by customer wherever possible. One agent carrying context or authority across tenants is an efficiency gain with an ugly failure mode.

NIST’s 2026 [concept paper on software and AI agent identity and authorization](https://csrc.nist.gov/pubs/other/2026/02/05/accelerating-the-adoption-of-software-and-ai-agent/ipd) lays out the unresolved questions clearly. How does an agent prove its authority? How should delegated “on behalf of” access work? How is the agent’s identity bound to a human approval? What would make its actions auditable and difficult to repudiate later? The standards work is still developing, but organizations do not need to wait before applying the underlying principles of distinct identity, least privilege, lifecycle management, and traceability.

Authorization also has to be enforced outside the model. If a workflow requests that an account be disabled, the identity platform or a trusted policy layer should decide whether that agent can disable that particular account, in that tenant, under the current conditions. A system-prompt rule telling the model never to disable administrators is not an access control. The model should be allowed to propose intent, while deterministic software decides whether the request is permitted.

The same discipline applies to tools. An agent that needs device health information should not receive a general-purpose remote shell. A workflow that drafts a customer response does not need permission to send it, and one that searches a knowledge base should not be able to rewrite the material it retrieves. Narrow functions such as `collect_disk_status(device_id)` are easier to validate and monitor than an open-ended `run_command(command)` interface.

The [OWASP guidance on excessive agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) separates the problem into excessive functionality, excessive permissions, and excessive autonomy. That distinction is valuable because a team can reduce one and still leave the other two untouched. Removing a tool from the model’s menu does little if the credential remains active elsewhere. Adding an approval prompt does not solve the problem when the underlying API is still callable without it.

At the tool boundary, I would expect to find an allowlist of callable functions, strict input schemas, server-side validation, and checks on the target resource and tenant. Rate, transaction, time, and cost limits should constrain abuse and runaway behavior. Repeated actions need idempotency protection, network access should be limited to expected destinations, and tool output should be bounded so a single request cannot pour an entire database into the model’s context. General-purpose code execution deserves special skepticism. Sometimes it is necessary, but it should never be the default simply because it makes the agent more flexible.

## Prompt injection is an access-control problem

Language models do not observe the clean distinction between instructions and data that traditional software architects would like them to observe. An email is data to the mail system, a support note is data to the RMM, and a website is data to a research tool. Once those sources enter a model’s context, however, their text can influence its next decision. That is why indirect prompt injection can arrive through documents, HTML, images, tool responses, calendar invites, repository files, or anything else the workflow reads.

There are useful defensive techniques at the model and application layers. Instructions, retrieved content, and tool results should be kept structurally separate. Sensitive workflows can restrict retrieval to approved sources, record the source and version of the material used, isolate customer indexes, and pass only necessary fields into the model. Files should be scanned and parsed in a constrained service, and content retrieved during a task should never be allowed to grant new permissions or silently introduce new tools.

Those measures reduce exposure, but they do not turn hostile natural language into safe natural language with certainty. The more important design question is what happens after the model follows a malicious instruction. Can it reach another tenant? Can it disclose an entire mailbox? Can it call a write-capable administrative function? Can it send information to an arbitrary destination? The answers should remain narrow even when the model’s reasoning has been compromised.

This is also why the system prompt cannot be treated as confidential policy. OWASP’s guidance on [system prompt leakage](https://genai.owasp.org/llmrisk/llm072025-system-prompt-leakage/) explains that the real problem is not merely whether someone discovers the prompt. The larger failure occurs when secrets are stored in it or when an application relies on prompt text instead of strong session and authorization controls. Assume users and attackers will learn the broad outlines of the instructions and design the rest of the system so that knowledge does not give them additional authority.

Testing should reflect the number of ways untrusted content can enter the workflow. A security review that tries a few hostile phrases in the main prompt has tested the interface, not the system. Put malicious instructions in a ticket comment, PDF, image, email, web page, retrieved article, and tool response. Then observe which tools the workflow selects, what information it assembles, what leaves the environment, and which independent controls intervene before an action occurs.

## Human review has to reveal the consequence

“Human in the loop” has become one of those phrases that can make an architecture sound safer without telling us much about how it works. The quality of the control depends on what the reviewer can see, when the review occurs, and whether that person has a realistic opportunity to stop the action.

An approval screen labeled **Approve plan** is weak when it hides the actual recipient, target system, command, permission, record change, or data being disclosed. The reviewer should see the precise action wherever practical, the system and tenant affected, the evidence used to reach the recommendation, and whether the result can be reversed. If information will leave the organization, the destination and the data involved should be visible before approval.

Timing matters too. Approval should occur immediately before the high-impact step rather than at the beginning of a long process whose target or parameters may later change. A prior approval should expire when the proposed action changes. The person reviewing it needs the competence and authority to challenge the recommendation, enough time to examine the evidence, and a clear way to reject or interrupt the workflow without being punished for slowing it down.

A queue containing hundreds of low-context approvals is not meaningful oversight. It is more likely to train people to click through the queue and trust the system’s confidence. That makes independent sampling important even when the recorded approval rate looks excellent. A low rejection rate can indicate good performance, but it can also reveal automation bias or a review process that exists mainly for appearance.

The threshold should rise with the consequence. Financial transactions, legal commitments, employment decisions, access changes, security configuration, regulated-data disclosure, public communication, code deployment, and destructive operations need a higher level of review. Some uses should remain outside the agent’s authority altogether. That is a business risk decision, not something the model should infer from the tone of a request.

## Model output should enter the application as untrusted data

Generated output often looks polished enough to invite trust, especially when it includes a plausible explanation. Downstream systems should still handle it as untrusted input. Text produced by a model should not flow directly into a shell, SQL engine, browser action, ticket command, or administrative API.

Structured output with a defined schema makes enforcement easier. Every field should be validated, unexpected values rejected, and data encoded for its destination. A proposed firewall change, for example, can be checked against approved rule types, source and destination ranges, target environment, change window, requester authority, and current approval state. An email workflow can verify the destination and attachment policy before presenting the final send action. AI-generated code should pass through the same review, test, and deployment process as code written by a person.

These are familiar application-security controls, which is precisely why they are useful. The model’s output may be probabilistic, but the surrounding software can still enforce predictable rules. Treating the model as one untrusted component in an otherwise well-designed application is a healthier approach than trying to make the entire system depend on the model always interpreting the policy correctly.

## Data governance follows the whole route

An AI connector should not retrieve the complete customer record because it happens to have access to it. The workflow should send the minimum fields required for the task, remove secrets and unnecessary identifiers before model access, and separate retrieval indexes by sensitivity and tenant. Persistent memory deserves its own rules covering what may be stored, who can inspect it, how long it survives, and how it is cleared. Long-lived context can be useful, but it can also preserve sensitive data or poisoned instructions beyond the session in which they first appeared.

Vendor review has to extend beyond the common question of whether a provider trains on customer data. That question matters, but so do retention, abuse-monitoring records, administrative access, deletion behavior, processing locations, subprocessors, encryption, isolation, and change notification. The organization should know whether training is disabled through a binding contract, a tenant setting, or a general policy statement. It should also know whether the logs required for an investigation will remain available after an incident or when the contract ends.

NIST’s [Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) treats data privacy, information integrity, information security, and value-chain integration as related risks rather than separate review exercises. That matches how these workflows operate. Information may travel through the user interface, an orchestration service, a retrieval database, a model provider, a tool vendor, and a downstream business application during one request. Focusing on the model provider alone leaves most of that route unexamined.

The same consideration applies to logs. Recording everything forever is not a responsible way to create auditability. Logs can contain prompts, retrieved records, tool parameters, customer information, and model outputs, so they need access controls, integrity protection, data minimization, and a retention schedule of their own. Sensitive values can often be redacted or replaced with stable references without making the event impossible to investigate.

## The audit trail should reconstruct a bad day

When a workflow sends the wrong message, changes the wrong account, exposes information, or runs an unsafe remediation, a chat transcript will not be enough. Investigators need to connect the original request to the data retrieved, the model and policy versions involved, the identity used, the tools called, the approval shown to the reviewer, and the action that finally occurred.

A useful record includes the triggering event and requesting user; the workflow, prompt, model, policy, and tool versions; the agent and downstream identities; the identifiers of retrieved documents or records; and each consequential tool call with its target, important parameters, and result. It should also capture blocked actions, warnings, exceptions, approval and rejection decisions, retries, timeouts, partial failures, rollbacks, and the result of any post-action verification.

This is where security and compliance should be working from the same evidence. The fields that help an auditor confirm that approval and access controls operated are often the same fields incident responders need when those controls fail. Building that record into normal operation is far more defensible than trying to reconstruct it from screenshots and employee recollection after the fact.

## Reliable automation still matters

Not every serious AI workflow failure begins with an attacker. A model can time out after a downstream action succeeds, causing a retry that creates a duplicate payment or ticket. A connector can return stale information. A partial outage can leave several systems disagreeing about whether a job completed. A reviewer may approve an old preview after the underlying target has changed. A model update may alter tool selection, or a workflow may enter a loop and consume an alarming amount of API capacity overnight.

These are familiar automation problems, and the protections are familiar as well. Idempotency keys and duplicate checks help make retries safe. Retries should be bounded and use backoff rather than continuing indefinitely. Transaction, time, token, and cost limits can stop a single task from becoming a larger operational problem. Circuit breakers can pause execution when error rates or action volumes depart from the expected range.

The workflow should stop visibly when required context is missing instead of guessing its way through the task. High-impact actions need post-execution verification, and reversible changes need a tested rollback or compensating action. A kill switch is valuable only if the operating team knows where it is, has permission to use it, and has tested it during an active run. The underlying business process also needs a manual fallback so that disabling the AI service does not disable the business.

This kind of failure planning rarely appears in a polished product demonstration, but it determines whether the workflow can be trusted on an ordinary bad Tuesday. Safe automation is not only about making the correct decision. It is about containing incomplete, repeated, delayed, or contradictory work without leaving the organization in a state nobody can explain.

## Test the service, not a collection of prompts

Preproduction testing should resemble an abuse-case review and an operational rehearsal rather than a demonstration of the happy path. Direct prompt injection is one test, but the team should also place malicious instructions in every external source the workflow can read. It should test missing and contradictory context, malformed tool responses, expired credentials, duplicate execution, another tenant’s data, a rejected or delayed approval, unavailable logging, and shutdown during an active run.

The first production phase should be deliberately limited. Shadow mode allows the system to make recommendations without acting, giving the team a chance to compare its output with real human decisions. A small user group and low-impact scope make early failures easier to study. Canary tests can continuously verify that forbidden actions remain forbidden, while monitoring should look at overrides, unusual tool calls, cross-tenant access attempts, failures, latency, and cost.

Independent review still matters after the workflow appears stable. If nobody challenges a recommendation, that may mean the model is performing well, or it may mean reviewers have learned to trust it without checking. Sampling completed decisions and tracing them back through the evidence gives the organization a better measure of whether the control is working.

Change management also needs a wider definition. Model changes matter, but so do changes to prompts, tools, connectors, retrieval sources, permissions, safety policies, and approval interfaces. The model can remain untouched while a new write-capable function completely changes the risk. The service should be reassessed when its authority or information sources change, not only when the model version does.

## Compliance should produce evidence, not logos

Adding the names of NIST, ISO, SOC 2, GDPR, HIPAA, or the EU AI Act to an architecture slide does not make an AI workflow compliant. Frameworks and laws describe obligations and desired outcomes; the organization still has to translate them into controls that operate in the actual service and records that show what happened.

[ISO/IEC 42001](https://www.iso.org/standard/42001) provides a management-system structure for governing AI risk and continual improvement, while the NIST AI RMF offers a flexible way to organize risk work. The EU AI Act uses a risk-based legal model and, for covered high-risk systems, addresses areas that include risk management, documentation, logging, human oversight, accuracy, robustness, and cybersecurity. The [European Commission’s current AI Act overview](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) is worth checking because the applicable duties and dates depend on the organization’s role and use case.

_This is general security and governance guidance, not legal advice. Regulatory scope should be reviewed with qualified counsel for the organization’s jurisdictions and uses._

In practice, a defensible control package should connect each objective to evidence created during normal operation.

<table>
  <thead>
    <tr>
      <th scope="col">Control objective</th>
      <th scope="col">Evidence I would expect</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Control objective">Ownership and approved purpose</td>
      <td data-label="Evidence I would expect">Named owner, use-case record, intended users, prohibited uses, and review date</td>
    </tr>
    <tr>
      <td data-label="Control objective">Risk and impact assessment</td>
      <td data-label="Evidence I would expect">Data-flow diagram, threat model, data classification, affected people, and legal review where required</td>
    </tr>
    <tr>
      <td data-label="Control objective">Access control</td>
      <td data-label="Evidence I would expect">Agent identity, permissions, tool inventory, credential lifecycle, and access-review results</td>
    </tr>
    <tr>
      <td data-label="Control objective">Human oversight</td>
      <td data-label="Evidence I would expect">Approval rules, reviewer roles, interface records, approval and rejection logs, and stop procedure</td>
    </tr>
    <tr>
      <td data-label="Control objective">Data governance</td>
      <td data-label="Evidence I would expect">Allowed data classes, minimization rules, retention, deletion, vendor terms, and subprocessor review</td>
    </tr>
    <tr>
      <td data-label="Control objective">Testing and assurance</td>
      <td data-label="Evidence I would expect">Evaluation set, adversarial and failure tests, acceptance thresholds, and remediation records</td>
    </tr>
    <tr>
      <td data-label="Control objective">Traceability</td>
      <td data-label="Evidence I would expect">Versioned records connecting request, retrieval, model, tools, approval, action, and outcome</td>
    </tr>
    <tr>
      <td data-label="Control objective">Ongoing monitoring</td>
      <td data-label="Evidence I would expect">Alerts, override reviews, incident metrics, change records, and periodic reassessment</td>
    </tr>
  </tbody>
</table>

A policy approved once and a screenshot captured before an audit do not demonstrate that the control kept working. Evidence should be produced by the process itself, protected against unauthorized changes, and reviewed often enough to catch drift between the approved design and the service people are actually using.

## A production review should end with clear answers

Before giving an AI workflow authority in a real environment, I would bring the business owner, engineering, security, privacy or legal, and the operating team into the same review. The conversation should establish whether everyone can describe the business purpose without hiding behind “AI-powered,” identify every data source and external destination, and explain the difference between what the workflow reads, recommends, drafts, and executes.

The team should be able to show that permissions are enforced at the point of action rather than inside the model, that untrusted content has been tested through every route it can enter, and that a reviewer sees the actual consequence of a high-impact action. They should know how to reconstruct an event without retaining secrets forever, how duplicates and partial failures are contained, and how to stop the service and revoke its credentials immediately.

There should also be a credible answer for recovery. Can the action be reversed? Can the business continue manually? Will a change to the model, prompt, connector, retrieval source, permission, or tool trigger another assessment? Most importantly, does a named person remain responsible for the workflow after launch, or will it slowly become another unattended service account with a conversational interface?

If several of those answers amount to “we think the platform handles it,” the system is still a pilot. That is not a criticism of the idea. It is an honest description of how much control has been demonstrated.

## Security has to survive the model being wrong

AI workflows can remove real operational drag. They can help small teams work through repetitive tasks, bring information together more quickly, and make complicated systems easier to use. Those are worthwhile benefits, and security teams will not contribute much by pretending otherwise.

The mistake is treating a useful demonstration as proof that a production service is ready. Calling a tool is the easy part. The harder work is making sure a poisoned document, wrong record, overprivileged identity, stale approval, confused tenant, repeated request, or failed connector cannot turn one bad model decision into a larger incident.

That work looks less novel than the technology. It depends on inventory, identity, least privilege, separation of duties, input validation, data minimization, logging, testing, incident response, and change control. Those practices have survived several generations of supposedly transformative technology because they address the way systems fail in the real world.

The model will sometimes be wrong. Attackers will try to steer it, integrations will change, and people will trust it more as it becomes familiar. A secure AI workflow is one designed so that none of those predictable facts has to become a crisis.
