# polar-figma

![Polar Figma](./polar-figma.jpg)

A simple example of how to use Polar License Key validation in a Figma plugin.

[The complete guide can be found here](https://docs.polar.sh/guides/figma?ref=github)

### Development

Import this plugin into Figma using "Import Manifest". Run the following command to start the development server:

```bash
pnpm run dev
```

### Configuration

#### Organization ID

Replace `ORGANIZATION_ID` in `src/ui/main.tsx` with your actual organization ID. It can be found in your Polar Organization Settings page.

#### Server Environment

Set the `server` parameter in `src/ui/polar.ts` to `"sandbox"` to use the sandbox server for development. Switch this to `"production"` (or omit the parameter) when you're ready to go live.

#### Manifest

It is very important to allow the plugin to access the Polar API. You can allow this by adding the following to the `networkAccess` section in `manifest.json`:

```json
"networkAccess": {
	"allowedDomains": ["https://*.polar.sh"]
}
```

This allows the plugin to validate license keys using the Polar API server.
