import type { Polar } from "@polar-sh/sdk";
import type {
	LicenseKeyActivationRead,
	ValidatedLicenseKey,
} from "@polar-sh/sdk/models/components";
import React, { useState, useCallback } from "react";

export interface LicenseKeyInputProps {
	polar: Polar;
	organizationId: string;
	needsActivation?: boolean;
	onValidation?: (validation: ValidatedLicenseKey) => void;
	onActivation?: (activation: LicenseKeyActivationRead) => void;
}

export const LicenseKeyInput = ({
	polar,
	organizationId,
	needsActivation,
	onActivation,
	onValidation,
}: LicenseKeyInputProps) => {
	const [licenseKey, setLicenseKey] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleError = useCallback((error: string) => {
		setError(error);
	}, []);

	const handleActivation = useCallback(async () => {
		setError(null);

		try {
			const activation = await polar.users.licenseKeys.activate({
				key: licenseKey,
				organizationId: organizationId,
				label: "Figma Plugin",
			});

			onActivation?.(activation);
		} catch (error) {
			if (error instanceof Error) {
				handleError(error.message);
			}
		}
	}, [polar, licenseKey, organizationId, onActivation, handleError]);

	const handleValidation = useCallback(async () => {
		setError(null);

		try {
			const validation = await polar.users.licenseKeys.validate({
				key: licenseKey,
				organizationId: organizationId,
			});

			onValidation?.(validation);
		} catch (error) {
			if (error instanceof Error) {
				handleError(error.message);
			}
		}
	}, [polar, onValidation, licenseKey, organizationId, handleError]);

	return (
		<div className="flex flex-col gap-y-4 w-full">
			<input
				className="bg-gray-100 py-2 px-4 rounded-xl w-full"
				placeholder="License Key"
				value={licenseKey}
				onChange={(e) => setLicenseKey(e.target.value)}
			/>
			{error && (
				<div className="flex rounded-lg px-4 py-2 bg-red-50">
					<p className="text-red-500 text-xs">License key is invalid</p>
				</div>
			)}
			<button
				className="bg-blue-500 text-white py-2 px-4 rounded-xl"
				onClick={needsActivation ? handleActivation : handleValidation}
				type="button"
			>
				Validate
			</button>
		</div>
	);
};
