# Jeff the button

A cat mysteriously became a button. Press Jeff to discover an unusual browser game or website, without repeats. Revisit discoveries from your searchable collection, star favorites, and pick a discovery flavor. Find everything to watch Jeff shake, disappear, and become a cat again. New catalog IDs bring him back automatically.

The current catalog contains **34 destinations**, including **12 new browser games**. The Wiki Game has been removed; old browser histories remain compatible.

## Run and preview

No build or dependency installation is needed. Run `python3 -m http.server 8000` in this directory and open http://localhost:8000. Any static host can serve the repository root.

`preview.html` is a standalone version with embedded scripts, artwork, and the pixel font. It also opens directly as a local file. Run `npm run preview:build` after editing to keep it synchronized with the source. A third-party viewer is available at https://htmlpreview.github.io/?https://github.com/Thecosmiccat/Jeff-the-button/blob/main/preview.html .

`npm test` checks catalog integrity, discovery exhaustion, migration, category selection, favorites, and search. Browser verification also covered desktop/mobile layouts, real font loading, persistence, popup blocking, reduced-motion fallback, the animated ending, and the standalone preview. External games were researched from their creators’ pages; their gameplay was not automatically tested.

## Features

- The two supplied Jeff states, original pixel confetti, and a completion animation.
- Every random discovery is new. Collection links allow intentional revisits.
- Games, cats/cozy, and weird-site discovery flavors. Exhausting a flavor leaves other flavors available.
- Search and category filters, local favorites, and a latest-discovery shortcut.
- Day/night theme, optional original synthesized sound (off by default), and a Space keyboard shortcut.
- Browser-local progress, favorites, and preferences. Storage failures fall back to the current session.
- Responsive layouts, keyboard controls, visible focus, live announcements, and reduced-motion support.

## Maintain the catalog

Add an entry to `catalog.js` with a unique, stable ID, name, original description, category, and HTTPS URL. Set grouping/game metadata as appropriate. Keep existing IDs stable to preserve progress. Removed IDs are ignored in counters and collections; remaining IDs are retained. The total updates automatically. Update `fresh` metadata and featured teaser copy when changing the new-game selection.

A successfully opened tab counts as a discovery; the application cannot inspect cross-origin games or confirm that a visitor played one. A blocked popup consumes no discovery. Tabs open during a direct click with their opener detached.

## Rights and privacy

Original source code is MIT licensed. **Jeff artwork is excluded**: see ASSET-LICENSE.md. It was supplied for this project; its rights holder must choose a reuse license before the artwork can be described as open source.

Pixel typography uses **Monocraft by Idrees Hassan**, a Minecraft-inspired font under SIL Open Font License 1.1. The full font is locally embedded as WOFF in `fonts.css`; its notice and license are in `FONT-LICENSE.txt` and included in the standalone preview. See https://github.com/IdreesInc/Monocraft . The font is excluded from the MIT code license. This project is independent of Mojang and Microsoft.

External destinations are linked, never copied or embedded. Their content and names belong to their creators; no affiliation or endorsement is claimed. Their own terms, privacy policies, and availability apply. `SOURCES.md` records the twelve additions and their primary pages.

No analytics, cookies, accounts, external font requests, or runtime dependencies. Clear browser site data to reset local progress. The supplied PDF is not included in the repository.
