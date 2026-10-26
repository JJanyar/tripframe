# Tripframe

Elke rit, frame voor frame. Een verkenner voor dashcambeelden in je browser. Open de map van je geheugenkaart en je ziet je opnames per dag en tijd, met de voor- en achtercamera samen als één moment.

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
- **Video opslaan** (`R`) van de weergave zoals je hem ziet: naast elkaar of beeld in beeld, met de kaart erbij als die open staat.
- **Formaat aanpassen**: sleep de hoek van het kleine beeld (beeld in beeld) of de scheidslijn tussen twee camera's (naast elkaar).
- **Volume** met knop en schuif, `M` voor geluid aan/uit, `-` en `+` voor zachter en harder.
- **Sneltoetsenkaart** met `?` of de knop rechtsboven in de speler.
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
| Spatie / K | Afspelen of pauzeren (werkt overal in de speler) |
| `,` / `.` | Eén frame terug / verder |
| ← / → | 5 seconden terug / verder (met Shift: 1 seconde) |
| ↑ / ↓ | Vorige / volgende clip |
| W | Voor en achter wisselen |
| S | Frame opslaan |
| 1 / 2 / 3 | Naast elkaar, beeld in beeld, één camera |
| M | Geluid aan of uit |
| - / + | Volume zachter of harder |
| G | Kaart tonen of verbergen |
| R | Video-opname starten of stoppen |
| ? | Sneltoetsen tonen |
| Esc | Terug naar het overzicht |

## Browsers

Het beste in **Chrome** of **Edge**: daar kun je een map kiezen en onthoudt de app de laatste map. Firefox en Safari werken via een map-uploadveld (er wordt niets verstuurd).

Veel dashcams nemen op in **H.265 (HEVC)**. Edge en Chrome op Windows spelen dat af als de HEVC-ondersteuning van Windows aanwezig is; anders toont de app een melding.

## Ontwikkelen

```bash
npm install
npm run dev
```

Huisstijl: logo's, iconen en kleuren uit het Tripframe-logokit (`public/brand/`), lettertype Manrope.

De voorbeeldfoto's op de homepage zijn dashcamfoto's van Wikimedia Commons onder CC0 of publiek domein; een bronvermelding is daarvoor niet verplicht. De homepagevideo (`public/video/tripframe.mp4`) is gemaakt met /brag.

Productiebuild: `npm run build` (uitvoer in `dist/`). De site staat op Vercel en wordt bij elke push naar `main` opnieuw gebouwd.
