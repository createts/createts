import { Point } from './Point';
export declare class Matrix2D {
    a: number;
    b: number;
    c: number;
    d: number;
    tx: number;
    ty: number;
    constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
    setValues(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number): Matrix2D;
    append(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix2D;
    prepend(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix2D;
    appendMatrix(matrix: Matrix2D): Matrix2D;
    prependMatrix(matrix: Matrix2D): Matrix2D;
    appendTransform(x: number, y: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number, transformX: number, transformY: number): Matrix2D;
    prependTransform(x: number, y: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number, transformX: number, transformY: number): Matrix2D;
    rotate(angle: number): Matrix2D;
    skew(skewX: number, skewY: number): Matrix2D;
    scale(x: number, y: number): Matrix2D;
    translate(x: number, y: number): Matrix2D;
    identity(): Matrix2D;
    invert(): Matrix2D;
    isIdentity(): boolean;
    equals(matrix: Matrix2D): boolean;
    transformPoint(x: number, y: number): Point;
    copy(matrix: Matrix2D): Matrix2D;
    clone(): Matrix2D;
    toString(): string;
}
//# sourceMappingURL=Matrix2D.d.ts.map