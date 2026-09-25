# AGENTS.md

Rules for every agent (Claude, GPT, Codex, …) working in this repo.

## Working rules (all projects)
- Keep token use low; spend more only when a task is complex and needs it.
- Explain and summarise in plain words.
- Short progress updates, only when something important changed.
- Decide after research instead of asking. Ask the owner only for input or actions an AI can't do (payments, logins, secrets, device checks).
- No guessing, even on simple tasks: check first, or say it can't be verified.
- After each task, review what was built; fix it before moving on.
- Precision at every layer: code, tests, tasks, messages.
- Prevent, don't apologise: catch anything catchable before it ships.
- While building: focused tests per change. Full regression + full QA once, on the finished build.
- Plan risks and fixes at design, build and release.
- One file per topic: update it, never make v2/final/copy/patch versions.
- New repo: add these rules as AGENTS.md (and a CLAUDE.md containing @AGENTS.md).

## This project: Marc's portfolio site
- Audience: employers and recruiters hiring junior civil engineers in Australia.
- **Truth only.** Every claim on the site must come from Marc's resume or from facts Marc has confirmed in writing. No invented numbers, projects, quotes, logos or skills. Missing content is a visible placeholder until Marc supplies it.
- **Privacy.** This repo is public. Don't commit the resume PDF, phone number, visa details or other personal data until Marc has confirmed they may be public.
- **Accessible to everyone.** Target WCAG 2.2 AA: semantic HTML, keyboard access, visible focus, 4.5:1 text contrast, reduced-motion support, works at 320 px wide with no sideways scroll.
- Research and design decisions live in `docs/RESEARCH.md` and `docs/DECISIONS.md` (one file each, kept current).
