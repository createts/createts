import { Event, EventDispatcher } from './base/Event';
import { Runtime } from './runtime/Runtime';

/**
 * Event from ticker.
 */
export class TickerEvent extends Event {
  /**
   * The current timestamp of this event.
   */
  readonly now: number;
  /**
   * The delay to previous ticker event.
   */
  readonly delay: number;
  constructor(type: string, now: number, delay: number) {
    super(type);
    this.now = now;
    this.delay = delay;
  }
}

export class Ticker extends EventDispatcher<TickerEvent> {
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
      this.dispatchEvent(
        new TickerEvent('tick', time, this.lastTickTime === 0 ? 0 : time - this.lastTickTime)
      );
      this.lastTickTime = time;
    }
    Runtime.get().requestAnimationFrame(this.onAnimationFrame.bind(this));
  }
}
