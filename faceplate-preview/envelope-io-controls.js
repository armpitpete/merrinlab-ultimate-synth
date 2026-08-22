(() => {
  "use strict";

  let manualGateOpen = false;

  function updateGateState(gated) {
    manualGateOpen = Boolean(gated);
    const gateButton = document.querySelector("[data-adsr-manual-gate]");
    const output = document.querySelector("[data-adsr-output]");
    if (gateButton) {
      gateButton.textContent = manualGateOpen ? "Gate Off" : "Gate On";
      gateButton.setAttribute("aria-pressed", String(manualGateOpen));
    }
    if (output) output.textContent = manualGateOpen ? "1.00 CV" : "0.00 CV";
  }

  async function toggleManualGate(event) {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      if (manualGateOpen) window.MerrinLabAudio?.gateOff?.();
      else await window.MerrinLabAudio?.gateOn?.();
    } finally {
      button.disabled = false;
    }
  }

  async function triggerEnvelope(event) {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      await window.MerrinLabAudio?.trigger?.();
    } finally {
      window.setTimeout(() => { button.disabled = false; }, 100);
    }
  }

  function init() {
    document.querySelector("[data-adsr-manual-gate]")?.addEventListener("click", toggleManualGate);
    document.querySelector("[data-adsr-trigger]")?.addEventListener("click", triggerEnvelope);
    updateGateState(document.body.classList.contains("is-audio-gated"));
  }

  document.addEventListener("merrinlab:gate-state", (event) => updateGateState(event.detail?.gated));
  document.addEventListener("DOMContentLoaded", init);
})();
