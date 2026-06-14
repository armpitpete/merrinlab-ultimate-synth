# Sample & Hold Sample Rate Visible Bridge v0.1

Issue #64 makes the visible Sample & Hold / Sample Rate control active.

Active visible control:

- Sample & Hold / Sample Rate -> `sampleHoldRate`

Visible range:

```text
0.1 Hz to 20 Hz
```

Existing state key:

```text
sampleHoldRate
```

Implementation file:

```text
faceplate-preview/vco1-visible-controls.js
```

Scope:

- visible Sample Rate only
- no audio engine change
- no Sample & Hold behaviour change
- no new VCLPF CV amount control
- no CV-Out socket activation
- no Input activation
- no Trig activation
- no routing change
- no MIDI
- no presets

Good enough:

```text
Visible Sample & Hold Sample Rate controls the existing sampleHoldRate state only.
```
