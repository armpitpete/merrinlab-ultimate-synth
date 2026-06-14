# Repeat Gate BPM Visible Control v0.1

Issue #54 makes the visible Repeat Gate Rate control use BPM.

Existing audio state key:

```text
repeatGateRate
```

The audio engine stores this as cycles per second.

Visible control conversion:

```text
BPM / 60 = repeatGateRate
```

Examples:

```text
60 BPM -> 1 Hz
120 BPM -> 2 Hz
180 BPM -> 3 Hz
```

Scope:

- visible Repeat Gate Rate only
- no audio engine change
- no timing behaviour rewrite
- no MIDI clock
- no sync
- no presets
- no save/load

Good enough:

```text
Visible Repeat Gate Rate is controlled in BPM and writes safely to the existing repeatGateRate state.
```
