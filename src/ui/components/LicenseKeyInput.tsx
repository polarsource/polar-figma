import type { Polar } from "@polar-sh/sdk";
import type {
	LicenseKeyActivationRead,
	ValidatedLicenseKey,
} from "@polar-sh/sdk/models/components";
import React, { useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { polar } from "../polar";

export interface LicenseKeyInputProps {
	organizationId: string;
	needsActivation?: boolean;
	onValidation?: (validation: ValidatedLicenseKey) => void;
	onActivation?: (activation: LicenseKeyActivationRead) => void;
}

export const LicenseKeyInput = ({
	organizationId,
	needsActivation,
	onActivation,
	onValidation,
}: LicenseKeyInputProps) => {
	const [licenseKey, setLicenseKey] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleError = useCallback((error: string) => {
		setError(error);
	}, []);

	const handleActivation = useCallback(async () => {
		setError(null);
		setLoading(true);
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
		} finally {
			setLoading(false);
		}
	}, [licenseKey, organizationId, onActivation, handleError]);

	const handleValidation = useCallback(async () => {
		setError(null);
		setLoading(true);
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
		} finally {
			setLoading(false);
		}
	}, [onValidation, licenseKey, organizationId, handleError]);

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
				className={twMerge(
					"text-white py-2 px-4 rounded-xl",
					loading ? "bg-gray-300" : "bg-blue-500",
				)}
				onClick={needsActivation ? handleActivation : handleValidation}
				type="button"
				disabled={loading}
			>
				{loading ? "Validating..." : "Validate"}
			</button>
		</div>
	);
};
