import { Stage } from '../components/Stage';
import { TouchItem } from '../components/TouchItem';
import { IRuntime, LoadArrayBufferTask, LoadImageTask } from './Runtime';

/**
 * A IRuntime implementation for web page runs inside browser.
 */
export class WebpageRuntime implements IRuntime {
  /**
   * A canvas object cache contains released canvas objects.
   */
  private canvasCache: HTMLCanvasElement[] = [];

  /**
   * Returns an offscreen canvas object from cache if cache is not empty or creates a new one.
   */
  public newCanvas(): HTMLCanvasElement {
    if (this.canvasCache.length > 0) {
      return this.canvasCache.shift();
    } else {
      return document.createElement('canvas');
    }
  }

  /**
   * Release an offscreen canvas object, put it into cache.
   * @param canvas an offscreen canvas object to be released.
   */
  public releaseCanvas(canvas: HTMLCanvasElement) {
    // TODO: check the cache to see if the canvas is already been released.
    this.canvasCache.push(canvas);
  }

  /**
   * Create an image object.
   */
  public newImage(): HTMLImageElement {
    return new Image();
  }

  /**
   * Execute a load raw content task.
   * @param task The load raw content task to be executed.
   */
  public loadArrayBuffer(task: LoadArrayBufferTask) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open(task.method || 'GET', task.url, true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        task.onLoad(xhr.response);
      }
    };

    xhr.onerror = event => {
      task.onError(event);
    };

    xhr.onprogress = event => {
      if (event.lengthComputable) {
        task.onProgress({
          loadedBytes: event.loaded,
          totalBytes: event.total
        });
      }
    };
    xhr.send();
  }

  /**
   * Execute a load image task.
   * TODO: check if it is not same domain, use Image.src to load to avoid cross domain problem.
   * @param task The load image task to be executed.
   */
  public loadImage(task: LoadImageTask) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.open(task.method || 'GET', task.url, true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const url = URL.createObjectURL(xhr.response);
        const image = new Image();
        image.src = url;
        image.onload = () => {
          URL.revokeObjectURL(url);
          task.onLoad(image);
        };
        image.onerror = e => {
          URL.revokeObjectURL(url);
          task.onError(e);
        };
      }
    };

    xhr.onerror = event => {
      task.onError(event);
    };

    xhr.onprogress = event => {
      if (event.lengthComputable) {
        task.onProgress({
          loadedBytes: event.loaded,
          totalBytes: event.total
        });
      }
    };
    xhr.send();
  }

  /**
   * Add mouse and touch events for the Stage instance.
   * @param stage The target Stage instance to be added event handlers.
   */
  public enableEvents(stage: Stage) {
    stage.canvas.addEventListener('mousedown', (e: any) => {
      this.handleMouseEvent('mousedown', stage, e);
    });
    stage.canvas.addEventListener('mousemove', (e: any) => {
      this.handleMouseEvent('mousemove', stage, e);
    });
    stage.canvas.addEventListener('pressmove', (e: any) => {
      this.handleMouseEvent('mousemove', stage, e);
    });
    stage.canvas.addEventListener('mouseup', (e: any) => {
      this.handleMouseEvent('mouseup', stage, e);
    });
    stage.canvas.addEventListener('mouseenter', (e: any) => {
      this.handleMouseEvent('mouseenter', stage, e);
    });
    stage.canvas.addEventListener('mouseleave', (e: any) => {
      this.handleMouseEvent('mouseleave', stage, e);
    });
    stage.canvas.addEventListener('touchstart', (e: any) => {
      this.handleTouchEvent('touchstart', stage, e);
    });
    stage.canvas.addEventListener('touchend', (e: any) => {
      this.handleTouchEvent('touchend', stage, e);
    });
    stage.canvas.addEventListener('touchmove', (e: any) => {
      this.handleTouchEvent('touchmove', stage, e);
    });
    stage.canvas.addEventListener('touchcancel', (e: any) => {
      this.handleTouchEvent('touchcancel', stage, e);
    });
  }

  /**
   * Calls window.requestAnimationFrame to request a callback at next animation time.
   * @param listener The callback function.
   */
  public requestAnimationFrame(listener: (time: number) => void) {
    requestAnimationFrame(listener);
  }

  /**
   * Handles mouse event, translate the coordinate to stage space and send to stage instance.
   * @param type Type of the mouse event.
   * @param stage The stage to receive this event.
   * @param e The native mouse event.
   */
  private handleMouseEvent(type: string, stage: Stage, e: any) {
    const scaleX = stage.canvas.width / stage.canvas.clientWidth;
    const scaleY = stage.canvas.height / stage.canvas.clientHeight;
    // Translate to multiple touch event
    const x = e.offsetX * scaleX;
    const y = e.offsetY * scaleY;
    stage.handleMouseOrTouchEvent(type, [new TouchItem(0, stage, x, y, Date.now())], e);
  }

  /**
   * Handles touch event, translate the coordinates of multiple touches to stage space and send to
   * stage instance.
   * @param type Type of the touch event.
   * @param stage The stage to receive this event.
   * @param e The native touch event.
   */
  private handleTouchEvent(type: string, stage: Stage, e: any) {
    const scaleX = stage.canvas.width / stage.canvas.clientWidth;
    const scaleY = stage.canvas.height / stage.canvas.clientHeight;
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
