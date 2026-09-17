# SmartHealth AI

A complete React + Vite college-project website for a SmartHealth AI concept.

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
npm run preview
```

## Included

- Responsive modern health dashboard
- Virtual smartwatch with simulated live heart rate and SpO₂
- Steps, calories, distance and sleep
- AI Health Analysis with explainable local/demo rules
- Another Person Health Check
- BMI calculator
- Health history charts
- AI Health Assistant
- Profile / Settings
- Future Bluetooth wearable architecture concept
- Edge AI / local inference concept
- No backend or physical smartwatch required

## Important

This is a college-project demonstration. The health readings are simulated and the AI analysis is not a medical diagnosis.

## Future APK

Because the UI is built as a responsive web app, the same project can later be wrapped as an Android APK using Capacitor or another WebView-based approach. Keep the web project as the source of truth.


## Fixed build note

This version removes the external font CSS import and uses a cleaned, valid stylesheet.
If you already have `node_modules` from the previous ZIP, delete the `node_modules` folder
and `package-lock.json` once, then run `npm install` and `npm run dev`.


### Editable profile name
Open **Profile** from the sidebar, change **Display Name**, and press **Save profile name**. The name is stored in the browser and appears across the dashboard.
