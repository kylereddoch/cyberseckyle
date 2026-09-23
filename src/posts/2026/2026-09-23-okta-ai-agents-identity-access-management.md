---
date: 2026-09-23T09:30:00-05:00
title: Okta's AI Agent Push Puts IAM to a Harder Test
seoTitle: "Okta and AI Agent Security: What IAM Can Actually Control"
description: Okta is extending identity controls to AI agents. The security gains are real, but delegated access, valid credentials, and an off switch each have limits worth testing.
searchIntent: Explain how identity and access management can secure AI agents, where Okta's approach helps, and which runtime, delegation, and containment risks still require other controls.
featuredImage: /assets/images/okta-ai-agents-announcement.png
featuredImageAlt: Okta's AI Agents product illustration showing registered agents, their status and owners, permission scopes, connected resources, and active issues.
featuredImageCaption: 'Official Okta for AI Agents announcement graphic. Source: <a href="https://www.okta.com/newsroom/press-releases/ai-innovations-oktane-2026/">Okta</a>; used for editorial identification.'
tags: [cybersecurity, ai, risk-management, security-operations]
social:
  post_to: [mastodon, x, linkedin]
  tags: [Cybersecurity, IAM, AISecurity, MSP]
  status:
    mastodon: |-
      I took a closer look at Okta's approach to AI agent security: delegated access, policy checks on tool calls, and what actually stops when an agent's access is revoked.

      The IAM case is worth taking seriously. So are the limits of each control.

      {url}

      #Cybersecurity #IAM #AISecurity
    x: |-
      An AI agent can use valid credentials and still make the wrong change. My look at Okta's approach, IAM's strengths, and the gaps worth testing.

      {url}

      #IAM #AISecurity
    linkedin: |-
      Okta's push into AI agent security raises a practical question for IT and security teams: how much control does an agent identity actually give us?

      There is a strong case for distinct identities, scoped credentials, access reviews, and policy enforcement on tool calls. But an allowed operation can still be wrong for the task, and revoking access may not stop work already accepted by another system.

      I examined the benefits and limits through an MSP workflow, including delegation, customer isolation, gateway bypasses, and the tests I would require before granting an agent access to client systems. The article also separates available Okta capabilities from announced plans.

      {url}

      #Cybersecurity #IAM #AISecurity #MSP
  posts: {mastodon: {url: https://infosec.exchange/@cyberseckyle/117320874831548510}, x: {url: https://twitter.com/thecyberseckyle/status/2102770304510538027, buffer_id: 6ab3e51228ee7c1854c6a5be}, linkedin: {url: https://www.linkedin.com/feed/update/urn:li:share:7508536092732858368, buffer_id: 6ab3e514d1d84858efc8e8b3}}
publishedAt: "2026-09-23T14:41:21.689Z"
---

An AI agent can use a valid credential, call an approved tool, and still make a change the business never intended. That is the problem I kept coming back to while reading [Maria Korolov's CSO analysis of Okta's push into AI agent security](https://www.csoonline.com/article/4225230/okta-bets-on-identity-to-control-ai-agents-but-is-identity-alone-enough.html).

The identity argument interests me because agents need access to be useful. An assistant that can investigate a support ticket, retrieve documentation, or change an account has to authenticate somewhere. Someone has to decide which resources it can reach, whose authority it carries, and how that access ends. Identity and access management, or IAM, already handles much of that work for people and software.

Extending those controls to agents makes sense. The harder question is how much protection they provide once the agent is authenticated and working inside its permissions.

I have written about [the controls surrounding an AI workflow](/blog/the-model-is-not-the-security-boundary-how-to-secure-ai-workflows/) before. Okta's announcements make that discussion more concrete: identity vendors are moving into the path between an agent deciding to do something and a business system carrying it out. There is considerable security value there, provided we are precise about what gets enforced and what remains somebody else's responsibility.

## Okta is proposing more than an agent login

Okta's [September 22 announcement](https://www.okta.com/newsroom/press-releases/ai-innovations-oktane-2026/) describes Agent SSO, policies for agent-to-agent connections, access reviews, and an Agent Gateway intended to enforce policy and record tool calls during execution. It also describes an expanded kill switch for access through that gateway.

The release status matters. In that announcement, Agent SSO, Agent-to-Agent Connections, and Resource Access Certifications are generally available. Agent Gateway and endpoint discovery are planned for Q3; Configuration Designer and the expanded runtime kill switch are planned for Q4. Those are the vendor's stated release windows, not a claim that every capability is available in a customer's environment today.

The [Agent Gateway description](https://www.okta.com/blog/product-innovation/agent-gateway-runtime-governance/) explains the more interesting architectural change. Okta says the gateway can broker credentials, restrict which tools an agent uses, and attribute calls to a managed identity while keeping downstream credentials away from the agent. That places an enforcement point in the request path, where an attempted action can be evaluated before it reaches a tool.

That deserves a fair assessment. Reducing this proposal to authentication would miss its strongest security argument. IAM includes authorization, access lifecycle management, and governance. With the right integrations, those controls can stop actions, narrow permissions, and remove access. The question is whether the rules are specific enough, whether every relevant request encounters them, and whether the receiving application enforces its own boundaries.

This is an assessment of the published design and documentation. I have not tested Okta's agent platform, and an announced capability should not be treated as a verified result.

## The strongest case for IAM starts with credentials

Consider a hypothetical support assistant configured with a technician's personal API token. The assistant inherits whatever access that token carries. If the token spans multiple customers or permits administrative changes, a routine ticket task now has those capabilities available to it.

A separate agent identity gives the organization something it can govern independently. The assistant can have a defined owner, purpose, environment, and access policy. It can be disabled without disabling the technician's account or breaking unrelated automations that happen to share the same secret.

An identity record alone does not create those protections. Administrators still have to configure the permissions and connect the systems that enforce them. But it creates a practical place to do that work and a record against which to review it.

Credential brokering can also reduce exposure. A model asked to summarize a ticket has no reason to receive the underlying service credential in its context. A trusted component can obtain the credential and use it for an approved request. Short-lived, narrowly scoped tokens reduce the time and resources available to someone who steals one, although theft during its valid lifetime still matters.

There is a legacy constraint worth acknowledging. Okta's [resource connection documentation](https://help.okta.com/oie/en-us/content/topics/ai-agents/ai-agent-secure.htm) includes vaulted static secrets and service accounts alongside OAuth-based connections. Putting an old credential behind a broker can improve storage and control over retrieval. It does not change the downstream application's permission model or automatically turn that credential into something short-lived.

For a smaller business, this is where the IAM case can be strongest. Bringing an agent into an existing access-review and offboarding process is a meaningful improvement over leaving its credentials in a configuration file nobody owns. It gives security staff a chance to find an abandoned workflow before they discover it during an incident.

## A legitimate identity can carry out an illegitimate request

Authentication establishes confidence in an identity. Authorization decides whether that identity may perform an operation under the policy being enforced. Neither automatically establishes that the operation is appropriate for the business task that prompted it.

Imagine an MSP agent authorized to prepare a maintenance report for one customer and attach it to that customer's ticket. A malicious instruction appears in diagnostic text the agent reads. It tells the agent to include an internal recovery document in the attachment because the document is supposedly required for the investigation.

Assume the agent can read that document and attach files to the ticket. The identities can all be correct. The customer can be correct. The tool calls can be permitted. The disclosure can still be wrong because the read permission and attachment permission were never meant to authorize that combination.

This example illustrates the gap between an allowed operation and an allowed use of information. A policy that permits attaching files needs more context if the business rule is that only approved report content may leave the internal documentation system. Classification, document-level access, an approved export path, or review of the actual attachment may be necessary.

The UK's NCSC explains the underlying problem in its [analysis of prompt injection](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection): language models do not enforce a dependable separation between instructions and untrusted material inside a prompt. That makes it possible to steer a privileged assistant through content it was only supposed to read.

IAM can reduce the damage by denying access to the recovery document in the first place. An application can reject an attachment that violates its disclosure policy. Those are concrete protections. A successful login, by itself, says nothing about whether the document belonged in the report.

The same failure can happen without an attacker. An agent may misunderstand the task or select the wrong record. Security design has to account for mistakes made through authorized access as well as attempts to obtain unauthorized access.

## Delegation needs to survive every handoff

Agent identities become more complicated when an assistant acts for a person and then asks another agent to finish part of the job.

There are at least three distinct questions: who initiated the request, which agent is acting, and what authority was delegated for this task. A record showing that a user authenticated cannot answer all three. A technician who can administer twenty customer environments may have asked for a report about one workstation in one environment.

In that case, I would want the delegated authority limited to the specific job. The technician's wider privileges should not become the assistant's default permissions. If the assistant invokes a second agent, that handoff should preserve or narrow the original limits. Any expansion needs a separate authorization decision.

Existing standards provide useful building blocks. [OAuth 2.0 Token Exchange, RFC 8693](https://www.rfc-editor.org/rfc/rfc8693.html#section-4.1), defines an actor claim that can represent delegation, including nested actors. Those prior actors provide history; the specification does not make them inputs to the receiving service's access decision. Carrying a delegation trail and enforcing the permissions for a delegated task are separate responsibilities.

The application still has to verify that the delegated request applies to this resource, this customer, and this operation. Otherwise, a narrow front-end assistant can become a route into a much more powerful back-end service.

This is also why passing the same bearer token through every component is a poor substitute for deliberate delegation. The [MCP security guidance](https://modelcontextprotocol.io/docs/draft/tutorials/security/security_best_practices) warns against token passthrough and requires validation that a token was intended for the receiving server. A token issued for one service should not become a reusable credential for unrelated services merely because they sit in the same workflow.

Some agents run scheduled work without an active human session. Those need an explicitly approved workload identity and a responsible owner, rather than a fictional record suggesting a person approved each execution. Attribution should describe the authority that actually existed.

## A gateway is only as strong as the paths it controls

A policy decision on every tool call is valuable. It gives defenders an opportunity to reject a request before execution and record which rule allowed or denied it. The scope of that decision still needs examination.

Okta's [resource comparison](https://help.okta.com/oie/en-us/content/topics/ai-agents/ai-agent-resource-comparison.htm) describes gateway controls in terms of policies, scopes, and tools. For a procurement review, I would want to see how that translates into the actual application: can the policy distinguish a safe operation from a dangerous one inside the same tool?

An agent permitted to use an RMM connector might need to read device health but have no legitimate reason to launch a remote shell. Even a permitted maintenance function needs restrictions on its target devices and arguments. Allowing a tool named `run_command` provides very little assurance about what the command will do.

[OWASP's excessive-agency guidance](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) separates excessive functionality, permissions, and autonomy. Its recommendations include narrowly defined tools, minimum downstream permissions, and authorization checks outside the model. That is a useful way to evaluate a gateway: controlling which connector is reachable addresses only part of the problem if the connector itself exposes broad powers.

The receiving application also needs to enforce resource and tenant boundaries. For an MSP, a customer identifier supplied by the model should not determine which customer's authority applies. Trusted session and policy data should establish that boundary, and the application should reject mismatched resources even when the request arrives through an approved gateway.

{% image "/assets/images/okta-ai-agent-identity-access.png", "Four abstract software agents with distinct identity badges approach access gates; three illuminated paths lead to separate data compartments while an amber path is blocked.", "Identity and access controls limit which resources an agent can reach. Conceptual illustration generated using ChatGPT; not an Okta product diagram.", "lazy", "text-center", "", [650, 960, 1400], "(min-width:30em) 90vw, 100vw", ['webp', 'jpeg'] %}

Bypass paths deserve equal attention. If the agent can reach the same service directly with an old API key, the gateway is optional in practice. If it can open an authenticated browser or execute code under a broadly privileged operating-system account, its effective access may extend well beyond the registered connectors.

That means inventory has to cover credentials, browser sessions, local tools, and outbound connections. An accurate directory of agents is useful, but it cannot stand in for an examination of what those agents can actually reach.

## An off switch needs a measured stopping point

Okta's September announcement distinguishes deactivation that blocks new sessions from its planned expansion of the kill switch to active gateway access. That is a consequential distinction for incident response.

Blocking a new login, revoking an issued token, terminating a session, and canceling a job already accepted by a downstream application are different operations. A product may perform some of them without performing all of them.

The [OAuth token revocation specification](https://www.rfc-editor.org/rfc/rfc7009.html) acknowledges propagation delays and discusses the implementation work needed to support immediate revocation of self-contained tokens. Token expiration helps bound access, but the actual stopping time depends on how the receiving service learns that access has been withdrawn.

For an agent workflow, I would test that stopping time while work is underway. Start a harmless batch in a test environment, deactivate the agent, and observe what happens to subsequent calls, issued credentials, and work already queued. Check the downstream system's records as well as the identity platform's event log.

The distinction matters even when revocation works perfectly. Stopping access cannot retract information already disclosed or undo an account change already completed. Response procedures still need to establish what happened, preserve evidence, and repair the resulting state.

A useful shutdown control has a documented reach and a tested delay, so responders know which systems still require separate containment.

## Central control introduces operational tradeoffs

Putting policy enforcement in the request path creates a dependency. A service outage, bad policy change, or unavailable connector can interrupt legitimate work. Allowing requests to continue without a valid decision may preserve availability while weakening the protection the organization bought.

I would decide failure behavior per workflow. Privileged changes should stop when their authorization cannot be established. A low-risk reporting task might tolerate a delay or a limited mode. Emergency access needs its own protected, logged process, with permission to use it assigned in advance. Quietly restoring a permanent administrator token when the gateway is unavailable defeats the architecture.

Centralization also concentrates administrative power. Whoever can register agents, alter their connections, and relax policy can potentially change the reach of many workflows. Protecting that administrative access, separating duties, and reviewing policy changes become part of securing the agents themselves.

There is a maintenance cost, too. Every added tool, resource, or delegation path may change what an agent can accomplish. A review process designed around quarterly employee access certifications may miss several changes to an agent's capabilities between reviews. Teams need a way to reassess access when the workflow changes, without turning every harmless update into a queue nobody can clear.

Logging introduces another tradeoff. Investigators need agent, user or workload, customer, tool, target, policy decision, approval, and result information. Recording every raw prompt and response can also duplicate sensitive customer data into a second system. Log access, redaction, retention, and separation between customers deserve deliberate decisions. More telemetry is useful only if the organization can protect and interpret it.

These costs do not negate the benefit of IAM. They belong in the comparison with the current process. Replacing unmanaged credentials and inconsistent controls may be well worth the integration work. Buying a new platform while leaving broad permissions and unclear ownership intact is a much weaker proposition.

## What I would require before an MSP rollout

For an MSP, I would evaluate this against one ordinary customer workflow before expanding it. A maintenance-report assistant is a useful starting point because its intended access and output can be defined without granting general administration rights.

The acceptance tests should establish what is refused as well as what succeeds:

- Give the agent a valid customer A task and a customer B resource identifier. The receiving service should reject the mismatch.
- Place a misleading instruction in retrieved diagnostic text. Check whether the agent can disclose an internal document or obtain an unapproved capability, even if the model follows the instruction.
- Have a second agent request broader access than the original task allows. Require a separate authorization decision before granting it.
- Attempt the same request outside the gateway. Verify that an alternate credential or session cannot bypass the intended controls.
- Remove access during a running task and measure the stopping behavior across the connected systems.

For higher-impact work, approval should identify the exact action, targets, and relevant content. If those details change after approval, the authorization should no longer apply. A general request to fix a problem should not silently authorize every action the agent later decides would help.

These are tests I would require, not results I am claiming for Okta or any other vendor. They turn a broad security promise into evidence an MSP can use when deciding what access to grant.

I would be comfortable approving a limited workflow while refusing a more powerful one on the same identity platform. A report assistant and an agent allowed to change production infrastructure do not become equally acceptable because they share an IAM product. The useful outcome of this work is being able to explain why a particular workflow has enough protection to proceed, where its remaining risk sits, and which additional capability would require another review. That gives an MSP a defensible basis for expanding automation without treating the purchase of an identity platform as blanket permission to connect everything.
