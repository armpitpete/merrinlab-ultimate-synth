# Chorus Effect Layer v0.1

This pass adds Chorus to the Effects section.

## User request

```text
Add Chorus to the Effects section
```

## Goal

Add a third default-off effect alongside Delay and Reverb.

```text
Effects
- Delay
- Reverb
- Chorus
```

## Controls

```text
Chorus Mix
Chorus Rate
Chorus Depth
```

## Behaviour

Chorus is a parallel wet effect path.

```text
Dry synth sound -> output
Chorus wet path -> modulated short stereo delay -> output
```

## Ranges

```text
Mix: 0% to 100%
Rate: 0.10 Hz to 5.00 Hz
Depth: 0% to 100%
```

## Implementation files

```text
faceplate-preview/chorus-effect-layer.js
faceplate-preview/delay-upgrade-layer.js
```

## Audio model

The chorus layer uses:

```text
two short delay lines
one sine LFO
opposite left/right delay modulation
parallel wet gain
```

This gives a basic stereo chorus without changing the dry synth path.

## Safety

```text
Chorus Mix defaults to 0%
Dry synth path remains unchanged
No feedback loop
No delay/reverb changes
```

## Not changed

```text
Delay
Reverb
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
Chorus appears inside Effects next to Delay and Reverb.
Chorus Mix at 0% sounds unchanged.
Raising Chorus Mix adds a clear thickening/widening effect.
Rate changes the movement speed.
Depth changes the strength of the movement.
Delay and Reverb still work.
Panic Stop still works.
```
