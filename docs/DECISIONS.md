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
