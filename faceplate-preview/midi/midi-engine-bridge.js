// MerrinLab MIDI engine bridge
(() => {
  "use strict";

  const ccMap = {
    21: ["vcoLevel", 0, 0.7],
    22: ["vco2Level", 0, 0.45],
    23: ["vco3Level", 0, 0.4],
    24: ["cutoff", 120, 6500],
    25: ["resonance", 0.1, 12, "curve"],
    26: ["lfo1Rate", 0.05, 12],
    27: ["lfo1Mod", 0, 1],
    28: ["delayMix", 0, 1]
  };

  let warnedMissingAudioApi = false;

  function getAudioApi() {
    const audio = window.MerrinLabAudio;
    if (!audio && !warnedMissingAudioApi) {
      warnedMissingAudioApi = true;
      console.error("MerrinLab MIDI: audio engine API unavailable");
    }
    return audio;
  }

  function mapCcValue(cc, value) {
    const mapping = ccMap[cc];
    if (!mapping) return null;

    const [key, min, max, curve] = mapping;
    const normalized = Math.max(0, Math.min(127, value)) / 127;
    const scaled = curve === "curve" ? Math.pow(normalized, 2) : normalized;
    return [key, min + scaled * (max - min)];
  }

  window.addEventListener("merrinlab-midi", event => {
    const [status, data1, data2] = event.detail;
    const command = status & 0xf0;
    const channel = (status & 0x0f) + 1;
    const audio = getAudioApi();
    if (!audio) return;

    if (command === 0x90 && data2 > 0) {
      audio.noteOn(data1, data2, channel);
      window.dispatchEvent(new CustomEvent("merrinlab-midi-note", {
        detail: { type: "noteon", note: data1, velocity: data2, channel }
      }));
      return;
    }

    if (command === 0x80 || (command === 0x90 && data2 === 0)) {
      audio.noteOff(data1, channel);
      window.dispatchEvent(new CustomEvent("merrinlab-midi-note", {
        detail: { type: "noteoff", note: data1, channel }
      }));
      return;
    }

    if (command === 0xb0) {
      const mapped = mapCcValue(data1, data2);
      if (mapped) audio.setParameter(mapped[0], mapped[1]);
      return;
    }

    if (command === 0xe0) {
      const rawValue = ((data2 << 7) | data1) - 8192;
      audio.pitchBend(rawValue, channel);
    }
  });
})();
