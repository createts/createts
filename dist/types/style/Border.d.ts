import { Color } from '../base/Color';
export declare enum BorderStyle {
    SOLID = "solid"
}
export declare class Border {
    static readonly DEFAULT: Border;
    static of(value: string, silent?: boolean): Border | undefined;
    readonly width: number;
    readonly style: BorderStyle;
    readonly color: Color;
    constructor(width: number, style: BorderStyle, color: Color);
    toString(): string;
    equals(that: Border): boolean;
    isEnable(): boolean;
    clone(): Border;
}
//# sourceMappingURL=Border.d.ts.map