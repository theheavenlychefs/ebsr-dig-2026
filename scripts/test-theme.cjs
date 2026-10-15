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

let entered = false, complete = false, stateIndex = 0, callback, disconnected = 0;
const effects = [];
const timers = new Map();
const motionPreference = { matches: false };
const Logo = function Logo() {};
const React = {
  useRef: () => ({ current: {} }),
  useState: () => stateIndex++ === 0 ? [entered, (value) => { entered = value; }] : [complete, (value) => { complete = value; }],
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
  '@/lib/edition': load('src/lib/edition.ts'),
  '@/lib/theme-handwriting': writing,
}, { IntersectionObserver: Observer, window: { matchMedia: () => motionPreference }, setTimeout: (fn, delay) => { timers.set(1, { fn, delay }); return 1; }, clearTimeout: (id) => timers.delete(id) });
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
stateIndex = 0;
effects.length = 0;
tree = ThemeSection();
const typingCleanup = effects[1]();
assert.equal(timers.get(1).delay, writing.typingCompletion);
assert.ok(writing.typingCompletion > 11000 && writing.typingCompletion < 12000);
assert.equal(descendants(tree, (node) => node.type === Logo).length, 1, 'reuse approved logo cycle');
const paths = descendants(tree, (node) => node.type === 'path');
assert.equal(paths.length, writing.writingStrokeCount);
assert.ok(paths.length > 30, 'individual pen strokes rather than a sentence fade');
paths.forEach((path, i) => {
  assert.equal(path.props.pathLength, 1);
  assert.equal(parseFloat(path.props.style['--stroke-delay']), i * writing.writingDuration / paths.length);
});
const chars = descendants(tree, (node) => node.props?.className === 'theme-typed-character');
assert.equal(chars.map((node) => node.props.children).join(''), writing.themeStatement.replace(/\s/g, ''));
assert.ok(parseFloat(chars[0].props.style['--character-delay']) > writing.writingDuration);
timers.get(1).fn();
stateIndex = 0;
tree = ThemeSection();
assert.equal(descendants(tree, (node) => node.props?.className === 'theme-statement')[0].props['data-typing-complete'], true, 'the full reflection persists independently of CSS scheduling');
typingCleanup();
assert.equal(timers.size, 0, 'no completion timer leaks');
complete = false;
motionPreference.matches = true;
stateIndex = 0;
effects.length = 0;
ThemeSection();
effects[1]();
assert.equal(complete, true, 'reduced motion immediately persists the entire reflection');
assert.equal(timers.size, 0, 'reduced motion requires no completion timer');
cleanup();
assert.equal(disconnected, 2);

const css = postcss.parse(fs.readFileSync('src/app/globals.css', 'utf8'));
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
