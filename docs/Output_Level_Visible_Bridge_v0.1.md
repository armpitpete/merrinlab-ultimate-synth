# Output Level Visible Bridge v0.1

Issue #74 makes the visible Output Level control active.

## User request

```text
next do Output level which is I think Master Output?
```

## Answer

Yes. In the current browser preview, visible Output Level maps to the existing master `output` state.

## Visible control

```text
Output Level / Output Level
```

## Existing state key

```text
output
```

## Visible range

```text
0% to 100%
```

This maps to the existing internal safe output range:

```text
0 to 0.16
```

## Implementation files

```text
faceplate-preview/output-level-visible-controls.js
faceplate-preview/ar-generator-visible-controls.js
```

The Output bridge is loaded after the AR Generator bridge, because both are small visible-control bridge scripts.

## Scope

Changed:

```text
visible Output Level bridge only
```

No change to:

```text
faceplate-preview/audio-engine.js
output gain limits
delay
reverb
oscillator behaviour
filter behaviour
VCA behaviour
LFO behaviour
Sample & Hold behaviour
envelope behaviour
routing matrix
MIDI
presets
JUCE/VST
```

## Good enough

```text
Visible Output Level controls the existing master Output only.
```
