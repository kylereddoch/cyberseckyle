---
date: 2026-06-10T10:00:00-05:00
title: "The Next Prompt Injection Target Might Be Your iPhone"
seoTitle: Why Siri AI Makes iPhones a Prompt Injection Target
description: "As Siri AI gains web awareness, screen context, Visual Intelligence, and app actions, prompt injection becomes an Apple ecosystem problem, not just a chatbot problem."
searchIntent: Explain how Siri AI turns websites, screens, images, and apps into potential prompt injection paths on Apple devices.
featuredImage: /assets/images/apple-newsroom-prompt-injection-featured.jpg
featuredImageAlt: Siri AI reading information displayed on an iPhone screen and answering a question about the onscreen content.
featuredImageCaption: 'Image: <a href="https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/">Apple</a>'
tags: [ai, apple, cybersecurity, appsec]
lastModified: 2026-07-01T14:06:08-05:00
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116726591061705155"
mastodon_tags: [Cybersecurity, InfoSec, AppleIntelligence, SiriAI, AISecurity]
---


Prompt injection is about to feel a lot less like a weird chatbot trick and a lot more like a real consumer and enterprise endpoint problem.

Apple’s new Siri AI is designed to understand personal context, answer questions about content on the screen, go to the web for current information, and take action across apps, according to [Apple’s WWDC26 announcement](https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/). Apple’s broader [Apple Intelligence announcement](https://www.apple.com/newsroom/2026/06/apple-intelligence-brings-powerful-ai-capabilities-into-everyday-experiences/) also highlights Visual Intelligence, Safari intelligence, Mail and Messages suggestions, Shortcuts generation, and App Intents.

That combination makes the assistant more useful. It also gives attackers more places to smuggle instructions into the assistant's context.

## Prompt injection is not just a chatbot issue

A lot of people still think prompt injection means typing “ignore all previous instructions” into a chatbot.

That obvious version is not the one I worry about most.

The scarier version is indirect prompt injection. That happens when the AI reads untrusted content from somewhere else, such as a web page, email, document, image, calendar invite, note, file, or app record. The user may not even see the malicious instruction. The assistant ingests it as context and may treat it as part of the task.

The [UK National Cyber Security Centre](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection) has made the point clearly: LLMs do not have a clean internal separation between data and instructions the way traditional systems try to separate commands from input. In an LLM, everything is part of the token stream. Prompt injection may not be "fixed" the same way SQL injection was eventually reduced with safer query handling.

Siri AI is not being built as a single chat box. It is being integrated into the OS.

## Why Siri AI changes the prompt injection conversation

The old prompt injection scenario was usually something like this:

A user pastes content into an AI tool. The tool gets tricked. Something bad might happen.

The new Siri AI scenario could be more like this:

A user asks Siri to summarize a web page, understand a screenshot, process an email, find a file, create a Shortcut, or act inside an app. The assistant pulls in context from several places. One of those places contains hidden or malicious instructions. The assistant may follow them or allow them to influence the result.

That turns prompt injection from a chatbot problem into an operating-system workflow problem.

Apple’s own feature list shows why. Safari can organize tabs, monitor pages with Notify Me, and generate extensions from natural-language descriptions. Siri AI can answer questions using screen content or web information. Visual Intelligence can understand what the user is looking at. Shortcuts can assemble automation steps from a user’s description. App Intents let third-party apps expose content and actions to Siri AI.

Each piece is useful on its own. Put them together, and you have a powerful assistant moving through untrusted content.

## The attacker does not need to “hack Apple”

Users need to understand the attacker does not need to compromise Apple to create risk.

Prompt injection does not always require a software exploit. The attacker may not need to compromise iOS, break Secure Enclave, or defeat Private Cloud Compute. They may simply need to place hostile instructions where the assistant is likely to read them.

That could be:

- Hidden text on a web page.
- A malicious email footer.
- A poisoned support article.
- A calendar invite with instructions buried in the notes field.
- A PDF with white text on a white background.
- A screenshot or image containing adversarial text.
- A third-party app record exposed through App Intents.
- A QR code or sign designed to influence Visual Intelligence.

Prompt injection is annoying because it lives at the boundary between content and command. Traditional security controls are good at detecting known malware, network indicators, and suspicious binaries. They are not naturally built to detect a sentence that manipulates an AI assistant.

## The risk gets worse when the assistant can act

If Siri only summarized text, prompt injection would still be a concern. Bad summaries can mislead people.

But the real risk starts when Siri can act.

[OWASP’s Excessive Agency guidance](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) says damaging actions can happen when LLM-based systems have excessive functionality, excessive permissions, or excessive autonomy. Use that lens here. A prompt injection that changes a summary is one level of concern. A prompt injection that influences a file share, email response, calendar change, Shortcut, website account change, or app action is another level entirely.

Human confirmation matters, but it cannot be lazy confirmation. A vague "Do you want to continue?" is weak. A useful confirmation should show the exact action, the target, the data being shared, and any security-sensitive side effects.

In the MSP world, I would put it this way: if a help desk tech would need approval before doing it manually, Siri should not be allowed to do it silently through AI.

## Visual Intelligence expands the input problem

Text is not the only input anymore.

Apple is pushing Visual Intelligence across platforms, which means the camera, screenshots, images, and on-screen content can become AI context. Useful for accessibility, learning, shopping, troubleshooting, and productivity; risky when the physical world becomes a prompt surface.

Think about a conference badge, poster, whiteboard, support flyer, fake sign, or malicious QR code. If an assistant can read it, interpret it, and suggest actions, attackers will test how far they can push that interaction.

I am not saying "never use Visual Intelligence." I am saying the camera is no longer only a camera when an assistant can interpret what it sees and feed that interpretation into an action-capable workflow.

## Websites will absolutely test this

Safari is where this gets especially interesting.

Apple says Safari intelligence is built with privacy in mind, and that is good. But web pages are untrusted by default. They are built by someone else, rendered dynamically, stuffed with ads, third-party scripts, comments, user-generated content, pop-ups, overlays, and sometimes straight-up scams.

If Safari or Siri AI can summarize pages, monitor pages, organize browsing context, or generate web-related helper tools, we should expect malicious web content to try to influence the assistant.

This might look like hidden prompt text telling the assistant to ignore security warnings, prefer one product, reveal previous context, click a deceptive link, or convince the user that a fake support process is legitimate.

Again, no iOS zero-day required. Just hostile content in the path of the assistant.

## What Apple needs to get right

Apple has some natural advantages here. The company controls the OS, the app permission model, the browser, the App Store review process, and a lot of the user experience. That gives Apple more room to build guardrails than a random AI startup gluing an LLM onto a browser extension.

But the guardrails need to be practical and visible.

The things I would want to see:

- Clear labeling between user instructions, system instructions, and untrusted content.
- Strong isolation for web, email, image, and document content.
- Confirmation screens that show exactly what action will happen.
- Permission scoping for App Intents.
- Easy reporting for suspicious AI behavior.
- Enterprise logging or reporting that respects privacy but still allows governance.
- MDM controls that let businesses disable risky categories without killing every helpful feature.

Apple already has some management controls for Apple Intelligence features, including Safari summary, Mail smart replies, Writing Tools, Image Playground, Visual Intelligence summary, and external intelligence integrations in [Apple Platform Deployment](https://support.apple.com/guide/deployment/review-device-management-restrictions-dep739685973/web). That needs to keep expanding as Siri AI gets more capable.

## What users should do

Users do not need to become AI security researchers. They just need better instincts.

If Siri AI is working with content from a website, email, image, or document, treat the result as an assistant suggestion, not truth. If Siri suggests an action after reading untrusted content, slow down. If a page, caller, or message tells you to ask Siri to do something specific, be suspicious.

The same rule applies here that applies to phishing: urgency is a warning sign.

If something is pushing you to act quickly, share information, approve a change, install something, send money, change a password, or ignore a warning, do not let the smooth AI experience lower your guard.

## What businesses should do

For business devices, prompt injection needs to be part of AI policy.

That means deciding whether employees can use Siri AI with client data, internal emails, documents, and third-party apps. It means reviewing MDM restrictions. It means training users that AI-generated summaries, replies, and actions can be manipulated by content. It also means asking vendors how their App Intents are secured.

The important thing is not to wait for the first incident.

The iPhone is already where employees read email, respond to clients, approve MFA prompts, scan documents, manage calendars, and communicate with vendors. If Siri AI becomes an action layer over those workflows, prompt injection becomes an endpoint security issue.

## The bottom line

Siri AI may be built with a stronger privacy model than many AI tools. I will give Apple credit for that.

But prompt injection does not disappear because the model runs privately. A private assistant can still be manipulated by untrusted content. A local model can still be confused. A well-designed cloud architecture can still produce a bad recommendation if the input is poisoned.

The next prompt injection target might not be a chatbot window.

It might be the iPhone in your hand.
