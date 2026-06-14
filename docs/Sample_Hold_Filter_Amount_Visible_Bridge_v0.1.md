# Sample & Hold Filter Amount Visible Bridge v0.1

Issue #65 adds an explicit visible Sample & Hold filter amount control.

Visible control added:

```text
Sample & Hold / Filter Amount
```

Existing state key:

```text
sampleHoldMod
```

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
visible percent / 100 = sampleHoldMod
```

Implementation files:

```text
faceplate-preview/index.html
faceplate-preview/vco1-visible-controls.js
```

Scope:

- explicit visible Filter Amount control only
- no audio engine change
- no Sample & Hold behaviour change
- no filter behaviour change
- no CV-Out socket activation
- no Input activation
- no Trig activation
- no Glide misuse
- no routing change
- no MIDI
- no presets

Good enough:

```text
Visible S&H Filter Amount controls the existing sampleHoldMod state only.
```
