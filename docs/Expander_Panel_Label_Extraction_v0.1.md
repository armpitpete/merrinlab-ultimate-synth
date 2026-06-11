# Ultimate Expander Panel Label Extraction v0.1

## Purpose

This document continues Issue #1 by extracting the exact visible labels from the Sound Lab ULTIMATE EXPANDER panel references in the uploaded source archive.

This is the Expander correction pass for:

```text
docs/Interface_Component_Inventory_v0.1.md
```

## Source files used

From the uploaded archive:

```text
Single Board Analogue Synths.zip
```

Primary files inspected:

```text
Sound Lab Ultimate Expander/Panel Drawings_files/main_panel_icon.gif
Sound Lab Ultimate Expander/Panel Drawings_files/aux_panel_icon.gif
```

## Important note

This extraction records front-panel labels and visible interface items.

Some controls, jacks, switches, and indicators need wiring/schematic confirmation before their exact electrical roles are locked.

---

# 1. Main Expander Panel — Verified Visible Sections

## ADSR ENV. GEN.

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| ADSR ENV. GEN. | Section heading | Label | ADSR envelope generator | Verified |
| ATTACK | Control | Knob | ADSR attack | Verified |
| DECAY | Control | Knob | ADSR decay | Verified |
| SUSTAIN | Control | Knob | ADSR sustain | Verified |
| RELEASE | Control | Knob | ADSR release | Verified |
| GATE | Jack / label | Socket | Gate-related socket; exact role to verify | Verified label / Verify role |
| TRIG | Jack / label | Socket | Trigger-related socket; exact role to verify | Verified label / Verify role |
| MAN. | Switch label | Switch / button | Manual gate control marking | Verified label / Verify role |
| GATE | Manual gate label | Label | Appears with MAN. gate switch/marking | Verified label / Verify role |
| ADSR RANGE | Switch label | Switch | Range selector | Verified label / Verify role |
| LONG | Switch position | Label | ADSR range position | Verified |
| SHORT | Switch position | Label | ADSR range position | Verified |

## EXT. SIG. BUFFER

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| EXT. SIG. BUFFER | Section heading | Label | External signal buffer | Verified |
| SIGNAL BOOST | Control | Knob | External signal boost amount | Verified |
| OUT | Output | Socket | First visible output socket | Verified label / Verify role |
| OUT | Output | Socket | Second visible output socket | Verified label / Verify role |

## ANALOG MULTIPLIER

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| ANALOG MULTIPLIER | Section heading | Label | Analog multiplier section | Verified |
| X-IN | Input | Socket | X input | Verified label / Verify role |
| Y-IN | Input | Socket | Y input | Verified label / Verify role |
| XY-OUT | Output | Socket | X/Y multiplier output | Verified label / Verify role |

## CV-INVERTER

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| CV-INVERTER | Section heading | Label | Control-voltage inverter | Verified |
| INPUT | Input | Socket | CV inverter input | Verified label / Verify role |
| OUT | Output | Socket | CV inverter output | Verified label / Verify role |

## ATTENUATORS

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| ATTENUATORS | Section heading | Label | Two attenuator channels | Verified |
| IN | Input | Socket | Left attenuator input | Verified label / Verify role |
| OUT | Output | Socket | Left attenuator output | Verified label / Verify role |
| unlabeled knob | Control | Knob | Left attenuator amount | Verified visible layout / Verify role |
| unlabeled knob | Control | Knob | Right attenuator amount | Verified visible layout / Verify role |
| IN | Input | Socket | Right attenuator input | Verified label / Verify role |
| OUT | Output | Socket | Right attenuator output | Verified label / Verify role |

## VOLTAGE CONTROLLED AMPLIFIER

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| VOLTAGE CONTROLLED AMPLIFIER | Section heading | Label | Expander VCA section | Verified |
| INITIAL AMP | Control | Knob | Initial VCA amplitude/amplification control | Verified |
| INPUT | Input | Socket | VCA input | Verified label / Verify role |
| OUT | Output | Socket | VCA output | Verified label / Verify role |
| CV1 | CV input | Socket | First VCA CV input | Verified label / Verify role |
| CV2 | CV input | Socket | Second VCA CV input | Verified label / Verify role |

## STATE VARIABLE VCF

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| STATE VARIABLE VCF | Section heading | Label | Expander filter section | Verified |
| INITIAL COF | Control | Knob | Visible panel label appears as `INITIAL COF`; likely cutoff-related, but keep exact text | Verified label / Verify role |
| RESONANCE | Control | Knob | Filter resonance | Verified |
| INPUT | Input | Socket | First visible filter input | Verified label / Verify role |
| CV1 | CV input | Socket | First filter CV input | Verified label / Verify role |
| CV2 | CV input | Socket | Second filter CV input | Verified label / Verify role |
| RES-CV | CV input | Socket | Resonance CV input | Verified label / Verify role |
| INPUT | Input | Socket | Second visible filter input | Verified label / Verify role |
| HP-OUT | Output | Socket | High-pass output | Verified label / Verify role |
| BP-OUT | Output | Socket | Band-pass output | Verified label / Verify role |
| LP-OUT | Output | Socket | Low-pass output | Verified label / Verify role |

## SIGNAL MIXER

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| SIGNAL MIXER | Section heading | Label | Four-channel signal mixer | Verified |
| IN-1 | Input | Socket | Mixer channel 1 input | Verified label / Verify role |
| unlabeled knob | Control | Knob | Mixer channel 1 level | Verified visible layout / Verify role |
| IN-2 | Input | Socket | Mixer channel 2 input | Verified label / Verify role |
| unlabeled knob | Control | Knob | Mixer channel 2 level | Verified visible layout / Verify role |
| IN-3 | Input | Socket | Mixer channel 3 input | Verified label / Verify role |
| unlabeled knob | Control | Knob | Mixer channel 3 level | Verified visible layout / Verify role |
| IN-4 | Input | Socket | Mixer channel 4 input | Verified label / Verify role |
| unlabeled knob | Control | Knob | Mixer channel 4 level | Verified visible layout / Verify role |
| LINE OUT SELECT | Switch label | Switch | Selects line out source | Verified label / Verify role |
| VCA | Switch position / source label | Label | Line out select source | Verified label / Verify role |
| MIX | Switch position / source label | Label | Line out select source | Verified label / Verify role |
| unlabeled connected sockets | Output sockets | Sockets | Two sockets connected to the line-out select marking; exact role to verify | Verify |

## ENVELOPE FOLLOWER

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| ENVELOPE FOLLOWER | Section heading | Label | Envelope follower section | Verified |
| INPUT | Input | Socket | Envelope follower input | Verified label / Verify role |
| EF OUT | Output | Socket | Envelope follower output | Verified label / Verify role |
| FOLLOWER LAG | Control | Knob | Envelope follower lag/smoothing | Verified |

## Bottom utility outputs

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| ADSR OUT | Output | Socket | First ADSR output | Verified label / Verify role |
| ADSR OUT | Output | Socket | Second ADSR output | Verified label / Verify role |
| ULTIMATE MIXER OUT | Output | Socket group | Two visible sockets under one label | Verified label / Verify role |

## Branding / title

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| MFOS ULTIMATE EXPANDER | Panel title | Label | Vertical title on right side of main panel | Verified |

---

# 2. Auxiliary Expander Panel — Verified Visible Labels

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| MFOS ULTIMATE | Left vertical branding | Label | Left side label | Verified |
| EXPANDER | Right vertical branding | Label | Right side label | Verified |
| ADSR TRIG IN | Input | Socket | ADSR trigger input | Verified label / Verify role |
| ADSR GATE IN | Input | Socket | ADSR gate input | Verified label / Verify role |
| FROM ULTIMATE | Group label | Label | Source group from Ultimate | Verified |
| MIXER OUT | Input / link | Socket | Connection from Ultimate mixer out | Verified label / Verify role |
| LINE OUT | Input / link | Socket | Connection from Ultimate line out | Verified label / Verify role |
| EXTERNAL SIGNAL IN | Input | Socket | External signal input | Verified label / Verify role |
| VC-FILTER CV IN | Input | Socket | Voltage controlled filter CV input | Verified label / Verify role |
| LEVEL | Control | Knob | First visible level control | Verified label / Verify role |
| LINE OUT | Output | Socket | Expander line output | Verified label / Verify role |
| HEADPHONES | Output | Socket | Headphones output | Verified label / Verify role |
| CV DISTRIBUTOR | Group label | Label | CV distributor section | Verified |
| CV IN | Input | Socket | CV distributor input | Verified label / Verify role |
| CV OUT | Output | Socket | CV distributor output 1 | Verified label / Verify role |
| CV OUT | Output | Socket | CV distributor output 2 | Verified label / Verify role |
| CV OUT | Output | Socket | CV distributor output 3 | Verified label / Verify role |
| LEVEL | Control | Knob | Second visible level control | Verified label / Verify role |

---

# 3. Immediate Corrections Needed In Inventory

Update `docs/Interface_Component_Inventory_v0.1.md` so the Expander scaffold uses the verified visible labels above.

Important corrections from this extraction:

- Replace the generic Expander scaffold with real sections: `ADSR ENV. GEN.`, `EXT. SIG. BUFFER`, `ANALOG MULTIPLIER`, `CV-INVERTER`, `ATTENUATORS`, `VOLTAGE CONTROLLED AMPLIFIER`, `STATE VARIABLE VCF`, `SIGNAL MIXER`, `ENVELOPE FOLLOWER`, and the auxiliary panel.
- Preserve exact visible spellings such as `INITIAL AMP`, `INITIAL COF`, `RES-CV`, `HP-OUT`, `BP-OUT`, `LP-OUT`, `XY-OUT`, and `FOLLOWER LAG`.
- Keep switch and jack electrical roles marked `Verify` until checked against panel wiring/schematics.
- Do not yet convert the panel into final software behaviour.

## Next subtask

Use this extraction to rewrite the Expander part of:

```text
docs/Interface_Component_Inventory_v0.1.md
```

Then Issue #1 will have verified visible labels for both the Ultimate and the Expander.
