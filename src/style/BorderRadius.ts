import { IAnimatable } from '../animation/Animation';
import { BaseValue } from '../base/BaseValue';

/**
 * This class represents an immutable border object contains width, style and color.
 */
export class BorderRadius implements IAnimatable<BorderRadius> {
  /**
   * Convert a string to a BorderRadius object.
   * @param value a string present border, the format is [first value] [second value], and second
   * value is optional.
   * @param [silent] if true, ignore warning for an invalid value.
   * @returns A BorderRadius object for valid value, otherwise returns undefined.
   */
  public static of(value: string | number, silent = false): BorderRadius | undefined {
    if (typeof value === 'number') {
      return new BorderRadius(BaseValue.of(value));
    } else {
      const pieces = value.split(/\s+/);
      let value1: BaseValue | undefined;
      let value2: BaseValue | undefined;
      if (pieces.length === 1) {
        value1 = value2 = BaseValue.of(pieces[0]);
      } else if (pieces.length === 2) {
        value1 = BaseValue.of(pieces[0]);
        value2 = BaseValue.of(pieces[1]);
      }
      if (value1 && value2) {
        return new BorderRadius(value1, value2);
      } else {
        if (!silent) {
          console.warn(`invalid border:${value}`);
        }
        return undefined;
      }
    }
  }

  readonly value1: BaseValue;
  readonly value2: BaseValue;

  /**
   * Constructs and initializes a BorderRadius object with given arguments of values.
   * @param value1 the first value.
   * @param value2 the second value.
   */
  constructor(value1: BaseValue, value2: BaseValue = value1) {
    this.value1 = value1;
    this.value2 = value2;
  }

  /**
   * Returns a string representation of this BorderRadius object.
   * @returns a string representation of this object.
   */
  public toString(): string {
    return `${this.value1.toString()} ${this.value2.toString()}`;
  }

  /**
   * Creates a new BorderRadius with the same values as this object.
   * @returns a clone of this instance.
   */
  public clone(): BorderRadius {
    return new BorderRadius(this.value1, this.value2);
  }

  update(target: BorderRadius, progress: number): BorderRadius {
    return new BorderRadius(
      this.value1.update(target.value1, progress),
      this.value2.update(target.value2, progress)
    );
  }

  convertFrom(src: any): BorderRadius {
    const result = BorderRadius.of(src + '');
    if (result === undefined) {
      return new BorderRadius(BaseValue.ZERO, BaseValue.ZERO);
    } else {
      return result;
    }
  }

  isAnimatable(): boolean {
    return true;
  }
}
