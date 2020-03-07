export declare class Rect {
    static of(value: string): Rect | undefined;
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    in(x: number, y: number): boolean;
    equals(that: Rect): boolean;
    clone(): Rect;
}
//# sourceMappingURL=Rect.d.ts.map