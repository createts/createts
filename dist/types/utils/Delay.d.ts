export declare class Delay {
    private delayTime;
    private delayHandler;
    private func?;
    private paused;
    constructor(delayTime: number);
    call(func: () => any): void;
    pause(): void;
    resume(): void;
    cancel(): void;
    private start;
}
//# sourceMappingURL=Delay.d.ts.map