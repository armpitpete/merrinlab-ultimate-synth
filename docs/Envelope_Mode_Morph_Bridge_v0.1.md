# ADSR Main Envelope Layout v0.1

This pass removes the visible AR envelope from the faceplate and makes ADSR the single visible Envelope module.

## User direction

```text
Remove AR then put ADSR in it's place. ADSR will change from horizontal to vertical
```

## Design rule

```text
The faceplate now has one visible Envelope module.
That module is ADSR.
The old AR faceplate module is hidden.
ADSR is moved into the old AR envelope position.
ADSR controls are shown vertically.
```

## Existing state key

The bridge forces the existing envelope mode to:

```text
envelopeMode = adsr
```

## Behaviour

Visible faceplate behaviour:

```text
Envelope = ADSR only
Attack / Decay / Sustain / Release are visible
AR is not visible on the faceplate
```

This remains a visual bridge/layout pass.

## Implementation files

```text
faceplate-preview/envelope-mode-visible-controls.js
faceplate-preview/adsr-visible-controls.js
```

## Scope

Changed:

```text
visible envelope layout
ADSR position
ADSR vertical control layout
visible AR module hidden
```

No change to:

```text
faceplate-preview/audio-engine.js
ADSR envelope behaviour
ADSR Attack / Decay / Sustain / Release behaviour
sockets
routing matrix
delay
reverb
LFO behaviour
Sample & Hold behaviour
VCO behaviour
filter behaviour
VCA behaviour
MIDI
presets
JUCE/VST
```

## Good enough

```text
The faceplate shows ADSR as the only visible Envelope module.
The ADSR module appears where AR used to be.
ADSR controls run vertically rather than horizontally.
The ADSR envelope still works.
```
