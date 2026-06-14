# Envelope Mode Morph Bridge v0.1

This pass adds a visible faceplate Envelope Mode selector and makes AR / ADSR behave like two modes of the same envelope area.

## User corrections

```text
AR and ADSR should in the same place, even morph into the correct one when selected
```

```text
they should be in the same module but only the activated one is visible
```

## Design rule

```text
AR and ADSR are two modes of one Envelope module.
The faceplate shows one clear Envelope Mode selector.
When AR is selected, only the AR controls are visible.
When ADSR is selected, only the ADSR controls are visible.
The inactive envelope controls are hidden, not merely faded.
```

## Visible control

```text
Envelope / Mode / AR / ADSR
```

## Existing state key

```text
envelopeMode
```

## Behaviour

The visible selector maps to the existing First Voice `envelopeMode` control.

Mode behaviour:

```text
AR selected: one Envelope module shows AR Generator controls.
ADSR selected: the same Envelope module shows ADSR Env. Gen. controls.
```

This is a visual bridge and morph-state pass only.

## Implementation files

```text
faceplate-preview/envelope-mode-visible-controls.js
faceplate-preview/adsr-visible-controls.js
```

## Scope

Changed:

```text
single visible Envelope module
visible Envelope Mode selector
AR / ADSR morph state
inactive envelope controls hidden
```

No change to:

```text
faceplate-preview/audio-engine.js
AR envelope behaviour
ADSR envelope behaviour
ADSR Attack / Decay / Sustain / Release behaviour
AR Attack / Release behaviour
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
The faceplate clearly shows one Envelope module.
The Envelope module contains the AR / ADSR selector.
Selecting AR shows only AR controls.
Selecting ADSR shows only ADSR controls.
Selecting either option still uses the existing envelopeMode behaviour.
```
