import { Event, EventDispatcher } from '../base/Event';
import { Matrix2D } from '../base/Matrix2D';
import { Point } from '../base/Point';
import { Rect } from '../base/Rect';
import { RoundRect } from '../base/RoundRect';
import { Style } from '../style/Style';
import { Container } from './Container';
import { Stage } from './Stage';
export declare class ActionState {
    pressed: boolean;
    inBounds: boolean;
}
export declare class XActionEvent extends Event {
    stage?: Stage;
    nativeEvent: any;
    stageX: number;
    stageY: number;
    x: number;
    y: number;
    currentTarget: XObject;
    readonly srcElement: XObject;
    constructor(target: XObject, type: string, bubbles?: boolean, cancelable?: boolean);
    toString(): string;
}
export interface IAttributes {
    [key: string]: string;
}
export interface IXObjectOptions {
    style: Style;
    attributes: IAttributes;
    text?: string;
}
export declare class XObject extends EventDispatcher<XActionEvent> {
    eventEnabled: boolean;
    actionState: ActionState;
    id?: string;
    style: Style;
    rect: Rect;
    parent?: Container;
    private cacheCanvas?;
    private cacheState;
    constructor(opt?: IXObjectOptions);
    getCacheCanvas(): HTMLCanvasElement | undefined;
    remove(): void;
    dispatchEvent(event: XActionEvent): boolean;
    willTrigger(type: string): boolean;
    isVisible(): boolean;
    isCached(): boolean;
    cache(): void;
    uncache(): void;
    invalidateCache(): void;
    draw(ctx: CanvasRenderingContext2D, ignoreCache?: boolean): void;
    drawBackground(ctx: CanvasRenderingContext2D, outerRect: RoundRect, innerRect: RoundRect): void;
    drawContent(ctx: CanvasRenderingContext2D): void;
    updateContext(ctx: CanvasRenderingContext2D): void;
    localToGlobal(x: number, y: number): Point;
    globalToLocal(x: number, y: number): Point;
    localToLocal(x: number, y: number, target: XObject): Point;
    getMatrix(matrix?: Matrix2D): Matrix2D;
    getConcatenatedMatrix(matrix?: Matrix2D): Matrix2D;
    hitTest(x: number, y: number): boolean;
    layout(): void;
    calculateSize(): void;
    css(style: {
        [key: string]: string | number;
    }): void;
    getLineHeight(): number;
    getWidth(): number;
    getHeight(): number;
    getPaddingWidth(): number;
    getPaddingHeight(): number;
    getPaddingRect(): Rect;
    getContentWidth(): number;
    getContentHeight(): number;
    getContentRect(): Rect;
    getOuterWidth(): number;
    getOuterHeight(): number;
    isChildOf(element: XObject): boolean;
    toString(): string;
    private doDispatchEvent;
}
//# sourceMappingURL=XObject.d.ts.map