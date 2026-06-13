# BOM Value Extraction v0.1

**Project:** MerrinLab Ultimate Synth  
**Issue:** #18 — Extract verified BOM values from MFOS parts-list screenshots  
**Status:** First screenshot-based value extraction  

## Purpose

This document extracts readable BOM values from the two MFOS parts-list screenshots supplied in chat:

- Sound Lab ULTIMATE BOM
- ULTIMATE EXPANDER Parts List

This is not a shopping list. It is not a hardware build checklist. It does not implement DSP code. It does not change the UI. It does not claim exact hardware emulation.

## Extraction limits

The source material is screenshot-based. Some rows are readable. Some long designator lists are only partly readable. Some text is too blurred to trust.

Rules used in this document:

- Do not invent unreadable values.
- Do not guess designators.
- Mark partly readable rows honestly.
- Treat this as an extraction record, not final source truth.
- Use the original MFOS source pages for any later exact implementation work.

## Confidence labels

| Confidence | Meaning |
|---|---|
| Verified from screenshot | The row is readable enough to use as a screenshot extraction. |
| Partly readable | Main value/quantity is readable, but some designators or words need source-page checking. |
| Unclear | The row exists, but the value or designator is not reliable from the screenshot. |
| Needs source-page check | The screenshot gives a clue, but implementation should wait for direct source verification. |

---

# 1. ULTIMATE EXPANDER Parts List

## 1.1 ICs, transistors, and diodes

| Qty | Description | Value | Designators | Software relevance | Confidence |
|---:|---|---|---|---|---|
| 1 | AD633JNZ Low Cost Analog Multiplier | AD633AN | U21 | Confirms dedicated analog multiplier utility. | Verified from screenshot |
| 1 | CD4001 CMOS Quad NOR Gate | CD4001 | U10 | Logic/gating utility clue. | Verified from screenshot |
| 1 | CD40106 CMOS Hex Inverter | CD40106 | U11 | Logic/schmitt/inverter utility clue. | Verified from screenshot |
| 1 | CD4066 CMOS Quad Analog Switch | CD4066 | U12 | Switching/routing clue. | Verified from screenshot |
| 2 | LM13700 Dual gm Op Amp | LM13700 | U2, U6 | OTA/VCA/filter-style behaviour clue. | Verified from screenshot |
| 2 | LM386-4 Low Voltage Audio Power Amp | LM386-4 | U18, U19 | Headphone/output amplification clue. | Verified from screenshot |
| 1 | SSM2210P Matched Pair NPN | SSM2210 | U7 | Matched-pair precision clue; likely exponential/control behaviour. | Verified from screenshot |
| 3 | TL071 JFET Op Amp | TL071 | U8, U16, U23 | General analog processing. | Verified from screenshot |
| 7 | TL072 Dual JFET Op Amp | TL072 | U1, U4, U5, U9, U14, U15, U20 | General analog processing. | Verified from screenshot |
| 4 | TL074 Quad JFET Op Amp | TL074 | U3, U13, U17, U22 | General analog processing. | Verified from screenshot |
| 1 | 2N3904 General Purpose NPN Transistor | 2N3904 | Q3 | Discrete transistor utility. | Verified from screenshot |
| 3 | 2N3906 General Purpose PNP Transistor | 2N3906 | Q1, Q2, Q4 | Discrete transistor utility. | Verified from screenshot |
| 10 | 1N914 Diode | 1N914 | D1-D10 | Switching/shaping/gating clue. | Verified from screenshot |

## 1.2 Potentiometers and trimmers

| Qty | Description | Value | Designators | Software relevance | Confidence |
|---:|---|---|---|---|---|
| 1 | Potentiometer Audio Taper | 100K | R123 | Audio-taper control response clue. | Verified from screenshot |
| 6 | Small Potentiometer Audio Taper | 100K | R100, R102, R108, R112, R116, R128 | Audio-taper control response clue. | Verified from screenshot |
| 3 | Potentiometer Audio Taper | 1M | R91, R92, R97 | Audio-taper control response clue. | Verified from screenshot |
| 4 | Potentiometer Linear Taper | 100K | R4, R15, R59, R93 | Linear control response clue. | Verified from screenshot |
| 1 | Potentiometer Linear Taper | 1M | R150 | Linear control response clue. | Verified from screenshot |
| 2 | Potentiometer Linear Taper | 25K | R161, R162 | Linear control response clue. | Verified from screenshot |
| 1 | Trim Pot | 100K | R73 | Internal calibration; do not expose as normal user control without reason. | Verified from screenshot |
| 1 | Trim Pot | 2K | R69 | Internal calibration; do not expose as normal user control without reason. | Verified from screenshot |
| 1 | Trim Pot 10 Turn | 100 ohm | R1 | Internal calibration; do not expose as normal user control without reason. | Verified from screenshot |
| 1 | Trim Pot 10 Turn | 100K | R3 | Internal calibration; do not expose as normal user control without reason. | Verified from screenshot |

## 1.3 Resistor values

Long designator lists are partially readable in the screenshot. Values and quantities below are the reliable extraction priority.

| Qty | Description | Value | Designators | Software relevance | Confidence |
|---:|---|---|---|---|---|
| 1 | Resistor 1/4 Watt 1% | 499K | R12 | Precision scaling clue. | Verified from screenshot |
| 4 | Resistor 1/4 Watt 1% | 49.9K | R29, R31, R46, R50 | Precision scaling clue. | Verified from screenshot |
| 34 | Resistor 1/4 Watt 1% | 100K | Long list partly readable | Common precision scaling/reference value. | Partly readable |
| 8 | Resistor 1/4 Watt 1% | 2K | R11, R13, R34, R37, R57, R65, R94, R143 | Precision scaling clue. | Verified from screenshot |
| 1 | Resistor 1/4 Watt 1% | 475 ohm | R7 | Precision scaling clue. | Verified from screenshot |
| 3 | Resistor 1/4 Watt 5% | 47K | R72, R75, R163 | General resistor value. | Verified from screenshot |
| 1 | Resistor 1/4 Watt 5% | 2M | R74 | High-value timing/leakage/scaling clue. | Verified from screenshot |
| 1 | Resistor 1/4 Watt 5% | 300K | R18 | General resistor value. | Verified from screenshot |
| 4 | Resistor 1/4 Watt 5% | 30K | R44, R49, R52, R54 | General resistor value. | Verified from screenshot |
| 1 | Resistor 1/4 Watt 5% | 33K | R5 | General resistor value. | Verified from screenshot |
| 12 | Resistor 1/4 Watt 5% | 20K | R14, R15, R16, R17, R62, R63, R79, R81, R84, R131, R136, R140 | General resistor value. | Verified from screenshot |
| 3 | Resistor 1/4 Watt 5% | 39K | R27, R38, R147 | General resistor value. | Verified from screenshot |
| 6 | Resistor 1/4 Watt 5% | 3K | R107, R110, R113, R115, R121, R122 | General resistor value. | Verified from screenshot |
| 2 | Resistor 1/4 Watt 5% | 4.7K | R55, R66 | General resistor value. | Verified from screenshot |
| 3 | Resistor 1/4 Watt 5% | 4.7M | R33, R39, R133 | High-value timing/leakage/scaling clue. | Verified from screenshot |
| 11 | Resistor 1/4 Watt 5% | 470K | R71, R103, R104, R105, R109, R111, R114, R117, R125, R127, R130 | General resistor value. | Verified from screenshot |
| 4 | Resistor 1/4 Watt 5% | 100 ohm | R26, R28, R53, R70 | Low-value limiting/output clue. | Verified from screenshot |
| 1 | Resistor 1/4 Watt 5% | 43K | R25 | General resistor value. | Verified from screenshot |
| 15 | Resistor 1/4 Watt 5% | 10K | R2, R8, R77, R78, R82, R85, R86, R87, R95, R119, R149, R158, R159, R164, R165 | Common scaling value. | Verified from screenshot |
| 2 | Resistor 1/4 Watt 5% | 120K | R42, R61 | General resistor value. | Verified from screenshot |
| 5 | Resistor 1/4 Watt 5% | 150K | R21, R32, R36, R40, R101 | General resistor value. | Verified from screenshot |
| 1 | Resistor 1/4 Watt 5% | 180K | R35 | General resistor value. | Verified from screenshot |
| 9 | Resistor 1/4 Watt 5% | 1K | R67, R90, R96, R98, R99, R106, R126, R135, R153 | Common scaling value. | Verified from screenshot |
| 9 | Resistor 1/4 Watt 5% | 1M | R24, R30, R76, R89, R118, R120, R124, R134, R139 | High-value scaling/timing clue. | Verified from screenshot |
| 1 | Resistor 1/4 Watt 5% | 200K | R155 | General resistor value. | Verified from screenshot |
| 2 | Resistor 1/4 Watt 5% | 10 ohm | R129, R132 | Low-value limiting/output clue. | Verified from screenshot |

## 1.4 Capacitors

| Qty | Description | Value | Designators | Software relevance | Confidence |
|---:|---|---|---|---|---|
| 6 | Aluminum Electrolytic Capacitor 35V | 10uF | C12, C16, C24, C30, C75, C76 | Supply/audio coupling/timing clue. | Verified from screenshot |
| 4 | Aluminum Electrolytic Capacitor 35V | 1uF | C17, C19, C59, C61 | Coupling/timing clue. | Verified from screenshot |
| 2 | Aluminum Electrolytic Capacitor 35V | 220uF | C57, C63 | Supply/output reservoir clue. | Verified from screenshot |
| 1 | Aluminum Nonpolarized Capacitor 35V | 10uF | C38 | Audio-path coupling clue. | Verified from screenshot |
| 2 | Ceramic Capacitor at least 50V | .001uF | C31, C32 | High-frequency filtering/timing clue. | Verified from screenshot |
| 2 | Ceramic Capacitor at least 50V | .01uF | C25, C26 | Filtering/timing clue. | Verified from screenshot |
| 2 | Ceramic Capacitor at least 50V | .047uF | C56, C62 | Timing/filtering clue. | Verified from screenshot |
| 43 | Ceramic Capacitor at least 50V | .1uF | Long designator list partly readable | Decoupling/filtering; do not infer exact behaviour without schematic. | Partly readable |
| 3 | Ceramic Capacitor at least 50V | 100pF | C1, C21, C33 | High-frequency compensation clue. | Verified from screenshot |
| 2 | Ceramic Capacitor at least 50V | 220pF | C2, C3 | High-frequency compensation clue. | Verified from screenshot |
| 1 | Ceramic Capacitor at least 50V | .22uF | C72 | Timing/filtering clue. | Verified from screenshot |
| 3 | Ceramic Capacitor at least 50V | 47pF | C37, C44, C47 | High-frequency compensation clue. | Verified from screenshot |
| 1 | Ceramic Capacitor at least 50V | 22pF | C8 | High-frequency compensation clue. | Verified from screenshot |
| 1 | Tantalum Electrolytic Capacitor 35V | 15uF | C36 | Timing/coupling clue. | Verified from screenshot |
| 1 | Tantalum Electrolytic Capacitor 35V | 1uF | C35 | Timing/coupling clue. | Verified from screenshot |

## 1.5 Switches, jacks, sockets, and hardware

| Qty | Description | Value | Designators | Software relevance | Confidence |
|---:|---|---|---|---|---|
| 1 | SPDT Mini Toggle Switch | SPDT | S3 | Switch state clue. | Verified from screenshot |
| 1 | SPST Mini Toggle Switch | SPST | S2 | Switch state clue. | Verified from screenshot |
| 1 | SPST Pushbutton N.O. Switch | SPST | S1 | Momentary/manual action clue. | Verified from screenshot |
| 7 | Jack 1/4 inch 2 Terminal | Mono Jack | J1, J2, J3, J4, ADSR TRIG, ADSR GATE, VCF CV | External jack map clue. | Verified from screenshot |
| 1 | Jack 1/4 inch Stereo Headphone | Stereo Headphone Jack | J5 | Headphone output clue. | Verified from screenshot |
| 14 | 8 Pin Gold Contact Machined IC Sockets | not applicable | not applicable | Hardware-only; no software behaviour. | Verified from screenshot |
| 7 | 14 Pin Gold Contact Machined IC Sockets | not applicable | not applicable | Hardware-only; no software behaviour. | Verified from screenshot |
| 4 | 16 Pin Gold Contact Machined IC Sockets | not applicable | not applicable | Hardware-only; no software behaviour. | Verified from screenshot |
| 17 | Potentiometer Knob | not applicable | not applicable | Confirms approximate pot count. | Verified from screenshot |
| 22 | Banana Jacks Color 1 | inputs | not applicable | Patch-input count clue. | Verified from screenshot |
| 20 | Banana Jacks Color 2 | outputs | not applicable | Patch-output count clue. | Verified from screenshot |
| 24 | Banana Plugs Color 3 | for 12 banana cables | not applicable | Hardware-only patching accessory clue. | Verified from screenshot |

---

# 2. Sound Lab ULTIMATE BOM

## 2.1 ICs, transistors, diodes, and LEDs

| Qty | Description | Value | Designators | Software relevance | Confidence |
|---:|---|---|---|---|---|
| 1 | CD4013BCN Dual D Flip Flop | CD4013 | Designator partly readable | Logic/gating clue. | Partly readable |
| 3 | LF412CN or TL072B Dual Op Amp | LF412CN or TL072B | U1, U5, U9 | General analog processing. | Verified from screenshot |
| 1 | LF441CN Op Amp | LF441 | U19 | General analog processing. | Verified from screenshot |
| 2 | LM13700N Dual gm Op Amp | LM13700 | U16, U18 | OTA/VCA/filter-style behaviour clue. | Verified from screenshot |
| 3 | SSM2210P Matched Pair NPN | SSM2210 | U8, U7, U11 partly readable | Precision pitch/control behaviour clue. | Partly readable |
| 3 | TL071CP Op Amp | TL071 | U13, U20, U21 | General analog processing. | Verified from screenshot |
| 11 | TL072CP Dual Op Amp | TL072 | Long U-list partly readable | General analog processing. | Partly readable |
| 1 | TL074CN Quad Op Amp | TL074 | Designator partly readable | General analog processing. | Partly readable |
| 4 | 2N3904 | 2N3904 | Q4, Q12, Q13, Q14 | Discrete transistor utility. | Verified from screenshot |
| 4 | 2N3906 | 2N3906 | Q5, Q6, Q9, Q10 | Discrete transistor utility. | Verified from screenshot |
| 5 | MPF102 N Channel JFET | MPF102 | Q1, Q2, Q3, Q7, Q8 | JFET behaviour clue. | Verified from screenshot |
| 3 | PN4391 N Channel JFET | PN4391 | Q11, Q15, Q16 | JFET behaviour clue. | Verified from screenshot |
| 27 | 1N914 Switching Diode | 1N914 | Long diode list partly readable | Switching/shaping/gating clue. | Partly readable |
| 1 | IN5239B 9.1V Zener Diode | 9.1V | Z1 | Reference/limiting clue. | Verified from screenshot |
| 4 | General Purpose LED | user preferred color | LED3, LED4, LED1, LED2 | Indicator-only clue. | Verified from screenshot |

## 2.2 Carbon-composition / carbon-film resistor values

Many designator lists are partly readable. Values and quantities below are extracted where visible.

| Qty | Description | Value | Designators | Software relevance | Confidence |
|---:|---|---|---|---|---|
| 2 | Carbon comp or film resistor 1/4W 5% | 470 ohm | R193, R281 | General resistor value. | Verified from screenshot |
| 5 | Carbon comp or film resistor 1/4W 5% | 470K | Designators partly readable | General resistor value. | Partly readable |
| 3 | Carbon comp or film resistor 1/4W 5% | 47K | Designators partly readable | General resistor value. | Partly readable |
| 1 | Carbon comp or film resistor 1/4W 5% | 510K | R223 | General resistor value. | Verified from screenshot |
| 1 | Carbon comp or film resistor 1/4W 5% | 56K | R146 | General resistor value. | Verified from screenshot |
| 2 | Carbon comp or film resistor 1/4W 5% | 680K | Designators partly readable | General resistor value. | Partly readable |
| 1 | Carbon comp or film resistor 1/4W 5% | 7.5K | R214 | General resistor value. | Verified from screenshot |
| 32 | Carbon comp or film resistor 1/4W 5% | 100K | Long list partly readable | Common scaling value. | Partly readable |
| 2 | Carbon comp or film resistor 1/4W 5% | 82K | R178, R232 | General resistor value. | Verified from screenshot |
| 1 | Carbon comp or film resistor 1/4W 5% | 1.8K | R187 | General resistor value. | Verified from screenshot |
| 3 | Carbon comp or film resistor 1/4W 5% | 10K | Designators partly readable | Common scaling value. | Partly readable |
| 1 | Carbon comp or film resistor 1/4W 5% | 120K | R165 | General resistor value. | Verified from screenshot |
| 2 | Carbon comp or film resistor 1/4W 5% | 130K | R252, R261 | General resistor value. | Verified from screenshot |
| 3 | Carbon comp or film resistor 1/4W 5% | 180K | Designators partly readable | General resistor value. | Partly readable |
| 7 | Carbon comp or film resistor 1/4W 5% | 180K | Designators partly readable | Duplicate/nearby row needs source-page check. | Needs source-page check |
| 8 | Carbon comp or film resistor 1/4W 5% | 1K | Designators partly readable | Common scaling value. | Partly readable |
| 2 | Carbon comp or film resistor 1/4W 5% | 1M | R141, R251 | High-value scaling/timing clue. | Verified from screenshot |
| 3 | Carbon comp or film resistor 1/4W 5% | 200 ohm | R207, R255, R266 | Low-value limiting/output clue. | Verified from screenshot |
| 8 | Carbon comp or film resistor 1/4W 5% | 220K | Designators partly readable | General resistor value. | Partly readable |
| 9 | Carbon comp or film resistor 1/4W 5% | 20K | Designators partly readable | General resistor value. | Partly readable |
| 1 | Carbon comp or film resistor 1/4W 5% | 220 ohm | R167 | Low-value limiting/output clue. | Verified from screenshot |
| 2 | Carbon comp or film resistor 1/4W 5% | 270K | R250, R262 | General resistor value. | Verified from screenshot |
| 4 | Carbon comp or film resistor 1/4W 5% | 2K | R149, R155, R181, R182 | General resistor value. | Verified from screenshot |
| 4 | Carbon comp or film resistor 1/4W 5% | 3.3K | Designators partly readable | General resistor value. | Partly readable |
| 1 | Carbon comp or film resistor 1/4W 5% | 300K | R209 | General resistor value. | Verified from screenshot |
| 3 | Carbon comp or film resistor 1/4W 5% | 30K | R162, R174, R175 | General resistor value. | Verified from screenshot |
| 3 | Carbon comp or film resistor 1/4W 5% | 33K | R160, R161, R190 | General resistor value. | Verified from screenshot |
| 8 | Carbon comp or film resistor 1/4W 5% | 3K | Long list partly readable | General resistor value. | Partly readable |
| 2 | Carbon comp or film resistor 1/4W 5% | 3M | R254, R267 | High-value scaling/timing clue. | Verified from screenshot |
| 6 | Carbon comp or film resistor 1/4W 5% | 4.7K | R71, R173, R194, R221, R216, R258 | General resistor value. | Verified from screenshot |

## 2.3 Metal-film resistor values

| Qty | Description | Value | Designators | Software relevance | Confidence |
|---:|---|---|---|---|---|
| 3 | Metal Film Resistor 1/4W 1% | 2K | R26, R60, R122 | Precision scaling clue. | Verified from screenshot |
| 3 | Metal Film Resistor 1/4W 1% | 3.3K | Designators partly readable | Precision scaling clue. | Partly readable |
| 3 | Metal Film Resistor 1/4W 1% | 1.01K | R47, R84, R106 | Precision scaling clue. | Verified from screenshot |
| 6 | Metal Film Resistor 1/4W 1% | 47K | R30, R39, R53, R72, R105, R114 | Precision scaling clue. | Verified from screenshot |
| 6 | Metal Film Resistor 1/4W 1% | 4.7K | R7, R40, R52, R53, R94, R95 | Precision scaling clue. | Verified from screenshot |
| 3 | Metal Film Resistor 1/4W 1% | 475 ohm | R18, R59, R104 | Precision scaling clue. | Verified from screenshot |
| 3 | Metal Film Resistor 1/4W 1% | 9.09K | R17, R40, R91 | Precision scaling clue. | Verified from screenshot |
| 3 | Metal Film Resistor 1/4W 1% | 49.9K | R2, R14, one designator partly readable | Precision scaling clue. | Partly readable |
| 21 | Metal Film Resistor 1/4W 1% | 100K | Long list mostly readable but not fully verified | Precision/common scaling clue. | Partly readable |
| 15 | Metal Film Resistor 1/4W 1% | 10K | Long list mostly readable but not fully verified | Precision/common scaling clue. | Partly readable |
| 3 | Metal Film Resistor 1/4W 1% | 120K | Designators partly readable | Precision scaling clue. | Partly readable |
| 3 | Metal Film Resistor 1/4W 1% | 18K | R29, R84, R126 | Precision scaling clue. | Verified from screenshot |
| 3 | Metal Film Resistor 1/4W 1% | 1K | R25, R81, R123 | Precision scaling clue. | Verified from screenshot |
| 15 | Metal Film Resistor 1/4W 1% | 1M | Long list mostly readable but not fully verified | High-value precision scaling/timing clue. | Partly readable |
| 6 | Metal Film Resistor 1/4W 1% | 200K | R4, R5, R47, R48, R49, R50 | Precision scaling clue. | Verified from screenshot |
| 9 | Metal Film Resistor 1/4W 1% | 20K | R34, R55, R37, R59, R60, R65, R101, R102, R107 | Precision scaling clue. | Verified from screenshot |

## 2.4 Potentiometers and trimmers

| Qty | Description | Value | Designators | Software relevance | Confidence |
|---:|---|---|---|---|---|
| 17 | Potentiometer | 100K | Long list partly readable | Main user control count/value clue. | Partly readable |
| 6 | Potentiometer | 10K | R157, R165, R270, R271, R272, R273 | User control value clue. | Verified from screenshot |
| 3 | Potentiometer | 1M | R206, R216, R222 | User control value clue. | Verified from screenshot |
| 5 | Potentiometer Audio Taper | 100K | R127, R129, R132, R136, R269 | Audio-taper control response clue. | Verified from screenshot |
| 2 | Potentiometer Audio Taper | 1M | R227, R230 | Audio-taper control response clue. | Verified from screenshot |
| 3 | Metal film 2K Ohm 1/4W +/-2% T.C. +3300 PPM tempco | 2K | R15, R67, R109 | Pitch/expo temperature-compensation clue. | Verified from screenshot |
| 1 | Trim Pot Multi Turn | 20K | R144 | Internal calibration; do not expose as normal user control. | Verified from screenshot |
| 1 | Trim Pot Multi Turn | 2K | R192 | Internal calibration; do not expose as normal user control. | Verified from screenshot |
| 4 | Trim Pot Multi Turn | 100K | R8, R99, R200 and one partly readable | Internal calibration; do not expose as normal user control. | Partly readable |
| 4 | Trim Pot Multi Turn | 100 ohm | R11, R57, R99, R200 | Internal calibration; row needs source check because nearby 100K trim row is partly readable. | Needs source-page check |

## 2.5 Capacitors

| Qty | Description | Value | Designators | Software relevance | Confidence |
|---:|---|---|---|---|---|
| 1 | Capacitor Low Leakage | .01uF | C50 | Timing/leakage-sensitive clue. | Verified from screenshot |
| 6 | Capacitor Aluminum Electrolytic | 10uF | C41, C44, C36, C67, C38, C89 | Coupling/supply/timing clue. | Verified from screenshot |
| 1 | Capacitor Aluminum Nonpolarized | 1uF | C54 | Audio-path coupling clue. | Verified from screenshot |
| 3 | Capacitor Ceramic | .022uF | C63, C79, C83 | Timing/filtering clue. | Verified from screenshot |
| 10 | Capacitor Ceramic | 100pF | C2, C6, C15, C25, C27, C37, C90, C91, C92, C94 | High-frequency compensation clue. | Verified from screenshot |
| 3 | Capacitor Ceramic | 4.7pF | C3, C16, C28 | High-frequency compensation clue. | Verified from screenshot |
| 1 | Capacitor Ceramic | 22uF or .22uF | C56 | Value is not clear enough from screenshot; check source. | Unclear |
| 2 | Capacitor Ceramic | 330pF | C49, C80 | High-frequency compensation clue. | Verified from screenshot |
| 1 | Capacitor Ceramic | 22pF | C50 | High-frequency compensation clue; designator overlap needs source check. | Needs source-page check |
| 5 | Capacitor Ceramic | 10pF | C11, C14, C26, C78, C82 | High-frequency compensation clue. | Verified from screenshot |
| 43 | Capacitor Ceramic | .1uF | Long list partly readable | Decoupling/filtering; exact list needs source check. | Partly readable |
| 1 | Capacitor Ceramic | 47pF | C38 | High-frequency compensation clue. | Verified from screenshot |
| 4 | Capacitor Ceramic | .001uF | C9, C21, C33, C62 | Filtering/timing clue. | Verified from screenshot |
| 4 | Capacitor Ceramic | .01uF | C47, C53, C74, C75 | Filtering/timing clue. | Verified from screenshot |
| 1 | Capacitor Non-Polarized Aluminum | 10uF | C39 | Audio-path coupling clue. | Verified from screenshot |
| 1 | Capacitor Non-Polarized Aluminum | 2.2uF | C64 | Audio-path coupling clue. | Verified from screenshot |
| 1 | Capacitor Tantalum | 4.7uF | C72 | Timing/coupling clue. | Verified from screenshot |
| 1 | Capacitor Tantalum | 1uF | C73 | Timing/coupling clue. | Verified from screenshot |
| 3 | Polycarbonate or Polystyrene Capacitor | .005uF | C7, C17, C29 | Precision/timing/filter clue. | Verified from screenshot |

## 2.6 Switches, jacks, sockets, and hardware

| Qty | Description | Value | Designators | Software relevance | Confidence |
|---:|---|---|---|---|---|
| 2 | Switch DPDT Mini Toggle | DPDT | S5, S8 | Switch-state clue. | Verified from screenshot |
| 1 | Switch DPST Mini Toggle | DPST | S3 | Switch-state clue. | Verified from screenshot |
| 2 | Switch SPDT Center Off Mini Toggle | SPDT | S4, S7 | Three-position switch clue. | Verified from screenshot |
| 3 | Switch SPDT Mini Toggle | SPDT | S10, S11, S12 | Switch-state clue. | Verified from screenshot |
| 3 | Switch SPST Mini Toggle | SPST | S1, S6, S9 | Switch-state clue. | Verified from screenshot |
| 1 | Switch SPST N.O. Pushbutton | SPST | S2 | Manual action clue. | Verified from screenshot |
| 33 | Potentiometer Knobs | not applicable | not applicable | Confirms large user-control count. | Verified from screenshot |
| 24 | Banana Jacks Color 1 | inputs | not applicable | Patch-input count clue. | Verified from screenshot |
| 25 | Banana Jacks Color 2 | outputs | not applicable | Patch-output count clue. | Verified from screenshot |
| 24 | Banana Plugs Color 3 | for 12 banana cables | not applicable | Hardware-only patching accessory clue. | Verified from screenshot |
| 7 | 1/4 inch Phone Jacks | not applicable | not applicable | Auxiliary panel jack count clue. | Verified from screenshot |
| 3 | 14 Pin Gold Contact Machined IC Sockets | not applicable | not applicable | Hardware-only; no software behaviour. | Verified from screenshot |
| 2 | 16 Pin Gold Contact Machined IC Sockets | not applicable | not applicable | Hardware-only; no software behaviour. | Verified from screenshot |
| 20 | 8 Pin Gold Contact Machined IC Sockets | not applicable | not applicable | Hardware-only; no software behaviour. | Verified from screenshot |

---

# 3. Software-relevant modelling clues extracted

## 3.1 Strong clues

- Both projects use many op amps and OTA-style parts; software should start with functional behaviour rather than exact circuit emulation.
- LM13700 appears in both the Ultimate and Expander lists, supporting the earlier decision to treat VCA/filter-style behaviour carefully.
- The Ultimate includes matched NPN pairs and 2K tempco resistors, which are important clues for pitch-control/exponential behaviour.
- The Ultimate Expander includes an AD633 analog multiplier, supporting the analog multiplier/ring-mod style utility target.
- Large numbers of 100K pots/resistors appear, but their exact role still depends on the schematic.
- Trimmers are present and should remain internal calibration clues, not ordinary user controls.
- The screenshots confirm many patch jacks, but software should not start with full cable simulation.

## 3.2 First-engine impact

The first engine plan remains valid:

- three VCOs
- mixer/noise path
- 12dB/oct low-pass filter as the first filter target
- main VCA with envelope control
- AR/ADSR support in the architecture
- LFO 1 to filter and LFO 2 to VCA as sensible first modulation paths

## 3.3 What still needs direct source-page verification

- all long resistor designator lists
- all long ceramic capacitor designator lists
- ambiguous duplicate-looking rows in the Ultimate resistor section
- exact VCO pitch-control component relationships
- exact filter topology and resonance behaviour
- exact VCA response behaviour
- exact envelope timing ranges
- exact LFO timing ranges
- exact sample-and-hold/glide timing behaviour
- exact Expander utility routing and output behaviour

---

# 4. Final extraction decision

This v0.1 extraction is enough to separate actual screenshot-derived BOM values from the earlier planning-level BOM analysis.

Do not use this document as a final implementation source by itself.

Use it as a map for the next source-page verification pass.