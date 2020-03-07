/**
 * A class that used to delay a function call, and it always cancel the pending call in case of new call come.
 *
 * Code example:
 *
 * Print a 'hello world' after 100ms.
 * ```typescript
 * const delay = new Delay(100);  // wait for 100ms.
 * delay.call(() => {
 *   console.log('hello world');
 * });
 * ```
 *
 * Print a 'hello world' once after 100ms, the first call will be cancelled.
 * ```typescript
 * const delay = new Delay(100);  // wait for 100ms.
 * delay.call(() => {
 *   console.log('hello world');
 * });
 * delay.call(() => {
 *   console.log('hello world');
 * });
 * ```
 *
 * Print a 'hello world' twice because the second call is after first one was invoked.
 * ```typescript
 * const delay = new Delay(100);  // wait for 100ms.
 * delay.call(() => {
 *   console.log('hello world');
 * });
 * setTimeout(() => {
 *   delay.call(() => {
 *     console.log('hello world');
 *   });
 * }, 200);
 * ```
 */
export class Delay {
  /**
   * The delay time, unit is ms.
   */
  private delayTime: number;
  /**
   * A timeout handler used to cancel the timeout for the new calls.
   */
  private delayHandler: any = 0;
  /**
   * The pending function call.
   */
  private func?: () => any;
  /**
   * True indicates that current delay calls is paused.
   */
  private paused: boolean = false;

  /**
   * Creates an instance of Delay.
   * @param delayTime The delay time, unit is ms.
   */
  constructor(delayTime: number) {
    this.delayTime = delayTime;
  }

  /**
   * Set a new pending function call, cancel the current one if any and restart a new round of wait.
   * @param func The new pending function call.
   */
  public call(func: () => any) {
    this.func = func;
    if (this.paused) {
      return;
    }
    if (this.delayHandler) {
      clearTimeout(this.delayHandler);
      this.delayHandler = 0;
    }
    this.start();
  }

  /**
   * Pause the current pending calls.
   */
  public pause() {
    if (this.delayHandler) {
      clearTimeout(this.delayHandler);
      this.delayHandler = 0;
    }
    this.paused = true;
  }

  /**
   * Resume the paused pending process.
   */
  public resume() {
    if (this.paused) {
      this.paused = false;
      if (this.func) {
        this.start();
      }
    }
  }

  /**
   * Cancel the wait process and delete the pending function call if any.
   */
  public cancel() {
    if (this.delayHandler) {
      clearTimeout(this.delayHandler);
      this.delayHandler = 0;
    }
    this.func = undefined;
    this.paused = false;
  }

  /**
   * If the pending function call is set, start the wait process.
   */
  private start() {
    if (this.func) {
      this.delayHandler = setTimeout(() => {
        this.delayHandler = 0;
        if (this.func) {
          this.func();
          this.func = undefined;
        }
      }, this.delayTime);
    }
  }
}
