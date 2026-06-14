# Delay Faceplate Visible Bridge v0.1

Issue #69 adds Delay controls to the visible synth faceplate.

This follows the project direction:

```text
working browser controls -> actual visible synth interface
```

## Why this issue exists

Issue #68 added the delay to the First Voice browser panel first.

User finding:

```text
I see delay in First Voice but not faceplate
```

## Visible faceplate module

A visible Delay module is added beside the existing source/control modules.

Faceplate controls:

```text
Delay / Mix
Delay / Time
Delay / Feedback
```

## Existing state keys

```text
delayMix
delayTime
delayFeedback
```

## Visible ranges

```text
Mix: 0% to 100%
Time: 0.05 s to 0.8 s
Feedback: 0% to 45%
```

## Implementation file

```text
faceplate-preview/vco1-visible-controls.js
```

The Delay module is created by the visible-control bridge if it is not already present in the HTML.

## Scope

Changed:

```text
faceplate-preview/vco1-visible-controls.js
```

No change to:

```text
delay audio behaviour
delay safe ranges
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
Visible faceplate Delay Mix, Delay Time, and Delay Feedback control the existing delay state only.
```
