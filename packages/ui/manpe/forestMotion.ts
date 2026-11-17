import { ActiveScene, between } from './ActiveScene';

export function createForestMotion(scene: HTMLElement) {
  const clock = new ActiveScene();
  const element = (selector: string) => scene.querySelector<SVGElement>(selector)!;
  const capybara = element('[data-actor=capybara]');
  const monkey = element('[data-actor=monkey]');
  const bird = element('[data-actor=bird]');
  const part = (actor: SVGElement, name: string) => actor.querySelector<SVGElement>(`[data-part="${name}"]`)!;
  const head = part(capybara, 'head');
  const jaw = part(capybara, 'jaw');
  const grasses = ['grass-a', 'grass-b', 'grass-c'].map(name => element(`[data-part=${name}]`));
  const state = (actor: SVGElement, value: string) => { if (clock.alive) actor.dataset.state = value; };
  const pose = (target: SVGElement, values: string[], duration: number) => clock.animate(target, values.map(transform => ({ transform })), duration);
  const move = (actor: SVGElement, frames: Keyframe[], duration: number) => clock.animate(actor, frames, duration);
  const enter = (actor: SVGElement, from: string, duration: number) => move(actor, [{ transform: from, opacity: 0 }, { transform: 'translate(0px, 0px)', opacity: 1 }], duration);
  const leave = (actor: SVGElement, to: string, duration: number) => move(actor, [{ transform: 'translate(0px, 0px)', opacity: 1 }, { transform: to, opacity: 0 }], duration);
  const idle = (actor: SVGElement) => { state(actor, 'waiting'); actor.style.opacity = '0'; };
  [capybara, monkey, bird].forEach(idle);

  async function graze() {
    state(capybara, 'approaching');
    if (!await enter(capybara, 'translate(-400px, 0px)', 1400)) return;
    state(capybara, 'grazing');
    if (!await pose(head, ['rotate(0deg)', 'rotate(15deg)'], 500)) return;
    state(capybara, 'chewing');
    grasses.forEach(grass => { void pose(grass, ['scaleY(1)', 'scaleY(.22)'], 200); });
    clock.schedule(() => {
      grasses.forEach((grass, index) => { void clock.animate(grass, [{ transform: 'scaleY(.22)' }, { transform: 'scaleY(1)' }], 900, index * 180); });
    }, between(12000, 20000));
    if (!await pose(jaw, ['rotate(0deg)', 'rotate(2deg)', 'rotate(0deg)', 'rotate(2deg)', 'rotate(0deg)'], 700)) return;
    if (!await pose(head, ['rotate(15deg)', 'rotate(0deg)'], 500)) return;
    state(capybara, 'leaving');
    await leave(capybara, 'translate(-400px, 0px)', 1900);
  }

  async function swing() {
    state(monkey, 'entering');
    if (!await enter(monkey, 'translate(220px, -90px)', 1100)) return;
    state(monkey, 'swinging');
    const tail = pose(part(monkey, 'tail'), ['rotate(0deg)', 'rotate(8deg)', 'rotate(-4deg)', 'rotate(0deg)'], 2000);
    if (!await pose(part(monkey, 'swing'), ['rotate(0deg)', 'rotate(-12deg)', 'rotate(7deg)', 'rotate(-3deg)', 'rotate(0deg)'], 2000)) return;
    await tail;
    state(monkey, 'reaching');
    if (!await pose(part(monkey, 'free-arm'), ['rotate(0deg)', 'rotate(12deg)', 'rotate(0deg)'], 600)) return;
    state(monkey, 'leaving');
    await leave(monkey, 'translate(-220px, -90px)', 1300);
  }

  async function visit() {
    state(bird, 'approaching');
    void pose(part(bird, 'wing'), ['rotate(0deg)', 'rotate(-18deg)', 'rotate(18deg)', 'rotate(-18deg)', 'rotate(0deg)'], 1000);
    if (!await move(bird, [
      { transform: 'translate(240px, -98px)', opacity: 0 },
      { transform: 'translate(120px, -150px)', opacity: 1, offset: .4 },
      { transform: 'translate(0px, 0px)', opacity: 1 },
    ], 1000)) return;
    state(bird, 'landing');
    if (!await pose(part(bird, 'body'), ['scaleY(1)', 'scaleY(.94)', 'scaleY(1)'], 240)) return;
    state(bird, 'resting');
    if (!await move(bird, [{ opacity: 1 }, { opacity: 1 }], 1500)) return;
    state(bird, 'leaving');
    void pose(part(bird, 'wing'), ['rotate(0deg)', 'rotate(18deg)', 'rotate(-18deg)', 'rotate(18deg)', 'rotate(0deg)'], 1100);
    await leave(bird, 'translate(240px, -150px)', 1100);
  }

  function schedule(actor: SVGElement, name: string, action: () => Promise<void>, range: [number, number]) {
    const attempt = async () => {
      if (!clock.alive) return;
      if (!clock.acquire(name)) { clock.schedule(() => { void attempt(); }, between(700, 1200)); return; }
      scene.dataset.activeActors = String(clock.moving);
      try { await action(); }
      finally {
        clock.release(name);
        if (clock.alive) {
          idle(actor);
          scene.dataset.activeActors = String(clock.moving);
          clock.schedule(() => { void attempt(); }, between(...range));
        }
      }
    };
    clock.schedule(() => { void attempt(); }, between(...range));
  }
  schedule(capybara, 'capybara', graze, [18000, 34000]);
  schedule(monkey, 'monkey', swing, [24000, 45000]);
  schedule(bird, 'bird', visit, [12000, 27000]);

  return {
    setActive(active: boolean) {
      scene.dataset.motion = active ? 'running' : 'paused';
      clock.setActive(active);
    },
    setLimit(limit: number) { clock.limit = limit; },
    dispose() {
      clock.dispose();
      scene.dataset.motion = 'static';
      scene.dataset.activeActors = '0';
      [capybara, monkey, bird].forEach(actor => { actor.removeAttribute('data-state'); actor.style.removeProperty('opacity'); actor.style.removeProperty('transform'); });
      scene.querySelectorAll<SVGElement>('[data-part]').forEach(node => { node.style.removeProperty('transform'); node.style.removeProperty('opacity'); });
    },
  };
}
