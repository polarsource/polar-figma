"use strict";
(() => {
  // src/main/main.ts
  figma.showUI(__html__, { themeColors: true, height: 480, width: 360 });
  figma.ui.onmessage = async (message) => {
    switch (message.type) {
      case "getLicenseKey":
        const licenseKey = await figma.clientStorage.getAsync("license_key");
        console.log("licenseKey", licenseKey);
        figma.ui.postMessage({
          type: "getLicenseKey",
          data: licenseKey
        });
        break;
      case "setLicenseKey":
        await figma.clientStorage.setAsync("license_key", message.data);
        figma.ui.postMessage({
          type: "setLicenseKey",
          data: message.data
        });
        break;
    }
  };
})();
