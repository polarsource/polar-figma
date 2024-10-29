# polar-figma

A simple example of how to use Polar License Key validation in a Figma plugin.

### Development

Import this plugin into Figma using "Import Manifest". Run the following command to start the development server:

```bash
pnpm run dev
```

### Configuration

Replace `ORGANIZATION_ID` in `src/ui/main.tsx` with your actual organization ID. It can be found in your Polar Organization Settings page.

Set the `server` parameter in `src/ui/polar.ts` to `"sandbox"` to use the sandbox server for development. Switch this to `"production"` (or omit the parameter) when you're ready to go live.
