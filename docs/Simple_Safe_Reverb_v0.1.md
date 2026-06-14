# Simple Safe Reverb v0.1

Issue #71 adds a simple safe reverb layer to the browser preview.

This follows the project direction:

```text
working browser controls -> actual visible synth interface
```

## Current stability rule

Issue #70 made the page unstable and was rolled back.

Therefore this reverb pass does not touch delay time, delay range, or the main audio engine file.

## Implementation file

```text
faceplate-preview/first-voice-panel-docking.js
```

## Controls

First Voice controls:

```text
Reverb Mix
Reverb Size
```

Faceplate controls:

```text
Reverb / Mix
Reverb / Size
```

## Defaults

```text
Reverb Mix: 0%
Reverb Size: 45%
```

Important:

```text
Reverb Mix defaults to 0%, so the synth should sound unchanged on load.
```

## Safety design

The reverb layer is additive and default-off.

It uses a small internal early-reflection delay network:

```text
source -> short delay A -> lowpass tone -> wet gain -> destination
source -> short delay B -> lowpass tone -> wet gain -> destination
source -> short delay C -> lowpass tone -> wet gain -> destination
```

There is no feedback loop in the reverb.

This avoids runaway gain and avoids long generated impulse buffers.

## Scope

Changed:

```text
faceplate-preview/first-voice-panel-docking.js
```

Not changed:

```text
faceplate-preview/audio-engine.js
delay time range
delay routing
oscillator behaviour
filter behaviour
VCA behaviour
LFO behaviour
Sample & Hold behaviour
sockets
routing matrix
presets
MIDI
JUCE/VST
```

## Good enough

```text
With Reverb Mix at 0%, the synth sounds unchanged. Raising Reverb Mix adds a small controlled space without making the page unstable.
```
