import { themeLead, themeStatement, writingDuration } from "./theme-handwriting";

export const reflectionTexts = [themeLead, themeStatement];
export const typingStart = writingDuration + 200;
export const typingTimeline: number[] = [];
let elapsed = 0;
for (const text of reflectionTexts) {
  for (const character of text) {
    elapsed += /\s/.test(character) ? 18 : 28;
    if (!/\s/.test(character)) typingTimeline.push(elapsed);
    if (character === ".") elapsed += 150;
    else if (character === ",") elapsed += 65;
  }
  elapsed += 320;
}

// Derive progress from elapsed time so delayed browser callbacks cannot accumulate typing lag.
export function createThemeTypewriter(reveal: (count: number) => void) {
  let startedAt = performance.now() + typingStart;
  let pausedAt: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let count = 0;
  let disposed = false;
  const clear = () => { clearTimeout(timer); timer = undefined; };
  const tick = () => {
    if (disposed || pausedAt !== undefined) return;
    const time = performance.now() - startedAt;
    const previous = count;
    while (count < typingTimeline.length && typingTimeline[count] <= time) count++;
    if (count !== previous) reveal(count);
    if (count < typingTimeline.length) timer = setTimeout(tick, Math.max(0, startedAt + typingTimeline[count] - performance.now()));
  };
  tick();
  return {
    pause(hidden: boolean) {
      if (disposed) return;
      if (hidden && pausedAt === undefined) { pausedAt = performance.now(); clear(); }
      else if (!hidden && pausedAt !== undefined) { startedAt += performance.now() - pausedAt; pausedAt = undefined; tick(); }
    },
    finish() { if (!disposed) { clear(); count = typingTimeline.length; reveal(count); disposed = true; } },
    destroy() { disposed = true; clear(); },
  };
}
