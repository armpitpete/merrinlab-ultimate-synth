# First Playable Engine Scope v0.1

**Project:** MerrinLab Ultimate Synth  
**Issue:** #19 — Define first playable engine scope  
**Status:** First-audio scope definition only  

## Purpose

This document defines the smallest safe first playable engine target for MerrinLab Ultimate Synth.

It does not implement audio. It does not change the UI. It does not add JavaScript behaviour. It does not start JUCE or VST work. It does not claim exact MFOS hardware emulation.

The purpose is to remove ambiguity before the first coding issue.

## Current baseline

The project already has:

- static dark faceplate preview
- visual QA complete
- label verification complete
- sound-behaviour target complete
- planning-level BOM analysis complete
- screenshot-based BOM value extraction complete

Relevant documents:

```text
docs/Static_Faceplate_Preview_Checkpoint_v0.1.md
docs/Sound_Behaviour_Analysis_v0.1.md
docs/BOM_Analysis_v0.1.md
docs/BOM_Value_Extraction_v0.1.md
docs/Interface_Component_Inventory_v0.1.md
```

## First playable engine target

The first playable engine should be deliberately small:

```text
One oscillator
  ↓
Simple mixer / level
  ↓
Low-pass filter
  ↓
VCA
  ↓
Output

Gate → envelope → VCA
```

This is not the full instrument.

It is the smallest useful proof that the future engine can make a safe, shaped, playable sound.

---

# 1. First audible patch

## Required audio path

The first audible patch is:

```text
VCO 1
  ↓
VCO 1 level / simple mixer stage
  ↓
Low-pass filter
  ↓
Main VCA
  ↓
Master output
```

## Required control path

The first control path is:

```text
Gate
  ↓
Envelope
  ↓
Main VCA level
```

## Required pitch path

The first pitch path is:

```text
Keyboard or simple test note source
  ↓
VCO 1 pitch
```

If real keyboard/MIDI input is not ready, a fixed safe test pitch is acceptable for the first proof.

---

# 2. Controls that must work first

Only these controls must work in the first audible pass:

| Area | Control | First-pass behaviour |
|---|---|---|
| VCO 1 | Frequency / pitch | Produces a safe audible pitch. |
| VCO 1 | Waveform | One simple waveform is enough. Saw or pulse is acceptable. |
| Mixer | VCO 1 level | Controls how much VCO 1 reaches the filter. |
| Low-pass filter | Cutoff | Clearly changes brightness. |
| Low-pass filter | Resonance | Safe low-to-moderate resonance only. |
| Envelope | Attack | Shapes the start of the note. |
| Envelope | Release | Shapes the end of the note. |
| Main VCA | Envelope amount or gate-controlled level | Lets the note open and close safely. |
| Master output | Output level | Keeps output low and clamped. |
| Panic / stop | Stop audio | Stops sound immediately if needed. |

## Envelope choice

Use the simplest envelope source first.

Acceptable first choice:

```text
AR envelope → Main VCA
```

The ADSR can wait unless the implementation path already makes ADSR easier.

Do not implement both AR and ADSR in the first audio pass unless it remains tiny and safe.

---

# 3. Visible controls that stay inactive

Most faceplate controls must stay visual-only for the first playable engine.

Inactive for first audio pass:

- VCO 2
- VCO 3
- VCO 2 level
- VCO 3 level
- white noise level
- external input level
- low-pass external CV inputs
- LFO 1 modulation
- LFO 2 modulation
- sample and hold
- repeat gate
- attenuators
- ADSR, unless chosen instead of AR
- state-variable VCF
- Expander signal mixer
- analog multiplier
- CV inverter
- CV distributor
- envelope follower
- external signal buffer
- buffered outputs beyond normal main output
- patch matrix / free routing
- preset system
- MIDI learn

If these controls are visible on the faceplate, they must either remain inert or be clearly treated as future controls.

Do not make them pretend to work.

---

# 4. Safety requirements

The first audio pass must be safe by default.

Required:

- output level starts low
- output is clamped or limited to prevent loud bursts
- resonance is capped to a safe range
- no self-oscillation in the first pass unless deliberately added later
- panic/stop control silences audio immediately
- no uncontrolled feedback path
- no microphone or live external input
- no saved preset can load an unsafe level

If there is any doubt, prefer lower output and fewer controls.

---

# 5. What counts as pass/fail

## Pass

The first playable engine passes if:

- audio can start safely
- VCO 1 makes sound
- VCO 1 level changes loudness into the signal path
- low-pass cutoff changes brightness
- resonance changes tone without unsafe behaviour
- envelope opens and closes the VCA
- output remains low and controlled
- panic/stop silences the sound
- the static faceplate remains visually intact

## Fail

The first playable engine fails if:

- sound starts too loud
- output clips harshly or unpredictably
- panic/stop does not silence the sound
- hidden feedback or resonance can run away
- UI layout changes accidentally
- inert controls appear to work when they do not
- the first pass expands into a full synth engine

---

# 6. Implementation boundary for the later coding issue

The next coding issue should be named something like:

```text
Issue #20 — Add first safe audible voice only
```

It should implement only:

- safe audio context / audio start
- VCO 1 source
- simple VCO 1 level
- low-pass filter
- main VCA
- simple envelope to VCA
- master output safety
- panic/stop

It should not implement:

- full three-VCO engine
- noise source
- external input
- LFO modulation
- sample and hold
- repeat gate
- Expander utilities
- patch matrix
- presets
- MIDI learn
- JUCE
- VST
- exact MFOS emulation

---

# 7. Good enough target

The first engine pass should prove this only:

```text
The interface can make one safe, shaped, filterable sound.
```

That is enough.

Everything else waits until the first sound is stable.