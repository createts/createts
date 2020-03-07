export declare enum BaseValueUnit {
    PX = 1,
    PERCENTAGE = 2
}
export declare class BaseValue {
    static of(value: string | number, silent?: boolean): BaseValue | undefined;
    readonly numberValue: number;
    readonly unit: BaseValueUnit;
    constructor(value: number, unit?: BaseValueUnit);
    getValue(base: number): number;
    toAbsolute(base: number): BaseValue;
    toPercentage(base: number): BaseValue;
    toString(): string;
    equals(that: BaseValue): boolean;
    clone(): BaseValue;
}
//# sourceMappingURL=BaseValue.d.ts.map