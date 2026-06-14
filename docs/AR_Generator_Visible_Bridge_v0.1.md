# AR Generator Visible Bridge v0.1

Issue #74 makes the visible AR Generator Attack and Release controls active.

## Goal

Follow the project direction:

```text
working browser controls -> actual visible synth interface
```

## Visible controls

```text
AR Generator / Attack
AR Generator / Release
```

## Existing state keys

```text
attack
release
```

## Visible ranges

```text
Attack: 0.005 s to 1.5 s
Release: 0.02 s to 2.5 s
```

## Scope

Changed:

```text
faceplate-preview/vco1-visible-controls.js
```

No change to:

```text
faceplate-preview/audio-engine.js
envelope behaviour
ADSR behaviour
AR mode switch
AR range switch
AR sockets
manual gate socket
gate/trig input socket
AR output sockets
routing matrix
MIDI
presets
JUCE/VST
```

## Good enough

```text
Visible AR Generator Attack and Release controls change the existing AR envelope attack and release times only.
```
