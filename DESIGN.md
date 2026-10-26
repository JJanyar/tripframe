---
name: Tripframe
description: Every drive, frame by frame. A calm asphalt-and-chalk media library for dashcam footage, read locally in the browser.
colors:
  asphalt: "#17191e"
  chalk: "#f6f4ee"
  kerb-grey: "#8c919a"
  signal-yellow: "#ffc21a"
  chalk-panel: "#eceae4"
  chalk-raised: "#e2dfd7"
  chalk-hover: "#d8d5cc"
  chalk-press: "#cbc8be"
  asphalt-ink-2: "#474a52"
  asphalt-ink-3: "#5d6169"
  asphalt-lift: "#2c2f36"
  asphalt-panel: "#1e2026"
  asphalt-raised: "#272a31"
  asphalt-hover: "#30333b"
  asphalt-press: "#3a3d46"
  chalk-ink-2: "#c9cbd0"
  chalk-ink-3: "#9a9ea6"
  white: "#ffffff"
  stage-black: "#0e0f12"
  rec-red: "#e5484d"
  media-scrim: "rgba(10, 10, 10, 0.72)"
  scrim-chalk: "rgba(246, 244, 238, 0.92)"
  scrim-asphalt: "rgba(23, 25, 30, 0.92)"
typography:
  display:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(44px, 7vw, 112px)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  hero-display:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(44px, 5.4vw, 88px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  display-2:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(36px, 5.4vw, 80px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(32px, 3.8vw, 56px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.035em"
  step-title:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.1
  file-name:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(18px, 1.9vw, 28px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.01em"
    fontFeature: "'tnum' 1"
  lead:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(17px, 1.35vw, 20px)"
    fontWeight: 400
    lineHeight: 1.55
  body-large:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(17px, 1.3vw, 19px)"
    fontWeight: 400
    lineHeight: 1.55
  app-display:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  app-headline:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'tnum' 1"
  label:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
    fontFeature: "'tnum' 1"
  caption:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "'tnum' 1"
  tag:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 650
    lineHeight: 1
  key:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "12.5px"
    fontWeight: 700
    lineHeight: 1
  speed:
    fontFamily: "'Manrope', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
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
  media: "16px"
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
    backgroundColor: "{colors.asphalt}"
    textColor: "{colors.chalk}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.asphalt-lift}"
  button-secondary:
    backgroundColor: "{colors.chalk-raised}"
    textColor: "{colors.asphalt}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-secondary-hover:
    backgroundColor: "{colors.chalk-hover}"
  button-secondary-active:
    backgroundColor: "{colors.chalk-press}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.asphalt}"
    rounded: "{rounded.md}"
    height: "36px"
  button-ghost-pressed:
    backgroundColor: "{colors.asphalt}"
    textColor: "{colors.chalk}"
  button-large:
    padding: "0 22px"
    height: "46px"
  button-play:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.stage-black}"
    size: "44px"
  button-play-hover:
    backgroundColor: "{colors.white}"
  button-record-active:
    backgroundColor: "{colors.rec-red}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    height: "36px"
  filter-row:
    backgroundColor: "transparent"
    textColor: "{colors.asphalt}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "34px"
  filter-row-hover:
    backgroundColor: "{colors.chalk-hover}"
  day-indicator:
    backgroundColor: "{colors.chalk-raised}"
    rounded: "{rounded.md}"
    height: "32px"
  tag-event:
    backgroundColor: "{colors.signal-yellow}"
    textColor: "{colors.asphalt}"
    typography: "{typography.tag}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "22px"
  tag-parking:
    backgroundColor: "{colors.asphalt}"
    textColor: "{colors.chalk}"
    typography: "{typography.tag}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "22px"
  select:
    backgroundColor: "{colors.chalk-raised}"
    textColor: "{colors.asphalt}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 34px 0 12px"
    height: "36px"
  theme-switch:
    backgroundColor: "{colors.chalk-raised}"
    rounded: "{rounded.lg}"
    padding: "3px"
  theme-switch-selected:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.asphalt}"
    rounded: "{rounded.nested}"
    height: "28px"
    width: "32px"
  segmented:
    backgroundColor: "{colors.asphalt-panel}"
    rounded: "{rounded.lg}"
    padding: "3px"
  segment-selected:
    backgroundColor: "{colors.asphalt-press}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.nested}"
    height: "30px"
  moment-tile-thumb:
    backgroundColor: "{colors.chalk-raised}"
    rounded: "{rounded.md}"
  duration-badge:
    backgroundColor: "{colors.media-scrim}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  empty-panel:
    backgroundColor: "{colors.chalk-panel}"
    rounded: "{rounded.xl}"
    padding: "48px 44px 40px"
    width: "560px"
  keys-card:
    backgroundColor: "{colors.asphalt-panel}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.xl}"
    padding: "16px 18px 18px"
    width: "380px"
  key-cap:
    backgroundColor: "{colors.asphalt-raised}"
    textColor: "{colors.chalk}"
    typography: "{typography.key}"
    rounded: "{rounded.sm}"
    padding: "0 7px"
    height: "26px"
  toast:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.stage-black}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  home-card:
    backgroundColor: "{colors.chalk-panel}"
    textColor: "{colors.asphalt}"
    rounded: "{rounded.card}"
    padding: "18px 20px"
  home-card-hover:
    backgroundColor: "{colors.chalk-raised}"
  home-hero-video:
    backgroundColor: "{colors.asphalt}"
    rounded: "{rounded.media}"
  home-demo:
    backgroundColor: "{colors.chalk}"
    rounded: "{rounded.frame}"
  home-inverted-field:
    backgroundColor: "{colors.asphalt}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.field}"
    padding: "clamp(56px, 8vw, 112px) clamp(24px, 5vw, 72px)"
  home-footer:
    backgroundColor: "{colors.asphalt}"
    textColor: "{colors.chalk}"
    padding: "clamp(48px, 7vw, 96px) 0 40px"
---

# Design System: Tripframe

## Overview

**Creative North Star: "Asphalt, Chalk and One Lane Marking"**

Tripframe behaves like the photo library already on the user's laptop: a plain ground, a slightly different sidebar, and a grid of 16:9 thumbnails grouped under sticky day headings. The world is the road itself. Asphalt and chalk do almost all of the work, a cool kerb grey draws routes, and signal yellow is the one lane marking. Yellow marks where you are and what matters on the timeline: scrubber progress, the event tag, resize handles and the map position. Light (chalk ground) and dark (asphalt ground) themes both ship. The system follows the OS setting by default, and a three-way switch (system, light, dark) overrides it. The viewer is dark in both themes.

The app is moderately and evenly dense: a 264px sidebar and a fluid main column with a sticky toolbar over day sections, at a tile size the user sets. Opening a moment morphs the tile's thumbnails into a near-black stage, where the video is the subject and the controls sit in a quiet strip underneath. The homepage uses the same tokens and the same face (Manrope) at poster scale: an 800-weight headline beside a looping drive, a working fragment of the app in its own section, one inverted field for the privacy promise, and a footer that inverts the chosen theme.

The direction is the category convention, which the user chose, executed straight: small corners, flat surfaces, no gradients on surfaces, no glass. Personality comes from precision (exact times, frame numbers, centisecond timecodes), from the brand's yellow used sparingly, and from motion that explains where things went: thumbnails morph into the player, the theme switch reveals itself in a circle from the button you pressed, and clips slide when you step to the previous or next one.

**Key Characteristics:**
- Asphalt and chalk in two mirrored themes, with warm grey tonal steps carrying all hierarchy, no borders and no shadows at rest.
- Ink is the action colour. Primary buttons, pressed toggles, checked boxes and selection invert to ink on ground.
- Signal yellow is the single accent, used as a fill or mark, never as text on light.
- Recording red appears only while recording or on the record control.
- Front and rear camera are one tile: the rear sits as an inset in the corner of the front thumbnail.
- The viewer is always dark (forced), so footage reads as the brightest thing on screen.
- Motion is spatial: view transitions morph, reveal and slide, and entrances stagger in on one ease-out curve.

## Colors

The brand's four colours (asphalt, chalk, kerb grey and signal yellow) generate two mirrored warm-grey ramps, plus one red reserved for recording.

The tokens live as CSS custom properties in the shared base stylesheet. The brand primitives are `--asphalt`, `--chalk`, `--kerb`, `--signal` and `--on-signal`. Components use the role variables `--bg`, `--panel`, `--raised`, `--hover`, `--press`, `--ink`, `--ink-2`, `--ink-3`, `--primary`, `--primary-hover`, `--on-primary`, `--scrim`, `--rec` and `--stage`. Light is the default. Dark applies under `prefers-color-scheme: dark` (unless the user picks light), under `data-theme="dark"`, and inside any `.force-dark` scope. `.inverse` gives a block the opposite theme.

### Primary
- **Asphalt** (`asphalt`): ink, the primary button fill, pressed ghosts, checked filter boxes, the focus outline and the selection highlight in the light theme, and the ground in dark. It is also the brand's dark half, the colour of the logo frame and wordmark.
- **Chalk** (`chalk`): the ground in light, and ink and the primary fill in dark.
- **Asphalt Lift** (`asphalt-lift`): primary hover in light. In dark the primary hover is **White** (`white`).

### Secondary
- **Signal Yellow** (`signal-yellow`, `--signal`, with `--on-signal` asphalt text): the brand's road marking and the single accent. It fills the event tag and the decoded event marker on the homepage, scrubber progress, the corner and split resize handles on hover, the map position marker, and the dash on the logo's i.

### Tertiary
- **Kerb Grey** (`kerb-grey`): the GPS route line on the map and in recorded video, laid over a white casing, with the travelled part in asphalt.
- **Rec Red** (`rec-red`, `--rec`): the record control's dot, and the record button's fill while recording.

### Neutral
- **Chalk Panel / Raised / Hover / Press** and **Asphalt Panel / Raised / Hover / Press** (`--panel`, `--raised`, `--hover`, `--press`): the warm grey steps. Panel is the sidebar, empty-state card, map panel, keys card, segmented track, homepage cards and the demo title bar. Raised is secondary buttons, selects, the theme-switch track, the day indicator, key caps and placeholders. Hover and press are interaction states, the placeholder pulse, slider tracks and the selected segment.
- **Asphalt Ink 2/3** (light) and **Chalk Ink 2/3** (dark) (`--ink-2`, `--ink-3`): supporting text and inactive tools; then counts, metadata, group labels and inactive filter rows.
- **Stage Black** (`stage-black`, `--stage`): the viewer, the demo player and toast text. It is the same in both themes.
- **Media Scrim** (`media-scrim`): the translucent black behind text on footage (duration badges, camera captions, the save-frame button), with white text.
- **Scrim Chalk / Scrim Asphalt** (`--scrim`): the drag-to-open overlay over the library.

### Named Rules
**The One Lane Marking Rule.** Signal yellow is the only accent, and it marks position or significance: playback progress, events, handles, the map marker. It is not used as a side stripe or selection tab; selection is ink and tone. It is a fill or a stroke, never text on a light ground (about 1.6:1). On light it carries asphalt text; on dark it may stand alone.

**The Ink Is The Action Rule.** Buttons and selections do not use yellow. Emphasis on controls comes from inverting to ink on ground: the primary button, the pressed toggle, the checked box, the homepage privacy field.

**The Red Means Recording Rule.** `--rec` belongs to the recording state. Parking is the ink tag, not a hue. Cameras are told apart by dot shape (filled, ring, square), not by colour.

**The Role-Variable Rule.** Components reference the role variables, so they work in light, in dark, inside `.force-dark` and inside `.inverse` without modification.

## Typography

**Font:** Manrope (Google Fonts, weights 400 to 800) everywhere, in the app and on the homepage, with a Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial fallback. It is also the face of the outlined wordmark in the brand kit.

**Character:** A geometric grotesque with open counters. ExtraBold (800) at tight tracking (-0.035em) gives the homepage its poster headlines, while the app's own headings stay a step lighter (650) so the chrome stays calm. Tabular figures are on globally (`'tnum' 1`).

### Hierarchy
- **Display** (800, clamp 44 to 112px, 0.94, -0.035em, max 14ch, balanced): the closing homepage headline. The hero uses a smaller step, **Hero display** (clamp 44 to 88px, 0.98).
- **Display 2** (800, clamp 36 to 80px, 0.98): the privacy field heading.
- **Headline** (800, clamp 32 to 56px, 1.0, max 18ch): homepage section headings.
- **Step title** (700, 24px, 1.1): homepage step headings. Decoded file names (**File name**) are 600 at clamp 18 to 28px with +0.01em tracking, and the demo route speed is 700 at 30px.
- **Lead** (400, clamp 17 to 20px, 1.55, max 44ch, `--ink-2`) and **Body large** (400, clamp 17 to 19px, 1.55, max 54ch): homepage running text.
- **App display** (650, 26px, 1.2, -0.02em): the empty-state heading.
- **App headline** (650, 22px, 1.2, -0.015em): the library title in the sticky toolbar.
- **Title** (650, 18px, 1.3, -0.01em): day headings and the no-results heading. The viewer heading uses a 17px step, and the keys-card heading is 700 at 15px.
- **Body** (400, 15px, 1.5): app running text, max 44ch in the empty state.
- **Label** (600, 14px): buttons, selects, tile times, the playback time, filter rows and nav and footer links (15px in the footer).
- **Caption** (400, 13px, 1.45): counts, metadata, group labels (600, `--ink-3`), hints and the local-only note.
- **Tag** (650, 12px, line-height 1): state tags and camera captions. Duration badges use 600.
- **Key** (700, 12.5px): app key caps. Homepage key caps are 600 at 14px.
- **Speed** (650, 30px, 1, -0.02em): the GPS speed numeral in the viewer.

### Named Rules
**The One Face Rule.** Manrope is the only family. Hierarchy comes from size and weight (800 for homepage headlines, 650 to 700 for app headings, 600 for labels, 400 for text), never from a second face.

**The Tabular Rule.** Every number uses tabular figures. Timecodes write centiseconds after the locale's decimal separator (0:00,00 in Dutch and German, 0:00.00 in English).

**The Sentence-Case Rule.** Labels, legends, tags and headings are in sentence case. Nothing is uppercase or letter-spaced for decoration.

## Layout

**App.** A two-column grid, 264px sidebar and fluid main, filling 100dvh. The sidebar is a flex column with 16px gaps (18px 16px 16px padding): the logo (30px tall) at top, then the folder action, filters and day list, with the local-only note, language select and theme switch pinned to the bottom. The main column scrolls on its own, with a 72px sticky toolbar (14px 32px padding) over day sections whose headings stick below it. The library grid auto-fills tiles with a minimum width of `--tile` (default 260px, 180 to 420px via the zoom slider), with 20px row and 14px column gaps. Day sections sit 36px apart, the page gutter is 32px, and there is 48px of bottom padding.

**Viewer.** A full-screen three-row grid: a header bar (10px 16px), the stage, and a controls strip (8px 16px 14px). The stage has three layouts: side by side (with a draggable split), picture-in-picture (inset at bottom-right, 16px from the edges, resizable from its top-left corner) and single. An optional 340px map panel sits to its right with a 12px gap. The keyboard shortcuts card floats at the bottom-right (16px in, 96px up, max 380px wide).

**Homepage.** Content is centred at `min(100% - 2 × gutter, 1360px)` with a fluid gutter (16 to 48px) and a fluid section space (96 to 176px). The hero is two columns (0.9 : 1.25): copy on the left, a 16:9 muted looping video on the right. It fills the first screen (up to 860px). The interactive demo has its own section below. Content sections are asymmetric two-column grids, and feature sections alternate the media side. The nav is a 68px sticky bar that is transparent at the top and takes the ground colour once the page scrolls. The footer is a full-width inverted band holding the logo (56 to 112px tall), a local-only line and section links.

**Responsive.** App: at 1100px and below, segment labels collapse to icons and the map narrows to 280px. At 820px and below, the shell stacks, filters wrap, the day list and zoom hide, gutters drop to 16px, the side-by-side stage stacks and the map becomes 320px tall. Homepage: at 1000px and below, every two-column grid (hero included) becomes one column with media first in feature sections, the nav links hide, and the demo shows 2 columns of 4 tiles. At 560px and below, the nav CTA hides and the logo shrinks to 24px.

**Spacing rhythm:** 4 / 8 / 12 / 16 / 24 / 32 / 48. Inside controls, 2, 6, 10 and 14px are used for fine optical adjustment.

## Elevation & Depth

The system is flat. Depth comes from tonal stepping (ground, panel, raised, hover, press), and the viewer drops to stage black. The homepage uses inversion instead of elevation: the privacy field and the footer flip to the opposite ground. Overlapping media is separated by an outline in the colour of the ground underneath, not by a shadow.

### Shadow Vocabulary
- **Transient overlay** (`box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4)`): the toast, which floats over video for 2.6 seconds.
- **Popover** (`box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45)`): the keyboard shortcuts card, which floats over the stage while open.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces separate by grey step, not by border or shadow. Shadows belong only to things that float temporarily over video (toast, popover).

**The Ground-Cut Rule.** When one image overlaps another, cut it out with an outline in the colour beneath it: 2px for the tile rear inset and the stage picture-in-picture, 3px for the larger homepage pair.

## Shapes

Small, consistent rounding in the app:
- 6px (`md`): buttons, tiles, thumbnails, selects, filter rows, the day indicator, the map panel and video views.
- 4px (`sm`): tags, badges, captions, check boxes, key caps and the rear inset.
- 8px (`lg`): the segmented track, the theme-switch track and the toast, with 5px (`nested`) segments inside so they sit concentrically with 3px padding.
- 12px (`xl`): the empty-state card, the drag overlay and the keys card.
- 2px (`hairline`): range tracks and the split handle.

The homepage opens up the scale for larger objects: 10px (`card`) for decode rows, FAQ rows, feature photographs and the route card; 14px (`frame`) for the demo window; 16px (`media`) for the hero video; 18px (`field`) for the inverted privacy field.

The play button, the slider thumbs and the toggle knob are circles, and the toggle track is a pill. Thumbnails are always 16:9, and the rear inset is 32% of the tile, also 16:9. The picture-in-picture resize grip is a 12px signal-yellow L shape (a filled square cut with a clip-path polygon, 3px arms) that echoes the viewfinder corners of the logo. There are no strokes on surfaces. The only lines are the focus outline, ground-cut outlines, the hollow check box and the handles.

## Components

### Buttons
Calm, solid and compact. They press down slightly when clicked.
- **Shape:** 6px corners, 36px tall, 0 14px padding, 600 weight 14px label. An optional icon sits 8px before the label.
- **Primary:** an ink fill with ground-coloured text (asphalt on chalk in light, chalk on asphalt in dark). Hover moves toward full contrast. It holds the "open the app" and "choose folder" actions, one per view.
- **Secondary:** a Raised fill with ink text, Hover on hover, and Press with scale(0.97) on active.
- **Ghost:** transparent. A pressed ghost (aria-pressed) inverts to ink fill with ground text. Icon-only ghosts are 40px wide.
- **States:** background and colour change over 140ms, and the press scale runs over 160ms on the ease-out curve. Disabled is 0.35 opacity with no transform.
- **Large:** 46px tall, 0 22px padding, 15px label, used for the homepage CTAs and the empty state.
- **Play:** a 44px ink circle on the dark stage that turns white on hover.
- **Record ("Save video"):** a secondary button with a red dot. While recording, it fills with Rec Red and white text, and the dot pulses (1.2s). It records the visible stage layout and the map.

### Theme switch (signature)
A three-way radio group (system, light, dark) of 16px stroke icons on a Raised track (3px padding, 8px radius). The selected option is a 32 by 28 ground-coloured pill (5px radius) with an ink icon; unselected icons are `--ink-3` and turn ink on hover. Choosing a theme reveals the new theme in a circle that expands from the pressed button over 560ms on the ease-out curve.

### Filter rows (Chips)
- **Style:** full-width 34px rows: a 16px rounded-square box (4px radius, 2px inset ring in `--ink-3`), the label, then a caption count on the right.
- **State:** when checked, the box fills with ink and draws a checkmark that scales in over 200ms. When off, the label drops to `--ink-3`. Hover is the Hover step, and pressing scales the box to 0.85.

### Moment tiles (signature)
- **Composition:** the front camera fills a 16:9 thumbnail with 6px corners. The rear camera is a 32% inset at bottom-right (8px from the edges, 4px radius), ground-cut with a 2px outline. The state tag sits at top-left and the duration badge (Media Scrim, white 12px 600) at bottom-left. The meta row below holds the time (14px 600) and camera labels marked by shape.
- **Loading:** the placeholder pulses Raised to Hover (1.4s). The image fades in over 320ms while it settles from scale 1.04.
- **Hover:** the image scales to 1.035 over 600ms and the inset lifts 2px. Active scales the tile to 0.98. The focus ring sits 4px out.
- **Entrance:** tiles stagger in (opacity and a 14px rise, 420ms, 25ms apart). Opening a tile morphs each thumbnail into its camera view (420ms, ease-out), and closing morphs back.

### Tags
- **Event:** a signal-yellow fill with asphalt text. **Parking:** an ink fill with ground text. Both are 22px tall with 4px corners and 12px 650 text, and shrink to 18px with 11.5px text in the viewer header.

### Inputs / Fields
- **Select:** a Raised fill, no stroke, 6px corners, 36px tall (34px compact), with a drawn chevron. Hover is the Hover step.
- **Range:** a 4px `--press` track with ink progress and a 14px ink thumb (1.15 on hover, 1.3 while dragging). The scrubber spans the full width with signal-yellow progress, and its track thickens to 6px on hover.
- **Volume:** a speaker button whose 84px range slides open on hover or focus (220ms).
- **Toggle:** a 30 by 18 pill, Press when off and ink when on. The 14px knob changes from `--ink-2` to stage black and slides over 260ms.
- **Focus:** a global 2px ink outline at a 2px offset.

### Navigation
- **Day list:** 32px rows of 14px `--ink-3` text with the count on the right. Hover and current turn ink, and current is 600. A single Raised pill slides under the current day on a spring (stiffness 420, damping 38); the current day is marked only by that pill and 600-weight ink text.
- **Segmented layout switch (viewer):** a Panel track (3px padding, 8px radius). A Press pill moves between 30px segments by animating its clip-path inset over 320ms on the ease-out curve.
- **Homepage nav:** the horizontal logo, section links (14px 600, `--ink-2`, Raised on hover), then the theme switch, language select and a primary CTA.
- **Footer:** an `.inverse` band with the logo, a local-only line, and section links (15px 600, Raised on hover).

### Viewer
A stage-black, always-dark (`.force-dark`) full-screen dialog. Each video view is a 6px-rounded black frame with a camera caption (Media Scrim, 12px 650) at top-left and a hover-revealed save-frame button at top-right. Saving a frame flashes the view white (420ms). Moving to the previous or next clip slides the stage vertically (out 300ms, in 380ms) instead of morphing. Resize handles appear on hover: a yellow L-shaped corner grip on the picture-in-picture view (it nudges 2px outward on hover), and a 4px `--ink-3` grip on the split that turns yellow and stretches to 1.3 while you drag. The map marker is a yellow dot ringed in asphalt on a kerb-grey route. The toast is a chalk pill with stage-black text that springs in (stiffness 520, damping 34).

### Keyboard shortcuts card
A dark popover (`.force-dark`, Panel, 12px radius, 16px 18px 18px padding) anchored at the bottom-right of the viewer. It holds a two-column list of key caps (26px, Raised, 700 12.5px) and descriptions (13.5px, `--ink-2`). It rises 10px and scales from 0.98 on open (260ms).

### Homepage surfaces
- **Hero video:** a 16:9 muted looping drive in a 16px-rounded asphalt frame, with a 40px round play/pause control (asphalt scrim, chalk glyph) that appears on hover, on focus, or while paused.
- **Demo window:** a 14px-rounded working fragment of the app with a Panel title bar (42px), a three-column tile grid, and a forced-dark player that the tiles morph into (460ms).
- **Cards:** decode rows and FAQ rows are Panel fills with 10px corners and 18px 20px padding, stepping to Raised on hover or when open. In decoded file names, the parts are lit by inverting them to ink, and the event part takes the yellow marker.
- **Inverted field:** the privacy section is an ink field with ground text and 18px corners.
- **Entrances:** each section staggers its heading, text and media in as it enters view (700ms, 28px rise, 75ms apart). Feature photographs drift slowly against the scroll.

## Do's and Don'ts

### Do:
- **Do** style every component against the role variables (`--bg`, `--panel`, `--raised`, `--ink`, `--primary`, `--signal`, `--rec`) so it works in light, in dark, inside `.force-dark` and inside `.inverse`.
- **Do** separate surfaces by grey step (ground, panel, raised, hover, press) rather than by border or shadow.
- **Do** use signal yellow for position and significance (playback progress, events, handles, map marker), as a fill with asphalt text or a bare mark.
- **Do** make emphasis on controls by inverting to ink on ground.
- **Do** keep the viewer and anything that frames footage dark in both themes (`.force-dark`, stage black).
- **Do** keep thumbnails 16:9 at 6px corners and show the rear camera as a 32% inset with a ground-cut outline.
- **Do** set every number with tabular figures, with centiseconds after the locale's decimal separator.
- **Do** run state changes at 140 to 200ms, and entrances and morphs on the ease-out curve (cubic-bezier(0.22, 1, 0.36, 1)) through view transitions or the motion library. Under prefers-reduced-motion, skip every transition and entrance.
- **Do** use the brand-kit logo inline (it follows the text colour; the road dash stays yellow), and draw icons as inline stroke SVGs (stroke-width 2, round caps).

### Don't:
- **Don't** set signal yellow as text on a light ground, use it as a panel fill or large area of colour, or use it as a side stripe on selected rows.
- **Don't** introduce a second accent hue; the palette is asphalt, chalk, kerb grey and signal yellow.
- **Don't** use `--rec` red for anything but the recording state.
- **Don't** add gradients, glass or backdrop blur, or resting shadows to any surface. Only floating overlays (toast, shortcuts popover) cast shadows.
- **Don't** add a second typeface; Manrope carries the whole system.
- **Don't** use uppercase or letter-spaced labels; group labels are sentence case in 13px 600 `--ink-3`.
- **Don't** tint the stage. The viewer background stays stage black in both themes so the footage is the brightest thing on screen.
