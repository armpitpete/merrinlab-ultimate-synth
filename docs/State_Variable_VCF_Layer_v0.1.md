# State Variable VCF Layer v0.3

This pass activates the existing State Variable VCF faceplate module as a safe, default-off filter layer, fixes the HP/BP/LP mode selector display, and prevents the SV VCF from behaving independently of the VCO/mixer path.

## User request

```text
works. Next State Variable VCF
```

## Screenshot correction

The first version activated the controls, but the mode selector collapsed into plain text:

```text
BP output active
```

That meant the module showed the current mode but did not keep the HP/BP/LP selector visible.

v0.2 keeps the actual mode dropdown visible and uses a separate readout:

```text
HP / BP / LP selector
BP active readout
```

## Behaviour correction

User observed:

```text
It seems to work independant of the VCOs
```

That is not the intended behaviour.

v0.3 restricts the SV VCF wet path to the main synth output node only.

```text
main synth output -> SV VCF wet path -> output
```

It should no longer latch onto any other output-bound layer.

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
Main synth output -> SV VCF wet path -> HP/BP/LP filter -> output
```

The main sound stays unchanged when Level is 0%.

The SV VCF should follow the main synth output:

```text
VCO/Mixer levels down = no SV VCF sound
Gate closed = no SV VCF sound after release
Output silent = no SV VCF sound
```

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
HP/BP/LP selector visibility fix
SV VCF source restricted to main synth output node
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
HP/BP/LP selector remains visible.
Mode readout updates without overwriting the selector.
Level 0% leaves the sound unchanged.
Raising Level makes the SV VCF audible only when the main synth is audible.
VCO/Mixer levels down means no SV VCF sound.
HP/BP/LP mode changes the filter character.
Initial COF changes the cutoff/centre frequency.
Resonance changes the sharpness.
Panic Stop still works.
```
