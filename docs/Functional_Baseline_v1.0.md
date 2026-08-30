# MerrinLab Ultimate Synth — Functional Baseline v1.0

Status: **CANDIDATE — machine consolidation in progress; whole-instrument human listening required before freeze**  
Baseline source: `main` at `4ceacfad9f8e44732fd7c9e32e75d5103ddd3113`  
Consolidation branch: `consolidation/functional-baseline-v1`  
Date: 2026-08-30

## Purpose

This baseline replaces the obsolete project-state description that treated MerrinLab Ultimate Synth as a static faceplate. MUS is now a functional browser synthesizer with an explicit audio graph, live synthesis/modulation/effects controls, Web MIDI and protected output behaviour.

The baseline is a consolidation checkpoint, not a feature expansion.

## Product identity

MerrinLab Ultimate Synth is its own project: a software instrument inspired by the MFOS Ultimate and Ultimate Expander concepts.

It is separate from the `armpitpete/synth` relational SYNTH project. Research may transfer deliberately, but project state, feature acceptance and freezes do not transfer automatically.

## Baseline production architecture

Accepted output ownership remains:

`voice / selected signal source → Drive → Chorus → Delay → Reverb → State Variable VCF → Master → Limiter → AudioContext.destination`

There is one production destination owner.

Filter Ring v0.1 adds its accepted morph/return before the protected master/limiter boundary without creating a second destination.

## Functional scope

The authoritative per-module status is in [Module Inventory v1.0](Module_Inventory_v1.0.md).

At this checkpoint the production browser instrument includes:

- three live VCOs with tuning, waveform, pitch modulation, linear FM and PWM;
- four-channel main Mixer with VCO 1–3, noise selection, mute and metering;
- accepted main low-pass filter and resonance path;
- Sample & Hold;
- AR Generator;
- Main VCA and AUX VCA;
- LFO 1 and LFO 2;
- ADSR and Repeat Gate;
- six live attenuator routes;
- State Variable VCF;
- four-channel Signal Mixer;
- Analog Multiplier;
- Filter Ring Modulation v0.1 — frozen;
- Drive, Chorus, Delay and Reverb;
- bounded master output and limiter;
- Web MIDI device selection, note on/off, pitch bend and mapped CC control;
- Release and Panic Stop authority over accepted audible routes.

## Explicit non-capabilities

The baseline does **not** claim:

- a general patch-cable/socket system;
- working CV Inverter or CV Distributor patch sockets;
- an external audio-input engine;
- independent software equivalents for the Buffered Outputs sockets;
- Sequencer Mod CV integration;
- a complete preset system;
- standalone/JUCE delivery;
- VST/plugin delivery.

Hardware-style artwork is not evidence of a live software path.

## Parked / excluded runtime

The following retained prototype paths are explicitly outside the production baseline:

- `filter-self-resonance-layer.js`;
- `state-variable-vcf-bp-balance-runtime.js`;
- candidate/prototype files not explicitly loaded/promoted;
- the old Sequencer Mod CV implementation from draft PR #82.

## Open-work reconciliation

Consolidation decision:

- issue #68 — delay requirement: **satisfied by current main; close as completed**;
- issue #73 — stereo cathedral reverb requirement: **satisfied by current two-channel generated impulse path; close as completed**;
- issue #74 — visible Output Level bridge: **satisfied by `output-level-visible-controls.js`; close as completed**;
- issue #81 — Sequencer Mod CV 1 → VCLPF: **requirement remains open**; rebuild only from the Functional Baseline if resumed;
- PR #82 — **superseded implementation**; retain its test history as evidence, close without merge;
- PR #83 — **superseded implementation**; current main already contains a newer live Web MIDI/Launchkey path, close without merge.

## Machine regression gate

`check-functional-baseline.mjs` defines the baseline static contract. The PR gate must prove:

1. all production JavaScript parses, including nested MIDI files;
2. the existing audio-graph ownership test passes;
3. all baseline module surfaces remain present;
4. the effects/output chain and one-destination invariant remain intact;
5. Drive/Chorus/Delay/Reverb default-off behaviour remains intact;
6. delay remains bounded to 3 seconds / 0.85 feedback;
7. reverb remains a two-channel generated impulse path;
8. master output remains bounded;
9. current Web MIDI note/pitch/CC routing remains present;
10. Filter Ring v0.1 identity/default-off/live-control contract remains present;
11. parked self-resonance and BP-balance runtimes remain unloaded;
12. unaccepted Sequencer Mod CV code remains outside the production baseline;
13. README no longer contains the obsolete `no audio engine` / `no functional controls` claims.

Machine regression status is recorded by the exact-head PR checks, not by this document alone.

## Whole-instrument human listening gate

A single whole-instrument listening pass is still required before this baseline may be frozen.

Run on the exact deployed candidate after machine checks pass:

1. Start from default/init state; confirm no unexpected sound before intentional gate/note.
2. VCO 1, VCO 2 and VCO 3 individually: waveform/tuning audibly respond.
3. Main Mixer: each VCO/noise channel level and mute works; all-muted state is silent.
4. Main low-pass filter: cutoff and resonance are musically effective without independent stuck resonance tone.
5. AR / ADSR / Main VCA: gate, attack/release and full release behave correctly.
6. LFO 1 / LFO 2 / attenuator routing: at least one pitch/filter/amplitude modulation route each is clearly audible.
7. Sample & Hold: produces changing stepped modulation when intentionally routed.
8. AUX VCA: selected source/CV/destination route is audible and remains under Release/Panic authority.
9. Drive, Chorus, Delay and Reverb: each can be introduced from 0% and removed back to the unchanged dry path.
10. State Variable VCF: LP/BP/HP are distinguishable; cutoff/resonance/mix respond.
11. Signal Mixer: two different sources can be selected, mixed and switched between VCA/MIX line-out routes.
12. Analog Multiplier: an audio×audio or audio×LFO/CV case produces a clearly different multiplied result.
13. Filter Ring v0.1: 0% gives original output; 100% gives clearly ring-only character; return to 0% restores original output.
14. MIDI: Launchkey/other Web MIDI note on/off works; pitch bend works; at least one mapped CC changes its intended control.
15. Output Level reaches silence and restores normal output.
16. Release removes gated sound; Panic Stop immediately silences every active route/effect.
17. No stuck note, runaway feedback, unexpected second output path or persistent post-panic sound remains.

### Human listening result

**PENDING — physical listening is an owner/equipment gate. Do not mark PASS from code inspection or prior isolated module tests.**

## Freeze rule

Functional Baseline v1.0 may be frozen only when:

- the exact-head machine gate passes;
- the exact candidate is deployed through the normal protected path;
- the whole-instrument human listening checklist above passes against that exact deployed candidate;
- no blocker is found;
- the exact baseline head is explicitly authorised for merge/deployment.

Until then this document is a candidate baseline and feature development remains paused except for confirmed baseline defects.
