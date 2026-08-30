# MerrinLab Ultimate Synth

MerrinLab Ultimate Synth (MUS) is a functional browser/software synthesizer inspired by the MFOS Ultimate and MFOS Ultimate Expander concepts.

It is its own project. It is separate from the original relational instrument in `armpitpete/synth`.

## Project direction

MUS combines the broad Ultimate + Expander instrument concept into one coherent software instrument while allowing deliberate software-native extensions where they improve the instrument without obscuring the underlying signal logic.

Core principle:

> One instrument. Two source units. Grouped like hardware. Usable like software.

The browser instrument is the current production implementation. Standalone/JUCE and VST/plugin delivery remain future product work.

## Current state

The project has advanced well beyond the original static-faceplate checkpoint.

The current production browser instrument provides:

- three live VCOs with waveform, tuning, pitch modulation, linear FM and PWM;
- a four-channel VCO/noise Mixer with mute and metering;
- the main 12 dB/oct low-pass filter and accepted resonance behaviour;
- Sample & Hold;
- AR Generator, ADSR, Main VCA and AUX VCA;
- LFO 1 and LFO 2;
- six live attenuator/modulation routes;
- Drive, Chorus, Delay and Reverb;
- State Variable VCF;
- four-channel Signal Mixer;
- true Analog Multiplier;
- Filter Ring Modulation v0.1;
- bounded master output, limiter, Release and Panic Stop;
- Web MIDI device selection, note on/off, pitch bend and mapped CC control.

Live preview:

```text
https://armpitpete.github.io/merrinlab-ultimate-synth/faceplate-preview/
```

## Functional Baseline v1.0

MUS is currently in a consolidation gate for **Functional Baseline v1.0**.

The baseline freezes feature expansion temporarily while the repository state, module inventory, stale work and whole-instrument regression evidence are brought into alignment with the real instrument.

See:

- [`docs/Functional_Baseline_v1.0.md`](docs/Functional_Baseline_v1.0.md)
- [`docs/Module_Inventory_v1.0.md`](docs/Module_Inventory_v1.0.md)
- [`docs/Filter_Ring_Modulation_v0.1.md`](docs/Filter_Ring_Modulation_v0.1.md)

Filter Ring Modulation v0.1 is already **FROZEN — OWNER ACCEPTED**. The whole-instrument Functional Baseline remains a candidate until its exact-head machine checks and one complete human listening pass both succeed.

## Accepted audio architecture

The protected production effects/output path is:

```text
voice / selected source
→ Drive
→ Chorus
→ Delay
→ Reverb
→ State Variable VCF
→ Master
→ Limiter
→ AudioContext.destination
```

There is one production destination owner. Filter Ring v0.1 returns before the protected master/limiter boundary and does not create a second destination.

## Important software boundary

The faceplate remains hardware-inspired, but visible hardware artwork is not automatically functional software.

In particular, MUS does not currently claim a general patch-cable/socket system. Some drawn sockets and utility modules remain decorative or unsupported. The authoritative status of every visible module is recorded in `docs/Module_Inventory_v1.0.md`.

Known incomplete product capabilities include:

- Sequencer Mod CV integration;
- general external patch/socket routing;
- external audio input;
- complete preset/state management;
- standalone/JUCE delivery;
- VST/plugin delivery.

## Development rule

Use protected, evidence-led increments:

1. define the exact capability and boundaries;
2. implement without silently changing accepted paths;
3. run automated syntax/graph/baseline checks;
4. deploy only through the protected gate;
5. perform browser/listening acceptance where the change is musical;
6. correct failures rather than rationalising them;
7. freeze behaviour only after evidence supports it.

A visible control or module becomes authoritative because a live implementation and acceptance evidence exist, not because it appears on the faceplate.
