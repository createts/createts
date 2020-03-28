import { Stage } from '../components/Stage';
export declare enum RuntimeType {
    WEBPAGE = "webpage",
    WECHAT_MINI_GAME = "wechat_mini_game"
}
declare type Progress = {
    loadedBytes: number;
    totalBytes: number;
};
export declare type LoadImageTask = {
    url: string;
    method?: string;
    onLoad: (image: HTMLImageElement) => void;
    onError: (error: any) => void;
    onProgress: (progress: Progress) => void;
};
export declare type LoadArrayBufferTask = {
    url: string;
    method?: string;
    onLoad: (data: ArrayBuffer) => void;
    onError: (error: any) => void;
    onProgress: (progress: Progress) => void;
};
export interface IRuntime {
    newCanvas(): HTMLCanvasElement;
    newImage(): HTMLImageElement;
    releaseCanvas(canvas: HTMLCanvasElement): void;
    requestAnimationFrame(listener: (time: number) => void): any;
    enableEvents(stage: Stage): void;
    loadImage(task: LoadImageTask): void;
    loadArrayBuffer(task: LoadArrayBufferTask): void;
}
export declare class Runtime {
    static runtimeType: RuntimeType;
    static setRuntimeType(runtimeType: RuntimeType): void;
    static getRuntimeType(): RuntimeType;
    static get(): IRuntime;
    private static runtime?;
}
export {};
//# sourceMappingURL=Runtime.d.ts.map