---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["css/style.css","js/app.js"]
---

# Surface Brief: ครัววุ้นเศษส่วน ป.4 (index.html)

- **Scope:** Primary single-page interactive learning web app (`index.html`, `css/style.css`, `js/*.js`)
- **Visitor Mode:** Operate (interactive classroom & self-study math workbench)
- **Audience:** Grade 4 Thai students (9–10 years old) and Grade 4 math teachers
- **Core Job:** Learn and practice fraction addition and subtraction where one denominator is a multiple of the other through real-time reactive visuals, slice-size comparisons, and synchronized step-by-step equations with minimal text.
- **Key Constraints:** Static GitHub Pages deploy, zero build step, non-repeating Grade-4-appropriate problems, touch targets ≥ 44×44px, high contrast for classroom projectors and mobile screens.

## Direction contract

- **THESIS:** Turn fraction addition and subtraction into a tactile Thai jelly kitchen workbench where every tap slices, overlays, merges, or scoops real-time SVG trays in lockstep with stacked textbook equations—refusing text-heavy worksheets and generic SaaS card-grid templates.
- **OWN-WORLD:** Bright classroom-porcelain pandan-mist ground (`#F4F8F6`) and crisp white tray worktop (`#FFFFFF`) with deep slate-jade ink (`#12231E`), paired with functional color fields: butterfly-pea indigo (`#3D45A8`) for the starting fraction, pandan emerald (`#118A5B`) for addition, hibiscus coral (`#D6423A`) with diagonal hatch cutout for subtraction, and turmeric gold (`#C97A00`) for live slicing knives. Typography uses `Kanit` for friendly Thai display headings and `Noto Sans Thai` with `tabular-nums` for crisp math readability; icons are uniform custom stroke SVGs (zero emojis) paired with cohesive gouache storybook illustrations of Chef Kaewta and animal customers.
- **STORY:** A Grade 4 student opens the page, immediately sees two color-coded jelly trays plus a 1-piece size comparator proving why unequal pieces cannot combine yet, taps a tray and knife multiplier (`×2`–`×6`) to watch live slicing and before/after overlay equivalence, triggers animated merging (`+`) or scooping (`−`), and watches the color-coded stacked equation write itself step-by-step—then explores freely in Sandbox or serves animal customers in Jelly Shop Game.
- **FIRST VIEWPORT:** Slim sticky top bar with Kaewta mark, 3 compact mode tabs (`ฝึกทีละขั้น`, `ทดลองเอง`, `เกมร้านวุ้น`), prominent `+ / −` switch, visual-shape toggle (circle/bar/grid), and sound toggle. Immediately below, no hero banner: the live interactive workbench opens above the fold with the two fraction trays, inline unit-size comparator bar, knife/action controls, and synchronized step-by-step equation panel visible on the first screen.
- **FORM:** Code-led Operate interactive workbench (1st of 1, `seed: none (pinned)` — "ครัววุ้นเศษส่วน ป.4: การบวกและการลบ ภาพเปลี่ยนเรียลไทม์ 3 โหมด เข้าใจง่ายไม่ใช้คำอธิบายเยอะ").
- **FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
