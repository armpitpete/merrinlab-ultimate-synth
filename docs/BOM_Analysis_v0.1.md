# BOM Analysis v0.1

**Project:** MerrinLab Ultimate Synth  
**Issue:** #3 — Analyse BOMs for component values and modelling clues  
**Status:** First BOM/component-clue analysis for software planning  

## Purpose

This document records the BOM and component-list clues that matter for software behaviour.

It is not a shopping list. It is not a hardware build checklist. It does not buy parts. It does not implement DSP code. It does not claim exact software behaviour from component values alone.

The goal is:

```text
These are the BOM/component clues that matter for software behaviour, and these are the ones that must wait.
```

## Source basis for this pass

This v0.1 pass is based on the current repository notes and verified panel/component inventory:

```text
docs/MFOS_Source_References_v0.1.md
docs/Interface_Component_Inventory_v0.1.md
docs/Sound_Behaviour_Analysis_v0.1.md
docs/Faceplate_Label_Verification_v0.1.md
```

The source-reference note identifies the MFOS pages that should be used for deeper verification:

- Sound Lab ULTIMATE — Parts List
- Sound Lab ULTIMATE — Schematics
- Sound Lab ULTIMATE — Panel Wiring
- Sound Lab ULTIMATE — Mods
- ULTIMATE EXPANDER — Parts List
- ULTIMATE EXPANDER — Schematics
- ULTIMATE EXPANDER — Panel Wiring
- ULTIMATE EXPANDER — Panel Drawings

The exact full BOM tables are not copied into this repository in this pass. Do not invent resistor values, capacitor values, IC part numbers, or calibration details that have not been verified from source material.

## Current limitation

This document is a first software-planning analysis, not a final component-value extraction.

Exact values must wait until the original MFOS parts lists, schematics, and panel wiring pages have been checked directly.

---

# 1. How BOM information matters for a software synth

BOM and parts-list information can help a software synth project in five ways.

| BOM clue | Why it matters for software |
|---|---|
| Pot values and tapers | Helps infer control feel, range, and response curve. |
| Switch types | Confirms whether a control is binary, multi-position, momentary, or range-selecting. |
| Capacitor/resistor timing networks | Helps estimate envelope, LFO, glide, sample-rate, and lag behaviour. |
| IC/transistor choices | Helps identify broad circuit type and possible character, but does not prove exact software behaviour alone. |
| Trimmers/calibration parts | Helps separate internal hardware calibration from user-facing software controls. |

## Important rule

BOM clues can guide modelling priorities, but they do not automatically define the DSP model.

Use BOM evidence to decide what needs careful behaviour design, not to claim exact hardware emulation.

---

# 2. First-pass component clues by section

## 2.1 VCOs

### What the BOM can clarify

The VCO BOM and schematic references should clarify:

- oscillator core type
- timing capacitor choices
- pitch scaling components
- coarse/fine tuning range clues
- pulse-width control behaviour
- sync input implementation
- LIN-CV versus LOG-CV implementation
- calibration trimmers

### Software relevance

Core:

- VCOs need stable pitched oscillator behaviour.
- Coarse and fine tuning should feel musically useful.
- Pulse width should affect pulse/square waveform output.

Optional:

- LIN-CV and LOG-CV can become distinct modulation modes later.
- Sync can wait until the basic oscillator engine is stable.

Later:

- oscillator drift or calibration-style behaviour.
- source-panel-accurate waveform output behaviour.

Verify:

- exact waveform set
- exact waveform output roles
- exact pitch range
- exact coarse/fine control response
- exact sync behaviour
- exact PWM behaviour

Reject for first engine pass:

- exposing internal calibration trimmers as normal user controls
- claiming hardware-accurate VCO drift from BOM clues alone

## 2.2 Mixer and noise source

### What the BOM can clarify

The mixer/noise BOM should clarify:

- whether the mixer is built around op-amp summing or another topology
- gain staging clues
- white-noise source type
- whether noise has one or more distinct outputs
- whether the external input has buffering or gain before mixing

### Software relevance

Core:

- The first software mixer should mix VCO 1, VCO 2, VCO 3, noise, and external-input placeholder.
- Noise should be available as a white-noise source.
- Mixer output should feed the low-pass filter.

Optional:

- gentle mixer saturation if later evidence or listening tests justify it.
- separate noise-output behaviour if verified.

Later:

- exact gain staging.
- external audio input and buffer behaviour.

Verify:

- mixer gain behaviour
- noise source type
- whether the noise outputs are identical or different
- external input gain/buffer behaviour

Reject for first engine pass:

- uncontrolled saturation
- live external input as a required first feature

## 2.3 Main low-pass VCF

### What the BOM can clarify

The filter BOM should clarify:

- filter topology clues
- cutoff control range
- resonance control range
- whether resonance is expected to self-oscillate
- CV input scaling
- whether calibration/trimmer parts are present

### Software relevance

Core:

- The main VCF should be a 12dB/oct low-pass filter.
- It needs initial cutoff, resonance, AR modulation, LFO 1 modulation, and external CV placeholder behaviour.

Optional:

- resonance colour tuning.
- keyboard tracking if supported later.

Later:

- exact non-linearity or resonance gain behaviour.
- circuit-informed response curves.

Verify:

- exact resonance behaviour
- whether high resonance self-oscillation is expected
- CV scaling
- any calibration points that should stay internal

Reject for first engine pass:

- unsafe resonance or feedback levels
- exact hardware-emulation claims without schematic and value verification

## 2.4 Main VCA

### What the BOM can clarify

The VCA BOM should clarify:

- VCA core type
- response curve clues
- control-voltage scaling
- initial-level range
- whether amplitude can fully close
- calibration or trimming requirements

### Software relevance

Core:

- Main VCA should control final amplitude.
- It should respond to envelope modulation.
- It should have safe output gain.

Optional:

- LFO 2 tremolo.
- selectable AR or ADSR envelope source.

Later:

- analogue-style bleed or response curve.

Verify:

- whether the VCA fully closes
- control response curve
- external CV role
- internal calibration parts

Reject for first engine pass:

- gain stacking that can exceed safe output level
- making trimmers user-facing controls

## 2.5 AR generator

### What the BOM can clarify

The AR generator BOM should clarify:

- timing capacitor/resistor choices
- long/short range behaviour
- gate versus trigger implementation
- manual gate hardware type
- output level and polarity clues

### Software relevance

Core:

- AR should provide attack and release times.
- AR should support gate/trigger behaviour.
- AR should modulate filter cutoff and optionally VCA amplitude.

Optional:

- manual gate button.
- exact long/short range display.

Later:

- exact timing ranges.
- analogue timing curves.

Verify:

- timing range values
- gate/trigger difference
- output level and polarity
- retrigger behaviour

Reject for first engine pass:

- complex looping behaviour unless separately verified

## 2.6 ADSR envelope

### What the BOM can clarify

The ADSR BOM should clarify:

- timing ranges
- sustain level behaviour
- gate and trigger input roles
- long/short range implementation
- manual gate hardware behaviour
- output level and polarity

### Software relevance

Core:

- ADSR should become the conventional playable note-shaping envelope.
- It should be available as a modulation source.

Optional:

- make ADSR selectable as the default VCA envelope.
- route ADSR to filter cutoff.

Later:

- exact timing ranges.
- multiple outputs.
- trigger/gate interaction.

Verify:

- exact range switch behaviour
- gate/trig input behaviour
- output level and polarity

Reject for first engine pass:

- modelling complex envelope quirks before basic timing works

## 2.7 LFOs

### What the BOM can clarify

The LFO BOM should clarify:

- timing capacitor/resistor choices
- high/low range timing
- waveform generation method
- output waveform set
- output levels and polarity

### Software relevance

Core:

- LFO 1 should modulate filter cutoff.
- LFO 2 should modulate VCA level.
- Both should have a rate control and range option.

Optional:

- waveform choice.
- free routing later.

Later:

- exact waveform shapes.
- exact range values.
- phase/reset behaviour if supported.

Verify:

- waveform output set
- high/low timing ranges
- output amplitude/polarity

Reject for first engine pass:

- tempo sync as a first requirement
- complex modulation matrix dependency

## 2.8 Sample and Hold

### What the BOM can clarify

The S&H BOM should clarify:

- sample clock/source behaviour
- sample input behaviour
- trigger input role
- glide/slew timing components
- LED/indicator behaviour
- output range and polarity

### Software relevance

Core:

- S&H should eventually output stepped modulation.
- Glide should smooth the stepped output.
- It should not block the first fixed-voice engine.

Optional:

- internal noise as default source.
- route S&H to filter or pitch.

Later:

- selectable input sources.
- exact glide curve.
- repeat-gate triggering.

Verify:

- exact trigger behaviour
- exact sample source behaviour
- exact output range
- exact role of unlabeled sockets

Reject for first engine pass:

- advanced probability, quantised, or burst modes

## 2.9 Repeat gate

### What the BOM can clarify

The repeat-gate BOM should clarify:

- rate range
- gate/trigger output type
- indicator behaviour
- whether the circuit free-runs or depends on a gate/source condition
- timing components

### Software relevance

Core:

- Repeat gate should later act as a retrigger source.
- It should not be treated as a sequencer.

Optional:

- drive AR or ADSR retriggering.
- trigger S&H.

Later:

- host-sync option.
- clock division/multiplication only if the software design expands.

Verify:

- exact socket roles
- exact rate range
- output polarity/shape
- always-running versus gated behaviour

Reject for first engine pass:

- full sequencer behaviour
- MIDI clock dependency

## 2.10 Attenuators

### What the BOM can clarify

The attenuator BOM should clarify:

- number of attenuator channels
- pot values and taper
- whether attenuators are passive or buffered
- whether they are expected for audio, CV, or both

### Software relevance

Core:

- Attenuators should be treated as future modulation-depth utilities.
- They do not need to work in the first fixed signal path.

Optional:

- use them in a later patch/routing view.
- use them to scale LFO, envelope, S&H, or external CV signals.

Later:

- bipolar attenuation or inversion if supported by the software design.

Verify:

- exact channel count and grouping between Ultimate and Expander.
- passive/buffered behaviour.
- audio/CV expectations.

Reject for first engine pass:

- making every attenuator functional before routing exists.

## 2.11 State Variable VCF

### What the BOM can clarify

The state-variable VCF BOM should clarify:

- filter topology
- frequency range
- resonance range
- CV1 and CV2 scaling
- RES-CV behaviour
- HP/BP/LP output levels and phase relationships
- whether calibration parts exist

### Software relevance

Core:

- The state-variable VCF is important, but not required for the first fixed voice.
- It should be documented as an engine-later filter.

Optional:

- parallel filtering.
- alternate filter path.
- serial filtering after the main low-pass filter.

Later:

- multi-output SVF modelling.
- resonance CV.
- routing matrix support.

Verify:

- exact meaning of INITIAL COF.
- exact output behaviour.
- exact CV input scaling.

Reject for first engine pass:

- making this filter mandatory before the main voice works.

## 2.12 Expander utility modules

### What the BOM can clarify

The Expander BOM should clarify whether each utility module is primarily audio, CV, or both.

| Module | BOM clue needed | Software relevance |
|---|---|---|
| Ext. Signal Buffer | Gain range, buffer type, output behaviour | External input handling later |
| Analog Multiplier | Signal range, IC/topology clues, output scaling | Ring-mod / CV multiplication later |
| CV Inverter | Input/output scaling and polarity | Modulation utility later |
| CV Distributor | Buffered/passive behaviour | Routing utility later |
| Signal Mixer | Gain staging and line-out select behaviour | Secondary mixer later |
| Envelope Follower | lag timing, input range, output range | Audio-to-CV feature later |
| Buffered Outputs | output source and buffering | Named output routing later |
| Aux VCA | response curve and CV scaling | Additional VCA later |

### First engine decision

These modules are valuable for the full instrument, but they should not delay the first playable voice.

Verify exact behaviour before implementation.

---

# 3. What affects first engine planning now

The following clues affect first engine planning immediately:

| Area | Planning effect |
|---|---|
| Three VCOs | Build the engine around three oscillator sources, not one hidden oscillator. |
| Mixer/noise path | Include VCO levels and noise level early. |
| 12dB/oct low-pass VCF | Main tone path should use a low-pass filter as the first filter target. |
| VCA and envelopes | First playable voice needs envelope-controlled amplitude. |
| AR and ADSR both exist | Choose a simple first default, but keep both in the architecture. |
| LFO 1 and LFO 2 are tied to obvious modulation roles | LFO 1 to filter and LFO 2 to VCA are sensible first modulation paths. |
| S&H and repeat gate exist | Leave hooks for modulation/retriggering later. |
| Expander utilities exist | Plan routing architecture, but do not implement all utilities first. |

---

# 4. What must wait

The following should wait for deeper source verification:

- exact resistor values
- exact capacitor values
- exact IC/transistor choices
- exact potentiometer values and tapers
- exact switch hardware types
- exact timing ranges
- exact CV scaling
- exact output voltage ranges
- exact calibration/trimmer functions
- exact resonance behaviour
- exact envelope curves
- exact LFO waveform shapes
- exact S&H sample/hold/glide behaviour
- exact Expander utility gain/range behaviour

These details may refine the engine later, but they should not block the first basic voice.

---

# 5. Inventory corrections from this pass

No direct inventory correction is made in this v0.1 pass.

Reason:

The current repo does not contain verified copied BOM tables or extracted component values. The existing interface inventory already records the visible controls, section names, and verification states. Updating it with guessed values would make the documentation less reliable.

Instead, this document creates a clear verification queue for the later value-extraction pass.

---

# 6. Sound-behaviour note from this pass

The v0.1 sound-behaviour document remains valid.

This BOM analysis supports its first-engine boundary:

- build a simple fixed voice first
- keep three VCOs, noise, mixer, low-pass VCF, VCA, and envelope control central
- defer full Expander utility modelling
- defer exact hardware-emulation claims
- defer detailed component-value modelling

No update to `docs/Sound_Behaviour_Analysis_v0.1.md` is required yet.

---

# 7. Recommended later BOM extraction pass

A later issue should extract verified source values from the original MFOS parts lists and schematics into a separate document, probably:

```text
docs/BOM_Value_Extraction_v0.1.md
```

That later pass should record:

| Field | Purpose |
|---|---|
| Section | VCO, VCF, VCA, AR, ADSR, LFO, etc. |
| Component or BOM item | Exact source-listed part or component. |
| Value / type | Exact value or type from source. |
| User-facing? | Whether it appears as a normal control. |
| Internal calibration? | Whether it should stay hidden in software. |
| Software relevance | What it may affect. |
| Confidence | Verified / needs schematic check / unclear. |

Do not mix that extraction with engine implementation.

---

# 8. Final v0.1 decision

These are the BOM/component clues that matter for software behaviour:

- control types and response clues
- timing components for envelopes, LFOs, glide, lag, and repeat gate
- filter and VCA topology clues
- noise and mixer gain clues
- calibration/trimmer clues
- audio-versus-CV utility clues

These must wait:

- exact values
- exact circuit modelling
- exact calibration behaviour
- exact hardware-emulation claims
- DSP implementation

This document is enough for the current planning stage. A later extraction pass can add exact values when verified source BOM material is available.