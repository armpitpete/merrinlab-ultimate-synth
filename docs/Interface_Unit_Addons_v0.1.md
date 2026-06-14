# Interface Unit Add-ons v0.1

Issue #53 records the next interface-unit improvements.

User requests:

1. Repeat Gate Rate should be BPM.
2. VCO Frequency should be notes.
3. VCO cents should use a pull-down menu.
4. Mixer sliders should show percent.

## Rule

These are interface-unit changes first.

The audio engine remains the source of truth. Visible controls should convert friendly interface units into the existing state values.

## Implementation order

### 1. Repeat Gate Rate as BPM

Smallest safe first change.

The existing state key is:

```text
repeatGateRate
```

The engine stores this as cycles per second.

Visible BPM control should convert:

```text
BPM / 60 = repeatGateRate
```

Example:

```text
120 BPM -> 2 Hz
```

### 2. Mixer sliders as percent

Visible mixer controls should show 0 to 100 percent while still writing the existing safe gain ranges.

Existing keys:

```text
vcoLevel
vco2Level
vco3Level
whiteNoiseLevel
```

### 3. VCO Frequency as notes

The visible VCO frequency controls should eventually use musical note selection instead of raw Hz.

This needs a small separate issue because notes must map cleanly to existing coarse frequency keys.

Existing keys:

```text
coarseFreq
vco2CoarseFreq
vco3CoarseFreq
```

### 4. VCO cents as pull-down menu

The visible fine-tune controls should eventually use a cents menu instead of a free slider.

Existing keys:

```text
fineCents
vco2FineCents
vco3FineCents
```

## Do not do in this planning issue

- no sound engine changes
- no patch routing
- no socket activation
- no MIDI
- no presets
- no save/load

## Good enough

```text
Interface unit add-ons are split into small safe implementation issues.
```
