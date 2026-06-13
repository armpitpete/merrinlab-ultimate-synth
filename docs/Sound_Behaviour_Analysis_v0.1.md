# Sound Behaviour Analysis v0.1

**Project:** MerrinLab Ultimate Synth  
**Issue:** #2 — Analyse schematics and mods for intended sound behaviour  
**Status:** First behaviour target for engine planning  

## Purpose

This document defines the first sound-behaviour target for MerrinLab Ultimate Synth.

It does not implement audio. It does not choose exact DSP algorithms. It does not claim exact circuit-level MFOS hardware emulation.

The goal is simpler and more useful at this stage:

```text
Define what the instrument should do and how the main sections should behave before any engine work starts.
```

## Source basis for this pass

This v0.1 behaviour target is based on the current repository documentation:

```text
docs/MFOS_Source_References_v0.1.md
docs/Interface_Component_Inventory_v0.1.md
docs/Static_Faceplate_Preview_Checkpoint_v0.1.md
docs/Faceplate_Label_Verification_v0.1.md
```

The source-reference note records the main MFOS Ultimate sections as:

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

It also records the Ultimate Expander as a companion system with extra signal and CV tools.

## Current limitation

This pass is a behaviour target, not a final schematic-derived model.

Exact component values, circuit quirks, calibration behaviour, and detailed mod behaviour still need deeper verification from schematics, parts lists, and panel wiring notes before exact modelling choices are made.

For now, use this document to guide the first engine design pass.

---

# 1. First engine behaviour target

## Core idea

MerrinLab Ultimate Synth should behave like one integrated software instrument inspired by the MFOS Sound Lab Ultimate and Ultimate Expander.

It should feel like a patchable analogue monosynth with:

- three main oscillators
- noise source
- mixer
- low-pass filter
- main VCA
- AR envelope
- ADSR envelope
- two LFOs
- sample and hold
- repeat gate
- attenuators
- expander utility processors
- simple software routing later

## First engine target

The first playable engine should be a single-voice synth with a clear fixed default signal path:

```text
VCO 1
VCO 2
VCO 3
Noise
External input placeholder
    ↓
Mixer
    ↓
Low-pass VCF
    ↓
Main VCA
    ↓
Output
```

Primary modulation target:

```text
Keyboard / MIDI pitch → VCO pitch
Gate → AR and/or ADSR trigger
AR → low-pass filter cutoff and main VCA
LFO 1 → low-pass filter cutoff
LFO 2 → main VCA level
Sample & Hold → optional pitch/filter modulation later
Repeat Gate → retrigger source later
```

Do not start with full patch-cable freedom. Start with a safe fixed path and a small number of clear modulation routings.

---

# 2. Section behaviour targets

## 2.1 VCOs

### Intended behaviour

The synth should have three main VCO sections.

Each VCO should provide:

- coarse frequency control
- fine frequency control
- waveform selection
- pulse-width control
- pitch control from keyboard or MIDI
- later CV-style modulation inputs

### First engine target

Core:

- VCO 1, VCO 2, and VCO 3 all produce pitched oscillator signals.
- Each VCO can be tuned separately.
- Each VCO can be mixed independently.
- Waveform choice should be simple at first.
- Pulse width should matter only when a pulse/square waveform is active.

Optional:

- oscillator sync
- linear and logarithmic pitch modulation distinction
- PWM input modulation
- multiple waveform outputs per VCO

Later:

- oscillator drift
- calibration behaviour
- analogue-style pitch instability
- source-panel-accurate waveform-output routing

Verify:

- exact waveform set
- exact behaviour of waveform icon outputs
- exact LIN-CV and LOG-CV roles
- sync behaviour

Reject for first engine pass:

- exact circuit-level VCO emulation claims
- hidden calibration controls exposed as main user controls

## 2.2 Mixer and noise

### Intended behaviour

The mixer combines the three VCOs, white noise, and external input before the main low-pass filter.

### First engine target

Core:

- VCO 1 level
- VCO 2 level
- VCO 3 level
- white noise level
- external input level as a placeholder or disabled input until real audio input exists
- summed mixer output into the low-pass filter

Optional:

- mixer soft saturation or level-dependent colour
- separate noise outputs
- external input processing

Later:

- exact gain staging from MFOS circuits
- mixer overload modelling
- external audio input support

Verify:

- whether the noise outputs are identical or separate noise colours
- exact mixer gain behaviour
- exact external input level behaviour

Reject for first engine pass:

- microphone or live input as a required first feature
- uncontrolled clipping or unsafe output gain

## 2.3 Low-pass VCF

### Intended behaviour

The main filter is a voltage-controlled low-pass filter marked 12dB/Oct.

It should shape the mixed oscillator/noise signal and provide the main subtractive-synth tone control.

### First engine target

Core:

- initial cutoff control
- resonance control
- AR modulation amount
- LFO 1 modulation amount
- external CV amount or placeholder
- filter receives the mixer output
- filter output feeds the main VCA

Optional:

- resonance character tuning
- cutoff keyboard tracking
- multiple external CV amounts

Later:

- exact filter response based on schematic study
- resonance gain compensation
- non-linear behaviour near high resonance

Verify:

- exact resonance range
- whether resonance self-oscillation is expected
- exact response of AR and LFO modulation controls
- exact role of the two EXT CV sockets

Reject for first engine pass:

- claiming exact MFOS filter emulation before schematic/value analysis
- unstable feedback/resonance behaviour without safety limits

## 2.4 Main VCA

### Intended behaviour

The main VCA controls final amplitude before the output.

It should be playable from envelopes and modulation sources.

### First engine target

Core:

- initial level control
- AR modulation amount
- LFO 2 modulation amount
- output level after VCA
- envelope-controlled amplitude for normal note playback

Optional:

- external CV input amount
- selectable AR/ADSR VCA source
- tremolo from LFO 2

Later:

- exact VCA response curve
- analogue-style bleed or non-linearity if desired

Verify:

- exact VCA control response
- exact EXT CV socket roles
- whether AR or ADSR should be the default amplitude envelope

Reject for first engine pass:

- allowing unsafe gain accumulation
- making VCA behaviour depend on undocumented patching

## 2.5 AR envelope

### Intended behaviour

The AR generator creates a simple attack-release contour.

It can be triggered or gated and can modulate filter cutoff and VCA level.

### First engine target

Core:

- attack time
- release time
- gate/trigger mode
- long/short range
- gate/trigger input from keyboard/MIDI gate
- AR output routed to low-pass filter modulation
- AR output optionally routed to main VCA modulation

Optional:

- manual gate control
- visible AR output routing
- trigger/gate mode difference exposed clearly

Later:

- exact timing ranges
- exact trigger retrigger behaviour
- analogue timing curve behaviour

Verify:

- exact trigger versus gate behaviour
- exact long/short range timing
- exact AR output levels

Reject for first engine pass:

- complex envelope looping unless the repeat gate behaviour requires it later

## 2.6 ADSR envelope

### Intended behaviour

The Expander adds a full ADSR envelope generator.

This should provide more conventional note shaping than the AR envelope.

### First engine target

Core:

- attack
- decay
- sustain
- release
- gate input from keyboard/MIDI gate
- range switch or timing range option
- ADSR output available as a modulation source

Optional:

- ADSR as selectable main VCA envelope
- ADSR as filter modulation source
- manual gate
- trigger input

Later:

- exact ADSR timing ranges
- exact trigger/gate interaction
- multiple ADSR outputs

Verify:

- exact ADSR range behaviour
- exact gate and trigger input roles
- whether ADSR should replace or supplement AR in the default patch

Reject for first engine pass:

- complex envelope curves before basic timing is stable

## 2.7 LFOs

### Intended behaviour

The synth has two low-frequency oscillators.

LFO 1 is already visually tied to filter modulation. LFO 2 is already visually tied to VCA modulation.

### First engine target

Core:

- LFO 1 rate
- LFO 2 rate
- high/low range behaviour
- simple waveform choice
- LFO 1 to filter cutoff modulation
- LFO 2 to VCA amplitude modulation

Optional:

- multiple waveform outputs
- free routing to other destinations
- tempo sync later

Later:

- exact waveform-output set from source panel icons
- phase reset options
- modulation matrix integration

Verify:

- exact LFO waveform outputs
- exact high/low ranges
- whether LFOs are free-running or resettable

Reject for first engine pass:

- tempo-synced complex modulation before the basic engine works

## 2.8 Sample and Hold

### Intended behaviour

The sample and hold section should capture a source signal at a sample rate or trigger and hold it as a stepped control voltage.

It should be useful for random pitch, filter, or modulation movement.

### First engine target

Core:

- sample rate control
- input source placeholder
- trigger input placeholder
- CV output as modulation source
- glide/slew amount
- visible LED/indicator later

Optional:

- internal noise as default source
- route S&H to pitch or filter cutoff
- external trigger from repeat gate

Later:

- selectable source routing
- quantised S&H
- probability/burst modes only if the project later wants expanded software features

Verify:

- exact sample input behaviour
- exact trigger behaviour
- exact glide/slew response
- exact role of unlabeled sockets

Reject for first engine pass:

- advanced Super S&H modes
- free patching before basic modulation routing exists

## 2.9 Repeat gate

### Intended behaviour

The repeat gate generates repeated gates/triggers at a controllable rate.

It should be able to drive rhythmic retriggering later.

### First engine target

Core:

- repeat gate rate control
- visible gate activity indicator later
- output usable as a trigger source later

Optional:

- repeat gate drives AR
- repeat gate drives S&H trigger
- repeat gate drives ADSR trigger

Later:

- sync to host tempo
- clock division/multiplication
- advanced rhythmic gate patterns

Verify:

- exact socket roles
- exact repeat gate output type
- whether it is always running or gated

Reject for first engine pass:

- full sequencer behaviour
- MIDI clock dependency as a first requirement

## 2.10 Attenuators

### Intended behaviour

Attenuators scale signals or control voltages.

In software, they should become utility processors for modulation and routing.

### First engine target

Core:

- treat attenuators as future modulation-depth utilities
- keep visible in the faceplate
- do not require them for the first fixed signal path

Optional:

- allow attenuators inside a future patch/routing view
- use attenuators to scale LFO, envelope, S&H, or external CV signals

Later:

- patch-matrix integration
- bipolar attenuation/inversion if the design later supports it

Verify:

- exact number and grouping of Ultimate and Expander attenuators
- whether any are intended for audio, CV, or both

Reject for first engine pass:

- free cable simulation as a prerequisite
- exposing every attenuator as a working processor before routing exists

## 2.11 State Variable VCF

### Intended behaviour

The Expander state-variable VCF adds a second filter with high-pass, band-pass, and low-pass outputs.

It should provide additional tone-shaping beyond the main low-pass filter.

### First engine target

Core:

- document as an engine-later module
- initial cutoff/frequency control
- resonance control
- input
- HP/BP/LP outputs later

Optional:

- route it after the main filter
- route it as an alternate filter path
- use it for parallel filtering

Later:

- full multi-output filter behaviour
- resonance CV
- dual-input behaviour
- routing matrix integration

Verify:

- exact meaning of INITIAL COF
- exact CV1/CV2 behaviour
- exact RES-CV behaviour
- exact output levels and phase relationships

Reject for first engine pass:

- making it mandatory in the first simple signal path

## 2.12 Expander utility modules

### Intended behaviour

The Expander adds utility tools that make the instrument more patchable.

These should be treated as routing/modulation processors, not as the first audio-engine requirement.

### First engine target

Core:

- document each utility module as a later engine feature
- keep them visible in the faceplate
- do not block the first playable synth on them

Utility behaviour targets:

| Module | Behaviour target | First-pass status |
|---|---|---|
| Ext. Signal Buffer | Boost/buffer external audio or signal input | Optional later |
| Analog Multiplier | Multiply two signals/CVs for ring-mod or modulation-style behaviour | Later |
| CV Inverter | Invert a control signal | Optional later |
| CV Distributor | Duplicate one CV to more than one destination | Optional later |
| Signal Mixer | Mix up to four signals | Optional later |
| Envelope Follower | Convert input amplitude into a control signal, with lag/smoothing | Later |
| Buffered Outputs | Provide named output points | Later |
| Aux VCA | Additional voltage-controlled amplifier | Optional later |

Verify:

- exact audio/CV expectations for each utility
- exact normalled or panel-wired relationships
- exact output routing

Reject for first engine pass:

- requiring all utility modules before a basic playable voice exists

---

# 3. Mod handling classification

This v0.1 pass does not adopt any mods automatically.

| Category | Current decision |
|---|---|
| Core | Original main signal path: VCOs, noise, mixer, low-pass VCF, main VCA, AR/ADSR, basic LFO modulation. |
| Optional | Expander utility routing, selectable AR/ADSR destinations, simple external CV-style modulation. |
| Later | Host sync, advanced S&H modes, oscillator drift, saturation modelling, state-variable VCF routing, full patch matrix. |
| Reject | Exact hardware-emulation claims before schematic/BOM verification; unsafe resonance/gain behaviour; full free-cable simulation as first requirement. |
| Verify | Any MFOS mod or builder variation that affects sound, routing, control ranges, calibration, or panel behaviour. |

## Mod rule

A mod should enter the software design only if it passes this test:

```text
Does this make the software instrument clearer, more playable, or more faithful to the useful MFOS behaviour without overloading the first build?
```

If not, it waits.

---

# 4. First engine design boundary

## In scope for first engine planning

- single voice
- three oscillator sources
- noise source
- simple mixer
- low-pass filter
- main VCA
- AR and/or ADSR envelope triggering
- LFO 1 to filter modulation
- LFO 2 to amplitude modulation
- master output safety

## Out of scope for first engine planning

- full patch matrix
- full Expander routing
- exact circuit emulation
- full mod set
- host sync
- presets
- MIDI learn
- JUCE/VST implementation
- hardware-accurate calibration controls
- BOM-derived component modelling

---

# 5. Recommended first playable patch

The first audible patch should be deliberately simple:

```text
VCO 1 saw or pulse
    ↓
Mixer
    ↓
Low-pass VCF
    ↓
Main VCA
    ↓
Output

Gate → ADSR or AR
Envelope → VCA
LFO 1 → small filter modulation
```

Then add:

1. VCO 2 level
2. VCO 3 level
3. white noise level
4. resonance
5. AR-to-filter modulation
6. LFO 2-to-VCA modulation
7. S&H-to-filter or pitch modulation later

Do not start by making every visible control functional.

---

# 6. Final v0.1 decision

This is the intended behaviour target for the first engine design pass.

The first engine should prove the basic voice before modelling every MFOS or Expander detail.

A later pass can analyse schematics, parts lists, calibration notes, and specific mods in more detail. That deeper work should refine this document rather than replace it.