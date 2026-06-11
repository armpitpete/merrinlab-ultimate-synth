# MerrinLab Ultimate Synth — Interface Component Inventory v0.1

## Purpose

This document is the first faceplate-first component inventory for MerrinLab Ultimate Synth.

The goal is to list the planned interface components for a standalone/VST instrument that combines the MFOS Ultimate and MFOS Ultimate Expander concepts into one complete software interface.

This is a design scaffold. It is not yet a verified clone of the original hardware panels.

## Inventory status labels

| Status | Meaning |
|---|---|
| Planned | Intended for the final software interface |
| Verify | Needs checking against the original MFOS panel/schematic/documentation |
| Design only | May appear on the faceplate/wireframe before it is functional |
| Engine later | Requires DSP/engine work before it can function |
| Active later | Should become functional in a later build |

## Current rule

Use a faceplate-first workflow.

Design the full interface early as a component map and faceplate/wireframe.

Then implement the synth engine and control mapping section by section.

Controls may appear in the design before they are functional, but unimplemented controls must be tracked clearly.

## High-level interface zones

| Zone | Purpose | Status |
|---|---|---|
| Global / Header | Presets, MIDI, panic, settings, master indicators | Planned |
| Oscillators | Main sound sources | Planned |
| Mixer | Combines oscillators, noise, and external/input sources | Planned |
| Filter | Tone shaping and resonance | Planned |
| VCA / Output | Final level and audio output | Planned |
| Envelopes | AR and ADSR control shapes | Planned |
| LFO / Modulation | Slow control signals and vibrato-style movement | Planned |
| Expander | Extra routing, modulation, utility controls | Planned |
| Patch / Routing View | Software modulation and signal routing | Planned |
| Preset Browser | Save, load, and manage patches | Planned |

---

# 1. Global / Header Section

| Component | Type | Purpose | Status |
|---|---|---|---|
| Plugin name / logo | Label | Product identity | Planned |
| Preset name display | Display | Shows current preset | Planned |
| Previous preset | Button | Step to previous preset | Engine later |
| Next preset | Button | Step to next preset | Engine later |
| Save preset | Button | Save current patch | Engine later |
| Load preset / browser | Button | Open preset browser | Engine later |
| MIDI activity indicator | LED / indicator | Shows incoming MIDI | Engine later |
| Audio activity meter | Meter | Shows output level | Engine later |
| Panic / all notes off | Button | Stops stuck notes | Planned |
| Settings | Button | Opens settings/options | Planned |
| Master tune | Knob | Global tuning offset | Planned |
| Master output level | Knob | Final output gain | Planned |

---

# 2. Oscillator Section

## 2.1 VCO 1

| Component | Type | Purpose | Status |
|---|---|---|---|
| VCO 1 enable | Switch | Turns oscillator on/off | Planned |
| VCO 1 coarse tune | Knob | Main pitch range | Planned |
| VCO 1 fine tune | Knob | Small pitch adjustment | Planned |
| VCO 1 waveform selector | Selector | Selects waveform | Planned |
| VCO 1 pulse width | Knob | Sets pulse width when pulse wave is used | Engine later |
| VCO 1 PWM amount | Knob | Amount of pulse width modulation | Engine later |
| VCO 1 pitch modulation amount | Knob | Amount of pitch modulation | Engine later |
| VCO 1 sync option | Switch | Hard/soft sync behaviour if implemented | Verify |
| VCO 1 level to mixer | Knob | Sends VCO 1 to mixer | Planned |
| VCO 1 status indicator | LED / indicator | Shows oscillator active state | Design only |

## 2.2 VCO 2

| Component | Type | Purpose | Status |
|---|---|---|---|
| VCO 2 enable | Switch | Turns oscillator on/off | Planned |
| VCO 2 coarse tune | Knob | Main pitch range | Planned |
| VCO 2 fine tune | Knob | Small pitch adjustment | Planned |
| VCO 2 waveform selector | Selector | Selects waveform | Planned |
| VCO 2 pulse width | Knob | Sets pulse width when pulse wave is used | Engine later |
| VCO 2 PWM amount | Knob | Amount of pulse width modulation | Engine later |
| VCO 2 pitch modulation amount | Knob | Amount of pitch modulation | Engine later |
| VCO 2 sync option | Switch | Hard/soft sync behaviour if implemented | Verify |
| VCO 2 level to mixer | Knob | Sends VCO 2 to mixer | Planned |
| VCO 2 status indicator | LED / indicator | Shows oscillator active state | Design only |

## 2.3 VCO 3

| Component | Type | Purpose | Status |
|---|---|---|---|
| VCO 3 enable | Switch | Turns oscillator on/off | Planned |
| VCO 3 coarse tune | Knob | Main pitch range | Planned |
| VCO 3 fine tune | Knob | Small pitch adjustment | Planned |
| VCO 3 waveform selector | Selector | Selects waveform | Planned |
| VCO 3 pulse width | Knob | Sets pulse width when pulse wave is used | Engine later |
| VCO 3 PWM amount | Knob | Amount of pulse width modulation | Engine later |
| VCO 3 pitch modulation amount | Knob | Amount of pitch modulation | Engine later |
| VCO 3 low-frequency mode | Switch | Lets VCO 3 act as a modulation oscillator if wanted | Verify |
| VCO 3 level to mixer | Knob | Sends VCO 3 to mixer | Planned |
| VCO 3 status indicator | LED / indicator | Shows oscillator active state | Design only |

---

# 3. Noise / External Source Section

| Component | Type | Purpose | Status |
|---|---|---|---|
| Noise enable | Switch | Turns noise source on/off | Planned |
| Noise colour selector | Selector | Selects noise type if implemented | Verify |
| Noise level to mixer | Knob | Sends noise to mixer | Planned |
| External/input enable | Switch | Enables external/input source path | Verify |
| External/input level | Knob | Sets external/input level | Planned |
| External/input monitor | Button / switch | Audition or monitor external/input path | Design only |

---

# 4. Mixer Section

| Component | Type | Purpose | Status |
|---|---|---|---|
| VCO 1 mixer level | Knob | Controls VCO 1 level | Planned |
| VCO 2 mixer level | Knob | Controls VCO 2 level | Planned |
| VCO 3 mixer level | Knob | Controls VCO 3 level | Planned |
| Noise mixer level | Knob | Controls noise level | Planned |
| External/input mixer level | Knob | Controls external/input level | Planned |
| Mixer drive | Knob | Adds saturation/drive if implemented | Engine later |
| Mixer output level | Knob | Sets level into filter | Planned |
| Mixer output meter | Meter | Shows mixer signal level | Design only |

---

# 5. Filter Section

| Component | Type | Purpose | Status |
|---|---|---|---|
| Filter enable / bypass | Switch | Turns filter processing on/off | Planned |
| Filter cutoff | Knob | Main brightness/tone control | Planned |
| Filter resonance | Knob | Emphasises cutoff frequency | Planned |
| Filter mode selector | Selector | Low-pass/high-pass/band-pass if implemented | Verify |
| Filter keyboard tracking | Knob / switch | Lets MIDI pitch affect cutoff | Engine later |
| Filter envelope amount | Knob | Envelope modulation depth | Planned |
| Filter LFO amount | Knob | LFO modulation depth | Planned |
| Filter velocity amount | Knob | Velocity-to-cutoff depth | Engine later |
| Filter input level | Knob | Level into filter | Planned |
| Filter output level | Knob | Level out of filter | Planned |
| Filter activity indicator | LED / indicator | Shows filter modulation/activity | Design only |

---

# 6. VCA / Output Section

| Component | Type | Purpose | Status |
|---|---|---|---|
| VCA level | Knob | Main amplitude level | Planned |
| VCA envelope amount | Knob | Envelope-to-amplitude depth | Planned |
| VCA velocity amount | Knob | Velocity-to-amplitude depth | Engine later |
| VCA drone / hold mode | Switch | Allows continuous sound if implemented | Verify |
| Final output level | Knob | Master signal level | Planned |
| Output meter | Meter | Shows final output | Planned |
| Clip indicator | LED / indicator | Shows output clipping | Engine later |
| Headphone level | Knob | Separate headphone level if included | Verify |

---

# 7. AR Envelope Section

| Component | Type | Purpose | Status |
|---|---|---|---|
| AR enable | Switch | Enables AR envelope routing | Planned |
| AR attack | Knob | Rise time | Planned |
| AR release | Knob | Fall time | Planned |
| AR gate/trigger mode | Switch | Selects gate or trigger behaviour | Verify |
| AR repeat / cycle | Switch | Cycles envelope if implemented | Verify |
| AR amount to filter | Knob | Sends AR to filter | Engine later |
| AR amount to VCA | Knob | Sends AR to VCA | Engine later |
| AR activity indicator | LED / indicator | Shows envelope movement | Design only |

---

# 8. ADSR Envelope Section

| Component | Type | Purpose | Status |
|---|---|---|---|
| ADSR enable | Switch | Enables ADSR envelope routing | Planned |
| ADSR attack | Knob | Attack time | Planned |
| ADSR decay | Knob | Decay time | Planned |
| ADSR sustain | Knob | Sustain level | Planned |
| ADSR release | Knob | Release time | Planned |
| ADSR gate source selector | Selector | Selects MIDI gate or other source | Verify |
| ADSR amount to filter | Knob | Sends ADSR to filter | Planned |
| ADSR amount to VCA | Knob | Sends ADSR to VCA | Planned |
| ADSR activity indicator | LED / indicator | Shows envelope movement | Design only |

---

# 9. LFO / Modulation Section

| Component | Type | Purpose | Status |
|---|---|---|---|
| LFO enable | Switch | Enables LFO | Planned |
| LFO rate | Knob | LFO speed | Planned |
| LFO depth | Knob | Overall modulation depth | Planned |
| LFO waveform selector | Selector | Selects LFO shape | Planned |
| LFO sync to tempo | Switch | Syncs LFO to host tempo if implemented | Engine later |
| LFO fade-in | Knob | Delayed modulation depth rise | Verify |
| Vibrato amount | Knob | Pitch modulation depth | Planned |
| Filter modulation amount | Knob | Filter LFO depth | Planned |
| PWM modulation amount | Knob | Pulse-width LFO depth | Engine later |
| LFO activity indicator | LED / indicator | Shows LFO motion | Design only |

---

# 10. Expander / Routing Section

This section represents the software version of the Expander concept. Exact controls must be checked against the original Expander panel before locking final counts.

| Component | Type | Purpose | Status |
|---|---|---|---|
| Expander enable | Switch | Enables expander section | Planned |
| Expander input source selector | Selector | Chooses source feeding expander processing/routing | Verify |
| Expander level | Knob | Main expander level | Verify |
| Expander filter CV amount | Knob | Extra filter modulation amount | Verify |
| Expander VCA CV amount | Knob | Extra amplitude modulation amount | Verify |
| Expander modulation source A | Selector | Chooses modulation source | Verify |
| Expander modulation source B | Selector | Chooses modulation source | Verify |
| Expander modulation depth A | Knob | Depth for source A | Verify |
| Expander modulation depth B | Knob | Depth for source B | Verify |
| Expander route to filter | Switch | Routes expander modulation to filter | Verify |
| Expander route to oscillator | Switch | Routes expander modulation to pitch/PWM | Verify |
| Expander route to VCA | Switch | Routes expander modulation to amplitude | Verify |
| Expander output level | Knob | Output level from expander path | Verify |
| Expander activity indicator | LED / indicator | Shows expander activity | Design only |

---

# 11. Patch / Routing View

The standalone/VST version does not need to copy every hardware jack directly onto the main performance view.

Patch points can become software routing slots, modulation matrix rows, or an advanced patching page.

| Component | Type | Purpose | Status |
|---|---|---|---|
| Routing page button | Button | Opens routing view | Planned |
| Modulation matrix | Table / grid | Assigns sources to destinations | Engine later |
| Source selector | Selector | Chooses modulation source | Planned |
| Destination selector | Selector | Chooses modulation destination | Planned |
| Modulation amount | Knob / value control | Sets depth | Planned |
| Polarity selector | Switch | Bipolar/unipolar behaviour | Engine later |
| Route enable | Switch | Turns routing row on/off | Planned |
| Clear route | Button | Removes route | Planned |
| Hardware-style patch bay view | Optional visual view | Shows patch-style routing if wanted | Design only |

---

# 12. Preset Browser

| Component | Type | Purpose | Status |
|---|---|---|---|
| Preset browser panel | Panel | Shows preset list | Engine later |
| Preset search | Text field | Search presets | Engine later |
| Preset category filter | Selector | Filter by type | Engine later |
| Preset author/source field | Label / metadata | Shows preset metadata | Engine later |
| Save as new preset | Button | Saves new preset | Engine later |
| Overwrite preset | Button | Updates preset | Engine later |
| Init patch | Button | Resets synth to basic patch | Planned |
| Randomise safe controls | Button | Optional controlled randomisation | Design only |

---

# 13. Items to verify against source material

Before the final faceplate is locked, verify:

- exact Ultimate panel control names
- exact Expander panel control names
- which controls are pots, switches, LEDs, and jacks on the original units
- which hardware patch points should become visible main-panel controls
- which patch points should move into an advanced routing view
- whether any original controls should be renamed for software clarity
- whether both units should appear on one large page or one main page plus advanced pages

---

# 14. Current implementation status

| Area | Design status | Engine status | UI code status |
|---|---|---|---|
| Global/Header | Scaffolded | Not started | Not started |
| Oscillators | Scaffolded | Not started | Not started |
| Mixer | Scaffolded | Not started | Not started |
| Filter | Scaffolded | Not started | Not started |
| VCA/Output | Scaffolded | Not started | Not started |
| AR Envelope | Scaffolded | Not started | Not started |
| ADSR Envelope | Scaffolded | Not started | Not started |
| LFO/Modulation | Scaffolded | Not started | Not started |
| Expander | Scaffolded, needs verification | Not started | Not started |
| Patch/Routing View | Scaffolded | Not started | Not started |
| Preset Browser | Scaffolded | Not started | Not started |

## Next design task

Replace scaffold names with verified component names from the Ultimate and Expander source drawings/panel references.

Then make the first rough faceplate/wireframe from this inventory.
