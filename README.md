# Jeff the button

A cat mysteriously became a button. Press Jeff to discover one of 23 unusual websites, without repeats. Revisit discoveries from your collection. After the final discovery, Jeff shakes, disappears, and turns back into a cat. Adding a new catalog ID brings him back automatically.

## Run

No build or installation is needed. Run `python3 -m http.server 8000` in this directory and open http://localhost:8000. Any static host can serve the repository root. `npm test` runs the discovery tests.

## Add a destination

Add an entry to `catalog.js` with a unique, stable ID, name, original description, category, and HTTPS URL. Keep existing IDs stable to preserve progress. The total and remaining destinations update automatically. Discovery history is browser-local, not a global counter. A successful tab opening counts as a discovery; cross-origin page loads cannot be verified. If popups are blocked, no discovery is recorded.

## Rights and privacy

Original source code is MIT licensed. **Jeff artwork is excluded from that license**: see ASSET-LICENSE.md. It is included as user-supplied artwork for this requested project, without asserting ownership or a third-party redistribution license. Confirm ownership and grant an artwork license before describing the entire project as fully open source.

External sites are linked, never copied or embedded. Their names and content belong to their creators; no affiliation or endorsement is claimed. External services have their own terms, privacy policies, and possible account or payment requirements. Links were supplied in the brief and have not been checked for availability. The supplied Sandboxels URL is retained; maintainers can update it after verifying the destination.

No analytics, cookies, accounts, external fonts, or runtime dependencies. Local storage retains discovered IDs; unavailable storage falls back to the current session. Clearing site data clears progress. New tabs open on a direct user click with the opener detached.

The two PNG button states were extracted from the supplied PDF with their transparency preserved and embedded in artwork.js. This lets the complete site be distributed as text files without external image hosting. The original PDF is not included.
