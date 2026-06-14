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

  function findFirstEffectModule() {
    return document.querySelector(".delay-module") || document.querySelector(".reverb-module");
  }

  function ensureEffectsSection(afterElement) {
    let effectsSection = document.querySelector(".effects-section-module");
    if (effectsSection) return effectsSection;

    effectsSection = document.createElement("article");
    effectsSection.className = "module effects-section-module compact-source-module";
    effectsSection.innerHTML = `
      <div class="module-header"><span class="status-light"></span><h2>Effects</h2></div>
      <div class="effects-section-grid" aria-label="Delay and Reverb effects"></div>
    `;

    afterElement.insertAdjacentElement("afterend", effectsSection);
    return effectsSection;
  }

  function moveEffectsIntoSection(effectsSection) {
    const effectsGrid = effectsSection.querySelector(".effects-section-grid");
    if (!effectsGrid) return;

    [".delay-module", ".reverb-module"].forEach((selector) => {
      const module = document.querySelector(selector);
      if (!module || module.closest(".effects-section-module")) return;
      module.classList.add("effect-child-module");
      effectsGrid.append(module);
    });
  }

  function placeAdsrInVoiceArea() {
    const arModule = document.querySelector(".ar-module");
    const adsrModule = document.querySelector(".adsr-module");
    const firstEffectModule = findFirstEffectModule();
    if (!arModule || !adsrModule || !firstEffectModule) return false;

    setAdsrMode();

    adsrModule.classList.add("main-envelope-module", "adsr-vertical-module");
    const title = adsrModule.querySelector(".module-header h2");
    if (title) title.textContent = "Envelope";

    firstEffectModule.insertAdjacentElement("beforebegin", adsrModule);
    const effectsSection = ensureEffectsSection(adsrModule);
    moveEffectsIntoSection(effectsSection);

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

      .effects-section-module {
        display: grid;
        gap: 8px;
      }

      .effects-section-module > .module-header .status-light {
        background: #93d36c;
        box-shadow: 0 0 10px rgba(147, 211, 108, 0.48);
      }

      .effects-section-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }

      .effects-section-grid > .module {
        margin: 0;
        min-width: 0;
        width: 100%;
      }

      .effects-section-grid > .module .module-header h2 {
        font-size: 0.78rem;
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

    const ready = placeAdsrInVoiceArea();
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
