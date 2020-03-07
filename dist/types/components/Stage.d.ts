import { Animation } from '../animation/Animation';
import { AnimationFactory } from '../animation/AnimationFactory';
import { Point } from '../base/Point';
import { Ticker } from '../Ticker';
import { Container } from './Container';
import { XObject } from './XObject';
export declare enum StageLayoutPolicy {
    NEVER = "never",
    ALWAYS = "always"
}
export declare type StageOptions = {
    fps?: number;
    layoutPolicy?: StageLayoutPolicy;
    autoClear?: boolean;
    style?: {
        [key: string]: string | number;
    };
};
export declare class Stage extends Container {
    canvas: HTMLCanvasElement;
    readonly ticker: Ticker;
    readonly animationFactory: AnimationFactory;
    readonly option: StageOptions;
    private pressedChild?;
    private hovedChildren;
    private started;
    constructor(canvas: HTMLCanvasElement, option?: StageOptions);
    start(): void;
    enableEvents(): void;
    reportHovedChild(child: XObject): void;
    handleActionEvent(type: string, pt: Point, e: any): void;
    update(): void;
    calculateSize(): void;
    animate(element: XObject, override?: boolean): Animation;
    toString(): string;
    private dispatchActionEvent;
    private handleMouseLeaveEvent;
    private handleTouchDownEvent;
    private handleTouchUpEvent;
    private handleTouchMoveEvent;
}
//# sourceMappingURL=Stage.d.ts.map