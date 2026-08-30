# Filter Ring Modulation v0.1

## Freeze record

- Status: **FROZEN — OWNER ACCEPTED**
- Frozen: **2026-08-30**
- Accepted deployed baseline: `8bd867e4e20ae623efe092d133fccd73c0c723a8`
- Final implementation PR: [#94](https://github.com/armpitpete/merrinlab-ultimate-synth/pull/94)
- Automated evidence: exact-head audio-graph checks and GitHub Pages deployment passed.
- Human evidence: owner visual and listening acceptance passed on the deployed instrument.

The contract, signal path and behaviour below are the accepted v0.1 baseline. Any intentional change to a frozen invariant requires a new version and renewed owner listening acceptance.

### Frozen invariants

- The output is the bipolar audio-rate product of Filter 1 Output and Filter 2 Output.
- Ring Level is an equal-power morph: 0% is the original output and 100% is ring-only.
- The default remains off at 0%.
- Filter 2 uses its raw selected response independently of VCF Mix.
- The ring return remains after Filter 2 and before the protected master gain and limiter.
- The wet path retains fixed 0.7 headroom.
- Filter Ring retains its own clearly titled module with named Filter 1 and Filter 2 sources, level control and live output meter.
- Analog Multiplier and Signal Mixer remain independent.

## Contract

Filter Ring is a dedicated, bipolar audio-rate multiplication path:

```text
Filter Ring Output = Filter 1 Output × Filter 2 Output
```

It is not cutoff modulation and it is not ordinary amplitude modulation.

## Signal path

1. Filter 1 is the main voltage-controlled low-pass filter.
2. Filter 2 is the selected State Variable VCF response: low-pass, band-pass or high-pass.
3. The two audio outputs enter separate inputs of a four-quadrant Web Audio multiplier.
4. A dedicated 0–100% Ring Level control applies an equal-power morph between the original Filter 2 output and the product, with fixed 0.7 wet-path headroom.
5. At 0%, the original output is unchanged. At 100%, the original path is silent and the output is Filter 1 × Filter 2 only.
6. The return enters after Filter 2 and before the protected master gain and limiter.

The return position is deliberate. Returning the product to the effects input would feed Filter 2 back into itself and could create an unsafe zero-delay loop.

## Behaviour

- Default state: off (`Ring Level = 0%`).
- `Ring Level = 100%` is ring-only, so the unprocessed output cannot mask the multiplication effect.
- Filter 2's raw selected response feeds the multiplier independently of the VCF Mix control.
- Changing either filter changes the product spectrum immediately.
- Closing either contributing filter removes the corresponding energy from the product.
- The live Ring Out meter reports silence, level and clipping.
- Filter Ring has its own clearly titled two-column module; it is not nested inside Analog Multiplier.
- The existing general-purpose Analog Multiplier and Signal Mixer remain independent and unchanged.

## Acceptance evidence

The repository audio-graph checks verify:

- default-off state;
- exact Filter 1 and Filter 2 multiplier connections;
- raw Filter 2 response selection;
- dedicated post-Filter-2 return;
- output headroom;
- equal-power original-to-ring morph with ring-only output at 100%;
- live level control and meter wiring;
- absence of routing through the effects input.
