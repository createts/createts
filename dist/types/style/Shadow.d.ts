import { IAnimatable } from '../animation/Animation';
import { Color } from '../base/Color';
export declare class Shadow implements IAnimatable<Shadow> {
    color: Color;
    offsetX: number;
    offsetY: number;
    blur: number;
    static of(value: string, silent?: boolean): Shadow | undefined;
    constructor(offsetX: number, offsetY: number, blur: number, color: Color);
    toString(): string;
    clone(): Shadow;
    isEnable(): boolean;
    update(target: Shadow, progress: number): Shadow;
    convertFrom(src: any): Shadow;
    isAnimatable(): boolean;
}
//# sourceMappingURL=Shadow.d.ts.map