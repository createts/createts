import { XObject } from '../components/XObject';
import { Animation, AnimationState } from './Animation';

export class AnimationFactory {
  public create(target: XObject, override?: boolean): Animation {
    if (override) {
      this.removeByTarget(target);
    }
    const animation = new Animation(target);
    this.animations.push(animation);
    return animation;
  }

  public removeByTarget(target: XObject) {
    for (const animation of this.animations) {
      if (animation.target === target && animation.state === AnimationState.RUNNING) {
        animation.cancel();
      }
    }
  }

  public onInterval() {
    const size = this.animations.length;
    for (let i = 0; i < size; ++i) {
      this.animations[i].onInterval();
    }
    for (let i = this.animations.length - 1; i >= 0; --i) {
      const animation = this.animations[i];
      if (
        animation.state === AnimationState.COMPLETED ||
        animation.state === AnimationState.CANCELLED
      ) {
        this.animations.splice(i, 1);
      }
    }
  }

  private animations: Animation[] = [];
}
