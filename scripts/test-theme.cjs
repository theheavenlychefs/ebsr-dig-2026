const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const postcss = require('postcss');
const jsx = require('react/jsx-runtime');

function load(path, imports = {}, globals = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText, { exports, require: (name) => imports[name] ?? require(name), ...globals });
  return exports;
}
const writing = load('src/lib/theme-handwriting.ts');
assert.equal(writing.themeScripture, 'To live is Christ, to die is gain.');
assert.equal(writing.themeStatement, 'The message of DIG is not simply about death. It is about a life so completely identified with Christ that He becomes its purpose, its substance, and its ultimate hope.');
assert.equal(writing.handwritingLines.length, 2);
assert.ok(writing.handwritingLines.every((line) => line.width < 400));
assert.ok(writing.writingDuration >= 3500 && writing.writingDuration <= 5500);

assert.equal(writing.themeLead, 'Before death can be gain, Christ must be life.');
assert.equal(writing.handwritingLines.flatMap((line) => line.strokes).filter((stroke) => stroke.tone === 'positive').length > 0, true);
assert.equal(writing.handwritingLines.flatMap((line) => line.strokes).filter((stroke) => stroke.tone === 'negative').length > 0, true);
let entered = false, callback, disconnected = 0;
const effects = [];
const timers = new Map();
let now = 0, timerId = 0;
const scheduler = { performance: { now: () => now }, setTimeout: (fn, delay) => { timers.set(++timerId, { fn, at: now + delay }); return timerId; }, clearTimeout: (id) => timers.delete(id) };
const typing = load('src/lib/theme-typewriter.ts', { './theme-handwriting': writing }, scheduler);
const Reflection = function Reflection() {};
const Logo = function Logo() {};
const React = {
  useRef: () => ({ current: {} }),
  useState: () => [entered, (value) => { entered = value; }],
  useEffect: (fn) => effects.push(fn),
};
class Observer {
  constructor(fn) { callback = fn; }
  observe() {}
  disconnect() { disconnected++; }
}
const { ThemeSection } = load('src/components/ThemeSection.tsx', {
  react: React,
  'react/jsx-runtime': jsx,
  'next/image': function Image() {},
  './CyclicAlphaLogo': { CyclicAlphaLogo: Logo },
  './ThemeReflection': { ThemeReflection: Reflection },
  '@/lib/edition': load('src/lib/edition.ts'),
  '@/lib/theme-handwriting': writing,
}, { IntersectionObserver: Observer });
function descendants(node, test) {
  if (!node || typeof node !== 'object') return [];
  return [...(test(node) ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap((child) => descendants(child, test))];
}
let tree = ThemeSection();
assert.equal(tree.props['data-entered'], false);
assert.equal(descendants(tree, (node) => node.type === Logo).length, 0, 'no second logo video request before the section is entered');
const cleanup = effects[0]();
callback([{ isIntersecting: false }]);
assert.equal(entered, false);
callback([{ isIntersecting: true }]);
assert.equal(entered, true);
assert.equal(disconnected, 1, 'disconnect after first entry so text does not replay');
effects.length = 0;
tree = ThemeSection();
assert.equal(descendants(tree, (node) => node.type === Reflection)[0].props.active, true);
assert.equal(descendants(tree, (node) => node.type === Logo).length, 1, 'reuse approved logo cycle');
const paths = descendants(tree, (node) => node.type === 'path');
assert.equal(paths.length, writing.writingStrokeCount);
assert.ok(paths.length > 30, 'individual pen strokes rather than a sentence fade');
paths.forEach((path, i) => {
  assert.equal(path.props.pathLength, 1);
  assert.equal(parseFloat(path.props.style['--stroke-delay']), i * writing.writingDuration / paths.length);
});
cleanup();
assert.equal(disconnected, 2);

let visible = 0;
const writer = typing.createThemeTypewriter((count) => { visible = count; });
assert.equal(timers.size, 1);
function delayedTick(time) {
  now = time;
  const due = [...timers].filter(([, timer]) => timer.at <= now);
  for (const [id, timer] of due) { timers.delete(id); timer.fn(); }
}
delayedTick(typing.typingStart + 1000);
assert.equal(visible, typing.typingTimeline.filter((time) => time <= 1000).length, 'late callbacks catch up without accumulating lag');
assert.equal(timers.size, 1, 'one clock rather than an animation or timer per character');
writer.pause(true);
const saved = visible;
delayedTick(now + 9000);
assert.equal(visible, saved);
assert.equal(timers.size, 0);
writer.pause(false);
delayedTick(now + typing.typingTimeline.at(-1) + 1000);
assert.equal(visible, (writing.themeLead + writing.themeStatement).replace(/\s/g, '').length, 'both complete texts remain visible');
assert.equal(timers.size, 0);
writer.destroy();
for (const reduced of [false, true]) {
  visible = 0;
  const reflectionEffects = [], listeners = new Map();
  const { ThemeReflection } = load('src/components/ThemeReflection.tsx', {
    react: { useState: () => [visible, (value) => { visible = value; }], useEffect: (fn) => reflectionEffects.push(fn) },
    '@/lib/theme-typewriter': typing,
  }, {
    window: { matchMedia: () => ({ matches: reduced, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: (name) => listeners.delete(name) }) },
    document: { hidden: false, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: (name) => listeners.delete(name) },
  });
  ThemeReflection({ active: true });
  const dispose = reflectionEffects[0]();
  if (reduced) assert.equal(visible, typing.typingTimeline.length, 'reduced motion reveals both texts immediately');
  const content = ThemeReflection({ active: true });
  const chars = descendants(content, (node) => node.props?.className === 'theme-typed-character');
  assert.equal(chars.map((node) => node.props.children).join(''), (writing.themeLead + writing.themeStatement).replace(/\s/g, ''));
  dispose();
  assert.equal(timers.size + listeners.size, 0, 'all clocks and listeners are cleaned up');
}

const css = postcss.parse(fs.readFileSync('src/app/globals.css', 'utf8'));
const declarations = (selector) => {
  const values = new Map();
  css.nodes.filter((node) => node.type === 'rule' && node.selector === selector).forEach((rule) => rule.walkDecls((decl) => values.set(decl.prop, decl.value)));
  return values;
};
assert.equal(declarations('.theme-logo').get('mix-blend-mode'), 'screen', 'remove the supplied black matte only in Theme');
assert.equal(declarations('.theme-inner').has('z-index'), false, 'blend against scenery, not an isolated transparent wrapper');
assert.equal(declarations('.theme-writing-positive').get('color'), '#939f72');
assert.equal(declarations('.theme-writing-negative').get('color'), '#b4776d');
const motion = css.nodes.find((node) => node.type === 'atrule' && node.params === '(prefers-reduced-motion: reduce), (scripting: none)');
assert.ok(motion);
const finalStyles = new Map();
motion.walkRules((rule) => rule.walkDecls((decl) => finalStyles.set(`${rule.selector}:${decl.prop}`, decl.value)));
assert.equal(finalStyles.get('.theme-writing-stroke:animation'), 'none');
assert.equal(finalStyles.get('.theme-writing-stroke:stroke-dashoffset'), '0');
assert.equal(finalStyles.get('.theme-typed-character:animation'), 'none');
assert.equal(finalStyles.get('.theme-typed-character:opacity'), '1');
const scenery = css.nodes.find((node) => node.type === 'rule' && node.selector === '.edition-scene::before');
assert.ok(scenery, 'shared background stays on an isolated decorative layer');
const sceneryStyles = new Map();
scenery.walkDecls((decl) => sceneryStyles.set(decl.prop, decl.value));
assert.ok(sceneryStyles.get('background-image').includes('url("/assets/hero-background.png")'));
assert.equal(sceneryStyles.get('pointer-events'), 'none');
for (const section of ['retreat', 'experience', 'theme']) {
  const selector = `.${section}-section.edition-scene`;
  const desktop = css.nodes.find((node) => node.type === 'rule' && node.selector === selector);
  let mobile;
  css.walkAtRules('media', (rule) => {
    if (rule.params !== '(width < 48rem)') return;
    rule.walkRules(selector, (match) => { mobile = match; });
  });
  assert.ok(desktop && mobile, `${section} has intentional desktop and mobile scenery`);
  assert.ok(!desktop.nodes.some((decl) => decl.prop === 'opacity'), 'never dim section content');
}
console.log('PASS: one-time viewport entry, deferred logo, ordered pen strokes, progressive typing, accessible copy, reduced-motion final styles and observer cleanup.');
