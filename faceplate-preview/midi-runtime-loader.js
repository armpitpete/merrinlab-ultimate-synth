(() => {
  "use strict";

  const modules = [
    "midi/launchkey25.js",
    "midi/midi-engine-bridge.js",
    "midi/midi-settings-panel.js"
  ];

  function loadModule(index) {
    if (index >= modules.length) return;

    const src = modules[index];
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      loadModule(index + 1);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = () => loadModule(index + 1);
    script.onerror = () => {
      console.error(`MerrinLab MIDI: failed to load ${src}`);
    };
    document.head.appendChild(script);
  }

  loadModule(0);
})();
