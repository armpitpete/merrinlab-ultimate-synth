# Delay Time 2 Second Range v0.1

Issue #70 extends the usable Delay Time range to 2 seconds.

## User request

```text
make delay up to 2 seconds
```

## Controls affected

```text
First Voice / Delay Time
Faceplate Delay / Time
```

## New visible range

```text
0.05 s to 2.00 s
```

## Implementation file

```text
faceplate-preview/first-voice-panel-docking.js
```

The docking script now:

```text
sets Delay Time controls to max 2 seconds
creates delay nodes with 2 seconds of delay-time headroom
re-applies the requested delay time after Delay Mix or Feedback changes
keeps readouts synced to the requested delay time
```

## Scope

Changed:

```text
Delay Time range only
```

Not changed:

```text
delay routing
Delay Mix behaviour
Delay Feedback behaviour
tempo sync
stereo ping-pong
reverb
oscillator behaviour
filter behaviour
VCA behaviour
LFO behaviour
Sample & Hold behaviour
sockets
routing matrix
presets
MIDI
JUCE/VST
```

## Good enough

```text
Delay Time can be set up to 2.00 seconds from both First Voice and the visible faceplate without changing other delay behaviour.
```
