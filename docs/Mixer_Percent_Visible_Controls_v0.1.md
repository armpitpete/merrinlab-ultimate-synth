# Mixer Percent Visible Controls v0.1

Issue #57 makes the visible mixer controls show percent values.

Affected visible controls:

- Mixer / VCO 1 Level
- Mixer / VCO 2 Level
- Mixer / VCO 3 Level
- Mixer / White NS Level

The visible controls now show:

```text
0% to 100%
```

They still write to the existing safe internal ranges:

```text
VCO 1 Level: 0 to 0.7
VCO 2 Level: 0 to 0.45
VCO 3 Level: 0 to 0.4
White NS Level: 0 to 0.35
```

Scope:

- visible mixer controls only
- no audio engine change
- no gain limit change
- no Ext. In Level activation
- no socket activation
- no routing change
- no MIDI
- no presets

Good enough:

```text
Visible mixer levels show percent while still writing the existing safe gain values.
```
