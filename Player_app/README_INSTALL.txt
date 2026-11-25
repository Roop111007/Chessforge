CHESS FORGE — REBUILT PLAYER (v4)

HOW TO RUN LOCALLY (required)
-----------------------------
Do NOT open player.html by double-clicking it.
Browsers block puzzle data loading under file://.

1. Open a terminal in this folder (Player_app).
2. Run:
     python3 -m http.server 8080
3. Open in Chrome/Edge/Firefox:
     http://localhost:8080

You should see a large number of puzzles ready (hundreds of thousands after the full data is present).

DEPLOY TO PRODUCTION
--------------------
Upload the entire contents of this folder (including data/, icons/, stockfish/) to any static
HTTPS host (Firebase Hosting, Cloudflare Pages, Netlify, GitHub Pages, etc.).

Then open the HTTPS URL → Chrome menu → Install app / Add to Home screen.

The repo root firebase.json is already configured to publish the Player_app folder.

FOLDER LAYOUT (case-sensitive on Linux / many hosts)
----------------------------------------------------
  player.html          main app
  index.html           redirect
  sw.js                service worker
  manifest.webmanifest PWA manifest
  puzzles-pack.js      optional tiny starter pack (empty by default)
  data/
    catalog.json
    puzzles-batch-001.json … puzzles-batch-118.json
  icons/
    icon-192.png
    icon-512.png
  stockfish/
    engine.js          loads Stockfish from CDN (or local files if you add them)

BASIC vs PREMIUM
----------------
Basic  : first 100 puzzles per level on first launch.
         +100 more per level on each monthly anniversary of first launch.
Premium/Ultimate : full collection (requires working ./api/entitlement endpoint).

FORCE RELOAD
------------
If puzzles still do not appear after a correct deploy, use the
"Force reload puzzles" button on the home screen. It clears the local
IndexedDB cache and re-downloads the batches.

NOTES
-----
- Paths are lowercase (data/, icons/, stockfish/). Keep them that way on
  case-sensitive file systems.
- Chess_Forge_Content_Studio.html at the repo root is currently empty /
  incomplete and is not used by the player.
