export interface IAlgorithm {
  calculate(percent: number): number;
}

export class Linear implements IAlgorithm {
  public calculate(percent: number): number {
    return percent;
  }
}

export class PowIn implements IAlgorithm {
  constructor(private pow: number) {}
  public calculate(percent: number): number {
    return Math.pow(percent, this.pow);
  }
}

export class PowOut implements IAlgorithm {
  constructor(private pow: number) {}
  public calculate(percent: number): number {
    return 1 - Math.pow(1 - percent, this.pow);
  }
}

export class PowInOut implements IAlgorithm {
  constructor(private pow: number) {}
  public calculate(percent: number): number {
    percent *= 2;
    if (percent < 1) {
      return 0.5 * Math.pow(percent, this.pow);
    } else {
      return 1 - 0.5 * Math.abs(Math.pow(2 - percent, this.pow));
    }
  }
}

export class SineIn implements IAlgorithm {
  public calculate(percent: number): number {
    return 1 - Math.cos((percent * Math.PI) / 2);
  }
}

export class SineOut implements IAlgorithm {
  public calculate(percent: number): number {
    return Math.sin((percent * Math.PI) / 2);
  }
}

export class SineInOut implements IAlgorithm {
  public calculate(percent: number): number {
    return -0.5 * (Math.cos(Math.PI * percent) - 1);
  }
}

export class BackIn implements IAlgorithm {
  constructor(private amount: number) {}
  public calculate(percent: number): number {
    return percent * percent * ((this.amount + 1) * percent - this.amount);
  }
}

export class BackOut implements IAlgorithm {
  constructor(private amount: number) {}
  public calculate(percent: number): number {
    return --percent * percent * ((this.amount + 1) * percent + this.amount) + 1;
  }
}

export class BackInOut implements IAlgorithm {
  constructor(private amount: number) {}
  public calculate(percent: number): number {
    percent *= 2;
    if (percent < 1) {
      return 0.5 * (percent * percent * ((this.amount + 1) * percent - this.amount));
    } else {
      return 0.5 * ((percent -= 2) * percent * ((this.amount + 1) * percent + this.amount) + 2);
    }
  }
}

export class CircIn implements IAlgorithm {
  public calculate(percent: number): number {
    return -(Math.sqrt(1 - percent * percent) - 1);
  }
}

export class CircOut implements IAlgorithm {
  public calculate(percent: number): number {
    return Math.sqrt(1 - --percent * percent);
  }
}

export class CircInOut implements IAlgorithm {
  public calculate(percent: number): number {
    percent *= 2;
    if (percent < 1) {
      return -0.5 * (Math.sqrt(1 - percent * percent) - 1);
    } else {
      return 0.5 * (Math.sqrt(1 - (percent -= 2) * percent) + 1);
    }
  }
}

class Bounce {
  public calculateOut(percent: number): number {
    if (percent < 1 / 2.75) {
      return 7.5625 * percent * percent;
    } else if (percent < 2 / 2.75) {
      return 7.5625 * (percent -= 1.5 / 2.75) * percent + 0.75;
    } else if (percent < 2.5 / 2.75) {
      return 7.5625 * (percent -= 2.25 / 2.75) * percent + 0.9375;
    } else {
      return 7.5625 * (percent -= 2.625 / 2.75) * percent + 0.984375;
    }
  }
}

export class BounceOut extends Bounce implements IAlgorithm {
  public calculate(percent: number): number {
    return super.calculateOut(percent);
  }
}

export class BounceIn extends Bounce {
  public calculate(percent: number): number {
    return 1 - super.calculateOut(1 - percent);
  }
}

export class BounceInOut extends BounceIn {
  public calculate(percent: number): number {
    if (percent < 0.5) {
      return super.calculate(percent * 2) * 0.5;
    } else {
      return super.calculateOut(percent * 2 - 1) * 0.5 + 0.5;
    }
  }
}

const PI2 = Math.PI * 2;

export class ElasticIn implements IAlgorithm {
  private s: number;
  constructor(private amplitude: number, private period: number) {
    this.s = (this.period / PI2) * Math.asin(1 / this.amplitude);
  }
  public calculate(percent: number): number {
    if (percent === 0 || percent === 1) {
      return percent;
    }
    return -(
      this.amplitude *
      Math.pow(2, 10 * (percent -= 1)) *
      Math.sin(((percent - this.s) * PI2) / this.period)
    );
  }
}

export class ElasticOut implements IAlgorithm {
  private s: number;
  constructor(private amplitude: number, private period: number) {
    this.s = (this.period / PI2) * Math.asin(1 / this.amplitude);
  }
  public calculate(percent: number): number {
    if (percent === 0 || percent === 1) {
      return percent;
    }
    return (
      this.amplitude *
        Math.pow(2, -10 * percent) *
        Math.sin(((percent - this.s) * PI2) / this.period) +
      1
    );
  }
}

export class ElasticInOut implements IAlgorithm {
  private s: number;
  constructor(private amplitude: number, private period: number) {
    this.s = (this.period / PI2) * Math.asin(1 / this.amplitude);
  }
  public calculate(percent: number): number {
    percent *= 2;
    if (percent < 1) {
      return (
        -0.5 *
        (this.amplitude *
          Math.pow(2, 10 * (percent -= 1)) *
          Math.sin(((percent - this.s) * PI2) / this.period))
      );
    } else {
      return (
        this.amplitude *
          Math.pow(2, -10 * (percent -= 1)) *
          Math.sin(((percent - this.s) * PI2) / this.period) *
          0.5 +
        1
      );
    }
  }
}

/**
 * The AlgorithmFactory provides a collection of easing algorithms for animation.
 *
 * Here is an example:
 *
 * ```typescript
 * // use the registered algorithm name.
 * AnimationFactory.create(component, true).to({rotation:360}, 1000), "quadInOut");
 * // use the algorithm instance.
 * AnimationFactory.create(component, true).to({rotation:360}, 1000), new BackOut(2));
 * ```
 *
 * Developer can also register customized algorithm, code example:
 * ```
 * class MyAlgo implements IAlgorithm {
 *   public calculate(percent: number): number {
 *     return percent; // change it with your own algorithm.
 *   }
 * }
 * AlgorithmFactory.register('myalgo', new MyAlgo());
 *
 * AnimationFactory.create(component, true).to({rotation:360}, 1000), "quadInOut");
 */
export class AlgorithmFactory {
  /**
   * Prevent creating instance.
   */
  private constructor() {}

  /**
   * Registers algorithm with a specified name.
   * @param name name of algorithm
   * @param algorithm the implementation instance of the algorithm
   */
  public static register(name: string, algorithm: IAlgorithm) {
    this.algorithms.set(name, algorithm);
  }

  /**
   * Registers algorithm with a specified name.
   * @param data A name to IAlgorithm instance map to be registered.
   */
  public static registerAll(data: { [key: string]: IAlgorithm }) {
    for (const name in data) {
      this.algorithms.set(name, data[name]);
    }
  }

  /**
   * Gets algorithm instance by a specified name.
   * @param name the name of algorithm, registered by AlgorithmFactory.register
   * @returns instance of algorithm, undefined for non-existed name
   */
  public static get(name: string): IAlgorithm | undefined {
    return this.algorithms.get(name);
  }

  /**
   * Algorithm instances collection, keyed by name;
   */
  private static algorithms: Map<string, IAlgorithm> = new Map();
}

AlgorithmFactory.registerAll({
  linear: new Linear(),
  quadIn: new PowIn(2),
  quadOut: new PowOut(2),
  quadInOut: new PowInOut(2),
  cubicIn: new PowIn(3),
  cubicOut: new PowOut(3),
  cubicInOut: new PowInOut(3),
  quartIn: new PowIn(4),
  quartOut: new PowOut(4),
  quartInOut: new PowInOut(4),
  quintIn: new PowIn(5),
  quintOut: new PowOut(5),
  quintInOut: new PowInOut(5),
  sineIn: new SineIn(),
  sineOut: new SineOut(),
  sineInOut: new SineInOut(),
  backIn: new BackIn(1.7),
  backOut: new BackOut(1.7),
  backInOut: new BackInOut(1.7),
  circIn: new CircIn(),
  circOut: new CircOut(),
  circInOut: new CircInOut(),
  bounceIn: new BounceIn(),
  bounceOut: new BounceOut(),
  bounceInOut: new BounceInOut(),
  elasticIn: new ElasticIn(1, 0.3),
  elasticOut: new ElasticOut(1, 0.3),
  elasticInOut: new ElasticInOut(1, 0.3)
});
