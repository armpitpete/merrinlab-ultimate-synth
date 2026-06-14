# LFO Shape Selection v0.1

Issue #75 adds LFO shape selection for LFO 1 and LFO 2.

## Goal

Give both LFOs selectable movement shapes.

```text
LFO 1 Shape -> filter modulation movement
LFO 2 Shape -> amplitude/tremolo movement
```

## Shapes

```text
Sine
Triangle
Square
Ramp Up
Ramp Down
```

Random is not included here. Random belongs to Sample & Hold.

## Controls

First Voice controls:

```text
LFO Shape / LFO 1 Shape
LFO Shape / LFO 2 Shape
```

Visible faceplate controls:

```text
Low Frequency Osc - 1 / Shape
Low Frequency Osc - 2 / Shape
```

## Implementation files

```text
faceplate-preview/lfo-shape-controls.js
faceplate-preview/output-level-visible-controls.js
```

The LFO shape script is loaded after the existing visible-control bridge chain.

## Implementation notes

This pass avoids editing the large main audio engine file.

Instead, it:

```text
captures the LFO oscillator nodes when the audio graph is created
applies the selected shape to LFO 1 and LFO 2
adds First Voice selectors
adds visible faceplate selectors
keeps the existing LFO rate and modulation depth controls unchanged
```

## Scope

Changed:

```text
LFO oscillator shape only
```

No change to:

```text
VCO waveforms
Sample & Hold
filter destination
VCA destination
LFO rate ranges
LFO modulation depth ranges
delay
reverb
AR/ADSR envelope behaviour
routing matrix
MIDI
presets
JUCE/VST
```

## Good enough

```text
LFO 1 Shape changes the filter movement shape.
LFO 2 Shape changes the tremolo/amplitude movement shape.
The page stays stable.
```
