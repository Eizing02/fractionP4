/**
 * mathEngine.js
 * Pure fraction math engine for Grade 4 (Standard ค 1.1 ป.4/13):
 * Addition & Subtraction where one denominator is a multiple of the other.
 */

export function gcd(a, b) {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function simplify(num, den) {
  if (num === 0) return { num: 0, den: 1, factor: den };
  const g = gcd(num, den);
  return { num: num / g, den: den / g, factor: g };
}

export function toMixed(num, den) {
  const whole = Math.floor(num / den);
  const rem = num % den;
  return { whole, rem, den };
}

/**
 * Checks whether two denominators satisfy Grade 4 multiple rule
 * (one is an integer multiple of the other, or equal).
 */
export function areMultiples(d1, d2) {
  if (d1 <= 0 || d2 <= 0) return false;
  return d1 % d2 === 0 || d2 % d1 === 0;
}

/**
 * Analyze a fraction addition or subtraction problem completely.
 * @param {{ n1: number, d1: number, n2: number, d2: number, op: '+' | '-' }} p
 */
export function analyzeProblem({ n1, d1, n2, d2, op }) {
  const commonDen = Math.max(d1, d2);
  let targetSide = 'none';
  let requiredMult = 1;

  if (d1 < d2 && d2 % d1 === 0) {
    targetSide = 'left';
    requiredMult = d2 / d1;
  } else if (d2 < d1 && d1 % d2 === 0) {
    targetSide = 'right';
    requiredMult = d1 / d2;
  } else if (d1 !== d2) {
    // Fallback LCM if user ever enters non-multiples
    const lcm = (d1 * d2) / gcd(d1, d2);
    return {
      validMultiple: false,
      n1, d1, n2, d2, op,
      targetSide: 'both',
      requiredMult: lcm / d1,
      commonDen: lcm,
      cn1: n1 * (lcm / d1),
      cn2: n2 * (lcm / d2),
      resultNum: op === '+' ? n1 * (lcm / d1) + n2 * (lcm / d2) : n1 * (lcm / d1) - n2 * (lcm / d2),
      resultDen: lcm,
    };
  }

  const cn1 = targetSide === 'left' ? n1 * requiredMult : n1;
  const cn2 = targetSide === 'right' ? n2 * requiredMult : n2;
  const resultNum = op === '+' ? cn1 + cn2 : cn1 - cn2;
  const resultDen = commonDen;

  const simp = simplify(resultNum, resultDen);
  const mixed = toMixed(resultNum, resultDen);
  const simpMixed = toMixed(simp.num, simp.den);

  const isZero = resultNum === 0;
  const isWhole = !isZero && resultNum % resultDen === 0;
  const isImproper = resultNum > resultDen && !isWhole;
  const canSimplify = !isZero && simp.factor > 1;
  const hasNiceForm = isWhole || isImproper || canSimplify;

  // Suggest best visual mode for readability
  const suggestedVisual = commonDen <= 12 ? 'circle' : commonDen <= 18 ? 'bar' : 'grid';

  return {
    validMultiple: true,
    n1, d1, n2, d2, op,
    targetSide,       // 'left' | 'right' | 'none'
    requiredMult,     // integer >= 1
    commonDen,
    cn1,
    cn2,
    resultNum,
    resultDen,
    simpNum: simp.num,
    simpDen: simp.den,
    simpFactor: simp.factor,
    mixedWhole: mixed.whole,
    mixedRem: mixed.rem,
    simpMixedWhole: simpMixed.whole,
    simpMixedRem: simpMixed.rem,
    isZero,
    isWhole,
    isImproper,
    canSimplify,
    hasNiceForm,
    suggestedVisual,
  };
}

/**
 * Valid Grade 4 denominator pairs where one is a multiple of the other (<= 24).
 */
export const GRADE4_DENOMINATORS = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24];

/**
 * Given a denominator d, return all Grade-4-friendly partner denominators
 * that are multiples or divisors of d (with multiplier 2..6 and <= 24).
 */
export function getPartnerDenominators(d) {
  const partners = new Set();
  for (const cand of GRADE4_DENOMINATORS) {
    if (cand === d) continue;
    const big = Math.max(d, cand);
    const small = Math.min(d, cand);
    if (big % small === 0) {
      const k = big / small;
      if (k >= 2 && k <= 6) {
        partners.add(cand);
      }
    }
  }
  return Array.from(partners).sort((a, b) => a - b);
}

/**
 * Helper to format an HTML stacked fraction (no emojis, crisp tabular numerals).
 */
export function fracHTML(num, den, cls = '') {
  return `<span class="frac ${cls}" aria-label="${num} ส่วน ${den}"><span class="frac-n">${num}</span><span class="frac-bar" aria-hidden="true"></span><span class="frac-d">${den}</span></span>`;
}

export function mixedHTML(whole, rem, den, cls = '') {
  if (rem === 0) {
    return `<span class="whole-num ${cls}">${whole}</span>`;
  }
  if (whole === 0) {
    return fracHTML(rem, den, cls);
  }
  return `<span class="mixed-frac ${cls}"><span class="whole-num">${whole}</span>${fracHTML(rem, den)}</span>`;
}

export function multFracHTML(num, den, mult, cls = '') {
  return `<span class="frac frac-mult ${cls}"><span class="frac-n">${num}<span class="mult-tag">&times;${mult}</span></span><span class="frac-bar" aria-hidden="true"></span><span class="frac-d">${den}<span class="mult-tag">&times;${mult}</span></span></span>`;
}
