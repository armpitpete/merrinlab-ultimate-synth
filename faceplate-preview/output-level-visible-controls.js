(() => {
  "use strict";

  const config = {
    key: "output",
    label: "Output Level",
    min: 0,
    max: 100,
    step: 1,
    sourceMax: 0.16,
  };

  function normalizeText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function findSourceControl() {
    return document.querySelector(`.audio-voice-panel [data-audio-control="${config.key}"]`);
  }

  function findOutputControl() {
    const outputModule = document.querySelector(".output-module");
    if (!outputModule) return null;

    return Array.from(outputModule.querySelectorAll(".control")).find((control) => {
      const controlLabel = control.querySelector(".control-label");
      return normalizeText(controlLabel?.textContent) === config.label;
    }) || null;
  }

  function sourceToPercent(value) {
    return Math.round((Number(value) / config.sourceMax) * 100);
  }

  function percentToSource(value) {
    return (Number(value) / 100) * config.sourceMax;
  }

  function formatPercent(value) {
    return `${Math.round(Number(value))}%`;
  }

  function updateVisibleControl(sourceValue) {
    const input = document.querySelector(`[data-output-visible-control="${config.key}"]`);
    if (!input) return;

    const percent = sourceToPercent(sourceValue);
    input.value = String(percent);

    const wrapper = input.closest(".output-visible-control-wrap");
    const readout = wrapper?.querySelector(".output-visible-readout");
    if (readout) readout.textContent = formatPercent(percent);
  }

  function sendToSource(percentValue) {
    const sourceControl = findSourceControl();
    if (!sourceControl) return;

    sourceControl.value = String(percentToSource(percentValue));
    sourceControl.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function addVisibleOutputControl() {
    const faceControl = findOutputControl();
    const sourceControl = findSourceControl();

    if (!faceControl || !sourceControl || faceControl.querySelector(`[data-output-visible-control="${config.key}"]`)) {
      return false;
    }

    faceControl.classList.add("is-audio-linked");

    const wrapper = document.createElement("div");
    wrapper.className = "output-visible-control-wrap";

    const input = document.createElement("input");
    input.type = "range";
    input.min = config.min;
    input.max = config.max;
    input.step = config.step;
    input.value = String(sourceToPercent(sourceControl.value));
    input.dataset.outputVisibleControl = config.key;
    input.className = "output-visible-control";

    const readout = document.createElement("output");
    readout.className = "output-visible-readout";
    readout.textContent = formatPercent(input.value);

    input.addEventListener("input", () => {
      sendToSource(input.value);
      updateVisibleControl(percentToSource(input.value));
    });

    input.addEventListener("change", () => {
      sendToSource(input.value);
      updateVisibleControl(percentToSource(input.value));
    });

    wrapper.append(input, readout);
    faceControl.append(wrapper);
    updateVisibleControl(sourceControl.value);
    return true;
  }

  function addStyles() {
    if (document.querySelector("#output-visible-control-styles")) return;

    const style = document.createElement("style");
    style.id = "output-visible-control-styles";
    style.textContent = `
      .output-module .output-visible-control-wrap {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 4px;
        margin-top: 6px;
      }

      .output-visible-control {
        width: 100%;
        min-width: 0;
        accent-color: #d7b884;
      }

      .output-visible-readout {
        color: #d6c8b5;
        font-size: 0.62rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
      }
    `;

    document.head.append(style);
  }

  function loadLfoShapeControls() {
    if (document.querySelector('script[src="lfo-shape-controls.js"]')) return;

    const script = document.createElement("script");
    script.src = "lfo-shape-controls.js";
    script.defer = true;
    document.head.append(script);
  }

  function initVisibleOutputControl() {
    addStyles();

    const sourcePanel = document.querySelector(".audio-voice-panel");
    if (!sourcePanel) {
      window.setTimeout(initVisibleOutputControl, 50);
      return;
    }

    addVisibleOutputControl();

    sourcePanel.addEventListener("input", (event) => {
      const sourceControl = event.target.closest('[data-audio-control="output"]');
      if (!sourceControl) return;
      updateVisibleControl(sourceControl.value);
    });

    const sourceControl = findSourceControl();
    if (sourceControl) updateVisibleControl(sourceControl.value);
    loadLfoShapeControls();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVisibleOutputControl);
  } else {
    initVisibleOutputControl();
  }
})();
