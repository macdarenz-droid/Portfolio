# Research

What the design is based on. Sources: live CSS pulled from linear.app on 25 Sep 2026 (marked "measured"); everything else is from published design knowledge and well-known studies, not re-checked this session (marked "known").

## 1. Premium product sites

### Linear (measured)
- Type: Inter Variable. Large titles 3–4.5rem with tight negative tracking.
- Dark palette: ground `#08090a`, raised surface `#ffffff08`, text `#f7f8f8`, secondary `#d0d6e0` / `#b4bcd0`, tertiary `#8a8f98`, hairline border `#ffffff14`, accent `#7170ff` used sparingly.
- Light palette: ground `#fff`, surface `#f9f8f9`, text `#282a30`, border `#e9e8ea`.
- Radius 8px on most surfaces. Premium feel comes from restraint: one accent, 1px low-contrast hairlines, soft light behind the hero, calm motion.

### Vercel (known)
- Type: Geist and Geist Mono (both on Google Fonts).
- Strict black and white with a grey ramp. Visible layout grid lines with small "+" markers at intersections. Very little colour.
- Precision reads as quality: aligned edges, mono labels, consistent 1px lines.

### Height (known; the product shut down, so its site could not be checked)
- Light, calm and friendly marketing site. Soft grounds, generous spacing, rounded components, pastel category tints, product views such as task boards shown directly on the page.

### What separates premium from template
- One idea per page, carried through every section.
- Fewer colours, fewer weights, one accent.
- Real content in real product-like views instead of stock illustrations.
- Hairlines and spacing do the structuring; heavy cards and shadows are rare.
- Motion is small and purposeful; the page is complete without it.

### Traps
- Glow and gradients everywhere; every block a rounded card; emoji icons; fake stats and logo walls; a full-screen hero that hides the facts.

## 2. What employers look for (known)
- **First-screen facts** for Australian civil roles: work rights (visa type and end date), location and willingness to travel or do FIFO, driver's licence and transport, White Card, software (AutoCAD, Civil 3D), and education.
- **Scanning:** recruiters make a first pass on a resume in seconds (Ladders eye-tracking study, 2018: about 7.4 s). Put the essentials in a short, scannable "at a glance" block near the top.
- **Graduates:** employers look for evidence of the Engineers Australia Stage 1 competencies (knowledge, applying it to real problems, professional attributes). Specific, honest detail (project value, schedule, crew size, tasks done) beats adjectives.
- **Evidence:** drawings, models and site photos are the strongest proof for a civil graduate. Until Marc supplies them, the site shows marked placeholders.
- **Calls to action:** one clear primary action (email), a resume PDF, and a phone number if Marc approves it.
- **Findability:** page title and description with name + "Graduate Civil Engineer" + location; structured data (schema.org Person).

## 3. Accessibility checklist (WCAG 2.2 AA)
- Text contrast 4.5:1 (3:1 for 24px+ text and meaningful UI borders), in both light and dark themes.
- Keyboard: skip link, logical tab order, visible focus ring that is never hidden behind sticky headers.
- Targets at least 24×24 px (aim for 44×44).
- Landmarks (header, nav, main, footer), one h1, ordered headings, `lang="en-AU"`.
- Reflow at 320 px with no sideways scrolling; text zoom to 200% without loss.
- `prefers-reduced-motion` turns animation off; nothing depends on animation to be visible.
- Meaningful link text, alt text on images, decorative graphics hidden from screen readers.
