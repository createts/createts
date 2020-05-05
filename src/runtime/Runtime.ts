import { Stage } from '../components/Stage';
import { Font } from '../style/Font';
import { WebpageRuntime } from './WebpageRuntime';
import { WechatMiniGameRuntime } from './WechatMiniGameRuntime';
import { WechatMiniProgramRuntime } from './WechatMiniProgramRuntime';

/**
 * An enum to indicate current runtime type, both web page (running in a browser) and wechat mini
 * game (https://developers.weixin.qq.com/minigame/dev/guide/) are supported, toutiao mini game
 * (https://developer.toutiao.com/) will be supported soon.
 */
export enum RuntimeType {
  WEBPAGE = 'webpage',
  WECHAT_MINI_GAME = 'wechat_mini_game',
  WECHAT_MINI_PROGRAM = 'wechat_mini_program'
}

type Progress = {
  loadedBytes: number;
  totalBytes: number;
};

/**
 * Defines a type of raw content download task.
 */
export type LoadTask<T> = {
  /**
   * The url of this resource, it can be absolute url or relative url.
   */
  url: string;
  /**
   * Http method to retrieve the raw content.
   */
  method?: string;
  /**
   * A callback function while the content was downloaded.
   */
  onLoad: (data: T) => void;
  /**
   * A callback function while failed to download.
   */
  onError: (error: any) => void;
  /**
   * An event handler for progress changing.
   */
  onProgress: (progress: Progress) => void;
};

/**
 * Defines abstract layer for runtime to implement.
 */
export interface IRuntime {
  /**
   * Create an offscreen canvas object.
   */
  newCanvas(): HTMLCanvasElement;
  /**
   * Create an image object.
   */
  newImage(): HTMLImageElement;
  /**
   * Release an offscreen canvas object, usually creating an offscreen canvas is expensive and
   * we strongly recommend to re-use the canvas object.
   * @param canvas an offscreen canvas object to be released.
   */
  releaseCanvas(canvas: HTMLCanvasElement): void;
  /**
   * Method tells the runtime that you wish to perform an animation and requests that the runtime
   * calls a specified function to update an animation before the next repaint. The method takes a
   * callback as an argument to be invoked before the repaint.
   * @param listener The function to call when it's time to update  animation for the next repaint.
   */
  requestAnimationFrame(listener: (time: number) => void): any;
  /**
   * Install mouse/touch events to the specified Stage instance.
   * @param stage The target Stage instance to be added event handlers.
   */
  enableEvents(stage: Stage): void;
  /**
   * Execute a load image task.
   * @param task The load image task to be executed.
   */
  loadImage(task: LoadTask<HTMLImageElement>): void;
  /**
   * Execute a load raw content task.
   * @param task The load raw content task to be executed.
   */
  loadArrayBuffer(task: LoadTask<ArrayBuffer>): void;
  /**
   * Execute a load raw content task.
   * @param task The load raw content task to be executed.
   */
  loadText(task: LoadTask<string>): void;
}

/**
 * A class to manage runtime type and the abstract layer implementation.
 */
export class Runtime {
  /**
   * The current runt time type, by default it is web page, you need to call Runtime.setRuntimeType
   * explicitly to modify runtime type in case of it is not a web page at beginning, because auto
   * detection is not ready.
   *
   * ```typescript
   * Runtime.setRuntimeType(RuntimeType.WECHAT_MINI_GAME);
   * Runtime.get().newCanvas();
   * ```
   */
  static runtimeType: RuntimeType = RuntimeType.WEBPAGE;

  /**
   * Sets the current runtime time type.
   * @param runtimeType The current runtime time type.
   */
  public static setRuntimeType(runtimeType: RuntimeType) {
    if (this.runtimeType !== runtimeType) {
      this.runtimeType = runtimeType;
      delete this.runtime;
    }
  }

  /**
   * Gets the current runtime time type.
   * @returns The current runtime time type.
   */
  public static getRuntimeType(): RuntimeType {
    return this.runtimeType;
  }

  /**
   * Returns the current IRuntime implementation.
   * @returns The current IRuntime implementation.
   */
  public static get(): IRuntime {
    if (!this.runtime) {
      switch (this.runtimeType) {
        case RuntimeType.WEBPAGE:
          this.runtime = new WebpageRuntime();
          break;
        case RuntimeType.WECHAT_MINI_GAME:
          this.runtime = new WechatMiniGameRuntime();
          break;
        case RuntimeType.WECHAT_MINI_PROGRAM:
          this.runtime = new WechatMiniProgramRuntime();
          break;
      }
    }
    return this.runtime;
  }

  /**
   * The current IRuntime implementation instance.
   */
  private static runtime?: IRuntime;
}
