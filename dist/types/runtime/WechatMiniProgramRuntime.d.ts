import { Stage } from '../components/Stage';
import { IRuntime, LoadTask } from './Runtime';
export declare class WechatMiniProgramRuntime implements IRuntime {
    private wxCanvas;
    protected canvasCache: HTMLCanvasElement[];
    setWxCanvas(wxCanvas: any): void;
    newCanvas(): HTMLCanvasElement;
    releaseCanvas(canvas: HTMLCanvasElement): void;
    newImage(): HTMLImageElement;
    loadText(task: LoadTask<string>): void;
    loadArrayBuffer(task: LoadTask<ArrayBuffer>): void;
    loadImage(task: LoadTask<HTMLImageElement>): void;
    enableEvents(stage: Stage): void;
    requestAnimationFrame(listener: (time: number) => void): void;
    handleTouchEvent(type: string, stage: Stage, e: any): void;
}
//# sourceMappingURL=WechatMiniProgramRuntime.d.ts.map