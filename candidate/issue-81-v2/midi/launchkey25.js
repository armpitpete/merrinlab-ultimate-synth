(() => {
  "use strict";

  window.MerrinLabLaunchkey25 = {
    matches(device) {
      const name = (device.name || "").toLowerCase();
      return name.includes("launchkey") || name.includes("novation");
    }
  };
})();
