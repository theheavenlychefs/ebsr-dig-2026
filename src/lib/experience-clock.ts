export function slideDuration(...copy: string[]) {
  const words = copy.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(7000, Math.ceil((words / 200) * 60000 + 3000));
}

export type ClockSnapshot = { duration: number; remaining: number; running: boolean };
type Scheduler = {
  now: () => number;
  schedule: (callback: () => void, delay: number) => ReturnType<typeof setTimeout>;
  cancel: (timer: ReturnType<typeof setTimeout>) => void;
};

// Multiple pause causes can overlap: leaving hover must not undo a user pause.
export function createExperienceClock(
  complete: () => void,
  changed: (snapshot: ClockSnapshot) => void,
  scheduler: Scheduler = {
    now: () => performance.now(),
    schedule: (callback, delay) => setTimeout(callback, delay),
    cancel: (timer) => clearTimeout(timer),
  },
) {
  const reasons = new Set<string>(["offscreen"]);
  let duration = 7000;
  let remaining = duration;
  let started = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;

  const snapshot = (): ClockSnapshot => ({
    duration,
    remaining: Math.max(0, remaining - (timer !== null ? scheduler.now() - started : 0)),
    running: timer !== null,
  });
  const stop = () => {
    if (timer === null) return;
    remaining = snapshot().remaining;
    scheduler.cancel(timer);
    timer = null;
  };
  const sync = () => {
    if (disposed) return;
    if (reasons.size === 0 && timer === null) {
      started = scheduler.now();
      timer = scheduler.schedule(() => {
        timer = null;
        remaining = 0;
        // The next slide owns the next timer; never leave an expired loop running.
        reasons.add("transition");
        changed(snapshot());
        complete();
      }, remaining);
    }
    changed(snapshot());
  };

  return {
    snapshot,
    reset(nextDuration: number) {
      stop();
      duration = remaining = nextDuration;
      sync();
    },
    pause(reason: string, paused: boolean) {
      if (disposed || reasons.has(reason) === paused) return;
      stop();
      if (paused) reasons.add(reason);
      else reasons.delete(reason);
      sync();
    },
    destroy() {
      stop();
      disposed = true;
    },
  };
}
