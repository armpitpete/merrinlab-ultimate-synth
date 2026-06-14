# LFO-1 Rate Visible Bridge v0.1

Issue #62 makes the visible Low Frequency Osc - 1 / Rate control active.

Active visible control:

- Low Frequency Osc - 1 / Rate -> `lfo1Rate`

Visible range:

```text
0.05 Hz to 12 Hz
```

Existing state key:

```text
lfo1Rate
```

Implementation file:

```text
faceplate-preview/vco1-visible-controls.js
```

Scope:

- visible LFO-1 Rate only
- no audio engine change
- no LFO behaviour change
- no filter behaviour change
- no LFO shape activation
- no LFO range activation
- no LFO output activation
- no socket activation
- no routing change
- no MIDI
- no presets

Good enough:

```text
Visible LFO-1 Rate controls the existing lfo1Rate state only.
```
