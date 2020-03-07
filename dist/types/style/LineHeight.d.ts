export declare enum LineHeightType {
    NORMAL = 0,
    NUMBER = 1,
    LENGTH = 2,
    PERCENT = 3
}
export declare class LineHeight {
    static of(value: string, silent?: boolean): LineHeight | undefined;
    readonly type: LineHeightType;
    readonly value: number;
    constructor(type: LineHeightType, value: number);
    getValue(base: number): number;
    toString(): string | number;
    clone(): LineHeight;
}
//# sourceMappingURL=LineHeight.d.ts.map