# Repeat Gate LED Flash v0.1

This pass makes the existing Gate LED in the Rpt. Gate Rate section flash in time with the Repeat Gate rate.

## User request

```text
works. Rpt. Gate Rate section, GATE LED should flash in time to Gate rate
```

## Goal

Make the faceplate Gate LED behave like a timing indicator.

## Behaviour

```text
Repeat Gate Off: Gate LED stays dark.
Repeat Gate On: Gate LED flashes at the current Gate Rate BPM.
Changing Gate Rate: flash speed updates immediately.
```

## Controls used

The flash layer reads the existing bridged controls:

```text
repeatGate
repeatGateRate
```

Visible faceplate values:

```text
Repeat Gate: Off / On
Gate Rate: BPM
```

Internal engine value:

```text
repeatGateRate = Hz
```

The flash layer converts Hz to BPM when it has to read the hidden Debug / Engine Panel value.

## Implementation files

```text
faceplate-preview/repeat-gate-led-flash-layer.js
faceplate-preview/cathedral-reverb-layer.js
```

## Scope

Changed:

```text
Gate LED visual flash only
```

No change to:

```text
audio-engine.js
Repeat Gate audio behaviour
Gate timing engine
ADSR
Delay
Reverb
Chorus
Drive
Envelope Follower
VCOs
filter
VCA
routing matrix
MIDI
presets
JUCE/VST
```

## Good enough

```text
Set Repeat Gate to On.
Gate LED flashes at the displayed BPM.
Changing Gate Rate changes the LED flash rate.
Set Repeat Gate to Off.
Gate LED stops flashing and stays dark.
```
