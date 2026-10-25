---
name: Dashcam dashboard
description: A calm graphite media library for dashcam footage, read locally in the browser.
colors:
  graphite-ground: "#1c1d20"
  graphite-panel: "#232428"
  graphite-raised: "#2b2c31"
  graphite-hover: "#34353b"
  graphite-press: "#3c3d44"
  stage-black: "#0c0d0e"
  ink: "#ececef"
  ink-secondary: "#b0b2ba"
  ink-tertiary: "#868993"
  library-blue: "#5b9dff"
  library-blue-strong: "#3f86f5"
  library-blue-soft: "rgba(91, 157, 255, 0.16)"
  on-accent: "#ffffff"
  event-red: "#ff6f61"
  parking-amber: "#f0b54a"
  rear-teal: "#4fc7b4"
  interior-lilac: "#c9a7ff"
typography:
  display:
    fontFamily: "'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
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
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  gutter: "32px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.library-blue-strong}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.library-blue}"
  button-secondary:
    backgroundColor: "{colors.graphite-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-secondary-hover:
    backgroundColor: "{colors.graphite-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "36px"
  button-ghost-pressed:
    backgroundColor: "{colors.library-blue-soft}"
    textColor: "{colors.library-blue}"
  button-large:
    padding: "0 20px"
    height: "44px"
  button-play:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stage-black}"
    size: "44px"
  filter-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "34px"
  filter-row-hover:
    backgroundColor: "{colors.graphite-hover}"
  day-link-current:
    backgroundColor: "{colors.library-blue-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "32px"
  tag-event:
    backgroundColor: "{colors.event-red}"
    textColor: "#2a0905"
    typography: "{typography.tag}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "22px"
  tag-parking:
    backgroundColor: "{colors.parking-amber}"
    textColor: "#2a1a00"
    typography: "{typography.tag}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "22px"
  select:
    backgroundColor: "{colors.graphite-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 34px 0 12px"
    height: "36px"
  segmented:
    backgroundColor: "{colors.graphite-panel}"
    rounded: "{rounded.lg}"
    padding: "3px"
  segment-selected:
    backgroundColor: "{colors.graphite-hover}"
    textColor: "{colors.ink}"
    height: "30px"
  moment-tile-thumb:
    backgroundColor: "{colors.graphite-raised}"
    rounded: "{rounded.md}"
  empty-panel:
    backgroundColor: "{colors.graphite-panel}"
    rounded: "{rounded.xl}"
    padding: "48px 44px 40px"
    width: "560px"
---

# Design System: Dashcam dashboard

## Overview

**Creative North Star: "The Quiet Photo Library"**

The interface behaves like the photo library already on the user's laptop: a graphite ground, a slightly lighter sidebar, and a grid of 16:9 thumbnails grouped under sticky day headings. The footage is the only colourful thing on screen. Chrome recedes into four close graphite steps, and one blue marks what is selected, focused, or the primary action.

Density is moderate and even. A 264px sidebar holds the folder action, camera and recording-type filters, and the day list. The main column is a sticky toolbar over day sections, and the tile size is user-controlled (180 to 420px). Opening a moment swaps to a near-black stage where the video is the subject and controls sit in a quiet strip underneath.

This is the category convention, chosen by the user, and it is executed straight: system UI sans with tabular figures, small 6px corners, no shadows at rest, no gradients, no glass. Personality comes from precision (exact times, frame numbers, centisecond timecodes), not from decoration.

**Key Characteristics:**
- Graphite tonal steps carry all hierarchy; there are no borders or shadows at rest.
- One blue accent, used for selection, focus and the primary action.
- Event red and parking amber appear as small solid state tags.
- Front and rear camera are one tile: the rear sits as an inset in the corner of the front thumbnail.
- Tabular figures everywhere, because the content is times, durations and counts.

## Colors

A neutral graphite scale with one cool blue accent and two small state colours, so the footage itself supplies the colour.

### Primary
- **Library Blue** (`library-blue`): the focus ring (2px outline, 2px offset), text selection, the front-camera dot, the brand mark, the spinner arc, and the hover state of the primary button.
- **Library Blue Strong** (`library-blue-strong`): the resting fill of the primary button and the checked toggle track. It is a deeper blue so white text stays legible on it.
- **Library Blue Soft** (`library-blue-soft`): the wash behind the current day in the day list, a pressed ghost button, and the drop target while dragging a folder.

### Secondary
- **Event Red** (`event-red`): the solid "Event" tag on locked clips, with near-black red text (#2a0905). It is also the colour of the folder-reading error hint.
- **Parking Amber** (`parking-amber`): the solid "Parkeren" tag, with near-black amber text (#2a1a00). It is also the warning icon in the playback-error panel.

### Tertiary
- **Rear Teal** (`rear-teal`) and **Interior Lilac** (`interior-lilac`): 7px camera dots in tile metadata. They tell cameras apart; they never fill a surface.

### Neutral
- **Graphite Ground** (`graphite-ground`): the app background, the sticky toolbar and the sticky day headings. It is also the 2px outline that separates the rear inset from the front thumbnail.
- **Graphite Panel** (`graphite-panel`): the sidebar, the empty-state panel, the map panel, the segmented-control track, and the playback-error panel.
- **Graphite Raised** (`graphite-raised`): secondary buttons, selects, the local-only note, thumbnail placeholders, and the hover state of ghost buttons on the stage.
- **Graphite Hover** (`graphite-hover`) / **Graphite Press** (`graphite-press`): hover and press states, the selected segment, unchecked filter boxes, slider tracks and scrollbar thumbs.
- **Stage Black** (`stage-black`): the viewer background, which lets video read as the brightest thing on screen.
- **Ink** (`ink`), **Ink Secondary** (`ink-secondary`), **Ink Tertiary** (`ink-tertiary`): primary text; supporting text and inactive tools; counts, metadata and group labels.

### Named Rules
**The One Blue Rule.** Blue means "this is selected, focused, or the thing to do". It is never decorative and never a second brand colour.

**The Small Signal Rule.** Red and amber appear as small solid tags (22px high), an inline error line, or a warning icon. They never fill a panel, tint a tile, or become a background.

## Typography

**Display Font:** Segoe UI Variable Display (with Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial)
**Body Font:** Segoe UI Variable Text (with the same system fallbacks)

**Character:** The platform's own UI face, set slightly tighter and heavier (650) for headings. It reads as the operating system's photo app, not as a brand. Tabular figures are on globally (`'tnum' 1`), so times and counts line up in columns.

### Hierarchy
- **Display** (650, 26px, 1.2, -0.02em): the empty-state heading only. Balanced wrapping.
- **Headline** (650, 22px, 1.2, -0.015em): the library title in the sticky toolbar (the folder name).
- **Title** (650, 18px, 1.3, -0.01em): day headings and the no-results heading. The viewer heading uses a 17px step of the same style.
- **Body** (400, 15px, 1.5): running text, such as the empty-state explanation (max 44ch).
- **Label** (600, 14px): buttons, selects, tile times, the playback time and filter rows.
- **Caption** (400, 13px, 1.45): counts, metadata lines, group labels (600, in ink-tertiary), hints and the local-only note.
- **Tag** (650, 12px, line-height 1): state tags, camera labels and duration badges.
- **Speed readout** (650, 30px, 1, -0.02em, display face): the GPS speed number, the one large numeral in the system.

### Named Rules
**The Tabular Rule.** Every number is set with tabular figures. Timecodes use a comma for centiseconds (0:00,00), following Dutch convention.

**The Sentence-Case Rule.** Labels, legends and tags are in sentence case at normal tracking. Nothing is uppercase or letter-spaced.

## Layout

The desktop shell is a two-column grid: a 264px sidebar and a fluid main column, filling 100dvh. The sidebar is a flex column with 16px gaps (18px 16px 16px padding), and the local-only note is pinned to the bottom. The main column scrolls on its own. Its 72px sticky toolbar (14px 32px padding) sits over day sections whose headings stick directly below it at top 72px.

The library grid is `repeat(auto-fill, minmax(var(--tile), 1fr))` with 20px row and 14px column gaps. `--tile` defaults to 260px and is driven by the zoom slider (180 to 420px). Day sections are separated by 36px. The page gutter is 32px, with 48px of bottom padding.

The viewer is a full-screen three-row grid: a header bar (10px 16px), the stage, and a controls strip (8px 16px 14px). The stage lays out side by side, picture-in-picture (inset at bottom-right, min(30%, 420px) wide, 16px from the edges) or single view. An optional 340px map panel sits to its right with a 12px gap.

Responsive behaviour: at 1100px and below, segmented-control labels collapse to icons and the map panel narrows to 280px. At 820px and below, the shell stacks into one column, filters wrap horizontally, the day list and local note hide, gutters drop to 16px, the zoom slider hides, the side-by-side stage stacks, and the map panel becomes 320px tall.

Spacing rhythm: 4 / 8 / 12 / 16 / 24 / 32 / 48, with 2, 6, 10 and 14px used for fine optical adjustments inside controls.

## Elevation & Depth

The system is flat. Depth comes from tonal stepping (ground to panel to raised to hover to press), and the viewer drops to stage black. Nothing casts a shadow at rest. Overlapping media is separated with a 2px outline in the colour of the ground underneath (the rear inset on tiles, the picture-in-picture view on the stage), not with a shadow.

### Shadow Vocabulary
- **Transient overlay** (`box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4)`): the toast only. It floats over moving video for 2.6 seconds and then disappears.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces separate by graphite step, not by border or shadow. The only shadow belongs to a transient message floating over video.

**The Ground-Cut Rule.** When one image overlaps another, cut it out with a 2px outline in the colour beneath it.

## Shapes

Small, consistent rounding: 6px for buttons, tiles, thumbnails, selects, filter rows, the map panel and video views. Tags, duration badges, captions and the rear inset use 4px. 8px is for the segmented track and the toast, and 12px for the large empty-state panel and the drag-to-open overlay. The selected segment uses 5px so it nests inside the 8px track with 3px padding. Two shapes are fully round: the play button (a 44px circle) and slider thumbs and toggles (pill). Thumbnails are always 16:9, and the rear inset is 32% of the tile width, also 16:9. There are no strokes on surfaces. The only lines are the focus outline and the ground-cut outline.

## Components

### Buttons
Calm, solid and compact. They press down slightly when clicked.
- **Shape:** gently rounded (6px), 36px tall, 0 14px padding, 600 weight 14px label. An optional 18px icon sits 8px before the label.
- **Primary:** Library Blue Strong fill with white text; lightens to Library Blue on hover. One per view: "Map kiezen" / "Andere map openen".
- **Secondary / Quiet:** Graphite Raised fill with ink text; Graphite Hover on hover. Used for "Frame opslaan" and "Laatste map opnieuw openen".
- **Ghost:** transparent. Toggled ghosts (aria-pressed) take the Library Blue Soft wash and blue text. Icon-only ghosts are 40px wide.
- **States:** the background changes over 120ms. Active is Graphite Press with scale(0.97) on the ease-out curve. Disabled is 0.35 opacity with no transform.
- **Large:** 44px tall, 0 20px padding, 15px label, used in the empty state.
- **Play:** a 44px ink circle with a stage-black glyph that turns pure white on hover. It is the one inverted control on the stage.

### Filter rows (Chips)
- **Style:** full-width 34px rows in the sidebar: a 14px rounded-square check box, the label, then a count in caption ink-tertiary on the right.
- **State:** the check box fills with the category colour and shows a CSS checkmark when on. When off, the label drops to ink-tertiary and the box is Graphite Press. Hover is Graphite Hover.

### Moment tiles (signature)
- **Corner Style:** 6px on the 16:9 thumbnail.
- **Composition:** the front camera fills the thumbnail. The rear camera is a 32% inset at bottom-right (8px from the edges), cut out with a 2px ground-colour outline. The state tag sits at top-left and the duration badge (12px 600, on 72% stage black) at bottom-left. Below the thumbnail is a meta row with the time (14px 600) on the left and camera dots with labels on the right.
- **Loading:** the placeholder pulses between Graphite Raised and Graphite Hover (1.4s). The image fades in over 200ms.
- **Hover:** the image scales to 1.03 on the ease-out curve under a 5% white veil. The focus ring sits 4px out.

### Tags
- **Style:** solid Event Red or Parking Amber fill with near-black text in the same hue, 22px tall, 4px radius, 12px 650 weight. In the viewer header they shrink to 18px tall with 11.5px text.

### Inputs / Fields
- **Select:** Graphite Raised fill, no stroke, 6px radius, 36px tall (34px compact), with a chevron drawn in ink-secondary. Hover is Graphite Hover.
- **Range:** a 4px Graphite Press track with a 14px ink thumb that grows to 1.2 while dragging. The scrubber spans the full width at 24px tall.
- **Toggle:** a 30 by 18 pill, Graphite Press when off and Library Blue Strong when on, with a white 14px knob that slides over 180ms.
- **Focus:** a global 2px Library Blue outline at a 2px offset.

### Navigation
- **Day list:** 32px rows, 14px ink-secondary text with the count on the right. Hover is Graphite Hover with ink text. The current day takes the Library Blue Soft wash.
- **Segmented layout switch:** a Graphite Panel track (3px padding, 8px radius) holding 30px segments. The selected segment is Graphite Hover with ink text; unselected segments are ink-secondary.

### Empty state
A single centred Graphite Panel card (max 560px, 12px radius) with an illustration of three overlapping 16:9 tiles (the middle one carries a blue inset), the display heading, an explanation and the primary action. While a folder is dragged over it, it takes the Library Blue Soft wash and scales to 1.015.

### Viewer
A stage-black full-screen dialog that enters with a 220ms fade and scales up from 0.985. Each video view is a 6px-rounded black frame with a camera caption (12px 650 on 70% stage black) at top-left and a hover-revealed save-frame button at top-right. The time readout shows the current position at 14px 600 and the total and frame number in ink-tertiary.

## Do's and Don'ts

### Do:
- **Do** separate surfaces by graphite step (ground, panel, raised, hover, press) rather than by border or shadow.
- **Do** reserve Library Blue for selection, focus and the single primary action per view.
- **Do** keep thumbnails 16:9 at 6px radius and show the rear camera as a 32% inset cut out with a 2px ground outline.
- **Do** set every number with tabular figures, and write timecodes as m:ss,cc.
- **Do** run state transitions at 120ms, with entrances on the ease-out curve (cubic-bezier(0.22, 1, 0.36, 1)), and collapse all motion under prefers-reduced-motion.
- **Do** draw icons as inline stroke SVGs at 18px with stroke-width 2.

### Don't:
- **Don't** add gradients, glass or backdrop blur, or resting shadows to any surface. The toast's transient shadow is the only one.
- **Don't** use Event Red or Parking Amber as a panel fill, a tile tint, or a large area of colour.
- **Don't** use uppercase or letter-spaced labels; group labels are sentence case in 13px 600 ink-tertiary.
- **Don't** introduce radii outside 4 / 6 / 8 / 12px, apart from the circular play button and pill-shaped toggles and slider thumbs.
- **Don't** tint the stage. The viewer background stays stage black so the footage is the brightest thing on screen.
