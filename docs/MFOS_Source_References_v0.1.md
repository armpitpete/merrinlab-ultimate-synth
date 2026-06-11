# MFOS Source References v0.1

## Purpose

This document records the original MFOS source references needed to verify the MerrinLab Ultimate Synth interface inventory.

The goal is not to copy the MFOS documentation into this repo. The goal is to keep stable references so the component inventory can be corrected against the original Ultimate and Expander source material.

## Primary source site

- Music From Outer Space main site: https://musicfromouterspace.com/
- Music From Outer Space Synth-DIY directory: https://musicfromouterspace.com/index.php?MAINTAB=SYNTHDIY

## Source evidence found

The MFOS home page identifies the Sound Lab ULTIMATE as the advanced synth project and describes its major sections:

- three musically accurate VCOs
- white noise generator
- active mixer
- voltage controlled low-pass filter
- voltage controlled amplifier
- attack release envelope generator
- two low frequency oscillators
- repeat gate generator
- sample and hold
- attenuator bank
- patch panel

The MFOS home page also identifies the ULTIMATE EXPANDER as a companion for the Sound Lab ULTIMATE.

## Site-map locations to use for verification

The MFOS Synth-DIY directory lists these Sound Lab ULTIMATE pages:

- Sound Lab ULTIMATE — Home
- Sound Lab ULTIMATE — Schematics
- Sound Lab ULTIMATE — Panel Wiring
- Sound Lab ULTIMATE — Parts List
- Sound Lab ULTIMATE — PCB Info
- Sound Lab ULTIMATE — Pictures
- Sound Lab ULTIMATE — Mods
- Sound Lab ULTIMATE — Troubleshooting

The MFOS Synth-DIY directory lists these ULTIMATE EXPANDER pages:

- ULTIMATE EXPANDER — Home
- ULTIMATE EXPANDER — Schematics
- ULTIMATE EXPANDER — Panel Wiring
- ULTIMATE EXPANDER — Parts List
- ULTIMATE EXPANDER — PCB Info
- ULTIMATE EXPANDER — Panel Drawings

## Verification task

Use the source pages above to correct:

```text
docs/Interface_Component_Inventory_v0.1.md
```

Specifically verify:

- exact panel labels
- exact control names
- which components are pots/knobs
- which components are switches
- which components are LEDs/indicators
- which components are jacks/sockets
- which patch points belong on the main faceplate
- which patch points should become software routing/matrix controls

## Current limitation

The web search/browser tool found the MFOS directory entries, but did not expose direct stable file URLs for the exact panel drawing assets.

Manual follow-up may be needed:

1. Open the MFOS Synth-DIY directory in a browser.
2. Go to Sound Lab ULTIMATE → Panel Wiring.
3. Save or screenshot the panel reference.
4. Go to ULTIMATE EXPANDER → Panel Drawings.
5. Save or screenshot the panel reference.
6. Upload those panel references into the chat or add them to a local notes folder.

Do not commit large copied MFOS images/PDFs into this repo unless we have a clear reason and the copyright/licensing position is checked.

## Good enough for now

The repo now has a source-reference document that tells us where to verify the component inventory.

The next task is to capture the actual panel drawing images or screenshots so the inventory can be corrected precisely.
