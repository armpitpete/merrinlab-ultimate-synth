# Stereo Cathedral Reverb v0.1

Issue #73 adds stereo width to the cathedral reverb layer.

## User request

```text
it works but sounds flat, could we make it stereo
```

## Current base

The cathedral reverb from #72 uses the SpectraSynth-style generated impulse recipe:

```text
4.6 second generated stereo impulse
45 ms pre-delay
slowTail decay
lateBloom swell
softened first 180 ms
capped wet gain
```

## What changed

The cathedral wet path is now explicitly split and merged as stereo.

New wet path:

```text
source
-> pre-delay
-> generated cathedral impulse
-> stereo splitter
-> left tone / gain -> merger left
-> right micro-delay / right tone / gain -> merger right
-> wet gain
-> destination
```

## Why

The generated impulse already had stereo differences, but the result still sounded flat.

The explicit stereo path adds:

```text
slightly different left/right tone
small right-side delay offset
separate left/right gain
explicit stereo merger
```

This should make the cathedral reverb feel wider without turning it into echo.

## Safety

No change to:

```text
Reverb Mix default 0%
Reverb Size behaviour
Delay Time range
#70 rollback
delay routing
base #71 room reverb controls
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

No feedback loop was added.

## Good enough

```text
At useful Reverb Mix and Size settings, the cathedral reverb feels wider and stereo rather than flat, without changing the dry sound at Reverb Mix 0%.
```
