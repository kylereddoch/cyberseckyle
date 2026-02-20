---
date: 2026-02-20T16:00:00-05:00
title: "Fighting the PUP Wave: A Practical PowerShell Cleanup Workflow for MSPs"
description: "When unwanted apps keep sneaking onto client endpoints and allowlisting is not in the budget, a repeatable uninstall script plus RMM automation can still move the needle."
tags: [MSP, powershell, vulnerability-management, endpoint-security]
mastodon_url: https://infosec.exchange/@cyberseckyle/116105286009952512
---

I have been seeing a noticeable increase in unwanted applications showing up on client endpoints lately. Not full-on ransomware. Not always an obvious infection. Just the annoying middle layer: adware, PUPs, and browser junk that eats time, breaks trust, and quietly expands the attack surface. WaveBrowser, PDFSkills, Lavasoft-style “helpers,” random toolbars. The usual suspects.

The best fix is to stop these things before they ever run, and application allowlisting is built for that. In plain terms, allowlisting is a deny-by-default approach where only approved software is permitted to run. If you have budget for something like [ThreatLocker’s allowlisting](https://www.threatlocker.com/cybersecurity-101/allowlisting), that is the cleaner long-term path.

But budgets are real, and sometimes the business answer is “not right now.” So I wanted something I could deploy immediately and run consistently. Not a replacement for allowlisting, but a practical control: a PowerShell cleanup script that uninstalls known junk, plus an RMM workflow that runs it weekly and logs the results.

## The approach

The concept is simple:

1. Maintain a “bad app list” as patterns (WaveBrowser, Lavasoft, PDFSkills, etc.).
2. Detect installed software using Windows uninstall registry keys.
3. Prefer silent uninstall methods when available.
4. Log everything so you can prove what happened.

This is endpoint hygiene. It does not eliminate the need for smarter preventative controls, but it reduces noise and keeps fleets from slowly decaying into toolbar museums.

## How the script works

### It does not use Win32_Product

A lot of scripts online query `Win32_Product` to find installed programs. That is a trap in production. Microsoft documents that querying `Win32_Product` can trigger Windows Installer consistency checks across MSI packages, which can cause reconfiguration behavior and performance issues. See Microsoft’s write-up on the issue: [Windows Installer reconfigures all applications](https://learn.microsoft.com/en-us/troubleshoot/windows-server/admin-development/windows-installer-reconfigured-all-applications).

Instead, the script reads uninstall entries from the registry locations Windows uses for Add/Remove Programs.

### It prefers QuietUninstallString

Many installers provide a `QuietUninstallString`, which is the best case for automation because it is explicitly intended to run without user prompts. If the app is MSI-based and exposes a product GUID, the script can also uninstall via `msiexec /x {GUID} /qn /norestart`.

### It supports Audit mode and Remediate mode

- **Audit** shows what would be removed, with no changes.
- **Remediate** performs the uninstalls it can do silently and logs the exit codes.

In MSP land, Audit mode is your seatbelt. Use it.

## The “bad app list” JSON and why there is also a default list in the script

This part looks redundant at first, because it feels like the script is carrying the same list twice.

You will maintain a JSON file like this:

```json
{
  "patterns": [
    "wave\\s*browser",
    "lavasoft",
    "pdf\\s*skills",
    "web\\s*companion",
    "onelaunch",
    "relevantknowledge",
    "premieropinion",
    "chromium"
  ],
  "excludes": [
    "^Microsoft\\s",
    "^Google\\sChrome$",
    "^Microsoft\\sEdge$"
  ]
}
```

Then you notice the script also includes this:

```powershell
function Get-DefaultConfig {
  @{
    patterns = @(
      'wave\s*browser',
      'lavasoft',
      'pdf\s*skills',
      'web\s*companion',
      'onelaunch',
      'relevantknowledge',
      'premieropinion',
      'chromium'
    )
    excludes = @(
      '^Microsoft\s',
      '^Google\sChrome$',
      '^Microsoft\sEdge$'
    )
  }
}
```

So what is the point of `Get-DefaultConfig` if we already have JSON?

**`Get-DefaultConfig` is a fallback.** It exists so the script still behaves predictably when:

- the JSON has not been deployed yet
- the JSON path is wrong
- the JSON is invalid (bad comma, wrong quotes, etc.)

The precedence is: **JSON wins when it loads successfully. Defaults only apply when JSON fails.**

### Three config strategies you can choose from

This is where you can tune the script to match your risk tolerance.

#### Option A: Minimal defaults (recommended for MSPs)

Keep defaults very small and very safe. If JSON deployment fails, the script still only targets the most obvious junk.

```powershell
function Get-DefaultConfig {
  @{
    patterns = @(
      'wave\s*browser',
      'lavasoft'
    )
    excludes = @(
      '^Microsoft\s',
      '^Google\sChrome$',
      '^Microsoft\sEdge$'
    )
  }
}
```

#### Option B: Require JSON (strict mode)

This is my favorite when running at scale. If the JSON is missing, the script refuses to run. That prevents “oops, it ran with defaults across 300 endpoints.”

```powershell
function Load-Config([string]$path) {
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Config file missing: $path"
  }
  $raw = Get-Content -LiteralPath $path -Raw -Encoding UTF8
  $cfg = $raw | ConvertFrom-Json
  return @{
    patterns = @($cfg.patterns)
    excludes = @($cfg.excludes)
  }
}
```

#### Option C: Merge defaults with JSON (baseline plus overrides)

Useful if you want a built-in baseline list across all clients, plus a JSON that adds customer-specific items.

```powershell
function Load-Config([string]$path) {
  $base = Get-DefaultConfig
  if (-not (Test-Path -LiteralPath $path)) { return $base }

  try {
    $cfg = (Get-Content -LiteralPath $path -Raw -Encoding UTF8) | ConvertFrom-Json
    return @{
      patterns = @($base.patterns + @($cfg.patterns) | Select-Object -Unique)
      excludes = @($base.excludes + @($cfg.excludes) | Select-Object -Unique)
    }
  } catch {
    return $base
  }
}
```

My opinion: in an MSP environment, pick Option A or Option B. Option C works, but it can hide change-control problems if you forget what lives in defaults versus JSON.

## The script

Save this as `Remove-PUP.ps1`:

```powershell
[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [ValidateSet('Audit','Remediate')]
  [string]$Mode = 'Audit',

  [string]$ConfigPath = "C:\ProgramData\MSP\PUPRemediation\PUP-Patterns.json",

  [string]$LogRoot = "C:\ProgramData\MSP\PUPRemediation",

  [switch]$IncludeAllUsers
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$logDir = Join-Path $LogRoot "Logs"
New-Item -Path $logDir -ItemType Directory -Force | Out-Null
$logFile = Join-Path $logDir ("PUPRemediation_{0:yyyyMMdd_HHmmss}.log" -f (Get-Date))

Start-Transcript -Path $logFile -Append | Out-Null

function Write-Info([string]$msg) { Write-Host "[INFO ] $msg" }
function Write-Warn([string]$msg) { Write-Warning "$msg" }

function Get-DefaultConfig {
  @{
    patterns = @(
      'wave\s*browser',
      'lavasoft',
      'pdf\s*skills',
      'web\s*companion',
      'onelaunch',
      'relevantknowledge',
      'premieropinion',
      'chromium'
    )
    excludes = @(
      '^Microsoft\s',
      '^Google\sChrome$',
      '^Microsoft\sEdge$'
    )
  }
}

function Load-Config([string]$path) {
  if (Test-Path -LiteralPath $path) {
    try {
      $raw = Get-Content -LiteralPath $path -Raw -Encoding UTF8
      $cfg = $raw | ConvertFrom-Json
      return @{
        patterns = @($cfg.patterns)
        excludes = @($cfg.excludes)
      }
    } catch {
      Write-Warn "Config parse failed at $path. Using defaults."
      return Get-DefaultConfig
    }
  }
  return Get-DefaultConfig
}

function Get-UninstallRegistryPaths([switch]$AllUsers) {
  $paths = @(
    'Registry::HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
    'Registry::HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'
  )

  if ($AllUsers) {
    $userSids = Get-ChildItem 'Registry::HKEY_USERS' -ErrorAction SilentlyContinue |
      Where-Object { $_.PSChildName -match '^S-1-5-21-\d+-\d+-\d+-\d+$' } |
      Select-Object -ExpandProperty PSChildName

    foreach ($sid in $userSids) {
      $paths += "Registry::HKEY_USERS\$sid\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*"
      $paths += "Registry::HKEY_USERS\$sid\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
    }
  }

  return $paths
}

function Get-InstalledPrograms([switch]$AllUsers) {
  $regPaths = Get-UninstallRegistryPaths -AllUsers:$AllUsers
  foreach ($p in $regPaths) {
    Get-ItemProperty -Path $p -ErrorAction SilentlyContinue |
      Where-Object { $_.DisplayName -and $_.DisplayName.Trim().Length -gt 0 } |
      Select-Object DisplayName, DisplayVersion, Publisher, UninstallString, QuietUninstallString, PSPath, @{
        n='Scope'; e={ if ($_.PSPath -like '*HKEY_USERS*') { 'User' } else { 'Machine' } }
      }
  } | Sort-Object DisplayName, DisplayVersion, Scope -Unique
}

function Split-CommandLine([string]$cmdLine) {
  $cmdLine = $cmdLine.Trim()
  if ($cmdLine.StartsWith('"')) {
    $secondQuote = $cmdLine.IndexOf('"', 1)
    if ($secondQuote -gt 1) {
      return @{ File = $cmdLine.Substring(1, $secondQuote - 1); Args = $cmdLine.Substring($secondQuote + 1).Trim() }
    }
  }
  $firstSpace = $cmdLine.IndexOf(' ')
  if ($firstSpace -gt 0) { return @{ File = $cmdLine.Substring(0, $firstSpace); Args = $cmdLine.Substring($firstSpace + 1).Trim() } }
  return @{ File = $cmdLine; Args = '' }
}

function Get-MsiProductCode([string]$cmdLine) {
  $m = [regex]::Match($cmdLine, '\{[0-9A-Fa-f-]{36}\}')
  if ($m.Success) { return $m.Value }
  return $null
}

function Get-SilentUninstallCommand($app) {
  if ($app.QuietUninstallString) { return Split-CommandLine $app.QuietUninstallString }

  if ($app.UninstallString -match '(?i)msiexec') {
    $guid = Get-MsiProductCode $app.UninstallString
    if ($guid) { return @{ File = "msiexec.exe"; Args = "/x $guid /qn /norestart" } }
  }

  if (-not $app.UninstallString) { return $null }

  $cmd = Split-CommandLine $app.UninstallString
  $fileName = [IO.Path]::GetFileName(($cmd.File -replace '"',''))

  if ($fileName -match '(?i)^unins\d*\.exe$') {
    return @{ File = $cmd.File; Args = ($cmd.Args + ' /VERYSILENT /SUPPRESSMSGBOXES /NORESTART').Trim() }
  }

  return $null
}

function Invoke-Uninstall($app) {
  $cmd = Get-SilentUninstallCommand $app
  if (-not $cmd) {
    Write-Warn "Skipping (no reliable silent uninstall): $($app.DisplayName) [$($app.Scope)]"
    return
  }

  $target = "$($app.DisplayName) [$($app.Scope)]"
  $what = "$($cmd.File) $($cmd.Args)".Trim()

  if ($PSCmdlet.ShouldProcess($target, "Uninstall via $what")) {
    Write-Info "Uninstalling: $target"
    $p = Start-Process -FilePath $cmd.File -ArgumentList $cmd.Args -Wait -PassThru -WindowStyle Hidden
    Write-Info "ExitCode=$($p.ExitCode) for $target"
  }
}

$cfg = Load-Config $ConfigPath
$patterns = @($cfg.patterns) | Where-Object { $_ }
$excludes = @($cfg.excludes) | Where-Object { $_ }

Write-Info "Mode: $Mode"
Write-Info "ConfigPath: $ConfigPath"
Write-Info "Log: $logFile"

$apps = Get-InstalledPrograms -AllUsers:$IncludeAllUsers

$matches = $apps | Where-Object {
  $name = $_.DisplayName
  $isMatch = $false
  foreach ($pat in $patterns) { if ($name -match $pat) { $isMatch = $true; break } }
  if (-not $isMatch) { return $false }
  foreach ($ex in $excludes) { if ($name -match $ex) { return $false } }
  return $true
} | Sort-Object DisplayName

Write-Info ("Matched {0} installed entries." -f $matches.Count)

if ($Mode -eq 'Audit') {
  $matches | Select-Object DisplayName, DisplayVersion, Publisher, Scope | Format-Table -AutoSize
  Stop-Transcript | Out-Null
  exit 0
}

foreach ($m in $matches) { Invoke-Uninstall $m }

Stop-Transcript | Out-Null
exit 0
```

## Automating it with your RMM

Once you have a script and a JSON list, the automation pattern becomes repeatable.

<table>
  <thead>
    <tr>
      <th>Component</th>
      <th>What it does</th>
      <th>Why it matters</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Component">Managed file</td>
      <td data-label="What it does">Stores <code>PUP-Patterns.json</code> centrally</td>
      <td data-label="Why it matters">You update the list once, then push everywhere</td>
    </tr>
    <tr>
      <td data-label="Component">Script</td>
      <td data-label="What it does">Runs PowerShell cleanup (Audit or Remediate)</td>
      <td data-label="Why it matters">Consistent removal logic and logging</td>
    </tr>
    <tr>
      <td data-label="Component">Task</td>
      <td data-label="What it does">Executes the script against a scope of endpoints</td>
      <td data-label="Why it matters">Scheduling and run history become turnkey</td>
    </tr>
    <tr>
      <td data-label="Component">Workflow</td>
      <td data-label="What it does">Chains “copy JSON then run script”</td>
      <td data-label="Why it matters">Ensures the newest bad-app list is always used</td>
    </tr>
  </tbody>
</table>

## Kaseya VSA X example (Automation Hub)

We use Kaseya VSA X, and the nice thing is the platform already organizes automation around scripts, tasks, workflows, and managed files inside Automation Hub. Kaseya’s documentation covers the building blocks here: [Automation introduction](https://help.vsa10.kaseya.com/help/Content/1-Modules/automation/introduction.htm).

### 1) Upload the JSON as a Managed File

Upload `PUP-Patterns.json` into Automation Hub Managed Files: [Managed files](https://help.vsa10.kaseya.com/help/Content/1-Modules/automation/managed-files.htm).  
This is the “update later” win. When you discover a new pest, overwrite the managed file with the updated JSON, and your workflow keeps using the newest list.

### 2) Create the PowerShell Script

Create a Windows PowerShell script in Automation Hub and paste in `Remove-PUP.ps1`: [Scripts](https://help.vsa10.kaseya.com/help/Content/1-Modules/automation/scripts.htm).

### 3) Create a Task for execution and scheduling

Tasks run scripts against device scopes and can be scheduled: [Tasks](https://help.vsa10.kaseya.com/help/Content/1-Modules/automation/tasks.htm).  
Recommended rollout:

- Week 1: run `-Mode Audit -IncludeAllUsers` on a limited scope
- Week 2: widen scope, still Audit
- After review: flip to `-Mode Remediate -IncludeAllUsers`

### 4) Create a Workflow that always pushes JSON first

Workflows let you orchestrate steps: [Workflows](https://help.vsa10.kaseya.com/help/Content/1-Modules/automation/workflows.htm).  
The pattern:

1. Write the managed file to `C:\ProgramData\MSP\PUPRemediation\PUP-Patterns.json`
2. Run the task that executes `Remove-PUP.ps1`

### 5) Verify results

Workflow and task history is where you confirm what actually ran and when. Start here: [Workflow history](https://help.vsa10.kaseya.com/help/Content/1-Modules/automation/workflow-history.htm).  
On the endpoint, the script also writes a transcript log under `C:\ProgramData\MSP\PUPRemediation\Logs\` so you can pull artifacts when you need proof for a ticket.

## Practical guardrails

- Start with Audit mode. Always.
- Keep exclusions tight so you do not remove legitimate line-of-business tools.
- Expect some uninstallers to be hostile. The script intentionally skips entries without a reliable silent uninstall path.
- Treat this as hygiene, not a replacement for preventative controls. Allowlisting is still the cleaner long-term answer when you can fund it.

This whole setup is a very MSP kind of compromise. It is not glamorous, but it is consistent, reviewable, and deployable right now. Sometimes “right now and reliable” beats “perfect and someday.”