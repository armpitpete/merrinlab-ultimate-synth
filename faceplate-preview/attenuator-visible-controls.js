(() => {
  "use strict";

  const CHANNEL_COUNT = 6;

  function populateOptions(select, options) {
    if (!select || select.options.length) return;
    options.forEach(({ value, label }) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.append(option);
    });
  }

  function optionLabel(select, value) {
    return Array.from(select?.options || []).find((option) => option.value === value)?.textContent || value;
  }

  function updateChannel(module, state) {
    const source = module.querySelector(`[data-attenuator-source="${state.channel}"]`);
    const amount = module.querySelector(`[data-attenuator-amount="${state.channel}"]`);
    const amountReadout = module.querySelector(`[data-attenuator-amount-readout="${state.channel}"]`);
    const destination = module.querySelector(`[data-attenuator-destination="${state.channel}"]`);
    const routeReadout = module.querySelector(`[data-attenuator-route="${state.channel}"]`);

    if (source) source.value = state.source;
    if (amount) amount.value = String(Math.round(state.amount * 100));
    if (amountReadout) amountReadout.textContent = `${Math.round(state.amount * 100)}%`;
    if (destination) destination.value = state.destination;

    const active = state.source !== "off" && state.destination !== "off" && Math.abs(state.amount) > 0.0001;
    if (routeReadout) {
      routeReadout.textContent = active
        ? `${optionLabel(source, state.source)} → ${optionLabel(destination, state.destination)}`
        : "Route off";
    }

    module.querySelector(`[data-attenuator-channel="${state.channel}"]`)?.classList.toggle("is-attenuating", active);
    module.classList.toggle("is-processing", window.MerrinLabAttenuators.getState().some((route) => (
      route.source !== "off" && route.destination !== "off" && Math.abs(route.amount) > 0.0001
    )));
  }

  function initAttenuators() {
    const module = document.querySelector(".attenuators-module");
    const bank = window.MerrinLabAttenuators;
    const routing = window.MerrinLabAudio?.getRoutingOptions?.();
    if (!module || !bank || !routing) return;

    module.querySelectorAll("[data-attenuator-source]").forEach((select) => populateOptions(select, routing.sources));
    module.querySelectorAll("[data-attenuator-destination]").forEach((select) => populateOptions(select, routing.destinations));
    bank.subscribe((state) => updateChannel(module, state));

    module.addEventListener("input", (event) => {
      const source = event.target.closest("[data-attenuator-source]");
      if (source) {
        bank.setSource(source.dataset.attenuatorSource, source.value);
        return;
      }
      const amount = event.target.closest("[data-attenuator-amount]");
      if (amount) {
        bank.setAmount(amount.dataset.attenuatorAmount, Number(amount.value) / 100);
        return;
      }
      const destination = event.target.closest("[data-attenuator-destination]");
      if (destination) bank.setDestination(destination.dataset.attenuatorDestination, destination.value);
    });

    module.addEventListener("change", (event) => {
      const control = event.target.closest("[data-attenuator-source], [data-attenuator-amount], [data-attenuator-destination]");
      if (control) control.dispatchEvent(new Event("input", { bubbles: true }));
    });

    for (let channel = 1; channel <= CHANNEL_COUNT; channel += 1) updateChannel(module, bank.getChannel(channel));
    bank.syncAll();
  }

  document.addEventListener("DOMContentLoaded", initAttenuators);
})();
