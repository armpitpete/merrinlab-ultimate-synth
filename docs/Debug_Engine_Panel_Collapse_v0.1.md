# Debug Engine Panel Collapse v0.1

This pass hides/collapses the First Voice panel without deleting it.

## User direction

```text
hide/collapse First Voice now, but do not delete it until every faceplate control is fully bridged.
```

## Design rule

```text
Main faceplate = the synth.
First Voice = temporary Debug / Engine Panel.
```

## Behaviour

The old First Voice panel is now collapsed by default.

A toggle appears below the faceplate:

```text
Show Debug / Engine Panel
Hide Debug / Engine Panel
```

When closed, the First Voice controls are hidden and do not dominate the page.

When opened, the existing controls remain available for testing and bridge verification.

## Implementation files

```text
faceplate-preview/debug-engine-panel-collapse.js
faceplate-preview/first-voice-panel-docking.js
```

## Scope

Changed:

```text
First Voice visibility only
Debug / Engine Panel toggle
```

No change to:

```text
faceplate-preview/audio-engine.js
faceplate controls
audio behaviour
ADSR behaviour
Delay behaviour
Reverb behaviour
LFO behaviour
Sample & Hold behaviour
VCO behaviour
filter behaviour
VCA behaviour
routing matrix
MIDI
presets
JUCE/VST
```

## Good enough

```text
The faceplate is now the main visible synth.
First Voice no longer dominates the lower half of the page.
Debug controls remain available when opened.
```
