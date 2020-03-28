import { Event, EventDispatcher } from './base/Event';
export declare class TickerEvent extends Event {
    readonly now: number;
    readonly delay: number;
    constructor(type: string, now: number, delay: number);
}
export declare class Ticker extends EventDispatcher<TickerEvent> {
    private duration;
    private lastTickTime;
    private stopped;
    constructor(fps?: number);
    start(): void;
    setFps(fps: number): void;
    stop(): void;
    private onAnimationFrame;
}
//# sourceMappingURL=Ticker.d.ts.map