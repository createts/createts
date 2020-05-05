import { Stage } from '../components/Stage';
import { IRuntime, LoadTask } from './Runtime';
export declare class WechatMiniGameRuntime implements IRuntime {
    private gameCanvas;
    private systemInfo;
    protected canvasCache: HTMLCanvasElement[];
    constructor();
    newCanvas(): HTMLCanvasElement;
    releaseCanvas(canvas: HTMLCanvasElement): void;
    newImage(): HTMLImageElement;
    loadText(task: LoadTask<string>): void;
    loadArrayBuffer(task: LoadTask<ArrayBuffer>): void;
    loadImage(task: LoadTask<HTMLImageElement>): void;
    getGameCanvas(): HTMLCanvasElement;
    enableEvents(stage: Stage): void;
    requestAnimationFrame(listener: (time: number) => void): void;
    private handleTouchEvent;
}
//# sourceMappingURL=WechatMiniGameRuntime.d.ts.map