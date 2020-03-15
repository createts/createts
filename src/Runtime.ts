import { Stage } from './components/Stage';
import { TouchItem } from './components/TouchItem';
import { Font } from './style/Font';

type AnimationFrameListener = (time: number) => void;

interface IRuntime {
  newCanvas(): HTMLCanvasElement;
  releaseCanvas(canvas: HTMLCanvasElement): void;
  requestAnimationFrame(listener: AnimationFrameListener): any;
  measureTextWidth(text: string, font: Font): number;
  enableEvents(stage: Stage): void;
}

class WebRuntime implements IRuntime {
  private globalCanvas?: HTMLCanvasElement;

  public newCanvas(): HTMLCanvasElement {
    return document.createElement('canvas');
  }

  public releaseCanvas(canvas: HTMLCanvasElement) {
    return;
  }

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
  }

  public requestAnimationFrame(listener: AnimationFrameListener) {
    window.requestAnimationFrame(listener);
  }

  public measureTextWidth(text: string, font: Font): number {
    if (text.length === 0) {
      return 0;
    }
    const canvas = this.getGlobalCanvas();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.font = font.toString();
      const width = ctx.measureText(text).width;
      ctx.restore();
      return width;
    } else {
      return 0;
    }
  }

  private getGlobalCanvas(): HTMLCanvasElement {
    if (!this.globalCanvas) {
      this.globalCanvas = this.newCanvas();
    }
    return this.globalCanvas;
  }

  private handleMouseEvent(type: string, stage: Stage, e: any) {
    const scaleX = stage.canvas.width / stage.canvas.clientWidth;
    const scaleY = stage.canvas.height / stage.canvas.clientHeight;
    // Translate to multiple touch event
    const x = e.offsetX * scaleX;
    const y = e.offsetY * scaleY;
    stage.handleMouseEvent(type, [new TouchItem(0, undefined, x, y, 0, 0)], e);
  }

  private handleTouchEvent(type: string, stage: Stage, e: any) {
    const scaleX = stage.canvas.width / stage.canvas.clientWidth;
    const scaleY = stage.canvas.height / stage.canvas.clientHeight;
    const touches = [];
    for (const touch of e.touches) {
      touches.push(
        new TouchItem(
          touch.identifier,
          undefined,
          touch.clientX * scaleX,
          touch.clientY * scaleY,
          0,
          0
        )
      );
    }
    stage.handleMouseEvent(type, touches, e);
  }
}

export class Runtime {
  public static get(): IRuntime {
    return this.runtime;
  }
  private static runtime = new WebRuntime();
}
