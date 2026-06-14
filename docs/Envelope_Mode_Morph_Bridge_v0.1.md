# ADSR Main Envelope and Effects Section Layout v0.3

This pass removes the visible AR envelope from the faceplate, makes ADSR the single visible Envelope module, moves ADSR into the upper envelope slot, and groups Delay/Reverb into a separate full-width Effects strip.

## User directions

```text
Remove AR then put ADSR in it's place. ADSR will change from horizontal to vertical
```

```text
ADSR should be where DELAY and REVERB are
```

```text
Delay/Reverb should be in an Effects Section
```

```text
effects section made but stayed in the wrong place
```

Screenshot follow-up showed ADSR still sitting in the old lower-left ADSR slot. This pass corrects that by forcing the visible ADSR module into the upper envelope slot and expanding Aux VCA into the old lower ADSR row.

## Design rule

```text
The faceplate now has one visible Envelope module.
That module is ADSR.
The old AR faceplate module is hidden.
ADSR occupies the upper envelope slot where the temporary effects/AR area was.
ADSR controls are shown vertically.
Delay and Reverb are grouped together under one Effects section.
Effects sits as its own full-width strip below the main faceplate grid, not squeezed into the upper voice area.
The old lower ADSR row is no longer used by ADSR.
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
ADSR sits in the upper envelope slot
Delay and Reverb sit inside Effects
Effects appears below the main faceplate grid
Aux VCA expands into the old lower ADSR row
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
full-width Effects strip for Delay and Reverb
Aux VCA lower-row expansion
```

No change to:

```text
faceplate-preview/audio-engine.js
ADSR envelope behaviour
ADSR Attack / Decay / Sustain / Release behaviour
Aux VCA audio behaviour
Delay audio behaviour
Reverb audio behaviour
sockets
routing matrix
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
The ADSR module appears in the upper envelope slot, not the old lower-left ADSR slot.
ADSR controls run vertically rather than horizontally.
Delay and Reverb are grouped under an Effects section.
Effects is a separate full-width strip below the main faceplate grid.
Aux VCA fills the old lower ADSR row.
The ADSR envelope still works.
Delay and Reverb still work.
```
