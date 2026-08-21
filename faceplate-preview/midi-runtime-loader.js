(() => {
  "use strict";

  const modules = [
    "midi/midi-settings-panel.js",
    "midi/midi-engine-bridge.js",
    "midi/launchkey25.js"
  ];

  modules.forEach((src) => {
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      document.head.appendChild(script);
    }
  });
})();
