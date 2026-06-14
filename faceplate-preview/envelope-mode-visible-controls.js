(() => {
  "use strict";

  const config = {
    key: "envelopeMode",
  };

  const options = [
    ["ar", "AR"],
    ["adsr", "ADSR"],
  ];

  function findSourceControl() {
    return document.querySelector(`.audio-voice-panel [data-audio-control="${config.key}"]`);
  }

  function formatMode(value) {
    const option = options.find(([optionValue]) => optionValue === value);
    return option ? option[1] : "AR";
  }

  function getModeValue(value) {
    return value === "adsr" ? "adsr" : "ar";
  }

  function createModeSelect() {
    const select = document.createElement("select");
    select.className = "envelope-mode-visible-select";
    select.dataset.envelopeModeVisibleControl = config.key;

    options.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.append(option);
    });

    return select;
  }

  function updateMorphState(mode) {
    const safeMode = getModeValue(mode);
    document.body.dataset.envelopeMode = safeMode;
    document.body.classList.toggle("is-envelope-mode-ar", safeMode === "ar");
    document.body.classList.toggle("is-envelope-mode-adsr", safeMode === "adsr");

    document.querySelectorAll(".envelope-mode-current").forEach((readout) => {
      readout.textContent = `${formatMode(safeMode)} controls visible`;
    });
  }

  function updateVisibleControls(sourceValue) {
    const safeMode = getModeValue(sourceValue);

    document.querySelectorAll(`[data-envelope-mode-visible-control="${config.key}"]`).forEach((control) => {
      control.value = safeMode;
    });

    updateMorphState(safeMode);
  }

  function sendToSource(mode) {
    const sourceControl = findSourceControl();
    if (!sourceControl) return;

    const safeMode = getModeValue(mode);
    sourceControl.value = safeMode;
    sourceControl.dispatchEvent(new Event("input", { bubbles: true }));
    sourceControl.dispatchEvent(new Event("change", { bubbles: true }));
    updateVisibleControls(safeMode);
  }

  function addEnvelopeModePanel() {
    if (document.querySelector(".envelope-combined-module")) return true;

    const arModule = document.querySelector(".ar-module");
    const adsrModule = document.querySelector(".adsr-module");
    if (!arModule || !adsrModule) return false;

    const sourceControl = findSourceControl();
    if (!sourceControl) return false;

    const combinedModule = document.createElement("article");
    combinedModule.className = "module envelope-combined-module compact-source-module";
    combinedModule.innerHTML = `
      <div class="module-header"><span class="status-light"></span><h2>Envelope</h2></div>
      <div class="envelope-mode-faceplate-body">
        <label class="envelope-mode-field">
          <span>Mode</span>
        </label>
        <div class="envelope-mode-current">AR controls visible</div>
        <div class="envelope-active-slot" aria-label="Active envelope controls"></div>
      </div>
    `;

    const field = combinedModule.querySelector(".envelope-mode-field");
    const activeSlot = combinedModule.querySelector(".envelope-active-slot");
    const select = createModeSelect();
    select.value = getModeValue(sourceControl.value);
    field.append(select);

    arModule.insertAdjacentElement("beforebegin", combinedModule);
    activeSlot.append(arModule, adsrModule);

    updateVisibleControls(sourceControl.value);
    return true;
  }

  function addStyles() {
    if (document.querySelector("#envelope-mode-visible-styles")) return;

    const style = document.createElement("style");
    style.id = "envelope-mode-visible-styles";
    style.textContent = `
      .envelope-combined-module {
        display: grid;
        gap: 10px;
        transition: box-shadow 180ms ease, opacity 180ms ease, transform 180ms ease;
      }

      .envelope-mode-faceplate-body {
        display: grid;
        gap: 8px;
      }

      .envelope-mode-field {
        display: grid;
        gap: 5px;
        color: #d6c8b5;
        font-size: 0.7rem;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }

      .envelope-mode-visible-select {
        border: 1px solid rgba(215, 184, 132, 0.38);
        border-radius: 999px;
        padding: 5px 8px;
        background: #211913;
        color: #f3e8da;
        font: inherit;
        font-size: 0.75rem;
        width: 100%;
      }

      .envelope-mode-current {
        color: #93d36c;
        font-size: 0.68rem;
        letter-spacing: 0.06em;
        text-align: center;
        text-transform: uppercase;
      }

      .envelope-active-slot {
        display: grid;
        min-width: 0;
      }

      .envelope-active-slot > .ar-module,
      .envelope-active-slot > .adsr-module {
        width: 100%;
        margin: 0;
        min-width: 0;
        transition: opacity 140ms ease, transform 140ms ease;
      }

      body.is-envelope-mode-ar .envelope-active-slot > .ar-module,
      body.is-envelope-mode-adsr .envelope-active-slot > .adsr-module {
        display: grid;
        opacity: 1;
        transform: translateY(0);
      }

      body.is-envelope-mode-ar .envelope-active-slot > .adsr-module,
      body.is-envelope-mode-adsr .envelope-active-slot > .ar-module {
        display: none !important;
      }

      body.is-envelope-mode-ar .envelope-active-slot > .ar-module .status-light,
      body.is-envelope-mode-adsr .envelope-active-slot > .adsr-module .status-light,
      body.is-envelope-mode-ar .envelope-combined-module > .module-header .status-light,
      body.is-envelope-mode-adsr .envelope-combined-module > .module-header .status-light {
        background: #93d36c;
        box-shadow: 0 0 10px rgba(147, 211, 108, 0.65);
      }
    `;

    document.head.append(style);
  }

  function handleModeInput(event) {
    const control = event.target.closest("[data-envelope-mode-visible-control]");
    if (!control) return;
    sendToSource(control.value);
  }

  function initEnvelopeModeBridge() {
    addStyles();

    const sourcePanel = document.querySelector(".audio-voice-panel");
    if (!sourcePanel) {
      window.setTimeout(initEnvelopeModeBridge, 50);
      return;
    }

    const panelReady = addEnvelopeModePanel();
    if (!panelReady) {
      window.setTimeout(initEnvelopeModeBridge, 100);
      return;
    }

    const sourceControl = findSourceControl();
    if (sourceControl) updateVisibleControls(sourceControl.value);

    sourcePanel.addEventListener("input", (event) => {
      const source = event.target.closest('[data-audio-control="envelopeMode"]');
      if (!source) return;
      updateVisibleControls(source.value);
    });

    sourcePanel.addEventListener("change", (event) => {
      const source = event.target.closest('[data-audio-control="envelopeMode"]');
      if (!source) return;
      updateVisibleControls(source.value);
    });
  }

  document.addEventListener("input", handleModeInput);
  document.addEventListener("change", handleModeInput);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEnvelopeModeBridge);
  } else {
    initEnvelopeModeBridge();
  }
})();
