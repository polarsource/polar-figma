import { polar } from "./polar";
import React, { useCallback, useEffect, useState } from "react";
import type {
	LicenseKeyActivationRead,
	ValidatedLicenseKey,
} from "@polar-sh/sdk/models/components";
import { Authenticated } from "./components/Authenticated";
import { createRoot } from "react-dom/client";
import "./input.css";
import { Unauthenticated } from "./components/Unauthenticated";

// Replace this with your actual organization ID
// It can be found in your Polar Organization Settings page
const ORGANIZATION_ID = "<YOUR_ORGANIZATION_ID>";

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

			parent.postMessage(
				{ pluginMessage: { type: "setLicenseKey", data: key } },
				"*",
			);

			setValidation(licenseKeyValidation);
		},
		[],
	);

	const initialize = useCallback(async () => {
		window.onmessage = async (e) => {
			const persistedLicenseKey = e.data.pluginMessage.data;

			switch (e.data.pluginMessage.type) {
				case "getLicenseKey":
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

		parent.postMessage(
			{ pluginMessage: { type: "getLicenseKey", data: null } },
			"*",
		);
	}, []);

	useEffect(() => {
		initialize();
	}, [initialize]);

	return (
		<div className="flex flex-col h-full w-full bg-white p-8">
			{validation ? (
				<Authenticated />
			) : (
				<Unauthenticated
					organizationId={ORGANIZATION_ID}
					onValidation={onValidation}
				/>
			)}
		</div>
	);
}

const container =
	document.getElementById("root") ?? document.createElement("div");
const root = createRoot(container);
root.render(<Plugin />);
