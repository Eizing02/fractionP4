/**
 * learnMode.js
 * Distilled Mode 1: เรียน (Learn with Kaewta)
 * One clear primary action at a time — 2-step flow:
 *   Step 1: Tap "หั่นแบ่งชิ้น" (or tap the highlighted tray) to slice step-by-step until pieces match!
 *   Step 2: Tap "รวมชิ้นวุ้นเลย" / "ตักวุ้นออกเลย" to animate the result & complete the equation!
 * Includes a hidden-by-default "ตั้งโจทย์เอง" drawer for teachers.
 */

import {
  analyzeProblem,
  GRADE4_DENOMINATORS,
  getPartnerDenominators,
  fracHTML,
  mixedHTML,
  multFracHTML,
} from './mathEngine.js';
import { problemDeck } from './problemGenerator.js';
import { ICONS, renderTraySVG, renderUnitCompareSVG, renderBeforeAfterOverlaySVG } from './visualSvg.js';
import { soundFx } from './soundFx.js';

const PRESETS = [
  { label: 'วุ้นแก้วตา 1/2 + 3/8', n1: 1, d1: 2, n2: 3, d2: 8, op: '+' },
  { label: 'เศษเกิน 5/4 + 5/12', n1: 5, d1: 4, n2: 5, d2: 12, op: '+' },
  { label: 'แปลงตัวหลัง 7/9 + 2/3', n1: 7, d1: 9, n2: 2, d2: 3, op: '+' },
  { label: 'ตักแบ่ง 3/4 − 1/8', n1: 3, d1: 4, n2: 1, d2: 8, op: '-' },
];

const LEVEL_NAMES = { 1: 'ง่าย', 2: 'กลาง', 3: 'ท้าทาย' };
const SHAPE_CYCLE = ['auto', 'circle', 'bar', 'grid'];
const SHAPE_LABELS = { auto: 'ภาพ: ออโต้', circle: 'ภาพ: วงกลม', bar: 'ภาพ: แถบ', grid: 'ภาพ: ตาราง' };

export class LearnMode {
  constructor(container, getGlobalState, setGlobalOp) {
    this.container = container;
    this.getGlobalState = getGlobalState;
    this.setGlobalOp = setGlobalOp;

    this.level = 1;
    this.visualMode = 'auto';
    this.solvedStreak = 0;

    this.problem = null;
    this.analysis = null;

    // Distilled 2-step flow: 'slice' -> 'combine' -> 'done'
    this.phase = 'slice';
    this.currentMult = 1;
    this.animateSlice = false;
    this.animateMerge = false;
    this.showBeforeView = false;

    // Teacher custom-problem drawer (hidden by default to keep screen uncluttered!)
    this.customOpen = false;
    this.customN1 = 1;
    this.customD1 = 2;
    this.customN2 = 3;
    this.customD2 = 8;
  }

  loadProblem(useStarter = false) {
    const { op } = this.getGlobalState();
    this.problem = problemDeck.next(op, this.level, useStarter);
    this.analysis = analyzeProblem(this.problem);
    this.syncCustomFromProblem();
    this.resetStep();
    this.render();
  }

  loadSpecificProblem(p) {
    if (p.op && p.op !== this.getGlobalState().op) {
      this.setGlobalOp(p.op);
    }
    this.problem = { ...p, op: this.getGlobalState().op };
    this.analysis = analyzeProblem(this.problem);
    this.syncCustomFromProblem();
    this.customOpen = false;
    this.resetStep();
    this.render();
  }

  syncCustomFromProblem() {
    if (!this.problem) return;
    this.customN1 = this.problem.n1;
    this.customD1 = this.problem.d1;
    this.customN2 = this.problem.n2;
    this.customD2 = this.problem.d2;
  }

  resetStep() {
    this.currentMult = 1;
    this.phase = this.analysis.targetSide === 'none' ? 'combine' : 'slice';
    this.animateSlice = false;
    this.animateMerge = false;
    this.showBeforeView = false;
  }

  onGlobalChange(reason) {
    if (reason === 'op') {
      this.customOpen = false;
      this.loadProblem(this.level === 1);
    } else {
      this.render();
    }
  }

  getActiveShape() {
    return this.visualMode === 'auto' ? this.analysis.suggestedVisual : this.visualMode;
  }

  handleSliceStep() {
    if (this.phase !== 'slice') return;
    const req = this.analysis.requiredMult;
    this.currentMult = Math.min(req, this.currentMult + 1);
    this.animateSlice = true;
    this.animateMerge = false;
    this.showBeforeView = false;

    if (this.currentMult >= req) {
      soundFx.match();
      this.phase = 'combine';
    } else {
      soundFx.slice();
    }
    this.render();
  }

  handleCombine() {
    if (this.phase !== 'combine') return;
    soundFx.merge();
    this.phase = 'done';
    this.animateSlice = false;
    this.animateMerge = true;
    this.solvedStreak += 1;
    // Gently auto-advance level after 3 solved in Level 1 (or 4 in Level 2)
    if (this.level === 1 && this.solvedStreak >= 3) {
      this.level = 2;
      this.solvedStreak = 0;
    } else if (this.level === 2 && this.solvedStreak >= 4) {
      this.level = 3;
      this.solvedStreak = 0;
    }
    this.render();
  }

  stepCustom(field, delta) {
    const { op } = this.getGlobalState();
    if (field === 'n1') {
      this.customN1 = Math.max(1, Math.min(this.customD1 * 2 - 1, this.customN1 + delta));
    } else if (field === 'n2') {
      this.customN2 = Math.max(1, Math.min(Math.max(1, this.customD2 - 1), this.customN2 + delta));
    } else if (field === 'd1') {
      const idx = GRADE4_DENOMINATORS.indexOf(this.customD1);
      const next = GRADE4_DENOMINATORS[Math.max(0, Math.min(GRADE4_DENOMINATORS.length - 1, idx + delta))];
      this.customD1 = next;
      this.customN1 = Math.min(this.customN1, next * 2 - 1);
      const partners = getPartnerDenominators(next);
      if (!partners.includes(this.customD2) && partners.length > 0) {
        this.customD2 = partners[0];
        this.customN2 = Math.min(this.customN2, this.customD2 - 1);
      }
    } else if (field === 'd2') {
      const partners = getPartnerDenominators(this.customD1);
      if (partners.length > 0) {
        const idx = partners.indexOf(this.customD2);
        const nextIdx = idx === -1 ? 0 : Math.max(0, Math.min(partners.length - 1, idx + delta));
        this.customD2 = partners[nextIdx];
        this.customN2 = Math.min(this.customN2, this.customD2 - 1);
      }
    }

    if (op === '-' && this.customN1 * this.customD2 < this.customN2 * this.customD1) {
      this.customN1 = Math.min(this.customD1 * 2 - 1, Math.max(1, Math.ceil((this.customN2 * this.customD1) / this.customD2)));
      if (this.customN1 * this.customD2 < this.customN2 * this.customD1) {
        this.customN2 = Math.max(1, Math.floor((this.customN1 * this.customD2) / this.customD1));
      }
    }
    soundFx.tap();
    this.render();
  }

  render() {
    if (!this.problem) {
      this.loadProblem(true);
      return;
    }

    const a = this.analysis;
    const isAdd = a.op === '+';
    const rightRole = isAdd ? 'add' : 'sub';
    const rightCls = isAdd ? 'c-add' : 'c-sub';
    const opSym = isAdd ? '+' : '&minus;';
    const vMode = this.getActiveShape();

    const leftMult = a.targetSide === 'left' ? this.currentMult : 1;
    const rightMult = a.targetSide === 'right' ? this.currentMult : 1;
    const curN1 = a.n1 * leftMult;
    const curD1 = a.d1 * leftMult;
    const curN2 = a.n2 * rightMult;
    const curD2 = a.d2 * rightMult;
    const isMatched = curD1 === curD2;

    // Short, friendly 3-5 word cue from Kaewta
    let cueText = `แตะหั่นถาด${a.targetSide === 'left' ? 'ซ้าย' : 'ขวา'}ให้ชิ้นเท่ากัน`;
    if (this.phase === 'combine') {
      cueText = isAdd ? 'ชิ้นเท่ากันแล้ว! กดรวมเลย' : 'ชิ้นเท่ากันแล้ว! กดตักออกเลย';
    } else if (this.phase === 'done') {
      cueText = 'เก่งมาก! ดูคำตอบได้เลย';
    }

    // Build Left & Right Trays
    const leftClickable = this.phase === 'slice' && a.targetSide === 'left';
    const rightClickable = this.phase === 'slice' && a.targetSide === 'right';

    const leftTraySVG = renderTraySVG({
      num: a.n1,
      den: a.d1,
      mult: this.showBeforeView && a.targetSide === 'left' ? 1 : leftMult,
      role: 'left',
      visualMode: vMode,
      removeCount: !isAdd && this.phase === 'done' ? a.cn2 : 0,
      animateSlice: this.animateSlice && a.targetSide === 'left',
      animateScoop: !isAdd && this.phase === 'done' && this.animateMerge,
    });

    const rightTraySVG = renderTraySVG({
      num: a.n2,
      den: a.d2,
      mult: this.showBeforeView && a.targetSide === 'right' ? 1 : rightMult,
      role: rightRole,
      visualMode: vMode,
      isGhostTray: !isAdd,
      animateSlice: this.animateSlice && a.targetSide === 'right',
    });

    // Result Tray (auto-clean whole / simplified / mixed shown right alongside!)
    let resultTraySVG = '';
    if (this.phase === 'done') {
      if (isAdd) {
        resultTraySVG = renderTraySVG({
          num: a.cn1,
          den: a.commonDen,
          role: 'left',
          visualMode: vMode,
          secondaryCount: a.cn2,
          secondaryRole: 'add',
          animateMerge: this.animateMerge,
        });
      } else {
        resultTraySVG = renderTraySVG({
          num: a.resultNum,
          den: a.commonDen,
          role: 'left',
          visualMode: vMode,
          animateMerge: this.animateMerge,
        });
      }
    }

    // Unit Size Comparator
    const unitCompareSVG = renderUnitCompareSVG({ dLeft: curD1, dRight: curD2, op: a.op });

    // Compact Before = After Equivalence toggle (only appears once sliced!)
    let equivStripHTML = '';
    if (this.currentMult > 1 && a.targetSide !== 'none') {
      const origN = a.targetSide === 'left' ? a.n1 : a.n2;
      const origD = a.targetSide === 'left' ? a.d1 : a.d2;
      const targetRole = a.targetSide === 'left' ? 'left' : rightRole;
      equivStripHTML = `
        <div class="equiv-inline">
          <div class="equiv-left">
            ${renderBeforeAfterOverlaySVG({
              num: origN, den: origD, mult: this.currentMult, role: targetRole,
              visualMode: vMode === 'grid' ? 'bar' : vMode,
              overlayRatio: this.showBeforeView ? 0 : 1,
            })}
            <div class="equiv-caption">
              <span class="equiv-eq">
                ${fracHTML(origN, origD, targetRole === 'left' ? 'c-left frac-sm' : `${rightCls} frac-sm`)}
                <span class="op-eq">=</span>
                ${fracHTML(origN * this.currentMult, origD * this.currentMult, 'c-knife frac-sm')}
              </span>
              <span class="equiv-note">เนื้อวุ้นเท่าเดิม แค่ชิ้นเล็กลง</span>
            </div>
          </div>
          <button type="button" class="mini-toggle-btn" data-action="toggle-before" aria-pressed="${this.showBeforeView}">
            ${ICONS.layers}<span>${this.showBeforeView ? 'ดูหลังหั่น' : 'เทียบก่อนหั่น'}</span>
          </button>
        </div>
      `;
    }

    // ONE clear primary button at the bottom of the stage
    let primaryActionHTML = '';
    if (this.phase === 'slice') {
      const nextK = this.currentMult + 1;
      primaryActionHTML = `
        <button type="button" class="hero-action-btn is-knife" data-action="slice-step">
          ${ICONS.knife}
          <span>หั่นแบ่งชิ้น (&times;${nextK})</span>
        </button>
      `;
    } else if (this.phase === 'combine') {
      primaryActionHTML = `
        <button type="button" class="hero-action-btn ${isAdd ? 'is-add' : 'is-sub'} pulse-cta" data-action="combine">
          ${isAdd ? ICONS.plus : ICONS.minus}
          <span>${isAdd ? 'รวมชิ้นวุ้นเลย' : 'ตักวุ้นออกเลย'}</span>
        </button>
      `;
    } else {
      primaryActionHTML = `
        <button type="button" class="hero-action-btn is-next" data-action="next-problem">
          <span>ข้อถัดไป</span>${ICONS.next}
        </button>
      `;
    }

    // Nice formatted final answer (automatic, zero extra click!)
    let niceAnswerHTML = '';
    if (this.phase === 'done' && a.hasNiceForm) {
      const niceExpr = a.isWhole
        ? `<span class="whole-num eq-ans-highlight">${a.mixedWhole}</span>`
        : mixedHTML(a.simpMixedWhole, a.simpMixedRem, a.simpDen, 'c-result eq-ans-highlight');
      niceAnswerHTML = `<span class="op-eq">=</span> ${niceExpr}`;
    }

    // Teacher's compact custom problem drawer (collapsed by default)
    const customDrawerHTML = this.customOpen ? `
      <div class="custom-drawer" aria-label="ตั้งโจทย์เองสำหรับครู">
        <div class="preset-row">
          ${PRESETS.map((p, i) => `<button type="button" class="mini-pill" data-preset="${i}">${p.label}</button>`).join('')}
        </div>
        <div class="custom-steppers">
          <div class="mini-stepper c-left">
            <div class="stepper-row">
              <button type="button" class="step-btn" data-cstep="n1:-1" aria-label="ลดเศษซ้าย">&minus;</button>
              <span class="step-val">${this.customN1}</span>
              <button type="button" class="step-btn" data-cstep="n1:1" aria-label="เพิ่มเศษซ้าย">+</button>
            </div>
            <div class="stepper-bar"></div>
            <div class="stepper-row">
              <button type="button" class="step-btn" data-cstep="d1:-1" aria-label="ลดส่วนซ้าย">&minus;</button>
              <span class="step-val">${this.customD1}</span>
              <button type="button" class="step-btn" data-cstep="d1:1" aria-label="เพิ่มส่วนซ้าย">+</button>
            </div>
          </div>
          <span class="op-sym ${isAdd ? 'op-add' : 'op-sub'}">${opSym}</span>
          <div class="mini-stepper ${rightCls}">
            <div class="stepper-row">
              <button type="button" class="step-btn" data-cstep="n2:-1" aria-label="ลดเศษขวา">&minus;</button>
              <span class="step-val">${this.customN2}</span>
              <button type="button" class="step-btn" data-cstep="n2:1" aria-label="เพิ่มเศษขวา">+</button>
            </div>
            <div class="stepper-bar"></div>
            <div class="stepper-row">
              <button type="button" class="step-btn" data-cstep="d2:-1" aria-label="ลดส่วนขวา">&minus;</button>
              <span class="step-val">${this.customD2}</span>
              <button type="button" class="step-btn" data-cstep="d2:1" aria-label="เพิ่มส่วนขวา">+</button>
            </div>
          </div>
          <button type="button" class="apply-custom-btn" data-action="apply-custom">ใช้โจทย์นี้</button>
        </div>
      </div>
    ` : '';

    this.container.innerHTML = `
      <!-- Quiet, minimal utility bar (only 3 subtle controls) -->
      <div class="quiet-bar">
        <div class="quiet-left">
          <button type="button" class="quiet-btn" data-action="cycle-level" title="แตะเปลี่ยนระดับความยาก">
            <span>ระดับ: <strong>${LEVEL_NAMES[this.level]}</strong></span>
          </button>
          <button type="button" class="quiet-btn" data-action="cycle-shape" title="แตะเปลี่ยนรูปทรงภาพ">
            <span>${SHAPE_LABELS[this.visualMode]}</span>
          </button>
        </div>
        <div class="quiet-right">
          <button type="button" class="quiet-btn ${this.customOpen ? 'is-open' : ''}" data-action="toggle-custom" aria-expanded="${this.customOpen}">
            ${ICONS.sandbox}<span>ตั้งโจทย์เอง</span>
          </button>
          <button type="button" class="quiet-btn" data-action="next-problem">
            ${ICONS.shuffle}<span>เปลี่ยนข้อ</span>
          </button>
        </div>
      </div>

      ${customDrawerHTML}

      <div class="workbench">
        <!-- MAIN VISUAL STAGE -->
        <section class="stage-panel" aria-label="กระดานวุ้นเศษส่วนแบบเรียลไทม์">
          <div class="cue-bar ${this.phase === 'done' ? 'is-celebrate' : ''}">
            <img class="cue-avatar" src="./assets/images/kaewta-chef.jpg" alt="น้องแก้วตา" width="64" height="64">
            <p class="cue-text">${cueText}</p>
            <div class="progress-dots" aria-hidden="true">
              <span class="pdot ${this.phase === 'slice' ? 'is-cur' : 'is-done'}"></span>
              <span class="pdot ${this.phase === 'combine' ? 'is-cur' : this.phase === 'done' ? 'is-done' : ''}"></span>
              <span class="pdot ${this.phase === 'done' ? 'is-done' : ''}"></span>
            </div>
          </div>

          <div class="trays-arena">
            <div class="tray-slot ${leftClickable ? 'is-target-tray' : ''}"
                 ${leftClickable ? 'role="button" tabindex="0" data-action="slice-step" aria-label="แตะหั่นถาดซ้าย"' : ''}>
              <div class="tray-label c-left">
                <span>วุ้นอัญชัน</span>
                ${fracHTML(curN1, curD1, 'c-left frac-sm')}
              </div>
              <div class="tray-figure">${leftTraySVG}</div>
              ${leftMult > 1 ? `<span class="slice-pill">&times;${leftMult}</span>` : ''}
            </div>

            <div class="arena-op ${isAdd ? 'op-add' : 'op-sub'}" aria-hidden="true">
              ${isAdd ? ICONS.plus : ICONS.minus}
            </div>

            <div class="tray-slot ${rightClickable ? 'is-target-tray' : ''}"
                 ${rightClickable ? 'role="button" tabindex="0" data-action="slice-step" aria-label="แตะหั่นถาดขวา"' : ''}>
              <div class="tray-label ${rightCls}">
                <span>${isAdd ? 'วุ้นใบเตย' : 'ตักออก'}</span>
                ${fracHTML(curN2, curD2, `${rightCls} frac-sm`)}
              </div>
              <div class="tray-figure">${rightTraySVG}</div>
              ${rightMult > 1 ? `<span class="slice-pill">&times;${rightMult}</span>` : ''}
            </div>
          </div>

          <!-- Always-visible 1-Piece Size Comparator -->
          <div class="compare-strip ${isMatched ? 'is-equal' : 'is-unequal'}">
            <div class="compare-status">
              <span class="status-icon">${isMatched ? ICONS.check : ICONS.x}</span>
              <span class="status-word">${isMatched ? 'ชิ้นเท่ากันแล้ว!' : 'ชิ้นไม่เท่ากัน'}</span>
            </div>
            <div class="compare-graphic">${unitCompareSVG}</div>
          </div>

          ${equivStripHTML}

          <!-- SINGLE CLEAR PRIMARY ACTION -->
          <div class="single-cta-dock">
            ${primaryActionHTML}
          </div>
        </section>

        <!-- RIGHT PANEL: LIVE STEP-BY-STEP EQUATION + RESULT TRAY -->
        <aside class="math-panel" aria-label="วิธีทำทีละขั้นและผลลัพธ์">
          <h2 class="panel-heading">วิธีทำ</h2>
          <div class="eq-board">
            <div class="eq-row">
              <span class="eq-step-num">1</span>
              <div class="eq-math">
                ${fracHTML(a.n1, a.d1, 'c-left')}
                <span class="op-sym ${isAdd ? 'op-add' : 'op-sub'}">${opSym}</span>
                ${fracHTML(a.n2, a.d2, rightCls)}
              </div>
            </div>

            ${this.currentMult > 1 ? `
              <div class="eq-row">
                <span class="eq-step-num">2</span>
                <div class="eq-math eq-math-wrap">
                  <span class="op-eq">=</span>
                  ${a.targetSide === 'left' ? multFracHTML(a.n1, a.d1, this.currentMult, 'c-left') : fracHTML(a.n1, a.d1, 'c-left')}
                  <span class="op-sym ${isAdd ? 'op-add' : 'op-sub'}">${opSym}</span>
                  ${a.targetSide === 'right' ? multFracHTML(a.n2, a.d2, this.currentMult, rightCls) : fracHTML(a.n2, a.d2, rightCls)}
                </div>
              </div>
              <div class="eq-row eq-subrow">
                <span class="eq-step-spacer"></span>
                <div class="eq-math">
                  <span class="op-eq">=</span>
                  ${fracHTML(curN1, curD1, 'c-left')}
                  <span class="op-sym ${isAdd ? 'op-add' : 'op-sub'}">${opSym}</span>
                  ${fracHTML(curN2, curD2, rightCls)}
                  ${isMatched ? `<span class="eq-ok-dot" aria-label="ส่วนเท่ากันแล้ว">${ICONS.check}</span>` : ''}
                </div>
              </div>
            ` : ''}

            ${this.phase === 'done' ? `
              <div class="eq-row is-celebrate">
                <span class="eq-step-num">3</span>
                <div class="eq-math eq-math-wrap">
                  <span class="op-eq">=</span>
                  ${fracHTML(a.resultNum, a.resultDen, 'c-result eq-ans-highlight')}
                  ${niceAnswerHTML}
                </div>
              </div>
            ` : ''}
          </div>

          <div class="result-stage">
            <div class="result-head">
              <span>ผลลัพธ์ในถาด</span>
              ${this.phase === 'done'
                ? (a.isWhole
                  ? `<strong class="res-badge">${a.mixedWhole} ถาดเต็ม</strong>`
                  : fracHTML(a.resultNum, a.resultDen, 'c-result frac-sm'))
                : `<span class="res-pending">รอ${isAdd ? 'รวมชิ้น' : 'ตักออก'}</span>`
              }
            </div>
            <div class="result-figure">
              ${this.phase === 'done'
                ? resultTraySVG
                : `<div class="result-placeholder" aria-hidden="true"><span>?</span></div>`
              }
            </div>
          </div>
        </aside>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelectorAll('[data-action="slice-step"]').forEach((el) => {
      const trigger = () => this.handleSliceStep();
      el.addEventListener('click', trigger);
      if (el.getAttribute('role') === 'button') {
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trigger();
          }
        });
      }
    });

    const combineBtn = this.container.querySelector('[data-action="combine"]');
    if (combineBtn) combineBtn.addEventListener('click', () => this.handleCombine());

    this.container.querySelectorAll('[data-action="next-problem"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        soundFx.tap();
        this.loadProblem(false);
      });
    });

    const lvlBtn = this.container.querySelector('[data-action="cycle-level"]');
    if (lvlBtn) {
      lvlBtn.addEventListener('click', () => {
        soundFx.tap();
        this.level = this.level >= 3 ? 1 : this.level + 1;
        this.solvedStreak = 0;
        this.loadProblem(this.level === 1);
      });
    }

    const shapeBtn = this.container.querySelector('[data-action="cycle-shape"]');
    if (shapeBtn) {
      shapeBtn.addEventListener('click', () => {
        soundFx.tap();
        const idx = SHAPE_CYCLE.indexOf(this.visualMode);
        this.visualMode = SHAPE_CYCLE[(idx + 1) % SHAPE_CYCLE.length];
        this.animateSlice = false;
        this.animateMerge = false;
        this.render();
      });
    }

    const toggleBefore = this.container.querySelector('[data-action="toggle-before"]');
    if (toggleBefore) {
      toggleBefore.addEventListener('click', () => {
        soundFx.tap();
        this.showBeforeView = !this.showBeforeView;
        this.animateSlice = false;
        this.render();
      });
    }

    const customBtn = this.container.querySelector('[data-action="toggle-custom"]');
    if (customBtn) {
      customBtn.addEventListener('click', () => {
        soundFx.tap();
        this.customOpen = !this.customOpen;
        this.render();
      });
    }

    this.container.querySelectorAll('[data-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        soundFx.tap();
        this.loadSpecificProblem(PRESETS[Number(btn.dataset.preset)]);
      });
    });

    this.container.querySelectorAll('[data-cstep]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [f, d] = btn.dataset.cstep.split(':');
        this.stepCustom(f, Number(d));
      });
    });

    const applyBtn = this.container.querySelector('[data-action="apply-custom"]');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        soundFx.tap();
        this.loadSpecificProblem({
          n1: this.customN1,
          d1: this.customD1,
          n2: this.customN2,
          d2: this.customD2,
          op: this.getGlobalState().op,
        });
      });
    }
  }
}
