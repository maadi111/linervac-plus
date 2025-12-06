# Assets Required

The following assets are referenced in `app.json` but need to be created:

1. **icon.png** - App icon (1024x1024px recommended)
   - Location: `./assets/icon.png`
   - Used for: App icon on home screen

2. **splash.png** - Splash screen image
   - Location: `./assets/splash.png`
   - Background color: #0A4D8C (configured in app.json)

3. **adaptive-icon.png** - Android adaptive icon foreground
   - Location: `./assets/adaptive-icon.png`
   - Background color: #0A4D8C (configured in app.json)

## Quick Setup

You can generate these assets using:
- [Expo Asset Generator](https://www.npmjs.com/package/@expo/asset-generator)
- [App Icon Generator](https://www.appicon.co/)
- Or create them manually using design tools

## Temporary Workaround

To test the app without assets, you can temporarily comment out the asset references in `app.json`, but the app will not build for production without them.

