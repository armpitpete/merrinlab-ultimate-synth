(() => {
  "use strict";

  const state = {
    lag: 0.25,
    sensitivity: 0.65,
    amount: 0,
    envelope: 0,
    baseReverbMix: 0,
    internalUpdate: false,
  };

  let previousConnect = null;
  let analyser = null;
  let analyserData = null;
  let animationId = null;

  function clamp(value, min, max, fallback = min) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function isDestinationNode(node) {
    return Boolean(node && (
      (typeof AudioDestinationNode !== "undefined" && node instanceof AudioDestinationNode) ||
      node.constructor?.name === "AudioDestinationNode"
    ));
  }

  function readReverbMixControl() {
    const control = document.querySelector('[data-reverb-control="mix"]');
    if (!control) return state.baseReverbMix;
    return clamp(control.value, 0, 1, state.baseReverbMix);
  }

  function setReverbMix(value) {
    const mix = clamp(value, 0, 1, 0);
    state.internalUpdate = true;

    document.querySelectorAll('[data-reverb-control="mix"]').forEach((control) => {
      control.value = String(mix);
      control.dispatchEvent(new Event("input", { bubbles: true }));
    });

    state.internalUpdate = false;
  }

  function createEnvelopeTap(context, source) {
    if (analyser && analyser.context === context) return;
    if (!previousConnect) return;

    analyser = context.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.08;
    analyserData = new Float32Array(analyser.fftSize);

    previousConnect.call(source, analyser);
    startEnvelopeLoop();
  }

  function patchConnect() {
    if (!window.AudioNode || window.AudioNode.prototype.__merrinlabEnvelopeFollowerPatched) return;

    previousConnect = window.AudioNode.prototype.connect;

    window.AudioNode.prototype.connect = function connectWithEnvelopeFollower(destination, ...rest) {
      const result = previousConnect.call(this, destination, ...rest);

      try {
        if (isDestinationNode(destination)) {
          createEnvelopeTap(this.context, this);
        }
      } catch (_error) {
        // Envelope follower is optional. The main synth path must keep working.
      }

      return result;
    };

    window.AudioNode.prototype.__merrinlabEnvelopeFollowerPatched = true;
  }

  function calculateRms() {
    if (!analyser || !analyserData) return 0;

    analyser.getFloatTimeDomainData(analyserData);
    let sum = 0;

    for (let i = 0; i < analyserData.length; i += 1) {
      const sample = analyserData[i];
      sum += sample * sample;
    }

    return Math.sqrt(sum / analyserData.length);
  }

  function syncFollowerReadouts() {
    document.querySelectorAll('[data-ef-control="lag"]').forEach((control) => {
      control.value = String(state.lag);
    });

    document.querySelectorAll('[data-ef-control="sensitivity"]').forEach((control) => {
      control.value = String(Math.round(state.sensitivity * 100));
    });

    document.querySelectorAll('[data-ef-control="amount"]').forEach((control) => {
      control.value = String(Math.round(state.amount * 100));
    });

    document.querySelectorAll('[data-ef-readout="lag"]').forEach((readout) => {
      readout.textContent = `${state.lag.toFixed(2)} s`;
    });

    document.querySelectorAll('[data-ef-readout="sensitivity"]').forEach((readout) => {
      readout.textContent = `${Math.round(state.sensitivity * 100)}%`;
    });

    document.querySelectorAll('[data-ef-readout="amount"]').forEach((readout) => {
      readout.textContent = `${Math.round(state.amount * 100)}%`;
    });

    document.querySelectorAll('[data-ef-readout="level"]').forEach((readout) => {
      readout.textContent = `${Math.round(state.envelope * 100)}%`;
    });

    document.querySelectorAll('[data-ef-readout="dynamic-mix"]').forEach((readout) => {
      const dynamicLift = state.envelope * state.amount * 0.75;
      readout.textContent = `+${Math.round(dynamicLift * 100)}%`;
    });

    document.querySelectorAll('.envelope-follower-level-fill').forEach((bar) => {
      bar.style.transform = `scaleX(${clamp(state.envelope, 0, 1, 0)})`;
    });
  }

  function applyDynamicReverb() {
    const dynamicLift = state.envelope * state.amount * 0.75;
    setReverbMix(state.baseReverbMix + dynamicLift);
  }

  function startEnvelopeLoop() {
    if (animationId) return;

    let previousTime = performance.now();

    function tick(now) {
      const dt = Math.max(0.001, (now - previousTime) / 1000);
      previousTime = now;

      const rms = calculateRms();
      const sensitivity = 8 + state.sensitivity * 34;
      const target = clamp(Math.pow(rms * sensitivity, 0.7), 0, 1, 0);
      const lag = clamp(state.lag, 0.02, 1.5, 0.25);
      const coefficient = 1 - Math.exp(-dt / lag);

      state.envelope += (target - state.envelope) * coefficient;
      applyDynamicReverb();
      syncFollowerReadouts();

      animationId = window.requestAnimationFrame(tick);
    }

    animationId = window.requestAnimationFrame(tick);
  }

  function addFollowerControls() {
    const module = document.querySelector(".envelope-follower-module");
    if (!module || module.querySelector('[data-ef-control="lag"]')) return false;

    const lagControl = Array.from(module.querySelectorAll(".control")).find((control) => {
      return control.querySelector(".control-label")?.textContent?.trim() === "Follower Lag";
    });

    if (lagControl) {
      lagControl.classList.add("is-audio-linked");
      const wrapper = document.createElement("div");
      wrapper.className = "ef-control-wrap";
      wrapper.innerHTML = `
        <input type="range" min="0.02" max="1.5" step="0.01" value="0.25" data-ef-control="lag">
        <output class="ef-readout" data-ef-readout="lag">0.25 s</output>
      `;
      lagControl.append(wrapper);
    }

    const controlsGrid = module.querySelector(".control-grid");
    if (controlsGrid && !module.querySelector('[data-ef-control="amount"]')) {
      const sensitivityControl = document.createElement("div");
      sensitivityControl.className = "control is-audio-linked envelope-follower-sensitivity-control";
      sensitivityControl.innerHTML = `
        <div class="control-label">Sensitivity</div>
        <div class="knob knob-large"></div>
        <div class="ef-control-wrap">
          <input type="range" min="0" max="100" step="1" value="65" data-ef-control="sensitivity">
          <output class="ef-readout" data-ef-readout="sensitivity">65%</output>
        </div>
      `;
      controlsGrid.append(sensitivityControl);

      const amountControl = document.createElement("div");
      amountControl.className = "control is-audio-linked envelope-follower-amount-control";
      amountControl.innerHTML = `
        <div class="control-label">Reverb Amt</div>
        <div class="knob knob-large"></div>
        <div class="ef-control-wrap">
          <input type="range" min="0" max="100" step="1" value="0" data-ef-control="amount">
          <output class="ef-readout" data-ef-readout="amount">0%</output>
        </div>
      `;
      controlsGrid.append(amountControl);

      const levelControl = document.createElement("div");
      levelControl.className = "control is-audio-linked envelope-follower-level-control";
      levelControl.innerHTML = `
        <div class="control-label">EF Level</div>
        <div class="envelope-follower-level-meter"><span class="envelope-follower-level-fill"></span></div>
        <output class="ef-readout" data-ef-readout="level">0%</output>
      `;
      controlsGrid.append(levelControl);

      const dynamicControl = document.createElement("div");
      dynamicControl.className = "control is-audio-linked envelope-follower-dynamic-control";
      dynamicControl.innerHTML = `
        <div class="control-label">Reverb Lift</div>
        <div class="mini-display">Dynamic</div>
        <output class="ef-readout" data-ef-readout="dynamic-mix">+0%</output>
      `;
      controlsGrid.append(dynamicControl);
    }

    module.classList.add("is-envelope-follower-active");
    return true;
  }

  function handleFollowerInput(event) {
    const control = event.target.closest("[data-ef-control]");
    if (!control) return;

    const key = control.dataset.efControl;
    if (key === "lag") state.lag = clamp(control.value, 0.02, 1.5, state.lag);
    if (key === "sensitivity") state.sensitivity = clamp(Number(control.value) / 100, 0, 1, state.sensitivity);
    if (key === "amount") state.amount = clamp(Number(control.value) / 100, 0, 1, state.amount);

    syncFollowerReadouts();
  }

  function handleReverbInput(event) {
    const control = event.target.closest('[data-reverb-control="mix"]');
    if (!control || state.internalUpdate) return;

    state.baseReverbMix = clamp(control.value, 0, 1, state.baseReverbMix);
  }

  function addStyles() {
    if (document.querySelector("#envelope-follower-dynamic-modulation-styles")) return;

    const style = document.createElement("style");
    style.id = "envelope-follower-dynamic-modulation-styles";
    style.textContent = `
      .envelope-follower-module.is-envelope-follower-active .status-light {
        background: #93d36c;
        box-shadow: 0 0 10px rgba(147, 211, 108, 0.65);
      }

      .envelope-follower-module .ef-control-wrap {
        display: grid;
        gap: 4px;
        margin-top: 6px;
      }

      .envelope-follower-module input[type="range"] {
        width: 100%;
        accent-color: #d7b884;
      }

      .ef-readout {
        color: #d6c8b5;
        font-size: 0.62rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
      }

      .envelope-follower-level-meter {
        background: rgba(215, 184, 132, 0.16);
        border: 1px solid rgba(215, 184, 132, 0.35);
        border-radius: 999px;
        height: 9px;
        margin-top: 10px;
        overflow: hidden;
        width: 100%;
      }

      .envelope-follower-level-fill {
        background: #93d36c;
        display: block;
        height: 100%;
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform 60ms linear;
        width: 100%;
      }
    `;

    document.head.append(style);
  }

  function initEnvelopeFollower() {
    patchConnect();
    addStyles();
    state.baseReverbMix = readReverbMixControl();

    if (!addFollowerControls()) {
      window.setTimeout(initEnvelopeFollower, 100);
      return;
    }

    syncFollowerReadouts();
  }

  document.addEventListener("input", handleFollowerInput);
  document.addEventListener("change", handleFollowerInput);
  document.addEventListener("input", handleReverbInput);
  document.addEventListener("change", handleReverbInput);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEnvelopeFollower);
  } else {
    initEnvelopeFollower();
  }
})();
