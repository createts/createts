export declare class Event {
    defaultPrevented: boolean;
    propagationStopped: boolean;
    immediatePropagationStopped: boolean;
    readonly type: string;
    readonly bubbles: boolean;
    readonly cancelable: boolean;
    readonly timeStamp: number;
    constructor(type: string, bubbles?: boolean, cancelable?: boolean);
    preventDefault(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
    toString(): string;
}
declare type IEventListener<T extends Event> = (event: T) => void;
export declare class EventDispatcher<T extends Event> {
    private listeners;
    addEventListener(type: string, listener: IEventListener<T>): EventDispatcher<T>;
    on(type: string, listener: IEventListener<T>): EventDispatcher<T>;
    removeEventListener(type: string, listener: IEventListener<T>): void;
    off(type: string, listener: IEventListener<T>): void;
    removeAllEventListeners(type?: string): void;
    hasEventListener(type: string): boolean;
    willTrigger(type: string): boolean;
    dispatchEvent(event: T): boolean;
}
export {};
//# sourceMappingURL=Event.d.ts.map