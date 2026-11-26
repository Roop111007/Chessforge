#!/usr/bin/env python3
"""
Rebuild Chess Forge puzzle batches:
  * removes duplicate puzzles (many batch files in the repo are byte-identical copies),
  * sorts every level globally from easiest to hardest, so "puzzle 1, 2, 3 ..." is a real
    difficulty progression and the first batches are the easiest,
  * rewrites puzzles-batch-NNN.json (1000 puzzles per level per batch) and catalog.json.

Usage (from the repo root):
    python3 tools/rebuild_data.py --src Player_app/Data --out Player_app/Data_new
Then check the result, delete Player_app/Data and rename Data_new to Data.
The new catalog has a new "version", so every browser re-downloads the puzzles once
(old local progress numbers are reset automatically because numbering changes).
"""
import argparse, glob, json, os, sys, time

LEVELS = ['Easy', 'Medium', 'Hard', 'Tough', 'Unbeatable']
PER_LEVEL = 1000

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', default='Player_app/Data')
    ap.add_argument('--out', default='Player_app/Data_new')
    a = ap.parse_args()

    files = sorted(glob.glob(os.path.join(a.src, 'puzzles-batch-*.json')))
    if not files:
        sys.exit('No puzzles-batch-*.json files found in ' + a.src)

    seen, dupes, skipped = set(), 0, 0
    levels = {lv: [] for lv in LEVELS}          # lists of (score, rating, id, json_string)
    for fn in files:
        with open(fn, encoding='utf-8') as f:
            batch = json.load(f)
        for lv in LEVELS:
            for p in batch.get('puzzles', {}).get(lv, []):
                pid = p.get('id')
                if not pid or not p.get('fen') or not p.get('moves'):
                    skipped += 1; continue
                if pid in seen:
                    dupes += 1; continue
                seen.add(pid)
                score = int(p.get('difficultyScore') or p.get('rating') or 0)
                levels[lv].append((score, int(p.get('rating') or 0), pid,
                                   json.dumps(p, separators=(',', ':'), ensure_ascii=False)))
        print('read', os.path.basename(fn), flush=True)

    for lv in LEVELS:
        levels[lv].sort(key=lambda t: (t[0], t[1], t[2]))

    batch_count = max((len(levels[lv]) + PER_LEVEL - 1) // PER_LEVEL for lv in LEVELS)
    os.makedirs(a.out, exist_ok=True)
    for old in glob.glob(os.path.join(a.out, 'puzzles-batch-*.json')):
        os.remove(old)

    for n in range(1, batch_count + 1):
        parts = []
        for lv in LEVELS:
            rows = levels[lv][(n - 1) * PER_LEVEL: n * PER_LEVEL]
            parts.append('"%s":[%s]' % (lv, ','.join(r[3] for r in rows)))
        with open(os.path.join(a.out, 'puzzles-batch-%03d.json' % n), 'w', encoding='utf-8') as f:
            f.write('{"schemaVersion":1,"batch":%d,"puzzles":{%s}}' % (n, ','.join(parts)))

    counts = {lv: len(levels[lv]) for lv in LEVELS}
    total = sum(counts.values())
    catalog = {
        'schemaVersion': 1,
        'version': 'ordered-%d-%d' % (total, int(time.time())),
        'generatedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'batchSizePerLevel': PER_LEVEL,
        'batchCount': batch_count,
        'totalPuzzles': total,
        'counts': counts,
        'skippedRows': skipped,
        'duplicatesRemoved': dupes,
        'source': 'Lichess puzzle database CSV (CC0; retain source attribution in app notices)'
    }
    with open(os.path.join(a.out, 'catalog.json'), 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2)
    print(json.dumps(catalog, indent=2))

if __name__ == '__main__':
    main()
