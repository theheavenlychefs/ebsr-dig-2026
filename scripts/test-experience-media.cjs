const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const jsx = require('react/jsx-runtime');

function scenario(nativeFrames) {
  const states = [], refs = [], effects = [], events = new Map(), frames = new Map(), paints = new Map();
  let stateIndex, refIndex, effectIndex, dirty = true, id = 0, tree;
  const video = {
    readyState: 0, muted: true,
    play: () => Promise.resolve(), pause() {},
    addEventListener: (name, fn) => events.set(name, fn),
    removeEventListener: (name) => events.delete(name),
    ...(nativeFrames ? {
      requestVideoFrameCallback: (fn) => { frames.set(++id, fn); return id; },
      cancelVideoFrameCallback: (key) => frames.delete(key),
    } : {}),
  };
  const React = {
    useRef(initial) { return refs[refIndex++] ??= { current: initial }; },
    useState(initial) {
      const index = stateIndex++;
      if (!(index in states)) states[index] = initial;
      return [states[index], (value) => { states[index] = value; dirty = true; }];
    },
    useEffect(callback, deps) {
      const index = effectIndex++, old = effects[index];
      if (!old || deps.some((value, i) => value !== old.deps[i])) effects[index] = { callback, deps, cleanup: old?.cleanup, pending: true };
    },
  };
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync('src/components/ExperienceMedia.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (name) => name === 'react' ? React : name === 'next/image' ? function Image() {} : require(name),
    requestAnimationFrame: (fn) => { paints.set(++id, fn); return id; },
    cancelAnimationFrame: (key) => paints.delete(key),
  });
  const props = { slide: { name: 'The Word', media: { kind: 'video', src: '/film.mp4', poster: '/poster.webp', alt: 'Retreat', aspectRatio: 0.5625 } }, index: 0, active: false, playing: false, onSoundInteraction() {} };
  function render() {
    let passes = 0;
    while (dirty) {
      assert.ok(passes++ < 20);
      dirty = false;
      stateIndex = refIndex = effectIndex = 0;
      tree = exports.ExperienceMedia(props);
      refs[0].current = video;
      for (const effect of effects) {
        if (!effect.pending) continue;
        effect.pending = false;
        effect.cleanup?.();
        effect.cleanup = effect.callback();
      }
    }
  }
  const videoNode = () => tree.props.children.find((child) => child?.type === 'video');
  render();
  assert.equal(videoNode().props.src, undefined, 'inactive videos do not download eagerly');
  props.active = true;
  props.playing = true;
  dirty = true;
  render();
  assert.equal(videoNode().props['data-frame-ready'], false, 'loading video remains transparent over its poster');
  video.readyState = 1;
  events.get('loadeddata')();
  assert.equal(frames.size + paints.size, 0, 'metadata alone is insufficient');
  video.readyState = 2;
  events.get('loadeddata')();
  events.get('playing')();
  assert.equal(frames.size + paints.size, 1, 'readiness events do not accumulate callbacks');
  assert.equal(videoNode().props['data-frame-ready'], false, 'retain poster until the frame callback');
  function flush(queue) {
    const callbacks = [...queue.values()];
    queue.clear();
    callbacks.forEach((callback) => callback());
  }
  if (nativeFrames) flush(frames);
  else { flush(paints); assert.equal(videoNode().props['data-frame-ready'], false); flush(paints); }
  render();
  assert.equal(videoNode().props['data-frame-ready'], true);
  videoNode().props.onError();
  render();
  assert.equal(videoNode(), undefined, 'playback failure leaves the poster, not a broken video');
  assert.equal(tree.props.children[0].props.src, '/poster.webp');
  effects.forEach((effect) => effect.cleanup?.());
  assert.equal(events.size + frames.size + paints.size, 0, 'frame and listener cleanup');
}
scenario(true);
scenario(false);
console.log('PASS: lazy source, poster retention, decoded-frame handoff, browser fallback, error still and cleanup.');
