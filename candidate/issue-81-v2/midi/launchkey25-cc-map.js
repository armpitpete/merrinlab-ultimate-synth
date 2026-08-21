(() => {
  "use strict";

  window.MerrinLabLaunchkey25CCMap = {
    // Launchkey 25 knob mappings
    cc: {
      21: "vcoLevel",
      22: "vco2Level",
      23: "vco3Level",
      24: "cutoff",
      25: "resonance",
      26: "lfo1Rate",
      27: "lfo1Mod",
      28: "delayMix",
      1: "modWheel",
      64: "sustain"
    },

    mapValue(value, min, max) {
      return min + (Number(value) / 127) * (max - min);
    }
  };
})();
