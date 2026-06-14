# First Voice Panel Docking Implementation v0.1

The docking fix is implemented through the visible-control bridge, not the audio engine.

Implementation file:

```text
faceplate-preview/vco1-visible-controls.js
```

Reason:

- the bridge already loads after `audio-engine.js`
- it can safely override panel layout CSS
- it avoids changing audio behaviour

Expected layout:

- the main synth faceplate appears first
- the First Voice panel appears below it
- the panel no longer floats over visible controls

Audio scope:

- no audio behaviour change
- no state change
- no control mapping change
