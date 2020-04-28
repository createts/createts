import { Rect } from '../base/Rect';
import { BorderRadius } from '../style/BorderRadius';
export declare class RoundRect {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    leftTopRadiusX: number;
    leftTopRadiusY: number;
    rightTopRadiusX: number;
    rightTopRadiusY: number;
    rightBottomRadiusX: number;
    rightBottomRadiusY: number;
    leftBottomRadiusX: number;
    leftBottomRadiusY: number;
    constructor(x1?: number, y1?: number, x2?: number, y2?: number);
    toRect(): Rect;
    applySize(width: number, height: number): RoundRect;
    applyRadius(borderTopLeftRadius?: BorderRadius, borderTopRightRadius?: BorderRadius, borderBottomLeftRadius?: BorderRadius, borderBottomRightRadius?: BorderRadius): RoundRect;
    applyBorder(top: number, right: number, bottom: number, left: number): RoundRect;
    makePath(ctx: CanvasRenderingContext2D, newPath: boolean, clockwise: boolean): void;
    clip(ctx: CanvasRenderingContext2D): RoundRect;
    private arcTo;
}
//# sourceMappingURL=RoundRect.d.ts.map