/**
 * app.js
 * Distilled Root Controller for ครัววุ้นเศษส่วน ป.4
 * Clean 2-mode switch: เรียน (Learn) | เล่นเกม (Game) + global บวก / ลบ + Sound
 */

import { LearnMode } from './learnMode.js';
import { GameMode } from './gameMode.js';
import { ICONS } from './visualSvg.js';
import { soundFx } from './soundFx.js';

const state = {
  mode: 'learn', // 'learn' | 'game'
  op: '+',       // '+' | '-'
};

const stageRoot = document.getElementById('appStage');

const getGlobalState = () => ({ ...state });

const setGlobalOp = (newOp) => {
  if (newOp !== '+' && newOp !== '-') return;
  state.op = newOp;
  syncHeaderUI();
};

const learn = new LearnMode(stageRoot, getGlobalState, setGlobalOp);
const game = new GameMode(stageRoot, getGlobalState);

function getActiveController() {
  return state.mode === 'game' ? game : learn;
}

function hydrateIcons() {
  document.querySelectorAll('[data-icon]').forEach((slot) => {
    const key = slot.dataset.icon;
    if (ICONS[key]) slot.innerHTML = ICONS[key];
  });
}

function syncHeaderUI() {
  document.querySelectorAll('[data-mode]').forEach((btn) => {
    const active = btn.dataset.mode === state.mode;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', String(active));
  });

  document.querySelectorAll('[data-op]').forEach((btn) => {
    const active = btn.dataset.op === state.op;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.innerHTML = soundFx.enabled ? ICONS.soundOn : ICONS.soundOff;
    soundBtn.setAttribute('aria-pressed', String(soundFx.enabled));
    soundBtn.setAttribute('aria-label', soundFx.enabled ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์');
  }
}

function bindHeaderEvents() {
  document.querySelectorAll('[data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextMode = btn.dataset.mode;
      if (nextMode !== state.mode) {
        soundFx.tap();
        state.mode = nextMode;
        syncHeaderUI();
        getActiveController().render();
      }
    });
  });

  document.querySelectorAll('[data-op]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextOp = btn.dataset.op;
      if (nextOp !== state.op) {
        soundFx.tap();
        state.op = nextOp;
        syncHeaderUI();
        getActiveController().onGlobalChange('op');
      }
    });
  });

  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundFx.toggle();
      syncHeaderUI();
    });
  }
}

hydrateIcons();
bindHeaderEvents();
syncHeaderUI();
learn.loadProblem(true);
