# Envelope Follower Dynamic Modulation v0.1

This pass activates the existing Envelope Follower faceplate module.

## User correction

```text
There's an Envelope Follower
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

## Added controls

The existing Envelope Follower module now gains active controls/readouts:

```text
Follower Lag
Reverb Amt
EF Level
```

## Behaviour

```text
Follower Lag controls how quickly the follower level rises/falls.
EF Level shows the detected synth output level.
Reverb Amt controls how much EF Level can lift Reverb Mix.
```

## Default

```text
Reverb Amt = 0%
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

## Scope

Changed:

```text
existing Envelope Follower module activation
Follower Lag control
Reverb Amt control
EF Level meter
Envelope Follower -> Reverb Mix dynamic modulation
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
EF Level moves when the synth makes sound.
Reverb Amt at 0% leaves the patch unchanged.
Increasing Reverb Amt makes louder synth output push Reverb Mix higher.
Follower Lag changes how fast/slow the movement responds.
Panic Stop still works.
```
