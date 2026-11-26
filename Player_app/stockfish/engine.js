/* Chess Forge Stockfish worker bootstrap.
 * Lite single-threaded engine (~1.8 MB) — strong enough for puzzle hints & eval.
 * Files are served from this same folder (no CDN / CORS issues).
 */
try {
  importScripts('./stockfish-19-lite-single.js');
} catch (e) {
  self.postMessage('info string Failed to load Stockfish: ' + (e && e.message ? e.message : e));
  self.postMessage('bestmove (none)');
}
