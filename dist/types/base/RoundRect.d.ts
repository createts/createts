import { BaseValue } from '../base/BaseValue';
import { Rect } from '../base/Rect';
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
    applyRadius(radiusLeftTop?: BaseValue, radiusRightTop?: BaseValue, radiusRightBottom?: BaseValue, radiusLeftBottom?: BaseValue): RoundRect;
    applyBorder(top: number, right: number, bottom: number, left: number): RoundRect;
    makePath(ctx: CanvasRenderingContext2D, newPath: boolean, clockwise: boolean): void;
    clip(ctx: CanvasRenderingContext2D): RoundRect;
    private arcTo;
}
//# sourceMappingURL=RoundRect.d.ts.map