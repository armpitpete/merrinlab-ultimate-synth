# First Voice v0.9 Checkpoint

**Project:** MerrinLab Ultimate Synth  
**Checkpoint:** First Voice v0.9  
**Status:** Stable playable browser baseline before the next feature  
**Scope:** Documentation checkpoint only  

## 1. Purpose

This checkpoint records the current stable playable state of the browser preview after Repeat Gate was added and tested.

It does not add new behaviour. It does not change the UI. It does not add routing. It does not start MIDI, JUCE, VST, or full hardware emulation work.

The purpose is to freeze the current working baseline before adding VCO 2, pitch Sample & Hold, external input, or wider routing.

## 2. Current playable baseline

The current floating panel is:

```text
First Voice v0.9
```

The living manual has been checked and reflects this state:

```text
docs/User_Manual_v0.1.md
```

Current active sound sources:

```text
VCO 1
Selectable Noise: White / Pink / Brown
```

Current active modulation and control:

```text
LFO 1 → low-pass filter cutoff
Sample & Hold → low-pass filter cutoff
LFO 2 → Main VCA level / tremolo
Envelope Mode → AR or ADSR VCA envelope
Repeat Gate → existing AR/ADSR envelope path only
```

Current active audio path:

```text
VCO 1 ─────────┐
               ↓
Selected Noise → simple mixer stage
               ↓
Low-pass filter
               ↓
Main VCA / selected envelope
               ↓
LFO 2 tremolo stage
               ↓
Safe output
```

Current envelope and trigger path:

```text
Gate Note / Release
or
Repeat Gate
  ↓
Envelope Mode: AR or ADSR
  ↓
Main VCA
```

## 3. What works

The following controls are active in the First Voice panel:

| Control | Current behaviour |
|---|---|
| Start Audio | Starts browser audio after user action. |
| Gate Note | Opens the note and starts the selected envelope. |
| Release | Releases the selected envelope. |
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
| LFO 1 Rate | Controls smooth filter movement speed. |
| LFO-1 Mod | Controls smooth filter movement amount. |
| S&H Rate | Controls stepped random filter-change rate. |
| S&H Mod | Controls stepped random filter-change amount. |
| LFO 2 Rate | Controls tremolo speed. |
| LFO-2 Mod | Controls tremolo amount. |
| Envelope Mode | Selects AR or ADSR VCA envelope behaviour. |
| Repeat Gate | Turns repeated envelope triggering Off or On. |
| Repeat Gate Rate | Controls repeated envelope trigger speed. |
| AR Attack | Controls AR opening speed. |
| AR Release | Controls AR fade speed. |
| ADSR Attack | Controls ADSR opening speed. |
| ADSR Decay | Controls ADSR fall from peak to sustain. |
| ADSR Sustain | Controls ADSR held level while the gate is open. |
| ADSR Release | Controls ADSR fade speed after Release. |
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
- Attenuators
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

The ADSR Env. Gen., Sample & Hold, and Repeat Gate concepts have started to become active through the First Voice panel, but they are not yet patchable modules.

## 5. Safety rules confirmed

Current safety rules:

- Audio starts only after user action.
- Output remains low and controlled.
- `Output` is capped at a safe range.
- Resonance is capped.
- Noise level starts at `0`.
- `LFO-1 Mod` starts at `0`.
- `S&H Mod` starts at `0`.
- `LFO-2 Mod` starts at `0`.
- `Repeat Gate` starts Off.
- VCO 1 remains the only active oscillator.
- Selectable noise remains the only non-oscillator sound source.
- LFO 1 only modulates low-pass filter cutoff.
- Sample & Hold only modulates low-pass filter cutoff.
- LFO 2 only modulates Main VCA level / tremolo.
- AR/ADSR only controls the VCA envelope path.
- Repeat Gate only triggers the existing AR/ADSR envelope path.
- Repeat Gate does not change pitch.
- Repeat Gate is not a sequencer.
- S&H does not control pitch yet.
- ADSR is not patchable yet.
- S&H is not patchable yet.
- Repeat Gate is not patchable yet.
- Panic Stop silences and stops the active oscillator, noise source, LFO 1, S&H offset/timer, LFO 2, envelope/VCA path, Repeat Gate timer, tremolo path, and output path.
- No feedback path has been added.
- No microphone or live input has been added.
- No patch matrix or free routing has been added.

## 6. Manual check

The living manual is current for this checkpoint:

```text
docs/User_Manual_v0.1.md
```

It reflects:

- First Voice v0.9
- VCO 1 as the only oscillator
- selectable White / Pink / Brown noise
- low-pass filter path
- LFO 1 filter cutoff modulation
- Sample & Hold filter cutoff modulation
- LFO 2 VCA/tremolo modulation
- AR/ADSR envelope mode
- Repeat Gate envelope triggering
- Gate Note / Release behaviour
- Panic Stop behaviour
- visual-only controls
- current safe test patch

## 7. Next allowed feature candidates

The next feature should be small and should update the manual.

Allowed candidates:

1. **VCO 2 as a second oscillator source only**
   - Add one second oscillator.
   - Route it through the existing mixer/filter/VCA/output path.
   - Do not add VCO 3 in the same issue.

2. **S&H to pitch as a separate later issue**
   - Only consider after filter S&H and Repeat Gate are stable.
   - Keep it optional and default-off.
   - Do not add full CV routing.

3. **Manual quick-start cleanup**
   - Improve the manual without changing sound.
   - Useful if the First Voice panel is getting too dense.

4. **First Voice panel grouping cleanup**
   - UI organisation only.
   - Group oscillator, noise, filter modulation, amplitude/envelope, Repeat Gate, and output controls.
   - Do not change behaviour.

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
First Voice v0.9 is the stable playable baseline before the next feature.
```

Any next playable feature should start from this baseline and update the living manual at the same time.