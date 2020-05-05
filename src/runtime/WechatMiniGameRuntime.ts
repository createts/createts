import { Stage } from '../components/Stage';
import { TouchItem } from '../components/TouchItem';
import { URLUtils } from '../utils/URLUtils';
import { IRuntime, LoadTask } from './Runtime';

/**
 * A IRuntime implementation for wechat mini game.
 */
export class WechatMiniGameRuntime implements IRuntime {
  /**
   * The global game canvas.
   */
  private gameCanvas: HTMLCanvasElement;
  /**
   * The object contains system info like screen size, etc.
   * See https://developers.weixin.qq.com/minigame/dev/api/base/system/system-info/wx.getSystemInfoSync.html
   */
  private systemInfo: WXSystemInfo;
  /**
   * A canvas object cache contains released canvas objects.
   */
  protected canvasCache: HTMLCanvasElement[] = [];

  /**
   * Creates a WechatMiniGameRuntime object and gets system info.
   */
  constructor() {
    this.systemInfo = wx.getSystemInfoSync();
  }

  /**
   * Returns an offscreen canvas object from cache if cache is not empty or creates a new one.
   */
  public newCanvas(): HTMLCanvasElement {
    if (!this.gameCanvas) {
      this.gameCanvas = wx.createCanvas();
    }
    if (this.canvasCache.length > 0) {
      return this.canvasCache.shift();
    }
    return wx.createCanvas();
  }

  /**
   * Release an offscreen canvas object, put it into cache.
   * @param canvas an offscreen canvas object to be released.
   */
  public releaseCanvas(canvas: HTMLCanvasElement) {
    this.canvasCache.push(canvas);
  }

  /**
   * Create an image object.
   */
  public newImage(): HTMLImageElement {
    return wx.createImage();
  }

  /**
   * Execute a load text content task.
   * 1. If the source of content is a relative path, uses wechat file system api to read the file.
   * 1. If the source is an absolute url, use wechat network api to file a http request to get the
   * content, please note that you must whitelist the domain for your wechat mini game app.
   * @param task The load text content task to be executed.
   */
  public loadText(task: LoadTask<string>) {
    if (URLUtils.isAbsolute(task.url)) {
      wx.request({
        url: task.url,
        method: task.method || 'GET',
        responseType: 'text',
        success: (res: any) => {
          task.onLoad(res.data);
        },
        fail: (error: any) => {
          task.onError(error);
        }
      });
    } else {
      wx.getFileSystemManager().readFile({
        filePath: task.url,
        encoding: 'utf-8',
        success: (e: any) => {
          task.onLoad(e.data);
        },
        fail: (e: any) => {
          task.onError(e);
        }
      });
    }
  }

  /**
   * Execute a load raw content task.
   * 1. If the source of content is a relative path, uses wechat file system api to read the file.
   * 1. If the source is an absolute url, use wechat network api to file a http request to get the
   * content, please note that you must whitelist the domain for your wechat mini game app.
   * @param task The load raw content task to be executed.
   */
  public loadArrayBuffer(task: LoadTask<ArrayBuffer>) {
    if (URLUtils.isAbsolute(task.url)) {
      wx.request({
        url: task.url,
        method: task.method || 'GET',
        responseType: 'arraybuffer',
        success: (res: any) => {
          task.onLoad(res.data);
        },
        fail: (error: any) => {
          task.onError(error);
        }
      });
    } else {
      wx.getFileSystemManager().readFile({
        filePath: task.url,
        success: (e: any) => {
          task.onLoad(e.data);
        },
        fail: (e: any) => {
          task.onError(e);
        }
      });
    }
  }

  /**
   * Execute a load image task.
   * 1. If the source of image is a relative path, uses wechat file system api to read the file.
   * 1. If the source is an absolute url, use wechat network api to file a http request to get the
   * image, please note that you must whitelist the domain for your wechat mini game app.
   * @param task The load image task to be executed.
   */
  public loadImage(task: LoadTask<HTMLImageElement>) {
    if (URLUtils.isAbsolute(task.url)) {
      const downloader = wx.downloadFile({
        url: task.url,
        success: (res: any) => {
          if (res.statusCode === 200) {
            const img = this.newImage();
            img.src = res.tempFilePath;
            img.onload = () => {
              task.onLoad(img);
            };
            img.onerror = (e: any) => {
              task.onError(e);
            };
          } else {
            task.onError({ msg: 'download failed, code:' + res.statusCode });
          }
        },
        fail: (e: any) => {
          task.onError(e);
        }
      });
      downloader.onProgressUpdate = (event: any) => {
        task.onProgress({
          loadedBytes: event.totalBytesWritten,
          totalBytes: event.totalBytesExpectedToWrite
        });
      };
    } else {
      const img = this.newImage();
      img.src = task.url;
      img.onload = () => {
        task.onLoad(img);
      };
      img.onerror = (e: any) => {
        task.onError(e);
      };
    }
  }

  /**
   * Returns the game canvas, it is the first created canvas.
   */
  public getGameCanvas(): HTMLCanvasElement {
    if (!this.gameCanvas) {
      this.gameCanvas = wx.createCanvas();
    }
    return this.gameCanvas;
  }

  /**
   * Add touch events for the Stage instance.
   * @param stage The target Stage instance to be added event handlers.
   */
  public enableEvents(stage: Stage) {
    wx.onTouchStart((e: any) => {
      this.handleTouchEvent('touchstart', stage, e);
    });
    wx.onTouchMove((e: any) => {
      this.handleTouchEvent('touchmove', stage, e);
    });
    wx.onTouchEnd((e: any) => {
      this.handleTouchEvent('touchend', stage, e);
    });
    wx.onTouchCancel((e: any) => {
      this.handleTouchEvent('touchcancel', stage, e);
    });
  }

  /**
   * Calls wechat global requestAnimationFrame api to request a callback at next animation time.
   * @param listener The callback function.
   */
  public requestAnimationFrame(listener: (time: number) => void) {
    requestAnimationFrame(listener);
  }

  /**
   * Handles touch event, translate the coordinates of multiple touches to stage space and send to
   * stage instance.
   * @param type Type of the touch event.
   * @param stage The stage to receive this event.
   * @param e The native touch event.
   */
  private handleTouchEvent(type: string, stage: Stage, e: any) {
    const scaleX = stage.canvas.width / this.systemInfo.windowWidth;
    const scaleY = stage.canvas.height / this.systemInfo.windowHeight;
    const touches = [];
    const now = Date.now();
    for (const touch of e.touches) {
      touches.push(
        new TouchItem(touch.identifier, stage, touch.clientX * scaleX, touch.clientY * scaleY, now)
      );
    }
    stage.handleMouseOrTouchEvent(type, touches, e);
  }
}
