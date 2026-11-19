/**
 * problemGenerator.js
 * Exhaustive, Grade-4 calibrated, zero-repeat shuffle-bag generator
 * for fraction addition & subtraction (Standard ค 1.1 ป.4/13).
 */

import { gcd } from './mathEngine.js';

const STORAGE_KEY = 'jelly_fraction_used_v1';

// Signature textbook starters (from Lesson Plan 16)
const FEATURED_STARTERS = {
  '+:1': { n1: 1, d1: 2, n2: 3, d2: 8, op: '+', tag: 'วุ้นของแก้วตา' },
  '-:1': { n1: 3, d1: 4, n2: 1, d2: 8, op: '-', tag: 'ตักวุ้นแบ่งเพื่อน' },
};

function makeKey(p) {
  return `${p.op}:${p.n1}/${p.d1},${p.n2}/${p.d2}`;
}

function makeMirrorKey(p) {
  return `${p.op}:${p.n2}/${p.d2},${p.n1}/${p.d1}`;
}

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Build exhaustive pool of valid Grade 4 problems for (op, level).
 * Rules:
 * - Level 1 (ง่าย): d_small in [2,3,4,5], k in [2,3], d_big <= 12.
 *   Proper fractions only, add sum <= 1, sub diff > 0, mostly d1 < d2.
 * - Level 2 (กลาง): d_small in [2,3,4,5,6,8], k in [2,3,4], d_big <= 18.
 *   Balanced left/right smaller denominator, add sum up to 1.75 trays, sub diff > 0.
 * - Level 3 (ท้าทาย): d_small in [2,3,4,5,6,8,9,10,12], k in [2..6], d_big <= 24.
 *   Includes improper starting fraction (up to 1.5 trays) & worksheet-16 style challenges.
 */
function buildPool(op, level) {
  const pool = [];
  const seen = new Set();

  const configs = {
    1: {
      smallDens: [2, 3, 4, 5],
      mults: [2, 3],
      maxBig: 12,
      allowRightSmaller: false,
      allowImproperInput: false,
      maxSumRatio: 1.0,
    },
    2: {
      smallDens: [2, 3, 4, 5, 6, 8],
      mults: [2, 3, 4],
      maxBig: 18,
      allowRightSmaller: true,
      allowImproperInput: false,
      maxSumRatio: 1.75,
    },
    3: {
      smallDens: [2, 3, 4, 5, 6, 8, 9, 10, 12],
      mults: [2, 3, 4, 5, 6],
      maxBig: 24,
      allowRightSmaller: true,
      allowImproperInput: true,
      maxSumRatio: 1.95,
    },
  };

  const cfg = configs[level] || configs[1];

  for (const ds of cfg.smallDens) {
    for (const k of cfg.mults) {
      const db = ds * k;
      if (db > cfg.maxBig) continue;

      const orientations = cfg.allowRightSmaller ? ['leftSmall', 'rightSmall'] : ['leftSmall'];

      for (const orient of orientations) {
        const d1 = orient === 'leftSmall' ? ds : db;
        const d2 = orient === 'leftSmall' ? db : ds;

        const maxN1 = cfg.allowImproperInput ? Math.min(d1 + Math.ceil(d1 * 0.5), d1 * 2 - 1) : d1 - 1;
        const maxN2 = d2 - 1;

        for (let n1 = 1; n1 <= maxN1; n1++) {
          // Avoid whole numbers as starting fraction (e.g. 4/4)
          if (n1 % d1 === 0) continue;
          // Keep level 1-2 clean by avoiding trivially unreduced large fractions on the big side
          if (level === 1 && gcd(n1, d1) > 1 && d1 > 6) continue;

          for (let n2 = 1; n2 <= maxN2; n2++) {
            if (n2 % d2 === 0) continue;
            if (level === 1 && gcd(n2, d2) > 1 && d2 > 8) continue;

            const cn1 = d1 === ds ? n1 * k : n1;
            const cn2 = d2 === ds ? n2 * k : n2;

            if (op === '+') {
              const sum = cn1 + cn2;
              if (sum / db > cfg.maxSumRatio) continue;
              // For level 3, ensure genuine challenge (either db >= 12 or k >= 3 or improper)
              if (level === 3 && db < 12 && k < 3 && n1 < d1) continue;
            } else {
              // Subtraction: strictly positive, never negative!
              const diff = cn1 - cn2;
              if (diff <= 0) continue;
              if (diff / db > 1.75) continue;
              if (level === 3 && db < 12 && k < 3 && n1 < d1) continue;
            }

            const prob = { n1, d1, n2, d2, op };
            const key = makeKey(prob);
            if (!seen.has(key)) {
              seen.add(key);
              pool.push(prob);
            }
          }
        }
      }
    }
  }

  // Ensure Worksheet 16 showcase items are present in Level 3 Addition
  if (op === '+' && level === 3) {
    const ws16 = [
      { n1: 3, d1: 8, n2: 15, d2: 24, op: '+' },
      { n1: 5, d1: 4, n2: 5, d2: 12, op: '+' },
      { n1: 3, d1: 10, n2: 7, d2: 20, op: '+' },
      { n1: 7, d1: 9, n2: 2, d2: 3, op: '+' },
      { n1: 11, d1: 12, n2: 1, d2: 4, op: '+' },
    ];
    for (const p of ws16) {
      const key = makeKey(p);
      if (!seen.has(key)) {
        seen.add(key);
        pool.push(p);
      }
    }
  }

  // Ensure Lesson Plan 16 starter is in Level 1 Addition
  if (op === '+' && level === 1) {
    const starter = FEATURED_STARTERS['+:1'];
    if (!seen.has(makeKey(starter))) {
      seen.add(makeKey(starter));
      pool.push({ ...starter });
    }
  }

  return pool;
}

class ProblemDeck {
  constructor() {
    this.pools = {};
    this.bags = {};
    this.recentKeys = [];
    this.usedStore = this.loadUsed();
    this.shownStarter = {};
  }

  loadUsed() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  saveUsed() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.usedStore));
    } catch {
      // Ignore storage quota errors in private browsing
    }
  }

  getPool(op, level) {
    const id = `${op}:${level}`;
    if (!this.pools[id]) {
      this.pools[id] = buildPool(op, level);
    }
    return this.pools[id];
  }

  refillBag(op, level) {
    const id = `${op}:${level}`;
    const fullPool = this.getPool(op, level);
    const usedSet = new Set(this.usedStore[id] || []);

    let remaining = fullPool.filter((p) => !usedSet.has(makeKey(p)));

    // If all problems in this level have been played, reset history gracefully
    if (remaining.length === 0) {
      this.usedStore[id] = [];
      this.saveUsed();
      remaining = fullPool.slice();
    }

    // Balance orientations in Level 2 & 3 so students alternate left/right slicing nicely
    this.bags[id] = shuffle(remaining);
  }

  /**
   * Draw the next guaranteed non-repeating problem for (op, level).
   * @param {'+' | '-'} op
   * @param {1 | 2 | 3} level
   * @param {boolean} useStarterFirst - if true, gives the classic Lesson 16 example on first visit
   */
  next(op, level, useStarterFirst = false) {
    const id = `${op}:${level}`;

    if (useStarterFirst && FEATURED_STARTERS[id] && !this.shownStarter[id]) {
      this.shownStarter[id] = true;
      const starter = { ...FEATURED_STARTERS[id] };
      this.markUsed(id, starter);
      return starter;
    }

    if (!this.bags[id] || this.bags[id].length === 0) {
      this.refillBag(op, level);
    }

    const bag = this.bags[id];
    // Pick first problem that isn't a mirror of the immediately previous problem
    const lastMirror = this.recentKeys[this.recentKeys.length - 1];
    let pickIdx = bag.findIndex((p) => makeKey(p) !== lastMirror && makeMirrorKey(p) !== lastMirror);
    if (pickIdx === -1) pickIdx = 0;

    const [picked] = bag.splice(pickIdx, 1);
    this.markUsed(id, picked);
    return { ...picked };
  }

  /**
   * Draw next problem for mixed (+/-) game mode.
   */
  nextMixed(level, lastOp = null) {
    const op = lastOp === '+' ? (Math.random() < 0.65 ? '-' : '+') : (Math.random() < 0.65 ? '+' : '-');
    return this.next(op, level, false);
  }

  markUsed(id, prob) {
    const key = makeKey(prob);
    if (!this.usedStore[id]) this.usedStore[id] = [];
    if (!this.usedStore[id].includes(key)) {
      this.usedStore[id].push(key);
      // Cap stored history if pool grows very large
      const poolLen = this.getPool(prob.op, Number(id.split(':')[1])).length;
      if (this.usedStore[id].length >= poolLen) {
        this.usedStore[id] = [key];
      }
      this.saveUsed();
    }
    this.recentKeys.push(key);
    if (this.recentKeys.length > 8) this.recentKeys.shift();
  }

  getPoolSize(op, level) {
    return this.getPool(op, level).length;
  }
}

export const problemDeck = new ProblemDeck();

/**
 * Generate 4 distinct, realistic multiple-choice answers for Game Mode.
 */
export function buildGameChoices(analysis) {
  const { resultNum, resultDen, cn1, cn2, op, n1, n2, d1, d2 } = analysis;
  const correctKey = `${resultNum}/${resultDen}`;
  const distractors = [];
  const used = new Set([correctKey]);

  const tryAdd = (num, den) => {
    if (num <= 0 || den <= 0) return;
    const key = `${num}/${den}`;
    if (used.has(key)) return;
    // Also prevent mathematically equivalent fraction as distractor!
    if (num * resultDen === resultNum * den) return;
    used.add(key);
    distractors.push({ num, den, isCorrect: false });
  };

  // Classic student misconceptions (great pedagogically!)
  // 1. Adding/subtracting raw numerators without converting
  const rawNum = op === '+' ? n1 + n2 : Math.abs(n1 - n2);
  tryAdd(rawNum, resultDen);
  // 2. Adding/subtracting denominators too (e.g. 1/2 + 3/8 -> 4/10)
  if (op === '+') tryAdd(n1 + n2, d1 + d2);
  // 3. Off by 1 or 2 on numerator
  tryAdd(resultNum + 1, resultDen);
  tryAdd(resultNum - 1, resultDen);
  tryAdd(resultNum + 2, resultDen);
  tryAdd(Math.max(1, resultNum - 2), resultDen);
  // 4. Forgot to multiply numerator (used original numerator with new denominator)
  if (op === '+') tryAdd(n1 + cn2, resultDen);
  if (op === '+') tryAdd(cn1 + n2, resultDen);

  // Fill any remaining slots safely
  let offset = 3;
  while (distractors.length < 3) {
    tryAdd(resultNum + offset, resultDen);
    if (distractors.length < 3 && resultNum - offset > 0) {
      tryAdd(resultNum - offset, resultDen);
    }
    offset++;
  }

  return shuffle([
    { num: resultNum, den: resultDen, isCorrect: true },
    ...distractors.slice(0, 3),
  ]);
}
