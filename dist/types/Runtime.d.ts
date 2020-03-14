import { Stage } from './components/Stage';
import { Font } from './style/Font';
declare type AnimationFrameListener = (time: number) => void;
interface IRuntime {
    newCanvas(): HTMLCanvasElement;
    releaseCanvas(canvas: HTMLCanvasElement): void;
    requestAnimationFrame(listener: AnimationFrameListener): any;
    measureTextWidth(text: string, font: Font): number;
    enableEvents(stage: Stage): void;
}
export declare class Runtime {
    static get(): IRuntime;
    private static runtime;
}
export {};
//# sourceMappingURL=Runtime.d.ts.map