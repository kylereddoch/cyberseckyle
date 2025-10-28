---
date: 2025-10-28T10:00:00-05:00
title: Remove Preinstalled Microsoft Store Apps in Windows 11 (24H2 & 25H2)
description: A practical tutorial for removing Microsoft Store apps for existing users, future profiles, and at scale with Intune/GPO on Windows 11 Enterprise & Education.
tags: [windows-11, windows, intune, gpo, powershell, tutorials, IT]
mastodon_url: https://infosec.exchange/@cyberseckyle/115452568772511610
---

![Windows 11 Store Apps Removal hero](/assets/images/win11_appx_apps_removal_hero.png){loading="eager" eleventy:widths="auto"}

_For new user profiles, existing users, and at-scale management with Intune_

Windows 11 ships with a pile of inbox Microsoft Store apps. Some are useful, others add noise. This guide shows you how to remove them the right way:

- clean up what **new profiles** get by default  
- clean up **existing users**  
- roll the change out with **Intune, CSP, or GPO** on Windows 11 Enterprise and Education 25H2+

Microsoft now supports a **policy-based removal** that deprovisions selected inbox apps, so you can stop babysitting brittle scripts.

## What this feature does and does not do

- **Scope:** Removes selected **Microsoft-provisioned Store apps**. It does not remove third-party OEM utilities.  
- **Timing:** Runs at OOBE, at user sign-in after an OS upgrade, or after policy changes. Existing users keep apps until sign out/in after the policy is applied.  
- **Supported editions:** Windows 11 **Enterprise** and **Education** on **25H2+** for the policy method. Windows 11 Pro still requires deprovisioning or imaging techniques.  
- **Reinstall behavior:** While removal is selected, Windows blocks reinstall from the Store until you flip the app back to “False” and reprovision or reinstall it.

## Quick reference: approaches in this article

- **GPO / Intune policy (25H2 ENT/EDU):** best for new profiles at scale  
- **Registry (ADMX-backed keys):** same policy under the hood, useful for testing or automation  
- **PowerShell per-user removal:** cleans the signed-in user now  
- **PowerShell or DISM deprovision:** prevents apps from installing for **future** users on a device or image

## Method 1 — Remove apps with **Group Policy** (good for small pilots)

1) Open **Local Group Policy Editor** or create a domain GPO.  
2) Go to:  
`Computer Configuration → Administrative Templates → Windows Components → App Package Deployment`  
3) Open **Remove default Microsoft Store packages from the system** and set to **Enabled**.  
4) Pick the apps to remove and apply.  
5) Test with a new user profile or sign out/in after policy arrives.

> **Verify on a client:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\Appx\RemoveDefaultMicrosoftStorePackages` contains values for selected apps.

## Method 2 — Remove apps with **Intune** (Settings Catalog or OMA-URI)

### Settings Catalog

- Create a **Device configuration** profile in Intune.  
- Category: **Administrative Templates → Windows Components → App Package Deployment**  
- Setting: **Remove default Microsoft Store packages from the system = Enabled**  
- Toggle **True** per app and assign to device groups. Unsupported devices show **Not applicable**.

### OMA-URI (ADMX-backed CSP)

- Path:  
`./Device/Vendor/MSFT/Policy/Config/ApplicationManagement/RemoveDefaultMicrosoftStorePackages`  
- Data type: **String**  
- Value: XML payload like the example below. Use **true** to remove, **false** to keep.

```xml
<enabled/>
<data id="MicrosoftStickyNotes" value="true"/>
<data id="MicrosoftSolitaireCollection" value="true"/>
<data id="BingNews" value="true"/>
<data id="BingWeather" value="true"/>
<data id="GamingApp" value="true"/>
<data id="XboxGamingOverlay" value="true"/>
<data id="XboxIdentityProvider" value="true"/>
<data id="XboxSpeechToTextOverlay" value="true"/>
<data id="XboxTCUI" value="true"/>

<!-- Common keepers in enterprise images -->
<data id="WindowsCalculator" value="false"/>
<data id="WindowsCamera" value="false"/>
<data id="WindowsNotepad" value="false"/>
<data id="Paint" value="false"/>
<data id="Photos" value="false"/>
<data id="QuickAssist" value="false"/>
<data id="WindowsTerminal" value="false"/>
<data id="MediaPlayer" value="false"/>
<data id="OutlookForWindows" value="false"/>
<data id="MSTeams" value="false"/>
```

> Intune’s native UI can lag the Windows release. If you do not see the setting yet, use the OMA-URI method as a temporary path.

## Method 3 — Apply the **policy via registry** (useful for tests and automation)

The policy writes under:  
`HKLM\SOFTWARE\Policies\Microsoft\Windows\Appx\RemoveDefaultMicrosoftStorePackages`  

- `Enabled = 1`  
- Create a subkey per app and mark it for removal (ADMX-backed policy structure).

Admins often seed these keys with a script during imaging or break-glass scenarios, then migrate to Intune or GPO for long-term control.

## Method 4 — Clean up **existing users** now (PowerShell)

Policy focuses on what **new** profiles get. To clean up users who are already logged in, remove their installed copies and then deprovision so the apps do not return.

```powershell
<#
Removes selected Store apps for all existing users,
then deprovisions those apps so NEW users will not get them.
Run as admin.
#>

$Patterns = @(
  '*MicrosoftStickyNotes*',
  '*Microsoft.MicrosoftSolitaireCollection*',
  '*Microsoft.BingNews*',
  '*Microsoft.BingWeather*',
  '*Microsoft.GamingApp*',
  '*Microsoft.XboxGamingOverlay*',
  '*Microsoft.XboxIdentityProvider*',
  '*Microsoft.XboxSpeechToTextOverlay*',
  '*Microsoft.Xbox.TCUI*'
)

Write-Host 'Phase 1: remove from existing users'
foreach ($pat in $Patterns) {
  Get-AppxPackage -AllUsers -Name $pat -ErrorAction SilentlyContinue |
    ForEach-Object {
      try {
        Write-Host "Removing per-user: $($_.Name)"
        Remove-AppxPackage -Package $($_.PackageFullName) -AllUsers -ErrorAction Stop
      } catch {
        Write-Warning "Failed removing $($_.Name): $($_.Exception.Message)"
      }
    }
}

Write-Host 'Phase 2: deprovision so new users do not get them'
$prov = Get-AppxProvisionedPackage -Online
foreach ($pat in $Patterns) {
  $prov | Where-Object { $_.DisplayName -like $pat -or $_.PackageName -like $pat } |
    ForEach-Object {
      try {
        Write-Host "Deprovisioning: $($_.DisplayName)"
        Remove-AppxProvisionedPackage -Online -PackageName $($_.PackageName) | Out-Null
      } catch {
        Write-Warning "Failed deprovisioning $($_.DisplayName): $($_.Exception.Message)"
      }
    }
}
```

- `Remove-AppxPackage` removes per-user copies.  
- `Remove-AppxProvisionedPackage` edits the device’s provisioning template for **future** profiles.

## Method 5 — Service an image with **DISM** (offline or online)

For gold images or break-glass CLI:

```cmd
dism /Online /Get-ProvisionedAppxPackages
dism /Online /Remove-ProvisionedAppxPackage /PackageName:<PackageName>
```

Same effect as the PowerShell deprovision cmdlet, via DISM.

## Troubleshooting and verification

- **Event Viewer:** `Applications and Services Logs → Microsoft → Windows → AppxDeployment-Server → Operational`  
  Watch for Event IDs **762** (removed), **606** (skipped due to policy), **614** (failed).  
- **Registry check:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\Appx\RemoveDefaultMicrosoftStorePackages` has app subkeys and values when the policy is active.  
- **Intune status:** Device configuration profile shows **Succeeded** for supported devices, **Not applicable** otherwise.  
- **Sysprep and upgrades:** If you tinker with provisioned apps manually, Sysprep can complain. Standardize on one method to avoid surprises.

## FAQ

**Which apps can I remove with the policy?**  
Microsoft provides a curated list that currently includes Calculator, Camera, Photos, Sticky Notes, Solitaire, Teams, Outlook for Windows, Notepad, Paint, Quick Assist, Sound Recorder, Windows Terminal, Windows Media Player, and several Xbox components. The list can change over time.

**Will this work on Windows 11 Pro?**  
The new removal policy targets Enterprise and Education on 25H2+. For Pro devices, use deprovisioning or image servicing.

**Do I need both GPO and Intune?**  
No. Pick one channel per device to avoid conflicts.

---

## Sources and further reading

- Microsoft Tech Community announcement: Policy-based removal of pre-installed Microsoft Store apps  
  https://techcommunity.microsoft.com/blog/windows-itpro-blog/policy-based-removal-of-pre-installed-microsoft-store-apps/4463835

- Microsoft Learn — Policy-based inbox app removal (Intune, CSP, GPO, timing, event IDs, XML)  
  https://learn.microsoft.com/windows/configuration/policy-based-inbox-app-removal

- PowerShell: Remove-AppxPackage (per-user removal)  
  https://learn.microsoft.com/powershell/module/appx/remove-appxpackage

- PowerShell: Remove-AppxProvisionedPackage (deprovision for new profiles)  
  https://learn.microsoft.com/powershell/module/dism/remove-appxprovisionedpackage

- DISM App Package servicing options  
  https://learn.microsoft.com/windows-hardware/manufacture/desktop/dism-app-package--appx-or-msix--servicing-command-line-options

- Reference style you liked for context (similar structure, not a source of commands):  
  https://www.tech2geek.net/how-to-remove-preinstalled-microsoft-store-apps-in-windows-11-24h2-25h2-for-new-user-profiles/