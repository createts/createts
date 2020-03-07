import { Color } from '../base/Color';
export declare class Shadow {
    color: Color;
    offsetX: number;
    offsetY: number;
    blur: number;
    static of(value: string, silent?: boolean): Shadow | undefined;
    constructor(offsetX: number, offsetY: number, blur: number, color: Color);
    toString(): string;
    clone(): Shadow;
    isEnable(): boolean;
}
//# sourceMappingURL=Shadow.d.ts.map