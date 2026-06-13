# MerrinLab Ultimate Synth — User Manual v0.1

**Project:** MerrinLab Ultimate Synth  
**Manual status:** Living manual  
**Current playable state:** First browser voice  

## 1. What this is

MerrinLab Ultimate Synth is currently a browser-based software-synth preview.

It began as a dark faceplate preview inspired by the MFOS Sound Lab Ultimate and Ultimate Expander. It now has a small first playable voice added on top of the static faceplate.

This is not yet a full synth.

It is not a VST. It is not a JUCE app. It is not a full MFOS hardware emulation. Most of the faceplate is still visual-only.

The current goal is simple:

```text
Make one safe, shaped, filterable sound.
```

## 2. What works now

The working part is the floating panel called:

```text
First Voice v0.2
```

This panel controls the first playable voice.

Current working controls:

| Control | What it does |
|---|---|
| Start Audio | Starts the browser audio engine after user action. |
| Gate Note | Opens the note so sound can be heard. |
| Release | Releases the note and lets the sound fade. |
| Panic Stop | Silences the sound immediately and closes the audio engine. |
| Coarse Freq | Sets the main VCO 1 pitch. |
| Fine Freq | Detunes VCO 1 slightly around the coarse pitch. |
| Waveform | Chooses the active VCO 1 waveform. |
| Pulse Width % | Changes Pulse waveform shape only. |
| VCO 1 Level | Sets how much VCO 1 enters the signal path. |
| Filter Cutoff | Changes the brightness of the sound. |
| Resonance | Emphasises the sound around the filter cutoff point. |
| Attack | Sets how quickly the note opens after Gate Note. |
| Release | Sets how quickly the note fades after Release. |
| Output | Sets the final safe output level. |

## 3. Current sound path

The current audio path is:

```text
VCO 1
  ↓
VCO 1 Level
  ↓
Low-pass filter
  ↓
Main VCA
  ↓
Safe output
```

The current control path is:

```text
Gate Note / Release
  ↓
Simple envelope
  ↓
Main VCA
```

Only VCO 1 makes sound.

## 4. How to make a sound safely

Use this order:

1. Open the live preview page.
2. Find the floating **First Voice v0.2** panel.
3. Keep **Output** low at first.
4. Press **Start Audio**.
5. Press **Gate Note**.
6. Adjust **VCO 1 Level** if the sound is too quiet.
7. Adjust **Filter Cutoff** to hear the sound get darker or brighter.
8. Press **Release** to let the sound fade.
9. Press **Panic Stop** if anything behaves unexpectedly.

## 5. How to stop the sound

Use **Release** for normal note ending.

Use **Panic Stop** when you want immediate silence.

**Panic Stop** does three important things:

- closes the note level immediately
- sets the output to silent
- closes the browser audio context

After using **Panic Stop**, press **Start Audio** again before making another sound.

## 6. Testing VCO 1

VCO 1 has these active waveform choices:

- Saw
- Square
- Triangle
- Sine
- Pulse

### Coarse Freq

Use **Coarse Freq** for the main pitch.

Move it slowly. It changes the oscillator frequency across a safe test range.

### Fine Freq

Use **Fine Freq** for small tuning changes.

It moves in cents, not large pitch jumps.

### Waveform

Use **Waveform** to change the oscillator shape.

Different waveforms give the filter different material to work with.

| Waveform | What to expect |
|---|---|
| Saw | Bright, strong, good for testing filter cutoff. |
| Square | Hollow, strong, good for testing resonance. |
| Triangle | Softer than saw and square. |
| Sine | Very plain. Filter changes are subtle. |
| Pulse | Bright and adjustable using Pulse Width %. |

### Pulse Width %

**Pulse Width %** only matters when **Waveform** is set to **Pulse**.

It changes the shape of the pulse wave.

If the waveform is Saw, Square, Triangle, or Sine, Pulse Width % should not be treated as active sound control.

## 7. Testing the filter

Use Saw, Square, or Pulse when testing the filter.

These waveforms contain enough harmonic material for the low-pass filter to remove.

### Filter Cutoff

Lower cutoff should make the sound darker.

Higher cutoff should make the sound brighter.

### Resonance

Resonance emphasises the area around the cutoff point.

At this stage, resonance is capped for safety. It should colour the sound, but it should not run away or self-oscillate.

## 8. Why sine behaves differently

Sine is included because it is a useful basic waveform.

But sine is not a good waveform for testing a low-pass filter.

A near-pure sine has very little harmonic material. A low-pass filter works mainly by removing higher harmonics. If there are almost no higher harmonics, the cutoff control has less obvious work to do.

So with Sine selected:

- Filter Cutoff may sound subtle.
- Resonance may sound subtle.
- This does not automatically mean the filter is broken.

To test the filter clearly, use:

- Saw
- Square
- Pulse

## 9. What is still visual-only

Most of the large faceplate is still visual-only.

These are not active yet:

- VCO 2
- VCO 3
- VCO 2 Level
- VCO 3 Level
- White NS Level
- Ext. In Level
- PWM
- SYNC
- LOG-CV
- LIN-CV
- low-pass external CV inputs
- LFO 1
- LFO 2
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

These controls are visible because the faceplate is being built toward the larger instrument.

They should not be expected to affect sound yet.

## 10. What not to expect yet

Do not expect:

- full three-oscillator sound
- white noise
- external input
- real patch cables
- modulation routing
- LFO movement
- sample and hold
- repeat gate triggering
- ADSR shaping
- state-variable filter sound
- Expander utility behaviour
- MIDI input
- MIDI learn
- presets
- VST plugin behaviour
- exact MFOS hardware emulation

## 11. Current safe test patch

Use this simple patch for testing:

```text
Waveform: Saw
Coarse Freq: around 220 Hz
Fine Freq: 0 cent
VCO 1 Level: low to medium
Filter Cutoff: middle
Resonance: low to medium
Attack: short
Release: medium
Output: low
```

Then test:

1. Move **Filter Cutoff** down and up.
2. Increase **Resonance** carefully.
3. Change **Waveform** to Square.
4. Change **Waveform** to Pulse.
5. Move **Pulse Width %** while Pulse is selected.
6. Try **Sine**, but expect subtler filter changes.
7. Press **Release**.
8. Press **Panic Stop**.

## 12. Manual update rule

This is a living manual.

Every time playable behaviour changes, update this manual.

Examples:

- If VCO 2 becomes active, add a VCO 2 section.
- If noise becomes active, add a noise section.
- If LFO 1 begins modulating the filter, add an LFO section.
- If MIDI input is added, add a MIDI section.
- If a visible control begins working, move it from visual-only to active.

Do not let the manual fall behind the instrument.