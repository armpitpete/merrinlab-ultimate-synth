(() => {
  "use strict";

  if (window.__merrinlabUltimateModCv1Bridge) return;
  window.__merrinlabUltimateModCv1Bridge = true;

  const CHANNEL = "merrinlab-patch-bus";
  const PROTOCOL = "merrinlab.patch.v0.1";
  const SEQUENCER_SOURCE = "merrinlab-16-step-sequencer";
  const LANE = 1;
  const LANE_ID = "mod-cv-1";
  const SOURCE_ID = "merrinlab-16-step-sequencer.mod-cv-1";
  const CUTOFF_MIN = 120;
  const CUTOFF_MAX = 6500;
  const MAX_OFFSET_HZ = 1800;

  const state = {
    incoming: 0,
    depth: 0,
    baseCutoff: null,
    appliedCutoff: null,
    lastStep: null,
    lastBank: null,
    lastEvent: "WAITING",
    lastFingerprint: null,
  };

  let sourceCutoff = null;
  let sourceReadout = null;
  let visibleCutoff = null;
  let visibleReadout = null;
  let bridgeUi = null;
  let applying = false;
  let retryCount = 0;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const finite = (value) => Number.isFinite(Number(value));
  const formatCv = (value) => `${value >= 0 ? "+" : ""}${Number(value).toFixed(2)}`;
  const formatHz = (value) => `${Math.round(Number(value) || 0)} Hz`;

  function readControls() {
    sourceCutoff = document.querySelector('.audio-voice-panel [data-audio-control="cutoff"]');
    sourceReadout = document.querySelector('.audio-voice-panel [data-audio-readout="cutoff"]');
    visibleCutoff = document.querySelector('[data-visible-audio-control="cutoff"]');
    visibleReadout = visibleCutoff?.closest('.visible-audio-control-wrap')?.querySelector('.visible-audio-readout') || null;

    if (sourceCutoff && state.baseCutoff === null) {
      state.baseCutoff = clamp(Number(sourceCutoff.value) || 900, CUTOFF_MIN, CUTOFF_MAX);
      state.appliedCutoff = state.baseCutoff;
    }

    return Boolean(sourceCutoff);
  }

  function calculateAppliedCutoff() {
    const base = clamp(Number(state.baseCutoff) || 900, CUTOFF_MIN, CUTOFF_MAX);
    const headroom = Math.min(base - CUTOFF_MIN, CUTOFF_MAX - base);
    const safeSpan = Math.max(0, Math.min(MAX_OFFSET_HZ, headroom));
    const offset = clamp(state.incoming, -1, 1) * clamp(state.depth, 0, 1) * safeSpan;
    return clamp(base + offset, CUTOFF_MIN, CUTOFF_MAX);
  }

  function restoreBaseReadouts() {
    if (state.baseCutoff === null) return;
    const base = clamp(state.baseCutoff, CUTOFF_MIN, CUTOFF_MAX);

    if (sourceCutoff) sourceCutoff.value = String(base);
    if (sourceReadout) sourceReadout.textContent = formatHz(base);
    if (visibleCutoff) visibleCutoff.value = String(base);
    if (visibleReadout) visibleReadout.textContent = formatHz(base);
  }

  function applyCurrentModulation() {
    if (!readControls() || state.baseCutoff === null) return;

    const applied = calculateAppliedCutoff();
    state.appliedCutoff = applied;

    applying = true;
    try {
      sourceCutoff.value = String(applied);
      sourceCutoff.dispatchEvent(new Event("input", { bubbles: true }));
    } finally {
      applying = false;
      restoreBaseReadouts();
    }

    syncUi();
  }

  function recordBaseCutoff(value) {
    if (applying || !finite(value)) return;
    state.baseCutoff = clamp(Number(value), CUTOFF_MIN, CUTOFF_MAX);
    window.requestAnimationFrame(applyCurrentModulation);
  }

  function installCutoffObservers() {
    if (!readControls()) return false;

    if (!sourceCutoff.dataset.modCvBridgeObserved) {
      sourceCutoff.dataset.modCvBridgeObserved = "true";
      sourceCutoff.addEventListener("input", () => recordBaseCutoff(sourceCutoff.value));
      sourceCutoff.addEventListener("change", () => recordBaseCutoff(sourceCutoff.value));
    }

    if (visibleCutoff && !visibleCutoff.dataset.modCvBridgeObserved) {
      visibleCutoff.dataset.modCvBridgeObserved = "true";
      visibleCutoff.addEventListener("input", () => recordBaseCutoff(visibleCutoff.value));
      visibleCutoff.addEventListener("change", () => recordBaseCutoff(visibleCutoff.value));
    }

    return true;
  }

  function addStyles() {
    if (document.querySelector("#merrinlab-mod-cv1-bridge-styles")) return;
    const style = document.createElement("style");
    style.id = "merrinlab-mod-cv1-bridge-styles";
    style.textContent = `
      .merrinlab-mod-cv1-bridge {
        margin: 8px 10px 10px;
        padding: 9px;
        border: 1px solid rgba(155, 120, 205, 0.52);
        border-radius: 10px;
        background: rgba(36, 24, 49, 0.55);
      }
      .merrinlab-mod-cv1-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 7px;
        color: #efe5ff;
        font-size: 0.66rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .merrinlab-mod-cv1-head output { color: #cfaeff; }
      .merrinlab-mod-cv1-depth {
        display: grid;
        grid-template-columns: 48px minmax(80px, 1fr) 44px;
        align-items: center;
        gap: 7px;
        color: #d7cce3;
        font-size: 0.66rem;
      }
      .merrinlab-mod-cv1-depth input { width: 100%; accent-color: #b88ce8; }
      .merrinlab-mod-cv1-depth output { text-align: right; font-variant-numeric: tabular-nums; }
      .merrinlab-mod-cv1-monitor {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 5px;
        margin-top: 7px;
      }
      .merrinlab-mod-cv1-monitor div {
        padding: 5px;
        border: 1px solid rgba(215, 184, 132, 0.16);
        border-radius: 7px;
        background: rgba(0,0,0,.16);
      }
      .merrinlab-mod-cv1-monitor span { display: block; color: #aa9bb8; font-size: .54rem; text-transform: uppercase; }
      .merrinlab-mod-cv1-monitor strong { display: block; margin-top: 2px; color: #f1e8fa; font-size: .64rem; font-variant-numeric: tabular-nums; }
      .merrinlab-mod-cv1-actions { display: flex; gap: 6px; margin-top: 7px; }
      .merrinlab-mod-cv1-actions button {
        border: 1px solid rgba(184, 140, 232, .48);
        border-radius: 999px;
        padding: 4px 8px;
        background: #281b32;
        color: #f1e8fa;
        font: inherit;
        font-size: .6rem;
        cursor: pointer;
      }
      @media (max-width: 900px) { .merrinlab-mod-cv1-monitor { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    `;
    document.head.append(style);
  }

  function createUi() {
    if (bridgeUi) return true;
    const filterModule = document.querySelector(".filter-lp-module");
    if (!filterModule) return false;

    addStyles();
    bridgeUi = document.createElement("section");
    bridgeUi.className = "merrinlab-mod-cv1-bridge";
    bridgeUi.setAttribute("aria-label", "MerrinLab Mod CV 1 to VCLPF bridge");
    bridgeUi.innerHTML = `
      <div class="merrinlab-mod-cv1-head"><span>Patch Bus → VCLPF · Mod CV 1</span><output data-modcv-status>WAITING</output></div>
      <label class="merrinlab-mod-cv1-depth"><span>Depth</span><input type="range" min="0" max="100" step="1" value="0" data-modcv-depth><output data-modcv-depth-readout>0%</output></label>
      <div class="merrinlab-mod-cv1-monitor">
        <div><span>Incoming</span><strong data-modcv-in>+0.00</strong></div>
        <div><span>Step</span><strong data-modcv-step>—</strong></div>
        <div><span>Base cutoff</span><strong data-modcv-base>—</strong></div>
        <div><span>Applied cutoff</span><strong data-modcv-applied>—</strong></div>
      </div>
      <div class="merrinlab-mod-cv1-actions"><button type="button" data-modcv-clear>Clear input</button></div>
    `;

    const controlRow = filterModule.querySelector(".lowpass-control-row");
    if (controlRow) controlRow.insertAdjacentElement("afterend", bridgeUi);
    else filterModule.append(bridgeUi);

    bridgeUi.querySelector("[data-modcv-depth]").addEventListener("input", (event) => {
      state.depth = clamp(Number(event.target.value) / 100, 0, 1);
      applyCurrentModulation();
    });

    bridgeUi.querySelector("[data-modcv-clear]").addEventListener("click", () => {
      state.incoming = 0;
      state.lastStep = null;
      state.lastBank = null;
      state.lastEvent = "CLEARED";
      applyCurrentModulation();
    });

    syncUi();
    return true;
  }

  function syncUi() {
    if (!bridgeUi) return;
    const depth = Math.round(clamp(state.depth, 0, 1) * 100);
    const depthInput = bridgeUi.querySelector("[data-modcv-depth]");
    if (depthInput) depthInput.value = String(depth);
    bridgeUi.querySelector("[data-modcv-depth-readout]").textContent = `${depth}%`;
    bridgeUi.querySelector("[data-modcv-in]").textContent = formatCv(state.incoming);
    bridgeUi.querySelector("[data-modcv-step]").textContent = state.lastStep ? `${String(state.lastStep).padStart(2, "0")}${state.lastBank ? ` · ${state.lastBank}` : ""}` : "—";
    bridgeUi.querySelector("[data-modcv-base]").textContent = state.baseCutoff === null ? "—" : formatHz(state.baseCutoff);
    bridgeUi.querySelector("[data-modcv-applied]").textContent = state.appliedCutoff === null ? "—" : formatHz(state.appliedCutoff);
    bridgeUi.querySelector("[data-modcv-status]").textContent = state.lastEvent;
  }

  function validMessage(message) {
    const payload = message?.payload;
    return Boolean(
      message &&
      message.protocol === PROTOCOL &&
      message.source === SEQUENCER_SOURCE &&
      message.type === "mod-cv" &&
      payload &&
      Number(payload.lane) === LANE &&
      payload.laneId === LANE_ID &&
      payload.sourceId === SOURCE_ID &&
      finite(payload.value)
    );
  }

  function fingerprint(message) {
    const payload = message.payload || {};
    return [message.time, payload.step, payload.value, payload.bank].join("|");
  }

  function handleMessage(message) {
    if (!validMessage(message)) return;
    const id = fingerprint(message);
    if (id === state.lastFingerprint) return;
    state.lastFingerprint = id;

    const payload = message.payload;
    state.incoming = clamp(Number(payload.value), -1, 1);
    state.lastStep = Number.isInteger(Number(payload.step)) ? Number(payload.step) : null;
    state.lastBank = typeof payload.bank === "string" ? payload.bank : null;
    state.lastEvent = "RECEIVED";
    applyCurrentModulation();
  }

  function init() {
    const controlsReady = installCutoffObservers();
    const uiReady = createUi();

    if ((!controlsReady || !uiReady) && retryCount < 80) {
      retryCount += 1;
      window.setTimeout(init, 75);
      return;
    }

    applyCurrentModulation();
  }

  let channel = null;
  if ("BroadcastChannel" in window) {
    try {
      channel = new BroadcastChannel(CHANNEL);
      channel.addEventListener("message", (event) => handleMessage(event.data));
    } catch (_error) {
      channel = null;
    }
  }

  window.addEventListener(CHANNEL, (event) => handleMessage(event.detail));

  window.MerrinLabUltimateModCV1 = {
    contract: {
      protocol: PROTOCOL,
      channel: CHANNEL,
      source: SEQUENCER_SOURCE,
      lane: LANE,
      laneId: LANE_ID,
      sourceId: SOURCE_ID,
    },
    clear() {
      state.incoming = 0;
      state.lastStep = null;
      state.lastBank = null;
      state.lastEvent = "CLEARED";
      applyCurrentModulation();
    },
    setDepth(value) {
      state.depth = clamp(Number(value), 0, 1);
      applyCurrentModulation();
      return state.depth;
    },
    snapshot() {
      return { ...state };
    },
    channelAvailable: Boolean(channel),
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
