/**
 * visualSvg.js
 * Exact real-time SVG renderers for Grade 4 Thai Jelly Fractions:
 * - Circle Jelly Trays, Fraction Bars, and Jelly Cube Grids
 * - Real-time golden slicing dividers (x2..x6)
 * - Unit-size comparator (1/d1 vs 1/d2 at identical scale)
 * - Before/After equivalence overlay
 * - Animated addition merge & subtraction scoop-out
 * - Uniform authored SVG icon set (zero emojis)
 */

let svgUidCounter = 0;
function uid(prefix) {
  svgUidCounter += 1;
  return `${prefix}_${svgUidCounter}`;
}

export const COLORS = {
  leftFill: '#3E46AD',
  leftLight: '#E5E7FA',
  leftStroke: '#252B75',
  addFill: '#0D7A50',
  addLight: '#DCF3E9',
  addStroke: '#085436',
  subFill: '#C4362F',
  subLight: '#FCE5E3',
  subStroke: '#8E231D',
  knife: '#995B00',
  knifeGlow: '#F5B82E',
  empty: '#FFFFFF',
  trayRim: '#CBDAD3',
  ink: '#12231E',
};

export const ICONS = {
  plus: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  minus: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/></svg>`,
  mixed: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M7 4v8M3 8h8M13 17h8"/></svg>`,
  circle: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v9l7.8 4.5"/></svg>`,
  bar: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M9 7v10M15 7v10"/></svg>`,
  grid: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16M3 12h18"/></svg>`,
  knife: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 4L8 15l-3 5 5-3L21 6a1.4 1.4 0 0 0-2-2z"/><path d="M12 11l2 2"/></svg>`,
  guided: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 9h6M9 13h4"/></svg>`,
  sandbox: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>`,
  game: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 15.3 6.7 18.1l1-5.8-4.2-4.1 5.9-.9L12 2z"/></svg>`,
  soundOn: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9.5 9.5 0 0 1 0 14"/></svg>`,
  soundOff: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M22 9l-6 6M16 9l6 6"/></svg>`,
  shuffle: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>`,
  next: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  check: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>`,
  x: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  sparkle: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"/></svg>`,
  layers: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>`,
  reset: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>`,
};

function getRolePalette(role) {
  if (role === 'add') return { fill: COLORS.addFill, light: COLORS.addLight, stroke: COLORS.addStroke };
  if (role === 'sub') return { fill: COLORS.subFill, light: COLORS.subLight, stroke: COLORS.subStroke };
  return { fill: COLORS.leftFill, light: COLORS.leftLight, stroke: COLORS.leftStroke };
}

function getGridDims(total) {
  // Choose clean visually pleasing rows x cols for Grade 4 denominators (2..24)
  const map = {
    2: [1, 2], 3: [1, 3], 4: [2, 2], 5: [1, 5], 6: [2, 3],
    7: [1, 7], 8: [2, 4], 9: [3, 3], 10: [2, 5], 12: [3, 4],
    14: [2, 7], 15: [3, 5], 16: [4, 4], 18: [3, 6], 20: [4, 5],
    21: [3, 7], 24: [4, 6],
  };
  if (map[total]) return map[total];
  // Fallback factorization
  let bestR = 1;
  for (let r = Math.floor(Math.sqrt(total)); r >= 1; r--) {
    if (total % r === 0) {
      bestR = r;
      break;
    }
  }
  return [bestR, total / bestR];
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function wedgePath(cx, cy, r, startDeg, endDeg) {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`;
}

/**
 * Determine fill and CSS class for slice index `idx` across multi-tray display.
 */
function resolveSliceState(idx, opts) {
  const {
    primaryCount,
    secondaryCount = 0,
    secondaryRole = 'add',
    removeCount = 0,
    primaryRole = 'left',
    isGhostTray = false,
    animateMerge = false,
    animateScoop = false,
    hatchId,
  } = opts;

  const pPal = getRolePalette(primaryRole);
  const sPal = getRolePalette(secondaryRole);

  // Subtraction scoop state: last `removeCount` pieces of primaryCount are scooped out
  if (removeCount > 0 && idx < primaryCount) {
    const remainCount = Math.max(0, primaryCount - removeCount);
    if (idx >= remainCount) {
      return {
        fill: `url(#${hatchId})`,
        cls: animateScoop ? 'slice-scoop' : 'slice-cutout',
        delay: (idx - remainCount) * 45,
      };
    }
    return { fill: pPal.fill, cls: 'slice-solid', delay: 0 };
  }

  // Primary slices
  if (idx < primaryCount) {
    if (isGhostTray) {
      return { fill: `url(#${hatchId})`, cls: 'slice-sub-order', delay: 0 };
    }
    return {
      fill: pPal.fill,
      cls: animateMerge ? 'slice-pop' : 'slice-solid',
      delay: animateMerge ? Math.min(idx * 30, 320) : 0,
    };
  }

  // Secondary slices (merged addition pieces)
  if (idx < primaryCount + secondaryCount) {
    return {
      fill: sPal.fill,
      cls: animateMerge ? 'slice-pop-add' : 'slice-solid',
      delay: animateMerge ? Math.min((idx - primaryCount) * 45 + 160, 520) : 0,
    };
  }

  return { fill: COLORS.empty, cls: 'slice-empty', delay: 0 };
}

/**
 * Render one or more fraction trays (Circle / Bar / Grid) as clean SVG HTML.
 */
export function renderTraySVG({
  num,
  den,
  mult = 1,
  role = 'left',
  visualMode = 'circle',
  secondaryCount = 0,
  secondaryRole = 'add',
  removeCount = 0,
  isGhostTray = false,
  isWholeClean = false,
  animateSlice = false,
  animateMerge = false,
  animateScoop = false,
  size = 156,
}) {
  const totalDen = den * mult;
  const primaryCount = num * mult;
  const totalFilled = primaryCount + secondaryCount;
  const trayCount = Math.max(1, Math.ceil(totalFilled / totalDen));
  const hatchId = uid('hatch');
  const glossId = uid('gloss');

  const hatchColor = role === 'sub' || removeCount > 0 ? COLORS.subFill : COLORS.leftFill;
  const hatchBg = role === 'sub' || removeCount > 0 ? COLORS.subLight : COLORS.leftLight;

  const defs = `
    <defs>
      <pattern id="${hatchId}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="8" height="8" fill="${hatchBg}"/>
        <line x1="0" y1="0" x2="0" y2="8" stroke="${hatchColor}" stroke-width="2.6" stroke-opacity="0.72"/>
      </pattern>
      <linearGradient id="${glossId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.28"/>
        <stop offset="55%" stop-color="#FFFFFF" stop-opacity="0"/>
      </linearGradient>
    </defs>
  `;

  if (visualMode === 'bar') {
    const w = 224;
    const h = trayCount === 1 ? 74 : 134;
    const barH = 48;
    const gap = 14;
    let body = '';

    for (let t = 0; t < trayCount; t++) {
      const y = 12 + t * (barH + gap);
      const bx = 8;
      const bw = w - 16;
      const segW = bw / totalDen;
      const clipId = uid('barclip');

      body += `<clipPath id="${clipId}"><rect x="${bx}" y="${y}" width="${bw}" height="${barH}" rx="10"/></clipPath>`;
      body += `<rect x="${bx}" y="${y}" width="${bw}" height="${barH}" rx="10" fill="#FFFFFF" stroke="${COLORS.trayRim}" stroke-width="2.5"/>`;

      body += `<g clip-path="url(#${clipId})">`;
      for (let i = 0; i < totalDen; i++) {
        const globalIdx = t * totalDen + i;
        const st = resolveSliceState(globalIdx, {
          primaryCount, secondaryCount, secondaryRole, removeCount,
          primaryRole: role, isGhostTray, animateMerge, animateScoop, hatchId,
        });
        const sx = bx + i * segW;
        const styleAttr = st.delay ? `style="animation-delay:${st.delay}ms"` : '';
        body += `<rect class="${st.cls}" ${styleAttr} x="${sx.toFixed(2)}" y="${y}" width="${(segW + 0.5).toFixed(2)}" height="${barH}" fill="${st.fill}"/>`;
      }

      // Gloss highlight strip
      body += `<rect x="${bx}" y="${y}" width="${bw}" height="${barH * 0.45}" fill="url(#${glossId})" pointer-events="none"/>`;

      // Divider lines (skip heavy dividers if whole clean)
      if (!isWholeClean) {
        // Sub-slice golden lines first
        if (mult > 1) {
          for (let i = 1; i < totalDen; i++) {
            if (i % mult === 0) continue;
            const lx = bx + i * segW;
            body += `<line class="${animateSlice ? 'cut-line-anim' : ''}" x1="${lx.toFixed(2)}" y1="${y}" x2="${lx.toFixed(2)}" y2="${y + barH}" stroke="${COLORS.knife}" stroke-width="2" stroke-dasharray="4 3"/>`;
          }
        }
        // Original base division lines
        for (let i = 1; i < den; i++) {
          const lx = bx + i * (bw / den);
          body += `<line x1="${lx.toFixed(2)}" y1="${y}" x2="${lx.toFixed(2)}" y2="${y + barH}" stroke="${COLORS.ink}" stroke-width="2" stroke-opacity="0.72"/>`;
        }
      }
      body += `</g>`;
      // Outer crisp border
      body += `<rect x="${bx}" y="${y}" width="${bw}" height="${barH}" rx="10" fill="none" stroke="${COLORS.ink}" stroke-width="2.2" stroke-opacity="0.78"/>`;
    }

    return `<svg class="tray-svg tray-bar" viewBox="0 0 ${w} ${h}" role="img" aria-label="แถบเศษส่วน ${num * mult} ส่วน ${totalDen}">${defs}${body}</svg>`;
  }

  if (visualMode === 'grid') {
    const [rows, cols] = getGridDims(totalDen);
    const cellBoxW = 152;
    const cellBoxH = 112;
    const gap = 16;
    const w = trayCount * cellBoxW + (trayCount - 1) * gap + 16;
    const h = cellBoxH + 16;
    let body = '';

    for (let t = 0; t < trayCount; t++) {
      const ox = 8 + t * (cellBoxW + gap);
      const oy = 8;
      const cw = cellBoxW / cols;
      const ch = cellBoxH / rows;
      const clipId = uid('gridclip');

      body += `<clipPath id="${clipId}"><rect x="${ox}" y="${oy}" width="${cellBoxW}" height="${cellBoxH}" rx="10"/></clipPath>`;
      body += `<rect x="${ox}" y="${oy}" width="${cellBoxW}" height="${cellBoxH}" rx="10" fill="#FFFFFF" stroke="${COLORS.trayRim}" stroke-width="2.5"/>`;
      body += `<g clip-path="url(#${clipId})">`;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const localIdx = r * cols + c;
          const globalIdx = t * totalDen + localIdx;
          const st = resolveSliceState(globalIdx, {
            primaryCount, secondaryCount, secondaryRole, removeCount,
            primaryRole: role, isGhostTray, animateMerge, animateScoop, hatchId,
          });
          const x = ox + c * cw;
          const y = oy + r * ch;
          const styleAttr = st.delay ? `style="animation-delay:${st.delay}ms"` : '';
          body += `<rect class="${st.cls}" ${styleAttr} x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(cw + 0.5).toFixed(2)}" height="${(ch + 0.5).toFixed(2)}" fill="${st.fill}"/>`;
        }
      }

      if (!isWholeClean) {
        const lineStroke = mult > 1 ? COLORS.knife : COLORS.ink;
        const lineOp = mult > 1 ? '0.88' : '0.62';
        for (let c = 1; c < cols; c++) {
          const x = ox + c * cw;
          body += `<line class="${animateSlice && mult > 1 ? 'cut-line-anim' : ''}" x1="${x.toFixed(2)}" y1="${oy}" x2="${x.toFixed(2)}" y2="${oy + cellBoxH}" stroke="${lineStroke}" stroke-width="1.8" stroke-opacity="${lineOp}"/>`;
        }
        for (let r = 1; r < rows; r++) {
          const y = oy + r * ch;
          body += `<line class="${animateSlice && mult > 1 ? 'cut-line-anim' : ''}" x1="${ox}" y1="${y.toFixed(2)}" x2="${ox + cellBoxW}" y2="${y.toFixed(2)}" stroke="${lineStroke}" stroke-width="1.8" stroke-opacity="${lineOp}"/>`;
        }
      }

      body += `</g>`;
      body += `<rect x="${ox}" y="${oy}" width="${cellBoxW}" height="${cellBoxH}" rx="10" fill="none" stroke="${COLORS.ink}" stroke-width="2.2" stroke-opacity="0.78"/>`;
    }

    return `<svg class="tray-svg tray-grid" viewBox="0 0 ${w} ${h}" role="img" aria-label="ตารางเศษส่วน ${num * mult} ส่วน ${totalDen}">${defs}${body}</svg>`;
  }

  // Default: Circle Jelly Tray (ถาดวุ้นวงกลม)
  const r = 64;
  const pad = 12;
  const stepX = r * 2 + 18;
  const w = trayCount === 1 ? (r + pad) * 2 : (r + pad) * 2 + stepX * (trayCount - 1);
  const h = (r + pad) * 2;
  let body = '';

  for (let t = 0; t < trayCount; t++) {
    const cx = r + pad + t * stepX;
    const cy = r + pad;

    // Subtle porcelain saucer rim
    body += `<circle cx="${cx}" cy="${cy}" r="${r + 6}" fill="#EEF4F1" stroke="${COLORS.trayRim}" stroke-width="1.5"/>`;
    body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF"/>`;

    if (totalDen === 1) {
      const st = resolveSliceState(t, {
        primaryCount, secondaryCount, secondaryRole, removeCount,
        primaryRole: role, isGhostTray, animateMerge, animateScoop, hatchId,
      });
      body += `<circle class="${st.cls}" cx="${cx}" cy="${cy}" r="${r}" fill="${st.fill}"/>`;
    } else {
      const anglePer = 360 / totalDen;
      for (let i = 0; i < totalDen; i++) {
        const globalIdx = t * totalDen + i;
        const st = resolveSliceState(globalIdx, {
          primaryCount, secondaryCount, secondaryRole, removeCount,
          primaryRole: role, isGhostTray, animateMerge, animateScoop, hatchId,
        });
        const dPath = wedgePath(cx, cy, r, i * anglePer, (i + 1) * anglePer);
        const styleAttr = st.delay ? `style="animation-delay:${st.delay}ms"` : '';
        body += `<path class="${st.cls}" ${styleAttr} d="${dPath}" fill="${st.fill}"/>`;
      }
    }

    // Soft jelly sheen
    body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${glossId})" pointer-events="none"/>`;

    // Dividers
    if (!isWholeClean && totalDen > 1) {
      const anglePer = 360 / totalDen;
      // Golden sub-slice lines first
      if (mult > 1) {
        for (let i = 0; i < totalDen; i++) {
          if (i % mult === 0) continue;
          const pt = polarToCartesian(cx, cy, r, i * anglePer);
          body += `<line class="${animateSlice ? 'cut-line-anim' : ''}" x1="${cx}" y1="${cy}" x2="${pt.x.toFixed(2)}" y2="${pt.y.toFixed(2)}" stroke="${COLORS.knife}" stroke-width="2" stroke-dasharray="4 3"/>`;
        }
      }
      // Original primary slice lines
      const origAngle = 360 / den;
      for (let i = 0; i < den; i++) {
        const pt = polarToCartesian(cx, cy, r, i * origAngle);
        body += `<line x1="${cx}" y1="${cy}" x2="${pt.x.toFixed(2)}" y2="${pt.y.toFixed(2)}" stroke="${COLORS.ink}" stroke-width="2" stroke-opacity="0.72"/>`;
      }
    }

    // Outer circle rim
    body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${COLORS.ink}" stroke-width="2.4" stroke-opacity="0.8"/>`;
  }

  return `<svg class="tray-svg tray-circle" viewBox="0 0 ${w} ${h}" style="max-width:${trayCount === 1 ? size : size * 1.95}px" role="img" aria-label="ถาดวุ้นวงกลม ${num * mult} ส่วน ${totalDen}">${defs}${body}</svg>`;
}

/**
 * Unit-Size Comparator SVG:
 * Shows 1 single piece of left tray (1/dLeft) right above 1 single piece of right tray (1/dRight)
 * at the EXACT same 100% scale so Grade 4 students instantly see if slices are equal or unequal!
 */
export function renderUnitCompareSVG({ dLeft, dRight, op }) {
  const equal = dLeft === dRight;
  const barFull = 200;
  const wLeft = Math.max(8, barFull / dLeft);
  const wRight = Math.max(8, barFull / dRight);
  const rightColor = op === '-' ? COLORS.subFill : COLORS.addFill;

  return `
    <svg class="unit-compare-svg" viewBox="0 0 286 64" role="img" aria-label="เทียบขนาด 1 ชิ้น: 1 ส่วน ${dLeft} กับ 1 ส่วน ${dRight}">
      <!-- Left unit bar -->
      <rect x="6" y="8" width="${barFull}" height="20" rx="6" fill="#EDF3F0" stroke="#D1DFD8" stroke-width="1.2"/>
      <rect class="unit-bar-fill" x="6" y="8" width="${wLeft.toFixed(2)}" height="20" rx="6" fill="${COLORS.leftFill}"/>
      <text x="${barFull + 16}" y="22.5" font-size="13" font-weight="700" fill="${COLORS.leftStroke}" font-family="inherit">1/${dLeft}</text>

      <!-- Right unit bar -->
      <rect x="6" y="36" width="${barFull}" height="20" rx="6" fill="#EDF3F0" stroke="#D1DFD8" stroke-width="1.2"/>
      <rect class="unit-bar-fill" x="6" y="36" width="${wRight.toFixed(2)}" height="20" rx="6" fill="${rightColor}"/>
      <text x="${barFull + 16}" y="50.5" font-size="13" font-weight="700" fill="${op === '-' ? COLORS.subStroke : COLORS.addStroke}" font-family="inherit">1/${dRight}</text>

      <!-- Equal alignment guide line -->
      ${equal ? `<line x1="${(6 + wLeft).toFixed(2)}" y1="4" x2="${(6 + wLeft).toFixed(2)}" y2="60" stroke="${COLORS.addFill}" stroke-width="2" stroke-dasharray="3 2"/>` : ''}
    </svg>
  `;
}

/**
 * Before / After Equivalence Overlay SVG:
 * Proves that n/d and (n*k)/(d*k) occupy the EXACT same area.
 * overlayRatio (0..1) blends the golden slice lines directly over the original tray.
 */
export function renderBeforeAfterOverlaySVG({ num, den, mult, role = 'left', visualMode = 'circle', overlayRatio = 1 }) {
  const pal = getRolePalette(role);
  const ratio = Math.max(0, Math.min(1, overlayRatio));
  const totalDen = den * mult;

  if (visualMode === 'bar') {
    const w = 220;
    const h = 58;
    const bx = 8;
    const bw = w - 16;
    const bh = 38;
    const y = 10;
    const fillW = Math.min(bw, (num / den) * bw);
    const clipId = uid('ovb');
    let lines = '';

    for (let i = 1; i < den; i++) {
      const lx = bx + i * (bw / den);
      lines += `<line x1="${lx.toFixed(2)}" y1="${y}" x2="${lx.toFixed(2)}" y2="${y + bh}" stroke="${COLORS.ink}" stroke-width="2" stroke-opacity="0.75"/>`;
    }
    if (mult > 1) {
      for (let i = 1; i < totalDen; i++) {
        if (i % mult === 0) continue;
        const lx = bx + i * (bw / totalDen);
        lines += `<line x1="${lx.toFixed(2)}" y1="${y}" x2="${lx.toFixed(2)}" y2="${y + bh}" stroke="${COLORS.knife}" stroke-width="2.2" stroke-dasharray="4 2" opacity="${ratio.toFixed(2)}"/>`;
      }
    }

    return `
      <svg class="overlay-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="เทียบก่อนหั่นและหลังหั่น">
        <clipPath id="${clipId}"><rect x="${bx}" y="${y}" width="${bw}" height="${bh}" rx="8"/></clipPath>
        <rect x="${bx}" y="${y}" width="${bw}" height="${bh}" rx="8" fill="#FFFFFF"/>
        <g clip-path="url(#${clipId})">
          <rect x="${bx}" y="${y}" width="${fillW.toFixed(2)}" height="${bh}" fill="${pal.fill}"/>
          ${lines}
        </g>
        <rect x="${bx}" y="${y}" width="${bw}" height="${bh}" rx="8" fill="none" stroke="${COLORS.ink}" stroke-width="2"/>
      </svg>
    `;
  }

  // Circle overlay (default)
  const r = 50;
  const cx = 60;
  const cy = 60;
  const clampedNum = Math.min(num, den);
  const origAngle = 360 / den;
  const subAngle = 360 / totalDen;
  let wedges = '';
  let lines = '';

  for (let i = 0; i < den; i++) {
    const fill = i < clampedNum ? pal.fill : '#FFFFFF';
    wedges += `<path d="${wedgePath(cx, cy, r, i * origAngle, (i + 1) * origAngle)}" fill="${fill}"/>`;
  }
  if (mult > 1) {
    for (let i = 0; i < totalDen; i++) {
      if (i % mult === 0) continue;
      const pt = polarToCartesian(cx, cy, r, i * subAngle);
      lines += `<line x1="${cx}" y1="${cy}" x2="${pt.x.toFixed(2)}" y2="${pt.y.toFixed(2)}" stroke="${COLORS.knife}" stroke-width="2.2" stroke-dasharray="4 2" opacity="${ratio.toFixed(2)}"/>`;
    }
  }
  for (let i = 0; i < den; i++) {
    const pt = polarToCartesian(cx, cy, r, i * origAngle);
    lines += `<line x1="${cx}" y1="${cy}" x2="${pt.x.toFixed(2)}" y2="${pt.y.toFixed(2)}" stroke="${COLORS.ink}" stroke-width="2" stroke-opacity="0.72"/>`;
  }

  return `
    <svg class="overlay-svg overlay-circle" viewBox="0 0 120 120" role="img" aria-label="เทียบก่อนหั่นและหลังหั่น">
      <circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="#EEF4F1" stroke="${COLORS.trayRim}" stroke-width="1.2"/>
      ${wedges}
      ${lines}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${COLORS.ink}" stroke-width="2.2"/>
    </svg>
  `;
}
