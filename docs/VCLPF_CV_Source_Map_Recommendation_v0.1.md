# VCLPF CV Source Map Recommendation v0.1

Recommended next implementation:

```text
Add a visible S&H Filter Amount control.
```

Existing audio state:

```text
sampleHoldMod
```

Reason:

```text
sampleHoldMod already controls Sample & Hold modulation into the VCLPF cutoff path.
```

Current faceplate problem:

```text
Sample & Hold has Sample Rate, CV-Out, Glide, Input, Trig, and LED, but no clear amount control.
```

Safe implementation rule:

```text
Add one explicit visible control rather than pretending an existing socket is a knob.
```

Not allowed in that issue:

```text
No audio engine change.
No new modulation behaviour.
No socket activation.
No routing matrix.
No presets.
No MIDI.
```
