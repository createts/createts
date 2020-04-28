import { IAnimatable } from '../animation/Animation';
import { BaseValue } from '../base/BaseValue';
export declare class BorderRadius implements IAnimatable<BorderRadius> {
    static of(value: string | number, silent?: boolean): BorderRadius | undefined;
    readonly value1: BaseValue;
    readonly value2: BaseValue;
    constructor(value1: BaseValue, value2?: BaseValue);
    toString(): string;
    clone(): BorderRadius;
    update(target: BorderRadius, progress: number): BorderRadius;
    convertFrom(src: any): BorderRadius;
    isAnimatable(): boolean;
}
//# sourceMappingURL=BorderRadius.d.ts.map