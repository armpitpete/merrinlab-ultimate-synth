# VCO Bottom Clipping Fix v0.1

Issue #58 fixes a layout problem found after active visible VCO controls were added.

Problem:

- the VCO bank was too short for the active controls
- the lower LOG-CV / LIN-CV area was clipped near the ADSR row

Fix:

- increased the vertical space available above the ADSR row
- kept the bottom row fix from #55

Changed CSS:

```text
grid-template-rows: 220px 165px 270px 255px 215px;
```

Scope:

- layout only
- no audio behaviour change
- no visible-control mapping change
- no mixer-percent work
- no VCO tuning behaviour change
- no socket activation

Good enough:

```text
The bottom of the VCO 1, VCO 2, and VCO 3 sections is no longer cut off.
```
