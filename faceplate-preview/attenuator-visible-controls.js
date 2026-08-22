(() => {
  "use strict";

  const CHANNEL_COUNT = 6;

  function formatSignedPercent(value) {
    const percent = Math.round(Number(value) * 100);
    return `${percent >= 0 ? "+" : ""}${percent}%`;
  }

  function updateChannel(module, state) {
    const input = module.querySelector(`[data-attenuator-input="${state.channel}"]`);
    const amount = module.querySelector(`[data-attenuator-amount="${state.channel}"]`);
    const inputReadout = module.querySelector(`[data-attenuator-input-readout="${state.channel}"]`);
    const amountReadout = module.querySelector(`[data-attenuator-amount-readout="${state.channel}"]`);
    const outputReadout = module.querySelector(`[data-attenuator-output="${state.channel}"]`);

    if (input) input.value = String(Math.round(state.input * 100));
    if (amount) amount.value = String(Math.round(state.amount * 100));
    if (inputReadout) inputReadout.textContent = formatSignedPercent(state.input);
    if (amountReadout) amountReadout.textContent = `${Math.round(state.amount * 100)}%`;
    if (outputReadout) outputReadout.textContent = formatSignedPercent(state.output);

    const channel = module.querySelector(`[data-attenuator-channel="${state.channel}"]`);
    channel?.classList.toggle("is-attenuating", Math.abs(state.input) > 0.0001 && state.amount < 0.9999);
    const hasSignal = window.MerrinLabAttenuators.getState().some((item) => Math.abs(item.input) > 0.0001);
    module.classList.toggle("is-processing", hasSignal);
  }

  function initAttenuators() {
    const module = document.querySelector(".attenuators-module");
    const bank = window.MerrinLabAttenuators;
    if (!module || !bank) return;

    bank.subscribe((state) => updateChannel(module, state));

    module.addEventListener("input", (event) => {
      const input = event.target.closest("[data-attenuator-input]");
      if (input) {
        bank.setInput(input.dataset.attenuatorInput, Number(input.value) / 100);
        return;
      }

      const amount = event.target.closest("[data-attenuator-amount]");
      if (amount) bank.setAmount(amount.dataset.attenuatorAmount, Number(amount.value) / 100);
    });

    module.addEventListener("change", (event) => {
      const control = event.target.closest("[data-attenuator-input], [data-attenuator-amount]");
      if (control) control.dispatchEvent(new Event("input", { bubbles: true }));
    });

    for (let channel = 1; channel <= CHANNEL_COUNT; channel += 1) {
      updateChannel(module, bank.getChannel(channel));
    }
  }

  document.addEventListener("DOMContentLoaded", initAttenuators);
})();
