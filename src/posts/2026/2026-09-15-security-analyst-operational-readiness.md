---
date: 2026-09-15T12:57:44-05:00
title: "A Certification Does Not Make a Security Analyst Incident-Ready"
seoTitle: How to Prepare Security Analysts for Real-World SOC Work
description: Technical training can get an analyst into an investigation. Operational readiness is what helps them navigate ambiguity, business impact, escalation, communication, and the decisions that follow.
searchIntent: Explain how security leaders can prepare analysts for real-world SOC and incident response work through business context, exercises, coaching, cross-functional exposure, and responsible AI use.
featuredImage: /assets/images/security-analyst-operational-readiness.png
featuredImageAlt: A security analyst explains an incident while a mentor and cross-functional response team review evidence and business impact in a security operations room.
featuredImageCaption: "Analyst readiness is not only the ability to investigate an alert. It is the ability to explain the risk, navigate the organization, and recommend what happens next. (Image generated using ChatGPT.)"
tags: [cybersecurity, security-operations, incident-response, ai]
mastodon_post: true
mastodon_url:
mastodon_tags: [Cybersecurity, InfoSec, SecOps, SOC, IncidentResponse, CyberWorkforce]
x_post: true
x_url:
---

An analyst finds a serious problem. They can explain what happened, how it happened, and why the activity is technically dangerous.

Then someone asks whether the affected system can be shut down.

Does it support a revenue-generating service? Who owns it? Which customers will lose access? Does the incident need to involve identity, infrastructure, legal, fraud, or a cloud team? Who can approve containment, and what should happen if that person is unavailable?

The analyst may know the threat and still have no idea what to do next.

That was the most useful challenge in Mari Galloway's BrightTALK session, [Preparing Security Analysts for the Reality of Modern Security Operations](https://www.brighttalk.com/webcast/288/672701). We spend a great deal of time preparing analysts to recognize malicious activity. We spend much less time teaching them how their organization makes a difficult decision once the activity is found.

Technical training matters. Certifications can establish a foundation, labs can teach a tool, and capture-the-flag exercises can make someone work through a problem under time pressure. None of those automatically teaches an analyst how to deal with an incomplete asset inventory, a missing application owner, conflicting evidence, an executive asking for an answer, or a containment option that could stop the attack and the business at the same time.

Operational readiness lives in that gap.

## The hard part starts after the alert

Many security analyst job descriptions are built around products and technical tasks. The candidate should know a SIEM, EDR, firewalls, cloud logs, scripting, malware analysis, threat intelligence, and MITRE ATT&CK. Hiring managers then add a list of certifications and hope the combination produces someone who can handle a live incident.

It can produce someone who knows how to investigate. That is not the same as someone who can operate.

Galloway drew the distinction clearly. We train for tools, investigation, technical accuracy, known scenarios, individual tasks, and answers. The job also requires organizational navigation, escalation, business context, ambiguous situations, cross-functional response, and recommendations.

Those are not soft extras added after the real security work. They determine whether the technical work changes an outcome.

NIST's [NICE Workforce Framework for Cybersecurity](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/getting-started) is useful here because it separates tasks, knowledge, and skills. Knowledge is what someone can recall. A skill is an observable action. A task is work directed toward an organizational objective. The framework also says assessment for a work role usually happens at the task level.

That is a better standard than asking whether an analyst finished another course. Can they take the evidence available, perform the work, explain the uncertainty, and help the organization make a defensible decision?

## Analyst work is moving up the decision chain

AI and automation are taking on more of the mechanical work in a SOC. Products can enrich an alert with identity and endpoint context, group related signals, summarize a timeline, extract indicators, and propose a query or response step. That does not eliminate the analyst. It changes where the analyst's time is most valuable.

The work moves toward validation, context, prioritization, deeper investigation, communication, and decision-making.

There is evidence that the assistance can help. A [randomized controlled trial of Microsoft Security Copilot](https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/microsoft_security_copilot_economic_report_v4_accessible.pdf) found that security professionals using the tool completed the tested tasks 22 percent faster overall, including incident summarization 39 percent faster.

That speed does not make the output trustworthy by default. A Google-led study presented at USENIX SOUPS 2025 tested large language models against 50 real incident investigations. The researchers found that autonomous summaries [omitted critical details in 35 percent of cases and introduced factual inaccuracies in 42 percent](https://www.usenix.org/conference/soups2025/presentation/kramer). Analysts still found the systems useful when they worked collaboratively with them because the tools reduced effort and improved consistency.

That is the operational lesson. An analyst who uses AI needs enough judgment to validate what it produced, notice what it left out, and understand when a confident summary does not fit the evidence. If automation handles the first pass, we should not respond by training people only to click **Approve** faster.

We should train them for the decisions the automation cannot safely own.

## Business context is part of technical accuracy

A technically correct recommendation can still be operationally wrong.

Imagine an analyst confirms malicious activity on a server and recommends immediate isolation. That may be the right security action. It could also interrupt a production line, disconnect a medical workflow, stop order processing, cut off remote access to a client, or destroy the team's best visibility into the attacker.

The answer may still be to isolate it now. The difference is whether the analyst understands the consequence, explains the tradeoff, and brings in the person authorized to accept it.

Before recommending action, an incident-ready analyst should be able to find or ask for the following context:

- Which business service does the system support?
- Who owns the service and its dependencies?
- Which customers, users, or client environments are affected?
- What happens if it is unavailable for an hour, a day, or longer?
- Which regulatory, contractual, insurance, or reporting requirements apply?
- What is the organization's risk tolerance, and who has authority to make the call?

This matters even more in an MSP. One alert may involve an endpoint, an identity provider, an RMM platform, a backup system, a cyber insurance requirement, and a client owner who has their own tolerance for downtime. The security team does not get to invent the client's business priorities during the incident.

An analyst needs access to that context before the worst day, not after the bridge call starts.

## You cannot lecture someone into judgment

The line from the session that stuck with me was simple: **you cannot lecture someone into judgment**.

Judgment develops through experience, feedback, reflection, and another attempt. A playbook can tell an analyst which checks usually come next. It cannot cover every broken dependency, misleading signal, unavailable decision-maker, or attacker who behaves differently from the example.

The answer is not to throw a junior analyst into a major incident and call the stress a learning opportunity. Teams need a safe way to expose people to realistic decisions before the consequences are real.

Different exercises develop different parts of the job.

A capture-the-flag event is useful for technical problem-solving, prioritization, and communication under time pressure. A cyber range can add realistic telemetry, tool friction, an inaccurate CMDB, missing logs, and evidence that does not line up neatly. A tabletop can force the team to work through escalation, business impact, communications, legal obligations, and cross-functional decisions.

CISA's [tabletop exercise guidance](https://www.cisa.gov/sites/default/files/publications/Cybersecurity-Tabletop-Exercise-Tips_508c.pdf) makes an important point: the goal is not for everyone to perform perfectly. The goal is to find the problems during peacetime, because there will be no opportunity to align the team during the real emergency. CISA also provides [scenario and after-action templates](https://www.cisa.gov/resources-tools/resources/ctep-package-documents) that organizations can adapt instead of designing an exercise from nothing.

The exercise should not be solved by the SOC manager while everyone else watches. Give the analyst incomplete but realistic evidence. Make the application owner unavailable. Introduce a conflicting identity signal. Let a vendor claim the service is healthy while telemetry says otherwise. Add a customer deadline or a regulatory concern. Ask what the analyst knows, what they are assuming, what would change their mind, and what help they need.

Then hold an after-action review without turning it into a blame session. Capture the decision gaps, missing access, unclear authority, weak documentation, broken contacts, and technical blind spots. Update the runbook, fix what can be fixed, and run a shorter version of the scenario again.

That loop is where judgment grows.

## Let analysts see more of the organization

Security teams often say analysts need business context while keeping them inside the SOC queue all day. That does not work.

Let them shadow an infrastructure change. Have them sit with identity, vulnerability management, cloud engineering, the help desk, and an application owner. Bring them into a business continuity exercise. Let them observe how legal, communications, and leadership handle an incident update.

The first introduction between the analyst and a critical service owner should not happen while an attacker is moving through the environment.

This does not require a complicated rotation program. A few deliberate hours with another team can answer questions a diagram will not. Analysts learn which systems are fragile, which maintenance windows are real, where the asset data is wrong, how a customer experiences downtime, and who actually knows how a service works.

The other team learns something too. They see what evidence security needs, why certain logs matter, and why an alert that looks minor can change when it is connected to identity or endpoint activity.

Cross-functional exposure is not time away from analyst development. It is analyst development.

## Give analysts the room to brief and recommend

An analyst can write an excellent case note and still freeze when asked to explain the incident to engineering or leadership. That skill has to be practiced as deliberately as a query language.

Galloway proposed four questions for an analyst briefing:

1. What happened?
2. Why does it matter?
3. What are our options?
4. What do you recommend?

I would add two details to that structure: state what is not yet known, and name the evidence that would change the recommendation.

That keeps uncertainty visible without turning every briefing into a stream of caveats. Leaders do not need a recital of every log line. They need the current assessment, the business consequence, the available choices, the analyst's recommendation, and the reason for it.

Managers have to make space for this. If the senior person answers every question, writes every update, and makes every recommendation, the rest of the team learns to wait for the senior person.

Coaching sounds different from taking over. Ask why. Ask what the analyst is assuming. Ask what would change their mind. Ask what support they need. Step in when the consequence demands it, but do not make dependence the normal operating model.

## Development should expand responsibility

Analyst progression is often measured as a longer list of tools, certifications, or alert types. Technical depth is important, but a real development path should also expand organizational context, decision responsibility, and leadership exposure.

The progression can be practical:

**Observe and support.** The analyst works known cases with a mentor, maps escalation paths, shadows other teams, joins exercises, and learns how the organization's critical services fit together.

**Own and execute.** The analyst takes bounded investigations from intake through recommendation, briefs a manager or engineering team, documents uncertainty, and leads part of a tabletop or after-action review.

**Lead and represent.** The analyst coordinates a response workstream, makes recommendations across teams, briefs leadership, mentors others, and turns lessons from incidents into better detections, playbooks, and controls.

This gives people evidence that they are growing even when a new title is not immediately available. It also gives the organization a better way to assess readiness than counting closed alerts.

The workforce data supports investing here. In its [2025 Cybersecurity Workforce Study](https://www.isc2.org/Insights/2025/12/2025-ISC2-Cybersecurity-Workforce-Study), ISC2 found that 59 percent of respondents reported critical or significant skills needs, up from 44 percent the year before. A quarter said their organizations had put underqualified or inexperienced people into roles, while another quarter lacked the time or resources to train security staff.

That is not a shortage that another job posting will solve. Organizations have to develop the people they already hired.

Development is also a retention control. ISC2's [2025 hiring trends research](https://www.isc2.org/insights/2025/06/cybersecurity-hiring-trends-study) found that 32 percent of recent graduates expected to stay in their current job for four years or more. That figure rose to 65 percent when respondents were asked whether they would stay that long if they received consistent opportunities to develop in-demand skills.

I have written before that [SOC burnout is an operational design problem](/blog/the-breaking-point-why-cybersecurity-and-soc-professionals-are-burning-out-and-what-actually-works/). A queue that never creates room for learning, reflection, or broader responsibility will burn through people even if the company pays for another certification voucher.

## The readiness test is what happens next

A technically competent analyst should be able to enter an investigation. An incident-ready analyst can keep moving when the problem stops looking like the lab.

Can they investigate the evidence without forcing it into the first theory? Can they navigate the response and reach the right people? Can they explain what the affected system means to the business? Can they make a recommendation that separates facts, assumptions, options, and risk? Can they recognize when the problem is outside their depth and ask for help before the situation gets worse?

Those are the moments that matter.

Certifications, courses, ranges, and AI tools can all help prepare someone for them. None of those is the finish line. Readiness comes from giving analysts realistic practice, access to the organization beyond the SOC, useful feedback, increasing responsibility, and the room to exercise judgment before every decision carries real consequences.

If a team only trains analysts to investigate alerts, it should not be surprised when they struggle to run an incident.

The alert is where the technical work begins. Modern security operations is everything that has to happen after it.
