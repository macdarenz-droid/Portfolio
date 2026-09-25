# Decisions

One line of reasoning per decision. Newest at the bottom of each section.

## Content source
- **Resume used:** Marc's master resume, supplied in chat on 25 Sep 2026. It is the source of truth. Wording may be polished for professionalism; facts stay identical.
- **Truth rule:** the site states only what that resume states. Missing items (photos, drawings, named diploma projects, LinkedIn) are shown as marked placeholders until Marc provides them.

## Privacy
- The repo is public. On 25 Sep 2026 Marc approved showing his email, phone number and visa line (Subclass 485, full working rights until December 2027) on the site.
- Design prototypes containing personal details are kept in private Claude artifacts, not in this repo.
- Referee names and phone numbers are never published. The site says "References available on request".

## Build and hosting
- Chosen design: B "Drawing Sheet", upgraded at Marc's request with an animated topographic-contour background, gradient wash and premium tap, click and swipe interactions.
- The resume PDF on the site is a new portfolio resume built from the master resume plus confirmed school-assessment evidence, with referees removed.
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
- **How I work:** WAI-ARIA APG tabs with 6 steps, using resume content only. Marked `data-evidence="pending"` until Marc's assessment evidence is added. Without JS all six steps show as a list.
- **Mobile header:** below 900 px the nav sits behind a menu button, so the sticky header with the station readout stays one row.
- **No dead controls without JS:** buttons that need JS carry `hidden data-js` and main.js reveals them. No external scripts; the only third-party request is Google Fonts CSS.
