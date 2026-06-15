(() => {
  "use strict";

  const state = {
    enabled: false,
    bpm: 120,
    intervalId: null,
    timeoutId: null,
  };

  function clamp(value, min, max, fallback = min) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function findRepeatModule() {
    return document.querySelector(".repeat-module");
  }

  function findGateLed() {
    const module = findRepeatModule();
    if (!module) return null;

    const ledControl = Array.from(module.querySelectorAll(".control")).find((control) => {
      return control.querySelector(".control-label")?.textContent?.trim() === "Gate LED";
    });

    return ledControl?.querySelector(".led-light") || null;
  }

  function readRepeatGateEnabled() {
    const visibleControl = document.querySelector('[data-visible-audio-control="repeatGate"]');
    if (visibleControl) return visibleControl.value === "on";

    const sourceControl = document.querySelector('[data-audio-control="repeatGate"]');
    if (sourceControl) return sourceControl.value === "on";

    return false;
  }

  function readRepeatGateBpm() {
    const visibleControl = document.querySelector('[data-visible-audio-control="repeatGateRate"]');
    if (visibleControl) return clamp(visibleControl.value, 6, 720, state.bpm);

    const sourceControl = document.querySelector('[data-audio-control="repeatGateRate"]');
    if (sourceControl) return clamp(Number(sourceControl.value) * 60, 6, 720, state.bpm);

    return state.bpm;
  }

  function setLedLit(lit) {
    const led = findGateLed();
    if (!led) return;
    led.classList.toggle("is-repeat-gate-flash-lit", Boolean(lit));
  }

  function clearTimers() {
    if (state.intervalId !== null) {
      window.clearInterval(state.intervalId);
      state.intervalId = null;
    }

    if (state.timeoutId !== null) {
      window.clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }
  }

  function pulseLed() {
    if (!state.enabled) return;

    const intervalMs = 60000 / clamp(state.bpm, 6, 720, 120);
    const litMs = Math.max(45, Math.min(140, intervalMs * 0.28));

    setLedLit(true);

    if (state.timeoutId !== null) {
      window.clearTimeout(state.timeoutId);
    }

    state.timeoutId = window.setTimeout(() => {
      setLedLit(false);
      state.timeoutId = null;
    }, litMs);
  }

  function restartFlashTimer() {
    clearTimers();
    setLedLit(false);

    if (!state.enabled) return;

    const intervalMs = 60000 / clamp(state.bpm, 6, 720, 120);
    pulseLed();
    state.intervalId = window.setInterval(pulseLed, intervalMs);
  }

  function syncFromControls() {
    const enabled = readRepeatGateEnabled();
    const bpm = readRepeatGateBpm();
    const changed = enabled !== state.enabled || Math.round(bpm) !== Math.round(state.bpm);

    state.enabled = enabled;
    state.bpm = bpm;

    document.body.classList.toggle("is-repeat-gate-led-running", state.enabled);

    const module = findRepeatModule();
    if (module) {
      module.dataset.repeatGateBpm = String(Math.round(state.bpm));
      module.dataset.repeatGateLed = state.enabled ? "running" : "off";
    }

    if (changed) restartFlashTimer();
  }

  function handleControlInput(event) {
    const control = event.target.closest('[data-visible-audio-control="repeatGate"], [data-visible-audio-control="repeatGateRate"], [data-audio-control="repeatGate"], [data-audio-control="repeatGateRate"]');
    if (!control) return;
    window.setTimeout(syncFromControls, 0);
  }

  function addStyles() {
    if (document.querySelector("#repeat-gate-led-flash-styles")) return;

    const style = document.createElement("style");
    style.id = "repeat-gate-led-flash-styles";
    style.textContent = `
      .repeat-module .led-light {
        transition: background 45ms linear, box-shadow 45ms linear, transform 45ms linear;
      }

      .repeat-module .led-light.is-repeat-gate-flash-lit {
        background: #ffcf5d;
        box-shadow:
          0 0 12px rgba(255, 207, 93, 0.95),
          0 0 24px rgba(255, 207, 93, 0.42);
        transform: scale(1.08);
      }

      .repeat-module[data-repeat-gate-led="running"] .module-header .status-light {
        background: #93d36c;
        box-shadow: 0 0 10px rgba(147, 211, 108, 0.65);
      }
    `;

    document.head.append(style);
  }

  function initRepeatGateLedFlash() {
    addStyles();

    if (!findRepeatModule() || !findGateLed()) {
      window.setTimeout(initRepeatGateLedFlash, 100);
      return;
    }

    syncFromControls();
  }

  document.addEventListener("input", handleControlInput, true);
  document.addEventListener("change", handleControlInput, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRepeatGateLedFlash);
  } else {
    initRepeatGateLedFlash();
  }
})();
