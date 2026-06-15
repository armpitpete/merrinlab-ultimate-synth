# Envelope Follower Dynamic Modulation v0.3

This pass activates and calibrates the existing Envelope Follower faceplate module.

## User correction

```text
There's an Envelope Follower
```

## User test results

```text
reverb jumps up and down 1%
```

```text
Reverb Lift still 1%
```

Conclusion:

```text
The Envelope Follower was active, but the analyser was not reading enough of the real output mix.
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
EF Tap
```

## Behaviour

```text
Follower Lag controls how quickly the follower level rises/falls.
Sensitivity scales the detected synth output so EF Level moves usefully.
EF Level shows the detected synth output level.
Reverb Amt controls how much EF Level can lift Reverb Mix.
Reverb Lift shows the current dynamic lift being added to the base reverb mix.
EF Tap shows whether output connections are being tapped into the follower bus.
```

## Default

```text
Reverb Amt = 0%
Sensitivity = 75%
Follower Lag = 0.18 s
```

This keeps the patch unchanged until the user deliberately raises the dynamic modulation amount.

## Audio model

The layer now taps all output-bound sources into one analyser bus.

```text
output-bound source 1 -> analyser bus
output-bound source 2 -> analyser bus
output-bound source 3 -> analyser bus
analyser bus -> envelope follower value
```

The analyser bus does not connect to audio output, so it does not add sound. It only measures the output mix.

Dynamic reverb is calculated as:

```text
final reverb mix = base reverb mix + envelope follower lift
```

The base reverb mix remains whatever the user sets on the Reverb module.

## Calibration changes

v0.1 used too little scaling:

```text
rms * 5
```

v0.2 increased scaling but still did not lift enough in testing.

v0.3 changes the tap model and scaling:

```text
all destination-bound sources -> analyser bus
pow(rms * sensitivityScale, 0.55)
max dynamic lift = 95%
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
EF Tap readout
Envelope Follower output-mix tap model
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
EF Tap shows output taps when audio has started.
EF Level moves clearly when the synth makes sound.
Reverb Amt at 0% leaves the patch unchanged.
Increasing Reverb Amt makes louder synth output push Reverb Mix higher by more than 1%.
Sensitivity changes how strongly EF Level reacts.
Follower Lag changes how fast/slow the movement responds.
Panic Stop still works.
```
