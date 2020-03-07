import { Shadow } from '../';
import { BaseValue } from '../base/BaseValue';
import { Color } from '../base/Color';
import { Event, EventDispatcher } from '../base/Event';
import { XObject } from '../components/XObject';
import { Border } from '../style/Border';
import { AlgorithmFactory, IAlgorithm } from './AlgorithmFactory';

export enum AnimationValueType {
  NUMBER = 1,
  BASEVALUE = 2,
  COLOR = 3,
  BORDER = 4,
  SHADOW = 5
}

export enum AnimateEventType {
  UPDATE = 'update',
  COMPLETE = 'complete'
}

export class AnimateEvent extends Event {
  public readonly progress: number;
  public readonly currentStep: number;
  public readonly currentProgress: number;

  constructor(type: string, progress: number, currentStep: number, currentProgress: number) {
    super(type, false, true);
    this.progress = progress;
    this.currentStep = currentStep;
    this.currentProgress = currentProgress;
  }

  toString() {
    return '[AnimateEvent (type=' + this.type + ')]';
  }
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

abstract class AnimationStep {
  readonly duration: number;
  readonly target: XObject;
  public endTime: number = 0;

  constructor(target: XObject, duration: number) {
    this.target = target;
    this.duration = duration;
  }

  onStart(): AnimationStep {
    return this;
  }

  onUpdate(percent: number): AnimationStep {
    return this;
  }

  onEnd(): AnimationStep {
    return this;
  }
}

class WaitStep extends AnimationStep {}

class AnimateStep extends AnimationStep {
  algorithm: IAlgorithm;
  props: IAnimationValues;
  computed?: IAnimationStyleAttributes;

  constructor(
    target: XObject,
    props: IAnimationValues,
    algorithm: string | IAlgorithm,
    duration: number
  ) {
    super(target, duration);
    if (typeof algorithm === 'string') {
      const algo = AlgorithmFactory.get(algorithm);
      if (!algo) {
        throw new Error('unknow algorithm:' + algorithm);
      }
      this.algorithm = algo;
    } else {
      this.algorithm = algorithm;
    }
    this.props = props;
  }

  onStart(): AnimationStep {
    this.computed = this.target.style.getSnapshotForAnimation(this.target, this.props);
    return this;
  }

  onUpdate(percent: number): AnimationStep {
    if (!this.computed) {
      return this;
    }
    for (const name in this.computed) {
      const attr: any = this.computed[name];
      switch (attr.type) {
        case AnimationValueType.NUMBER:
          {
            const from = attr.from as number;
            const to = attr.to as number;
            (this.target.style as any)[name] =
              from + (to - from) * this.algorithm.calclate(percent);
          }
          break;
        case AnimationValueType.BASEVALUE:
          {
            const from = attr.from as BaseValue;
            const to = attr.to as BaseValue;
            (this.target.style as any)[name] = new BaseValue(
              from.numberValue +
                (to.numberValue - from.numberValue) * this.algorithm.calclate(percent),
              to.unit
            );
          }
          break;
        case AnimationValueType.COLOR:
          {
            const from = attr.from as Color;
            const to = attr.to as Color;
            const v = this.algorithm.calclate(percent);
            (this.target.style as any)[name] = new Color(
              from.r + (to.r - from.r) * v,
              from.g + (to.g - from.g) * v,
              from.b + (to.b - from.b) * v,
              from.a + (to.a - from.a) * v
            );
          }
          break;
        case AnimationValueType.BORDER:
          {
            const from = attr.from as Border;
            const to = attr.to as Border;
            const v = this.algorithm.calclate(percent);
            (this.target.style as any)[name] = new Border(
              from.width + (to.width - from.width) * v,
              from.style,
              new Color(
                from.color.r + (to.color.r - from.color.r) * v,
                from.color.g + (to.color.g - from.color.g) * v,
                from.color.b + (to.color.b - from.color.b) * v,
                from.color.a + (to.color.a - from.color.a) * v
              )
            );
          }
          break;
        case AnimationValueType.SHADOW:
          {
            const from = attr.from as Shadow;
            const to = attr.to as Shadow;
            const v = this.algorithm.calclate(percent);
            (this.target.style as any)[name] = new Shadow(
              from.offsetX + (to.offsetX - from.offsetX) * v,
              from.offsetY + (to.offsetY - from.offsetY) * v,
              from.blur + (to.blur - from.blur) * v,
              new Color(
                from.color.r + (to.color.r - from.color.r) * v,
                from.color.g + (to.color.g - from.color.g) * v,
                from.color.b + (to.color.b - from.color.b) * v,
                from.color.a + (to.color.a - from.color.a) * v
              )
            );
          }
          break;
      }
    }
    return this;
  }

  onEnd(): AnimationStep {
    for (const name in this.computed) {
      const attr = this.computed[name];
      (this.target.style as any)[name] = attr.to;
    }
    return this;
  }
}

class CallStep extends AnimationStep {
  call: () => any;
  constructor(target: XObject, call: () => any) {
    super(target, 0);
    this.call = call;
  }
  onEnd(): AnimationStep {
    this.call();
    return this;
  }
}

export enum AnimationState {
  RUNNING = 1,
  COMPLETED = 2,
  CANCELLED = 3
}

export class Animation extends EventDispatcher<AnimateEvent> {
  public loopAnimate: boolean = false;
  public state: AnimationState = AnimationState.RUNNING;
  public target: XObject;

  private steps: AnimationStep[] = [];
  private startTime: number = 0;
  private duration: number = 0;

  private currentStepIndex: number = 0;
  private currentStepProgress: number = 0;
  private totalProgress: number = 0;

  constructor(target: XObject, loop?: boolean) {
    super();
    this.target = target;
    this.loopAnimate = !!loop;
    this.startTime = Date.now();
    this.currentStepIndex = 0;
    this.state = AnimationState.RUNNING;
  }

  public toPromise(): Promise<AnimateEvent> {
    return new Promise<AnimateEvent>((resolve, reject) => {
      this.addEventListener(AnimateEventType.COMPLETE, event => {
        resolve(event);
      });
    });
  }

  public loop(loop: boolean): Animation {
    this.loopAnimate = loop;
    return this;
  }

  public to(props: any, duration: number, algorithm: string | IAlgorithm): Animation {
    this.addStep(new AnimateStep(this.target, props, algorithm, duration));
    return this;
  }

  public call(call: () => any): Animation {
    return this.addStep(new CallStep(this.target, call));
  }

  public wait(duration: number): Animation {
    return this.addStep(new WaitStep(this.target, duration));
  }

  public onInterval() {
    if (this.duration <= 0) {
      return;
    }
    const now = Date.now();
    if (now < this.startTime) {
      return;
    }

    let passed = now - this.startTime;
    const currentStep = this.steps[this.currentStepIndex];

    if (passed >= this.duration) {
      // To end
      currentStep.onEnd();
      for (
        ++this.currentStepIndex;
        this.currentStepIndex < this.steps.length;
        ++this.currentStepIndex
      ) {
        this.steps[this.currentStepIndex].onStart().onEnd();
      }
      if (!this.loopAnimate) {
        this.currentStepIndex = this.steps.length - 1;
        this.onUpdateInternal(1, 1);
        this.state = AnimationState.COMPLETED;
        this.dispatchEvent(
          new AnimateEvent(
            AnimateEventType.COMPLETE,
            this.totalProgress,
            this.currentStepIndex,
            this.currentStepProgress
          )
        );
      } else {
        // New loop
        passed = passed % this.duration;
        this.startTime = now - passed;
        this.currentStepIndex = 0;
        while (true) {
          const step = this.steps[this.currentStepIndex];
          step.onStart();
          if (step.endTime > passed) {
            const progress = 1 - (step.endTime - passed) / step.duration;
            this.onUpdateInternal(progress, passed / this.duration);
            break;
          } else {
            step.onEnd();
            ++this.currentStepIndex;
          }
        }
      }
    } else {
      if (currentStep.endTime > passed) {
        const progress = 1 - (currentStep.endTime - passed) / currentStep.duration;
        this.onUpdateInternal(progress, passed / this.duration);
      } else {
        currentStep.onEnd();
        ++this.currentStepIndex;
        while (true) {
          const step = this.steps[this.currentStepIndex];
          step.onStart();
          if (step.endTime > passed && step.duration > 0) {
            const progress = 1 - (step.endTime - passed) / step.duration;
            this.onUpdateInternal(progress, passed / this.duration);
            break;
          } else {
            step.onEnd();
            ++this.currentStepIndex;
          }
        }
      }
    }
  }

  public cancel() {
    this.state = AnimationState.CANCELLED;
    this.dispatchEvent(
      new AnimateEvent(
        AnimateEventType.COMPLETE,
        this.totalProgress,
        this.currentStepIndex,
        this.currentStepProgress
      )
    );
  }

  private onUpdateInternal(currentStepProgress: number, totalProgress: number) {
    this.currentStepProgress = currentStepProgress;
    this.totalProgress = totalProgress;
    this.steps[this.currentStepIndex].onUpdate(currentStepProgress);
    this.dispatchEvent(
      new AnimateEvent(
        AnimateEventType.UPDATE,
        this.totalProgress,
        this.currentStepIndex,
        this.currentStepProgress
      )
    );
  }

  private addStep(step: AnimationStep): Animation {
    this.steps.push(step);
    this.duration += step.duration;
    step.endTime = this.duration;
    if (this.steps.length === 1) {
      step.onStart();
    }
    return this;
  }
}
