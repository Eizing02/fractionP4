/**
 * gameMode.js
 * Distilled Mode 2: เล่นเกมร้านวุ้น (Simple, Joyful 2-Step Game)
 * - Uses global + / - from top bar (plus optional 1-tap "ผสม +/−" toggle)
 * - Step 1: Pick from just 3 big knife multipliers to match slice sizes
 * - Step 2: Pick from just 3 big answer plates to serve the animal customer
 */

import { analyzeProblem, fracHTML, mixedHTML } from './mathEngine.js';
import { problemDeck, buildGameChoices } from './problemGenerator.js';
import { ICONS, renderTraySVG, renderUnitCompareSVG } from './visualSvg.js';
import { soundFx } from './soundFx.js';

const STICKER_KEY = 'jelly_shop_stars_v1';
const LEVEL_NAMES = { 1: 'ง่าย', 2: 'กลาง', 3: 'ท้าทาย' };

const CUSTOMERS = [
  { name: 'น้องส้ม', img: './assets/images/customer-cat.jpg', greet: 'ขอวุ้นอร่อย ๆ หน่อยนะ' },
  { name: 'น้องใบบัว', img: './assets/images/customer-elephant.jpg', greet: 'หั่นชิ้นให้เท่ากันก่อนนะ' },
  { name: 'น้องหมีทอง', img: './assets/images/customer-bear.jpg', greet: 'รอชิมวุ้นอยู่เลย!' },
];

function buildThreeKnives(requiredMult) {
  const set = new Set([requiredMult]);
  const candidates = [requiredMult - 1, requiredMult + 1, requiredMult + 2, 2, 3, 4, 5, 6];
  for (const c of candidates) {
    if (set.size >= 3) break;
    if (c >= 2 && c <= 6) set.add(c);
  }
  return Array.from(set).sort((a, b) => a - b);
}

export class GameMode {
  constructor(container, getGlobalState) {
    this.container = container;
    this.getGlobalState = getGlobalState;
    this.level = 1;
    this.mixedOps = false;
    this.lastOp = null;

    this.customerIdx = 0;
    this.problem = null;
    this.analysis = null;
    this.knives = [];
    this.choices = [];

    this.stage = 'slice'; // 'slice' | 'answer' | 'served'
    this.currentMult = 1;
    this.feedback = '';
    this.wrongChoiceKey = null;
    this.stars = this.loadStars();
  }

  loadStars() {
    try {
      return Number(localStorage.getItem(STICKER_KEY)) || 0;
    } catch {
      return 0;
    }
  }

  saveStars() {
    try {
      localStorage.setItem(STICKER_KEY, String(this.stars));
    } catch {
      // Ignore private browsing limits
    }
  }

  nextOrder() {
    const { op } = this.getGlobalState();
    this.problem = this.mixedOps
      ? problemDeck.nextMixed(this.level, this.lastOp)
      : problemDeck.next(op, this.level, false);

    this.lastOp = this.problem.op;
    this.analysis = analyzeProblem(this.problem);
    this.knives = buildThreeKnives(this.analysis.requiredMult);

    // Keep only 3 clean choices (1 correct + 2 distractors) so kids aren't overwhelmed!
    const fourChoices = buildGameChoices(this.analysis);
    const correct = fourChoices.find((c) => c.isCorrect);
    const wrongs = fourChoices.filter((c) => !c.isCorrect).slice(0, 2);
    this.choices = [correct, ...wrongs].sort(() => Math.random() - 0.5);

    this.customerIdx = (this.customerIdx + 1) % CUSTOMERS.length;
    this.stage = this.analysis.targetSide === 'none' ? 'answer' : 'slice';
    this.currentMult = 1;
    this.feedback = '';
    this.wrongChoiceKey = null;
    this.render();
  }

  onGlobalChange(reason) {
    if (reason === 'op') {
      this.mixedOps = false;
      this.nextOrder();
    } else if (!this.problem) {
      this.nextOrder();
    } else {
      this.render();
    }
  }

  handleKnife(k) {
    if (this.stage !== 'slice') return;
    this.currentMult = k;
    if (k === this.analysis.requiredMult) {
      soundFx.match();
      this.stage = 'answer';
      this.feedback = 'ชิ้นเท่ากันแล้ว! เลือกคำตอบเสิร์ฟเลย';
    } else {
      soundFx.slice();
      this.feedback = k < this.analysis.requiredMult ? 'ชิ้นยังใหญ่กว่า ลองเลขมากขึ้น' : 'เล็กไปหน่อย ลองเลขน้อยลง';
    }
    this.render();
  }

  handleAnswer(idx) {
    if (this.stage !== 'answer') return;
    const choice = this.choices[idx];
    if (!choice) return;

    if (choice.isCorrect) {
      soundFx.celebrate();
      this.stage = 'served';
      this.stars += 1;
      this.saveStars();
      this.wrongChoiceKey = null;
      this.feedback = 'อร่อยมาก! ตรงออเดอร์เป๊ะเลย';
    } else {
      soundFx.gentleNudge();
      this.wrongChoiceKey = `${choice.num}/${choice.den}`;
      const a = this.analysis;
      this.feedback = a.op === '+'
        ? `ลองรวม ${a.cn1} กับ ${a.cn2} ชิ้นดูใหม่นะ`
        : `มี ${a.cn1} ชิ้น ตักออก ${a.cn2} ชิ้น เหลือกี่ชิ้นนะ`;
    }
    this.render();
  }

  render() {
    if (!this.problem) {
      this.nextOrder();
      return;
    }

    const a = this.analysis;
    const vMode = a.suggestedVisual;
    const isAdd = a.op === '+';
    const rightRole = isAdd ? 'add' : 'sub';
    const rightCls = isAdd ? 'c-add' : 'c-sub';
    const opSym = isAdd ? '+' : '&minus;';
    const customer = CUSTOMERS[this.customerIdx];

    const leftMult = a.targetSide === 'left' ? this.currentMult : 1;
    const rightMult = a.targetSide === 'right' ? this.currentMult : 1;
    const curN1 = a.n1 * leftMult;
    const curD1 = a.d1 * leftMult;
    const curN2 = a.n2 * rightMult;
    const curD2 = a.d2 * rightMult;
    const isMatched = curD1 === curD2;

    const leftTray = renderTraySVG({
      num: a.n1, den: a.d1, mult: leftMult, role: 'left', visualMode: vMode,
      removeCount: !isAdd && this.stage === 'served' ? a.cn2 : 0,
      animateScoop: !isAdd && this.stage === 'served',
      size: 136,
    });
    const rightTray = renderTraySVG({
      num: a.n2, den: a.d2, mult: rightMult, role: rightRole, visualMode: vMode,
      isGhostTray: !isAdd,
      size: 136,
    });

    const servedTray = this.stage === 'served'
      ? (isAdd
        ? renderTraySVG({ num: a.cn1, den: a.commonDen, role: 'left', visualMode: vMode, secondaryCount: a.cn2, secondaryRole: 'add', animateMerge: true, size: 140 })
        : renderTraySVG({ num: a.resultNum, den: a.commonDen, role: 'left', visualMode: vMode, animateMerge: true, size: 140 }))
      : '';

    const unitCompare = renderUnitCompareSVG({ dLeft: curD1, dRight: curD2, op: a.op });

    this.container.innerHTML = `
      <div class="quiet-bar">
        <div class="quiet-left">
          <button type="button" class="quiet-btn" data-action="cycle-glevel">
            <span>ระดับ: <strong>${LEVEL_NAMES[this.level]}</strong></span>
          </button>
          <button type="button" class="quiet-btn ${this.mixedOps ? 'is-open' : ''}" data-action="toggle-mixed" aria-pressed="${this.mixedOps}">
            <span>${this.mixedOps ? 'สุ่มผสม + / −' : 'เปิดสุ่มผสม + / −'}</span>
          </button>
        </div>

        <div class="star-counter" aria-label="สะสมสติกเกอร์วุ้นได้ ${this.stars} ชิ้น">
          <img class="sticker-badge-ico" src="./assets/images/jelly-sticker.jpg" alt="" width="28" height="28">
          <span class="star-num">${this.stars}</span>
        </div>
      </div>

      <div class="game-layout">
        <div class="customer-banner ${this.stage === 'served' ? 'is-happy' : ''}">
          <img class="customer-art" src="${customer.img}" alt="${customer.name}" width="88" height="88">
          <div class="customer-bubble">
            <div class="order-math">
              <strong class="cust-name">${customer.name}:</strong>
              ${fracHTML(a.n1, a.d1, 'c-left')}
              <span class="op-sym ${isAdd ? 'op-add' : 'op-sub'}">${opSym}</span>
              ${fracHTML(a.n2, a.d2, rightCls)}
              <span class="op-eq">=</span>
              ${this.stage === 'served'
                ? fracHTML(a.resultNum, a.resultDen, 'c-result eq-ans-highlight')
                : `<span class="order-qmark">?</span>`}
            </div>
            <p class="game-feedback">${this.feedback || customer.greet}</p>
          </div>
        </div>

        <div class="game-kitchen">
          <div class="trays-arena">
            <div class="tray-slot ${a.targetSide === 'left' && this.stage === 'slice' ? 'is-target-tray' : ''}">
              <div class="tray-label c-left">
                <span>ถาดซ้าย</span>
                ${fracHTML(curN1, curD1, 'c-left frac-sm')}
              </div>
              <div class="tray-figure">${leftTray}</div>
            </div>

            <div class="arena-op ${isAdd ? 'op-add' : 'op-sub'}" aria-hidden="true">
              ${isAdd ? ICONS.plus : ICONS.minus}
            </div>

            <div class="tray-slot ${a.targetSide === 'right' && this.stage === 'slice' ? 'is-target-tray' : ''}">
              <div class="tray-label ${rightCls}">
                <span>${isAdd ? 'ถาดขวา' : 'ตักออก'}</span>
                ${fracHTML(curN2, curD2, `${rightCls} frac-sm`)}
              </div>
              <div class="tray-figure">${rightTray}</div>
            </div>
          </div>

          <div class="compare-strip ${isMatched ? 'is-equal' : 'is-unequal'}">
            <div class="compare-status">
              <span class="status-icon">${isMatched ? ICONS.check : ICONS.x}</span>
              <span class="status-word">${isMatched ? 'ชิ้นเท่ากันแล้ว!' : 'หั่นให้ชิ้นเท่ากัน'}</span>
            </div>
            <div class="compare-graphic">${unitCompare}</div>
          </div>

          ${this.stage === 'slice' ? `
            <div class="game-action-zone">
              <div class="choice-three">
                ${this.knives.map((k) => `
                  <button type="button" class="knife-big-btn ${this.currentMult === k ? 'is-off' : ''}" data-gknife="${k}">
                    ${ICONS.knife}<span>&times;${k}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${this.stage === 'answer' ? `
            <div class="game-action-zone">
              <div class="choice-three">
                ${this.choices.map((c, idx) => {
                  const isWrong = this.wrongChoiceKey === `${c.num}/${c.den}`;
                  return `
                    <button type="button" class="choice-btn ${isWrong ? 'is-wrong' : ''}" data-choice="${idx}">
                      ${fracHTML(c.num, c.den, 'c-ink')}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          ${this.stage === 'served' ? `
            <div class="served-dock">
              <div class="served-plate">
                ${servedTray}
                <div class="served-meta">
                  <div class="served-eq">
                    ${fracHTML(a.resultNum, a.resultDen, 'c-result eq-ans-highlight')}
                    ${a.hasNiceForm ? `<span class="op-eq">=</span> ${a.isWhole ? `<span class="whole-num eq-ans-highlight">${a.mixedWhole}</span>` : mixedHTML(a.simpMixedWhole, a.simpMixedRem, a.simpDen, 'c-result eq-ans-highlight')}` : ''}
                  </div>
                  <button type="button" class="hero-action-btn is-next" data-action="next-order">
                    <span>ลูกค้ารายถัดไป</span>${ICONS.next}
                  </button>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const lvlBtn = this.container.querySelector('[data-action="cycle-glevel"]');
    if (lvlBtn) {
      lvlBtn.addEventListener('click', () => {
        soundFx.tap();
        this.level = this.level >= 3 ? 1 : this.level + 1;
        this.nextOrder();
      });
    }

    const mixBtn = this.container.querySelector('[data-action="toggle-mixed"]');
    if (mixBtn) {
      mixBtn.addEventListener('click', () => {
        soundFx.tap();
        this.mixedOps = !this.mixedOps;
        this.nextOrder();
      });
    }

    this.container.querySelectorAll('[data-gknife]').forEach((btn) => {
      btn.addEventListener('click', () => this.handleKnife(Number(btn.dataset.gknife)));
    });

    this.container.querySelectorAll('[data-choice]').forEach((btn) => {
      btn.addEventListener('click', () => this.handleAnswer(Number(btn.dataset.choice)));
    });

    const nextBtn = this.container.querySelector('[data-action="next-order"]');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        soundFx.tap();
        this.nextOrder();
      });
    }
  }
}
