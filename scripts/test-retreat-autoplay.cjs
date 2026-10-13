const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = ts.transpileModule(fs.readFileSync('src/lib/retreat-autoplay.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const exported = {};
vm.runInNewContext(source, { exports: exported });
const { playRetreatPreview } = exported;

function video(play, muted = false) {
  return {
    muted, calls: [], pauses: 0,
    async play() { this.calls.push(this.muted); return play.call(this); },
    pause() { this.pauses++; },
  };
}

(async () => {
  const allowed = video(() => {});
  assert.equal(await playRetreatPreview(allowed, () => true), true);
  assert.deepEqual(allowed.calls, [false]);

  const policyBlocked = video(function () {
    if (!this.muted) throw { name: 'NotAllowedError' };
  });
  assert.equal(await playRetreatPreview(policyBlocked, () => true), true);
  assert.deepEqual(policyBlocked.calls, [false, true]);

  const allBlocked = video(() => { throw { name: 'NotAllowedError' }; });
  assert.equal(await playRetreatPreview(allBlocked, () => true), false);
  assert.deepEqual(allBlocked.calls, [false, true]);

  const userMuted = video(() => {}, true);
  await playRetreatPreview(userMuted, () => true);
  assert.deepEqual(userMuted.calls, [true]);

  for (const name of ['AbortError', 'NotSupportedError']) {
    const failed = video(() => { throw { name }; });
    assert.equal(await playRetreatPreview(failed, () => true), false);
    assert.deepEqual(failed.calls, [false]);
    assert.equal(failed.muted, false);
  }

  const inactive = video(() => {});
  assert.equal(await playRetreatPreview(inactive, () => false), false);
  assert.deepEqual(inactive.calls, []);

  let active = true;
  const leftDuringPlayback = video(() => { active = false; });
  assert.equal(await playRetreatPreview(leftDuringPlayback, () => active), false);
  assert.equal(leftDuringPlayback.pauses, 1);

  active = true;
  const leftDuringRejection = video(() => { active = false; throw { name: 'NotAllowedError' }; });
  assert.equal(await playRetreatPreview(leftDuringRejection, () => active), false);
  assert.deepEqual(leftDuringRejection.calls, [false]);
  console.log('PASS: audible autoplay, policy-only muted fallback, full blocking, user mute, abort/codec errors, inactive and late playback cancellation.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
