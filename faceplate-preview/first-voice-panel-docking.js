(() => {
  "use strict";

  const delayTimeRange = {
    min: 0.05,
    max: 2,
  };

  let patchedDelayNodes = [];
  let requestedDelayTime = 0.25;
  let refreshTimerId = null;

  function dockFirstVoicePanel() {
    if (document.querySelector("#first-voice-panel-docking-styles")) return;

    const style = document.createElement("style");
    style.id = "first-voice-panel-docking-styles";
    style.textContent = `
      .audio-voice-panel {
        position: static !important;
        width: 1680px !important;
        max-width: none !important;
        max-height: none !important;
        overflow: visible !important;
        margin: 12px auto !important;
      }
    `;

    document.head.append(style);
  }

  function clampDelayTime(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return requestedDelayTime;
    return Math.min(delayTimeRange.max, Math.max(delayTimeRange.min, number));
  }

  function patchCreateDelayMaxTime() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass || AudioContextClass.prototype.__merrinlabDelay2sPatched) return;

    const originalCreateDelay = AudioContextClass.prototype.createDelay;

    AudioContextClass.prototype.createDelay = function createDelayWithTwoSecondHeadroom(maxDelayTime) {
      const safeMaxDelayTime = Math.max(Number(maxDelayTime) || 0, delayTimeRange.max);
      const delayNode = originalCreateDelay.call(this, safeMaxDelayTime);
      patchedDelayNodes.push(delayNode);
      return delayNode;
    };

    AudioContextClass.prototype.__merrinlabDelay2sPatched = true;
  }

  function applyRequestedDelayTime() {
    patchedDelayNodes = patchedDelayNodes.filter((delayNode) => delayNode?.delayTime);

    patchedDelayNodes.forEach((delayNode) => {
      try {
        const now = delayNode.context?.currentTime || 0;
        delayNode.delayTime.cancelScheduledValues(now);
        delayNode.delayTime.setTargetAtTime(requestedDelayTime, now, 0.03);
      } catch (_error) {
        // Delay range extension is best-effort if a node has already been stopped.
      }
    });
  }

  function updateDelayTimeReadouts() {
    const formatted = `${requestedDelayTime.toFixed(2)} s`;

    document.querySelectorAll('[data-audio-readout="delayTime"]').forEach((readout) => {
      readout.textContent = formatted;
    });

    document.querySelectorAll('[data-visible-audio-control="delayTime"]').forEach((control) => {
      const wrapper = control.closest(".visible-audio-control-wrap");
      const readout = wrapper?.querySelector(".visible-audio-readout");
      if (readout) readout.textContent = formatted;
    });
  }

  function forceDelayTimeControlRange(control) {
    control.min = String(delayTimeRange.min);
    control.max = String(delayTimeRange.max);
    control.step = "0.01";

    if (control.dataset.visibleAudioControl === "delayTime") {
      control.title = "Delay Time: 0.05 s to 2.00 s";
    }

    if (control.dataset.audioControl === "delayTime") {
      control.title = "Delay Time: 0.05 s to 2.00 s";
    }
  }

  function updateDelayTimeInputs() {
    document.querySelectorAll('[data-audio-control="delayTime"], [data-visible-audio-control="delayTime"]').forEach(forceDelayTimeControlRange);
    updateDelayTimeReadouts();
  }

  function handleDelayControlInput(event) {
    const control = event.target.closest('[data-audio-control], [data-visible-audio-control]');
    if (!control) return;

    const key = control.dataset.audioControl || control.dataset.visibleAudioControl;

    if (key === "delayTime") {
      requestedDelayTime = clampDelayTime(control.value);
      control.value = String(requestedDelayTime);

      window.setTimeout(() => {
        updateDelayTimeInputs();
        applyRequestedDelayTime();
      }, 0);
      return;
    }

    if (key === "delayMix" || key === "delayFeedback") {
      window.setTimeout(applyRequestedDelayTime, 0);
    }
  }

  function startDelayRangeRefreshLoop() {
    if (refreshTimerId !== null) return;

    let refreshCount = 0;
    refreshTimerId = window.setInterval(() => {
      updateDelayTimeInputs();
      refreshCount += 1;

      if (refreshCount >= 80) {
        window.clearInterval(refreshTimerId);
        refreshTimerId = null;
      }
    }, 250);
  }

  function extendDelayTimeRange() {
    patchCreateDelayMaxTime();
    updateDelayTimeInputs();
    startDelayRangeRefreshLoop();

    document.addEventListener("input", handleDelayControlInput, true);
    document.addEventListener("change", handleDelayControlInput, true);

    const observer = new MutationObserver(() => {
      updateDelayTimeInputs();
      startDelayRangeRefreshLoop();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    dockFirstVoicePanel();
    extendDelayTimeRange();
  });
})();
