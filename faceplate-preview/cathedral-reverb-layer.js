(() => {
  "use strict";

  function applyReverbControl(event) {
    const control = event.target.closest("[data-reverb-control]");
    if (!control) return;

    const key = control.dataset.reverbControl;
    window.MerrinLabEffectsOutputGraph?.setParameter("reverb", key, Number(control.value));
  }

  function loadRepeatGateLayer() {
    if (document.querySelector('script[src="repeat-gate-led-flash-layer.js"]')) return;
    const script = document.createElement("script");
    script.src = "repeat-gate-led-flash-layer.js";
    script.defer = true;
    document.head.append(script);
  }

  document.addEventListener("input", applyReverbControl);
  document.addEventListener("change", applyReverbControl);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadRepeatGateLayer);
  } else {
    loadRepeatGateLayer();
  }
})();
