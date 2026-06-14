# VCO Cents Menu Visible Controls v0.1

Issue #60 makes the visible VCO fine controls use menus instead of sliders.

Affected visible controls:

- VCO 1 / Fine Freq
- VCO 2 / Fine Freq
- VCO 3 / Fine Freq

Existing state keys remain the source of truth:

```text
fineCents
vco2FineCents
vco3FineCents
```

Visible menu values:

```text
-50, -25, -12, -7, -5, -3, 0, +3, +5, +7, +12, +25, +50 cent
```

Scope:

- visible VCO fine controls only
- no audio engine change
- no oscillator behaviour change
- no VCO note selector change
- no MIDI
- no scales
- no presets
- no routing
- no socket activation

Good enough:

```text
Visible VCO cents controls use menus and still write to the existing cents state.
```
