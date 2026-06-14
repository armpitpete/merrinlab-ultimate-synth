(() => {
  "use strict";

  const waveOptions = [
    ["sawtooth", "Saw"],
    ["square", "Square"],
    ["triangle", "Triangle"],
    ["sine", "Sine"],
    ["pulse", "Pulse"],
  ];

  const visibleControlConfigs = [
    {
      key: "coarseFreq",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Coarse Freq",
      type: "range",
      min: 55,
      max: 880,
      step: 1,
      unit: "Hz",
    },
    {
      key: "fineCents",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Fine Freq",
      type: "range",
      min: -100,
      max: 100,
      step: 1,
      unit: "cent",
    },
    {
      key: "waveform",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Waveform",
      type: "select",
      options: waveOptions,
    },
    {
      key: "pulseWidth",
      moduleSelector: ".vco-bank .vco-module:first-child",
      label: "Pulse Width %",
      type: "range",
      min: 10,
      max: 90,
      step: 1,
      unit: "%",
    },
    {
      key: "vcoLevel",
      moduleSelector: ".mixer-module",
      label: "VCO 1 Level",
      type: "range",
      min: 0,
      max: 0.7,
      step: 0.01,
      unit: "",
    },
    {
      key: "vco2CoarseFreq",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "Coarse Freq",
      type: "range",
      min: 55,
      max: 880,
      step: 1,
      unit: "Hz",
    },
    {
      key: "vco2FineCents",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "Fine Freq",
      type: "range",
      min: -100,
      max: 100,
      step: 1,
      unit: "cent",
    },
    {
      key: "vco2Waveform",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "Waveform",
      type: "select",
      options: waveOptions,
    },
    {
      key: "vco2PulseWidth",
      moduleSelector: ".vco-bank .vco-module:nth-child(2)",
      label: "Pulse Width %",
      type: "range",
      min: 10,
      max: 90,
      step: 1,
      unit: "%",
    },
    {
      key: "vco2Level",
      moduleSelector: ".mixer-module",
      label: "VCO 2 Level",
      type: "range",
      min: 0,
      max: 0.45,
      step: 0.01,
      unit: "",
    },
    {
      key: "vco3CoarseFreq",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "Coarse Freq",
      type: "range",
      min: 55,
      max: 880,
      step: 1,
      unit: "Hz",
    },
    {
      key: "vco3FineCents",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "Fine Freq",
      type: "range",
      min: -100,
      max: 100,
      step: 1,
      unit: "cent",
    },
    {
      key: "vco3Waveform",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "Waveform",
      type: "select",
      options: waveOptions,
    },
    {
      key: "vco3PulseWidth",
      moduleSelector: ".vco-bank .vco-module:nth-child(3)",
      label: "Pulse Width %",
      type: "range",
      min: 10,
      max: 90,
      step: 1,
      unit: "%",
    },
    {
      key: "vco3Level",
      moduleSelector: ".mixer-module",
      label: "VCO 3 Level",
      type: "range",
      min: 0,
      max: 0.4,
      step: 0.01,
      unit: "",
    },
    {
      key: "whiteNoiseLevel",
      moduleSelector: ".mixer-module",
      label: "White NS Level",
      type: "range",
      min: 0,
      max: 0.35,
      step: 0.005,
      unit: "",
    },
    {
      key: "filterCutoff",
      moduleSelector: ".filter-lp-module",
      label: "Initial Cutoff",
      type: "range",
      min: 80,
      max: 8000,
      step: 1,
      unit: "Hz",
    },
  ];

  function normalizeText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function findControlByLabel(scope, label) {
    if (!scope) return null;

    return Array.from(scope.querySelectorAll(".control")).find((control) => {
      const controlLabel = control.querySelector(".control-label");
      return normalizeText(controlLabel?.textContent) === label;
    }) || null;
  }

  function findSourceControl(key) {
    return document.querySelector(`.audio-voice-panel [data-audio-control="${key}"]`);
  }

  function formatReadout(config, value) {
    if (config.type === "select") {
      const option = config.options.find(([optionValue]) => optionValue === value);
      return option ? option[1] : value;
    }

    const number = Number(value);
    const levelKeys = ["vcoLevel", "vco2Level", "vco3Level", "whiteNoiseLevel"];
    const fineTuneKeys = ["fineCents", "vco2FineCents", "vco3FineCents"];

    if (levelKeys.includes(config.key)) return number.toFixed(2);
    if (fineTuneKeys.includes(config.key)) return `${number.toFixed(0)} ${config.unit}`;
    return `${number.toFixed(0)} ${config.unit}`.trim();
  }

  function updateVisibleControl(config, value) {
    const visibleControl = document.querySelector(`[data-visible-audio-control="${config.key}"]`);
    if (!visibleControl) return;

    visibleControl.value = value;

    const wrapper = visibleControl.closest(".visible-audio-control-wrap");
    const readout = wrapper?.querySelector(".visible-audio-readout");
    if (readout) readout.textContent = formatReadout(config, value);

    if (config.type === "select") {
      const faceSwitch = wrapper?.parentElement?.querySelector(".switch-control");
      if (faceSwitch) faceSwitch.textContent = formatReadout(config, value);
    }
  }

  function sendToExistingAudioControl(config, value) {
    const sourceControl = findSourceControl(config.key);
    if (!sourceControl) return;

    sourceControl.value = value;
    sourceControl.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function createVisibleInput(config, sourceControl) {
    const input = document.createElement(config.type === "select" ? "select" : "input");
    input.dataset.visibleAudioControl = config.key;
    input.className = "visible-audio-control";

    if (config.type === "select") {
      config.options.forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        input.append(option);
      });
    } else {
      input.type = "range";
      input.min = config.min;
      input.max = config.max;
      input.step = config.step;
    }

    input.value = sourceControl.value;

    input.addEventListener("input", () => {
      sendToExistingAudioControl(config, input.value);
      updateVisibleControl(config, input.value);
    });

    input.addEventListener("change", () => {
      sendToExistingAudioControl(config, input.value);
      updateVisibleControl(config, input.value);
    });

    return input;
  }

  function addVisibleControl(config) {
    const module = document.querySelector(config.moduleSelector);
    const control = findControlByLabel(module, config.label);
    const sourceControl = findSourceControl(config.key);

    if (!control || !sourceControl || control.querySelector(`[data-visible-audio-control="${config.key}"]`)) {
      return false;
    }

    control.classList.add("is-audio-linked");

    const wrapper = document.createElement("div");
    wrapper.className = "visible-audio-control-wrap";

    const input = createVisibleInput(config, sourceControl);
    const readout = document.createElement("output");
    readout.className = "visible-audio-readout";
    readout.textContent = formatReadout(config, sourceControl.value);

    wrapper.append(input, readout);
    control.append(wrapper);

    updateVisibleControl(config, sourceControl.value);
    return true;
  }

  function addStyles() {
    if (document.querySelector("#visible-audio-control-styles")) return;

    const style = document.createElement("style");
    style.id = "visible-audio-control-styles";
    style.textContent = `
      .control.is-audio-linked {
        outline: 1px solid rgba(147, 211, 108, 0.45);
        outline-offset: 3px;
        border-radius: 12px;
      }

      .control.is-audio-linked .control-label::after {
        content: " ACTIVE";
        color: #93d36c;
        font-size: 0.58em;
        letter-spacing: 0.08em;
      }

      .visible-audio-control-wrap {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 4px;
        margin-top: 6px;
      }

      .visible-audio-control {
        width: 100%;
        min-width: 0;
        accent-color: #d7b884;
      }

      select.visible-audio-control {
        border: 1px solid rgba(215, 184, 132, 0.38);
        border-radius: 999px;
        padding: 4px 6px;
        background: #211913;
        color: #f3e8da;
        font: inherit;
        font-size: 0.68rem;
      }

      .visible-audio-readout {
        color: #d6c8b5;
        font-size: 0.62rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
      }
    `;

    document.head.append(style);
  }

  function syncFromExistingControls() {
    visibleControlConfigs.forEach((config) => {
      const sourceControl = findSourceControl(config.key);
      if (!sourceControl) return;
      updateVisibleControl(config, sourceControl.value);
    });
  }

  function initVisibleOscillatorControls() {
    addStyles();

    const sourcePanel = document.querySelector(".audio-voice-panel");
    if (!sourcePanel) {
      window.setTimeout(initVisibleOscillatorControls, 50);
      return;
    }

    visibleControlConfigs.forEach(addVisibleControl);

    sourcePanel.addEventListener("input", (event) => {
      const sourceControl = event.target.closest("[data-audio-control]");
      if (!sourceControl) return;

      const config = visibleControlConfigs.find((item) => item.key === sourceControl.dataset.audioControl);
      if (!config) return;
      updateVisibleControl(config, sourceControl.value);
    });

    syncFromExistingControls();
  }

  document.addEventListener("DOMContentLoaded", initVisibleOscillatorControls);
})();
