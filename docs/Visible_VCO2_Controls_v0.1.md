# Visible VCO 2 Controls v0.1

**Project:** MerrinLab Ultimate Synth  
**Issue:** #47 — Make visible VCO 2 controls drive existing VCO 2 state only  
**Status:** Second visible-interface oscillator bridge  

## Purpose

The visible VCO 2 controls now drive the existing First Voice VCO 2 state.

This follows the same safe bridge approach used for VCO 1.

This is not patching. It does not make sockets active. It does not add routing. It does not add any new sound feature.

## Active visible controls

| Visible area | Existing state key |
|---|---|
| VCO 2 / Coarse Freq | `vco2CoarseFreq` |
| VCO 2 / Fine Freq | `vco2FineCents` |
| VCO 2 / Waveform | `vco2Waveform` |
| VCO 2 / Pulse Width | `vco2PulseWidth` |
| Mixer / VCO 2 Level | `vco2Level` |

## Implementation model

The existing visible-control bridge now covers VCO 1 and VCO 2:

```text
faceplate-preview/vco1-visible-controls.js
```

The existing audio engine remains the source of truth:

```text
faceplate-preview/audio-engine.js
```

The bridge sends changes from visible VCO 2 controls into the existing First Voice controls.

## What did not change

Unchanged:

- VCO 1 behaviour
- VCO 3 behaviour
- filter behaviour
- Sample and Hold behaviour
- LFO 1 behaviour
- LFO 2 behaviour
- AR and ADSR behaviour
- Repeat Gate behaviour
- Output behaviour
- socket behaviour
- routing
- external input
- presets
- save/load
- MIDI
- JUCE
- VST

## Test route

Use Patch 2:

```text
Three VCOs at the Same Pitch
```

For this test, focus on VCO 2:

1. Refresh the live page.
2. Start Audio.
3. Gate Note.
4. Keep VCO 1 audible.
5. Raise the visible Mixer / VCO 2 Level control.
6. Move the visible VCO 2 Coarse Freq control.
7. Move the visible VCO 2 Fine Freq control.
8. Change the visible VCO 2 Waveform selector.
9. If waveform is Pulse, move the visible VCO 2 Pulse Width control.

Expected result:

- VCO 2 becomes audible when its visible level is raised.
- VCO 2 pitch changes when its visible Coarse/Fine controls are moved.
- VCO 2 waveform changes when its visible Waveform selector is changed.
- Pulse Width affects the VCO 2 Pulse waveform.
- VCO 1 remains working.
- VCO 3 remains unchanged.
- no socket becomes active.

## Good enough

```text
Visible VCO 2 controls drive the existing VCO 2 sound path only.
```

If this passes, the next contained issue can move to visible VCO 3 controls using the same method.
