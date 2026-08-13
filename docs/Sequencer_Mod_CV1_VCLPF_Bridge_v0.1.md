# Sequencer Mod CV 1 → VCLPF bridge v0.1

Issue: `#81`

Protected Ultimate base: `a25b5bb523d82cedce3d0bb5ab83c106d0efe5b9`

Accepted Sequencer producer main: `301afebda74513f5cf0d4d7814fe6b8c0119689c`

Accepted Sequencer Stage 2C head: `0644303fd1bd7e97743c6c46be681b6f16774b57`

Accepted Sequencer contract blob: `docs/Stage2C_Mod_CV1_Contract.md` = `9f7cb29a730eced0c5ccf83715d094160c0ef68e`

Accepted Sequencer Mod CV runtime blob: `0299d7239acbbb98d1d872f64ce16547c78f0646`

## Consumer contract

Ultimate listens on:

- channel: `merrinlab-patch-bus`
- protocol: `merrinlab.patch.v0.1`
- source: `merrinlab-16-step-sequencer`
- type: `mod-cv`
- lane: `1`
- lane id: `mod-cv-1`
- source id: `merrinlab-16-step-sequencer.mod-cv-1`

The incoming value must be finite and is clamped to `-1.00 … +1.00`.

Any message that does not match the complete contract is ignored.

## Destination

The only Stage 2C Ultimate destination is the existing 12 dB/oct VCLPF cutoff path.

The bridge adds its own visible **Patch Bus → VCLPF · Mod CV 1** surface beneath the low-pass filter. It does not repurpose CV-Out, Input, Trig, Glide, Ext CV jacks, or another unrelated amount control.

## Depth and safety

The bridge has an explicit `0 … 100%` depth control.

Depth defaults to `0%` and the input starts disconnected. Therefore opening Ultimate without a producer, or receiving no valid message, is neutral.

The maximum requested external offset is 1800 Hz, further reduced to the symmetric cutoff headroom available around the user's base cutoff. Final requested cutoff is clamped to the existing engine range `120 … 6500 Hz`.

The existing audio engine remains authoritative for LFO-1 and Sample & Hold filter modulation. After the external target is applied, the engine recalculates its own safe LFO/S&H headroom around that target.

## Local cutoff ownership

The user's visible **Initial Cutoff** remains the base cutoff. The bridge stores that base separately and shows the externally **Applied cutoff** in its monitor.

Moving Initial Cutoff while Mod CV is active updates the base and immediately reapplies the current external modulation amount.

The browser prototype reaches the accepted engine through its existing cutoff control event path rather than exposing a new hidden Web Audio node. This keeps the integration bounded to the existing engine contract.

## Connection semantics

The bridge has an explicit **Connect input / Disconnect input** control.

- disconnected: external contribution is exactly zero;
- connected with no valid message yet: external contribution is zero;
- Clear input: received value resets to `0.00`;
- invalid messages: ignored;
- valid messages received while disconnected are monitored but not applied;
- reconnecting applies the last valid held value.

`BroadcastChannel` v0.1 provides no producer-presence or disconnect notification. Therefore closing the Sequencer tab while Ultimate remains explicitly connected cannot be distinguished from a legitimate held step CV. The last valid value is held until a new valid value, Clear input, or explicit Disconnect. This limitation is visible and must not be described as automatic producer-disconnect detection.

## Browser acceptance gate

Use the accepted live Sequencer Stage 2C page and an Ultimate Issue #81 candidate page on the same `armpitpete.github.io` origin.

1. Start Ultimate. Leave Mod CV disconnected and depth at 0%. Changing Sequencer Mod CV must not alter Applied cutoff.
2. Set Ultimate Initial Cutoff to 2000 Hz, set depth to 50%, then Connect input.
3. On Sequencer step 01 set Mod CV 1 to `+0.50`. When step 01 is entered, Ultimate must show Incoming `+0.50`, the correct step/bank, and an Applied cutoff above the 2000 Hz base.
4. Set step 02 to `-0.50`. Applied cutoff must move below the same base when step 02 is entered.
5. Set Sequencer Rest / Chance 0% / Mute on an entered step. Ultimate must still receive that step's Mod CV.
6. Skip a step with a distinctive value. Ultimate must never show that skipped step.
7. While Mod CV is active, move Ultimate Initial Cutoff. Base cutoff must follow the user's control while Applied cutoff remains a separate derived value.
8. Raise LFO-1 Mod or S&H Filter Amount. Filter modulation must continue operating without cutoff values outside the engine range.
9. Press Disconnect input. Applied cutoff must immediately equal Base cutoff.
10. Reconnect and then press Clear input. Incoming must become `+0.00` and Applied cutoff must equal Base cutoff.

## Acceptance status

**NOT YET ACCEPTED.**

Do not merge Issue #81 until the two-repository browser test passes on an exact Ultimate candidate head. Any runtime change after acceptance requires a new exact-head test.
