# Drive / Overdrive Effect Layer v0.1

Issue #78 adds Drive / Overdrive to the Effects section.

## User request

```text
#78 — Add Drive / Overdrive to Effects section
```

## Goal

Add a default-off soft overdrive effect alongside the other effects.

```text
Effects
- Drive
- Delay
- Reverb
- Chorus
```

## Controls

```text
Drive Mix
Drive
Tone
```

## Behaviour

Drive is a parallel wet effect path in this first safe version.

```text
Dry synth sound -> output
Drive wet path -> soft saturation -> tone filter -> output
```

## Ranges

```text
Mix: 0% to 100%
Drive: 0% to 100%
Tone: 0% to 100%
```

## Audio model

The drive layer uses:

```text
input gain
soft tanh waveshaper
low-pass tone filter
parallel wet gain
```

This gives controlled overdrive without changing the dry synth path.

## Safety

```text
Drive Mix defaults to 0%
Dry synth path remains unchanged
No feedback loop
Wet gain is capped
Soft saturation only
```

## Not changed

```text
Delay
Reverb
Chorus
ADSR
LFO controls
Sample & Hold
VCOs
filter
VCA
routing matrix
MIDI
presets
JUCE/VST
```

## Good enough

```text
Drive appears inside Effects next to Delay, Reverb, and Chorus.
Drive Mix at 0% sounds unchanged.
Raising Drive Mix adds thickness/grit.
Drive controls how hard the saturation is.
Tone controls darker/brighter character.
Delay, Reverb, and Chorus still work.
Panic Stop still works.
```
