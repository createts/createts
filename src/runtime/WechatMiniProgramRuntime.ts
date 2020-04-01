import { Stage } from '../components/Stage';
import { TouchItem } from '../components/TouchItem';
import { URLUtils } from '../utils/URLUtils';
import { IRuntime, LoadArrayBufferTask, LoadImageTask } from './Runtime';

/**
 * A IRuntime implementation for wechat mini program.
 *
 * **Things you need to know:**
 * 1. The default size of canvas in wechat mini program is 300x150, which is not the actual size,
 * you need to set the size and ratio by yourself
 * 1. the api to create offscreen canvas and image object is defined at Canvas class, you need to
 * pass a wx canvas to Runtime to make it work.
 * 1. Seems wechat mini program does not support bind event programmatically, you need to bind
 * event in <canvas> element, and call handleTouchEvent instead.
 *
 * Checkout the mini program demo here: https://developers.weixin.qq.com/s/eo87vimV7DgU
 */
export class WechatMiniProgramRuntime implements IRuntime {
  private wxCanvas: any;
  /**
   * A canvas object cache contains released canvas objects.
   */
  protected canvasCache: HTMLCanvasElement[] = [];

  setWxCanvas(wxCanvas: any) {
    this.wxCanvas = wxCanvas;
  }

  /**
   * Returns an offscreen canvas object from cache if cache is not empty or creates a new one.
   */
  public newCanvas(): HTMLCanvasElement {
    if (this.canvasCache.length > 0) {
      return this.canvasCache.shift();
    }
    return wx.createOffscreenCanvas();
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
    return this.wxCanvas.createImage();
  }

  /**
   * Execute a load raw content task.
   * 1. If the source of content is a relative path, uses wechat file system api to read the file.
   * 1. If the source is an absolute url, use wechat network api to file a http request to get the
   * content, please note that you must whitelist the domain for your wechat mini program app.
   * @param task The load raw content task to be executed.
   */
  public loadArrayBuffer(task: LoadArrayBufferTask) {
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
   * image, please note that you must whitelist the domain for your wechat mini program app.
   * @param task The load image task to be executed.
   */
  public loadImage(task: LoadImageTask) {
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
   * Add touch events for the Stage instance.
   * Seems wechat mini program does not support bind event programmatically, you need to bind event
   * in <canvas> element, and call handleTouchEvent instead, for example:
   *
   * in wxml file
   * ```html
   * <canvas type='2d'
   *         bindtouchstart='ontouchstart'
   *         bindtouchmove='ontouchmove'
   *         bindtouchend='ontouchend'
   *         bindtouchcancel='ontouchcancel'
   * ></canvas>
   * ```
   *
   * in js file
   * ```javascript
   *   ontouchstart: function(e) {
   *     createts.Runtime.get().handleTouchEvent('touchstart', this.data.stage, e);
   *   },
   *
   *   ontouchmove: function(e) {
   *     createts.Runtime.get().handleTouchEvent('touchmove', this.data.stage, e);
   *   },
   *
   *   ontouchend: function(e) {
   *     createts.Runtime.get().handleTouchEvent('touchend', this.data.stage, e);
   *   },
   *
   *   ontouchcancel: function(e) {
   *     createts.Runtime.get().handleTouchEvent('touchcancel', this.data.stage, e);
   *   },
   * ```
   *
   * @param stage The target Stage instance to be added event handlers.
   */
  public enableEvents(stage: Stage) {
    return;
  }

  /**
   * Calls wechat global requestAnimationFrame api to request a callback at next animation time.
   * @param listener The callback function.
   */
  public requestAnimationFrame(listener: (time: number) => void) {
    this.wxCanvas.requestAnimationFrame(listener);
  }

  /**
   * Handles touch event, translate the coordinates of multiple touches to stage space and send to
   * stage instance.
   * @param type Type of the touch event.
   * @param stage The stage to receive this event.
   * @param e The native touch event.
   */
  public handleTouchEvent(type: string, stage: Stage, e: any) {
    const scaleX = stage.canvas.width / stage.canvas.clientWidth;
    const scaleY = stage.canvas.height / stage.canvas.clientHeight;
    const touches = [];
    for (const touch of e.touches) {
      touches.push(
        new TouchItem(touch.identifier, undefined, touch.x * scaleX, touch.y * scaleY, 0, 0)
      );
    }
    stage.handleMouseOrTouchEvent(type, touches, e);
  }
}
