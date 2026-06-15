# State Variable VCF Layer v0.5

This pass activates the existing State Variable VCF faceplate module as a safe, default-off filter layer, fixes the HP/BP/LP mode selector display, prevents the SV VCF from behaving independently of the VCO/mixer path, strengthens SV VCF level/resonance response, clarifies Gate Off labelling, and changes SV VCF Level from parallel-add to dry/filtered crossfade.

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

v0.3 restricted the SV VCF wet path to the main synth output node only.

```text
main synth output -> SV VCF wet path -> output
```

It should no longer latch onto any other output-bound layer.

## Response-strength correction

User observed:

```text
SV VCF Level resonance has little to medium effect. Where is Gate off?
```

v0.4 strengthened the audible response by:

```text
raising the SV VCF wet gain cap
mapping the visible Resonance control to a stronger internal filter Q curve
```

The visible Resonance range stays the same:

```text
0.1 Q to 24 Q
```

The internal filter Q is stronger at high settings so resonance should be easier to hear.

## Crossfade correction

User then observed:

```text
BP very quiet VCO is always playing and not affected by VCF
```

That confirmed the SV VCF was still behaving like a parallel added copy, while the dry VCO path remained audible beside it.

v0.5 changes SV VCF Level to a dry/filtered crossfade:

```text
Level 0% = dry synth unchanged
Level 50% = dry + filtered mix
Level 100% = filtered SV VCF output only
```

This means at high SV VCF Level, the VCO path should be affected by the selected SV VCF mode rather than simply playing beside it.

BP mode also gets extra internal compensation so it is not much quieter than HP/LP.

## Gate Off clarification

The old Debug / Engine Panel button said:

```text
Release
```

That button is the Gate Off control.

v0.4 relabelled it to:

```text
Gate Off / Release
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

The State Variable VCF now acts as an output crossfade layer.

```text
Main synth output -> dry gain      -> output bus -> output
Main synth output -> SV VCF filter -> wet gain   -> output bus -> output
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
HP/BP/LP selector visibility fix
SV VCF source restricted to main synth output node
stronger internal resonance curve
BP level compensation
SV VCF Level changed from parallel add to dry/filtered crossfade
Debug / Engine Panel Gate Off label
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
Level 100% makes the output mostly/only SV VCF filtered.
The dry VCO should not keep playing beside the SV VCF at Level 100%.
BP mode should no longer be extremely quiet.
VCO/Mixer levels down means no SV VCF sound.
HP/BP/LP mode changes the filter character.
Initial COF changes the cutoff/centre frequency.
Resonance has a stronger audible effect than before.
The Debug / Engine Panel button says Gate Off / Release instead of only Release.
Panic Stop still works.
```
