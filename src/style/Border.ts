import { IAnimatable } from '../animation/Animation';
import { Color } from '../base/Color';

/**
 * Border styles, see
 * <a href='https://www.w3schools.com/css/css_border.asp'>https://www.w3schools.com/css/css_border.asp</a>
 *
 * Currently only supports 'solid'
 */
export enum BorderStyle {
  SOLID = 'solid'
}

/**
 * A regular expression represents border definition.
 */
const BORDER_PATTERN = /^[\s]*([^\s]+)[\s]+([\w]+)[\s]+(.*)$/;

/**
 * This class represents an immutable border object contains width, style and color.
 */
export class Border implements IAnimatable<Border> {
  /**
   * Default border object with 0 border size.
   */
  public static readonly DEFAULT = new Border(0, BorderStyle.SOLID, Color.BLACK);

  /**
   * Convert a string to a Border object.
   * @param value a string present border, the format is [width] [style] [color]
   * @param [silent] if true, ignore warning for an invalid value.
   * @returns A border object for valid value, otherwise returns undefined.
   */
  public static of(value: string, silent = false): Border | undefined {
    const pieces = value.match(BORDER_PATTERN);
    if (!pieces) {
      if (!silent) {
        console.warn(`invalid border:${value}`);
      }
      return undefined;
    }
    const color = Color.of(pieces[3], silent);
    if (!color) {
      if (!silent) {
        console.warn(`invalid border:${value}`);
      }
      return undefined;
    }
    return new Border(parseFloat(pieces[1]), BorderStyle.SOLID, color);
  }

  /**
   * Specifies the width of the four borders.
   */
  public readonly width: number = 0;
  /**
   * Specifies what kind of border to display.
   * Currently only support solid color.
   */
  public readonly style: BorderStyle = BorderStyle.SOLID;
  /**
   * Specifies the color of this border.
   */
  public readonly color: Color = Color.NONE;

  /**
   * Constructs and initializes a border object with given arguments of sRGB and alpha.
   * @param width the width of the four borders.
   * @param style what kind of border to display.
   * @param color the color of this border.
   */
  constructor(width: number, style: BorderStyle, color: Color) {
    this.width = width;
    this.style = style;
    this.color = color;
  }

  /**
   * Returns a string representation of this Border object.
   * @returns a string representation of this object.
   */
  public toString(): string {
    return `${this.width.toString()} ${this.style} ${this.color.toString()}`;
  }

  /**
   * Checks whether two BaseValue Border are equal.
   * The result is true if and only if the argument is a Border object that has the same width, style and color as this Rect.
   * @param that the Object to compare with this Border object.
   * @returns true if the objects are equal; false otherwise.
   */
  public equals(that: Border): boolean {
    return this.width === that.width && this.style === that.style && this.color.equals(that.color);
  }

  /**
   * Returns true if this border instance takes affect.
   * @returns true if the border instance takes affect; false otherwise.
   */
  public isEnable(): boolean {
    return this.width > 0 && this.color.a > 0;
  }

  /**
   * Creates a new Border with the same width, style and color as this object.
   * @returns a clone of this instance.
   */
  public clone(): Border {
    return new Border(this.width, this.style, this.color.clone());
  }

  update(target: Border, progress: number): Border {
    return new Border(
      this.width + (target.width - this.width) * progress,
      this.style,
      this.color.update(target.color, progress)
    );
  }

  convertFrom(src: any): Border {
    const result = Border.of(src + '');
    if (result === undefined) {
      return new Border(0, BorderStyle.SOLID, Color.BLACK);
    } else {
      return result;
    }
  }

  isAnimatable(): boolean {
    return true;
  }
}
