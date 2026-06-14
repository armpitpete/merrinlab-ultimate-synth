# VCLPF CV Source Map Status v0.1

Status after Issue #64:

```text
Sample & Hold / Sample Rate is active and writes to sampleHoldRate.
```

Current VCLPF modulation status:

```text
Lowpass Initial Cutoff: active
Lowpass Resonance: active
Lowpass LFO-1 Mod: active
LFO-1 Rate: active
Sample & Hold Sample Rate: active
```

Important blocker:

```text
The existing S&H-to-filter amount state is sampleHoldMod, but the faceplate does not currently have a clear visible amount control for it.
```

Safe next step:

```text
Create an explicit issue to add a visible S&H Filter Amount control that writes to sampleHoldMod.
```

Do not:

```text
Do not misuse CV-Out, Input, Trig, or Glide as a hidden amount control.
```
