# VCO 1 Control Model v0.1

**Project:** MerrinLab Ultimate Synth  
**Issue:** #21 — Align VCO 1 control model with MFOS VCO spec  
**Status:** Provisional VCO 1 model for the first safe audible voice  

## Purpose

This note defines the first software control model for VCO 1.

It does not claim exact MFOS hardware emulation. It does not implement VCO 2, VCO 3, PWM input modulation, sync, LOG-CV, LIN-CV, or full patch routing.

The goal is to stop the first audible voice from being only a generic Web Audio oscillator.

## MFOS-facing VCO controls

The faceplate exposes these VCO concepts:

- Coarse Freq
- Fine Freq
- Waveform
- Pulse Width %
- PWM
- SYNC
- LOG-CV
- LIN-CV

## v0.1 software model

| Faceplate concept | v0.1 software behaviour | Status |
|---|---|---|
| Coarse Freq | Main VCO 1 pitch in Hz over a safe test range. | Active |
| Fine Freq | Fine detune in cents around the coarse pitch. | Active |
| Waveform | Basic oscillator waveform choice. | Active |
| Pulse Width % | Changes duty/timbre only when the Pulse waveform is selected. | Active for Pulse only |
| PWM | Not implemented yet. | Later |
| SYNC | Not implemented yet. | Later |
| LOG-CV | Not implemented yet. | Later |
| LIN-CV | Not implemented yet. | Later |

## Current safety boundary

VCO 1 remains inside the first safe audible voice path:

```text
VCO 1
  ↓
VCO 1 level
  ↓
low-pass filter
  ↓
main VCA
  ↓
safe output
```

The current implementation stays deliberately limited:

- VCO 1 only
- no VCO 2
- no VCO 3
- no external pitch CV
- no sync
- no PWM modulation input
- no patch matrix
- no exact MFOS circuit modelling

## Good enough for this pass

VCO 1 is now shaped like the MFOS-facing control model:

- coarse pitch and fine pitch are separate
- waveform choice is explicit
- pulse width belongs to pulse behaviour only
- inactive VCO inputs are documented as later work

That is enough before adding more sound sources.