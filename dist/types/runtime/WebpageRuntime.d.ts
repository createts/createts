import { Stage } from '../components/Stage';
import { IRuntime, LoadArrayBufferTask, LoadImageTask } from './Runtime';
export declare class WebpageRuntime implements IRuntime {
    private canvasCache;
    newCanvas(): HTMLCanvasElement;
    releaseCanvas(canvas: HTMLCanvasElement): void;
    newImage(): HTMLImageElement;
    loadArrayBuffer(task: LoadArrayBufferTask): void;
    loadImage(task: LoadImageTask): void;
    enableEvents(stage: Stage): void;
    requestAnimationFrame(listener: (time: number) => void): void;
    private handleMouseEvent;
    private handleMouseWheelEvent;
    private handleTouchEvent;
}
//# sourceMappingURL=WebpageRuntime.d.ts.map