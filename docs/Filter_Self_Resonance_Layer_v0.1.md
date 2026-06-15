# Filter Self Resonance Layer v0.1

This pass makes the low-pass filter resonance self-resonate at high settings.

## User request

```text
make resonance self resonate
```

## Goal

At high resonance, the filter should produce a clear pitched tone that tracks cutoff.

## Behaviour

```text
Low resonance: normal filter resonance behaviour
High resonance: self-resonant sine tone appears
Cutoff: controls the pitch of the self-resonance tone
```

## Thresholds

```text
Self-resonance starts around Q 8
Self-resonance becomes strong by Q 20
Resonance control now allows up to Q 24
```

## Implementation

This is implemented as a controlled self-oscillation layer rather than relying on the browser biquad filter to self-oscillate naturally.

Files changed:

```text
faceplate-preview/filter-self-resonance-layer.js
faceplate-preview/drive-overdrive-layer.js
```

## Audio model

```text
sine oscillator -> gain -> output
```

The sine oscillator frequency tracks the filter cutoff control.
The gain opens only when resonance is pushed above the self-resonance threshold.

## Safety

```text
Self-resonance gain is capped
Low resonance remains normal
The main dry synth path is unchanged
Drive, Delay, Reverb, and Chorus are unchanged
```

## Not changed

```text
filter core implementation
ADSR
Drive
Delay
Reverb
Chorus
LFO controls
Sample & Hold
VCOs
VCA
routing matrix
MIDI
presets
JUCE/VST
```

## Good enough

```text
Raising Resonance above about Q 8 starts a tonal ringing.
High Resonance produces a clear self-oscillation tone.
Moving Cutoff changes the pitch of that tone.
The tone remains controlled and Panic Stop still works.
```
