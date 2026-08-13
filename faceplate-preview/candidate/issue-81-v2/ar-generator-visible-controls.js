(() => {
  "use strict";

  const controls = [
    {
      key: "attack",
      label: "Attack",
      min: 0.005,
      max: 1.5,
      step: 0.005,
      unit: "s",
    },
    {
      key: "release",
      label: "Release",
      min: 0.02,
      max: 2.5,
      step: 0.01,
      unit: "s",
    },
  ];

  function normalizeText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function findSourceControl(key) {
    return document.querySelector(`.audio-voice-panel [data-audio-control="${key}"]`);
  }

  function findArControl(label) {
    const arModule = document.querySelector(".ar-module");
    if (!arModule) return null;

    return Array.from(arModule.querySelectorAll(".control")).find((control) => {
      const controlLabel = control.querySelector(".control-label");
      return normalizeText(controlLabel?.textContent) === label;
    }) || null;
  }

  function formatSeconds(value) {
    return `${Number(value).toFixed(2)} s`;
  }

  function updateVisibleControl(config, sourceValue) {
    const input = document.querySelector(`[data-ar-visible-control="${config.key}"]`);
    if (!input) return;

    input.value = sourceValue;
    const wrapper = input.closest(".ar-visible-control-wrap");
    const readout = wrapper?.querySelector(".ar-visible-readout");
    if (readout) readout.textContent = formatSeconds(sourceValue);
  }

  function sendToSource(config, visibleValue) {
    const sourceControl = findSourceControl(config.key);
    if (!sourceControl) return;

    sourceControl.value = visibleValue;
    sourceControl.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function addVisibleArControl(config) {
    const faceControl = findArControl(config.label);
    const sourceControl = findSourceControl(config.key);

    if (!faceControl || !sourceControl || faceControl.querySelector(`[data-ar-visible-control="${config.key}"]`)) {
      return false;
    }

    faceControl.classList.add("is-audio-linked");

    const wrapper = document.createElement("div");
    wrapper.className = "ar-visible-control-wrap";

    const input = document.createElement("input");
    input.type = "range";
    input.min = config.min;
    input.max = config.max;
    input.step = config.step;
    input.value = sourceControl.value;
    input.dataset.arVisibleControl = config.key;
    input.className = "ar-visible-control";

    const readout = document.createElement("output");
    readout.className = "ar-visible-readout";
    readout.textContent = formatSeconds(sourceControl.value);

    input.addEventListener("input", () => {
      sendToSource(config, input.value);
      updateVisibleControl(config, input.value);
    });

    input.addEventListener("change", () => {
      sendToSource(config, input.value);
      updateVisibleControl(config, input.value);
    });

    wrapper.append(input, readout);
    faceControl.append(wrapper);
    updateVisibleControl(config, sourceControl.value);
    return true;
  }

  function addStyles() {
    if (document.querySelector("#ar-visible-control-styles")) return;

    const style = document.createElement("style");
    style.id = "ar-visible-control-styles";
    style.textContent = `
      .ar-module .ar-visible-control-wrap {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 4px;
        margin-top: 6px;
      }

      .ar-visible-control {
        width: 100%;
        min-width: 0;
        accent-color: #d7b884;
      }

      .ar-visible-readout {
        color: #d6c8b5;
        font-size: 0.62rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
      }
    `;

    document.head.append(style);
  }

  function syncFromSourceControls() {
    controls.forEach((config) => {
      const sourceControl = findSourceControl(config.key);
      if (!sourceControl) return;
      updateVisibleControl(config, sourceControl.value);
    });
  }

  function loadOutputLevelBridge() {
    if (document.querySelector('script[src="output-level-visible-controls.js"]')) return;

    const script = document.createElement("script");
    script.src = "output-level-visible-controls.js";
    script.defer = true;
    document.head.append(script);
  }

  function initArVisibleControls() {
    addStyles();

    const sourcePanel = document.querySelector(".audio-voice-panel");
    if (!sourcePanel) {
      window.setTimeout(initArVisibleControls, 50);
      return;
    }

    controls.forEach(addVisibleArControl);

    sourcePanel.addEventListener("input", (event) => {
      const sourceControl = event.target.closest("[data-audio-control]");
      if (!sourceControl) return;

      const config = controls.find((item) => item.key === sourceControl.dataset.audioControl);
      if (!config) return;
      updateVisibleControl(config, sourceControl.value);
    });

    syncFromSourceControls();
    loadOutputLevelBridge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initArVisibleControls);
  } else {
    initArVisibleControls();
  }
})();
