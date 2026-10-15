const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const jsx = require('react/jsx-runtime');

let now = 0;
let nextTimer = 0;
const timers = new Map();
const setTimer = (callback, delay) => {
  const id = ++nextTimer;
  timers.set(id, { callback, at: now + delay });
  return id;
};
const listeners = new Map();
const motion = { matches: false, addEventListener: (_, fn) => listeners.set('motion', fn), removeEventListener: () => listeners.delete('motion') };
const document = { hidden: false, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: (name) => listeners.delete(name) };
let intersection;
class IntersectionObserver {
  constructor(callback) { intersection = callback; }
  observe() { this.visible = true; }
  disconnect() { this.visible = false; }
}
const modules = {};
function load(path, imports = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, {
    exports, require: (name) => imports[name] ?? modules[name] ?? require(name),
    window: { matchMedia: () => motion }, document, IntersectionObserver,
    setTimeout: setTimer, clearTimeout: (id) => timers.delete(id), performance: { now: () => now },
  });
  return exports;
}
modules['./edition'] = load('src/lib/edition.ts');
modules['@/lib/experience-slides'] = load('src/lib/experience-slides.ts');
modules['@/lib/experience-clock'] = load('src/lib/experience-clock.ts');
modules['@/lib/edition'] = modules['./edition'];
const slideCount = modules['@/lib/experience-slides'].experienceSlides.length;
assert.equal(slideCount, 3);
for (const slide of modules['@/lib/experience-slides'].experienceSlides) {
  assert.equal(slide.media.kind, 'video');
  assert.ok(slide.media.src.startsWith('/assets/experience-'), 'do not reuse the About retreat film');
  assert.ok(fs.existsSync('public' + slide.media.src));
  assert.ok(fs.existsSync('public' + slide.media.poster));
}

let selected = 0;
let lastJump = false;
const events = new Map();
const api = {
  selectedScrollSnap: () => selected,
  on(name, callback) { events.set(name, callback); return api; },
  off(name) { events.delete(name); return api; },
  scrollTo(index, jump = false) {
    selected = index;
    lastJump = jump;
    events.get('select')?.();
    events.get('scroll')?.();
    if (jump) events.get('settle')?.();
    else setTimer(() => events.get('settle')?.(), 600);
  },
  scrollNext() { api.scrollTo((selected + 1) % slideCount); },
};
const states = [], refs = [], effects = [];
let stateIndex, refIndex, effectIndex, dirty = true;
const React = {
  useRef(initial) { const index = refIndex++; return refs[index] ??= { current: initial }; },
  useState(initial) {
    const index = stateIndex++;
    if (!(index in states)) states[index] = initial;
    return [states[index], (value) => { states[index] = typeof value === 'function' ? value(states[index]) : value; dirty = true; }];
  },
  useEffect(callback, deps) {
    const index = effectIndex++;
    const old = effects[index];
    if (!old || deps.some((value, i) => value !== old.deps[i])) effects[index] = { callback, deps, cleanup: old?.cleanup, pending: true };
  },
};
const ExperienceMedia = function ExperienceMedia() {};
const { ExperienceSection } = load('src/components/ExperienceSection.tsx', {
  react: React,
  'react/jsx-runtime': jsx,
  'embla-carousel-react': () => [() => {}, api],
  './ExperienceMedia': { ExperienceMedia },
});
let tree;
function render() {
  let passes = 0;
  while (dirty) {
    assert.ok(passes++ < 20, 'effects stabilize');
    dirty = false;
    stateIndex = refIndex = effectIndex = 0;
    tree = ExperienceSection();
    refs[0].current = { contains: () => false };
    refs[1].current = { style: {}, animate: () => ({ cancel() {} }) };
    for (const effect of effects) {
      if (!effect.pending) continue;
      effect.pending = false;
      effect.cleanup?.();
      effect.cleanup = effect.callback();
    }
  }
}
function advance(milliseconds) {
  const end = now + milliseconds;
  while (true) {
    const next = [...timers.entries()].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
    if (!next) break;
    const [id, timer] = next;
    now = timer.at;
    timers.delete(id);
    timer.callback();
    render();
  }
  now = end;
  render();
}
function children(node, predicate) {
  if (!node || typeof node !== 'object') return [];
  const nested = [node.props?.children].flat(Infinity);
  return [...(predicate(node) ? [node] : []), ...nested.flatMap((child) => children(child, predicate))];
}
const control = (label) => children(tree, (node) => node.props?.['aria-label'] === label)[0];
const video = () => children(tree, (node) => node.type === ExperienceMedia && node.props.slide.name === 'Fellowship')[0];
const running = () => tree.props['data-running'];

render();
assert.equal(running(), false);
intersection([{ isIntersecting: true, intersectionRatio: 1 }]);
render();
assert.equal(running(), true);
advance(2000);
tree.props.onFocusCapture({ target: { matches: () => false } });
render();
assert.equal(running(), true, 'touch/pointer focus does not permanently block resume');
tree.props.onFocusCapture({ target: { matches: () => true } });
render();
assert.equal(running(), false, 'keyboard focus pauses');
tree.props.onBlurCapture({ currentTarget: { contains: () => false }, relatedTarget: null });
render();
document.hidden = true;
listeners.get('visibilitychange')();
render();
const remaining = states[5].remaining;
advance(60000);
assert.equal(selected, 0);
assert.equal(video().props.playing, false, 'hidden documents pause the film');
document.hidden = false;
listeners.get('visibilitychange')();
render();
advance(remaining - 1);
assert.equal(selected, 0);
advance(1);
assert.equal(selected, 1, 'visibility resumes the remaining reading time');
advance(600);

motion.matches = true;
listeners.get('motion')();
render();
advance(60000);
assert.equal(selected, 1);
assert.equal(running(), false);
assert.equal(control('Automatic slides disabled for reduced motion').props.disabled, true);
control('Next experience').props.onClick();
render();
assert.equal(selected, 2);
assert.equal(lastJump, true, 'manual reduced-motion navigation jumps without a long transition');
motion.matches = false;
listeners.get('motion')();
render();
control('Go to slide 2: Fellowship').props.onClick();
render();
assert.equal(video().props.active, true);
assert.equal(video().props.playing, true);
control('Go to slide 3: Memories').props.onClick();
render();
assert.equal(video().props.active, false, 'only the active slide is permitted to play');
advance(600);
for (const effect of effects) effect.cleanup?.();
assert.equal(listeners.size, 0);
assert.equal(events.size, 0);
assert.equal(timers.size, 0);
console.log('PASS: component visibility lifecycle, remaining time, touch versus keyboard focus, reduced motion, active video gating, event and timer cleanup.');
