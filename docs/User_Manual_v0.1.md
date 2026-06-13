# MerrinLab Ultimate Synth — User Manual v0.1

**Project:** MerrinLab Ultimate Synth  
**Manual status:** Living manual  
**Current playable state:** First browser voice with VCO 1, selectable noise, and LFO 1 filter modulation  

## 1. What this is

MerrinLab Ultimate Synth is currently a browser-based software-synth preview.

It began as a dark faceplate preview inspired by the MFOS Sound Lab Ultimate and Ultimate Expander. It now has a small first playable voice added on top of the static faceplate.

This is not yet a full synth.

It is not a VST. It is not a JUCE app. It is not a full MFOS hardware emulation. Most of the faceplate is still visual-only.

The current goal is simple:

```text
Make one safe, shaped, filterable sound using VCO 1, selectable noise, and LFO 1 filter movement.
```

## 2. What works now

The working part is the floating panel called:

```text
First Voice v0.5
```

This panel controls the current playable voice.

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
| Noise Type | Selects the noise colour: White, Pink, or Brown. |
| White NS Level | Sets how much selected noise enters the signal path. |
| Filter Cutoff | Sets the base/centre brightness of VCO 1 and noise. |
| Resonance | Emphasises the sound around the filter cutoff point. |
| LFO 1 Rate | Sets the speed of the filter cutoff movement. |
| LFO-1 Mod | Sets how much LFO 1 moves the filter cutoff. |
| Attack | Sets how quickly the note opens after Gate Note. |
| Release | Sets how quickly the note fades after Release. |
| Output | Sets the final safe output level. |

## 3. Current sound path

The current audio path is:

```text
VCO 1 ─────────┐
               ↓
Selected Noise → simple mixer stage
               ↓
Low-pass filter
               ↓
Main VCA
               ↓
Safe output
```

The current modulation path is:

```text
LFO 1
  ↓
LFO-1 Mod amount
  ↓
Low-pass filter cutoff
```

The current control path is:

```text
Gate Note / Release
  ↓
Simple envelope
  ↓
Main VCA
```

Only VCO 1, the selected noise source, and LFO 1 filter modulation are active.

## 4. How to make a sound safely

Use this order:

1. Open the live preview page.
2. Find the floating **First Voice v0.5** panel.
3. Keep **Output** low at first.
4. Keep **White NS Level** at 0 at first.
5. Keep **LFO-1 Mod** at 0 at first.
6. Choose a **Noise Type** if you want to test noise.
7. Press **Start Audio**.
8. Press **Gate Note**.
9. Adjust **VCO 1 Level** if the oscillator is too quiet.
10. Raise **White NS Level** slowly if you want noise.
11. Adjust **Filter Cutoff** to set the base brightness.
12. Raise **LFO-1 Mod** slowly if you want filter movement.
13. Adjust **LFO 1 Rate** to change movement speed.
14. Press **Release** to let the sound fade.
15. Press **Panic Stop** if anything behaves unexpectedly.

## 5. How to stop the sound

Use **Release** for normal note ending.

Use **Panic Stop** when you want immediate silence.

**Panic Stop** does five important things:

- closes the note level immediately
- silences the noise level
- stops LFO 1 filter movement
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

## 7. Testing noise

Noise works as a second source.

Use **Noise Type** to choose the noise colour.

Current options:

| Noise Type | What to expect |
|---|---|
| White | Bright, full-range noise. Strong for filter testing. |
| Pink | Softer and darker than white noise. |
| Brown | Deeper and darker than pink noise. |

Use **White NS Level** to bring the selected noise in.

The name still says **White NS Level** because it matches the visible faceplate label, but in the First Voice panel it controls the amount of whichever noise type is selected.

Start with a low value. Noise can feel louder than an oscillator because it fills a wide frequency range.

All noise types follow the same path as VCO 1:

```text
Selected Noise
  ↓
Low-pass filter
  ↓
Main VCA
  ↓
Safe output
```

This means:

- **Gate Note** must be open before you hear it.
- **Release** fades it out.
- **Filter Cutoff** changes its brightness clearly.
- **LFO 1** can sweep the filtered noise.
- **Resonance** colours the filtered noise.
- **Panic Stop** silences it.

Noise is useful for testing the filter because it contains many frequencies at once.

## 8. Testing the filter

Use Saw, Square, Pulse, White Noise, Pink Noise, or Brown Noise when testing the filter.

These sources contain enough frequency material for the low-pass filter to remove.

### Filter Cutoff

**Filter Cutoff** sets the base or centre brightness.

Lower cutoff should make the sound darker.

Higher cutoff should make the sound brighter.

Noise should make this especially obvious.

### Resonance

Resonance emphasises the area around the cutoff point.

At this stage, resonance is capped for safety. It should colour the sound, but it should not run away or self-oscillate.

## 9. Testing LFO 1 filter modulation

LFO 1 now moves the low-pass filter cutoff.

It does not make a separate sound by itself. It changes the filter movement.

Use these controls:

| Control | What it does |
|---|---|
| LFO 1 Rate | Controls how fast the filter moves. |
| LFO-1 Mod | Controls how much the filter moves. |
| Filter Cutoff | Sets the base/centre cutoff around which the LFO moves. |

How to test it:

1. Choose **Noise Type: White**.
2. Raise **White NS Level** slowly.
3. Set **Filter Cutoff** around the middle.
4. Raise **LFO-1 Mod** slowly.
5. Adjust **LFO 1 Rate**.

You should hear the filter brightness move up and down.

The LFO modulation is kept inside a safe cutoff range. If **Filter Cutoff** is very low or very high, the LFO may have less room to move.

## 10. Why sine behaves differently

Sine is included because it is a useful basic waveform.

But sine is not a good waveform for testing a low-pass filter.

A near-pure sine has very little harmonic material. A low-pass filter works mainly by removing higher harmonics. If there are almost no higher harmonics, the cutoff control has less obvious work to do.

So with Sine selected:

- Filter Cutoff may sound subtle.
- Resonance may sound subtle.
- LFO 1 filter movement may sound subtle.
- This does not automatically mean the filter is broken.

To test the filter clearly, use:

- Saw
- Square
- Pulse
- White Noise
- Pink Noise
- Brown Noise

## 11. What is still visual-only

Most of the large faceplate is still visual-only.

These are not active yet:

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

## 12. What not to expect yet

Do not expect:

- full three-oscillator sound
- external input
- real patch cables
- full modulation routing
- LFO 2 movement
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

## 13. Current safe test patch

Use this simple patch for testing:

```text
Waveform: Saw
Coarse Freq: around 220 Hz
Fine Freq: 0 cent
VCO 1 Level: low to medium
Noise Type: White
White NS Level: 0 at first
Filter Cutoff: middle
Resonance: low to medium
LFO 1 Rate: slow
LFO-1 Mod: 0 at first
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
6. Choose **Noise Type: White** and raise **White NS Level** slowly.
7. Change **Noise Type** to Pink, then Brown.
8. Move **Filter Cutoff** while noise is audible.
9. Raise **LFO-1 Mod** slowly.
10. Change **LFO 1 Rate**.
11. Try **Sine**, but expect subtler filter changes.
12. Press **Release**.
13. Press **Panic Stop**.

## 14. Manual update rule

This is a living manual.

Every time playable behaviour changes, update this manual.

Examples:

- If VCO 2 becomes active, add a VCO 2 section.
- If LFO 2 begins modulating the VCA, add an LFO 2 section.
- If MIDI input is added, add a MIDI section.
- If a visible control begins working, move it from visual-only to active.

Do not let the manual fall behind the instrument.