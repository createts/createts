import { Event, EventDispatcher } from '../base/Event';
import { XObject } from '../components/XObject';
import { Animation } from './Animation';
export declare class AnimationFactory extends EventDispatcher<Event> {
    create(target: XObject, override?: boolean): Animation;
    removeByTarget(target: XObject): void;
    clear(): void;
    onInterval(): boolean;
    private animations;
}
//# sourceMappingURL=AnimationFactory.d.ts.map