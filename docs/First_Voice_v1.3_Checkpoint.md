# First Voice v1.3 Checkpoint

**Project:** MerrinLab Ultimate Synth  
**Checkpoint:** First Voice v1.3  
**Status:** Manual-tested documentation checkpoint  
**Scope:** Documentation checkpoint only  

## 1. Purpose

This checkpoint records that the simple manual patch list was tested against the live First Voice v1.2 browser panel and passed.

This checkpoint does not add new audio behaviour. It does not change the UI. It does not change the audio engine. It does not add presets, save/load, patch storage, external input, a patch matrix, MIDI, JUCE, or VST work.

The purpose is to freeze the current manual-tested state before any further feature planning.

## 2. Current playable baseline

The current playable audio behaviour remains:

```text
First Voice v1.2
```

The documentation checkpoint is:

```text
First Voice v1.3
```

This means v1.3 is not a new sound engine version. It is the manual-tested checkpoint after the six simple documented patches were tested successfully.

## 3. Manual patch list tested

The following six manual patches were tested against the live panel:

1. Plain VCO 1 Sound
2. Three VCOs at the Same Pitch
3. Slow Smooth Filter Sweep
4. Random Brightness Steps
5. Random VCO 1 Pitch Steps
6. Repeat Gate Pulses

## 4. Test results

| Patch | Result |
|---|---|
| Plain VCO 1 Sound | PASS |
| Three VCOs at the Same Pitch | PASS |
| Slow Smooth Filter Sweep | PASS |
| Random Brightness Steps | PASS |
| Random VCO 1 Pitch Steps | PASS |
| Repeat Gate Pulses | PASS |

## 5. What works

The tested manual patches confirmed:

- VCO 1 can produce a plain steady sound.
- VCO 1, VCO 2, and VCO 3 can play together at the same pitch.
- LFO 1 can create slow smooth filter movement.
- Sample & Hold can create random stepped filter brightness movement.
- Sample & Hold Pitch Mod can create random stepped VCO 1 pitch movement.
- Repeat Gate can create repeated envelope pulses.

## 6. What remains intentionally limited

The current voice remains deliberately limited:

- S&H Pitch Mod affects VCO 1 only.
- S&H Pitch Mod does not affect VCO 2.
- S&H Pitch Mod does not affect VCO 3.
- S&H pitch movement is not quantised.
- There is no musical scale selection.
- Repeat Gate is not a sequencer.
- VCOs are not freely patchable.
- Sample & Hold is not freely patchable.
- The envelope is not freely patchable.
- There is no preset engine.
- There is no save/load system.
- There is no patch storage.
- There is no external input.
- There is no patch matrix.
- There is no MIDI.
- There is no JUCE or VST version.

## 7. Code-change result

No code changes were needed after testing.

Confirmed unchanged by scope:

- no audio behaviour changes
- no UI changes
- no `faceplate-preview/audio-engine.js` changes
- no new features

## 8. Manual status

The living manual remains usable as tested:

```text
docs/User_Manual_v0.1.md
```

No manual correction was required from this test pass.

## 9. Next allowed direction

The next issue should still be small and controlled.

Allowed next directions:

1. Plan the next feature in writing before implementation.
2. Improve documentation if a tester finds unclear wording later.
3. Add one small feature only after deciding the next safe target.

Do not jump straight to:

- full patch routing
- external input
- MIDI
- presets engine
- save/load
- JUCE
- VST
- exact MFOS hardware emulation

## 10. Checkpoint statement

```text
First Voice v1.3 is the manual-tested checkpoint.
```

The playable audio behaviour remains First Voice v1.2. The v1.3 checkpoint confirms that the six basic manual patches passed and no audio, UI, or engine changes were required.
