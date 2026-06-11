# MerrinLab Ultimate Synth

Standalone/VST software synth inspired by the MFOS Ultimate and MFOS Ultimate Expander.

## Project direction

This project is designed first as a standalone/VST software instrument.

The goal is to combine the MFOS Ultimate and MFOS Ultimate Expander concepts into one complete, usable software interface.

VCV Rack is not the main target for this project. It may become a later adaptation after the standalone/VST instrument has a working engine and clear interface.

## Core principle

One instrument.

Two source units.

Grouped like hardware.

Usable like software.

## Current status

Fresh project scaffold.

No synth engine, UI framework, or plugin format has been selected yet.

## First design target

A complete faceplate and interface map for the combined MFOS Ultimate and MFOS Ultimate Expander concept.

This includes:

- full component inventory
- control grouping
- signal-flow map
- wireframe / faceplate layout
- parameter list
- implementation status for each control

## First playable build target

A single-voice standalone synth with:

- MIDI input
- oscillator output
- gate control
- envelope shaping
- filter section
- VCA/output

## Development rule

Use a faceplate-first workflow.

Design the full interface early as a faceplate, wireframe, and component map.

Then implement the engine and controls section by section.

Controls may appear in the design before they are functional, but unimplemented controls must be tracked clearly.

Do not fully implement every interface control in code until the matching engine section exists.
