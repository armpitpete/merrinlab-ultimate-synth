# Envelope Mode Morph Bridge v0.1

This pass adds a visible faceplate Envelope Mode selector and makes AR / ADSR behave like two modes of the same envelope area.

## User correction

```text
AR and ADSR should in the same place, even morph into the correct one when selected
```

## Design rule

```text
AR and ADSR are two modes of the same envelope area.
The faceplate should show one clear Envelope Mode selector.
When AR is selected, the AR controls are active.
When ADSR is selected, the ADSR controls are active.
The inactive envelope section visually recedes.
```

## Visible control

```text
Envelope Mode / AR / ADSR
```

## Existing state key

```text
envelopeMode
```

## Behaviour

The visible selector maps to the existing First Voice `envelopeMode` control.

Mode behaviour:

```text
AR selected: AR Generator is visually active; ADSR Env. Gen. recedes.
ADSR selected: ADSR Env. Gen. is visually active; AR Generator recedes.
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
visible Envelope Mode selector
AR / ADSR visual morph state
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
The faceplate clearly shows Envelope Mode with AR / ADSR.
Selecting ADSR uses the existing ADSR envelope mode.
Selecting AR uses the existing AR envelope mode.
The active envelope section is visually clear.
The inactive section recedes rather than looking equally active.
```
