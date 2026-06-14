# Main VCA LFO-2 Mod Visible Bridge v0.1

Issue #66 makes the visible Main VCA / LFO-2 Mod control active.

Visible control:

```text
Main VCA / LFO-2 Mod
```

Existing state key:

```text
lfo2Mod
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
visible percent / 100 = lfo2Mod
```

Implementation file:

```text
faceplate-preview/vco1-visible-controls.js
```

Scope:

- visible Main VCA / LFO-2 Mod only
- no audio engine change
- no LFO-2 behaviour change
- no VCA behaviour change
- no LFO-2 Rate activation yet
- no LFO-2 Shape activation
- no LFO outputs activation
- no socket activation
- no routing change
- no MIDI
- no presets

Good enough:

```text
Visible Main VCA LFO-2 Mod controls the existing lfo2Mod state only.
```
