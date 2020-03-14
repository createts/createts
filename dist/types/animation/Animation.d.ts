import { BaseValue } from '../base/BaseValue';
import { Color } from '../base/Color';
import { Event, EventDispatcher } from '../base/Event';
import { XObject } from '../components/XObject';
import { Border } from '../style/Border';
import { Shadow } from '../style/Shadow';
import { IAlgorithm } from './AlgorithmFactory';
export declare enum AnimationValueType {
    NUMBER = 1,
    BASEVALUE = 2,
    COLOR = 3,
    BORDER = 4,
    SHADOW = 5
}
export declare enum AnimateEventType {
    UPDATE = "update",
    COMPLETE = "complete"
}
export declare class AnimateEvent extends Event {
    readonly progress: number;
    readonly currentStep: number;
    readonly currentProgress: number;
    constructor(type: string, progress: number, currentStep: number, currentProgress: number);
    toString(): string;
}
export interface IAnimationStyleAttributes {
    [key: string]: {
        type: AnimationValueType;
        from: number | BaseValue | Color | Border | Shadow | undefined;
        to: number | BaseValue | Color | Border | Shadow;
    };
}
export interface IAnimationValues {
    [key: string]: number | string;
}
export declare abstract class AnimationStep {
    readonly duration: number;
    readonly target: XObject;
    endTime: number;
    constructor(target: XObject, duration: number);
    onStart(): void;
    onUpdate(percent: number): boolean;
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
    target: XObject;
    private steps;
    private roundStartTime;
    private beginTime;
    private pauseTime;
    private duration;
    private currentStepIndex;
    private currentStepProgress;
    private totalProgress;
    constructor(target: XObject, loop?: boolean);
    toPromise(): Promise<AnimateEvent>;
    pause(): boolean;
    resume(): boolean;
    loop(loop: boolean): Animation;
    times(times: number): Animation;
    to(props: any, duration: number, algorithm?: string | IAlgorithm): Animation;
    call(call: () => any): Animation;
    wait(duration: number): Animation;
    onInterval(): boolean;
    cancel(): void;
    private onUpdateInternal;
    addStep(step: AnimationStep): Animation;
}
//# sourceMappingURL=Animation.d.ts.map