(() => {
  "use strict";

  const state = {
    open: false,
  };

  function findPanel() {
    return document.querySelector(".audio-voice-panel");
  }

  function addStyles() {
    if (document.querySelector("#debug-engine-collapse-styles")) return;

    const style = document.createElement("style");
    style.id = "debug-engine-collapse-styles";
    style.textContent = `
      .debug-engine-panel-toggle {
        align-items: center;
        background: #15120f;
        border: 1px solid rgba(215, 184, 132, 0.28);
        border-radius: 10px;
        color: #f3e8da;
        cursor: pointer;
        display: flex;
        font: inherit;
        gap: 10px;
        justify-content: space-between;
        letter-spacing: 0.04em;
        margin: 10px auto 0;
        max-width: none;
        padding: 8px 12px;
        text-transform: uppercase;
        width: 1680px;
      }

      .debug-engine-panel-toggle:hover,
      .debug-engine-panel-toggle:focus-visible {
        border-color: rgba(215, 184, 132, 0.62);
        outline: none;
      }

      .debug-engine-panel-toggle small {
        color: #a99b88;
        font-size: 0.68rem;
        letter-spacing: 0.02em;
        text-transform: none;
      }

      .audio-voice-panel {
        max-height: 0 !important;
        opacity: 0 !important;
        overflow: hidden !important;
        padding-bottom: 0 !important;
        padding-top: 0 !important;
        pointer-events: none !important;
        transform: translateY(-4px);
        transition: max-height 180ms ease, opacity 180ms ease, transform 180ms ease, padding 180ms ease;
      }

      body.is-debug-engine-panel-open .audio-voice-panel {
        max-height: none !important;
        opacity: 1 !important;
        overflow: visible !important;
        pointer-events: auto !important;
        transform: translateY(0);
      }
    `;

    document.head.append(style);
  }

  function updateButton(button) {
    button.setAttribute("aria-expanded", state.open ? "true" : "false");
    button.innerHTML = state.open
      ? `<span>Hide Debug / Engine Panel</span><small>Temporary First Voice controls</small>`
      : `<span>Show Debug / Engine Panel</span><small>Temporary First Voice controls hidden</small>`;
  }

  function setOpen(open, button) {
    state.open = Boolean(open);
    document.body.classList.toggle("is-debug-engine-panel-open", state.open);
    updateButton(button);
  }

  function installToggle() {
    const panel = findPanel();
    if (!panel) {
      window.setTimeout(installToggle, 100);
      return;
    }

    if (document.querySelector(".debug-engine-panel-toggle")) return;

    panel.setAttribute("aria-label", "Debug and engine panel");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "debug-engine-panel-toggle";
    button.setAttribute("aria-controls", "debug-engine-panel");
    panel.id = "debug-engine-panel";

    button.addEventListener("click", () => {
      setOpen(!state.open, button);
    });

    panel.insertAdjacentElement("beforebegin", button);
    setOpen(false, button);
  }

  function loadDelayUpgradeLayer() {
    if (document.querySelector('script[src="delay-upgrade-layer.js"]')) return;

    const script = document.createElement("script");
    script.src = "delay-upgrade-layer.js";
    script.defer = true;
    document.head.append(script);
  }

  function init() {
    addStyles();
    installToggle();
    loadDelayUpgradeLayer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
