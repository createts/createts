import { XObject } from '../components/XObject';
import { Animation } from './Animation';
export declare class AnimationFactory {
    create(target: XObject, override?: boolean): Animation;
    removeByTarget(target: XObject): void;
    onInterval(): boolean;
    private animations;
}
//# sourceMappingURL=AnimationFactory.d.ts.map