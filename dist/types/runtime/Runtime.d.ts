import { Stage } from '../components/Stage';
export declare enum RuntimeType {
    WEBPAGE = "webpage",
    WECHAT_MINI_GAME = "wechat_mini_game",
    WECHAT_MINI_PROGRAM = "wechat_mini_program"
}
declare type Progress = {
    loadedBytes: number;
    totalBytes: number;
};
export declare type LoadTask<T> = {
    url: string;
    allowOrigin?: boolean;
    method?: string;
    onLoad: (data: T) => void;
    onError: (error: any) => void;
    onProgress: (progress: Progress) => void;
};
export interface IRuntime {
    newCanvas(): HTMLCanvasElement;
    newImage(): HTMLImageElement;
    releaseCanvas(canvas: HTMLCanvasElement): void;
    requestAnimationFrame(listener: (time: number) => void): any;
    enableEvents(stage: Stage): void;
    loadImage(task: LoadTask<HTMLImageElement>): void;
    loadArrayBuffer(task: LoadTask<ArrayBuffer>): void;
    loadText(task: LoadTask<string>): void;
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