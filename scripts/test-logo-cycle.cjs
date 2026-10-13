const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = ts.transpileModule(fs.readFileSync('src/components/CyclicAlphaLogo.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function harness({ reduced = false, alpha = true, supported = true, ready = true, reject = false, frames = true, suppressedFrames = false } = {}) {
  let now = 0, nextId = 0, shown = false, refIndex = 0, observer;
  const timers = new Map(), effects = [], requests = [];
  const targets = [];
  class Target extends EventTarget {
    listeners = new Map();
    constructor() { super(); targets.push(this); }
    addEventListener(name, fn, options) {
      if (!this.listeners.has(name)) this.listeners.set(name, new Set());
      this.listeners.get(name).add(fn); super.addEventListener(name, fn, options);
    }
    removeEventListener(name, fn, options) {
      this.listeners.get(name)?.delete(fn); super.removeEventListener(name, fn, options);
    }
  }
  const schedule = (fn, delay) => { const id = ++nextId; timers.set(id, { at: now + delay, fn }); return id; };
  const cancel = (id) => timers.delete(id);
  class Video extends Target {
    paused = true;
    readyState = 0;
    duration = 18.4;
    position = 0;
    start = 0;
    src = '';
    endTimer;
    get currentTime() { return this.position + (this.paused ? 0 : (now - this.start) / 1000); }
    set currentTime(time) { this.position = time; this.start = now; }
    canPlayType() { return supported ? 'probably' : ''; }
    load() {
      if (!this.src) return;
      requests.push(this.src);
      queueMicrotask(() => {
        if (!this.src) return;
        this.onloadeddata?.();
        if (ready) { this.readyState = 4; this.dispatchEvent(new Event('canplay')); }
      });
    }
    play() {
      if (reject) return Promise.reject(new Error('Autoplay blocked'));
      this.paused = false;
      this.start = now;
      this.dispatchEvent(new Event('playing'));
      this.endTimer = schedule(() => {
        this.position = this.duration;
        this.paused = true;
        this.dispatchEvent(new Event('ended'));
      }, (this.duration - this.position) * 1000);
      return Promise.resolve();
    }
    pause() { this.position = this.currentTime; this.paused = true; cancel(this.endTimer); }
    requestVideoFrameCallback(fn) { return suppressedFrames ? ++nextId : schedule(fn, 33); }
    cancelVideoFrameCallback(id) { cancel(id); }
    removeAttribute(name) { if (name === 'src') this.src = ''; }
  }
  const video = new Video();
  if (!frames) video.requestVideoFrameCallback = undefined;
  const motion = new Target(); motion.matches = reduced;
  const document = new Target(); document.hidden = false;
  document.createElement = (tag) => tag === 'video' ? new Video() : {
    getContext: () => ({ drawImage() {}, getImageData: () => ({ data: [0, 0, 0, alpha ? 0 : 255] }) }),
  };
  const refs = [{ current: video }, { current: {} }, { current: true }, { current: () => {} }];
  const react = {
    useState: () => [false, (value) => { shown = value; }],
    useRef: () => refs[refIndex++],
    useEffect: (fn) => effects.push(fn),
  };
  const context = { exports: {}, AbortController, Event, document, performance: { now: () => now },
    setTimeout: schedule, clearTimeout: cancel, matchMedia: () => motion,
    IntersectionObserver: class { constructor(callback) { observer = callback; } observe() {} disconnect() {} },
    require: (name) => name === 'react' ? react : name === 'react/jsx-runtime' ? { jsx: () => null, jsxs: () => null } : {},
  };
  vm.runInNewContext(source, context);
  context.exports.CyclicAlphaLogo({ image: '/logo.png', animation: '/animation.webm', alphaProbe: '/probe.webm' });
  const cleanups = effects.map((fn) => fn()).filter(Boolean);
  const flush = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };
  return {
    video, requests, flush,
    get shown() { return shown; },
    get timerCount() { return timers.size; },
    async tick(target) {
      await flush();
      while (true) {
        const next = [...timers].filter(([, t]) => t.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        now = next[1].at; timers.delete(next[0]); next[1].fn(); await flush();
      }
      now = target; await flush();
    },
    hidden(value) { document.hidden = value; document.dispatchEvent(new Event('visibilitychange')); },
    intersect(value) { observer([{ isIntersecting: value }]); },
    active(value) { refs[2].current = value; refs[3].current(); },
    motion(value) { motion.matches = value; motion.dispatchEvent(new Event('change')); },
    cleanup() {
      cleanups.forEach((fn) => fn());
      for (const target of targets) for (const listeners of target.listeners.values()) assert.equal(listeners.size, 0);
    },
  };
}

(async () => {
  const cycle = harness(); await cycle.flush();
  assert.deepEqual(cycle.requests, ['/probe.webm', '/animation.webm']);
  await cycle.tick(9999); assert.equal(cycle.shown, false);
  await cycle.tick(10040); assert.equal(cycle.shown, true);
  await cycle.tick(28401); assert.equal(cycle.shown, false);
  await cycle.tick(38399); assert.equal(cycle.shown, false);
  await cycle.tick(38440); assert.equal(cycle.shown, true);
  await cycle.tick(56801); assert.equal(cycle.shown, false);
  await cycle.tick(66840); assert.equal(cycle.shown, true);
  cycle.cleanup(); assert.equal(cycle.timerCount, 0);

  for (const mode of ['hidden', 'intersect', 'active']) {
    const paused = harness(); await paused.tick(5000);
    paused[mode](mode === 'hidden'); await paused.tick(15000);
    assert.equal(paused.shown, false);
    paused[mode](mode !== 'hidden'); await paused.tick(20040);
    assert.equal(paused.shown, true);
    paused[mode](mode === 'hidden'); const time = paused.video.currentTime;
    await paused.tick(25000); assert.equal(paused.video.currentTime, time);
    paused[mode](mode !== 'hidden'); await paused.tick(43401);
    assert.equal(paused.shown, false);
    paused.cleanup(); assert.equal(paused.timerCount, 0);
  }
  for (const options of [{ reduced: true }, { supported: false }, { alpha: false }]) {
    const fallback = harness(options); await fallback.tick(60000);
    assert.equal(fallback.shown, false);
    assert.ok(!fallback.requests.includes('/animation.webm'));
    if (options.reduced) assert.equal(fallback.requests.length, 0);
    fallback.cleanup(); assert.equal(fallback.timerCount, 0);
  }
  const slow = harness({ ready: false }); await slow.tick(15000);
  assert.equal(slow.shown, false);
  slow.video.readyState = 4; slow.video.dispatchEvent(new Event('canplay'));
  await slow.tick(15040); assert.equal(slow.shown, true); slow.cleanup();
  const failure = harness({ reject: true }); await failure.tick(60000);
  assert.equal(failure.shown, false); assert.equal(failure.timerCount, 0); failure.cleanup();
  const legacy = harness({ frames: false }); await legacy.tick(10040);
  legacy.video.dispatchEvent(new Event('timeupdate')); assert.equal(legacy.shown, true); legacy.cleanup();
  const compositor = harness({ suppressedFrames: true }); await compositor.tick(10250);
  compositor.video.dispatchEvent(new Event('timeupdate')); assert.equal(compositor.shown, true);
  await compositor.tick(38650); compositor.video.dispatchEvent(new Event('timeupdate'));
  assert.equal(compositor.shown, true); compositor.cleanup(); assert.equal(compositor.timerCount, 0);
  const preference = harness(); await preference.tick(12000); preference.motion(true);
  assert.equal(preference.shown, false); assert.equal(preference.video.src, '');
  preference.cleanup(); assert.equal(preference.timerCount, 0);
  console.log('PASS: three cycles, visibility/offscreen/poster pauses, slow readiness, alpha/codec/autoplay fallback, reduced motion, legacy frames, and timer cleanup.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
