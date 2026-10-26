---
name: Dashcam dashboard
description: A calm monochrome media library for dashcam footage, read locally in the browser, in light and dark.
colors:
  paper: "#fafafa"
  paper-panel: "#f1f1f1"
  paper-raised: "#e7e7e7"
  paper-hover: "#dedede"
  paper-press: "#d2d2d2"
  carbon: "#141414"
  carbon-lift: "#2e2e2e"
  graphite-ink-2: "#474747"
  graphite-ink-3: "#6a6a6a"
  carbon-panel: "#1c1c1c"
  carbon-raised: "#262626"
  carbon-hover: "#2f2f2f"
  carbon-press: "#393939"
  chalk: "#f3f3f3"
  ash-ink-2: "#b9b9b9"
  ash-ink-3: "#8f8f8f"
  white: "#ffffff"
  stage-black: "#0b0b0b"
  media-scrim: "rgba(10, 10, 10, 0.72)"
  scrim-paper: "rgba(250, 250, 250, 0.9)"
  scrim-carbon: "rgba(20, 20, 20, 0.9)"
  event-red: "#d4392a"
  event-red-night: "#ff6a5c"
  on-event-night: "#1f0603"
typography:
  display:
    fontFamily: "'Barlow Semi Condensed', 'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(44px, 7vw, 112px)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.015em"
  display-2:
    fontFamily: "'Barlow Semi Condensed', 'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(36px, 5.4vw, 80px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "'Barlow Semi Condensed', 'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(32px, 3.8vw, 56px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.015em"
  wordmark:
    fontFamily: "'Barlow Semi Condensed', 'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(48px, 11.4vw, 176px)"
    fontWeight: 700
    lineHeight: 0.85
    letterSpacing: "-0.03em"
  step-title:
    fontFamily: "'Barlow Semi Condensed', 'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.1
  lead:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(18px, 1.45vw, 21px)"
    fontWeight: 400
    lineHeight: 1.5
  body-large:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(17px, 1.3vw, 19px)"
    fontWeight: 400
    lineHeight: 1.55
  app-display:
    fontFamily: "'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  app-headline:
    fontFamily: "'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'tnum' 1"
  label:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
    fontFeature: "'tnum' 1"
  caption:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "'tnum' 1"
  tag:
    fontFamily: "'Segoe UI Variable Text', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 650
    lineHeight: 1
  speed:
    fontFamily: "'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "30px"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.02em"
rounded:
  hairline: "2px"
  sm: "4px"
  nested: "5px"
  md: "6px"
  lg: "8px"
  card: "10px"
  xl: "12px"
  frame: "14px"
  field: "18px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  gutter: "32px"
  block: "48px"
  home-gutter: "clamp(16px, 4vw, 48px)"
  home-section: "clamp(96px, 12vw, 176px)"
  home-max: "1360px"
components:
  button-primary:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.carbon-lift}"
  button-secondary:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.carbon}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-secondary-hover:
    backgroundColor: "{colors.paper-hover}"
  button-secondary-active:
    backgroundColor: "{colors.paper-press}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.carbon}"
    rounded: "{rounded.md}"
    height: "36px"
  button-ghost-pressed:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.paper}"
  button-large:
    padding: "0 22px"
    height: "46px"
  button-play:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.stage-black}"
    size: "44px"
  button-play-hover:
    backgroundColor: "{colors.white}"
  filter-row:
    backgroundColor: "transparent"
    textColor: "{colors.carbon}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "34px"
  filter-row-hover:
    backgroundColor: "{colors.paper-hover}"
  day-indicator:
    backgroundColor: "{colors.paper-raised}"
    rounded: "{rounded.md}"
    height: "32px"
  tag-event:
    backgroundColor: "{colors.event-red}"
    textColor: "{colors.white}"
    typography: "{typography.tag}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "22px"
  tag-parking:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.paper}"
    typography: "{typography.tag}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "22px"
  select:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.carbon}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 34px 0 12px"
    height: "36px"
  theme-switch:
    backgroundColor: "{colors.paper-raised}"
    rounded: "{rounded.lg}"
    padding: "3px"
  theme-switch-selected:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.nested}"
    height: "28px"
    width: "32px"
  segmented:
    backgroundColor: "{colors.carbon-panel}"
    rounded: "{rounded.lg}"
    padding: "3px"
  segment-selected:
    backgroundColor: "{colors.carbon-press}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.nested}"
    height: "30px"
  moment-tile-thumb:
    backgroundColor: "{colors.paper-raised}"
    rounded: "{rounded.md}"
  duration-badge:
    backgroundColor: "{colors.media-scrim}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  empty-panel:
    backgroundColor: "{colors.paper-panel}"
    rounded: "{rounded.xl}"
    padding: "48px 44px 40px"
    width: "560px"
  toast:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.stage-black}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  home-card:
    backgroundColor: "{colors.paper-panel}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.card}"
    padding: "18px 20px"
  home-card-hover:
    backgroundColor: "{colors.paper-raised}"
  home-demo:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.frame}"
  home-inverted-field:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.paper}"
    rounded: "{rounded.field}"
    padding: "clamp(56px, 8vw, 112px) clamp(24px, 5vw, 72px)"
  key-cap:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.carbon}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 7px"
    height: "28px"
---

# Design System: Dashcam dashboard

## Overview

**Creative North Star: "The Quiet Photo Library"**

The app behaves like the photo library already on the user's laptop: a plain ground, a slightly different sidebar, and a grid of 16:9 thumbnails grouped under sticky day headings. The palette is monochrome, so the footage is the only colourful thing on screen. Chrome steps through five close greys, the primary action is the ink colour itself, and the one hue in the system is event red, kept for the event tag. Both a light and a dark theme ship. The system follows the OS setting by default, and a three-way switch (system, light, dark) overrides it. The viewer is dark in both themes.

The app is moderately and evenly dense. It has a 264px sidebar and a fluid main column with a sticky toolbar over day sections, and the user sets the tile size. Opening a moment morphs the tile's thumbnails into a near-black stage, where the video is the subject and the controls sit in a quiet strip underneath. The homepage uses the same tokens at a larger scale. A condensed display face (Barlow Semi Condensed) sets the headlines and the footer wordmark, wide sections breathe, a working fragment of the app sits in the hero, and one inverted ink field holds the privacy promise.

This follows the category convention the user chose, executed straight: system UI sans with tabular figures in the app, small corners, flat surfaces, no gradients on surfaces, no glass. Personality comes from precision (exact times, frame numbers, centisecond timecodes) and from motion that explains where things went: thumbnails morph into the player, the theme switch reveals itself in a circle from the button you pressed, and clips slide when you step to the previous or next one.

**Key Characteristics:**
- Monochrome in both themes. Grey tonal steps carry all hierarchy, with no borders and no shadows at rest.
- Ink is the accent. Primary buttons, pressed toggles, checked boxes and selection all invert to the ink colour.
- Event red is the only hue, used for the event tag, the error line and the decoded event marker.
- Front and rear camera are one tile: the rear sits as an inset in the corner of the front thumbnail.
- The viewer is always dark (forced), so footage reads as the brightest thing on screen.
- Motion is spatial. View transitions morph, reveal and slide, and entrances stagger in on one ease-out curve.

## Colors

Two mirrored greyscale ramps (light and dark) that share one structure, plus a single red for events.

The tokens live as CSS custom properties in the shared base stylesheet, under role names: `--bg`, `--panel`, `--raised`, `--hover`, `--press`, `--ink`, `--ink-2`, `--ink-3`, `--primary`, `--primary-hover`, `--on-primary`, `--scrim`, `--event`, `--on-event`, `--stage`. Light is the default. Dark applies under `prefers-color-scheme: dark` (unless the user picks light), under `data-theme="dark"`, and inside any `.force-dark` scope. Always style against the role variables, never against a theme-specific value.

### Primary
- **Carbon** (`carbon`, `--ink` / `--primary` in light): text, the primary button fill, the pressed ghost button, checked filter boxes, the range progress and thumb, the focus outline and the selection highlight. In dark the same roles go to **Chalk** (`chalk`).
- **Carbon Lift** (`carbon-lift`): primary button hover in light. In dark the primary hover is pure **White** (`white`).

### Secondary
- **Event Red** (`event-red`, `--event` in light) with white text, and **Event Red Night** (`event-red-night`) with **On Event Night** (`on-event-night`) text in dark: the solid "Event" tag, the folder-reading error line, and the event part of a decoded file name on the homepage.

### Neutral
- **Paper** (`paper`) / **Carbon** (`carbon`): the page ground (`--bg`) in light and dark. These two values swap roles between themes; that inversion is the system.
- **Paper Panel** / **Carbon Panel** (`--panel`): the sidebar, the empty-state card, the map panel, the segmented track, homepage cards, FAQ rows and the demo window bar.
- **Paper Raised** / **Carbon Raised** (`--raised`): secondary buttons, selects, the theme-switch track, the local-only note, thumbnail placeholders, the sliding day indicator, key caps, and the hover state of homepage cards.
- **Paper Hover** / **Carbon Hover** and **Paper Press** / **Carbon Press** (`--hover`, `--press`): hover and press states, the placeholder pulse, slider tracks, scrollbar thumbs, the toggle track and the selected segment pill.
- **Graphite Ink 2/3** (light) and **Ash Ink 2/3** (dark) (`--ink-2`, `--ink-3`): supporting text and inactive tools; then counts, metadata, group labels and inactive filter rows.
- **Stage Black** (`stage-black`, `--stage`): the viewer, the demo player and the toast text. It is the same in both themes.
- **Media Scrim** (`media-scrim`): the translucent black behind text that sits on footage (duration badges, camera captions, the save-frame button, demo labels), with white text.
- **Scrim Paper** / **Scrim Carbon** (`--scrim`): the drag-to-open overlay that covers the library.

### Named Rules
**The Ink Is The Accent Rule.** There is no brand hue. Emphasis is made by inverting to ink on ground (primary button, pressed toggle, checked box, homepage privacy field), never by introducing a colour.

**The One Hue Rule.** Event red is the only chromatic colour in the interface and it means "event". It appears as a small solid tag (22px, or 18px in the viewer header), an error line, or a decoded event marker. It never fills a panel, tints a tile, or becomes a background.

**The Role-Variable Rule.** Components reference `--bg`, `--panel`, `--ink` and the other role variables, so they work in light, in dark and inside `.force-dark` without modification. Parking is the ink tag, not a second hue. Cameras are told apart by dot shape (filled, ring, square), not by colour.

## Typography

**Display Font:** Barlow Semi Condensed, weights 600 and 700 (Google Fonts), with the Segoe UI Variable Display system stack as fallback. Homepage only.
**App Headings:** Segoe UI Variable Display (with Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial)
**Body Font:** Segoe UI Variable Text (with the same system fallbacks)

**Character:** In the app, the platform's own UI face is set slightly tighter and heavier (650) for headings, so it reads as the operating system's photo app rather than a brand. On the homepage a tall, condensed grotesque carries the headlines at poster scale with tight leading. That gives the marketing surface a voice without changing the app. Tabular figures are on globally (`'tnum' 1`).

### Hierarchy
- **Display** (Barlow 700, clamp 44 to 112px, 0.94, -0.015em, max 14 to 18ch, balanced): the homepage hero and closing headlines.
- **Display 2** (Barlow 700, clamp 36 to 80px, 0.98): the privacy field heading.
- **Headline** (Barlow 700, clamp 32 to 56px, 1.0, max 18ch): homepage section headings.
- **Wordmark** (Barlow 700, clamp 48 to 176px, 0.85, -0.03em): the footer name, set on one line on wide screens. The nav wordmark is Barlow 700 at 19px.
- **Step title** (Barlow 700, 24px, 1.1): homepage step headings. Decoded file names use Barlow 600 at clamp 18 to 28px with +0.01em tracking and tabular numerals, and the demo route speed uses Barlow 700 at 30px.
- **Lead** (400, clamp 18 to 21px, 1.5, max 46ch) and **Body large** (400, clamp 17 to 19px, 1.55, max 54ch): homepage running text.
- **App display** (650, 26px, 1.2, -0.02em): the empty-state heading.
- **App headline** (650, 22px, 1.2, -0.015em): the library title in the sticky toolbar.
- **Title** (650, 18px, 1.3, -0.01em): day headings and the no-results heading. The viewer heading uses a 17px step and the sidebar brand a 16px step.
- **Body** (400, 15px, 1.5): app running text, max 44ch in the empty state.
- **Label** (600, 14px): buttons, selects, tile times, the playback time, filter rows and nav links.
- **Caption** (400, 13px, 1.45): counts, metadata, group labels (600, in `--ink-3`), hints and the local-only note.
- **Tag** (650, 12px, line-height 1): state tags, camera captions and duration badges (600).
- **Speed** (650, 30px, 1, -0.02em, app heading face): the GPS speed numeral in the viewer.

### Named Rules
**The Two Faces Rule.** Barlow Semi Condensed belongs to the homepage (headlines, wordmark, step titles, decoded file names). The app never loads it; app headings stay in the system display face.

**The Tabular Rule.** Every number uses tabular figures. Timecodes write centiseconds after the locale's decimal separator (0:00,00 in Dutch and German, 0:00.00 in English).

**The Sentence-Case Rule.** Labels, legends, tags and headings are in sentence case at normal tracking. Nothing is uppercase or letter-spaced for decoration.

## Layout

**App.** A two-column grid, 264px sidebar and fluid main, filling 100dvh. The sidebar is a flex column with 16px gaps (18px 16px 16px padding), and its foot (local-only note, language select and theme switch) is pinned to the bottom. The main column scrolls on its own. Its 72px sticky toolbar (14px 32px padding) sits over day sections whose headings stick directly below it. The library grid auto-fills tiles with a minimum width of `--tile` (default 260px, set by the zoom slider from 180 to 420px), with 20px row and 14px column gaps. Day sections sit 36px apart, the page gutter is 32px, and there is 48px of bottom padding.

**Viewer.** A full-screen three-row grid: a header bar (10px 16px), the stage, and a controls strip (8px 16px 14px). The stage has three layouts: side by side, picture-in-picture (inset at bottom-right, min(30%, 420px), 16px from the edges) and single. An optional 340px map panel sits to its right with a 12px gap.

**Homepage.** Content is centred at `min(100% - 2 × gutter, 1360px)` with a fluid gutter (16 to 48px). Sections are separated by a fluid section space (96 to 176px). Content sections are asymmetric two-column grids (1.25:1, 1.35:1, 1:1.6) with a 64px to 96px column gap, and feature sections alternate the side the media sits on. The nav is a 68px sticky bar that is transparent at the top and takes the ground colour once the page scrolls.

**Responsive.** App: at 1100px and below, segment labels collapse to icons and the map narrows to 280px. At 820px and below, the shell stacks, filters wrap, the day list and zoom hide, gutters drop to 16px, the side-by-side stage stacks and the map becomes 320px tall. Homepage: at 1000px and below, every two-column grid becomes one column with the media first, the nav links hide, and the demo shows 2 columns of 4 tiles. At 560px and below, the nav keeps only the mark, the theme switch and the language select.

**Spacing rhythm:** 4 / 8 / 12 / 16 / 24 / 32 / 48. Inside controls, 2, 6, 10 and 14px are used for fine optical adjustment.

## Elevation & Depth

The system is flat. Depth comes from tonal stepping (ground, panel, raised, hover, press), and the viewer drops to stage black. The homepage adds a single inverted field in place of a raised one. Overlapping media is separated by an outline in the colour of the ground underneath, not by a shadow.

### Shadow Vocabulary
- **Transient overlay** (`box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4)`): the toast only, which floats over video for 2.6 seconds.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces separate by grey step, not by border or shadow. The only shadow belongs to a transient message over video.

**The Ground-Cut Rule.** When one image overlaps another, cut it out with an outline in the colour beneath it: 2px for the tile rear inset and the stage picture-in-picture, 3px for the larger homepage pair.

## Shapes

Small, consistent rounding in the app: 6px (`md`) for buttons, tiles, thumbnails, selects, filter rows, the day indicator, the map panel and video views; 4px (`sm`) for tags, badges, captions, check boxes, key caps and the rear inset; 8px (`lg`) for the segmented track, the theme-switch track and the toast, with 5px (`nested`) segments inside so they sit concentrically with 3px padding; 12px (`xl`) for the empty-state card and the drag overlay; 2px for range tracks. The homepage opens up the scale for larger objects: 10px (`card`) for decode rows, FAQ rows, feature photographs and the route card, 14px (`frame`) for the demo window, and 18px (`field`) for the inverted privacy field. The play button, slider thumbs and the toggle knob are full circles, and the toggle track is a pill. Thumbnails are always 16:9, and the rear inset is 32% of the tile, also 16:9. There are no strokes on surfaces. The only lines are the focus outline, ground-cut outlines and the hollow check box.

## Components

### Buttons
Calm, solid and compact. They press down slightly when clicked.
- **Shape:** 6px corners, 36px tall, 0 14px padding, 600 weight 14px label. An optional icon sits 8px before the label.
- **Primary:** an ink fill with ground-coloured text (carbon on paper in light, chalk on carbon in dark). Hover moves toward full contrast (`carbon-lift` in light, white in dark). It holds the "open the app" and "choose folder" actions, one per view.
- **Secondary:** a Raised fill with ink text, Hover on hover, Press with scale(0.97) on active.
- **Ghost:** transparent. A pressed ghost (aria-pressed) inverts to ink fill with ground text. Icon-only ghosts are 40px wide.
- **States:** background and colour change over 140ms, and the press scale runs over 160ms on the ease-out curve. Disabled is 0.35 opacity with no transform.
- **Large:** 46px tall, 0 22px padding, 15px label, used for the homepage CTAs and the empty state.
- **Play:** a 44px ink circle on the dark stage that turns white on hover.

### Theme switch (signature)
A three-way radio group (system, light, dark) of 16px stroke icons on a Raised track (3px padding, 8px radius). The selected option is a 32 by 28 ground-coloured pill (5px radius) with ink icon; unselected icons are `--ink-3`, and they turn ink on hover. Choosing a theme runs a view transition: the new theme is revealed in a circle that expands from the centre of the pressed button over 560ms on the ease-out curve.

### Filter rows (Chips)
- **Style:** full-width 34px rows: a 16px rounded-square box (4px radius, 2px inset ring in `--ink-3`), the label, then a caption count on the right.
- **State:** when checked, the box fills with ink and draws a checkmark that scales in over 200ms. When off, the label drops to `--ink-3`. Hover is the Hover step, and pressing scales the box to 0.85.

### Moment tiles (signature)
- **Composition:** the front camera fills a 16:9 thumbnail with 6px corners. The rear camera is a 32% inset at bottom-right (8px from the edges, 4px radius), ground-cut with a 2px outline. The state tag sits at top-left and the duration badge (Media Scrim, white 12px 600) at bottom-left. The meta row below holds the time (14px 600) and camera labels marked by shape.
- **Loading:** the placeholder pulses Raised to Hover (1.4s). The image fades in over 320ms while it settles from scale 1.04.
- **Hover:** the image scales to 1.035 over 600ms, and the inset lifts 2px. Active scales the tile to 0.98. The focus ring sits 4px out.
- **Entrance:** tiles stagger in (opacity and 14px rise, 420ms, 25ms apart). Opening a tile morphs each thumbnail into its camera view in the player (420ms, ease-out). Closing morphs back.

### Tags
- **Event:** a solid event-red fill (`--event` / `--on-event`). **Parking:** a solid ink fill with ground text. Both are 22px tall with 4px corners and 12px 650 text, shrinking to 18px with 11.5px text in the viewer header.

### Inputs / Fields
- **Select:** a Raised fill, no stroke, 6px corners, 36px tall (34px compact), with a drawn chevron. Hover is the Hover step.
- **Range:** a 4px track in `--press` with ink progress and a 14px ink thumb (1.15 on hover, 1.3 while dragging). The scrubber spans the full width, and its track thickens to 6px on hover.
- **Toggle:** a 30 by 18 pill, Press when off and ink when on. The 14px knob changes from `--ink-2` to stage black and slides over 260ms.
- **Focus:** a global 2px ink outline at a 2px offset.

### Navigation
- **Day list:** 32px rows of 14px `--ink-3` text with the count on the right. Hover and current turn ink, and current is 600. A single Raised indicator slides under the current day on a spring (stiffness 420, damping 38) as the library scrolls.
- **Segmented layout switch (viewer):** a Panel track (3px padding, 8px radius) whose Press pill slides between 30px segments over 320ms on the ease-out curve.
- **Homepage nav:** the wordmark, then section links (14px 600, `--ink-2`, Raised on hover), with the theme switch, language select and a primary CTA at the right.

### Viewer
A stage-black, always-dark (`.force-dark`) full-screen dialog. Each video view is a 6px-rounded black frame with a camera caption (Media Scrim, 12px 650) at top-left and a hover-revealed save-frame button at top-right. Saving a frame flashes the view white (420ms). Moving to the previous or next clip slides the stage vertically (out 300ms, in 380ms) instead of morphing. The toast is a chalk pill with stage-black text that springs in (stiffness 520, damping 34).

### Homepage cards and the demo
- **Demo window:** a 14px-rounded working fragment of the app, with a Panel title bar (42px), a three-column tile grid, and a forced-dark player that tiles morph into (460ms).
- **Cards:** decode rows and FAQ rows are Panel fills with 10px corners and 18px 20px padding, and they step to Raised on hover or when open. In decoded file names, the parts of the name are lit by inverting them to ink.
- **Inverted field:** the privacy section is an ink field with ground text and 18px corners, the one inverted surface on the page.
- **Key caps:** 28px Raised caps (4px radius, 14px 600) beside keyboard-shortcut copy.
- **Entrances:** each section staggers its heading, text and media in as it enters view (700ms, 28px rise, 75ms apart). Feature photographs drift slowly against the scroll.

## Do's and Don'ts

### Do:
- **Do** style every component against the role variables (`--bg`, `--panel`, `--raised`, `--ink`, `--primary`, `--event` and so on) so it works in light, in dark and inside `.force-dark`.
- **Do** separate surfaces by grey step (ground, panel, raised, hover, press) rather than by border or shadow.
- **Do** make emphasis by inverting to ink on ground: the primary button, the pressed toggle, the checked box.
- **Do** keep the viewer and anything that frames footage dark in both themes (`.force-dark`, stage black).
- **Do** keep thumbnails 16:9 at 6px corners and show the rear camera as a 32% inset with a ground-cut outline.
- **Do** set every number with tabular figures, with centiseconds after the locale's decimal separator.
- **Do** run state changes at 140 to 200ms, and run entrances and morphs on the ease-out curve (cubic-bezier(0.22, 1, 0.36, 1)) through view transitions or the motion library. Under prefers-reduced-motion, skip every transition and entrance.
- **Do** draw icons as inline stroke SVGs (stroke-width 2, round caps).

### Don't:
- **Don't** introduce a brand hue or a second accent; the palette is monochrome plus event red.
- **Don't** use event red for anything other than events and errors, and never as a panel fill, tile tint or large area of colour.
- **Don't** add gradients, glass or backdrop blur, or resting shadows to any surface. The toast's transient shadow is the only shadow.
- **Don't** load Barlow Semi Condensed in the app or use it for running text.
- **Don't** use uppercase or letter-spaced labels; group labels are sentence case in 13px 600 `--ink-3`.
- **Don't** tint the stage. The viewer background stays stage black in both themes so the footage is the brightest thing on screen.
