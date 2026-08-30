# MerrinLab Ultimate Synth — Module Inventory v1.0

Status date: 2026-08-30  
Reference production state: `main` at `4ceacfad9f8e44732fd7c9e32e75d5103ddd3113`

This inventory records what the browser instrument actually implements. It distinguishes a visible hardware-inspired panel from a live software function.

## Status vocabulary

- **FUNCTIONAL** — a live implementation exists on the production path.
- **ACCEPTED** — functional and previously passed the relevant protected browser/listening gate.
- **FROZEN** — accepted behaviour is versioned and must not change without a new version and renewed acceptance.
- **EXPERIMENTAL** — retained research/prototype code, not part of the accepted production path.
- **INCOMPLETE** — intended capability does not yet satisfy its acceptance contract.
- **DECORATIVE / UNSUPPORTED** — visible hardware-style representation without a live equivalent for that control/path.

A module can be functional while individual hardware-style sockets remain unsupported. A drawn jack is not evidence of software patching.

## Main instrument row

| Module | Status | Baseline meaning |
| --- | --- | --- |
| VCO 1 | **ACCEPTED** | Live oscillator controls, waveform, tuning, pitch modulation, linear FM and PWM. |
| VCO 2 | **ACCEPTED** | Same accepted three-oscillator bank contract as VCO 1. |
| VCO 3 | **ACCEPTED** | Same accepted three-oscillator bank contract as VCO 1. |
| Mixer | **ACCEPTED** | Four live channels: VCO 1–3 plus selectable noise, independent levels/mutes and pre-filter meter. |
| Voltage Controlled Lowpass Filter (12 dB/Oct) | **ACCEPTED** | Live cutoff/modulation/resonance path. Resonance uses the accepted base Biquad-Q implementation; synthetic self-resonance is not loaded. The drawn Ext CV sockets are not a general external patch interface. |
| Sample & Hold | **FUNCTIONAL** | Sample/hold behaviour, rate/filter/glide state and internal routing exist. Hardware-style Input/CV-Out/Trig sockets are not a general patch-cable system. |
| AR Generator | **FUNCTIONAL** | Attack/release, mode/range and manual gate/trigger behaviour are live. Hardware-style jacks do not imply external patch I/O. |
| Main VCA | **ACCEPTED** | Main release-controlled amplitude path with modulation controls. |
| AUX VCA | **ACCEPTED** | Live source, CV source/amount and destination routing inside the protected release-controlled graph. |
| Low Frequency Oscillator 1 | **ACCEPTED** | Live rate, shape, range and routing source. |
| Low Frequency Oscillator 2 | **ACCEPTED** | Live rate, shape, range and routing source. |
| Output Level | **ACCEPTED** | Visible Output Level is bridged to the bounded master output state. |
| ADSR Envelope Generator | **ACCEPTED** | Live A/D/S/R, manual gate, trigger, range and output state. |
| Repeat Gate | **ACCEPTED** | Live gate rate/target behaviour, including envelope and Sample & Hold targeting. |
| Attenuators 1–6 | **ACCEPTED** | Six live source → amount → destination modulation routes. |

## Expander and utility row

| Module | Status | Baseline meaning |
| --- | --- | --- |
| State Variable VCF | **ACCEPTED** | Live LP/BP/HP response, cutoff, resonance, BP width, wet/dry level and wet-output meter on the single effects/output graph. |
| Signal Mixer | **ACCEPTED** | Four live selectable sources with levels, VCA/MIX line-out selection and Mix Out meter. |
| Analog Multiplier | **ACCEPTED** | True X × Y multiplication with selectable sources and XY output routed through the Signal Mixer. |
| Filter Ring Modulation | **FROZEN — v0.1** | Filter 1 Output × Filter 2 Output; equal-power 0% original → 100% ring-only morph; default off; protected return before master/limiter. Frozen by PR #95. |
| CV Inverter | **DECORATIVE / UNSUPPORTED** | Hardware-inspired panel representation only; no accepted live CV-inverter patch path. |
| CV Distributor | **DECORATIVE / UNSUPPORTED** | Hardware-inspired panel representation only; no accepted live distribution sockets. |
| External Signal Buffer | **DECORATIVE / UNSUPPORTED** | No approved external audio-input/capture engine exists. |
| Envelope Follower | **FUNCTIONAL** | A named analyser/envelope-following path exists internally and can drive accepted modulation behaviour. Its drawn Input/EF Out sockets are not general patch I/O. |
| Buffered Outputs | **DECORATIVE / UNSUPPORTED** | The production instrument has a real protected line/output graph, but the drawn Mixer/ADSR/Line/Headphones sockets are not separate software patch outputs. |

## Supporting live systems

| System | Status | Baseline meaning |
| --- | --- | --- |
| Drive | **FUNCTIONAL** | Live effect, default mix 0%. |
| Chorus | **FUNCTIONAL** | Live stereo chorus path, default mix 0%. |
| Delay | **ACCEPTED** | Live delay; 0.05–3.0 s range, feedback capped at 0.85, default mix 0%. |
| Reverb | **ACCEPTED** | Live generated stereo impulse reverb, default mix 0%. |
| Effects/output graph | **ACCEPTED** | Explicit Drive → Chorus → Delay → Reverb → State Variable VCF → Master → Limiter chain with one destination owner. |
| Web MIDI / Launchkey 25 | **FUNCTIONAL** | Device selection, note on/off, pitch bend and mapped CC control are wired to the live audio API. This current-main implementation supersedes draft PR #83. |
| Panic Stop / Release authority | **ACCEPTED** | Protected silence authority over the accepted audio routes. |

## Experimental / parked code

| Item | Status | Baseline boundary |
| --- | --- | --- |
| Synthetic filter self-resonance layer | **EXPERIMENTAL / PARKED** | File retained but not loaded; accepted resonance does not use it. |
| State Variable VCF BP balance runtime | **EXPERIMENTAL / PARKED** | Retained prototype file; not loaded by the production page. |
| Candidate/prototype files | **EXPERIMENTAL** | Do not define production behaviour unless explicitly promoted through a protected gate. |

## Incomplete product capabilities

| Capability | Status | Next boundary |
| --- | --- | --- |
| Sequencer Mod CV 1 → VCLPF | **INCOMPLETE** | Requirement remains in issue #81. Draft PR #82 is obsolete against current architecture and is retained only as design/test evidence. Rebuild from the Functional Baseline if resumed. |
| General patch-cable / socket system | **INCOMPLETE / NOT AUTHORISED** | Visible jack artwork must not be treated as live patching. |
| External audio input | **INCOMPLETE** | Requires an explicit approved capture/input engine. |
| Preset system | **INCOMPLETE** | `INIT PATCH` display is not evidence of a complete preset/state-management system. |
| Standalone application | **INCOMPLETE** | Browser instrument is the current implementation. |
| VST/plugin build | **INCOMPLETE** | No accepted plugin implementation yet. |

## Baseline rule

Future reviews must use this inventory rather than inferring functionality from the faceplate. A visible control or socket becomes **FUNCTIONAL** only when a live implementation and evidence exist. **FROZEN** behaviour requires a new version before intentional change.
