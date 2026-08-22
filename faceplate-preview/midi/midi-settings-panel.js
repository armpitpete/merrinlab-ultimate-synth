// MerrinLab MIDI settings panel
(() => {
  "use strict";

  const settingsControl = Array.from(document.querySelectorAll(".top-control")).find(control =>
    control.querySelector(".top-label")?.textContent.trim() === "Settings"
  );
  const menuButton = settingsControl?.querySelector(".menu-button");

  if (!settingsControl || !menuButton) return;

  const panel = document.createElement("section");
  panel.className = "midi-settings-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <h3>MerrinLab MIDI</h3>
    <p id="midi-status">Status: ❌ No MIDI device</p>
    <label>Device:</label>
    <select id="midi-device-select"></select>
    <button id="midi-connect" type="button">Connect MIDI</button>
    <p id="midi-device-name">Device: none</p>
    <p id="midi-channel">Channel: 1</p>
    <p>Notes: enabled<br>CC: enabled</p>
  `;
  settingsControl.appendChild(panel);

  const status = panel.querySelector("#midi-status");
  const select = panel.querySelector("#midi-device-select");
  const deviceName = panel.querySelector("#midi-device-name");
  const channel = panel.querySelector("#midi-channel");
  const connect = panel.querySelector("#midi-connect");

  let midiAccess = null;
  let activeInput = null;

  function toggle() {
    panel.hidden = !panel.hidden;
  }

  function populateInputs() {
    select.innerHTML = "";
    if (!midiAccess) return;

    [...midiAccess.inputs.values()]
      .filter(input => input.state !== "disconnected")
      .forEach(input => {
        const option = document.createElement("option");
        option.value = input.id;
        option.textContent = input.name || "Unnamed MIDI input";
        select.appendChild(option);
      });

    const saved = localStorage.getItem("merrinlab-midi-device");
    if (saved && [...select.options].some(o => o.value === saved)) {
      select.value = saved;
    }
  }

  function attachSelectedInput() {
    if (activeInput) activeInput.onmidimessage = null;

    activeInput = midiAccess?.inputs.get(select.value) || null;
    localStorage.setItem("merrinlab-midi-device", select.value || "");

    if (!activeInput) {
      status.textContent = "Status: ❌ No MIDI device";
      deviceName.textContent = "Device: none";
      return;
    }

    activeInput.onmidimessage = event => {
      const data = Array.from(event.data);
      channel.textContent = `Channel: ${(data[0] & 15) + 1}`;
      window.dispatchEvent(new CustomEvent("merrinlab-midi", { detail: data }));
    };

    status.textContent = "Status: ✅ MIDI connected";
    deviceName.textContent = `Device: ${activeInput.name}`;
  }

  async function connectMidi() {
    window.MerrinLabAudio?.start?.();

    if (!navigator.requestMIDIAccess) {
      status.textContent = "Status: ❌ Web MIDI unavailable";
      return;
    }

    try {
      midiAccess = await navigator.requestMIDIAccess();
      populateInputs();
      attachSelectedInput();
      midiAccess.onstatechange = () => {
        populateInputs();
      };
    } catch (error) {
      status.textContent = "Status: ❌ MIDI permission denied";
    }
  }

  menuButton.addEventListener("click", event => {
    event.stopPropagation();
    toggle();
  });

  panel.addEventListener("click", event => event.stopPropagation());
  connect.addEventListener("click", connectMidi);
  select.addEventListener("change", attachSelectedInput);
})();
