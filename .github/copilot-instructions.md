# Copilot / AI agent instructions

## Project identity

This repository is for MerrinLab Ultimate Synth.

It is a standalone/VST software synth inspired by the MFOS Ultimate and MFOS Ultimate Expander.

VCV Rack is not the main target for this repository.

## Working style

Work in small controlled batches.

Do not make unrelated changes.

Do not redesign the product direction unless an issue explicitly asks for that.

Prefer the smallest safe implementation that proves the next step works.

## Architecture rule

Keep the synth engine separate from the interface.

The audio/synth engine should be reusable by:

- standalone app
- VST3 plugin
- possible later VCV Rack adaptation

Do not tightly couple DSP code to a specific UI framework.

## Faceplate-first workflow

This project uses a faceplate-first workflow.

It is acceptable to design the full interface early as:

- component inventory
- control grouping
- faceplate / wireframe
- signal-flow map
- parameter list
- implementation-status table

The interface is the product map, not decoration.

## Implementation rule

Do not fully implement every interface control in code before the matching engine section exists.

Controls may appear in design documents before they are functional.

Unimplemented controls must be tracked clearly.

When coding, build the engine and control mapping section by section.

## Reporting rule

After each change, report:

- files changed
- reason for each change
- build/test commands run
- any risks or unfinished parts

## Safety rule

Do not add real paid plugin signing, licensing, copy protection, telemetry, analytics, or external services unless an issue explicitly requests them.

## Default interpretation

If a task is ambiguous, choose the smallest safe interpretation and explain what was left out.
