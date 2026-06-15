# Envelope Follower Dynamic Modulation v0.2

This pass activates and calibrates the existing Envelope Follower faceplate module.

## User correction

```text
There's an Envelope Follower
```

## User test result

```text
reverb jumps up and down 1%
```

Conclusion:

```text
Envelope Follower was active, but the detected level was too low to create useful reverb movement.
```

## Decision

Do not add a new Envelope Follower module.

Use the existing module:

```text
Envelope Follower
- Follower Lag
- Input
- EF Out
```

## First active target

```text
Envelope Follower -> Reverb Mix
```

## Active controls/readouts

The existing Envelope Follower module now gains:

```text
Follower Lag
Sensitivity
Reverb Amt
EF Level
Reverb Lift
```

## Behaviour

```text
Follower Lag controls how quickly the follower level rises/falls.
Sensitivity scales the detected synth output so EF Level moves usefully.
EF Level shows the detected synth output level.
Reverb Amt controls how much EF Level can lift Reverb Mix.
Reverb Lift shows the current dynamic lift being added to the base reverb mix.
```

## Default

```text
Reverb Amt = 0%
Sensitivity = 65%
Follower Lag = 0.25 s
```

This keeps the patch unchanged until the user deliberately raises the dynamic modulation amount.

## Audio model

The layer taps the synth output into an analyser.

```text
synth output -> analyser tap -> envelope follower value
```

The analyser tap does not replace the dry sound.

Dynamic reverb is calculated as:

```text
final reverb mix = base reverb mix + envelope follower lift
```

The base reverb mix remains whatever the user sets on the Reverb module.

## Calibration change

The first version used too little scaling:

```text
rms * 5
```

v0.2 uses a stronger sensitivity-scaled curve so normal synth output gives a more useful EF Level:

```text
pow(rms * sensitivityScale, 0.7)
```

## Scope

Changed:

```text
existing Envelope Follower module activation
Follower Lag control
Sensitivity control
Reverb Amt control
EF Level meter
Reverb Lift readout
Envelope Follower -> Reverb Mix dynamic modulation calibration
```

No change to:

```text
live mic/instrument input
Delay modulation
Chorus modulation
Drive modulation
filter modulation
VCOs
ADSR
Sample & Hold
routing matrix
MIDI
presets
JUCE/VST
```

## Good enough

```text
Envelope Follower module is visibly active.
EF Level moves clearly when the synth makes sound.
Reverb Amt at 0% leaves the patch unchanged.
Increasing Reverb Amt makes louder synth output push Reverb Mix higher by more than 1%.
Sensitivity changes how strongly EF Level reacts.
Follower Lag changes how fast/slow the movement responds.
Panic Stop still works.
```
