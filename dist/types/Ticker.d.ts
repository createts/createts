import { Event, EventDispatcher } from './base/Event';
export declare class Ticker extends EventDispatcher<Event> {
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