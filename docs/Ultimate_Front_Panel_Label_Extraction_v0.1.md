# Ultimate Front Panel Label Extraction v0.1

## Purpose

This document starts Issue #1 by extracting the exact visible labels from the Sound Lab ULTIMATE front-panel references in the uploaded source archive.

This is the first correction pass for:

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
Sound Lab Ultimate/Panel And Wiring_files/front_panel_silk_990px.gif
Sound Lab Ultimate/Panel And Wiring_files/panel_silk_correlation_500px.gif
Sound Lab Ultimate/Panel And Wiring_files/aux_panel_silkscreen.gif
```

## Important note

This extraction records front-panel labels and visible interface items.

Some jacks are identified only by waveform icons or are unlabeled on the panel. Those remain marked `Verify` until checked against the panel wiring and schematics.

---

# 1. Main Front Panel — Verified Visible Sections

## VCO 1

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| VCO 1 | Section heading | Label | Main oscillator 1 section | Verified |
| COARSE FREQ | Control | Knob | Main oscillator tuning | Verified |
| FINE FREQ | Control | Knob | Fine oscillator tuning | Verified |
| WAVEFORM | Control | Selector | Panel uses waveform icons rather than text values | Verified label, verify switch type |
| PULSE WIDTH % | Control | Knob | Pulse-width control, marked 10–90 | Verified |
| square/pulse waveform icon | Jack / output | Socket | Waveform output identified by icon, not text | Verify |
| ramp/saw waveform icon | Jack / output | Socket | Waveform output identified by icon, not text | Verify |
| PWM | Jack | Socket | Pulse-width modulation input | Verified |
| SYNC | Jack | Socket | Oscillator sync input | Verified |
| LOG-CV | Jack | Socket | Log control-voltage input | Verified |
| LIN-CV | Jack | Socket | Linear control-voltage input | Verified |
| unlabeled bottom jack | Jack | Socket | Visible on panel but no front text label found | Verify |

## VCO 2

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| VCO 2 | Section heading | Label | Main oscillator 2 section | Verified |
| COARSE FREQ | Control | Knob | Main oscillator tuning | Verified |
| FINE FREQ | Control | Knob | Fine oscillator tuning | Verified |
| WAVEFORM | Control | Selector | Panel uses waveform icons rather than text values | Verified label, verify switch type |
| PULSE WIDTH % | Control | Knob | Pulse-width control, marked 10–90 | Verified |
| square/pulse waveform icon | Jack / output | Socket | Waveform output identified by icon, not text | Verify |
| ramp/saw waveform icon | Jack / output | Socket | Waveform output identified by icon, not text | Verify |
| PWM | Jack | Socket | Pulse-width modulation input | Verified |
| SYNC | Jack | Socket | Oscillator sync input | Verified |
| LOG-CV | Jack | Socket | Log control-voltage input | Verified |
| LIN-CV | Jack | Socket | Linear control-voltage input | Verified |
| unlabeled bottom jack | Jack | Socket | Visible on panel but no front text label found | Verify |

## VCO 3

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| VCO 3 | Section heading | Label | Main oscillator 3 section | Verified |
| COARSE FREQ | Control | Knob | Main oscillator tuning | Verified |
| FINE FREQ | Control | Knob | Fine oscillator tuning | Verified |
| WAVEFORM | Control | Selector | Panel uses waveform icons rather than text values | Verified label, verify switch type |
| PULSE WIDTH % | Control | Knob | Pulse-width control, marked 10–90 | Verified |
| square/pulse waveform icon | Jack / output | Socket | Waveform output identified by icon, not text | Verify |
| ramp/saw waveform icon | Jack / output | Socket | Waveform output identified by icon, not text | Verify |
| PWM | Jack | Socket | Pulse-width modulation input | Verified |
| SYNC | Jack | Socket | Oscillator sync input | Verified |
| LOG-CV | Jack | Socket | Log control-voltage input | Verified |
| LIN-CV | Jack | Socket | Linear control-voltage input | Verified |
| unlabeled bottom jack | Jack | Socket | Visible on panel but no front text label found | Verify |

---

# 2. Mixer Section

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| MIXER | Section heading | Label | Main signal mixer | Verified |
| VCO 1 LEVEL | Control | Knob | VCO 1 mixer level | Verified |
| VCO 2 LEVEL | Control | Knob | VCO 2 mixer level | Verified |
| VCO 3 LEVEL | Control | Knob | VCO 3 mixer level | Verified |
| EXT. IN LEVEL | Control | Knob | External input mixer level | Verified |
| WHITE NS LEVEL | Control | Knob | White-noise mixer level | Verified |
| NOISE OUTPUTS | Jack group | Sockets | Two visible noise output sockets | Verified label, verify exact signal names |

---

# 3. Voltage Controlled Lowpass Filter Section

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| VOLTAGE CONTROLLED LOWPASS FILTER (12DB/OCT) | Section heading | Label | Filter section name | Verified |
| INITIAL CUTOFF | Control | Knob | Main cutoff control | Verified |
| AR MOD | Control | Knob | AR envelope modulation amount | Verified |
| LFO-1 MOD | Control | Knob | LFO 1 modulation amount | Verified |
| RESONANCE | Control | Knob | Resonance control | Verified |
| EXT CV | Jack group | Sockets | Two visible external CV input sockets | Verified label, verify exact use |

---

# 4. AR Generator Section

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| AR GENERATOR | Section heading | Label | Attack-release envelope section | Verified |
| ATTACK | Control | Knob | Attack time | Verified |
| RELEASE | Control | Knob | Release time | Verified |
| MODE | Control label | Switch | Switch marked TRIG / GATE | Verified label, verify switch type |
| TRIG | Switch position label | Label | MODE switch position | Verified |
| GATE | Switch position label | Label | MODE switch position | Verified |
| RANGE | Control label | Switch | Switch marked LONG / SHORT | Verified label, verify switch type |
| LONG | Switch position label | Label | RANGE switch position | Verified |
| SHORT | Switch position label | Label | RANGE switch position | Verified |
| MANUAL GATE | Control | Pushbutton / switch | Manual gate trigger | Verified label, verify hardware type |
| GATE/TRIG IN | Jack | Socket | Gate/trigger input | Verified |
| AR OUTPUTS | Jack group | Sockets | Two visible AR output sockets | Verified label, verify exact signal names |

---

# 5. Voltage Controlled Amplifier Section

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| VOLTAGE CONTROLLED AMPLIFIER | Section heading | Label | VCA section name | Verified |
| INITIAL LEVEL | Control | Knob | VCA initial level | Verified |
| AR MOD | Control | Knob | AR modulation amount | Verified |
| LFO-2 MOD | Control | Knob | LFO 2 modulation amount | Verified |
| EXT CV | Jack group | Sockets | Two visible external CV input sockets | Verified label, verify exact use |

---

# 6. Low Frequency Oscillator 1 Section

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| LOW FREQUENCY OSC - 1 | Section heading | Label | LFO 1 section | Verified |
| RATE | Control | Knob | LFO 1 rate | Verified |
| RANGE | Control label | Switch | Switch marked HIGH / LOW | Verified label, verify switch type |
| HIGH | Switch position label | Label | RANGE switch position | Verified |
| LOW | Switch position label | Label | RANGE switch position | Verified |
| waveform icons | Jack group | Sockets | Four visible LFO waveform output sockets marked by icons | Verify |
| LFO-1 OUTPUTS | Jack group label | Sockets | Output group label | Verified |

---

# 7. Low Frequency Oscillator 2 Section

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| LOW FREQUENCY OSC - 2 | Section heading | Label | LFO 2 section | Verified |
| RATE | Control | Knob | LFO 2 rate | Verified |
| RANGE | Control label | Switch | Switch marked HIGH / LOW | Verified label, verify switch type |
| HIGH | Switch position label | Label | RANGE switch position | Verified |
| LOW | Switch position label | Label | RANGE switch position | Verified |
| waveform icons | Jack group | Sockets | Four visible LFO waveform output sockets marked by icons | Verify |
| LFO-2 OUTPUTS | Jack group label | Sockets | Output group label | Verified |

---

# 8. Repeat Gate Rate Section

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| RPT. GATE RATE | Section/control label | Knob | Repeat gate rate | Verified |
| GATE | Jack / label | Socket | Left gate-labelled socket | Verify exact input/output role |
| GATE | Jack / label | Socket | Right gate-labelled socket | Verify exact input/output role |
| centre circle with X | Indicator | LED / lamp | Between GATE labels | Verify |

---

# 9. Attenuators Section

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| ATTENUATORS | Section heading | Label | Four attenuator channels | Verified |
| IN | Jack | Socket | Attenuator 1 input | Verified |
| OUT | Jack | Socket | Attenuator 1 output | Verified |
| IN | Jack | Socket | Attenuator 2 input | Verified |
| OUT | Jack | Socket | Attenuator 2 output | Verified |
| IN | Jack | Socket | Attenuator 3 input | Verified |
| OUT | Jack | Socket | Attenuator 3 output | Verified |
| IN | Jack | Socket | Attenuator 4 input | Verified |
| OUT | Jack | Socket | Attenuator 4 output | Verified |
| no individual attenuator text label | Control | 4 knobs | Four knobs under ATTENUATORS heading, no individual text names | Verified visible layout |

---

# 10. Sample & Hold Section

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| SAMPLE & HOLD | Section heading | Label | Sample and hold section | Verified |
| INPUT | Jack | Socket | Sample and hold input | Verified |
| CV-OUT | Jack | Socket | Sample and hold CV output | Verified |
| TRIG | Jack | Socket | Trigger input/output role to verify | Verified label, verify role |
| SAMPLE RATE | Control | Knob | Sample rate | Verified |
| GLIDE | Control | Knob | Glide/slew amount | Verified |
| centre circle with X | Indicator | LED / lamp | Under GLIDE control | Verify |
| unlabeled middle sockets | Jacks | Sockets | Two visible sockets between CV-OUT and TRIG without readable front labels | Verify |

---

# 11. Output / Branding Section

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| OUTPUT LEVEL | Control | Knob | Main output level | Verified |
| SOUND-LAB ULTIMATE | Branding | Label | Instrument name on panel | Verified |
| MFOS ELECTRONIC MUSIC | Branding | Label | Footer/brand label | Verified |

---

# 12. Auxiliary Panel — Verified Visible Labels

| Visible label | Interface item | Type | Notes | Status |
|---|---|---|---|---|
| FRONT VIEW OF SOUND LAB ULTIMATE AUXILLIARY PANEL | Panel title | Label | Original spelling appears as AUXILLIARY | Verified |
| VCO 1 LOG-CV IN | Jack | Socket | Auxiliary VCO 1 log CV input | Verified |
| VCO 2 LOG-CV IN | Jack | Socket | Auxiliary VCO 2 log CV input | Verified |
| VCO 3 LOG-CV IN | Jack | Socket | Auxiliary VCO 3 log CV input | Verified |
| VC-FILTER LOG-CV IN | Jack | Socket | Auxiliary filter log CV input | Verified |
| AR-EG GATE/TRIG IN | Jack | Socket | Auxiliary AR envelope gate/trigger input | Verified |
| EXT IN LINE-IN | Jack | Socket | Auxiliary external line input | Verified |
| OUTPUT LINE-OUT | Jack | Socket | Auxiliary line output | Verified |
| SOUND-LAB ULTIMATE | Branding | Label | Instrument name | Verified |
| By MUSIC FROM OUTER SPACE | Branding | Label | Source brand label | Verified |

---

# 13. Immediate Corrections Needed In Inventory

Update `docs/Interface_Component_Inventory_v0.1.md` so the Ultimate scaffold uses the verified visible labels above.

Important corrections from this extraction:

- Use `WHITE NS LEVEL`, not generic `Noise level`, when referring to the Ultimate front-panel mixer label.
- Use `VOLTAGE CONTROLLED LOWPASS FILTER (12DB/OCT)`, not a generic filter title, for the original Ultimate section heading.
- Use `INITIAL CUTOFF`, `AR MOD`, `LFO-1 MOD`, and `RESONANCE` as the verified filter control labels.
- Use `VOLTAGE CONTROLLED AMPLIFIER`, `INITIAL LEVEL`, `AR MOD`, and `LFO-2 MOD` as verified VCA labels.
- Use `AR GENERATOR`, not ADSR, for the Ultimate main-panel envelope section visible here.
- Add `RPT. GATE RATE` as a verified visible section/control.
- Add `ATTENUATORS` as a verified visible four-channel attenuator section.
- Add `SAMPLE & HOLD`, `SAMPLE RATE`, and `GLIDE` as verified visible labels.
- Keep unlabeled jacks and icon-only waveform outputs marked `Verify` until wiring/schematics confirm their roles.

## Next subtask

Use this extraction to rewrite the Ultimate part of:

```text
docs/Interface_Component_Inventory_v0.1.md
```

Then repeat the same extraction for the Ultimate Expander panel drawings.
