import { Event, EventDispatcher } from '../base/Event';
import { XObject } from '../components/XObject';
import { IAlgorithm } from './AlgorithmFactory';
export declare enum AnimationValueType {
    NUMBER = 1,
    ANIMATABLE = 2
}
export declare enum AnimateEventType {
    UPDATE = "update",
    COMPLETE = "complete"
}
export declare class AnimateEvent extends Event {
    readonly step: number;
    readonly progress: number;
    readonly value: AnimationValues | IAnimatable<any> | number | undefined;
    constructor(type: string, step: number, progress: number, value?: AnimationValues | number | IAnimatable<any>);
    toString(): string;
}
export interface IAnimatable<T> {
    update(target: T, progress: number): T;
    convertFrom(src: any): T;
    isAnimatable(): boolean;
}
export declare function isIAnimatable(obj: any): boolean;
export declare type AnimationValues = {
    [key: string]: number | string | IAnimatable<any>;
};
export declare type AnimationProps = {
    [key: string]: {
        type: AnimationValueType;
        from: number | IAnimatable<any>;
        to: number | IAnimatable<any>;
        current?: number | IAnimatable<any>;
    };
};
export declare type AnimationTarget = number | IAnimatable<any> | AnimationValues | XObject;
export declare abstract class AnimationStep {
    readonly duration: number;
    readonly target: AnimationTarget;
    endTime: number;
    constructor(target: AnimationTarget, duration: number);
    onStart(): void;
    onUpdate(percent: number): AnimationValues | number | IAnimatable<any> | undefined;
    onEnd(): void;
}
export declare enum AnimationState {
    RUNNING = 1,
    PAUSED = 2,
    COMPLETED = 3,
    CANCELLED = 4
}
export declare class Animation extends EventDispatcher<AnimateEvent> {
    playTimes: number;
    state: AnimationState;
    target: AnimationTarget;
    private steps;
    private roundStartTime;
    private beginTime;
    private pauseTime;
    private duration;
    private currentStepIndex;
    private currentStepProgress;
    constructor(target: AnimationTarget, loop?: boolean);
    toPromise(): Promise<AnimateEvent>;
    pause(): boolean;
    resume(): boolean;
    loop(loop: boolean): Animation;
    times(times: number): Animation;
    to(props: any, duration: number, algorithm?: string | IAlgorithm): Animation;
    css(props: any, duration: number, algorithm?: string | IAlgorithm): Animation;
    call(call: () => any): Animation;
    wait(duration: number): Animation;
    onInterval(): boolean;
    cancel(): void;
    private doUpdateInternal;
    addStep(step: AnimationStep): Animation;
}
//# sourceMappingURL=Animation.d.ts.map