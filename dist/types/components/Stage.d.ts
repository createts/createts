import { Animation, AnimationTarget } from '../animation/Animation';
import { ResourceRegistry } from '../resource/ResourceRegistry';
import { Ticker } from '../Ticker';
import { Container } from './Container';
import { TouchItem } from './TouchItem';
import { XObject } from './XObject';
export declare enum StageLayoutPolicy {
    NEVER = "never",
    ALWAYS = "always"
}
export declare enum StageUpdatePolicy {
    NEVER = "never",
    AUTO = "auto",
    ALWAYS = "always"
}
export declare type StageOptions = {
    fps?: number;
    layoutPolicy?: StageLayoutPolicy;
    updatePolicy?: StageUpdatePolicy;
    autoClear?: boolean;
    noEventHandler?: boolean;
    style?: {
        [key: string]: string | number;
    };
    recordRenderLatencies?: boolean;
};
export declare class Stage extends Container {
    canvas: HTMLCanvasElement;
    readonly ticker: Ticker;
    readonly resourceRegistry: ResourceRegistry;
    readonly option: StageOptions;
    private touchItems;
    private started;
    private needUpdate;
    private eventHandlerInstalled;
    private eventEnabled;
    private latestRenderLatencies?;
    constructor(canvas: HTMLCanvasElement, option?: StageOptions);
    updateOnce(): void;
    start(): void;
    installEventHandlers(): void;
    enableEvents(): Stage;
    disableEvents(): Stage;
    getPressedTouchItems(child?: XObject): TouchItem[];
    handleMouseOrTouchEvent(type: string, touches: TouchItem[], e: any): void;
    handleMouseWheelEvent(stageX: number, stageY: number, deltaX: number, deltaY: number, e: any): void;
    static of(element: XObject): Stage | undefined;
    update(): void;
    calculateSize(): void;
    animate(element: AnimationTarget, override?: boolean): Animation;
    stopAnimation(element: AnimationTarget): void;
    toString(): string;
    private dispatchTouchEvent;
    private onTouchMove;
    private handleTouchStartEvent;
    private handleTouchEndEvent;
}
//# sourceMappingURL=Stage.d.ts.map