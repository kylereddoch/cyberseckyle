---
date: 2026-10-22T13:45:29-05:00
title: 'Client Case Study: Tracing a Suspicious Download After Quarantine'
seoTitle: 'Client Case Study: Investigating a Quarantined MSIX Download'
description: 'An anonymized case from my client work, with practical lessons for MSPs and defenders on tracing a suspicious download, checking collection gaps, and reporting what the evidence supports.'
searchIntent: 'Help cybersecurity practitioners and MSP teams learn from an anonymized client investigation of a quarantined MSIX download, including browser-history collection gaps and evidence limitations.'
featuredImage: /assets/images/quarantined-download-browser-history.png
featuredImageAlt: A magnifying glass rests over illustrated browser-history cards beside a file enclosed in a transparent box, with question marks between them.
featuredImageCaption: 'Conceptual illustration of investigating a quarantined download. Generated with OpenAI image generation; no real incident data is shown.'
tags: [cybersecurity, incident-response, powershell, browsers, MSP, threat-detection]
social:
  post_to: [mastodon, x, linkedin]
  tags: [Cybersecurity, IncidentResponse, PowerShell, MSP]
  status:
    mastodon: |-
      The same suspicious installer appeared in two unrelated client environments. Antivirus quarantined it, but I still needed to understand how it arrived.

      I wrote up the case for fellow MSPs and defenders: where browser history helped, where my collector fell short, and what remained unresolved. Client details are anonymized.

      {url}

      #MSP #IncidentResponse
    x: |-
      A client's installer was quarantined. I still needed to trace the download. An anonymized field case for MSPs and defenders:

      {url}

      #MSP
    linkedin: |-
      In client work, a successful quarantine can still leave important questions unanswered.

      I encountered the same suspicious MSIX installer in two unrelated managed client environments. Antivirus quarantined it, but I still needed to understand how it arrived and whether there was evidence it had run.

      I wrote up the investigation as an anonymized client case study for cybersecurity practitioners and MSP teams. It covers an inconclusive indexed EDR search, a browser-history collection gap I had to correct, and a download record that provided useful page context without proving execution or the complete delivery route.

      If you handle endpoint alerts for clients, the practical lesson is to check what your tools actually collected and keep the findings separate from the questions still open. I've included the troubleshooting decisions and limitations so other teams can apply the lessons to their own work.

      {url}

      #Cybersecurity #IncidentResponse #MSP
---

I encountered the same suspicious MSIX installer in two unrelated managed client environments. Antivirus successfully quarantined it, which was good to see. I still wanted to understand how it had arrived and whether there was evidence that it had run.

Those questions led me into browser download history, a PowerShell collector that was skipping more than it should, and a download URL that did not behave like an ordinary web address.

The useful result was a matching browser download record and some context about the page associated with it. Execution remained unestablished, and the full delivery route remained unresolved. Getting to that point meant looking closely at what my own collection process had actually covered.

I've left out identifying details throughout this write-up. The process and the mistakes are useful to share without including anyone's systems, browsing records, or incident artifacts.

## Quarantine left a few questions open

When I'm working through an alert, I want the conclusion to match the evidence behind it. In this case, I had three separate questions:

{% articleSteps "Three questions to keep separate", [
  { title: "Containment", text: "Had antivirus quarantined the installer?" },
  { title: "Download provenance", text: "What evidence connected it to browser activity or a download source?" },
  { title: "Execution", text: "Was there evidence that the installer had run?" }
] %}

Quarantine gave me an answer to the first question. It did not settle the other two or establish that either endpoint was fully clean.

Seeing the same installer in two unrelated environments also did not establish a common attacker or campaign. It was a reason to investigate, but I did not have enough evidence to connect the two encounters beyond the installer itself.

## The indexed search returned zero results

My initial indexed EDR hash search returned no matches.

That is a result I can record accurately: the particular search did not return a matching indexed result. It does not establish that execution never happened. I also could not use that result alone to explain why nothing was returned.

This is where wording matters in an investigation. If I write “no matching indexed result,” the next person knows what I checked. If I turn that into “never executed,” I have made a much larger claim without the evidence to support it.

Browser download history offered another way to investigate the download question. It would still need to be interpreted within its own limits, but it could add context that the indexed search had not supplied.

## Building a collector with a defined scope

I built a reusable PowerShell download-history collector for Chrome and Edge, designed to run through an RMM workflow using 64-bit Windows PowerShell 5.1.

It took two inputs: `ProfilePath` and `FileName`. The first selected a Windows user profile, and the second identified the filename to look for. Within that selected Windows profile, the collector targeted Chrome and Edge browser profiles.

That distinction is easy to lose in a report. A Windows user profile can contain browser profiles, and searching those browser profiles is a bounded collection. This collector did not search every Windows user on the machine.

I also used hostname-only URL reporting in the audit summary to reduce the amount of browsing detail in routine output. That was a data-minimization choice. Hostnames can still identify private infrastructure, so they do not belong in an anonymized article either.

I've included a standalone adaptation of the collector below so other practitioners can review the approach and test it in their own lab. It retains the provisional journal checks discussed here. The downloadable adaptation has not been validated on Windows endpoints, so I would review browser schema differences, locking, sidecars, live writes, input handling, and privacy handling before putting it into an operational workflow.

## Four queried, two skipped

The first run returned zero matching downloads from four successfully queried databases. It also skipped two databases.

That second sentence changed how I had to read the first.

The skipped databases had encountered a guard I had put in the collector: if a SQLite rollback journal existed and was nonempty, the collector would stop short of querying that source.

The guard was too broad. It treated one filesystem observation as enough reason to reject the database, without distinguishing the journal state behind that observation.

This was a collector assumption I needed to revisit. The initial outcome was incomplete coverage: four databases queried, two skipped, zero matches in the databases that were queried. There was no negative result for the two sources I had not successfully queried.

That is why I want collection summaries to include attempted, queried, skipped, errored, and matched counts. A single “matches found” number leaves out information that can change the entire interpretation.

## Looking more closely at the journal guard

I inspected the journal header read-only. The first 12 bytes were zero, while other fields later in the journal were populated.

That was a more specific observation than “the journal file is not empty.” It did not establish that the journal was clean, stale, or safe to discard.

SQLite's documentation describes a hot rollback journal as one requiring recovery, and its criteria involve more than the file's existence or size. Header and locking conditions also matter. That helped explain why a nonempty-file guard was too coarse. The reference covers rollback-mode behavior; it should not be treated as a complete guide to WAL handling or an endorsement of a custom collection method. [SQLite: File Locking and Concurrency](https://www.sqlite.org/lockingv3.html).

I revised the collector with narrower, provisional checks involving the copied header and source metadata. The working copies retained their sidecar files, and collection continued to use normal read-only SQLite access with `quick_check` on the working copy. I did not delete source journals to make the query succeed.

{% articleCallout "What the validation did not establish", "caution" %}
This was still a live-copy approach. A successful structural check does not prove that the database and its sidecars captured one coherent instant of the source. I would not describe this as an atomic snapshot or a forensic acquisition.
{% endarticleCallout %}

I also would not turn the header observation into a general rule that a zero prefix makes a journal safe to ignore. It was one piece of evidence in a specific troubleshooting process. Changing access modes to ignore recovery needs or suppressing errors would undermine the result I was trying to understand.

## The rerun found a matching Chrome download

After that adjustment, the collector queried six databases with zero query errors and found one matching download record in a Chrome browser profile. The record preceded antivirus detection.

Here is the change in coverage, using only the sanitized counts:

| Collection result | Initial | Revised |
| --- | ---: | ---: |
| Databases queried | 4 | 6 |
| Databases skipped | 2 | 0 |
| Matching downloads | 0 | 1 |

The revised run gave me a browser record to examine. It also showed why the first run's zero-match count had needed the skipped-source context beside it.

The finding was still scoped to the databases queried. It did not establish all activity across either environment, and a download record was not evidence that the installer executed.

## Why the hostname was missing

The matching download used a `blob:` URL. The collector's conventional hostname extraction did not return a hostname for it.

A blob URL refers to a backing object rather than functioning like an ordinary HTTP download address. Its syntax can include the origin of the context that created it. That creator origin is useful context, but it does not by itself identify the server that originally supplied the object's bytes. [MDN: blob URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob).

In this case, the creator-origin information, tab URL context, and tab referrer exposed a page associated with the download. That let me describe an association I could support without renaming the page's hostname as a confirmed payload host.

I had to keep several limits clear:

- The page association did not establish the original byte-serving endpoint.
- The available context did not reconstruct a complete redirect or delivery chain.
- A record in a browser profile did not identify the human responsible for an action.
- The download record did not establish execution of the installer.

This is a useful reporting lesson beyond this particular case. Creator origin, tab context, and referrer should keep their own labels. Combining them into a generic “source” field makes it easier for someone reading the report to assume they all mean the same thing.

## One small remote-terminal wrinkle

There was also a practical issue with how the diagnostic commands reached the remote terminal. Multiline paste was being flattened, which caused parsing problems.

Formatting the affected diagnostics on one line with explicit semicolon separators resolved that command-transport problem. It did not require weakening security settings or bypassing a control. The commands needed to arrive with their statement boundaries intact.

It is a small detail, but it belongs in a troubleshooting write-up because it was another place where the behavior of the surrounding workflow mattered.

## Download the PowerShell collector

<a href="/assets/downloads/Trace-Browser-Download.ps1" download="Trace-Browser-Download.ps1">Download Trace-Browser-Download.ps1</a>

This standalone copy includes my author credit, parameter help, and the collection limitations in its comments. I removed the client-specific input defaults and the RMM output binding. It writes its summary to the console and keeps detailed reports locally in a new folder restricted to SYSTEM and Administrators.

It requires an elevated **64-bit Windows PowerShell 5.1** session and the Windows-provided `winsqlite3.dll`. It does not download dependencies. Supply the selected Windows profile and the filename you are investigating. The placeholders below are deliberately generic; replace them with authorized local values before running the script.

```powershell
.\Trace-Browser-Download.ps1 -ProfilePath '<SELECTED_WINDOWS_PROFILE>' -FileName '<INSTALLER_FILENAME>'
```

The search checks for the filename as a case-insensitive substring in available path and URL/context fields. A match can come from a referrer or tab field, so inspect the record before treating it as a matching downloaded filename. The actual installer filename from this case is omitted for privacy.

Use `Get-Help .\Trace-Browser-Download.ps1 -Full` to read the parameters and limitations. `OutputRoot` controls the local report location. `KeepWorkingCopies` retains the database copies and their sidecars; without it, the script attempts to remove its own working-copy folder after collection. Reports remain in either case. Cleanup failures are reported, and may leave sensitive working copies behind.

Read the per-database status alongside the match count. In this version, guard rejections appear under `Error`; it does not report a separate skip counter. `NotPresent` describes missing browser roots or History files, not a count of successfully inspected databases. Exit code `0` means the available sources completed without reported errors or truncation. Exit code `2` means collection was incomplete or failed. Neither result establishes that an endpoint is clean, and failures before collection may prevent reports from being written.

{% articleCallout "Review before operational use", "caution" %}
The standalone adaptation has not been tested on Windows endpoints. Review and test it against authorized disposable data before use. Its journal checks and `quick_check` do not establish a coherent point-in-time copy. Reports contain sensitive paths, identities, timestamps, and full URLs; working copies contain broader browsing history. Even the minimized console summary can contain sensitive context. Keep those outputs private, and do not delete source journals or bypass errors to force a result.
{% endarticleCallout %}

## Using the collector through an RMM

For MSP teams, the RMM is often the practical way to reach an endpoint during an investigation. That was the context for my original collector. The downloadable version is a standalone script, so I would treat the RMM integration as a small, separate piece of work and test it before using it on a client system.

**Choose the profile explicitly.** Map the RMM's input fields to `ProfilePath` and `FileName`, and supply both for every job. If the agent runs as SYSTEM, its own profile environment is not the Windows user profile being investigated. Do not substitute the agent's profile or assume that the currently signed-in user is the right target. One invocation searches the Chrome and Edge browser profiles under the selected Windows profile only.

**Check how the platform launches PowerShell.** Configure a 64-bit Windows PowerShell 5.1 process with the required elevated permissions. An RMM agent's architecture does not tell you which PowerShell process its job runner will start. This script rejects PowerShell 7 and 32-bit processes. Keep your normal script approval, signing, and execution-policy controls in place.

**Run the saved file with explicit arguments.** Distribute the reviewed script through your normal RMM script or file library. Use the platform's supported parameter binding and quote values correctly, especially profile paths containing spaces. Avoid inserting unvalidated input into a command string. A native PowerShell job that accepts only a pasted body needs a platform-specific wrapper; the standalone file's parameter block is not the same as RMM-generated input assignments. Missing mandatory parameters can also leave an unattended job waiting for input or failing before collection. Microsoft's [PowerShell executable documentation](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_powershell_exe?view=powershell-5.1) explains `-File` argument handling and process exit behavior.

**Keep job status and investigation status separate.** Capture the console summary and preserve the script's process exit code through any wrapper. Test that the RMM actually marks incomplete collection for review instead of turning it into a successful job. The summary distinguishes queried, errored, truncated, and not-present sources, but guard-related skips are included under errors. Read the local per-database detail before interpreting zero matches. A successful job is not proof of no execution or a clean endpoint.

**Decide where evidence belongs.** The RMM console may retain its output in job history, tickets, or integrations. Hostname-only URL reporting still leaves potentially identifying context, so restrict access to that output. Retrieve detailed reports only through your approved evidence-handling process. Avoid automatically attaching full reports to broadly visible tickets. Leave `KeepWorkingCopies` off unless you have a specific need and a retention plan for the broader browser data those copies contain.

I would first validate parameter handling, process architecture, report permissions, and failure reporting with disposable lab data. The standalone adaptation and an RMM wrapper need that validation independently; the original case's result does not establish compatibility with another platform. If a source is changing or cannot be queried, keep that gap visible and arrange a controlled retry. Do not delete source sidecars or suppress the error to make a job appear complete.

## What I'll carry into the next investigation

The collection gap is the part of this experience I most want to remember. I had useful evidence waiting in a source that my own guard was preventing me from querying.

For another investigation like this, these are the checks I want in front of me:

- **Keep the questions separate.** Record containment, download provenance, and execution findings individually.
- **Make coverage visible.** Include attempts, successful queries, skips, errors, and matches. A skipped source remains a gap.
- **Preserve the source and its context.** Keep source databases and journals intact, retain relevant sidecars with working copies, and document collection limitations.
- **Explain what validation establishes.** Header inspection and structural checks provide specific information. Neither establishes point-in-time consistency of a live copy.
- **Handle URL schemes deliberately.** A missing conventional hostname can require a different interpretation of the recorded URL. Preserve the meaning of creator, tab, and referrer fields.
- **Leave unresolved questions visible.** A useful finding does not need to become a complete incident narrative to be worth reporting.

I did not visit malicious links, restore the quarantined payload, or delete source journals during this work. The browser evidence was enough to improve my understanding of the download without taking those steps.

What I came away with was a matching Chrome download record, a page association, and a clearer account of what the collector had covered. The execution question and the complete delivery route remained unresolved. Checking the assumptions in my own tool was what made the next useful piece of evidence available.
