# First Voice v0.6 Checkpoint

**Project:** MerrinLab Ultimate Synth  
**Checkpoint:** First Voice v0.6  
**Status:** Stable playable browser baseline before the next feature  
**Scope:** Documentation checkpoint only  

## 1. Purpose

This checkpoint records the current stable playable state of the browser preview.

It does not add new behaviour. It does not change the UI. It does not start JUCE, VST, MIDI, patch routing, or full hardware emulation work.

The purpose is to freeze the current working baseline before the next feature is added.

## 2. Current playable baseline

The current floating panel is:

```text
First Voice v0.6
```

The living manual has been checked and reflects this state.

Current active sound sources:

```text
VCO 1
Selectable Noise: White / Pink / Brown
```

Current active modulation:

```text
LFO 1 → low-pass filter cutoff
LFO 2 → Main VCA level / tremolo
```

Current active audio path:

```text
VCO 1 ─────────┐
               ↓
Selected Noise → simple mixer stage
               ↓
Low-pass filter
               ↓
Main VCA
               ↓
LFO 2 tremolo stage
               ↓
Safe output
```

## 3. What works

The following controls are active in the First Voice panel:

| Control | Current behaviour |
|---|---|
| Start Audio | Starts browser audio after user action. |
| Gate Note | Opens the note through the VCA envelope path. |
| Release | Releases the note and lets it fade. |
| Panic Stop | Silences and stops the active audio graph. |
| Coarse Freq | Sets the main VCO 1 pitch. |
| Fine Freq | Fine detunes VCO 1 around the coarse pitch. |
| Waveform | Selects Saw, Square, Triangle, Sine, or Pulse. |
| Pulse Width % | Changes Pulse waveform shape only. |
| VCO 1 Level | Controls VCO 1 amount into the path. |
| Noise Type | Selects White, Pink, or Brown noise. |
| White NS Level | Controls the amount of selected noise. |
| Filter Cutoff | Sets the base/centre low-pass cutoff. |
| Resonance | Colours the sound around the cutoff point. |
| LFO 1 Rate | Controls filter movement speed. |
| LFO-1 Mod | Controls filter movement amount. |
| LFO 2 Rate | Controls tremolo speed. |
| LFO-2 Mod | Controls tremolo amount. |
| Attack | Controls note opening speed. |
| Release | Controls note fade speed. |
| Output | Controls final safe output level. |

## 4. What remains visual-only

The following visible faceplate areas are not active yet:

- VCO 2
- VCO 3
- VCO 2 Level
- VCO 3 Level
- Ext. In Level
- PWM
- SYNC
- LOG-CV
- LIN-CV
- low-pass external CV inputs
- Sample & Hold
- Repeat Gate Rate
- Attenuators
- ADSR Env. Gen.
- AUX VCA
- State Variable VCF
- Signal Mixer
- Analog Multiplier
- CV Inverter
- CV Distributor
- Ext. Signal Buffer
- Envelope Follower
- Buffered Outputs
- patch sockets
- free routing
- presets
- MIDI learn

These controls are visible because the faceplate is being built toward the larger instrument. They should not be expected to affect sound in v0.6.

## 5. Safety rules confirmed

Current safety rules:

- Audio starts only after user action.
- Output remains low and controlled.
- `Output` is capped at a safe range.
- Resonance is capped.
- Noise level starts at `0`.
- `LFO-1 Mod` starts at `0`.
- `LFO-2 Mod` starts at `0`.
- LFO 1 only modulates low-pass filter cutoff.
- LFO 2 only modulates Main VCA level / tremolo.
- VCO 1 remains the only active oscillator.
- Selectable noise remains the only non-oscillator source.
- Panic Stop silences and stops the active oscillator, noise source, LFO 1, LFO 2, VCA/tremolo path, and output path.
- No feedback path has been added.
- No microphone or live input has been added.
- No patch matrix or free routing has been added.

## 6. Manual check

The living manual is current for this checkpoint:

```text
docs/User_Manual_v0.1.md
```

It reflects:

- First Voice v0.6
- VCO 1 as the only oscillator
- selectable White / Pink / Brown noise
- low-pass filter path
- LFO 1 filter cutoff modulation
- LFO 2 VCA/tremolo modulation
- Gate/Release behaviour
- Panic Stop behaviour
- visual-only controls
- current safe test patch

## 7. Next allowed feature candidates

The next feature should be small and should update the manual.

Allowed candidates:

1. **ADSR as an optional VCA envelope**
   - Make the visible ADSR useful.
   - Keep AR/simple Gate path intact until ADSR is tested.
   - Do not add full routing.

2. **Sample & Hold as filter cutoff modulation only**
   - Use S&H to move low-pass filter cutoff.
   - Keep it separate from pitch first.
   - Do not add full CV routing.

3. **Repeat Gate as gate trigger source only**
   - Add repeat gate triggering to the existing voice.
   - Keep it inside the current VCA/envelope path.
   - Do not add sequencer or MIDI.

4. **VCO 2 as a second oscillator source**
   - Add only one second oscillator.
   - Route it through the existing mixer/filter/VCA/output path.
   - Do not add VCO 3 in the same issue.

5. **Manual quick-start improvement**
   - Improve the manual without changing sound.
   - Useful if the playable behaviour is getting hard to explain.

## 8. Features not allowed in the next small issue

Do not jump straight to:

- VCO 2 and VCO 3 together
- full patch matrix
- external input
- MIDI learn
- presets
- JUCE
- VST
- exact MFOS hardware emulation
- full Expander utility behaviour

## 9. Checkpoint statement

```text
First Voice v0.6 is the stable playable baseline before the next feature.
```

Any next playable feature should start from this baseline and update the living manual at the same time.