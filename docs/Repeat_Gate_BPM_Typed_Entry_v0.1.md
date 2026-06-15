# Repeat Gate BPM Typed Entry v0.1

This pass lets the Repeat Gate Rate BPM be set by clicking and typing a number.

## User request

```text
works. Allow Gate Rate BPM to be set by clicking and typing it
```

## Goal

Keep the existing Gate Rate slider, but add direct numeric BPM entry for precise values.

## Behaviour

```text
Click the BPM number field.
Type a BPM value.
Press Enter or move focus away.
The Gate Rate slider updates.
The hidden audio control updates.
The Gate LED flash timing updates.
```

Escape cancels typing and restores the current BPM.

## Range

```text
Minimum: 6 BPM
Maximum: 720 BPM
Step: 1 BPM
```

Typed values outside the range are clamped.

## Implementation files

```text
faceplate-preview/repeat-gate-bpm-entry-layer.js
faceplate-preview/repeat-gate-led-flash-layer.js
```

## Scope

Changed:

```text
Repeat Gate Rate faceplate input behaviour
```

No change to:

```text
audio-engine.js
Repeat Gate audio behaviour
Gate LED flash behaviour except sync with typed BPM
ADSR
Delay
Reverb
Chorus
Drive
Envelope Follower
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
Gate Rate still works with the slider.
Gate Rate can also be clicked and typed as BPM.
Typed BPM updates the slider readout.
Typed BPM changes the Gate LED flash rate.
Repeat Gate audio timing follows the typed BPM.
```
