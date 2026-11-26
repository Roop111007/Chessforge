CHESS FORGE — PLAYER APP (v5)

HOW TO RUN LOCALLY (required)
-----------------------------
Do NOT open player.html by double-clicking it.
Browsers block loading puzzle data and the Stockfish worker under file://.

1. Open a terminal in this folder (Player_app).
2. Run:
     python3 -m http.server 8080
3. Open in Chrome/Edge/Firefox:
     http://localhost:8080

The first visit downloads ~140 MB of puzzle data (118 batch files) once and stores it in the
browser's IndexedDB. You can start playing as soon as the first batch is in; the level cards
update as more batches arrive. Later visits do not download it again.

DEPLOY TO PRODUCTION
--------------------
Upload the entire contents of this folder to any static HTTPS host (Firebase Hosting,
Cloudflare Pages, Netlify, GitHub Pages, etc.). The repo-root firebase.json publishes
the Player_app folder. Then open the HTTPS URL -> browser menu -> Install app.

FOLDER LAYOUT (names are case-sensitive on Linux and most hosts)
-----------------------------------------------------------------
  player.html          main app
  index.html           redirect to player.html
  sw.js                service worker (app shell + engine cache, NOT the puzzle batches)
  manifest.webmanifest PWA manifest
  puzzles-pack.js      optional tiny starter pack (empty by default)
  Data/                (capital D — the app requests ./Data/...)
    catalog.json
    puzzles-batch-001.json ... puzzles-batch-118.json
  icons/
    icon-192.png
    icon-512.png
  stockfish/
    stockfish-19-lite-single.js     engine (loaded directly as a Web Worker)
    stockfish-19-lite-single.wasm   engine binary (must sit next to the .js file)

PUZZLE FORMAT
-------------
Puzzles use the Lichess convention: "fen" is the position BEFORE the opponent's move and
moves[0] is that opponent move. The player then solves from moves[1]. The board is shown
from the solver's side.

BASIC vs PREMIUM
----------------
Basic   : Easy, Medium, Hard fully free; Tough and Unbeatable: first 10 puzzles each.
Premium : full collection (needs a working ./api/entitlement endpoint returning
          {"active":true,"plan":"Premium"}). Without it everyone is Basic.

FORCE RELOAD
------------
If puzzles still do not appear after a correct deploy, use "Force reload puzzles" in the
Training settings panel. It clears the local puzzle cache and downloads the batches again.
Progress and statistics are kept.

NOTES
-----
- Several batch files in Data/ are exact duplicates of other batches (006=069, 051-062 =
  063-067 and 070-076). The player skips duplicate puzzle ids automatically. You can delete
  the duplicate files and regenerate catalog.json to save hosting space.
- Chess_Forge_Content_Studio.html at the repo root is a placeholder and is not used.
