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
      readout.textContent = `${formatMode(safeMode)} active`;
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
    if (document.querySelector(".envelope-mode-module")) return true;

    const arModule = document.querySelector(".ar-module");
    const adsrModule = document.querySelector(".adsr-module");
    if (!arModule || !adsrModule) return false;

    const sourceControl = findSourceControl();
    if (!sourceControl) return false;

    const modeModule = document.createElement("article");
    modeModule.className = "module envelope-mode-module compact-source-module";
    modeModule.innerHTML = `
      <div class="module-header"><span class="status-light"></span><h2>Envelope Mode</h2></div>
      <div class="envelope-mode-faceplate-body">
        <label class="envelope-mode-field">
          <span>AR / ADSR</span>
        </label>
        <div class="envelope-mode-current">AR active</div>
      </div>
    `;

    const field = modeModule.querySelector(".envelope-mode-field");
    const select = createModeSelect();
    select.value = getModeValue(sourceControl.value);
    field.append(select);

    arModule.insertAdjacentElement("beforebegin", modeModule);
    updateVisibleControls(sourceControl.value);
    return true;
  }

  function addStyles() {
    if (document.querySelector("#envelope-mode-visible-styles")) return;

    const style = document.createElement("style");
    style.id = "envelope-mode-visible-styles";
    style.textContent = `
      .envelope-mode-module {
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

      .ar-module,
      .adsr-module {
        transition: opacity 180ms ease, filter 180ms ease, transform 180ms ease, outline-color 180ms ease;
      }

      body.is-envelope-mode-ar .ar-module,
      body.is-envelope-mode-adsr .adsr-module {
        opacity: 1;
        filter: none;
        transform: translateY(0);
        outline: 1px solid rgba(147, 211, 108, 0.52);
        outline-offset: 4px;
      }

      body.is-envelope-mode-ar .adsr-module,
      body.is-envelope-mode-adsr .ar-module {
        opacity: 0.42;
        filter: saturate(0.6) brightness(0.75);
        transform: scale(0.985);
      }

      body.is-envelope-mode-ar .ar-module .status-light,
      body.is-envelope-mode-adsr .adsr-module .status-light,
      body.is-envelope-mode-ar .envelope-mode-module .status-light,
      body.is-envelope-mode-adsr .envelope-mode-module .status-light {
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
