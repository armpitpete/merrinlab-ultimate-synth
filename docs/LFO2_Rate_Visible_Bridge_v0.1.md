# LFO-2 Rate Visible Bridge v0.1

Issue #67 makes the visible Low Frequency Osc - 2 / Rate control active.

Visible control:

```text
Low Frequency Osc - 2 / Rate
```

Existing state key:

```text
lfo2Rate
```

Visible range:

```text
0.05 Hz to 12 Hz
```

Implementation file:

```text
faceplate-preview/vco1-visible-controls.js
```

Scope:

- visible LFO-2 Rate only
- no audio engine change
- no LFO-2 behaviour change
- no VCA behaviour change
- no LFO-2 Shape activation
- no LFO outputs activation
- no socket activation
- no routing change
- no MIDI
- no presets

Good enough:

```text
Visible LFO-2 Rate controls the existing lfo2Rate state only.
```
