# Lowpass Resonance Visible Bridge v0.1

Issue #51 makes the visible Lowpass Filter / Resonance control active.

Active visible control:

- Lowpass Filter / Resonance -> `resonance`

Existing safe range:

```text
0.1 to 12 Q
```

Implementation file:

```text
faceplate-preview/vco1-visible-controls.js
```

Scope:

- visible Resonance only
- no audio engine change
- no resonance range change
- no cutoff behaviour change
- no AR Mod
- no LFO-1 Mod
- no Ext CV
- no socket activation
- no routing change
- no MIDI
- no presets

Good enough:

```text
Visible Lowpass Resonance controls the existing resonance state only.
```
