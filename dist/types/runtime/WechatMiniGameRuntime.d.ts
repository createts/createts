import { Stage } from '../components/Stage';
import { IRuntime, LoadArrayBufferTask, LoadImageTask } from './Runtime';
export declare class WechatMiniGameRuntime implements IRuntime {
    private gameCanvas;
    private systemInfo;
    protected canvasCache: HTMLCanvasElement[];
    constructor();
    newCanvas(): HTMLCanvasElement;
    releaseCanvas(canvas: HTMLCanvasElement): void;
    newImage(): HTMLImageElement;
    loadArrayBuffer(task: LoadArrayBufferTask): void;
    loadImage(task: LoadImageTask): void;
    getGameCanvas(): HTMLCanvasElement;
    enableEvents(stage: Stage): void;
    requestAnimationFrame(listener: (time: number) => void): void;
    private handleTouchEvent;
}
//# sourceMappingURL=WechatMiniGameRuntime.d.ts.map