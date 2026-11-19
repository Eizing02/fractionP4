---
name: ครัววุ้นเศษส่วน ป.4
description: Interactive Thai Grade 4 fraction addition and subtraction visual kitchen workbench
colors:
  butterfly-pea: "#3E46AD"
  butterfly-pea-ink: "#252B75"
  butterfly-pea-soft: "#E8EAFD"
  pandan-leaf: "#0D7A50"
  pandan-ink: "#085436"
  pandan-soft: "#DEF4EA"
  hibiscus-coral: "#C4362F"
  hibiscus-ink: "#8E231D"
  hibiscus-soft: "#FCE6E4"
  turmeric-knife: "#995B00"
  turmeric-ink: "#6B3E00"
  turmeric-soft: "#FFF1D0"
  porcelain-ground: "#F4F8F6"
  worktop-white: "#FFFFFF"
  mist-surface: "#EAF2EE"
  slate-jade-ink: "#12231E"
  muted-sage-ink: "#3A534B"
  hairline-border: "#CBE0D6"
  strong-border: "#9CB9AC"
typography:
  display:
    fontFamily: "Kanit, Noto Sans Thai, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 2.5vw, 1.68rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Kanit, Noto Sans Thai, system-ui, sans-serif"
    fontSize: "1.24rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Noto Sans Thai, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Kanit, Noto Sans Thai, system-ui, sans-serif"
    fontSize: "0.94rem"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  sm: "10px"
  md: "16px"
  lg: "22px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "22px"
components:
  button-add:
    backgroundColor: "{colors.pandan-leaf}"
    textColor: "{colors.worktop-white}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  button-sub:
    backgroundColor: "{colors.hibiscus-coral}"
    textColor: "{colors.worktop-white}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  button-knife:
    backgroundColor: "{colors.turmeric-soft}"
    textColor: "{colors.turmeric-ink}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  panel-workbench:
    backgroundColor: "{colors.worktop-white}"
    textColor: "{colors.slate-jade-ink}"
    rounded: "{rounded.lg}"
    padding: "22px"
---

# Design System: ครัววุ้นเศษส่วน ป.4

## Overview

**Creative North Star: "The Sunlit Thai Jelly Kitchen Workbench"**

A bright, tactile classroom workbench built for 9–10 year old Grade 4 learners under daylight and projector lighting. Every color, divider, and shape performs a direct mathematical job so students understand fraction equivalence, addition, and subtraction by looking and tapping rather than reading paragraphs.

The visual system deliberately refuses generic SaaS dashboards, nested cards inside cards, emoji icon substitutes, and warm-cream-and-terracotta editorial defaults. Instead, crisp pandan-mist porcelain grounds open white trays where vibrant Thai dessert hues—butterfly-pea indigo, pandan emerald, hibiscus coral, and turmeric gold—synchronize the SVG trays with stacked textbook equations.

**Key Characteristics:**
- Color-coded mathematical lockstep between SVG fraction trays and stacked numerals.
- Flat, open workbench surfaces separated by clean hairlines rather than nested boxes.
- Touch-first 44px+ controls with gentle, non-punitive visual feedback.
- Cohesive hand-painted gouache Thai storybook characters blended seamlessly onto light porcelain surfaces.

## Colors

A high-contrast classroom light palette anchored in pandan-mist porcelain where four functional Thai dessert hues encode distinct mathematical roles, every foreground/background pair exceeding WCAG AA ($\ge 4.5:1$).

### Primary
- **Butterfly-Pea Indigo** (`butterfly-pea`): Starting fraction (ตัวตั้ง / วุ้นดอกอัญชัน), primary navigation next-step buttons, and focus outlines.

### Secondary
- **Pandan Leaf Emerald** (`pandan-leaf`): Addition operator, second addend (วุ้นใบเตย), and matched-denominator success states.
- **Hibiscus Coral** (`hibiscus-coral`): Subtraction operator, diagonal-hatch cutout overlay for scooped pieces, and unequal-size warning icons.

### Tertiary
- **Turmeric Knife Gold** (`turmeric-knife`): Live slicing multiplier lines, knife controls (`×2`–`×6`), before/after equivalence overlay, and simplification sparkles.

### Neutral
- **Porcelain Ground** (`porcelain-ground`): Main viewport canvas.
- **Worktop White** (`worktop-white`): Active workbench stage and live equation panel.
- **Mist Surface** (`mist-surface`): Segmented control tracks and subtle neutral pills.
- **Slate-Jade Ink** (`slate-jade-ink`): Primary text and original fraction tray boundaries.
- **Muted Sage Ink** (`muted-sage-ink`): Secondary labels and inactive tab states.

**The Mathematical Color Rule.** Never use Butterfly-Pea, Pandan, Hibiscus, or Turmeric as arbitrary decoration; each hue maps strictly to starting fraction, addition, subtraction, and slicing respectively.

## Typography

**Display Font:** `Kanit` (with `Noto Sans Thai`, `system-ui` fallback)
**Body Font:** `Noto Sans Thai` (with `system-ui` fallback)

**Character:** Friendly, legible Thai geometric display headings paired with crisp classroom body copy and `tabular-nums` so stacked fraction numerators and denominators stay vertically aligned during real-time updates.

### Hierarchy
- **Display** (700, `clamp(1.3rem, 2.5vw, 1.68rem)`, line-height 1.15): App brand title in the top bar.
- **Headline** (700, `1.24rem`, line-height 1.25): Panel headings such as `วิธีทำทีละขั้น` and `วิธีทำสด`.
- **Body** (400–600, `1rem`, line-height 1.45): Short visual cue prompts and feedback lines (2–5 words).
- **Label** (600–700, `0.94rem`, line-height 1.2): Segmented switches, knife multipliers, and fraction tags.

**The Tabular Numerals Rule.** Every stacked fraction, knife multiplier, and readout uses `font-variant-numeric: tabular-nums` so live updates never shift layout horizontally.

## Layout

Mobile-first single-column layout (`< 1000px`) scaling into a two-zone studio workbench (`minmax(0, 1.45fr) minmax(320px, 0.95fr)` at `≥ 1000px`) capped at `1220px` max width. On mobile (`< 680px`), the top bar stays static to maximize vertical viewport for the fraction trays and wraps cleanly into three compact rows (brand + sound, operation + shape controls, mode tabs). On tablet and desktop (`≥ 680px`), the top bar becomes sticky and mode tabs join the main header row.

## Elevation & Depth

Surfaces remain flat and crisp by default, separated primarily by `1.5px` hairline borders (`hairline-border`) and generous spacing. Only top-level workbench panels and primary pill CTAs carry a soft ambient shadow (`0 2px 8px rgba(18, 35, 30, 0.06)`).

**The No-Nested-Cards Rule.** Inner sections inside a workbench panel—such as the Kaewta cue strip, fraction trays, unit comparator, and equivalence overlay—never receive secondary bordered card shells; they use open whitespace and hairline dividers.

## Shapes

Generous rounded workbench panels (`22px`), pill-shaped primary CTAs and segmented switches (`999px`), and rounded-square knife multiplier buttons (`10px`). All SVG fraction trays (circle, bar, grid) share consistent `2.2px` ink outlines and dashed `2px` turmeric cut lines.

## Components

### Buttons
- **Shape:** Full pill (`999px`) for mode tabs, segmented controls, and primary CTAs; rounded rectangle (`10px`) for knife multipliers.
- **Primary:** Solid Pandan (`button-add`) for combining, Hibiscus (`button-sub`) for scooping, Butterfly-Pea for next problem, all with white text ($\ge 5.1:1$ contrast) and `min-height: 44px`–`52px`.
- **Hover / Focus:** Hover states are gated inside `@media (hover: hover)`; keyboard focus renders a `3px` solid Butterfly-Pea ring with `2px` offset.

### Navigation
- Compact top bar containing brand mark, 3-tab segmented mode switcher (`ฝึกทีละขั้น`, `ทดลองเอง`, `เกมร้านวุ้น`), `+ / −` switch, visual shape switcher (`ออโต้`, circle, bar, grid), and mute toggle.

### Interactive Fraction Trays & Unit Comparator
- Dynamic SVG renderer supporting multi-tray improper fractions (`> 1`), live turmeric sub-slice cuts (`×2`–`×6`), diagonal coral subtraction cutouts, side-by-side 1-piece unit-size comparison bars, and a touch-safe (`touch-action: pan-y`) before/after equivalence overlay slider.

## Do's and Don'ts

### Do:
- **Do** keep all interactive buttons at least `44×44px` (`46px`–`52px` on `@media (pointer: coarse)`).
- **Do** pair subtraction cutouts with diagonal hatching so colorblind learners distinguish removed slices without relying on color alone.
- **Do** keep instructional copy concise (2–5 Thai words) and let real-time SVG changes demonstrate every rule.
- **Do** blend gouache character illustrations with `mix-blend-mode: multiply` on white/tinted light surfaces without artificial circular crop masks.

### Don't:
- **Don't** substitute Unicode emojis for UI icons; use the uniform `2px`-stroke SVG icon set.
- **Don't** nest bordered cards inside workbench panels or add decorative one-sided left border strips.
- **Don't** introduce countdown timers, harsh error buzzers, or negative subtraction problems in Grade 4 modes.
