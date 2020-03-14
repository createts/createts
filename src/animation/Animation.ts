import { BaseValue } from '../base/BaseValue';
import { Color } from '../base/Color';
import { Event, EventDispatcher } from '../base/Event';
import { XObject } from '../components/XObject';
import { Background } from '../style/Background';
import { Border } from '../style/Border';
import { Shadow } from '../style/Shadow';
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

export abstract class AnimationStep {
  readonly duration: number;
  readonly target: XObject;
  public endTime: number = 0;

  constructor(target: XObject, duration: number) {
    this.target = target;
    this.duration = duration;
  }

  // tslint:disable-next-line: no-empty
  onStart() {}

  // Returns true to ask stage to update the canvas.
  onUpdate(percent: number): boolean {
    return false;
  }

  // tslint:disable-next-line: no-empty
  onEnd() {}
}

class WaitStep extends AnimationStep {}

class StyleStep extends AnimationStep {
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

  onStart() {
    this.computed = this.target.style.getSnapshotForAnimation(this.target, this.props);
  }

  onUpdate(percent: number): boolean {
    if (!this.computed) {
      return false;
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
            const color = new Color(
              from.r + (to.r - from.r) * v,
              from.g + (to.g - from.g) * v,
              from.b + (to.b - from.b) * v,
              from.a + (to.a - from.a) * v
            );
            if (name === 'backgroundColor') {
              if (!this.target.style.background) {
                this.target.style.background = new Background();
              }
              this.target.style.background.color = color;
            } else {
              (this.target.style as any)[name] = color;
            }
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
    return true;
  }
}

class CallStep extends AnimationStep {
  call: () => any;
  constructor(target: XObject, call: () => any) {
    super(target, 0);
    this.call = call;
  }
  onEnd() {
    this.call();
  }
}

export enum AnimationState {
  RUNNING = 1,
  PAUSED = 2,
  COMPLETED = 3,
  CANCELLED = 4
}

export class Animation extends EventDispatcher<AnimateEvent> {
  public playTimes: number = 1;
  public state: AnimationState = AnimationState.RUNNING;
  public target: XObject;

  private steps: AnimationStep[] = [];
  private roundStartTime: number = 0;
  private beginTime: number;
  private pauseTime: number;
  private duration: number = 0;

  private currentStepIndex: number = 0;
  private currentStepProgress: number = 0;
  private totalProgress: number = 0;

  constructor(target: XObject, loop?: boolean) {
    super();
    this.target = target;
    this.playTimes = loop ? 0 : 1;
    this.roundStartTime = this.beginTime = Date.now();
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

  public pause(): boolean {
    if (this.state === AnimationState.RUNNING) {
      this.state = AnimationState.PAUSED;
      this.pauseTime = Date.now();
      return true;
    } else {
      return false;
    }
  }

  public resume(): boolean {
    if (this.state === AnimationState.PAUSED) {
      const duration = Date.now() - this.pauseTime;
      this.roundStartTime += duration;
      this.beginTime += duration;
      this.state = AnimationState.RUNNING;
      return true;
    } else {
      return false;
    }
  }

  public loop(loop: boolean): Animation {
    this.playTimes = loop ? 0 : 1;
    return this;
  }

  public times(times: number): Animation {
    this.playTimes = times;
    return this;
  }

  public to(props: any, duration: number, algorithm: string | IAlgorithm = 'linear'): Animation {
    this.addStep(new StyleStep(this.target, props, algorithm, duration));
    return this;
  }

  public call(call: () => any): Animation {
    return this.addStep(new CallStep(this.target, call));
  }

  public wait(duration: number): Animation {
    return this.addStep(new WaitStep(this.target, duration));
  }

  public onInterval(): boolean {
    if (this.duration <= 0) {
      // This is an empty animation without any step.
      return false;
    }
    const now = Date.now();
    if (now < this.roundStartTime) {
      // The current time is before start time, this is usually caused by changing system time
      // during animation playing, ignore this.
      return false;
    }

    let passed = now - this.roundStartTime;
    const currentStep = this.steps[this.currentStepIndex];

    if (passed >= this.duration) {
      // To end
      currentStep.onUpdate(1);
      currentStep.onEnd();
      for (
        ++this.currentStepIndex;
        this.currentStepIndex < this.steps.length;
        ++this.currentStepIndex
      ) {
        const step = this.steps[this.currentStepIndex];
        step.onStart();
        step.onUpdate(1);
        step.onEnd();
      }

      // Check whether to start a new round
      let newRound = true;
      if (this.playTimes > 0) {
        newRound = this.playTimes * this.duration > now - this.beginTime;
      }

      if (!newRound) {
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
        this.roundStartTime = now - passed;
        this.currentStepIndex = 0;
        while (true) {
          const step = this.steps[this.currentStepIndex];
          step.onStart();
          if (step.endTime > passed) {
            const progress = 1 - (step.endTime - passed) / step.duration;
            this.onUpdateInternal(progress, passed / this.duration);
            break;
          } else {
            step.onUpdate(1);
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
        currentStep.onUpdate(1);
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
            step.onUpdate(1);
            step.onEnd();
            ++this.currentStepIndex;
          }
        }
      }
    }
    return true;
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

  public addStep(step: AnimationStep): Animation {
    this.steps.push(step);
    this.duration += step.duration;
    step.endTime = this.duration;
    if (this.steps.length === 1) {
      step.onStart();
    }
    return this;
  }
}
