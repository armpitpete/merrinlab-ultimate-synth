(() => {
  "use strict";

  const envelopeModeKey = "envelopeMode";

  function findSourceControl() {
    return document.querySelector(`.audio-voice-panel [data-audio-control="${envelopeModeKey}"]`);
  }

  function setAdsrMode() {
    const sourceControl = findSourceControl();
    if (!sourceControl) return false;

    sourceControl.value = "adsr";
    sourceControl.dispatchEvent(new Event("input", { bubbles: true }));
    sourceControl.dispatchEvent(new Event("change", { bubbles: true }));

    document.body.dataset.envelopeMode = "adsr";
    document.body.classList.add("is-envelope-mode-adsr");
    document.body.classList.remove("is-envelope-mode-ar");
    return true;
  }

  function placeAdsrInEnvelopePosition() {
    const arModule = document.querySelector(".ar-module");
    const adsrModule = document.querySelector(".adsr-module");
    if (!arModule || !adsrModule) return false;

    setAdsrMode();

    adsrModule.classList.add("main-envelope-module", "adsr-vertical-module");
    const title = adsrModule.querySelector(".module-header h2");
    if (title) title.textContent = "Envelope";

    arModule.insertAdjacentElement("beforebegin", adsrModule);
    arModule.hidden = true;
    arModule.setAttribute("aria-hidden", "true");
    arModule.classList.add("is-hidden-envelope-source");

    return true;
  }

  function addStyles() {
    if (document.querySelector("#adsr-main-envelope-styles")) return;

    const style = document.createElement("style");
    style.id = "adsr-main-envelope-styles";
    style.textContent = `
      .ar-module.is-hidden-envelope-source {
        display: none !important;
      }

      .adsr-module.main-envelope-module {
        display: grid;
        gap: 10px;
      }

      .adsr-module.main-envelope-module .module-header h2::after {
        content: " ADSR";
        color: #93d36c;
        font-size: 0.72em;
        letter-spacing: 0.08em;
      }

      .adsr-module.adsr-vertical-module .adsr-knob-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 8px;
      }

      .adsr-module.adsr-vertical-module .adsr-knob-row .control {
        align-items: center;
        display: grid;
        grid-template-columns: 72px minmax(42px, 58px) minmax(0, 1fr);
        gap: 8px;
        min-width: 0;
      }

      .adsr-module.adsr-vertical-module .adsr-visible-control-wrap {
        margin-top: 0;
      }

      .adsr-module.adsr-vertical-module .adsr-io-row {
        margin-top: 8px;
      }

      .adsr-module.main-envelope-module .status-light {
        background: #93d36c;
        box-shadow: 0 0 10px rgba(147, 211, 108, 0.65);
      }
    `;

    document.head.append(style);
  }

  function initAdsrMainEnvelope() {
    addStyles();

    const sourcePanel = document.querySelector(".audio-voice-panel");
    if (!sourcePanel) {
      window.setTimeout(initAdsrMainEnvelope, 50);
      return;
    }

    const ready = placeAdsrInEnvelopePosition();
    if (!ready) {
      window.setTimeout(initAdsrMainEnvelope, 100);
      return;
    }

    setAdsrMode();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdsrMainEnvelope);
  } else {
    initAdsrMainEnvelope();
  }
})();
