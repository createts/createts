import { Event, EventDispatcher } from './base/Event';
import { Runtime } from './runtime/Runtime';

/**
 * Event for ticker.
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
  /**
   * Create a TickerEvent object with type, current timestamp and delay.
   * @param type Type of this event, can be 'tick', 'start', or 'stop'.
   * @param now The current timestamp.
   * @param delay The delay from previous event.
   */
  constructor(type: string, now: number, delay: number) {
    super(type);
    this.now = now;
    this.delay = delay;
  }
}

/**
 * A Ticker instance provides a tick or heartbeat broadcast at a set interval, listeners of this
 * Ticker instance can listen to the 'tick' event to be notified when a set time interval has
 * elapsed.
 *
 * Code example, create a ticker instance with fps=10
 * ```typescript
 * const ticker = new Ticker(10);  // fps = 10
 * ticker.on('tick', e => {
 *   console.log(e);
 * });
 * ```
 *
 * For most cases, you may not need to create a ticker instance but use the one from Stage
 * instance.
 */
export class Ticker extends EventDispatcher<TickerEvent> {
  /**
   * The duration between 2 tick events.
   */
  private duration: number = 1000 / 60;
  /**
   * The previous ticker happen time.
   */
  private lastTickTime: number;
  /**
   * Indicate this ticker instance is stopped or not.
   */
  private stopped: boolean = true;

  /**
   * Create a Ticker object with specified fps.
   * @param fps Frames per second, indicates how many ticker events in 1 second, default value is 60.
   */
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

  /**
   * Set the fps of this ticker object.
   * @param fps The new fps value.
   */
  public setFps(fps: number) {
    this.duration = 1000 / fps;
  }

  /**
   * Start ticking if the current ticker is stopped, a 'start' event will be broadcasted to
   * listeners.
   */
  public start() {
    if (this.stopped) {
      this.stopped = false;
      Runtime.get().requestAnimationFrame(this.onAnimationFrame.bind(this));
      const now = Date.now();
      this.dispatchEvent(new TickerEvent('start', now, now - this.lastTickTime));
    }
  }

  /**
   * Stop ticking if the current ticker is started, a 'stop' event will be broadcasted to
   * listeners.
   */
  public stop() {
    this.stopped = true;
    const now = Date.now();
    this.dispatchEvent(new TickerEvent('stop', now, now - this.lastTickTime));
  }

  /**
   * Callback of requestAnimationFrame function, check the duration of previous callback to
   * determine whether broadcast tick event.
   * @param time current timestamp.
   */
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
