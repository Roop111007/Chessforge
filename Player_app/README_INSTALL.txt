CHESS FORGE — REBUILT PLAYER (v4)

HOW TO RUN LOCALLY (required)
-----------------------------
Do NOT open player.html by double-clicking it.
Browsers block puzzle data loading under file://.

1. Open a terminal in this folder (1_Player_App).
2. Run:
     python3 -m http.server 8080
3. Open in Chrome/Edge/Firefox:
     http://localhost:8080

You should see "452 puzzles ready" (or more after full CSV import).

DEPLOY TO PRODUCTION
--------------------
Upload the entire contents of this folder (including data/) to any static
HTTPS host (Cloudflare Pages, Netlify, GitHub Pages, etc.).

Then open the HTTPS URL → Chrome menu → Install app / Add to Home screen.

IMPORTING THE FULL LICHESS CSV
------------------------------
From the package root:

  python3 import_lichess_csv.py /path/to/lichess_db_puzzle.csv

This writes data/catalog.json and data/batch-XXXXXX.json files.
Then redeploy the whole 1_Player_App folder.

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
