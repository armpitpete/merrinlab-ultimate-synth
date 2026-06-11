# MerrinLab Ultimate Synth — Interface Component Inventory v0.1

## Purpose

This document is the first faceplate-first component inventory for MerrinLab Ultimate Synth.

The goal is to list the planned interface components for a standalone/VST instrument that combines the MFOS Ultimate and MFOS Ultimate Expander concepts into one complete software interface.

This is a design scaffold that is now being corrected against the uploaded MFOS source capture.

## Inventory status labels

| Status | Meaning |
|---|---|
| Verified | Visible label checked against the uploaded MFOS source capture |
| Verified label / Verify role | Front-panel text is visible, but exact electrical role still needs wiring/schematic confirmation |
| Verify | Needs checking against the original MFOS panel/schematic/documentation |
| Planned | Intended for the final software interface |
| Design only | May appear on the faceplate/wireframe before it is functional |
| Engine later | Requires DSP/engine work before it can function |
| Active later | Should become functional in a later build |

## Source extraction used for this pass

This pass uses:

```text
docs/Ultimate_Front_Panel_Label_Extraction_v0.1.md
```

Primary archive files behind that extraction:

```text
Sound Lab Ultimate/Panel And Wiring_files/front_panel_silk_990px.gif
Sound Lab Ultimate/Panel And Wiring_files/panel_silk_correlation_500px.gif
Sound Lab Ultimate/Panel And Wiring_files/aux_panel_silkscreen.gif
```

## Current rule

Use a faceplate-first workflow.

Design the full interface early as a component map and faceplate/wireframe.

Then implement the synth engine and control mapping section by section.

Controls may appear in the design before they are functional, but unimplemented controls must be tracked clearly.

## High-level interface zones

| Zone | Purpose | Status |
|---|---|---|
| Global / Header | Presets, MIDI, panic, settings, master indicators | Planned |
| Sound Lab Ultimate | Verified Ultimate front-panel source sections | Partly verified |
| Sound Lab Ultimate Auxiliary Panel | External CV/audio connections | Verified labels |
| Sound Lab Ultimate Expander | Extra routing, modulation, utility controls | Verify |
| Patch / Routing View | Software modulation and signal routing | Planned |
| Preset Browser | Save, load, and manage patches | Planned |

---

# 1. Global / Header Section

These are software-product controls, not copied directly from the MFOS hardware panel.

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

# 2. Sound Lab Ultimate — Main Front Panel

## 2.1 VCO 1

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| VCO 1 | VCO 1 section heading | Label | Oscillator 1 section | Verified |
| COARSE FREQ | VCO 1 coarse frequency | Knob | Main oscillator tuning | Verified |
| FINE FREQ | VCO 1 fine frequency | Knob | Fine oscillator tuning | Verified |
| WAVEFORM | VCO 1 waveform selector | Selector / switch | Panel uses waveform icons rather than text values | Verified label / Verify role |
| PULSE WIDTH % | VCO 1 pulse width | Knob | Pulse-width control, marked 10–90 | Verified |
| waveform icon | VCO 1 waveform output A | Jack / socket | Output identified by icon, exact waveform to verify | Verify |
| waveform icon | VCO 1 waveform output B | Jack / socket | Output identified by icon, exact waveform to verify | Verify |
| PWM | VCO 1 PWM input | Jack / socket | Pulse-width modulation input | Verified label / Verify role |
| SYNC | VCO 1 sync input | Jack / socket | Oscillator sync input | Verified label / Verify role |
| LOG-CV | VCO 1 log CV input | Jack / socket | Logarithmic pitch/control-voltage input | Verified label / Verify role |
| LIN-CV | VCO 1 linear CV input | Jack / socket | Linear pitch/control-voltage input | Verified label / Verify role |
| unlabeled | VCO 1 unlabeled lower socket | Jack / socket | Visible but no readable front-panel label | Verify |

## 2.2 VCO 2

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| VCO 2 | VCO 2 section heading | Label | Oscillator 2 section | Verified |
| COARSE FREQ | VCO 2 coarse frequency | Knob | Main oscillator tuning | Verified |
| FINE FREQ | VCO 2 fine frequency | Knob | Fine oscillator tuning | Verified |
| WAVEFORM | VCO 2 waveform selector | Selector / switch | Panel uses waveform icons rather than text values | Verified label / Verify role |
| PULSE WIDTH % | VCO 2 pulse width | Knob | Pulse-width control, marked 10–90 | Verified |
| waveform icon | VCO 2 waveform output A | Jack / socket | Output identified by icon, exact waveform to verify | Verify |
| waveform icon | VCO 2 waveform output B | Jack / socket | Output identified by icon, exact waveform to verify | Verify |
| PWM | VCO 2 PWM input | Jack / socket | Pulse-width modulation input | Verified label / Verify role |
| SYNC | VCO 2 sync input | Jack / socket | Oscillator sync input | Verified label / Verify role |
| LOG-CV | VCO 2 log CV input | Jack / socket | Logarithmic pitch/control-voltage input | Verified label / Verify role |
| LIN-CV | VCO 2 linear CV input | Jack / socket | Linear pitch/control-voltage input | Verified label / Verify role |
| unlabeled | VCO 2 unlabeled lower socket | Jack / socket | Visible but no readable front-panel label | Verify |

## 2.3 VCO 3

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| VCO 3 | VCO 3 section heading | Label | Oscillator 3 section | Verified |
| COARSE FREQ | VCO 3 coarse frequency | Knob | Main oscillator tuning | Verified |
| FINE FREQ | VCO 3 fine frequency | Knob | Fine oscillator tuning | Verified |
| WAVEFORM | VCO 3 waveform selector | Selector / switch | Panel uses waveform icons rather than text values | Verified label / Verify role |
| PULSE WIDTH % | VCO 3 pulse width | Knob | Pulse-width control, marked 10–90 | Verified |
| waveform icon | VCO 3 waveform output A | Jack / socket | Output identified by icon, exact waveform to verify | Verify |
| waveform icon | VCO 3 waveform output B | Jack / socket | Output identified by icon, exact waveform to verify | Verify |
| PWM | VCO 3 PWM input | Jack / socket | Pulse-width modulation input | Verified label / Verify role |
| SYNC | VCO 3 sync input | Jack / socket | Oscillator sync input | Verified label / Verify role |
| LOG-CV | VCO 3 log CV input | Jack / socket | Logarithmic pitch/control-voltage input | Verified label / Verify role |
| LIN-CV | VCO 3 linear CV input | Jack / socket | Linear pitch/control-voltage input | Verified label / Verify role |
| unlabeled | VCO 3 unlabeled lower socket | Jack / socket | Visible but no readable front-panel label | Verify |

---

# 3. Sound Lab Ultimate — Mixer / Noise / External Input

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| MIXER | Mixer section heading | Label | Main signal mixer | Verified |
| VCO 1 LEVEL | VCO 1 mixer level | Knob | Controls VCO 1 level into mixer | Verified |
| VCO 2 LEVEL | VCO 2 mixer level | Knob | Controls VCO 2 level into mixer | Verified |
| VCO 3 LEVEL | VCO 3 mixer level | Knob | Controls VCO 3 level into mixer | Verified |
| EXT. IN LEVEL | External input mixer level | Knob | Controls external input level | Verified |
| WHITE NS LEVEL | White noise mixer level | Knob | Controls white-noise level into mixer | Verified |
| NOISE OUTPUTS | Noise output sockets | Jack group / sockets | Two visible noise output sockets; exact signal names need wiring/schematic confirmation | Verified label / Verify role |

---

# 4. Sound Lab Ultimate — Voltage Controlled Lowpass Filter

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| VOLTAGE CONTROLLED LOWPASS FILTER (12DB/OCT) | VCF section heading | Label | Original filter section title | Verified |
| INITIAL CUTOFF | VCF initial cutoff | Knob | Main filter cutoff control | Verified |
| AR MOD | VCF AR modulation amount | Knob | Attack/release envelope modulation depth | Verified |
| LFO-1 MOD | VCF LFO 1 modulation amount | Knob | LFO 1 to cutoff modulation depth | Verified |
| RESONANCE | VCF resonance | Knob | Resonance/emphasis control | Verified |
| EXT CV | VCF external CV sockets | Jack group / sockets | Two visible external CV input sockets; exact roles need wiring/schematic confirmation | Verified label / Verify role |

---

# 5. Sound Lab Ultimate — AR Generator

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| AR GENERATOR | AR generator section heading | Label | Attack-release envelope section | Verified |
| ATTACK | AR attack | Knob | Attack/rise time | Verified |
| RELEASE | AR release | Knob | Release/fall time | Verified |
| MODE | AR mode switch | Switch | Switch marked TRIG / GATE | Verified label / Verify role |
| TRIG | AR mode position | Label | Trigger mode position | Verified |
| GATE | AR mode position | Label | Gate mode position | Verified |
| RANGE | AR range switch | Switch | Switch marked LONG / SHORT | Verified label / Verify role |
| LONG | AR range position | Label | Long range position | Verified |
| SHORT | AR range position | Label | Short range position | Verified |
| MANUAL GATE | AR manual gate | Pushbutton / switch | Manual gate trigger | Verified label / Verify role |
| GATE/TRIG IN | AR gate/trigger input | Jack / socket | Gate/trigger input | Verified label / Verify role |
| AR OUTPUTS | AR output sockets | Jack group / sockets | Two visible AR output sockets; exact signal names need wiring/schematic confirmation | Verified label / Verify role |

---

# 6. Sound Lab Ultimate — Voltage Controlled Amplifier

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| VOLTAGE CONTROLLED AMPLIFIER | VCA section heading | Label | Original VCA section title | Verified |
| INITIAL LEVEL | VCA initial level | Knob | Base VCA level | Verified |
| AR MOD | VCA AR modulation amount | Knob | AR envelope to amplitude modulation depth | Verified |
| LFO-2 MOD | VCA LFO 2 modulation amount | Knob | LFO 2 to amplitude modulation depth | Verified |
| EXT CV | VCA external CV sockets | Jack group / sockets | Two visible external CV input sockets; exact roles need wiring/schematic confirmation | Verified label / Verify role |

---

# 7. Sound Lab Ultimate — Low Frequency Oscillators

## 7.1 LOW FREQUENCY OSC - 1

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| LOW FREQUENCY OSC - 1 | LFO 1 section heading | Label | Original LFO 1 section title | Verified |
| RATE | LFO 1 rate | Knob | LFO speed | Verified |
| RANGE | LFO 1 range switch | Switch | Switch marked HIGH / LOW | Verified label / Verify role |
| HIGH | LFO 1 range position | Label | High range position | Verified |
| LOW | LFO 1 range position | Label | Low range position | Verified |
| waveform icons | LFO 1 waveform outputs | Jack group / sockets | Four waveform outputs marked by icons | Verify |
| LFO-1 OUTPUTS | LFO 1 outputs group label | Label / jack group | Output group label | Verified |

## 7.2 LOW FREQUENCY OSC - 2

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| LOW FREQUENCY OSC - 2 | LFO 2 section heading | Label | Original LFO 2 section title | Verified |
| RATE | LFO 2 rate | Knob | LFO speed | Verified |
| RANGE | LFO 2 range switch | Switch | Switch marked HIGH / LOW | Verified label / Verify role |
| HIGH | LFO 2 range position | Label | High range position | Verified |
| LOW | LFO 2 range position | Label | Low range position | Verified |
| waveform icons | LFO 2 waveform outputs | Jack group / sockets | Four waveform outputs marked by icons | Verify |
| LFO-2 OUTPUTS | LFO 2 outputs group label | Label / jack group | Output group label | Verified |

---

# 8. Sound Lab Ultimate — Repeat Gate Rate

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| RPT. GATE RATE | Repeat gate rate | Knob | Repeat-gate speed/rate | Verified label / Verify role |
| GATE | Repeat gate socket A | Jack / socket | Exact input/output role needs wiring/schematic confirmation | Verified label / Verify role |
| GATE | Repeat gate socket B | Jack / socket | Exact input/output role needs wiring/schematic confirmation | Verified label / Verify role |
| circle with X | Repeat gate indicator | LED / lamp | Indicator between the gate labels | Verify |

---

# 9. Sound Lab Ultimate — Attenuators

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| ATTENUATORS | Attenuator section heading | Label | Four attenuator channels | Verified |
| IN | Attenuator 1 input | Jack / socket | Channel 1 input | Verified label / Verify role |
| OUT | Attenuator 1 output | Jack / socket | Channel 1 output | Verified label / Verify role |
| unlabeled knob | Attenuator 1 amount | Knob | No individual text label visible | Verified visible layout / Verify role |
| IN | Attenuator 2 input | Jack / socket | Channel 2 input | Verified label / Verify role |
| OUT | Attenuator 2 output | Jack / socket | Channel 2 output | Verified label / Verify role |
| unlabeled knob | Attenuator 2 amount | Knob | No individual text label visible | Verified visible layout / Verify role |
| IN | Attenuator 3 input | Jack / socket | Channel 3 input | Verified label / Verify role |
| OUT | Attenuator 3 output | Jack / socket | Channel 3 output | Verified label / Verify role |
| unlabeled knob | Attenuator 3 amount | Knob | No individual text label visible | Verified visible layout / Verify role |
| IN | Attenuator 4 input | Jack / socket | Channel 4 input | Verified label / Verify role |
| OUT | Attenuator 4 output | Jack / socket | Channel 4 output | Verified label / Verify role |
| unlabeled knob | Attenuator 4 amount | Knob | No individual text label visible | Verified visible layout / Verify role |

---

# 10. Sound Lab Ultimate — Sample & Hold

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| SAMPLE & HOLD | Sample and hold section heading | Label | Original S&H section title | Verified |
| INPUT | Sample and hold input | Jack / socket | S&H input | Verified label / Verify role |
| CV-OUT | Sample and hold CV output | Jack / socket | S&H CV output | Verified label / Verify role |
| TRIG | Sample and hold trigger socket | Jack / socket | Trigger role needs wiring/schematic confirmation | Verified label / Verify role |
| SAMPLE RATE | Sample and hold sample rate | Knob | Sample/clock rate | Verified |
| GLIDE | Sample and hold glide | Knob | Glide/slew amount | Verified |
| circle with X | Sample and hold indicator | LED / lamp | Indicator under GLIDE | Verify |
| unlabeled socket | Sample and hold unlabeled socket A | Jack / socket | Visible but no readable front-panel label | Verify |
| unlabeled socket | Sample and hold unlabeled socket B | Jack / socket | Visible but no readable front-panel label | Verify |

---

# 11. Sound Lab Ultimate — Output / Branding

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| OUTPUT LEVEL | Output level | Knob | Main output level | Verified |
| SOUND-LAB ULTIMATE | Hardware panel name | Branding / label | Original instrument name | Verified |
| MFOS ELECTRONIC MUSIC | Source branding | Branding / label | Original MFOS brand label | Verified |

---

# 12. Sound Lab Ultimate — Auxiliary Panel

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| FRONT VIEW OF SOUND LAB ULTIMATE AUXILLIARY PANEL | Auxiliary panel title | Label | Original spelling appears as AUXILLIARY | Verified |
| VCO 1 LOG-CV IN | Auxiliary VCO 1 log CV input | Jack / socket | External VCO 1 log CV input | Verified label / Verify role |
| VCO 2 LOG-CV IN | Auxiliary VCO 2 log CV input | Jack / socket | External VCO 2 log CV input | Verified label / Verify role |
| VCO 3 LOG-CV IN | Auxiliary VCO 3 log CV input | Jack / socket | External VCO 3 log CV input | Verified label / Verify role |
| VC-FILTER LOG-CV IN | Auxiliary VCF log CV input | Jack / socket | External filter log CV input | Verified label / Verify role |
| AR-EG GATE/TRIG IN | Auxiliary AR gate/trigger input | Jack / socket | External AR gate/trigger input | Verified label / Verify role |
| EXT IN LINE-IN | Auxiliary external line input | Jack / socket | External line input | Verified label / Verify role |
| OUTPUT LINE-OUT | Auxiliary line output | Jack / socket | Line output | Verified label / Verify role |
| SOUND-LAB ULTIMATE | Auxiliary panel branding | Label | Original instrument name | Verified |
| By MUSIC FROM OUTER SPACE | Auxiliary source branding | Label | Original source branding | Verified |

---

# 13. Sound Lab Ultimate Expander / Routing Section

This section still represents the software version of the Expander concept. Exact controls must be checked against the original Expander panel before locking final counts.

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

# 14. Patch / Routing View

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

# 15. Preset Browser

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

# 16. Items to verify against source material

Before the final faceplate is locked, verify:

- exact roles of icon-only Ultimate waveform outputs
- exact roles of unlabeled Ultimate jacks
- exact noise output signal names
- exact VCF `EXT CV` socket roles
- exact VCA `EXT CV` socket roles
- exact repeat gate jack directions
- exact sample-and-hold socket roles
- exact Ultimate Expander panel control names
- which controls are pots, switches, LEDs, and jacks on the original units
- which hardware patch points should become visible main-panel controls
- which patch points should move into an advanced routing view
- whether any original controls should be renamed for software clarity
- whether both units should appear on one large page or one main page plus advanced pages

---

# 17. Current implementation status

| Area | Design status | Engine status | UI code status |
|---|---|---|---|
| Global/Header | Scaffolded | Not started | Not started |
| Ultimate VCOs | Visible labels verified, jack roles partly verify | Not started | Not started |
| Ultimate Mixer | Visible labels verified | Not started | Not started |
| Ultimate VCF | Visible labels verified, EXT CV roles verify | Not started | Not started |
| Ultimate AR Generator | Visible labels verified, exact switch/jack roles verify | Not started | Not started |
| Ultimate VCA | Visible labels verified, EXT CV roles verify | Not started | Not started |
| Ultimate LFOs | Visible labels verified, waveform outputs verify | Not started | Not started |
| Ultimate Repeat Gate | Visible labels verified, roles verify | Not started | Not started |
| Ultimate Attenuators | Visible labels verified, roles verify | Not started | Not started |
| Ultimate Sample & Hold | Visible labels verified, some sockets verify | Not started | Not started |
| Ultimate Auxiliary Panel | Visible labels verified, roles verify | Not started | Not started |
| Expander | Scaffolded, needs verification | Not started | Not started |
| Patch/Routing View | Scaffolded | Not started | Not started |
| Preset Browser | Scaffolded | Not started | Not started |

## Next design task

Extract exact labels from the Ultimate Expander panel drawings.

Then update the Expander section of this inventory with verified visible labels.
