import {Polar} from '@polar-sh/sdk'
import { LicenseKeyActivationRead, ValidatedLicenseKey } from '@polar-sh/sdk/models/components'
import React, {useState, useCallback} from 'react'

export interface LicenseKeyInputProps {
    polar: Polar
    organizationId: string
    needsActivation?: boolean
    onValidation?: (validation: ValidatedLicenseKey) => void
    onActivation?: (activation: LicenseKeyActivationRead) => void
}

export const LicenseKeyInput = ({polar, organizationId, needsActivation, onActivation, onValidation}: LicenseKeyInputProps) => {
    const [licenseKey, setLicenseKey] = useState('')

    const handleActivation = useCallback(async () => {
        const activation = await polar.users.licenseKeys.activate({
            key: licenseKey,
            organizationId: organizationId,
            label: 'Figma Plugin'
        })

        onActivation?.(activation)
    }, [polar, licenseKey, organizationId, onActivation])

    const handleValidation = useCallback(async () => {
        const validation = await polar.users.licenseKeys.validate({
            key: licenseKey,
            organizationId: organizationId
        })

        onValidation?.(validation)
    }, [polar, onValidation, licenseKey, organizationId]);

    return (
        <div>
            <input 
                placeholder="License Key" 
                value={licenseKey} 
                onChange={e => setLicenseKey(e.target.value)} 
            />
            <button onClick={needsActivation ? handleActivation : handleValidation}>Validate</button>
        </div>
    )
}