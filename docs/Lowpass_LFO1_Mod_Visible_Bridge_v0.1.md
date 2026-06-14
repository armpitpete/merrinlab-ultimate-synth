# Lowpass LFO-1 Mod Visible Bridge v0.1

Issue #61 makes the visible Lowpass Filter / LFO-1 Mod control active.

Active visible control:

- Lowpass Filter / LFO-1 Mod -> `lfo1Mod`

Visible range:

```text
0% to 100%
```

Existing state range:

```text
0 to 1
```

Conversion:

```text
visible percent / 100 = lfo1Mod
```

Implementation file:

```text
faceplate-preview/vco1-visible-controls.js
```

Scope:

- visible LFO-1 Mod only
- no audio engine change
- no LFO behaviour change
- no cutoff behaviour change
- no resonance behaviour change
- no AR Mod
- no Ext CV
- no socket activation
- no routing change
- no MIDI
- no presets

Good enough:

```text
Visible Lowpass LFO-1 Mod controls the existing lfo1Mod state only.
```
