import { LicenseKeyInput } from "./components/LicenseKeyInput";
import { polar } from "./polar";
import React, { useCallback, useEffect, useState } from "react";
import {
  LicenseKeyActivationRead,
  ValidatedLicenseKey,
} from "@polar-sh/sdk/models/components";
import { Authenticated } from "./components/Authenticated";
import { createRoot } from 'react-dom/client';
import './input.css';
const ORGANIZATION_ID = "7cc1d00a-4bdd-4817-bf00-2efdc5c35e96";

function Plugin() {
  const [validation, setValidation] = useState<
    ValidatedLicenseKey | LicenseKeyActivationRead
  >();

  const onValidation = useCallback(
    (licenseKeyValidation: ValidatedLicenseKey | LicenseKeyActivationRead) => {
      const key =
        "key" in licenseKeyValidation
          ? licenseKeyValidation.key
          : licenseKeyValidation.licenseKey;

          parent.postMessage({ pluginMessage: { type: 'setLicenseKey', data: key } }, '*');
    },
    []
  );

  const initialize = useCallback(async () => {

    window.onmessage = async (e) => {
      switch (e.data.pluginMessage.type) {
        case 'getLicenseKey':
          const persistedLicenseKey = e.data.pluginMessage.data;  

          if (persistedLicenseKey) {
            const validation = await polar.users.licenseKeys.validate({
              organizationId: ORGANIZATION_ID,
              key: persistedLicenseKey,
            });

            setValidation(validation);
          }

          break;
      }
    };

    parent.postMessage({ pluginMessage: { type: 'getLicenseKey', data: null } }, '*');
  }, []);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {validation ? (
        <Authenticated />
      ) : (
        <LicenseKeyInput
          polar={polar}
          organizationId={ORGANIZATION_ID}
          onValidation={onValidation}
          onActivation={onValidation}
          // Set to true if your configured Polar License Key has a limit of activations
          needsActivation={false}
        />
      )}
    </div>
  );
}

const container = document.getElementById('root') ?? document.createElement('div')
const root = createRoot(container);
root.render(<Plugin />);
