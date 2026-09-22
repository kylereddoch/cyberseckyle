---
date: 2026-09-22T13:40:00-05:00
title: Connected Cars Have an Access Problem That Outlasts the Sale
seoTitle: "Connected Car Risks: Remote Access, Tracking, and Privacy"
description: A BYD security demonstration raises a wider question about connected cars, manufacturer access, driving data, and what happens to digital permissions when ownership changes.
searchIntent: Explain connected car security and privacy risks through documented cases and show what drivers and small fleets can check about remote access, data collection, ownership transfers, and software support.
featuredImage: /assets/images/connected-cars-byd-shark-interior.jpg
featuredImageAlt: Interior of a BYD Shark 6 showing the steering wheel, digital instrument display, central touchscreen, and console.
featuredImageCaption: 'BYD Shark 6 interior, shown for illustration. Photo by <a href="https://commons.wikimedia.org/wiki/File:BYD_Shark_6_DMO_AWD_interior.jpg">Ethan Llamas / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Resized for web display.'
tags: [cybersecurity, privacy, connected-cars, digital-safety]
draft: true
social:
  post_to: [mastodon, x, linkedin]
  tags: [Cybersecurity, Privacy, ConnectedCars]
---

A researcher switched off a BYD Shark 6's headlights while a journalist drove it at night. The same investigation demonstrated remote location tracking and access to the cabin microphone. Those are substantial capabilities to lose control of in something you use to get your family home.

The demonstration, covered by [Security Affairs](https://securityaffairs.com/199460/hacking/a-byd-shark-6-hack-shows-the-risks-of-connected-cars.html), came from [ABC's Four Corners investigation](https://www.abc.net.au/news/2026-09-21/byd-hacked-by-cybersecurity-expert-vehicle-sabotage-surveillance/107139482). Researcher Dan Hreszczuk had the vehicle for two weeks before the test. He said the access he used lacked a password, but he could not access the brakes or cameras.

ABC's published account does not provide enough technical detail to establish that an attacker could compromise an untouched Shark remotely over the internet. It demonstrates what Hreszczuk could do after gaining access. It does not establish a fleet-wide attack or state surveillance. BYD told ABC that Australian customer data is stored in Australia and that it has not and would not give that data to Chinese authorities.

Interfering with a driver's visibility can create danger even when steering and braking remain protected. Access to conversations or location history creates different harms, potentially exposing where someone sleeps, works, and takes their children. A useful security assessment has to account for all of those consequences.

It also has to follow the connections outside the vehicle. The phone app, dealer website, support portal, and manufacturer account can all become part of the ownership experience. The person holding the keys needs to know who else has access and how that access ends.

## The vulnerable part can be a website

In 2024, researchers [documented flaws in Kia's dealer infrastructure](https://samcurry.net/hacking-kia) that allowed them to locate, unlock, and remotely start compatible vehicles. Their demonstration began with a license plate, used a separate service to retrieve the vehicle identification number, and exploited Kia's systems to change account access. A plate was the lookup input; broken authorization made the attack possible.

The researchers said an active Kia Connect subscription was not required on affected, suitably equipped vehicles. Kia reported fixing the vulnerabilities in August 2024, before public disclosure. These are historical findings, not evidence that the same attack works today.

A billing status is a poor substitute for a technical explanation of whether a vehicle remains connected and which services can still reach it. Letting a trial expire should not require the owner to guess what access remains behind it.

The [Subaru STARLINK research published by Sam Curry and Shubham Shah in January 2025](https://samcurry.net/hacking-subaru) exposed a similar dependency. They compromised an employee administration portal and demonstrated access to vehicle commands, customer information, and a year of location history. According to their write-up, Subaru patched the affected system within 24 hours of notification.

Curry first tested the customer app and found its authorization held up. The broader access came through a different system used by employees. That is a familiar problem in IT: securing the path customers use while leaving a more privileged administrative path exposed.

For an owner, this creates a limit that ordinary account advice cannot solve. A strong password and multifactor authentication help protect your login. They cannot repair a manufacturer's authorization checks or restrict an employee role that was designed with too much power.

The same vendor-risk question comes up in [remote management platforms used by MSPs](/blog/the-n-central-exploits-are-an-msp-vendor-risk-test/): how much authority does the service hold, and what prevents one compromised account or application from reaching everyone downstream? With cars, that authority can extend to physical access and a record of people's movements.

## Driving data can cause harm without a break-in

Security testing addresses unauthorized access. Owners also need to understand what the manufacturer intentionally collects and shares.

On January 14, 2026, the FTC [finalized an order against GM and OnStar](https://www.ftc.gov/legal-library/browse/cases-proceedings/2423052-general-motors-llc-et-al-matter) resolving allegations involving the collection, use, and sale of location and driving data without adequate notice and consent. The agency alleged that the enrollment process obscured what customers were agreeing to.

The FTC's [final complaint](https://www.ftc.gov/system/files/ftc_gov/pdf/2423052c4828gmlexisfinalcomplaint.pdf) describes driving-event information supplied to consumer reporting agencies for insurance purposes. It also records that GM ended its agreements with Verisk and LexisNexis in March 2024 and fully retired Smart Driver in June 2024. The [final order](https://www.ftc.gov/system/files/ftc_gov/pdf/2423052c4828gmlexisfinalorder.pdf) imposes a five-year prohibition on disclosures of covered driver data to consumer reporting agencies, alongside consent, retention, and other requirements.

That case concerns a business's handling of customer information. Installing a security update would not have answered whether the customer understood or wanted the arrangement.

I wrote about the sensitivity of travel patterns in [my Waze privacy article](/blog/waze-terms-update-what-it-means-for-location-privacy/). Vehicle services add another place to examine that problem. Changing a phone's location permissions does not necessarily change what the car's own connection transmits. [Ford's connected-vehicle notice](https://www.ford.com/help/privacy/), for example, describes a built-in cellular modem and explicitly says deleting the phone app does not disable vehicle data sharing.

A buyer should be able to distinguish data needed for a requested feature from data used for another commercial purpose. Finding a stolen car may justify sending its location. That does not, by itself, explain why a service needs to retain a detailed travel history or disclose driving events to another company.

## Handing over the keys does not settle account access

A used-car handover needs to include the accounts associated with the vehicle. So does returning a lease or reassigning a company car. There should be a way to verify that the previous user's access has ended.

[Ford's reset instructions](https://www.ford.co.uk/support/how-tos/ford-technology/vehicle-modem/how-do-i-remove-vehicle-modem-access-for-authorised-users) provide a concrete example. Its modem reset removes the accounts linked to the modem, while the factory reset also removes personal data and vehicle settings. The exact procedure depends on the vehicle and system. Deleting a Bluetooth pairing should not be treated as proof that manufacturer-app access has been revoked.

This becomes more serious when the person with access is an abusive partner. The National Network to End Domestic Violence's [connected-car guidance](https://static1.squarespace.com/static/51dc541ce4b03ebab8c5c88c/t/6786d1c170996202c924ad84/1736888770721/NNEDV_Connected_Cars_2025.pdf) explains that a former owner or authorized user may retain app access, including location visibility. That risk can exist without exploiting a software vulnerability.

For someone facing stalking or abuse, an immediate reset is not automatically the safest first step. NNEDV warns that account changes can alert the abusive person or erase evidence. A survivor advocate can help plan changes around the person's circumstances. Routine advice about cleaning up accounts needs to allow for that reality.

Manufacturers should make ownership transfer and access removal understandable to the person who needs them. If a buyer cannot tell whether a previous owner's account still works, the handover process is incomplete.

## A car needs a software maintenance plan

Connected features can earn their place. Remote diagnostics can help identify problems, emergency services can use location to send assistance, and software updates can deliver fixes without a workshop visit. Owners need to be able to keep useful services without accepting unexplained access or indefinite collection.

[NHTSA's 2022 vehicle cybersecurity guidance](https://www.nhtsa.gov/sites/nhtsa.gov/files/2022-09/cybersecurity-best-practices-safety-modern-vehicles-2022-tag.pdf) recommends separating wireless-connected components from critical vehicle controls and applying strong controls between networks. It also calls for vulnerability testing, incident response, and tracking software components and updates across the vehicle's lifetime. The document is voluntary guidance, not a certification that a particular model is secure.

Those recommendations lead to purchasing questions that deserve written answers. How long will this model receive security fixes? Which fixes require a dealer visit? Does security support depend on a paid subscription? What happens to remote access when the connected service is retired? Can the owner disable optional connectivity while preserving essential vehicle functions?

A promise to provide updates is incomplete without a duration and a delivery process. The second or third owner needs those answers too. A car can remain mechanically useful after its original app, modem, or service arrangement has become difficult to support.

## What owners and small fleets can actually check

Start with the account that can locate or unlock the car. Use a unique password, enable multifactor authentication where supported, and secure the email account used for recovery. Review authorized drivers and digital keys separately from paired phones; they can represent different kinds of access.

Then review the vehicle's own connectivity settings and the manufacturer's privacy controls. Look for optional driving-analysis programs, marketing permissions, location collection, retention, and deletion options. Ask what a setting changes and which features depend on it. An app disappearing from your phone is not evidence that the vehicle has stopped communicating.

Follow the manufacturer's update and recall instructions. When buying or selling, use the documented ownership-transfer and reset procedures for that model, and confirm that the intended accounts can access the vehicle afterward. Ask the dealer or manufacturer to resolve any remaining account association before treating the transfer as complete.

For a small business, put connected vehicles on the same access-review schedule as other services that expose customer or employee information. Record who administers the fleet account, who can view trip history, how long that history is needed, and who removes access when someone leaves. A technician's route can reveal client locations even when the fleet portal never stores a customer name.

These steps reduce the exposure an owner can influence. The manufacturer still controls the backend systems, the permissions granted to its staff, and much of the software inside the vehicle. Customers cannot audit those systems from the dashboard, so clear support commitments and independent security scrutiny belong in the buying decision.

The handover would be a good place to start. Alongside the keys and service records, the buyer should receive a clear account-transfer confirmation, an explanation of active data sharing, and a security-support end date. Those are practical parts of owning a connected car, and they should be as routine to explain as the warranty.
