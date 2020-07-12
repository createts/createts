import { Stage } from '../components/Stage';
import { IRuntime, LoadTask } from './Runtime';
export declare class WebpageRuntime implements IRuntime {
    private canvasCache;
    newCanvas(): HTMLCanvasElement;
    releaseCanvas(canvas: HTMLCanvasElement): void;
    newImage(): HTMLImageElement;
    loadArrayBuffer(task: LoadTask<ArrayBuffer>): void;
    loadText(task: LoadTask<string>): void;
    private loadByType;
    loadImage(task: LoadTask<HTMLImageElement>): void;
    private loadImageByImageObject;
    enableEvents(stage: Stage): void;
    requestAnimationFrame(listener: (time: number) => void): void;
    private handleMouseEvent;
    private handleMouseWheelEvent;
    private handleTouchEvent;
}
//# sourceMappingURL=WebpageRuntime.d.ts.map