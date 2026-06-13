# Static Faceplate Preview Checkpoint v0.1

**Project:** MerrinLab Ultimate Synth  
**Issue:** #14 — Static faceplate preview stable checkpoint  
**Status:** Stable static preview checkpoint  

## Purpose

This checkpoint freezes the current static faceplate preview as the clean baseline before any new visual polish, sound-behaviour research, BOM analysis, audio-engine work, JUCE work, or VST work.

The project has moved beyond the first scaffold and early setup issues. It now has a dark static software-synth faceplate preview that combines the MFOS Sound Lab Ultimate and Ultimate Expander concepts into one software-instrument layout.

## Current frozen baseline

The current baseline is:

- static browser faceplate preview
- dark software-synth visual direction
- MFOS Ultimate + Ultimate Expander combined into one interface
- verified label-correction pass complete
- faceplate label verification documented
- old setup/design issues triaged
- no audio engine
- no JUCE implementation
- no VST implementation
- no functional controls
- no fake control behaviour

## Current preview route

Live preview:

```text
https://armpitpete.github.io/merrinlab-ultimate-synth/faceplate-preview/
```

Preview source:

```text
faceplate-preview/index.html
faceplate-preview/styles.css
```

## Related documentation

Primary label-verification document:

```text
docs/Faceplate_Label_Verification_v0.1.md
```

Supporting source-panel extraction and inventory documents:

```text
docs/Ultimate_Front_Panel_Label_Extraction_v0.1.md
docs/Expander_Panel_Label_Extraction_v0.1.md
docs/Interface_Component_Inventory_v0.1.md
```

## Completed cleanup before this checkpoint

Closed as completed or superseded:

- #1 — component-name/source-panel verification
- #4 — static browser faceplate preview
- #5 — dark software synth interface redesign
- #11 — faceplate label verification
- #13 — old setup/design issue triage

Still open for future research:

- #2 — sound behaviour analysis
- #3 — BOM/component-value analysis

## Boundary rule

Do not treat the static faceplate as a working synth.

At this checkpoint, the interface is a visual design map only. It does not make sound, process MIDI, run an audio engine, export a plugin, or control parameters.

## Do not change in this checkpoint

This checkpoint does not change:

- faceplate layout
- visible labels
- controls
- audio behaviour
- engine architecture
- JUCE/VST direction
- module grouping
- routing behaviour

## What comes next

After this checkpoint, choose one focused branch:

1. **Visual polish** — improve the existing static faceplate without adding behaviour.
2. **Sound-behaviour research** — continue Issue #2 and define the first engine target.
3. **BOM/component-value research** — continue Issue #3 and improve modelling notes.

Do not mix these branches in one issue.

## Good enough state

A future reader can open the repo and understand this immediately:

```text
This is the frozen static faceplate checkpoint.
The next work is either visual polish or research.
Do not start random cleanup or engine work from here.
```