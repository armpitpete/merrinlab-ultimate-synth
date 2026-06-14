# Simple Delay Effect v0.1

Issue #68 adds the first simple delay effect to the browser preview.

This is an explicit audio feature, not a visible-control bridge.

## Controls

The delay controls are in the First Voice browser panel:

```text
Delay Mix
Delay Time
Delay Feedback
```

## Defaults

```text
Delay Mix: 0%
Delay Time: 0.25 s
Delay Feedback: 20%
```

Important:

```text
Delay Mix defaults to 0%, so the synth sounds unchanged on load.
```

## Safe ranges

```text
Delay Mix: 0% to 100%
Delay Time: 0.05 s to 0.8 s
Delay Feedback: 0% to 45%
```

## Routing

The delay is placed after the existing voice path:

```text
tremolo output -> dry path -> master output
tremolo output -> delay -> wet path -> master output
```

The delay has a controlled feedback loop:

```text
delay -> feedback gain -> delay
```

## Scope

Changed:

```text
faceplate-preview/audio-engine.js
```

No change to:

```text
oscillator behaviour
filter behaviour
VCA behaviour
LFO behaviour
Sample & Hold behaviour
tempo sync
stereo ping-pong
reverb
sockets
routing matrix
presets
MIDI
JUCE/VST
```

## Good enough

```text
With Delay Mix at 0%, the synth sounds unchanged. Raising Delay Mix adds a controlled echo without runaway feedback.
```
