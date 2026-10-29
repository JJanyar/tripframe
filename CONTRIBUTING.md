# Contributing to Tripframe

Thanks for helping. Tripframe is small on purpose: plain JavaScript, no framework, no backend, and footage never leaves the user's computer. Contributions that keep it that way are the easiest to merge.

## Good first contributions

- **Another dashcam brand.** Add a pattern to `PARSERS` in `src/parse.js`. Include a few real example file names in the pull request (rename anything personal), and say which camera model wrote them.
- **GPS from another camera.** `src/mp4.js` reads Novatek `freeGPS` blocks and BlackVue NMEA. A short sample file that shows the format helps a lot.
- **A translation fix or a new language.** All text lives in `src/locales/<lang>.js`. Copy `en.js`, translate the values and keep every `{placeholder}`. Register the language in `src/locales/langs.js`. Plurals use [Intl.PluralRules](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) categories (`one`, `few`, `many`, `other`). `npm run i18n:check` lists missing keys and lost placeholders per language.

## Running it locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173/` for the homepage and `/app/` for the app. `npm test` runs the unit tests and `npm run build` checks that the static pages build. The development server shows the English pages; build and run `npm run preview` to see every language and blog post.

## Pull requests

- Keep changes focused, one topic per pull request.
- Match the existing style: small functions, comments only where the code does not explain itself.
- Nothing may upload or send footage, file names or metadata anywhere.
- Describe how you tested it, ideally with which dashcam and browser.

## Reporting a bug

Open an issue with the browser and operating system, the dashcam model, a few example file names and what you expected to happen.
