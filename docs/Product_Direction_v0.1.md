# MerrinLab Ultimate Synth — Product Direction v0.1

This project is a standalone/VST software instrument that combines the MFOS Ultimate and MFOS Ultimate Expander concepts into one complete interface.

## Core decision

This project is designed as a standalone/VST instrument first.

VCV Rack is paused as the main target and may become a later adaptation if the finished synth suggests a good modular version.

## Product idea

One instrument.

Two source units.

Grouped like hardware.

Usable like software.

## Main goal

Create a full software synth inspired by the MFOS Ultimate and MFOS Ultimate Expander, with one large coherent interface rather than separate cramped panels.

## First build target

A playable standalone synth with:

- MIDI input
- oscillator output
- gate control
- envelope shaping
- filter section
- VCA/output
- basic preset saving later

## Later build target

A larger complete instrument with:

- multiple oscillators
- mixer
- noise source
- filter modulation
- AR envelope
- ADSR envelope
- LFO/modulation section
- expander-style routing
- patch/routing view
- preset browser
- VST3 build

## Interface rule

Do not cram everything into one tiny panel.

The interface may use:

- a main performance view
- an advanced patching view
- a modulation/routing view
- a preset/browser view
- zoom or scaling

## Engine rule

Keep the synth engine separate from the interface.

The same sound engine should be reusable by:

- standalone app
- VST3 plugin
- possible later VCV Rack adaptation
