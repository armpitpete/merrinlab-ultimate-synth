# Reverb Next Issue Note v0.1

User request after delay test:

```text
add reverb
```

Reverb should be handled as a separate explicit effect issue after the 2-second delay range is tested.

Reason:

```text
Reverb adds a second effect path and should not be hidden inside the delay-range change.
```

Recommended first reverb scope:

```text
simple safe reverb
Mix default 0%
Decay / Size limited
placed after voice path alongside delay or after delay
visible First Voice controls first, faceplate controls after test
```

Do not:

```text
Do not add convolution files.
Do not add external impulse responses.
Do not add presets.
Do not add routing matrix.
Do not add MIDI.
Do not start JUCE/VST.
```
