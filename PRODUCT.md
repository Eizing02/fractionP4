# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML5, CSS3, Vanilla ES6 JavaScript, and Dynamic SVG deployed on GitHub Pages (zero build step, relative paths, offline-capable).

## Users

- **Primary users:** Thai Grade 4 students (ages 9–10) learning fraction addition and subtraction where one denominator is a multiple of the other (Standard ค 1.1 ป.4/13), using classroom tablets, personal smartphones, or desktop browsers.
- **Secondary users:** Grade 4 mathematics teachers projecting the web app onto a classroom screen to demonstrate concepts interactively alongside Lesson Plan 16 (Unit 6: Fractions).

## Product Purpose

Help Grade 4 students genuinely understand *why* denominators must be equal before adding or subtracting fractions—and *how* multiplying numerator and denominator slices pieces smaller without changing total quantity—through real-time reactive visuals, visual comparisons, step-by-step equations, and playful practice with minimal reading required.

## Positioning

A visual-first, zero-text-wall Thai fraction kitchen where every student tap immediately slices trays, compares piece sizes, overlays before-and-after equivalence, animates merging (addition) or scooping out (subtraction), and synchronizes textbook-style stacked fraction steps—without grading bureaucracy or repetitive drills.

## Operating Context

- Used during a 60-minute Grade 4 math lesson (warm-up, guided demo, individual practice, playful mastery) and for self-paced play at home via a GitHub Pages URL or classroom QR code.
- Viewed under bright classroom lighting on projectors (1280px+), tablets (768px), and smartphones (375px+).
- Inspired directly by Lesson Plan 16's Thai dessert context: Kaewta's butterfly-pea jelly (วุ้นดอกอัญชัน) and pandan jelly (วุ้นใบเตย) plus paper-folding fraction strips.

## Capabilities and Constraints

- Covers **both addition (`+`) and subtraction (`−`)** of fractions where one denominator is a multiple of the other.
- Strictly calibrated to Grade 4 difficulty across 3 levels (denominators up to 12, 18, and 24; multipliers ×2 to ×6; subtraction always guarantees non-negative results).
- Guaranteed **non-repeating problems** per level/operation using a persistent shuffle bag and anti-mirror filtering.
- Supports 3 real-time visual models: circular jelly trays, fraction bars, and grid trays (handling improper fractions > 1 tray, whole numbers = 1, mixed numbers, and simplification to lowest terms).
- **Explicit exclusions:** No student name/ID form, no formal pass/fail grading threshold, no backend or login required.
- Minimal Thai copy (short 2–5 word visual cues instead of explanatory paragraphs).
- Ships custom-generated cohesive illustrations for characters and stickers alongside exact dynamic SVG math visuals.

## Brand Commitments

- Thai name: **ครัววุ้นเศษส่วน ป.4** (Fraction Jelly Lab).
- Anchored in Lesson Plan 16's Thai jelly kitchen character (**น้องแก้วตา**) and butterfly-pea / pandan jelly context.

## Evidence on Hand

- Grade 4 Mathematics Lesson Plan 16 (Unit 6: Fractions, Standard ค 1.1 ป.4/13, IPST Book 2) including Kaewta's jelly problem ($\frac{1}{2} + \frac{3}{8}$) and Worksheet 16 (6 problems spanning whole-number sums, improper fractions, right-side conversion, mixed numbers, and simplification).
- No real student scores, testimonials, or external user metrics exist and none may be fabricated.

## Product Principles

1. **Show, don't explain:** Every mathematical rule is proven visually through real-time slicing, unit-size comparison, and animated merging or scooping rather than paragraphs of text.
2. **Synchronized dual representation:** Visual trays and stacked fraction notation always move together in exact color-coded lockstep.
3. **Safe exploration without punishment:** Trying a wrong multiplier shows mismatched slice sizes visually so students self-correct without stress or timers.
4. **Fresh, Grade-4-appropriate practice:** Every problem is unique within the session and stays within visual and cognitive reach of 9–10 year olds.
5. **Instant classroom readiness:** Loads fast on GitHub Pages with touch-first controls that work seamlessly on phones, iPads, and projectors.

## Accessibility & Inclusion

- High contrast ($\ge 4.5:1$ body text, $\ge 3:1$ large text/graphics) suitable for bright classrooms and projectors.
- Touch targets $\ge 44 \times 44\text{px}$ for young students' fingers on tablets and phones.
- Color is paired with distinct shapes, labels, patterns/hatching (for subtraction cutouts), and icons so colorblind students can follow every step.
- Respects `prefers-reduced-motion` while preserving clear state transitions.
