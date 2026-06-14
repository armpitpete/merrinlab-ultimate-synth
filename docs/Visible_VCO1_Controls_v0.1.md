# Visible VCO 1 Controls v0.1

**Project:** MerrinLab Ultimate Synth  
**Issue:** #46 — Make visible VCO 1 controls drive existing VCO 1 state only  
**Status:** First visible-interface control bridge  

## 1. Purpose

This note records the first move from temporary browser controls toward the actual visible synth interface.

The visible VCO 1 controls now drive the existing First Voice VCO 1 state.

This is still not patching. It does not activate patch sockets. It does not create a patch matrix. It does not add new sound behaviour.

## 2. Active visible controls

The following visible controls are now active through the existing VCO 1 state:

| Visible area | Existing state key |
|---|---|
| VCO 1 / Coarse Freq | `coarseFreq` |
| VCO 1 / Fine Freq | `fineCents` |
| VCO 1 / Waveform | `waveform` |
| VCO 1 / Pulse Width % | `pulseWidth` |
| Mixer / VCO 1 Level | `vcoLevel` |

## 3. Implementation model

A small bridge script connects the visible faceplate controls to the existing First Voice controls:

```text
faceplate-preview/vco1-visible-controls.js
```

The existing audio engine remains the source of truth:

```text
faceplate-preview/audio-engine.js
```

The bridge sends changes from visible VCO 1 controls into the existing audio controls. This keeps the proven audio path intact.

## 4. What did not change

No new sound features were added.

Unchanged:

- VCO 2
- VCO 3
- filter behaviour
- S&H filter modulation
- S&H Pitch Mod
- LFO 1
- LFO 2
- AR/ADSR
- Repeat Gate
- Output behaviour
- patch sockets
- PWM modulation
- SYNC
- LOG-CV / LIN-CV
- patch routing
- patch matrix
- external input
- presets
- save/load
- MIDI
- JUCE
- VST

## 5. Test route

Use Patch 1:

```text
Plain VCO 1 Sound
```

Test:

1. Start Audio.
2. Gate Note.
3. Use only VCO 1.
4. Move the visible VCO 1 Coarse Freq control.
5. Move the visible VCO 1 Fine Freq control.
6. Change the visible VCO 1 Waveform selector.
7. If waveform is Pulse, move the visible VCO 1 Pulse Width % control.
8. Move the visible Mixer / VCO 1 Level control.

Expected result:

- VCO 1 pitch changes when Coarse/Fine are moved.
- VCO 1 waveform changes when Waveform is changed.
- Pulse Width affects the Pulse waveform.
- VCO 1 Level changes loudness safely.
- VCO 2 and VCO 3 remain unchanged.
- No patch sockets become active.

## 6. Good enough

```text
Visible VCO 1 controls drive the existing VCO 1 sound path only.
```

If this passes, the next contained issue can move to visible VCO 2 controls using the same method.
