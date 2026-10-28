# Fred Loves AI

**Website:** https://fredlovesai.com  
**Repository:** https://github.com/Fred-Leo/fred-loves-ai

An independent notebook on artificial intelligence, practical experiments, and building useful things. This is a personal exploration and portfolio project, not a consultancy.

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production checks

```bash
npm run lint
npm run build
```

## Project structure

- `src/app/portfolio.tsx` — homepage and projects
- `src/app/about/page.tsx` — author information
- `src/app/globals.css` — responsive visual design
- `src/app/layout.tsx` — shared layout and metadata

## Status

The core redesigned site source has been imported to GitHub. **This import has not yet passed a fresh build or lint check.** The original `package-lock.json` and binary favicon are not yet imported, and the CSS was compacted/adapted during transfer. This repository is not yet confirmed to exactly match the supplied ZIP. Live deployment and DNS are not verified.

## For future maintainers

This is the canonical GitHub repository. Preserve the existing visual identity. Keep unrelated Letters to Fred essays out of this codebase. Do not commit secrets or claim deployment before checking it.
