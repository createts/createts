import { Animation } from '../animation/Animation';
import { AnimationFactory } from '../animation/AnimationFactory';
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
    IN_ANIMATION = "in_animation",
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
};
export declare class Stage extends Container {
    canvas: HTMLCanvasElement;
    readonly ticker: Ticker;
    readonly animationFactory: AnimationFactory;
    readonly resourceRegistry: ResourceRegistry;
    readonly option: StageOptions;
    private touchedChildren;
    private hoverChildren;
    private started;
    private needUpdate;
    private eventHandlerInstalled;
    private eventEnabled;
    constructor(canvas: HTMLCanvasElement, option?: StageOptions);
    updateOnce(): void;
    start(): void;
    installEventHandlers(): void;
    enableEvents(): Stage;
    disableEvents(): Stage;
    getPressedTouchItems(child?: XObject): TouchItem[];
    handleMouseOrTouchEvent(type: string, touches: TouchItem[], e: any): void;
    update(): void;
    calculateSize(): void;
    animate(element: XObject, override?: boolean): Animation;
    stopAnimation(element: XObject): void;
    toString(): string;
    private dispatchTouchEvent;
    private onTouchMove;
    private handleTouchStartEvent;
    private handleTouchEndEvent;
}
//# sourceMappingURL=Stage.d.ts.map