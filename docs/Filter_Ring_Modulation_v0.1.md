# Filter Ring Modulation v0.1

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
4. The product passes through a dedicated 0–100% Ring Level control with fixed 0.7 headroom.
5. The return enters after Filter 2 and before the protected master gain and limiter.

The return position is deliberate. Returning the product to the effects input would feed Filter 2 back into itself and could create an unsafe zero-delay loop.

## Behaviour

- Default state: off (`Ring Level = 0%`).
- Filter 2's raw selected response feeds the multiplier independently of the VCF Mix control.
- Changing either filter changes the product spectrum immediately.
- Closing either contributing filter removes the corresponding energy from the product.
- The live Ring Out meter reports silence, level and clipping.
- The existing general-purpose Analog Multiplier and Signal Mixer remain independent and unchanged.

## Acceptance evidence

The repository audio-graph checks verify:

- default-off state;
- exact Filter 1 and Filter 2 multiplier connections;
- raw Filter 2 response selection;
- dedicated post-Filter-2 return;
- output headroom;
- live level control and meter wiring;
- absence of routing through the effects input.
