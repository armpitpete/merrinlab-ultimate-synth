# Delay Upgrade Layer v0.1

This pass fixes the working delay behaviour after reverb was accepted.

## User report

```text
reverb OK. Delay: feedback seems not working, time sets time between echo, increase to 3 seconds max. There's no echo fade or length of time echo lasts
```

## Goal

Make Delay behave like a clear echo unit:

```text
Delay Time = time between repeats
Feedback = echo fade / how long the echo trail lasts
Delay Mix = amount of echo heard
```

## Implementation

A separate upgraded delay layer was added rather than rewriting the main audio engine.

Files changed:

```text
faceplate-preview/delay-upgrade-layer.js
faceplate-preview/debug-engine-panel-collapse.js
```

## Behaviour

The upgraded delay layer:

```text
uses a 3 second maximum delay time
uses an actual delay feedback loop
uses Feedback as echo trail length
keeps Delay Mix default-off at 0%
keeps the dry synth path unchanged
```

## Ranges

```text
Delay Mix: 0% to 100%
Delay Time: 0.05 s to 3.00 s
Delay Feedback: 0% to 85%
```

## Routing

The upgraded wet delay path is:

```text
source -> delay -> wet gain -> destination
             ↑
             └ feedback tone -> feedback gain ┘
```

The dry path remains separate.

## Safety

The feedback is capped at:

```text
85%
```

The feedback path includes a low-pass tone control so repeats lose some brightness instead of building harshly.

## Not changed

```text
Reverb
ADSR
LFO
Sample & Hold
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
Delay Time reaches 3 seconds.
Feedback clearly controls how many repeats happen.
Low Feedback = one or two echoes.
High Feedback = longer echo trail/fade.
Delay Mix 0% remains dry.
Panic Stop still works.
```
