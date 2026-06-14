# Cathedral Reverb Layer v0.1

Issue #72 increases the maximum reverb size so the high setting feels larger than the original room-style reverb.

## User request

```text
reverb works. At max it's like room reverb. At max I want cathedral reverb
```

Follow-up test result:

```text
reverb behaves more like echo
```

Reference implementation:

```text
SpectraSynth reverb sounded right, so this pass copies its generated cathedral impulse recipe.
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
add a second default-off cathedral tail at high Reverb Size
```

## SpectraSynth-style recipe

The revised layer now uses the SpectraSynth-style generated impulse method:

```text
4.6 second stereo generated impulse
45 ms pre-delay
slowTail decay curve
lateBloom swell
softened first 180 ms
slightly different left/right stereo offset
wet gain capped at 0.38
```

This is designed to sound like a continuous space rather than separate echo repeats.

## Routing

```text
source -> pre-delay -> generated cathedral impulse -> wet gain -> destination
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
uses no external impulse response
uses no convolution file from disk
uses a generated in-memory impulse tail
uses only capped wet gain
keeps Reverb Mix 0% silent/unchanged
```

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
It does not behave like obvious echo.
Panic Stop still works.
```
