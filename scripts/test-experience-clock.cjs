const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = ts.transpileModule(fs.readFileSync('src/lib/experience-clock.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
}).outputText;
const exported = {};
vm.runInNewContext(source, { exports: exported });
const { createExperienceClock, slideDuration } = exported;

assert.equal(slideDuration('Short copy'), 7000);
assert.equal(slideDuration(Array(20).fill('word').join(' ')), 9000);
assert.equal(slideDuration(Array(200).fill('word').join(' ')), 63000);

let now = 0;
let nextId = 0;
let completed = 0;
let latest;
const timers = new Map();
const scheduler = {
  now: () => now,
  schedule(callback, delay) {
    const id = ++nextId;
    timers.set(id, { callback, at: now + delay });
    return id;
  },
  cancel: (id) => timers.delete(id),
};
function advance(milliseconds) {
  const end = now + milliseconds;
  while (true) {
    const next = [...timers.entries()].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
    if (!next) break;
    const [id, timer] = next;
    now = timer.at;
    timers.delete(id);
    timer.callback();
  }
  now = end;
}

const clock = createExperienceClock(() => completed++, (value) => { latest = value; }, scheduler);
clock.reset(9000);
advance(20000);
assert.equal(completed, 0, 'offscreen slides do not run');
clock.pause('offscreen', false);
advance(2000);
clock.pause('hover', true);
assert.equal(latest.remaining, 7000);
clock.pause('focus', true);
advance(15000);
clock.pause('hover', false);
assert.equal(latest.running, false, 'focus outlives hover');
clock.pause('focus', false);
advance(1000);
clock.pause('hidden', true);
assert.equal(latest.remaining, 6000);
advance(60000);
clock.pause('hidden', false);
advance(5999);
assert.equal(completed, 0);
advance(1);
assert.equal(completed, 1, 'resume uses remaining time');
assert.equal(timers.size, 0, 'completion waits for slide lifecycle');

clock.reset(7000);
clock.pause('transition', false);
advance(1000);
clock.pause('pointer', true);
clock.pause('user', true);
advance(20000);
clock.pause('pointer', false);
assert.equal(latest.running, false, 'interaction cannot undo explicit pause');
clock.pause('user', false);
assert.equal(latest.remaining, 6000);
clock.pause('motion', true);
advance(60000);
assert.equal(completed, 1, 'reduced motion disables advancement');
clock.pause('motion', false);

for (let i = 0; i < 20; i++) {
  clock.reset(7000);
  assert.equal(timers.size, 1, 'rapid navigation keeps only one timer');
}
clock.destroy();
assert.equal(timers.size, 0);
advance(100000);
assert.equal(completed, 1, 'unmount cancels all scheduled work');
console.log('PASS: reading duration, offscreen, overlapping pauses, hidden-tab remaining time, interaction, reduced motion, repeated navigation and cleanup.');
