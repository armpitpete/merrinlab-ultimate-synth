# MerrinLab Ultimate Synth — User Manual v0.1

**Project:** MerrinLab Ultimate Synth  
**Manual status:** Living manual  
**Current playable state:** First browser voice with VCO 1, VCO 2, selectable noise, LFO 1 filter modulation, S&H filter modulation, LFO 2 VCA modulation, optional ADSR envelope mode, and Repeat Gate triggering  

## 1. What this is

MerrinLab Ultimate Synth is currently a browser-based software-synth preview.

It began as a dark faceplate preview inspired by the MFOS Sound Lab Ultimate and Ultimate Expander. It now has a small first playable voice added on top of the static faceplate.

This is not yet a full synth.

It is not a VST. It is not a JUCE app. It is not a full MFOS hardware emulation. Most of the faceplate is still visual-only.

The current goal is simple:

```text
Make one safe, shaped, filterable sound using VCO 1, VCO 2, selectable noise, filter movement, level movement, optional envelope shaping, simple stepped S&H filter movement, and Repeat Gate envelope triggering.
```

## Quick-start test route

Use this route when you only want to check that First Voice v1.0 still works.

Start with everything quiet:

```text
Output: low
VCO 2 Level: 0
White NS Level: 0
LFO-1 Mod: 0
S&H Mod: 0
LFO-2 Mod: 0
Repeat Gate: Off
Envelope Mode: AR
```

Then test in this order:

1. Press **Start Audio**.
2. Press **Gate Note**.
3. Use **VCO 1 Level** and **VCO 1 Coarse Freq** to hear VCO 1.
4. Raise **VCO 2 Level** slowly and tune VCO 2 near VCO 1.
5. Raise **White NS Level** slowly if you want noise.
6. Move **Filter Cutoff** down and up.
7. Raise **Resonance** carefully.
8. Raise **LFO-1 Mod** and adjust **LFO 1 Rate** for smooth filter movement.
9. Raise **S&H Mod** and adjust **S&H Rate** for stepped random filter movement.
10. Raise **LFO-2 Mod** and adjust **LFO 2 Rate** for tremolo.
11. Change **Envelope Mode** to ADSR and test **ADSR Attack**, **ADSR Decay**, **ADSR Sustain**, and **ADSR Release**.
12. Turn **Repeat Gate** On and adjust **Repeat Gate Rate**.
13. Turn **Repeat Gate** Off.
14. Press **Release**.
15. Press **Panic Stop**.

Good enough means:

- VCO 1 makes sound.
- VCO 2 can be added without a jump in volume.
- Noise can be added slowly.
- Filter, LFO 1, S&H, LFO 2, ADSR, and Repeat Gate all affect the current voice.
- **Panic Stop** makes everything silent.

## 2. What works now

The working part is the floating panel called:

```text
First Voice v1.0
```

This panel controls the current playable voice.

Current working controls:

| Control | What it does |
|---|---|
| Start Audio | Starts the browser audio engine after user action. |
| Gate Note | Opens the note and starts the selected envelope. |
| Release | Releases the selected envelope. |
| Panic Stop | Silences the sound immediately and closes the audio engine. |
| VCO 1 Coarse Freq | Sets the main VCO 1 pitch. |
| VCO 1 Fine Freq | Detunes VCO 1 slightly around the coarse pitch. |
| VCO 1 Waveform | Chooses the active VCO 1 waveform. |
| VCO 1 Pulse Width % | Changes VCO 1 Pulse waveform shape only. |
| VCO 1 Level | Sets how much VCO 1 enters the signal path. |
| VCO 2 Coarse Freq | Sets the main VCO 2 pitch. |
| VCO 2 Fine Freq | Detunes VCO 2 slightly around the coarse pitch. |
| VCO 2 Waveform | Chooses the active VCO 2 waveform. |
| VCO 2 Pulse Width % | Changes VCO 2 Pulse waveform shape only. |
| VCO 2 Level | Sets how much VCO 2 enters the signal path. |
| Noise Type | Selects the noise colour: White, Pink, or Brown. |
| White NS Level | Sets how much selected noise enters the signal path. |
| Filter Cutoff | Sets the base/centre brightness of VCO 1, VCO 2, and noise. |
| Resonance | Emphasises the sound around the filter cutoff point. |
| LFO 1 Rate | Sets the speed of the filter cutoff movement. |
| LFO-1 Mod | Sets how much LFO 1 moves the filter cutoff. |
| S&H Rate | Sets how often the stepped random filter value changes. |
| S&H Mod | Sets how much S&H moves the filter cutoff. |
| LFO 2 Rate | Sets the speed of the VCA level movement. |
| LFO-2 Mod | Sets how much LFO 2 moves the Main VCA level. |
| Envelope Mode | Chooses simple AR or ADSR envelope behaviour. |
| Repeat Gate | Turns repeated envelope triggering Off or On. |
| Repeat Gate Rate | Sets how often Repeat Gate triggers the envelope. |
| AR Attack | Sets simple AR opening speed. |
| AR Release | Sets simple AR fade speed. |
| ADSR Attack | Sets ADSR opening speed. |
| ADSR Decay | Sets how quickly ADSR falls from peak to sustain. |
| ADSR Sustain | Sets the held level while Gate Note remains open. |
| ADSR Release | Sets ADSR fade speed after Release. |
| Output | Sets the final safe output level. |

## 3. Current sound path

The current audio path is:

```text
VCO 1 ─────────┐
VCO 2 ─────────┤
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

The current modulation paths are:

```text
LFO 1
  ↓
LFO-1 Mod amount
  ↓
Low-pass filter cutoff
```

```text
Sample & Hold
  ↓
S&H Mod amount
  ↓
Low-pass filter cutoff
```

```text
LFO 2
  ↓
LFO-2 Mod amount
  ↓
Main VCA level / tremolo stage
```

The current envelope and trigger path is:

```text
Gate Note / Release
or
Repeat Gate
  ↓
Envelope Mode: AR or ADSR
  ↓
Main VCA
```

Only VCO 1, VCO 2, the selected noise source, LFO 1 filter modulation, S&H filter modulation, LFO 2 VCA modulation, the selected envelope mode, and Repeat Gate triggering are active.

## 4. How to make a sound safely

Use this order:

1. Open the live preview page.
2. Find the floating **First Voice v1.0** panel.
3. Keep **Output** low at first.
4. Keep **VCO 2 Level** at 0 at first.
5. Keep **White NS Level** at 0 at first.
6. Keep **LFO-1 Mod** at 0 at first.
7. Keep **S&H Mod** at 0 at first.
8. Keep **LFO-2 Mod** at 0 at first.
9. Keep **Repeat Gate** Off at first.
10. Leave **Envelope Mode** on AR at first.
11. Press **Start Audio**.
12. Press **Gate Note**.
13. Adjust **VCO 1 Level** if the oscillator is too quiet.
14. Raise **VCO 2 Level** slowly if you want a second oscillator.
15. Adjust **VCO 2 Coarse Freq**, **VCO 2 Fine Freq**, and **VCO 2 Waveform**.
16. Raise **White NS Level** slowly if you want noise.
17. Adjust **Filter Cutoff** to set the base brightness.
18. Raise **LFO-1 Mod** slowly if you want smooth filter movement.
19. Raise **S&H Mod** slowly if you want stepped random filter movement.
20. Raise **LFO-2 Mod** slowly if you want tremolo.
21. Change **Envelope Mode** to ADSR only after the basic sound works.
22. Turn **Repeat Gate** On only after audio is already started.
23. Adjust **Repeat Gate Rate** slowly.
24. Press **Release** to let the selected envelope fade, or turn **Repeat Gate** Off.
25. Press **Panic Stop** if anything behaves unexpectedly.

## 5. How to stop the sound

Use **Release** for normal note ending.

Turn **Repeat Gate** Off to stop repeated triggering.

Use **Panic Stop** when you want immediate silence.

**Panic Stop** does these things:

- closes the note level immediately
- stops VCO 1
- stops VCO 2
- silences the noise level
- stops LFO 1 filter movement
- stops S&H filter movement
- stops LFO 2 level movement
- stops Repeat Gate triggering
- clears the envelope/VCA path
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

### VCO 1 Coarse Freq

Use **VCO 1 Coarse Freq** for the main pitch.

Move it slowly. It changes the oscillator frequency across a safe test range.

### VCO 1 Fine Freq

Use **VCO 1 Fine Freq** for small tuning changes.

It moves in cents, not large pitch jumps.

### VCO 1 Waveform

Use **VCO 1 Waveform** to change the oscillator shape.

Different waveforms give the filter different material to work with.

| Waveform | What to expect |
|---|---|
| Saw | Bright, strong, good for testing filter cutoff. |
| Square | Hollow, strong, good for testing resonance. |
| Triangle | Softer than saw and square. |
| Sine | Very plain. Filter changes are subtle. |
| Pulse | Bright and adjustable using Pulse Width %. |

### VCO 1 Pulse Width %

**VCO 1 Pulse Width %** only matters when **VCO 1 Waveform** is set to **Pulse**.

It changes the shape of the pulse wave.

If the waveform is Saw, Square, Triangle, or Sine, Pulse Width % should not be treated as active sound control.

## 7. Testing VCO 2

VCO 2 is now a second oscillator source.

It follows the same sound path as VCO 1:

```text
VCO 2
  ↓
Low-pass filter
  ↓
Main VCA / selected envelope
  ↓
LFO 2 tremolo stage
  ↓
Safe output
```

VCO 2 has these active waveform choices:

- Saw
- Square
- Triangle
- Sine
- Pulse

### VCO 2 Level

**VCO 2 Level** controls how much VCO 2 enters the sound path.

It starts at 0 for safety.

Raise it slowly. Two oscillators plus noise can become louder than one oscillator.

### VCO 2 Coarse Freq and Fine Freq

Use **VCO 2 Coarse Freq** for the main VCO 2 pitch.

Use **VCO 2 Fine Freq** for small detuning.

A simple test is:

1. Keep **VCO 1 Level** audible.
2. Raise **VCO 2 Level** slowly.
3. Set **VCO 2 Coarse Freq** near VCO 1.
4. Move **VCO 2 Fine Freq** slightly.

You should hear the two oscillators blend or beat against each other.

### VCO 2 Waveform and Pulse Width

Use **VCO 2 Waveform** to choose VCO 2's shape.

**VCO 2 Pulse Width %** only matters when **VCO 2 Waveform** is set to **Pulse**.

VCO 2 is not patchable yet. It does not add sync, PWM modulation, pitch S&H, or free routing.

## 8. Testing noise

Noise works as a third source alongside VCO 1 and VCO 2.

Use **Noise Type** to choose the noise colour.

| Noise Type | What to expect |
|---|---|
| White | Bright, full-range noise. Strong for filter testing. |
| Pink | Softer and darker than white noise. |
| Brown | Deeper and darker than pink noise. |

Use **White NS Level** to bring the selected noise in.

The name still says **White NS Level** because it matches the visible faceplate label, but in the First Voice panel it controls the amount of whichever noise type is selected.

All noise types follow the same path as the oscillators:

```text
Selected Noise
  ↓
Low-pass filter
  ↓
Main VCA / selected envelope
  ↓
LFO 2 tremolo stage
  ↓
Safe output
```

## 9. Testing the filter

Use Saw, Square, Pulse, White Noise, Pink Noise, or Brown Noise when testing the filter.

These sources contain enough frequency material for the low-pass filter to remove.

### Filter Cutoff

**Filter Cutoff** sets the base or centre brightness.

Lower cutoff should make the sound darker.

Higher cutoff should make the sound brighter.

### Resonance

Resonance emphasises the area around the cutoff point.

At this stage, resonance is capped for safety. It should colour the sound, but it should not run away or self-oscillate.

## 10. Testing LFO 1 filter modulation

LFO 1 moves the low-pass filter cutoff smoothly.

It does not make a separate sound by itself. It changes the filter movement.

| Control | What it does |
|---|---|
| LFO 1 Rate | Controls how fast the filter moves. |
| LFO-1 Mod | Controls how much the filter moves. |
| Filter Cutoff | Sets the base/centre cutoff around which the LFO moves. |

Good test:

1. Choose **Noise Type: White**.
2. Raise **White NS Level** slowly.
3. Set **Filter Cutoff** around the middle.
4. Raise **LFO-1 Mod** slowly.
5. Adjust **LFO 1 Rate**.

You should hear smooth filter brightness movement.

## 11. Testing Sample & Hold filter modulation

Sample & Hold moves the low-pass filter cutoff in stepped random changes.

It does not affect pitch yet. It is not patchable yet.

| Control | What it does |
|---|---|
| S&H Rate | Controls how often the random value changes. |
| S&H Mod | Controls how much the random value moves the filter cutoff. |
| Filter Cutoff | Sets the base/centre cutoff. |

Good test:

1. Choose **Noise Type: White**.
2. Raise **White NS Level** slowly.
3. Set **Filter Cutoff** around the middle.
4. Keep **LFO-1 Mod** low at first.
5. Raise **S&H Mod** slowly.
6. Adjust **S&H Rate**.

You should hear stepped random brightness changes.

S&H modulation stays inside the safe filter range. If **LFO-1 Mod** is already high, S&H may have less room to move.

## 12. Testing LFO 2 VCA modulation

LFO 2 moves the Main VCA level.

This is tremolo: the sound gets louder and quieter automatically.

| Control | What it does |
|---|---|
| LFO 2 Rate | Controls how fast the level rises and falls. |
| LFO-2 Mod | Controls how deep the level movement is. |
| Gate Note / Release | Still controls the overall note shape. |

Good test:

1. Start with **LFO-2 Mod** at 0.
2. Press **Gate Note**.
3. Raise **LFO-2 Mod** slowly.
4. Adjust **LFO 2 Rate**.

You should hear the whole sound pulse in level.

LFO 2 stays inside the safe VCA/output path. It should not create output spikes.

## 13. Testing Envelope Mode

**Envelope Mode** chooses how **Gate Note**, **Release**, and **Repeat Gate** shape the Main VCA.

Current options:

| Envelope Mode | What it does |
|---|---|
| AR | Simple attack/release behaviour. This is the earlier safe behaviour. |
| ADSR | Attack, Decay, Sustain, Release shaping. |

### AR mode

AR mode uses:

- **AR Attack**
- **AR Release**

Use AR when you want the previous simple behaviour.

### ADSR mode

ADSR mode uses:

- **ADSR Attack**
- **ADSR Decay**
- **ADSR Sustain**
- **ADSR Release**

How ADSR behaves:

1. **Gate Note** or **Repeat Gate** starts the envelope.
2. The sound rises over **ADSR Attack**.
3. The sound falls from peak to the sustain level over **ADSR Decay**.
4. The sound stays at **ADSR Sustain** while the gate is open.
5. **Release** or the Repeat Gate release phase fades the sound using **ADSR Release**.

LFO 2 tremolo still happens after the envelope, so tremolo can pulse either AR-shaped or ADSR-shaped notes.

## 14. Testing Repeat Gate

Repeat Gate repeatedly triggers the current envelope.

It does not change pitch. It is not a sequencer. It is not patchable yet.

| Control | What it does |
|---|---|
| Repeat Gate | Turns repeated envelope triggering Off or On. |
| Repeat Gate Rate | Controls how often the envelope is triggered. |
| Envelope Mode | Chooses whether Repeat Gate triggers AR or ADSR behaviour. |

Good test:

1. Keep **Repeat Gate** Off.
2. Press **Start Audio**.
3. Press **Gate Note** once to confirm the voice works.
4. Press **Release**.
5. Set **Envelope Mode** to AR.
6. Turn **Repeat Gate** On.
7. Adjust **Repeat Gate Rate**.
8. Change **Envelope Mode** to ADSR and test again.
9. Turn **Repeat Gate** Off.
10. Press **Panic Stop**.

Repeat Gate should only trigger the current envelope path. It should not change pitch, add steps, start MIDI, or create a sequencer.

## 15. Why sine behaves differently

Sine is included because it is a useful basic waveform.

But sine is not a good waveform for testing a low-pass filter.

A near-pure sine has very little harmonic material. A low-pass filter works mainly by removing higher harmonics. If there are almost no higher harmonics, the cutoff control has less obvious work to do.

So with Sine selected:

- Filter Cutoff may sound subtle.
- Resonance may sound subtle.
- LFO 1 filter movement may sound subtle.
- S&H filter movement may sound subtle.
- This does not automatically mean the filter is broken.

To test the filter clearly, use:

- Saw
- Square
- Pulse
- White Noise
- Pink Noise
- Brown Noise

## 16. What is still visual-only

Most of the large faceplate is still visual-only.

These are not active yet:

- VCO 3
- VCO 3 Level
- Ext. In Level
- PWM modulation
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

The **VCO 2**, **ADSR Env. Gen.**, **Sample & Hold**, and **Repeat Gate** concepts have now started to become active through the First Voice panel, but they are not yet patchable modules.

## 17. What not to expect yet

Do not expect:

- full three-oscillator sound
- VCO 2 sync
- VCO 2 PWM modulation
- VCO 2 patch routing
- pitch randomisation
- external input
- real patch cables
- full modulation routing
- sequencer behaviour
- pitch changes from Repeat Gate
- patchable ADSR routing
- patchable Sample & Hold routing
- patchable Repeat Gate routing
- state-variable filter sound
- Expander utility behaviour
- MIDI input
- MIDI learn
- presets
- VST plugin behaviour
- exact MFOS hardware emulation

## 18. Current safe test patch

Use this simple patch for testing:

```text
VCO 1 Waveform: Saw
VCO 1 Coarse Freq: around 220 Hz
VCO 1 Fine Freq: 0 cent
VCO 1 Level: low to medium
VCO 2 Waveform: Saw
VCO 2 Coarse Freq: around 220 Hz
VCO 2 Fine Freq: 0 cent
VCO 2 Level: 0 at first
Noise Type: White
White NS Level: 0 at first
Filter Cutoff: middle
Resonance: low to medium
LFO 1 Rate: slow
LFO-1 Mod: 0 at first
S&H Rate: slow to medium
S&H Mod: 0 at first
LFO 2 Rate: slow
LFO-2 Mod: 0 at first
Envelope Mode: AR first, then ADSR
Repeat Gate: Off first
Repeat Gate Rate: slow to medium
AR Attack: short
AR Release: medium
ADSR Attack: short
ADSR Decay: medium
ADSR Sustain: medium
ADSR Release: medium
Output: low
```

Then test:

1. Press **Start Audio**.
2. Press **Gate Note** in AR mode.
3. Raise **VCO 2 Level** slowly.
4. Change **VCO 2 Coarse Freq** and **VCO 2 Fine Freq**.
5. Change **VCO 2 Waveform**.
6. Press **Release**.
7. Turn **Repeat Gate** On.
8. Confirm Repeat Gate triggers both oscillators through the selected envelope.
9. Raise **White NS Level** slowly.
10. Raise **S&H Mod** slowly.
11. Raise **LFO-1 Mod** slowly and check it still works with both oscillators.
12. Raise **LFO-2 Mod** slowly and confirm tremolo still happens after the envelope.
13. Turn **Repeat Gate** Off.
14. Press **Panic Stop**.

## 19. Manual update rule

This is a living manual.

Every time playable behaviour changes, update this manual.

Examples:

- If VCO 3 becomes active, add a VCO 3 section.
- If MIDI input is added, add a MIDI section.
- If a visible control begins working, move it from visual-only to active.

Do not let the manual fall behind the instrument.