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

## Source extractions used

```text
docs/Ultimate_Front_Panel_Label_Extraction_v0.1.md
docs/Expander_Panel_Label_Extraction_v0.1.md
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
| Sound Lab Ultimate Expander | Verified Expander source sections | Partly verified |
| Sound Lab Ultimate Expander Auxiliary Panel | External expander connections | Verified labels |
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

# 13. Sound Lab Ultimate Expander — Main Panel

## 13.1 ADSR ENV. GEN.

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| ADSR ENV. GEN. | ADSR envelope generator section | Label | Original Expander ADSR section | Verified |
| ATTACK | ADSR attack | Knob | Attack stage | Verified |
| DECAY | ADSR decay | Knob | Decay stage | Verified |
| SUSTAIN | ADSR sustain | Knob | Sustain level | Verified |
| RELEASE | ADSR release | Knob | Release stage | Verified |
| GATE | ADSR gate socket | Jack / socket | Exact role needs wiring/schematic confirmation | Verified label / Verify role |
| TRIG | ADSR trigger socket | Jack / socket | Exact role needs wiring/schematic confirmation | Verified label / Verify role |
| MAN. | ADSR manual gate control | Switch / button | Manual gate marking | Verified label / Verify role |
| GATE | ADSR manual gate label | Label | Label associated with manual gate marking | Verified label / Verify role |
| ADSR RANGE | ADSR range switch | Switch | Range selector | Verified label / Verify role |
| LONG | ADSR range long position | Label | Range switch position | Verified |
| SHORT | ADSR range short position | Label | Range switch position | Verified |

## 13.2 EXT. SIG. BUFFER

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| EXT. SIG. BUFFER | External signal buffer section | Label | External signal buffer | Verified |
| SIGNAL BOOST | Signal boost | Knob | External signal boost amount | Verified |
| OUT | External signal buffer output A | Jack / socket | Exact output role needs wiring/schematic confirmation | Verified label / Verify role |
| OUT | External signal buffer output B | Jack / socket | Exact output role needs wiring/schematic confirmation | Verified label / Verify role |

## 13.3 ANALOG MULTIPLIER

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| ANALOG MULTIPLIER | Analog multiplier section | Label | Original analog multiplier section | Verified |
| X-IN | Analog multiplier X input | Jack / socket | X input | Verified label / Verify role |
| Y-IN | Analog multiplier Y input | Jack / socket | Y input | Verified label / Verify role |
| XY-OUT | Analog multiplier XY output | Jack / socket | Multiplied output | Verified label / Verify role |

## 13.4 CV-INVERTER

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| CV-INVERTER | CV inverter section | Label | Control voltage inverter | Verified |
| INPUT | CV inverter input | Jack / socket | Input | Verified label / Verify role |
| OUT | CV inverter output | Jack / socket | Output | Verified label / Verify role |

## 13.5 ATTENUATORS

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| ATTENUATORS | Expander attenuator section | Label | Two attenuator channels | Verified |
| IN | Expander attenuator 1 input | Jack / socket | Channel 1 input | Verified label / Verify role |
| OUT | Expander attenuator 1 output | Jack / socket | Channel 1 output | Verified label / Verify role |
| unlabeled knob | Expander attenuator 1 amount | Knob | No individual text label visible | Verified visible layout / Verify role |
| IN | Expander attenuator 2 input | Jack / socket | Channel 2 input | Verified label / Verify role |
| OUT | Expander attenuator 2 output | Jack / socket | Channel 2 output | Verified label / Verify role |
| unlabeled knob | Expander attenuator 2 amount | Knob | No individual text label visible | Verified visible layout / Verify role |

## 13.6 VOLTAGE CONTROLLED AMPLIFIER

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| VOLTAGE CONTROLLED AMPLIFIER | Expander VCA section | Label | Original Expander VCA section | Verified |
| INITIAL AMP | Expander VCA initial amp | Knob | Initial VCA amplification/amplitude control | Verified |
| INPUT | Expander VCA input | Jack / socket | VCA input | Verified label / Verify role |
| OUT | Expander VCA output | Jack / socket | VCA output | Verified label / Verify role |
| CV1 | Expander VCA CV1 input | Jack / socket | VCA control input 1 | Verified label / Verify role |
| CV2 | Expander VCA CV2 input | Jack / socket | VCA control input 2 | Verified label / Verify role |

## 13.7 STATE VARIABLE VCF

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| STATE VARIABLE VCF | State variable VCF section | Label | Original Expander VCF section | Verified |
| INITIAL COF | State variable VCF initial COF | Knob | Exact panel spelling preserved; likely cutoff-related | Verified label / Verify role |
| RESONANCE | State variable VCF resonance | Knob | Resonance control | Verified |
| INPUT | State variable VCF input A | Jack / socket | First visible filter input | Verified label / Verify role |
| CV1 | State variable VCF CV1 input | Jack / socket | Filter CV input 1 | Verified label / Verify role |
| CV2 | State variable VCF CV2 input | Jack / socket | Filter CV input 2 | Verified label / Verify role |
| RES-CV | State variable VCF resonance CV input | Jack / socket | Resonance CV input | Verified label / Verify role |
| INPUT | State variable VCF input B | Jack / socket | Second visible filter input | Verified label / Verify role |
| HP-OUT | State variable VCF high-pass output | Jack / socket | High-pass output | Verified label / Verify role |
| BP-OUT | State variable VCF band-pass output | Jack / socket | Band-pass output | Verified label / Verify role |
| LP-OUT | State variable VCF low-pass output | Jack / socket | Low-pass output | Verified label / Verify role |

## 13.8 SIGNAL MIXER

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| SIGNAL MIXER | Expander signal mixer section | Label | Four-channel signal mixer | Verified |
| IN-1 | Signal mixer input 1 | Jack / socket | Mixer channel 1 input | Verified label / Verify role |
| unlabeled knob | Signal mixer level 1 | Knob | Channel 1 level knob | Verified visible layout / Verify role |
| IN-2 | Signal mixer input 2 | Jack / socket | Mixer channel 2 input | Verified label / Verify role |
| unlabeled knob | Signal mixer level 2 | Knob | Channel 2 level knob | Verified visible layout / Verify role |
| IN-3 | Signal mixer input 3 | Jack / socket | Mixer channel 3 input | Verified label / Verify role |
| unlabeled knob | Signal mixer level 3 | Knob | Channel 3 level knob | Verified visible layout / Verify role |
| IN-4 | Signal mixer input 4 | Jack / socket | Mixer channel 4 input | Verified label / Verify role |
| unlabeled knob | Signal mixer level 4 | Knob | Channel 4 level knob | Verified visible layout / Verify role |
| LINE OUT SELECT | Line out select switch | Switch | Selects line output source | Verified label / Verify role |
| VCA | Line out select VCA position | Label | Source selection marking | Verified label / Verify role |
| MIX | Line out select MIX position | Label | Source selection marking | Verified label / Verify role |
| unlabeled connected sockets | Line-out-select connected sockets | Jack / socket group | Two sockets connected to line-out select marking; exact role to verify | Verify |

## 13.9 ENVELOPE FOLLOWER

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| ENVELOPE FOLLOWER | Envelope follower section | Label | Original envelope follower section | Verified |
| INPUT | Envelope follower input | Jack / socket | Input | Verified label / Verify role |
| EF OUT | Envelope follower output | Jack / socket | Envelope follower output | Verified label / Verify role |
| FOLLOWER LAG | Envelope follower lag | Knob | Lag/smoothing control | Verified |

## 13.10 Bottom utility outputs and branding

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| ADSR OUT | ADSR output A | Jack / socket | ADSR output | Verified label / Verify role |
| ADSR OUT | ADSR output B | Jack / socket | ADSR output | Verified label / Verify role |
| ULTIMATE MIXER OUT | Ultimate mixer out sockets | Jack group / sockets | Two visible sockets under one label | Verified label / Verify role |
| MFOS ULTIMATE EXPANDER | Expander panel title | Label | Original panel title | Verified |

---

# 14. Sound Lab Ultimate Expander — Auxiliary Panel

| Visible panel label | Software component name | Type | Purpose / notes | Status |
|---|---|---|---|---|
| MFOS ULTIMATE | Auxiliary left branding | Label | Left vertical branding | Verified |
| EXPANDER | Auxiliary right branding | Label | Right vertical branding | Verified |
| ADSR TRIG IN | Auxiliary ADSR trigger input | Jack / socket | ADSR trigger input | Verified label / Verify role |
| ADSR GATE IN | Auxiliary ADSR gate input | Jack / socket | ADSR gate input | Verified label / Verify role |
| FROM ULTIMATE | From Ultimate group label | Label | Source group from Ultimate | Verified |
| MIXER OUT | From Ultimate mixer out | Jack / socket | Connection from Ultimate mixer out | Verified label / Verify role |
| LINE OUT | From Ultimate line out | Jack / socket | Connection from Ultimate line out | Verified label / Verify role |
| EXTERNAL SIGNAL IN | External signal input | Jack / socket | External signal input | Verified label / Verify role |
| VC-FILTER CV IN | VC-filter CV input | Jack / socket | Voltage controlled filter CV input | Verified label / Verify role |
| LEVEL | Auxiliary level control A | Knob | First visible level control | Verified label / Verify role |
| LINE OUT | Auxiliary line out | Jack / socket | Expander line output | Verified label / Verify role |
| HEADPHONES | Auxiliary headphones output | Jack / socket | Headphones output | Verified label / Verify role |
| CV DISTRIBUTOR | CV distributor section | Label | CV distributor group | Verified |
| CV IN | CV distributor input | Jack / socket | CV distributor input | Verified label / Verify role |
| CV OUT | CV distributor output 1 | Jack / socket | CV distributor output | Verified label / Verify role |
| CV OUT | CV distributor output 2 | Jack / socket | CV distributor output | Verified label / Verify role |
| CV OUT | CV distributor output 3 | Jack / socket | CV distributor output | Verified label / Verify role |
| LEVEL | Auxiliary level control B | Knob | Second visible level control | Verified label / Verify role |

---

# 15. Patch / Routing View

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

# 16. Preset Browser

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

# 17. Items to verify against source material

Before the final faceplate is locked, verify:

- exact roles of icon-only Ultimate waveform outputs
- exact roles of unlabeled Ultimate jacks
- exact noise output signal names
- exact VCF `EXT CV` socket roles
- exact VCA `EXT CV` socket roles
- exact repeat gate jack directions
- exact sample-and-hold socket roles
- exact Expander switch and jack electrical roles
- exact Expander `INITIAL COF` meaning from schematics/wiring
- exact Expander line-out-select socket behaviour
- which controls are pots, switches, LEDs, and jacks on the original units
- which hardware patch points should become visible main-panel controls
- which patch points should move into an advanced routing view
- whether any original controls should be renamed for software clarity
- whether both units should appear on one large page or one main page plus advanced pages

---

# 18. Current implementation status

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
| Expander ADSR | Visible labels verified, roles verify | Not started | Not started |
| Expander external signal buffer | Visible labels verified, roles verify | Not started | Not started |
| Expander analog multiplier | Visible labels verified, roles verify | Not started | Not started |
| Expander CV inverter | Visible labels verified, roles verify | Not started | Not started |
| Expander attenuators | Visible labels verified, roles verify | Not started | Not started |
| Expander VCA | Visible labels verified, roles verify | Not started | Not started |
| Expander state variable VCF | Visible labels verified, roles verify | Not started | Not started |
| Expander signal mixer | Visible labels verified, roles verify | Not started | Not started |
| Expander envelope follower | Visible labels verified, roles verify | Not started | Not started |
| Expander auxiliary panel | Visible labels verified, roles verify | Not started | Not started |
| Patch/Routing View | Scaffolded | Not started | Not started |
| Preset Browser | Scaffolded | Not started | Not started |

## Next design task

Use this inventory to create the first static browser faceplate preview under:

```text
faceplate-preview/
```

The preview should show section blocks and placeholder controls only. It should not include audio, JUCE, VST, or functional behaviour.
