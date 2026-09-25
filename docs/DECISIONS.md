# Decisions

One line of reasoning per decision. Newest at the bottom of each section.

## Content source
- **Resume used:** Marc's master resume, supplied in chat on 25 Sep 2026. It is the source of truth. Wording may be polished for professionalism; facts stay identical.
- **Truth rule:** the site states only what that resume states, plus facts Marc confirmed in writing. Missing items (photos, drawings, LinkedIn) are shown as marked placeholders until Marc provides them.
- **School assessments (confirmed 25 Sep 2026):** Marc's assessment files were analysed privately (never committed). Marc chose to publish his working method and skills only: no assessment names, numbers or files (three of his own drawings were approved later, see below), because shared copies of the work may exist under other students' names and some calculations contain errors. Added from that evidence, with his confirmation: the six "How I work" steps, the standards and methods list (Austroads guides, AS 1742.14, AS 1726, AS 1289, AS 4100, AS/NZS 1170, ISO 31000, options analysis, hand calculations, cost estimates, risk registers) and that he lodged Before You Dig Australia enquiries.
- **Diploma dates:** Marc confirmed February 2024 – February 2026 (the master resume says December 2024; school emails show classes from February 2024).
- **Not claimed:** SIDRA, OpenRoads and extra Excel modelling. Marc said he did not use them himself.
- **Drawings (confirmed 25 Sep 2026):** after a private lecturer-style review of his coursework, Marc chose three of his own visuals for the site: the road cross-section (AutoCAD), the pedestrian truss bridge (Revit) and the footing and column (AutoCAD 3D). Visuals that were copied, generated or contained errors were left out, and his utility plan from a Before You Dig Australia response stays private because asset owners supply those plans for the enquiry only. Images are re-encoded with no file metadata and the Revit capture is cropped to the model.
- **Road cross-section:** a redraw with a title block and corrected notes was shown first, labelled "redrawn". Marc asked to drop the redrawn label and keep revision A. A redraw cannot be presented as his July 2025 AutoCAD issue, so the site now shows his original AutoCAD drawing (revision A), cropped to the section view. The notes box is left off because it holds the enquiry number and wording the review flagged. If Marc redraws it himself in AutoCAD, his version can replace it.

## Privacy
- The repo is public. On 25 Sep 2026 Marc approved showing his email, phone number and visa line (Subclass 485, full working rights until December 2027) on the site.
- Design prototypes containing personal details are kept in private preview pages, not in this repo.
- Referee names and phone numbers are never published. The site says "References available on request".

## Build and hosting
- Chosen design: B "Drawing Sheet", upgraded at Marc's request with an animated topographic-contour background, gradient wash and premium tap, click and swipe interactions.
- The resume PDF (`assets/Marc-Darenz-Masarate-Resume.pdf`, A4, 2 pages) is built from `resume.html`: the master resume's facts, the confirmed additions above, and "References available on request" instead of referees. To regenerate, open `resume.html` in Chrome, Print, Save as PDF, A4, background graphics on.
- Hosting: GitHub Pages (free). A `main` branch was created from the first commit so work arrives through a pull request.

## Design process
- Four design directions are prototyped before building: A "Night Shift" (Linear-inspired, dark-first), B "Drawing Sheet" (Vercel-inspired, monochrome, engineering drawing conventions), C "Site Board" (Height-inspired, light and friendly, project-board layout), D "Field Book" (Marc asked for a mixed option: serif editorial look drawing on Mercury, Stripe, Raycast, Resend, Linear, Vercel and Height).
- Build starts only after Marc picks one.
- Agent use kept minimal at Marc's request: one design agent per option, each checks itself with an automated render, contrast and layout audit. No separate research or reviewer agents. After the agents, every prototype was read in full and checked against the master resume before it was shown.

## Build: Option B "Drawing Sheet", premium pass
- **Brief:** Marc chose B and asked for a less plain background, a premium feel, animation, and tap and swipe feedback.
- **Background:** a fixed canvas of slowly moving topographic contours (every 5th line heavier, like index contours) over a soft gradient wash. Sheet surfaces are translucent so the contours show through faintly. Text contrast is checked against the darkest part of the wash. Capped at 30 fps, stops when the tab is hidden, and draws one still frame under reduced motion.
- **Pause control (WCAG 2.2.2):** the contours move for longer than 5 seconds, so the footer has a "Pause background motion" toggle. The choice is remembered.
- **Motion never hides content:** sections ease up from a visible state. The hero drawing plots in with CSS only, so it still finishes if main.js fails. All motion stops under prefers-reduced-motion.
- **Projects:** a scroll-snap carousel following the WAI-ARIA APG carousel pattern, with no auto-advance. Without JS it is a plain scrollable row.
- **How I work:** WAI-ARIA APG tabs with 6 steps from Marc's confirmed working method, each paired with the related site role from his resume. Without JS all six steps show as a list.
- **Mobile header:** below 900 px the nav sits behind a menu button, so the sticky header with the station readout stays one row.
- **No dead controls without JS:** buttons that need JS carry `hidden data-js` and main.js reveals them. No external scripts; the only third-party request is Google Fonts CSS.

## Plain-language pass (25 Sep 2026)
- **Why:** Marc said parts of the site read as generic and template-like. Two reviews listed the tells: em dashes as separators, headings like "Project highlights" and "Skills and capabilities", padded resume tails ("to support safe and efficient site operations"), made-up drawing labels ("Schedule 02", "Long section 01", "Detail 1 · Scale NTS", "Drawn for"), 01–06 and C-01 codes, a "NOT TO SCALE" scale bar on every section, and the same facts repeated in two blocks.
- **Changed:** copy reworded in plain first-person Australian English with the same facts; en dashes for date ranges; the role line uses the resume's pipe; the visa line uses a colon everywhere; section labels are now the chainage only; scale bars, reference codes and the Licences column (already in Key details) removed; the hero title block shows only real fields (Scale, Rev, Date); photo placeholders are a quiet line instead of dashed boxes; small labels are sentence case. The resume and its PDF use the same wording.
- **Kept (Marc's requests):** moving contours, gradient wash, drawing plot-in, crosshair, station readout, tap marker, swipe carousel, theme reveal, pause button.
- **Marc's call (25 Sep 2026):** after the review he chose to keep all effects exactly as they are: crosshair and its readout, header chainage readout, see-through sheet with moving contours, boxed grids, and How I work as tabs. Future reviews should not propose removing them.

## Logic pass (25 Sep 2026)
- **Rule:** never pair a coursework method, standard or skill with a site job, and always say where site work happened. Marc caught "Standards" listing his Philippines job; a two-reviewer audit found the same pattern elsewhere.
- **How I work** is coursework only (Advanced Diploma, Feb 2024 – Feb 2026), matching the resume. Site work lives in Experience and Projects.
- Site experience is labelled "in the Philippines" in the search and share text; the hero names both qualifications with country and year; Key details lists education newest first with country and years; the Experience intro covers all three roles.
- Wording no longer overclaims: "to help the site run safely" (purpose, not result), "applying Australian Standards" (not "to" them), "site reports" (not "the"), "Main topics" (not one project's "Scope"); the coursework card is not called a "project" in the carousel controls.

## Drawings section (25 Sep 2026)
- **Placement:** after Projects and before How I work, in the nav and the phone menu. It is CH 0+400, so How I work, Skills, Education, Strengths and Contact each moved up one station (now 0+500 to 0+900) and the header readout still climbs steadily down the page.
- **Layout:** each drawing sits on its own framed sheet on a faint drafting grid, the same in light and dark mode (white sheets stay white, the AutoCAD screen stays dark). The road section takes the full row; from 760 px wide the bridge and footing share a row, sized so both images are the same height. One column on phones.
- **Larger view:** without JS each drawing is a plain link to its file. With JS it opens in a native modal dialog named by its caption, with a 44 px Close button, Esc, click outside to close, focus back on the drawing and page scroll locked. The drawing fills the space under the caption (beside it on short landscape screens, wrapped to its size on portrait screens; on short screens too narrow for either, such as 400% zoom, it keeps at least 9rem for the drawing and the dialog scrolls); the two screenshots stop at 1.5 times their size so they stay sharp. A short fade and rise plays only when reduced motion is off.
- **Header:** from 900 to 1023 px wide the theme button shows only its icon, as it does on phones, so the six nav links stay on one row.

## Photos and approved lines (25 Sep 2026)
- **Site photos:** Marc supplied two photos from his Field Engineer role at Grand Travaux (posted November 2019, inside the role's dates). They are cropped from his own social media posts to the photo only, the vehicle number plate is pixelated, and they are re-encoded without EXIF data. At Marc's request they are the background of the subdivision card, not framed pictures: the card is a see-through sheet over the two photos, which cross-fade slowly. Each photo is shown whole (not cropped to the card's shape) over a blurred copy of itself that fills the rest of the card. The fade follows the site's pause button and does not run under reduced motion. A 68% scrim and darker text tones inside that card keep every line at 4.5:1 or better over any pixel of either photo (lowest measured 5.86:1, light and dark, desktop and phone). A short caption on the card says what the photos show.
- **Community hall card:** Marc has no photos of the renovation and asked for no placeholder. The card uses two more facts from his resume instead (escalating issues, keeping the client and stakeholders updated). No stock or generic images, because they would not show his work.
- **Approved lines:** seven lines from the private coursework review, approved by Marc in writing, are used word for word in How I work (brief and scope, site data, options, calculations, risk and review) and the Drawings intro. "At least three options" became "more than one option", which matches every piece of his work.
- **Revit image** keeps its "Level 1 4000" tag, because removing it would mean editing the model picture.
- **Browser caching:** GitHub Pages lets browsers reuse files for 10 minutes, so a phone showed the new page with the old stylesheet (drawings overflowing, icons unstyled). `styles.css` and `main.js` are now linked with a `?v=` number that changes with every edit to them, and the inline icons carry their own size.
