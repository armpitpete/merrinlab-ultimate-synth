# VCLPF CV Source Map v0.1

This note records the practical VCLPF modulation sources for the MerrinLab Ultimate Synth browser preview.

Core direction:

```text
working browser controls -> actual visible synth interface
```

## Already active / partly active

### Initial Cutoff

Visible control:

```text
Lowpass Filter / Initial Cutoff
```

Existing state:

```text
cutoff
```

Status:

```text
active
```

### Resonance

Visible control:

```text
Lowpass Filter / Resonance
```

Existing state:

```text
resonance
```

Status:

```text
active
```

### LFO-1 to VCLPF cutoff

Visible controls:

```text
Lowpass Filter / LFO-1 Mod
Low Frequency Osc - 1 / Rate
```

Existing states:

```text
lfo1Mod
lfo1Rate
```

Status:

```text
active
```

### Sample & Hold timing

Visible control:

```text
Sample & Hold / Sample Rate
```

Existing state:

```text
sampleHoldRate
```

Status:

```text
active
```

Note:

```text
The existing S&H-to-filter amount state is sampleHoldMod, but there is not yet a clear visible faceplate amount control for it.
```

## Existing audio state not yet mapped to a clear visible faceplate amount control

### S&H to VCLPF cutoff amount

Existing state:

```text
sampleHoldMod
```

Current problem:

```text
No clear visible knob is labelled S&H Mod or S&H to Filter amount.
```

Safe implementation options:

1. Add a small explicit visible S&H Filter Amount control.
2. Do not misuse CV-Out, Input, Trig, or Glide as a hidden amount control.

## Visible controls that need new audio state before activation

### Lowpass AR Mod

Visible control:

```text
Lowpass Filter / AR Mod
```

Current problem:

```text
No existing filterArMod or AR-to-filter amount state exists yet.
```

Status:

```text
requires explicit audio-engine issue
```

### LFO-1 Shape

Visible control:

```text
Low Frequency Osc - 1 / Shape
```

Current problem:

```text
No lfo1Shape state exists yet.
```

Status:

```text
blocked until an audio-engine issue adds lfo1Shape safely
```

## Later VCLPF CV sources needing explicit audio-design issues

These are valid later, but should not be hidden inside bridge work:

```text
ADSR -> VCLPF cutoff
LFO-2 -> VCLPF cutoff
VCO 1 -> VCLPF cutoff audio-rate FM
VCO 2 -> VCLPF cutoff audio-rate FM
VCO 3 -> VCLPF cutoff audio-rate FM
Noise -> VCLPF cutoff
Keyboard/note tracking -> VCLPF cutoff
Envelope follower -> VCLPF cutoff
```

## Recommended next implementation

The next safest implementation is:

```text
Add a visible S&H Filter Amount control that writes to existing sampleHoldMod.
```

Reason:

```text
sampleHoldMod already exists in the audio engine, so this is not a new sound engine feature. It only gives the existing S&H-to-filter amount a clear visible control.
```

Do not:

```text
Do not use CV-Out, Input, Trig, or Glide as a disguised modulation amount control.
```
