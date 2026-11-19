/* Chess Forge Stockfish 19 FULL (single-threaded) worker bootstrap.
 * First analysis downloads ~95 MB once; browser then caches it.
 * Optional: download the two files from
 *   https://github.com/nmrugg/stockfish.js/releases/tag/v19.0.1
 *   (stockfish-19-single.js + stockfish-19-single.wasm)
 * put them in this same folder, and change the URL below to
 *   './stockfish-19-single.js'
 * so the engine is served from your own site (recommended for production).
 */
try {
  importScripts('https://cdn.jsdelivr.net/npm/stockfish@19.0.1/bin/stockfish-19-single.js');
} catch (e) {
  self.postMessage('info string Failed to load full Stockfish: ' + (e && e.message ? e.message : e));
  self.postMessage('bestmove (none)');
}
