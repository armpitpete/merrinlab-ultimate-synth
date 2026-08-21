(() => {
  "use strict";

  function createMidiPanel() {
    const settingsButton = document.querySelector('.menu-button');
    if (!settingsButton) return;

    const panel = document.createElement('div');
    panel.className = 'midi-settings-panel';
    panel.hidden = true;
    panel.innerHTML = `
      <div class="midi-title">MerrinLab MIDI</div>
      <div class="midi-status">Status: ❌ No MIDI device</div>
      <button class="midi-connect">Connect MIDI</button>
      <div class="midi-device">Device: none</div>
      <div>Channel: 1</div>
      <div>Notes: enabled</div>
      <div>CC: enabled</div>
    `;

    settingsButton.parentElement.appendChild(panel);

    settingsButton.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
    });

    const status = panel.querySelector('.midi-status');
    const device = panel.querySelector('.midi-device');

    panel.querySelector('.midi-connect').addEventListener('click', async () => {
      if (!navigator.requestMIDIAccess) {
        status.textContent = 'Status: ❌ Web MIDI unavailable';
        return;
      }

      const access = await navigator.requestMIDIAccess();
      const inputs = [...access.inputs.values()];

      if (!inputs.length) {
        status.textContent = 'Status: ❌ No MIDI device';
        return;
      }

      const input = inputs[0];
      status.textContent = 'Status: ✅ MIDI connected';
      device.textContent = `Device: ${input.name || 'Unknown MIDI device'}`;
    });
  }

  window.addEventListener('DOMContentLoaded', createMidiPanel);
})();
