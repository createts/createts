import { Point } from './base/Point';
import { Stage } from './components/Stage';
import { Font } from './style/Font';

type AnimationFrameListener = (time: number) => void;

interface IRuntime {
  newCanvas(): HTMLCanvasElement;
  releaseCanvas(canvas: HTMLCanvasElement): void;
  requestAnimationFrame(listener: AnimationFrameListener): any;
  measureTextWidth(text: string, font: Font): number;
  enableEvents(stage: Stage): void;
}

export type IFunc = () => void;

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
      this.handleEvent('mousedown', stage, e);
    });
    stage.canvas.addEventListener('mousemove', (e: any) => {
      this.handleEvent('mousemove', stage, e);
    });
    stage.canvas.addEventListener('pressmove', (e: any) => {
      this.handleEvent('mousemove', stage, e);
    });
    stage.canvas.addEventListener('mouseup', (e: any) => {
      this.handleEvent('mouseup', stage, e);
    });
    stage.canvas.addEventListener('mouseenter', (e: any) => {
      this.handleEvent('mouseenter', stage, e);
    });
    stage.canvas.addEventListener('mouseleave', (e: any) => {
      this.handleEvent('mouseleave', stage, e);
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

  private handleEvent(type: string, stage: Stage, e: any) {
    const scaleX = stage.canvas.width / stage.canvas.clientWidth;
    const scaleY = stage.canvas.height / stage.canvas.clientHeight;
    const x = e.offsetX * scaleX;
    const y = e.offsetY * scaleY;
    stage.handleActionEvent(type, new Point(x, y), e);
  }
}

export class Runtime {
  public static get(): IRuntime {
    return this.runtime;
  }

  private static runtime = new WebRuntime();
}
