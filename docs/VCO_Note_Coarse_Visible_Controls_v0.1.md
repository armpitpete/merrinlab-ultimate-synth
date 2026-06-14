# VCO Note Coarse Visible Controls v0.1

Issue #59 makes the visible VCO coarse controls use note names instead of raw Hz sliders.

Affected visible controls:

- VCO 1 / Coarse Freq
- VCO 2 / Coarse Freq
- VCO 3 / Coarse Freq

Existing state keys remain the source of truth:

```text
coarseFreq
vco2CoarseFreq
vco3CoarseFreq
```

Visible note range:

```text
A1 to A5
```

The visible selector writes the note frequency into the existing oscillator state.

Examples:

```text
A2 -> 110 Hz
A3 -> 220 Hz
A4 -> 440 Hz
A5 -> 880 Hz
```

Scope:

- visible VCO coarse controls only
- no audio engine change
- no oscillator behaviour change
- no fine cents change yet
- no MIDI
- no scales
- no presets
- no routing
- no socket activation

Good enough:

```text
Visible VCO coarse controls choose notes and still write safe frequency values to the existing oscillator state.
```
