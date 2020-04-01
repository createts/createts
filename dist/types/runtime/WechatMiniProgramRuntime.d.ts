import { Stage } from '../components/Stage';
import { IRuntime, LoadArrayBufferTask, LoadImageTask } from './Runtime';
export declare class WechatMiniProgramRuntime implements IRuntime {
    private wxCanvas;
    protected canvasCache: HTMLCanvasElement[];
    setWxCanvas(wxCanvas: any): void;
    newCanvas(): HTMLCanvasElement;
    releaseCanvas(canvas: HTMLCanvasElement): void;
    newImage(): HTMLImageElement;
    loadArrayBuffer(task: LoadArrayBufferTask): void;
    loadImage(task: LoadImageTask): void;
    enableEvents(stage: Stage): void;
    requestAnimationFrame(listener: (time: number) => void): void;
    handleTouchEvent(type: string, stage: Stage, e: any): void;
}
//# sourceMappingURL=WechatMiniProgramRuntime.d.ts.map