# ADSR Visible Bridge v0.1

Issue #76 makes the visible ADSR Env. Gen. controls active.

## Goal

Follow the project direction:

```text
working browser controls -> actual visible synth interface
```

## Visible controls

```text
ADSR Env. Gen. / Attack
ADSR Env. Gen. / Decay
ADSR Env. Gen. / Sustain
ADSR Env. Gen. / Release
```

## Existing state keys

```text
adsrAttack
adsrDecay
adsrSustain
adsrRelease
```

## Visible ranges

```text
Attack: 0.005 s to 2.00 s
Decay: 0.005 s to 3.00 s
Sustain: 0% to 100%
Release: 0.02 s to 4.00 s
```

Sustain maps to the existing internal range:

```text
0 to 1
```

## Implementation files

```text
faceplate-preview/adsr-visible-controls.js
faceplate-preview/lfo-shape-controls.js
```

The ADSR bridge is loaded after the LFO Shape bridge, following the current small bridge-script chain.

## Scope

Changed:

```text
visible ADSR Attack / Decay / Sustain / Release bridge only
```

No change to:

```text
faceplate-preview/audio-engine.js
AR behaviour
envelope mode behaviour
ADSR sockets
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
Visible ADSR Attack, Decay, Sustain, and Release control the existing ADSR envelope values only.
```
