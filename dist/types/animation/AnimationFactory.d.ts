import { Event, EventDispatcher } from '../base/Event';
import { Animation, AnimationTarget } from './Animation';
export declare class AnimationFactory extends EventDispatcher<Event> {
    create(target: AnimationTarget, override?: boolean): Animation;
    removeByTarget(target: AnimationTarget): void;
    clear(): void;
    onInterval(): boolean;
    private animations;
}
//# sourceMappingURL=AnimationFactory.d.ts.map