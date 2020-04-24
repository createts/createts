import { Event, EventDispatcher } from '../base/Event';
import { XObject, XObjectEvent } from '../components/XObject';
import { ContainerUtils } from '../utils/ContainerUtils';
import { AlgorithmFactory, IAlgorithm } from './AlgorithmFactory';

export enum AnimationValueType {
  NUMBER = 1,
  ANIMATABLE = 2
}

export enum AnimateEventType {
  UPDATE = 'update',
  COMPLETE = 'complete'
}

export class AnimateEvent extends Event {
  public readonly step: number;
  public readonly progress: number;
  public readonly value: AnimationValues | IAnimatable<any> | number | undefined;

  constructor(
    type: string,
    step: number,
    progress: number,
    value?: AnimationValues | number | IAnimatable<any>
  ) {
    super(type, false, true);
    this.step = step;
    this.progress = progress;
    this.value = value;
  }

  toString() {
    return '[AnimateEvent (type=' + this.type + ')]';
  }
}

export interface IAnimatable<T> {
  update(target: T, progress: number): T;
  convertFrom(src: any): T;
  isAnimatable(): boolean;
}

function isIAnimatable(obj: any): boolean {
  return obj && obj.isAnimatable && obj.isAnimatable();
}

function isNumber(obj: any): boolean {
  return typeof obj === 'number';
}

export type AnimationValues = {
  [key: string]: number | string | IAnimatable<any>;
};

export type AnimationProps = {
  [key: string]: {
    type: AnimationValueType;
    from: number | IAnimatable<any>;
    to: number | IAnimatable<any>;
    current?: number | IAnimatable<any>;
  };
};

export type AnimationTarget = number | IAnimatable<any> | AnimationValues | XObject;

export abstract class AnimationStep {
  readonly duration: number;
  readonly target: AnimationTarget;
  public endTime: number = 0;

  constructor(target: AnimationTarget, duration: number) {
    this.target = target;
    this.duration = duration;
  }

  onStart() {
    return;
  }

  onUpdate(percent: number): AnimationValues | number | IAnimatable<any> | undefined {
    return undefined;
  }

  onEnd() {
    return;
  }
}

class WaitStep extends AnimationStep {}

class ToStep extends AnimationStep {
  algorithm: IAlgorithm;
  values: number | IAnimatable<any> | AnimationValues;
  computed?: AnimationProps;

  constructor(
    target: AnimationTarget,
    value: number | IAnimatable<any> | AnimationValues,
    algorithm: string | IAlgorithm,
    duration: number
  ) {
    super(target, duration);
    if (typeof algorithm === 'string') {
      const algo = AlgorithmFactory.get(algorithm);
      if (!algo) {
        throw new Error('unknown algorithm:' + algorithm);
      }
      this.algorithm = algo;
    } else {
      this.algorithm = algorithm;
    }
    this.values = value;
  }

  onStart() {
    this.computed = {};
    if (isNumber(this.target)) {
      this.computed.value = {
        type: AnimationValueType.NUMBER,
        from: this.target as number,
        to: this.values as number
      };
    } else if (isIAnimatable(this.target)) {
      const target = this.target as IAnimatable<any>;
      this.computed.value = {
        type: AnimationValueType.ANIMATABLE,
        from: target,
        to: target.convertFrom(this.values)
      };
    } else {
      const values = this.values as AnimationValues;
      for (const key in values) {
        const dest = values[key];
        const src = (this.target as any)[key];

        if (isIAnimatable(dest)) {
          const to = dest as IAnimatable<any>;
          this.computed[key] = {
            type: AnimationValueType.ANIMATABLE,
            from: to.convertFrom(src),
            to
          };
        } else if (isIAnimatable(src)) {
          const from = src as IAnimatable<any>;
          this.computed[key] = {
            type: AnimationValueType.ANIMATABLE,
            from,
            to: from.convertFrom(dest)
          };
        } else if (typeof dest === 'number') {
          let from = src;
          if (isNaN(from)) {
            from = parseFloat(src + '');
            if (isNaN(from)) {
              from = 0;
            }
          }
          this.computed[key] = {
            type: AnimationValueType.NUMBER,
            from,
            to: dest
          };
        }
      }
    }
  }

  onUpdate(percent: number): AnimationValues | number | IAnimatable<any> | undefined {
    if (ContainerUtils.isEmpty(this.computed)) {
      return undefined;
    }

    if (isNumber(this.target)) {
      const from = this.computed.value.from as number;
      const to = this.computed.value.to as number;
      this.computed.value.current = from + (to - from) * this.algorithm.calculate(percent);
      return this.computed.value.current;
    } else if (isIAnimatable(this.target)) {
      const from = this.computed.value.from as IAnimatable<any>;
      const to = this.computed.value.to as IAnimatable<any>;
      this.computed.value.current = from.update(to, this.algorithm.calculate(percent));
      return this.computed.value.current;
    } else {
      const result: AnimationValues = {};
      let updated = false;
      for (const name in this.computed) {
        const attr: any = this.computed[name];
        switch (attr.type) {
          case AnimationValueType.NUMBER:
            {
              const from = attr.from as number;
              const to = attr.to as number;
              attr.current = from + (to - from) * this.algorithm.calculate(percent);
            }
            break;
          case AnimationValueType.ANIMATABLE:
            {
              const from = attr.from as IAnimatable<any>;
              const to = attr.to as IAnimatable<any>;
              attr.current = from.update(to, this.algorithm.calculate(percent));
            }
            break;
        }
        (this.target as any)[name] = attr.current;
        result[name] = attr.current;
        updated = true;
      }
      return updated ? result : undefined;
    }
  }
}

class CssStep extends AnimationStep {
  algorithm: IAlgorithm;
  values: AnimationValues;
  computed?: AnimationProps;

  constructor(
    target: XObject,
    values: AnimationValues,
    algorithm: string | IAlgorithm,
    duration: number
  ) {
    super(target, duration);
    if (typeof algorithm === 'string') {
      const algo = AlgorithmFactory.get(algorithm);
      if (!algo) {
        throw new Error('unknown algorithm:' + algorithm);
      }
      this.algorithm = algo;
    } else {
      this.algorithm = algorithm;
    }
    this.values = values;
  }

  onStart() {
    this.computed = (this.target as XObject).style.getSnapshotForAnimation(
      this.target as XObject,
      this.values
    );
  }

  onUpdate(percent: number): AnimationValues | undefined {
    if (ContainerUtils.isEmpty(this.computed)) {
      return undefined;
    }
    const result: AnimationValues = {};
    let updated = false;
    const target = this.target as XObject;
    for (const name in this.computed) {
      const attr: any = this.computed[name];
      switch (attr.type) {
        case AnimationValueType.NUMBER:
          {
            const from = attr.from as number;
            const to = attr.to as number;
            attr.current = from + (to - from) * this.algorithm.calculate(percent);
          }
          break;
        case AnimationValueType.ANIMATABLE:
          {
            const from = attr.from as IAnimatable<any>;
            const to = attr.to as IAnimatable<any>;
            attr.current = from.update(to, this.algorithm.calculate(percent));
          }
          break;
      }
      result[name] = attr.current;
      updated = true;
    }
    if (updated) {
      target.style.applyAnimationResult(result);
      target.dispatchEvent(new XObjectEvent('update', true, true, target));
      return result;
    } else {
      return undefined;
    }
  }
}

class CallStep extends AnimationStep {
  call: (target: AnimationTarget) => any;
  constructor(target: AnimationTarget, call: () => any) {
    super(target, 0);
    this.call = call;
  }
  onEnd() {
    this.call(this.target);
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
  public target: AnimationTarget;
  private steps: AnimationStep[] = [];
  private roundStartTime: number = 0;
  private beginTime: number;
  private pauseTime: number;
  private duration: number = 0;

  private currentStepIndex: number = 0;
  private currentStepProgress: number = 0;

  constructor(target: AnimationTarget, loop?: boolean) {
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
    this.addStep(new ToStep(this.target, props, algorithm, duration));
    return this;
  }

  public css(props: any, duration: number, algorithm: string | IAlgorithm = 'linear'): Animation {
    this.addStep(new CssStep(this.target as XObject, props, algorithm, duration));
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
      this.doUpdateInternal(1);
      currentStep.onEnd();
      for (
        ++this.currentStepIndex;
        this.currentStepIndex < this.steps.length;
        ++this.currentStepIndex
      ) {
        const step = this.steps[this.currentStepIndex];
        step.onStart();
        this.doUpdateInternal(1);
        step.onEnd();
      }

      // Check whether to start a new round
      let newRound = true;
      if (this.playTimes > 0) {
        newRound = this.playTimes * this.duration > now - this.beginTime;
      }

      if (!newRound) {
        this.currentStepIndex = this.steps.length - 1;
        this.state = AnimationState.COMPLETED;
        this.dispatchEvent(
          new AnimateEvent(
            AnimateEventType.COMPLETE,
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
            this.doUpdateInternal(progress);
            break;
          } else {
            this.doUpdateInternal(1);
            step.onEnd();
            ++this.currentStepIndex;
          }
        }
      }
    } else {
      if (currentStep.endTime > passed) {
        const progress = 1 - (currentStep.endTime - passed) / currentStep.duration;
        this.doUpdateInternal(progress);
      } else {
        this.doUpdateInternal(1);
        currentStep.onEnd();
        ++this.currentStepIndex;
        while (true) {
          const step = this.steps[this.currentStepIndex];
          step.onStart();
          if (step.endTime > passed && step.duration > 0) {
            const progress = 1 - (step.endTime - passed) / step.duration;
            this.doUpdateInternal(progress);
            break;
          } else {
            this.doUpdateInternal(1);
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
      new AnimateEvent(AnimateEventType.COMPLETE, this.currentStepIndex, this.currentStepProgress)
    );
  }

  private doUpdateInternal(progress: number) {
    this.currentStepProgress = progress;
    const result = this.steps[this.currentStepIndex].onUpdate(progress);
    if (result) {
      this.dispatchEvent(
        new AnimateEvent(
          AnimateEventType.UPDATE,
          this.currentStepIndex,
          this.currentStepProgress,
          result
        )
      );
    }
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
