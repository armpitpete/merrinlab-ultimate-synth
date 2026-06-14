# Cathedral Reverb Layer v0.1

Issue #72 increases the maximum reverb size so the high setting feels larger than the original room-style reverb.

## User request

```text
reverb works. At max it's like room reverb. At max I want cathedral reverb
```

## Implementation

A separate additive cathedral layer was added instead of rewriting the existing working reverb.

Files changed:

```text
faceplate-preview/cathedral-reverb-layer.js
faceplate-preview/index.html
```

## Why a separate layer

The existing #71 reverb is working and page-stable.

The safer #72 approach is:

```text
keep the existing room reverb
add a second default-off long-reflection layer at high Reverb Size
```

## Behaviour

The cathedral layer reads the existing reverb controls:

```text
Reverb Mix
Reverb Size
```

It only becomes significant at higher Reverb Size settings.

At lower sizes, the #71 room reverb remains the main sound.

## Safety

The cathedral layer:

```text
uses no feedback loop
uses no convolution file
uses no external impulse response
uses only capped wet gain
keeps Reverb Mix 0% silent/unchanged
```

## Long reflection taps

The added layer uses longer non-feedback reflections roughly in this region:

```text
0.3 s to 1.4 s depending on Reverb Size
```

This is intended to make maximum Reverb Size feel much larger and more cathedral-like.

## Not changed

```text
Delay Time range
#70 rollback
delay routing
oscillator behaviour
filter behaviour
VCA behaviour
LFO behaviour
Sample & Hold behaviour
routing matrix
MIDI
presets
JUCE/VST
```

## Good enough

```text
Page loads.
Reverb Mix 0% sounds unchanged.
At Reverb Mix 60–100% and Reverb Size 100%, the space feels much larger than the previous room-style reverb.
Panic Stop still works.
```
