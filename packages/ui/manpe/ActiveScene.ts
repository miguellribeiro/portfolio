type Timer = { callback: () => void; remaining: number; deadline: number; id?: ReturnType<typeof setTimeout> };

/** One active clock: hidden time never advances an animal or a delayed action. */
export class ActiveScene {
  private timers = new Set<Timer>();
  private animations = new Set<Animation>();
  private running = false;
  private disposed = false;
  private occupants = new Set<string>();
  limit = 1;

  get alive() { return !this.disposed; }
  get active() { return this.running; }
  get pending() { return this.timers.size; }
  get moving() { return this.occupants.size; }

  setActive(active: boolean) {
    if (this.disposed || active === this.running) return;
    this.running = active;
    for (const timer of this.timers) {
      if (active) this.arm(timer);
      else {
        clearTimeout(timer.id);
        timer.id = undefined;
        timer.remaining = Math.max(0, timer.deadline - performance.now());
      }
    }
    for (const animation of this.animations) active ? animation.play() : animation.pause();
  }

  private arm(timer: Timer) {
    timer.deadline = performance.now() + timer.remaining;
    timer.id = setTimeout(() => {
      this.timers.delete(timer);
      if (!this.disposed) timer.callback();
    }, timer.remaining);
  }

  schedule(callback: () => void, delay: number) {
    if (this.disposed) return;
    const timer: Timer = { callback, remaining: delay, deadline: 0 };
    this.timers.add(timer);
    if (this.running) this.arm(timer);
  }

  acquire(actor: string) {
    if (!this.running || this.occupants.size >= this.limit) return false;
    this.occupants.add(actor);
    return true;
  }

  release(actor: string) { this.occupants.delete(actor); }

  async animate(element: Element, keyframes: Keyframe[], duration: number, delay = 0) {
    if (this.disposed) return false;
    const animation = element.animate(keyframes, { duration, delay, fill: 'forwards', easing: 'cubic-bezier(.22,1,.36,1)' });
    this.animations.add(animation);
    if (!this.running) animation.pause();
    try {
      await animation.finished;
      if (this.disposed) return false;
      // Persist the last pose without retaining a finished Animation object.
      const final = keyframes[keyframes.length - 1];
      for (const property of ['transform', 'opacity'] as const) {
        if (final[property] != null) (element as SVGElement).style[property] = String(final[property]);
      }
      return true;
    } catch { return false; }
    finally { animation.cancel(); this.animations.delete(animation); }
  }

  dispose() {
    this.disposed = true;
    this.running = false;
    for (const timer of this.timers) clearTimeout(timer.id);
    for (const animation of this.animations) animation.cancel();
    this.timers.clear();
    this.animations.clear();
    this.occupants.clear();
  }
}

export const between = (min: number, max: number) => min + Math.random() * (max - min);
