import { Event, EventDispatcher } from './base/Event';
import { Runtime } from './Runtime';

export class Ticker extends EventDispatcher<Event> {
  private duration: number = 1000 / 60;
  private lastTickTime: number;
  private stopped: boolean = true;

  constructor(fps: number = 60) {
    super();
    if (fps <= 0) {
      console.warn('invalid fps:' + fps + ', reset to 60');
      fps = 60;
    }
    this.setFps(fps);
    this.lastTickTime = 0;
    this.start();
  }

  public start() {
    if (this.stopped) {
      this.stopped = false;
      Runtime.get().requestAnimationFrame(this.onAnimationFrame.bind(this));
    }
  }

  public setFps(fps: number) {
    this.duration = 1000 / fps;
  }

  public stop() {
    this.stopped = true;
  }

  private onAnimationFrame(time: number) {
    if (this.stopped) {
      return;
    }
    if (time - this.lastTickTime >= this.duration) {
      this.lastTickTime = time;
      this.dispatchEvent(new Event('tick'));
    }
    Runtime.get().requestAnimationFrame(this.onAnimationFrame.bind(this));
  }
}
