(() => {
  "use strict";

  const CHANNEL_COUNT = 4;
  let meterLevel = 0;

  function audioApi() {
    return window.MerrinLabAudio || null;
  }

  function moduleRoot() {
    return document.querySelector("[data-signal-mixer-module]");
  }

  function engineState() {
    const state = audioApi()?.getState?.();
    return state?.signalMixer || {
      channels: Array.from({ length: CHANNEL_COUNT }, (_entry, index) => ({ channel: index + 1, source: "off", level: 0 })),
      lineOut: "vca",
    };
  }

  function sourceOptions() {
    return audioApi()?.getSignalMixerOptions?.() || [
      { value: "off", label: "Off" },
      { value: "vco1", label: "VCO 1" },
      { value: "vco2", label: "VCO 2" },
      { value: "vco3", label: "VCO 3" },
      { value: "noise", label: "Noise" },
      { value: "mainMixer", label: "Main Mixer" },
      { value: "mainFilter", label: "Main VCF" },
      { value: "mainVca", label: "Main VCA" },
      { value: "auxVca", label: "AUX VCA" },
    ];
  }

  function fillSourceSelectors() {
    const options = sourceOptions();
    for (let channel = 1; channel <= CHANNEL_COUNT; channel += 1) {
      const select = document.querySelector(`[data-signal-mixer-source="${channel}"]`);
      if (!select || select.options.length) continue;
      for (const option of options) {
        const element = document.createElement("option");
        element.value = option.value;
        element.textContent = option.label;
        select.append(element);
      }
    }
  }

  function channelSummary(channel) {
    const option = sourceOptions().find((entry) => entry.value === channel.source);
    if (!channel.source || channel.source === "off" || channel.level <= 0) return "Off";
    return `${option?.label || channel.source} · ${Math.round(channel.level * 100)}%`;
  }

  function updateInterface() {
    const root = moduleRoot();
    if (!root) return;

    fillSourceSelectors();
    const state = engineState();
    for (const channel of state.channels || []) {
      const source = root.querySelector(`[data-signal-mixer-source="${channel.channel}"]`);
      const level = root.querySelector(`[data-signal-mixer-level="${channel.channel}"]`);
      const readout = root.querySelector(`[data-signal-mixer-level-readout="${channel.channel}"]`);
      const route = root.querySelector(`[data-signal-mixer-route="${channel.channel}"]`);
      if (source) source.value = channel.source;
      if (level) level.value = String(Math.round(channel.level * 100));
      if (readout) readout.textContent = `${Math.round(channel.level * 100)}%`;
      if (route) route.textContent = channelSummary(channel);
    }

    const lineOut = root.querySelector("[data-signal-mixer-line-out]");
    if (lineOut) lineOut.value = state.lineOut || "vca";

    const activeChannels = (state.channels || []).filter((channel) => channel.source !== "off" && channel.level > 0).length;
    const status = root.querySelector("[data-signal-mixer-status]");
    if (status) status.textContent = state.lineOut === "mix" ? `MIX · ${activeChannels} active` : "VCA route";
    root.classList.toggle("is-signal-mixer-selected", state.lineOut === "mix");
    root.classList.toggle("is-signal-mixer-active", activeChannels > 0);
  }

  function setChannelSource(channel, value) {
    audioApi()?.setParameter?.(`signalMixerSource${channel}`, value);
    updateInterface();
  }

  function setChannelLevel(channel, value) {
    const normalized = Math.min(1, Math.max(0, Number(value) / 100));
    audioApi()?.setParameter?.(`signalMixerLevel${channel}`, normalized);
    updateInterface();
  }

  function handleControl(event) {
    const source = event.target.closest("[data-signal-mixer-source]");
    if (source) {
      setChannelSource(Number(source.dataset.signalMixerSource), source.value);
      return;
    }

    const level = event.target.closest("[data-signal-mixer-level]");
    if (level) {
      setChannelLevel(Number(level.dataset.signalMixerLevel), level.value);
      return;
    }

    const lineOut = event.target.closest("[data-signal-mixer-line-out]");
    if (lineOut) {
      audioApi()?.setParameter?.("signalMixerLineOut", lineOut.value);
      updateInterface();
    }
  }

  function updateMeter(event) {
    const root = moduleRoot();
    if (!root) return;
    const detail = event.detail || {};
    meterLevel = Math.min(1, Math.max(0, Number(detail.peak) || 0));
    const meter = root.querySelector("[data-signal-mixer-meter]");
    const readout = root.querySelector("[data-signal-mixer-meter-readout]");
    if (meter) meter.value = meterLevel;
    if (readout) {
      if (detail.clipping) readout.textContent = "CLIP";
      else if (meterLevel < 0.01) readout.textContent = "silent";
      else readout.textContent = `${Math.round(meterLevel * 100)}%`;
    }
    root.classList.toggle("is-signal-mixer-clipping", Boolean(detail.clipping));
  }

  function addStyles() {
    if (document.querySelector("#signal-mixer-layer-styles")) return;
    const style = document.createElement("style");
    style.id = "signal-mixer-layer-styles";
    style.textContent = `
      .expander-signal-mixer-module { display: grid; gap: 10px; }
      .expander-signal-mixer-module .module-header { grid-template-columns: auto minmax(0, 1fr) auto; }
      .signal-mixer-status { color: #d6c8b5; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
      .expander-signal-mixer-module.is-signal-mixer-selected .status-light { background: #93d36c; box-shadow: 0 0 10px rgba(147, 211, 108, 0.65); }
      .signal-mixer-path { align-items: center; background: rgba(11, 14, 18, 0.56); border: 1px solid rgba(215, 184, 132, 0.2); border-radius: 8px; color: #bdb1a1; display: flex; font-size: 0.55rem; gap: 5px; justify-content: center; letter-spacing: 0.04em; padding: 6px; text-transform: uppercase; }
      .signal-mixer-path strong { color: #93d36c; font-weight: 800; }
      .signal-mixer-channel-grid { display: grid; gap: 7px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .signal-mixer-channel { border: 1px solid rgba(111, 155, 73, 0.48); border-radius: 12px; display: grid; gap: 6px; min-width: 0; padding: 7px; }
      .signal-mixer-channel-title { color: #eee4d6; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
      .signal-mixer-control { display: grid; gap: 4px; }
      .signal-mixer-control > span { color: #bdb1a1; font-size: 0.55rem; letter-spacing: 0.04em; text-transform: uppercase; }
      .signal-mixer-control select, .signal-mixer-line-out select { background: #211913; border: 1px solid rgba(215, 184, 132, 0.38); border-radius: 999px; color: #f3e8da; font: inherit; font-size: 0.66rem; min-width: 0; padding: 5px 8px; width: 100%; }
      .signal-mixer-control input[type="range"] { accent-color: #d7b884; min-width: 0; width: 100%; }
      .signal-mixer-level-row { align-items: center; display: grid; gap: 5px; grid-template-columns: minmax(0, 1fr) 34px; }
      .signal-mixer-level-row output, .signal-mixer-route { color: #d6c8b5; font-size: 0.58rem; font-variant-numeric: tabular-nums; }
      .signal-mixer-level-row output { text-align: right; }
      .signal-mixer-route { min-height: 1.2em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .signal-mixer-line-out { align-items: center; display: grid; gap: 7px; grid-template-columns: auto minmax(0, 1fr); }
      .signal-mixer-line-out > span { color: #eee4d6; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; }
      .signal-mixer-output-meter { align-items: center; display: grid; gap: 5px; grid-template-columns: auto minmax(0, 1fr) 38px; }
      .signal-mixer-output-meter > span, .signal-mixer-output-meter > output { color: #bdb1a1; font-size: 0.55rem; letter-spacing: 0.04em; text-transform: uppercase; }
      .signal-mixer-output-meter > output { font-variant-numeric: tabular-nums; text-align: right; }
      .signal-mixer-output-meter meter { accent-color: #93d36c; height: 8px; width: 100%; }
      .expander-signal-mixer-module.is-signal-mixer-clipping .signal-mixer-output-meter > output { color: #ff896f; font-weight: 800; }
    `;
    document.head.append(style);
  }

  function init() {
    if (!moduleRoot()) return;
    addStyles();
    fillSourceSelectors();
    updateInterface();
  }

  document.addEventListener("input", handleControl);
  document.addEventListener("change", handleControl);
  document.addEventListener("merrinlab:signal-mixer-meter", updateMeter);
  document.addEventListener("merrinlab:gate-state", () => window.setTimeout(updateInterface, 0));

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
