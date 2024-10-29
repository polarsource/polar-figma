import type {
	LicenseKeyActivationRead,
	ValidatedLicenseKey,
} from "@polar-sh/sdk/models/components";
import { polar } from "../polar";
import { LicenseKeyInput } from "./LicenseKeyInput";

export interface UnauthenticatedProps {
	organizationId: string;
	onValidation: (
		validation: ValidatedLicenseKey | LicenseKeyActivationRead,
	) => void;
}

export const Unauthenticated = ({
	organizationId,
	onValidation,
}: UnauthenticatedProps) => {
	return (
		<div className="flex flex-col items-center justify-center h-full gap-y-16">
			<div className="flex flex-col gap-y-2 items-center">
				<h3 className="text-lg font-medium">Polar License Key Example</h3>
				<p className="text-sm text-gray-500">
					Enter your license key to continue
				</p>
			</div>
			<LicenseKeyInput
				organizationId={organizationId}
				onValidation={onValidation}
				onActivation={onValidation}
				// Set to true if your configured Polar License Key has a limit of activations
				needsActivation={false}
			/>
		</div>
	);
};
