# Faceplate Label Verification v0.1

**Project:** MerrinLab Ultimate Synth  
**Scope:** MFOS Sound Lab Ultimate + Ultimate Expander dark software faceplate preview  
**Issue:** #11 — Issue #10 — Verify faceplate labels against MFOS source panels  
**Status:** Documentation pass complete  

## Purpose

This note records the first source-check pass for visible faceplate labels.

The goal was to correct labels that were clearly wrong or misleading, while keeping the current layout, visual hierarchy, and static-preview boundary stable.

## Boundaries

This pass did not add or change:

- audio
- engine behaviour
- functional controls
- JavaScript behaviour
- JUCE
- VST work
- module layout
- colour system
- major visual design

## Verification rule

Each label was treated in one of four ways:

| Decision | Meaning |
|---|---|
| Changed | The label was clearly wrong, too generic, or misleading. |
| Kept | The label matched the source panel, matched the intended role, or was clear enough for this preview. |
| Helper kept | The label is not a strict source-panel label, but is useful as a software-preview helper label. |
| Documented | The label may need later review, but was not changed in this pass. |

## Confirmed changes

| Area | Previous label | Source / intended label | Decision | Reason |
|---|---|---|---|---|
| State Variable VCF output jack | Outputs | LP/BP/HP Out | Changed | The original label was too generic. The corrected label makes the filter output group clear. |
| CV Distributor helper strip | Buffered CV copies | CV Distributor | Changed | The helper text repeated the actual function more cleanly and avoids non-source wording. |
| CV Distributor output jack 1 | Out 1 | CV Out | Changed | Both distributor outputs are CV outputs; numbering is not needed on the preview. |
| CV Distributor output jack 2 | Out 2 | CV Out | Changed | Both distributor outputs are CV outputs; numbering is not needed on the preview. |
| Buffered Outputs headphone jack | Phones | Headphones | Changed | This separates the Buffered Outputs headphone label from the Main Output Level `Phones` label. |

## Important correction retained

| Area | Label after pass | Decision | Reason |
|---|---|---|---|
| Main Output Level section | Phones | Kept | This section should still say `Phones`. Only Buffered Outputs was changed to `Headphones`. |

## Labels checked and kept

| Faceplate area | Label checked | Source / intended label | Decision | Reason |
|---|---|---|---|---|
| Repeating gate module | Rpt. Gate Rate | Rpt. Gate Rate | Kept | Abbreviated source-style wording is acceptable for the compact panel. |
| LFO 1 | Low Frequency Osc - 1 | Low Frequency Osc - 1 | Kept | Clear source-style module label. |
| LFO 2 | Low Frequency Osc - 2 | Low Frequency Osc - 2 | Kept | Clear source-style module label. |
| State Variable VCF | Initial COF | Initial COF | Kept | Source-style abbreviation retained. |
| External signal area | Ext. Signal Buffer | Ext. Signal Buffer | Kept | Intentional role label. |
| State Variable VCF | State Variable VCF | State Variable VCF | Kept | Clear module label. |
| Low-pass filter | Voltage Controlled Lowpass Filter (12dB/Oct) | Voltage Controlled Lowpass Filter (12dB/Oct) | Kept | Clear module label. |
| VCA section | Main VCA | Main VCA | Kept | Intentional role label used to distinguish it from the expander VCA. |
| VCA section | AUX VCA | AUX VCA | Kept | Intentional role label used to distinguish it from Main VCA. |
| ADSR section | ADSR Env. Gen. | ADSR Env. Gen. | Kept | Clear compact module label. |
| AR section | AR Generator | AR Generator | Kept | Clear module label. |
| Expander mixer | Signal Mixer | Signal Mixer | Kept | Clear module label. |
| Expander utility | Analog Multiplier | Analog Multiplier | Kept | Clear module label. |
| Expander utility | CV Inverter | CV Inverter | Kept | Clear module label. |
| Expander utility | CV Distributor | CV Distributor | Kept | Clear module label. |
| Expander utility | Buffered Outputs | Buffered Outputs | Kept | Clear module label. |
| Main output area | Output Level | Output Level | Kept | Clear module label. |

## Control labels checked and kept

| Area | Label checked | Source / intended label | Decision | Reason |
|---|---|---|---|---|
| Low-pass filter | Initial Cutoff | Initial Cutoff | Kept | Clear control label. |
| Low-pass filter / VCA modulation | AR Mod | AR Mod | Kept | Clear compact modulation label. |
| Low-pass filter modulation | LFO-1 Mod | LFO-1 Mod | Kept | Clear compact modulation label. |
| VCA modulation | LFO-2 Mod | LFO-2 Mod | Kept | Clear compact modulation label. |
| Low-pass filter / VCA external CV | Ext CV | Ext CV | Kept | Clear compact CV label. |
| VCO controls | Coarse Freq | Coarse Freq | Kept | Clear compact frequency label. |
| VCO controls | Fine Freq | Fine Freq | Kept | Clear compact frequency label. |
| VCO controls | Pulse Width % | Pulse Width % | Kept | Clear control label. |
| Mixer | White NS Level | White NS Level | Kept | Clear compact noise-source label. |
| Mixer | Ext. In Level | Ext. In Level | Kept | Clear external input level label. |
| AR Generator | Gate/Trig In | Gate/Trig In | Kept | Clear gate/trigger input label. |
| AR Generator | AR Outputs | AR Outputs | Kept | Clear output group label. |
| Buffered Outputs | ADSR Out | ADSR Out | Kept | Clear output label. |
| Buffered Outputs | Mixer Out | Mixer Out | Kept | Clear output label. |
| Buffered Outputs | Line Out | Line Out | Kept | Clear output label. |
| Sample & Hold | LED | LED | Helper kept | Acceptable helper label for the software-preview light. |

## Encoding note

During the label-correction pass, PowerShell `Set-Content` caused temporary UTF-8 corruption in the working file. The file was restored using a UTF-8-safe Python read/write pass before merge.

The merged label changes use safe plain text for the corrected labels:

- `LP/BP/HP Out`
- `CV Distributor`
- `CV Out`
- `Headphones`
- `Phones`

## Final decision

The first label-verification pass is complete.

The faceplate still keeps the same layout and static-preview behaviour. Only text labels were corrected or documented.

Issue #11 can be closed after this file is committed.