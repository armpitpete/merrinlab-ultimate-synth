# Interface Mapping v0.1

**Project:** MerrinLab Ultimate Synth  
**Mapping stage:** v0.1  
**Status:** Documentation-only interface map  
**Core direction:** working browser controls -> actual visible synth interface  

## 1. Purpose

This document maps the working First Voice browser controls onto the actual visible synth interface.

The First Voice is now stable enough to stop treating the floating browser controls as the final interface. The next stage is to decide where each working control belongs on the visible panel before moving or integrating any controls.

This document is not a patching plan. It is not a new audio feature plan. It does not add routing, patch sockets, presets, MIDI, external input, JUCE, or VST work.

## 2. Current baseline

Playable audio behaviour remains:

```text
First Voice v1.2
```

Documentation checkpoint remains:

```text
First Voice v1.3
```

The current task is:

```text
working browser controls -> actual visible synth interface
```

## 3. Mapping rule

Mapping means:

```text
This working browser control belongs in this visible panel area.
```

Mapping does not mean:

```text
This jack is now wired.
This module is now patchable.
This visible control has been moved.
This is now exact hardware emulation.
```

The mapping pass should come before any UI movement.

## 4. Active First Voice browser controls

These controls are active in the current First Voice browser control layer:

- Start Audio
- Gate Note
- Release
- Panic Stop
- VCO 1 Coarse Freq
- VCO 1 Fine Freq
- VCO 1 Waveform
- VCO 1 Pulse Width %
- VCO 1 Level
- VCO 2 Coarse Freq
- VCO 2 Fine Freq
- VCO 2 Waveform
- VCO 2 Pulse Width %
- VCO 2 Level
- VCO 3 Coarse Freq
- VCO 3 Fine Freq
- VCO 3 Waveform
- VCO 3 Pulse Width %
- VCO 3 Level
- Noise Type
- White NS Level
- Filter Cutoff
- Resonance
- LFO 1 Rate
- LFO-1 Mod
- S&H Rate
- S&H Mod
- S&H Pitch Mod
- LFO 2 Rate
- LFO-2 Mod
- Envelope Mode
- Repeat Gate
- Repeat Gate Rate
- AR Attack
- AR Release
- ADSR Attack
- ADSR Decay
- ADSR Sustain
- ADSR Release
- Output

## 5. Controls with clear homes on the visible interface

| Active browser control | Visible synth interface home | Mapping status |
|---|---|---|
| VCO 1 Coarse Freq | VCO 1 / Coarse Freq | Clear home |
| VCO 1 Fine Freq | VCO 1 / Fine Freq | Clear home |
| VCO 1 Waveform | VCO 1 / Waveform Shape | Clear home |
| VCO 1 Pulse Width % | VCO 1 / Pulse Width % | Clear home |
| VCO 1 Level | Mixer / VCO 1 Level | Clear home |
| VCO 2 Coarse Freq | VCO 2 / Coarse Freq | Clear home |
| VCO 2 Fine Freq | VCO 2 / Fine Freq | Clear home |
| VCO 2 Waveform | VCO 2 / Waveform Shape | Clear home |
| VCO 2 Pulse Width % | VCO 2 / Pulse Width % | Clear home |
| VCO 2 Level | Mixer / VCO 2 Level | Clear home |
| VCO 3 Coarse Freq | VCO 3 / Coarse Freq | Clear home |
| VCO 3 Fine Freq | VCO 3 / Fine Freq | Clear home |
| VCO 3 Waveform | VCO 3 / Waveform Shape | Clear home |
| VCO 3 Pulse Width % | VCO 3 / Pulse Width % | Clear home |
| VCO 3 Level | Mixer / VCO 3 Level | Clear home |
| White NS Level | Mixer / White NS Level | Clear home |
| Filter Cutoff | Voltage Controlled Lowpass Filter / Initial Cutoff | Clear home |
| Resonance | Voltage Controlled Lowpass Filter / Resonance | Clear home |
| LFO 1 Rate | Low Frequency Osc - 1 / Rate | Clear home |
| LFO-1 Mod | Voltage Controlled Lowpass Filter / LFO-1 Mod | Clear home |
| S&H Rate | Sample & Hold / Sample Rate | Clear home |
| S&H Mod | Sample & Hold CV-Out concept into Lowpass Filter cutoff | Partial home |
| LFO 2 Rate | Low Frequency Osc - 2 / Rate | Clear home |
| LFO-2 Mod | Main VCA / LFO-2 Mod | Clear home |
| AR Attack | AR Generator / Attack | Clear home |
| AR Release | AR Generator / Release | Clear home |
| ADSR Attack | ADSR Env. Gen. / Attack | Clear home |
| ADSR Decay | ADSR Env. Gen. / Decay | Clear home |
| ADSR Sustain | ADSR Env. Gen. / Sustain | Clear home |
| ADSR Release | ADSR Env. Gen. / Release | Clear home |
| Repeat Gate Rate | Rpt. Gate Rate / Gate Rate | Clear home |
| Output | Output Level / Output Level | Clear home |

## 6. Temporary browser helper controls

These controls work, but they do not yet have a clean one-to-one visible interface control.

| Active browser control | Temporary role | Later interface decision needed |
|---|---|---|
| Start Audio | Browser safety requirement. Starts Web Audio after user action. | Keep as browser-only safety control, probably near top bar or outside the synth faceplate. |
| Panic Stop | Browser safety requirement. Stops the active audio graph. | Keep as browser-only safety control, probably near top bar or outside the synth faceplate. |
| Gate Note | Manual test helper for opening the voice. | Could map to AR Manual Gate or ADSR Man. Gate later, but should remain a test helper for now. |
| Release | Manual test helper for releasing the current envelope. | Could become part of a keyboard/gate test area later, but not a faceplate control yet. |
| Noise Type | Selects White / Pink / Brown noise in the browser engine. | Visible panel currently has White NS Level and Noise Outputs, but no clear noise type selector. Needs a later UI decision. |
| S&H Pitch Mod | Sends S&H movement to VCO 1 pitch only. | This is not a faceplate patch yet. Later it may become a controlled internal normalled route or a small test-only amount control. |
| Envelope Mode | Chooses AR or ADSR envelope mode for the First Voice VCA path. | Visible interface has separate AR Generator and ADSR Env. Gen. areas. Later decision: keep as browser helper or replace with visible envelope-source selection. |
| Repeat Gate | Turns repeat triggering on/off. | Visible Repeat Gate area has Gate Rate, Gate LED, and Gate jack. It does not currently show an on/off switch. Needs a later UI decision. |

## 7. Visible interface areas that remain visual-only

These areas are visible but should remain visual-only until a later explicit issue activates them:

- VCO PWM jacks
- VCO SYNC jacks
- VCO LOG-CV jacks
- VCO LIN-CV jacks
- Ext. In Level
- Noise Outputs jacks
- Lowpass Filter AR Mod
- Lowpass Filter Ext CV jacks
- Sample & Hold Input jack
- Sample & Hold CV-Out jack
- Sample & Hold Glide
- Sample & Hold Trig jack
- Sample & Hold LED
- AR Generator Mode / Trig switch
- AR Generator Range switch
- AR Manual Gate jack
- AR Gate/Trig In jack
- AR Outputs jacks
- Main VCA Initial Level as a separate manual amplifier control
- Main VCA AR Mod as a separate visible CV control
- Main VCA Ext CV jacks
- AUX VCA
- LFO 1 Shape
- LFO 1 Range
- LFO 1 Outputs jacks
- LFO 2 Shape
- LFO 2 Range
- LFO 2 Outputs jacks
- Output Phones display / headphones behaviour
- ADSR Man. Gate jack
- ADSR Gate jack
- ADSR Range switch
- ADSR Trig jack
- ADSR Out jacks
- Repeat Gate Gate LED
- Repeat Gate Gate jack
- Attenuators 1-6
- State Variable VCF
- Signal Mixer
- Analog Multiplier
- CV Inverter
- CV Distributor
- Ext. Signal Buffer
- Envelope Follower
- Buffered Outputs
- all patch sockets
- free routing

## 8. First recommended small interface move

The safest first move is:

```text
move/integrate VCO 1 controls into the visible VCO 1 area only
```

Reason:

- VCO 1 is already the primary voice source.
- VCO 1 has the clearest one-to-one faceplate controls.
- VCO 1 does not require patch sockets to work.
- VCO 1 can be tested with the existing Plain VCO 1 Sound patch.
- It avoids changing VCO 2, VCO 3, filter, S&H, envelopes, and routing in the same issue.

Good first coding issue after this mapping:

```text
Make visible VCO 1 controls drive the existing VCO 1 browser state only.
```

That later issue should affect only:

- VCO 1 Coarse Freq
- VCO 1 Fine Freq
- VCO 1 Waveform
- VCO 1 Pulse Width %
- VCO 1 Level, only if it can safely use the existing Mixer / VCO 1 Level control

It should not touch:

- VCO 2
- VCO 3
- S&H Pitch Mod
- patch sockets
- external CV
- sync
- PWM modulation
- patch matrix
- audio routing

## 9. Mapping sequence after VCO 1

Recommended order:

1. VCO 1 visible controls
2. VCO 2 visible controls
3. VCO 3 visible controls
4. Mixer source levels
5. Lowpass Filter cutoff/resonance and LFO-1 Mod
6. LFO 1 rate
7. Sample & Hold rate and filter amount
8. Main VCA LFO-2 Mod and LFO 2 rate
9. AR / ADSR visible controls
10. Repeat Gate rate and on/off decision
11. Output level
12. Browser-only safety controls placement

This keeps each move small enough to test.

## 10. Explicit boundary

Do not activate patch sockets as part of this mapping stage.

Do not treat visible jacks as working until a later issue says exactly what they connect to.

Do not add full hardware behaviour while the browser control mapping is still being built.

## 11. Checkpoint statement

```text
Interface Mapping v0.1 defines where each working First Voice browser control belongs on the actual visible synth interface.
```

The next coding issue should move or integrate one small control group only. The recommended first target is VCO 1.
