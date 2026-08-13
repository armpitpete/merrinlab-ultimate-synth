(() => {
  "use strict";

  const MIN_BPM = 6;
  const MAX_BPM = 720;

  function clampBpm(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 120;
    return Math.round(Math.min(MAX_BPM, Math.max(MIN_BPM, number)));
  }

  function findVisibleGateRateControl() {
    return document.querySelector('[data-visible-audio-control="repeatGateRate"]');
  }

  function findSourceGateRateControl() {
    return document.querySelector('[data-audio-control="repeatGateRate"]');
  }

  function findGateRateWrap() {
    const visibleControl = findVisibleGateRateControl();
    return visibleControl?.closest(".visible-audio-control-wrap") || null;
  }

  function readCurrentBpm() {
    const visibleControl = findVisibleGateRateControl();
    if (visibleControl) return clampBpm(visibleControl.value);

    const sourceControl = findSourceGateRateControl();
    if (sourceControl) return clampBpm(Number(sourceControl.value) * 60);

    return 120;
  }

  function updateReadout(bpm) {
    const wrap = findGateRateWrap();
    const readout = wrap?.querySelector(".visible-audio-readout");
    if (readout) readout.textContent = `${bpm} BPM`;

    document.querySelectorAll('[data-repeat-gate-bpm-entry]').forEach((input) => {
      if (document.activeElement !== input) input.value = String(bpm);
    });
  }

  function commitBpm(rawValue) {
    const bpm = clampBpm(rawValue);
    const visibleControl = findVisibleGateRateControl();

    if (visibleControl) {
      visibleControl.value = String(bpm);
      visibleControl.dispatchEvent(new Event("input", { bubbles: true }));
      visibleControl.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      const sourceControl = findSourceGateRateControl();
      if (sourceControl) {
        sourceControl.value = String(bpm / 60);
        sourceControl.dispatchEvent(new Event("input", { bubbles: true }));
        sourceControl.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    updateReadout(bpm);
  }

  function installBpmEntry() {
    const wrap = findGateRateWrap();
    if (!wrap) {
      window.setTimeout(installBpmEntry, 100);
      return;
    }

    if (wrap.querySelector('[data-repeat-gate-bpm-entry]')) return;

    const entryRow = document.createElement("div");
    entryRow.className = "repeat-gate-bpm-entry-row";
    entryRow.innerHTML = `
      <input
        class="repeat-gate-bpm-entry"
        data-repeat-gate-bpm-entry
        type="number"
        min="${MIN_BPM}"
        max="${MAX_BPM}"
        step="1"
        inputmode="numeric"
        aria-label="Repeat Gate Rate BPM"
      >
      <span class="repeat-gate-bpm-entry-unit">BPM</span>
    `;

    const entry = entryRow.querySelector('[data-repeat-gate-bpm-entry]');
    entry.value = String(readCurrentBpm());

    entry.addEventListener("focus", () => {
      entry.select();
    });

    entry.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commitBpm(entry.value);
        entry.blur();
      }

      if (event.key === "Escape") {
        event.preventDefault();
        entry.value = String(readCurrentBpm());
        entry.blur();
      }
    });

    entry.addEventListener("change", () => {
      commitBpm(entry.value);
    });

    wrap.append(entryRow);
    updateReadout(readCurrentBpm());
  }

  function handleGateRateInput(event) {
    const control = event.target.closest('[data-visible-audio-control="repeatGateRate"], [data-audio-control="repeatGateRate"]');
    if (!control) return;
    window.setTimeout(() => updateReadout(readCurrentBpm()), 0);
  }

  function addStyles() {
    if (document.querySelector("#repeat-gate-bpm-entry-styles")) return;

    const style = document.createElement("style");
    style.id = "repeat-gate-bpm-entry-styles";
    style.textContent = `
      .repeat-gate-bpm-entry-row {
        align-items: center;
        display: grid;
        gap: 4px;
        grid-template-columns: minmax(48px, 72px) auto;
        justify-content: center;
        margin-top: 4px;
      }

      .repeat-gate-bpm-entry {
        background: #211913;
        border: 1px solid rgba(215, 184, 132, 0.44);
        border-radius: 8px;
        color: #f3e8da;
        font: inherit;
        font-size: 0.72rem;
        font-variant-numeric: tabular-nums;
        padding: 3px 6px;
        text-align: center;
        width: 100%;
      }

      .repeat-gate-bpm-entry:focus {
        border-color: rgba(147, 211, 108, 0.86);
        box-shadow: 0 0 0 2px rgba(147, 211, 108, 0.18);
        outline: none;
      }

      .repeat-gate-bpm-entry-unit {
        color: #d6c8b5;
        font-size: 0.62rem;
        letter-spacing: 0.08em;
      }
    `;

    document.head.append(style);
  }

  function loadStateVariableVcfLayer() {
    if (document.querySelector('script[src="state-variable-vcf-layer.js"]')) return;

    const script = document.createElement("script");
    script.src = "state-variable-vcf-layer.js";
    script.defer = true;
    document.head.append(script);
  }

  function initBpmEntry() {
    addStyles();
    installBpmEntry();
    loadStateVariableVcfLayer();
    window.setTimeout(() => updateReadout(readCurrentBpm()), 300);
  }

  document.addEventListener("input", handleGateRateInput, true);
  document.addEventListener("change", handleGateRateInput, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBpmEntry);
  } else {
    initBpmEntry();
  }
})();
