import { Event, EventDispatcher } from '../base/Event';
import { Matrix2D } from '../base/Matrix2D';
import { Point } from '../base/Point';
import { Rect } from '../base/Rect';
import { RoundRect } from '../base/RoundRect';
import { Style } from '../style/Style';
import { Container } from './Container';
import { Stage } from './Stage';
import { TouchItem } from './TouchItem';
export declare class TouchEvent extends Event {
    stage?: Stage;
    nativeEvent: any;
    readonly identifier: number;
    readonly stageX: number;
    readonly stageY: number;
    x: number;
    y: number;
    currentTarget: XObject;
    readonly srcElement: XObject;
    constructor(srcElement: XObject, type: string, bubbles?: boolean, touch?: TouchItem, cancelable?: boolean);
    toString(): string;
}
export interface IXObjectOptions {
    style: Style;
    attributes: {
        [key: string]: string;
    };
    text?: string;
}
export declare class XObject extends EventDispatcher<TouchEvent> {
    id?: string;
    style: Style;
    rect: Rect;
    parent?: Container;
    private cacheCanvas?;
    private cacheState;
    constructor(opt?: IXObjectOptions);
    remove(): void;
    dispatchEvent(event: TouchEvent): boolean;
    isVisible(): boolean;
    isPointerEventsEnabled(): boolean;
    getCacheCanvas(): HTMLCanvasElement | undefined;
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
    }): XObject;
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