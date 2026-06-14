(() => {
  "use strict";

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

  document.addEventListener("DOMContentLoaded", dockFirstVoicePanel);
})();
