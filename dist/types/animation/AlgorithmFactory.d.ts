export interface IAlgorithm {
    calculate(percent: number): number;
}
export declare class Linear implements IAlgorithm {
    calculate(percent: number): number;
}
export declare class PowIn implements IAlgorithm {
    private pow;
    constructor(pow: number);
    calculate(percent: number): number;
}
export declare class PowOut implements IAlgorithm {
    private pow;
    constructor(pow: number);
    calculate(percent: number): number;
}
export declare class PowInOut implements IAlgorithm {
    private pow;
    constructor(pow: number);
    calculate(percent: number): number;
}
export declare class SineIn implements IAlgorithm {
    calculate(percent: number): number;
}
export declare class SineOut implements IAlgorithm {
    calculate(percent: number): number;
}
export declare class SineInOut implements IAlgorithm {
    calculate(percent: number): number;
}
export declare class BackIn implements IAlgorithm {
    private amount;
    constructor(amount: number);
    calculate(percent: number): number;
}
export declare class BackOut implements IAlgorithm {
    private amount;
    constructor(amount: number);
    calculate(percent: number): number;
}
export declare class BackInOut implements IAlgorithm {
    private amount;
    constructor(amount: number);
    calculate(percent: number): number;
}
export declare class CircIn implements IAlgorithm {
    calculate(percent: number): number;
}
export declare class CircOut implements IAlgorithm {
    calculate(percent: number): number;
}
export declare class CircInOut implements IAlgorithm {
    calculate(percent: number): number;
}
declare class Bounce {
    calculateOut(percent: number): number;
}
export declare class BounceOut extends Bounce implements IAlgorithm {
    calculate(percent: number): number;
}
export declare class BounceIn extends Bounce {
    calculate(percent: number): number;
}
export declare class BounceInOut extends BounceIn {
    calculate(percent: number): number;
}
export declare class ElasticIn implements IAlgorithm {
    private amplitude;
    private period;
    private s;
    constructor(amplitude: number, period: number);
    calculate(percent: number): number;
}
export declare class ElasticOut implements IAlgorithm {
    private amplitude;
    private period;
    private s;
    constructor(amplitude: number, period: number);
    calculate(percent: number): number;
}
export declare class ElasticInOut implements IAlgorithm {
    private amplitude;
    private period;
    private s;
    constructor(amplitude: number, period: number);
    calculate(percent: number): number;
}
export declare class AlgorithmFactory {
    static register(name: string, algorithm: IAlgorithm): void;
    static get(name: string): IAlgorithm | undefined;
    private static algorithms;
}
export {};
//# sourceMappingURL=AlgorithmFactory.d.ts.map