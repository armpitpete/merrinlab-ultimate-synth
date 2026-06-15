# State Variable VCF Layer v0.1

This pass activates the existing State Variable VCF faceplate module as a safe, default-off filter layer.

## User request

```text
works. Next State Variable VCF
```

## Goal

Make the existing State Variable VCF module useful without changing the main low-pass filter.

## Controls

The module now has active controls for:

```text
Mode: HP / BP / LP
Initial COF
Resonance
Level
```

## Behaviour

The State Variable VCF is a parallel wet filter layer in this first safe version.

```text
Dry synth sound -> output
SV VCF wet path -> HP/BP/LP filter -> output
```

The main sound stays unchanged when Level is 0%.

## Defaults

```text
Mode: BP
Initial COF: 900 Hz
Resonance: 0.7 Q
Level: 0%
```

## Ranges

```text
Initial COF: 40 Hz to 8500 Hz
Resonance: 0.1 Q to 24 Q
Level: 0% to 100%
```

## Implementation files

```text
faceplate-preview/state-variable-vcf-layer.js
faceplate-preview/repeat-gate-bpm-entry-layer.js
```

## Important note

This is a browser state-variable-style layer using a Web Audio BiquadFilterNode mode switch.

It is not yet a full analogue-model state-variable filter with simultaneous HP, BP, and LP outputs.

## Scope

Changed:

```text
State Variable VCF faceplate controls
parallel SV VCF wet filter path
```

No change to:

```text
audio-engine.js
main low-pass filter
ADSR
Repeat Gate
Delay
Reverb
Chorus
Drive
Envelope Follower
VCOs
VCA
routing matrix
MIDI
presets
JUCE/VST
```

## Good enough

```text
State Variable VCF shows active controls.
Level 0% leaves the sound unchanged.
Raising Level makes the SV VCF audible.
HP/BP/LP mode changes the filter character.
Initial COF changes the cutoff/centre frequency.
Resonance changes the sharpness.
Panic Stop still works.
```
