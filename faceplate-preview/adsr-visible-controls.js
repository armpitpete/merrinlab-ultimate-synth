(() => {
  "use strict";

  const controls = [
    {
      key: "adsrAttack",
      label: "Attack",
      min: 0.005,
      max: 2,
      step: 0.005,
      kind: "seconds",
    },
    {
      key: "adsrDecay",
      label: "Decay",
      min: 0.005,
      max: 3,
      step: 0.005,
      kind: "seconds",
    },
    {
      key: "adsrSustain",
      label: "Sustain",
      min: 0,
      max: 100,
      step: 1,
      kind: "percent",
      fromSourceValue: (value) => Number(value) * 100,
      toSourceValue: (value) => Number(value) / 100,
    },
    {
      key: "adsrRelease",
      label: "Release",
      min: 0.02,
      max: 4,
      step: 0.01,
      kind: "seconds",
    },
  ];

  function normalizeText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function findSourceControl(key) {
    return document.querySelector(`.audio-voice-panel [data-audio-control="${key}"]`);
  }

  function findAdsrControl(label) {
    const adsrModule = document.querySelector(".adsr-module");
    if (!adsrModule) return null;

    return Array.from(adsrModule.querySelectorAll(".control")).find((control) => {
      const controlLabel = control.querySelector(".control-label");
      return normalizeText(controlLabel?.textContent) === label;
    }) || null;
  }

  function getVisibleValue(config, sourceValue) {
    return config.fromSourceValue ? config.fromSourceValue(sourceValue) : Number(sourceValue);
  }

  function getSourceValue(config, visibleValue) {
    return config.toSourceValue ? config.toSourceValue(visibleValue) : Number(visibleValue);
  }

  function formatValue(config, visibleValue) {
    const number = Number(visibleValue);
    if (config.kind === "percent") return `${Math.round(number)}%`;
    return `${number.toFixed(2)} s`;
  }

  function updateVisibleControl(config, sourceValue) {
    const input = document.querySelector(`[data-adsr-visible-control="${config.key}"]`);
    if (!input) return;

    const visibleValue = getVisibleValue(config, sourceValue);
    input.value = String(visibleValue);

    const wrapper = input.closest(".adsr-visible-control-wrap");
    const readout = wrapper?.querySelector(".adsr-visible-readout");
    if (readout) readout.textContent = formatValue(config, visibleValue);
  }

  function sendToSource(config, visibleValue) {
    const sourceControl = findSourceControl(config.key);
    if (!sourceControl) return;

    sourceControl.value = String(getSourceValue(config, visibleValue));
    sourceControl.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function addVisibleAdsrControl(config) {
    const faceControl = findAdsrControl(config.label);
    const sourceControl = findSourceControl(config.key);

    if (!faceControl || !sourceControl || faceControl.querySelector(`[data-adsr-visible-control="${config.key}"]`)) {
      return false;
    }

    faceControl.classList.add("is-audio-linked");

    const wrapper = document.createElement("div");
    wrapper.className = "adsr-visible-control-wrap";

    const input = document.createElement("input");
    input.type = "range";
    input.min = config.min;
    input.max = config.max;
    input.step = config.step;
    input.value = String(getVisibleValue(config, sourceControl.value));
    input.dataset.adsrVisibleControl = config.key;
    input.className = "adsr-visible-control";

    const readout = document.createElement("output");
    readout.className = "adsr-visible-readout";
    readout.textContent = formatValue(config, input.value);

    input.addEventListener("input", () => {
      sendToSource(config, input.value);
      updateVisibleControl(config, getSourceValue(config, input.value));
    });

    input.addEventListener("change", () => {
      sendToSource(config, input.value);
      updateVisibleControl(config, getSourceValue(config, input.value));
    });

    wrapper.append(input, readout);
    faceControl.append(wrapper);
    updateVisibleControl(config, sourceControl.value);
    return true;
  }

  function addStyles() {
    if (document.querySelector("#adsr-visible-control-styles")) return;

    const style = document.createElement("style");
    style.id = "adsr-visible-control-styles";
    style.textContent = `
      .adsr-module .adsr-visible-control-wrap {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 4px;
        margin-top: 6px;
      }

      .adsr-visible-control {
        width: 100%;
        min-width: 0;
        accent-color: #d7b884;
      }

      .adsr-visible-readout {
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

  function loadEnvelopeModeBridge() {
    if (document.querySelector('script[src="envelope-mode-visible-controls.js"]')) return;

    const script = document.createElement("script");
    script.src = "envelope-mode-visible-controls.js";
    script.defer = true;
    document.head.append(script);
  }

  function initAdsrVisibleControls() {
    addStyles();

    const sourcePanel = document.querySelector(".audio-voice-panel");
    if (!sourcePanel) {
      window.setTimeout(initAdsrVisibleControls, 50);
      return;
    }

    controls.forEach(addVisibleAdsrControl);

    sourcePanel.addEventListener("input", (event) => {
      const sourceControl = event.target.closest("[data-audio-control]");
      if (!sourceControl) return;

      const config = controls.find((item) => item.key === sourceControl.dataset.audioControl);
      if (!config) return;
      updateVisibleControl(config, sourceControl.value);
    });

    syncFromSourceControls();
    loadEnvelopeModeBridge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdsrVisibleControls);
  } else {
    initAdsrVisibleControls();
  }
})();
