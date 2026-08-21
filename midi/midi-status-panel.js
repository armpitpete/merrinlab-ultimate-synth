(() => {
  "use strict";

  function createMidiPanel() {
    const panel = document.createElement("section");
    panel.className = "midi-status-panel";
    panel.innerHTML = `
      <h2>MerrinLab MIDI</h2>
      <p data-midi-status>Status: ❌ No MIDI device</p>
      <button type="button" data-midi-connect>Connect MIDI</button>
      <p data-midi-device>Device: none</p>
      <p>Channel: 1</p>
      <p>Notes: disabled</p>
      <p>CC: disabled</p>
    `;

    const status = panel.querySelector("[data-midi-status]");
    const device = panel.querySelector("[data-midi-device]");
    const button = panel.querySelector("[data-midi-connect]");

    button.addEventListener("click", async () => {
      if (!navigator.requestMIDIAccess) {
        status.textContent = "Status: ❌ Web MIDI unavailable";
        return;
      }

      const access = await navigator.requestMIDIAccess();
      const inputs = [...access.inputs.values()];
      const launchkey = inputs.find((input) => /launchkey|novation/i.test(input.name || ""));

      if (launchkey) {
        status.textContent = "Status: ✅ MIDI connected";
        device.textContent = `Device: ${launchkey.name}`;
        launchkey.onmidimessage = (event) => {
          window.dispatchEvent(new CustomEvent("merrinlab-midi", { detail: event.data }));
        };
      } else {
        status.textContent = "Status: ❌ No Launchkey detected";
      }
    });

    document.body.append(panel);
  }

  window.addEventListener("DOMContentLoaded", createMidiPanel);
})();
