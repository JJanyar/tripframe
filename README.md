# Dashcam dashboard

Een verkenner voor dashcambeelden in je browser. Open de map van je geheugenkaart en je ziet je opnames per dag en tijd, met de voor- en achtercamera samen als één moment.

Alles draait lokaal: de bestanden worden in je browser gelezen en nergens geüpload.

- Homepage: `/` (uitleg, demo, vragen)
- App: `/app/`
- Talen: Engels, Nederlands, Duits (automatisch op basis van je browser, te wijzigen)
- Thema: licht, donker of systeem

## Wat het doet

- **Tijdlijn per dag** met de tijd uit de bestandsnaam, nieuwste of oudste eerst.
- **Voor, achter en binnen** van hetzelfde moment gekoppeld, met een miniatuur van beide.
- **Filters** op camera en soort opname: normaal, event (beveiligd, map `RO`), parkeren, foto's.
- **Synchroon afspelen** van alle camera's: naast elkaar, beeld in beeld of één camera.
- **Wisselen** tussen voor en achter: knop, toets `W` of dubbelklik op het beeld.
- **Vorige en volgende clip** met knoppen of ↑ / ↓.
- **Frame voor frame** heen en weer (`,` en `.`), met de werkelijke kloktijd en het framenummer.
- **Frame opslaan** als PNG (`S`), van één camera of van alle camera's naast elkaar.
- **GPS-kaart** van de rit (OpenStreetMap), die meeloopt met de video, inclusief snelheid.
- **Doorspelen**: aan het eind van een clip start automatisch het volgende moment.

### Ondersteunde merken

| Merk | Voorbeeld bestandsnaam |
| --- | --- |
| Viofo (en andere Novatek-camera's) | `2024_0315_143022_000123F.MP4` |
| BlackVue | `20240315_143022_NF.mp4` |
| Thinkware | `REC_2024_03_15_14_30_22_F.MP4` |
| 70mai | `NO20240315-143022-000123F.mp4` |
| Nextbase | `240315_143022_001_FH.MP4` |

Andere namen met een datum en tijd worden ook herkend; anders gebruikt de app de wijzigingsdatum van het bestand.

GPS wordt gelezen uit Viofo/Novatek-bestanden (`freeGPS`-blokken) en BlackVue-bestanden (NMEA).

## Sneltoetsen in de speler

| Toets | Actie |
| --- | --- |
| Spatie / K | Afspelen of pauzeren |
| `,` / `.` | Eén frame terug / verder |
| ← / → | 5 seconden terug / verder (met Shift: 1 seconde) |
| ↑ / ↓ | Vorige / volgende clip |
| W | Voor en achter wisselen |
| S | Frame opslaan |
| M | Kaart tonen of verbergen |
| Esc | Terug naar het overzicht |

## Browsers

Het beste in **Chrome** of **Edge**: daar kun je een map kiezen en onthoudt de app de laatste map. Firefox en Safari werken via een map-uploadveld (er wordt niets verstuurd).

Veel dashcams nemen op in **H.265 (HEVC)**. Edge en Chrome op Windows spelen dat af als de HEVC-ondersteuning van Windows aanwezig is; anders toont de app een melding.

## Ontwikkelen

```bash
npm install
npm run dev
```

Voorbeeldfoto's op de homepage komen van Wikimedia Commons (CC0, CC BY en publiek domein); de bronnen staan in de footer en in `src/photo-credits.json`.

Productiebuild: `npm run build` (uitvoer in `dist/`). De site staat op Vercel en wordt bij elke push naar `main` opnieuw gebouwd.
