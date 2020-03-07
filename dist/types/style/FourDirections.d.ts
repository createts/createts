import { BaseValue } from '../base/BaseValue';
export declare class FourDirections {
    static readonly DEFAULT: FourDirections;
    static of(text: string): FourDirections;
    private readonly top;
    private readonly right;
    private readonly bottom;
    private readonly left;
    constructor(top: BaseValue, right: BaseValue, bottom: BaseValue, left: BaseValue);
    getLeft(base: number): number;
    getRight(base: number): number;
    getTop(base: number): number;
    getBottom(base: number): number;
    getWidth(base: number): number;
    getHeight(base: number): number;
    clone(): FourDirections;
    toString(): string;
}
//# sourceMappingURL=FourDirections.d.ts.map