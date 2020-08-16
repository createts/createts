import { IAnimatable } from '../animation/Animation';

export enum BaseValueUnit {
  PX = 1,
  PERCENTAGE = 2,
  VW = 3,
}
let canvas: HTMLCanvasElement;
export function initBaseValuesCanvas(passinCanvas: HTMLCanvasElement): void {
  canvas = passinCanvas;
}

/**
 * This class represents an immutable value object contains a number value and unit.
 *
 * There are 3 types of units:
 * 1. PX: absolute value.
 * 2. PERCENTAGE: the percentage of parent value.
 * 3. vw: 1% length of the width
 */
export class BaseValue implements IAnimatable<BaseValue> {
  public static ZERO = BaseValue.of('0');
  /**
   * Convert a string to a BaseValue object.
   * @param value if it is a string value and ends with '%', parse it as a percentage value, otherwise parse it as a absolute value.
   * @returns A BaseValue object for valid value, otherwise returns undefined.
   */
  public static of(value: string | number, silent: boolean = false): BaseValue | undefined {
    if (typeof value === 'string') {
      const num = parseFloat(value);
      if (isNaN(num)) {
        if (!silent) {
          console.warn('invalid value:' + value);
        }
        return undefined;
      }
      if (value.endsWith('%')) {
        return new BaseValue(num, BaseValueUnit.PERCENTAGE);
      } else if (value.endsWith('vw')) {
        const oneVWLength = canvas.width / 100;
        return new BaseValue(num * oneVWLength, BaseValueUnit.PX);
      } else {
        return new BaseValue(num, BaseValueUnit.PX);
      }
    } else {
      return new BaseValue(value, BaseValueUnit.PX);
    }
  }

  /**
   * The number part of this object.
   */
  public readonly numberValue: number = 0;
  /**
   * The unit of this object.
   */
  public readonly unit: BaseValueUnit;

  /**
   * Constructs a new BaseValue object whose value and unit are specified by the arguments of the same name.
   * @param value the specified number value
   * @param unit the specified unit
   */
  constructor(value: number, unit: BaseValueUnit = BaseValueUnit.PX) {
    this.unit = unit;
    this.numberValue = value;
  }

  /**
   * Calculate the absolute value by the arguments.
   * @param base the base value for percentage unit.
   * @returns current object's number value if the unit is absolute, or base * number / 100 for percentage unit.
   */
  public getValue(base: number): number {
    switch (this.unit) {
      case BaseValueUnit.PERCENTAGE:
        return (this.numberValue * base) / 100;
      case BaseValueUnit.PX:
        return this.numberValue;
    }
  }

  /**
   * Creates a new BaseValue object with absolute unit by current object and a specified base value.
   * @param base the base value for percentage unit.
   * @returns a new BaseValue object with absolute unit.
   */
  public toAbsolute(base: number): BaseValue {
    switch (this.unit) {
      case BaseValueUnit.PERCENTAGE:
        return new BaseValue((this.numberValue * base) / 100, BaseValueUnit.PX);
      case BaseValueUnit.PX:
        return this;
    }
  }

  /**
   * Creates a new BaseValue object with percentage unit by current object and a specified base value.
   * @param base the base value for percentage unit.
   * @returns a new BaseValue object with percentage unit.
   */
  public toPercentage(base: number): BaseValue {
    switch (this.unit) {
      case BaseValueUnit.PX:
        return new BaseValue((this.numberValue / base) * 100, BaseValueUnit.PERCENTAGE);
      case BaseValueUnit.PERCENTAGE:
        return this;
    }
  }

  /**
   * Returns a string representation of this BaseValue object.
   * @returns a string representation of this object
   */
  public toString(): string {
    switch (this.unit) {
      case BaseValueUnit.PERCENTAGE:
        return this.numberValue + '%';
      case BaseValueUnit.PX:
        return this.numberValue + '';
    }
  }

  /**
   * Checks whether two BaseValue objects are equal.
   * The result is true if and only if the argument is a BaseValue object that has the same number value and unit as this Rect.
   * @param that the Object to compare with this BaseValue object.
   * @returns true if the objects are equal; false otherwise.
   */
  public equals(that: BaseValue): boolean {
    return this.numberValue === that.numberValue && this.unit === this.unit;
  }

  /**
   * Creates a new Rect with the same upper-left corner, width, and height as this object.
   * @returns a clone of this instance.
   */
  public clone(): BaseValue {
    return new BaseValue(this.numberValue, this.unit);
  }

  update(target: BaseValue, progress: number): BaseValue {
    return new BaseValue(
      this.numberValue + (target.numberValue - this.numberValue) * progress,
      target.unit
    );
  }

  convertFrom(src: any): BaseValue {
    const result = BaseValue.of(src);
    if (result === undefined) {
      return new BaseValue(0);
    } else {
      return result;
    }
  }

  isAnimatable(): boolean {
    return true;
  }
}
