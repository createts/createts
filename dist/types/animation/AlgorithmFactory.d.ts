export interface IAlgorithm {
    calclate(percent: number): number;
}
export declare class Linear implements IAlgorithm {
    calclate(percent: number): number;
}
export declare class PowIn implements IAlgorithm {
    private pow;
    constructor(pow: number);
    calclate(percent: number): number;
}
export declare class PowOut implements IAlgorithm {
    private pow;
    constructor(pow: number);
    calclate(percent: number): number;
}
export declare class PowInOut implements IAlgorithm {
    private pow;
    constructor(pow: number);
    calclate(percent: number): number;
}
export declare class SineIn implements IAlgorithm {
    calclate(percent: number): number;
}
export declare class SineOut implements IAlgorithm {
    calclate(percent: number): number;
}
export declare class SineInOut implements IAlgorithm {
    calclate(percent: number): number;
}
export declare class BackIn implements IAlgorithm {
    private amount;
    constructor(amount: number);
    calclate(percent: number): number;
}
export declare class BackOut implements IAlgorithm {
    private amount;
    constructor(amount: number);
    calclate(percent: number): number;
}
export declare class BackInOut implements IAlgorithm {
    private amount;
    constructor(amount: number);
    calclate(percent: number): number;
}
export declare class CircIn implements IAlgorithm {
    calclate(percent: number): number;
}
export declare class CircOut implements IAlgorithm {
    calclate(percent: number): number;
}
export declare class CircInOut implements IAlgorithm {
    calclate(percent: number): number;
}
declare class Bounce {
    calclateOut(percent: number): number;
}
export declare class BounceOut extends Bounce implements IAlgorithm {
    calclate(percent: number): number;
}
export declare class BounceIn extends Bounce {
    calclate(percent: number): number;
}
export declare class BounceInOut extends BounceIn {
    calclate(percent: number): number;
}
export declare class ElasticIn implements IAlgorithm {
    private amplitude;
    private period;
    private s;
    constructor(amplitude: number, period: number);
    calclate(percent: number): number;
}
export declare class ElasticOut implements IAlgorithm {
    private amplitude;
    private period;
    private s;
    constructor(amplitude: number, period: number);
    calclate(percent: number): number;
}
export declare class ElasticInOut implements IAlgorithm {
    private amplitude;
    private period;
    private s;
    constructor(amplitude: number, period: number);
    calclate(percent: number): number;
}
export declare class AlgorithmFactory {
    static register(name: string, algorithm: IAlgorithm): void;
    static get(name: string): IAlgorithm | undefined;
    private static algorithms;
}
export {};
//# sourceMappingURL=AlgorithmFactory.d.ts.map