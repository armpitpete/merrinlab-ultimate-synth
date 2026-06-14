# Bottom Row Clipping Fix v0.1

Issue #55 fixes a layout problem found after adding active visible controls.

Problem:

- bottom-row modules were too short
- ADSR, AUX VCA, and Repeat Gate could be clipped

Fix:

- increased the final main-grid row height

Changed CSS:

```text
grid-template-rows: 190px 145px 250px 185px 215px;
```

Scope:

- layout only
- no audio behaviour change
- no BPM conversion change
- no Repeat Gate timing change
- no routing change

Good enough:

```text
The bottom of ADSR, AUX VCA, and Repeat Gate is no longer cut off.
```
