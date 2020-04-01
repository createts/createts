import { Color } from '../base/Color';
import { CSSTokenizer } from '../parser/CSSTokenizer';

/**
 * The shadow property adds shadow effects around an element's frame. A shadow is described by X
 * and Y offsets relative to the element, blur and color.
 *
 * Please note that wechat mini game does not support shadow.
 */
export class Shadow {
  /**
   * Specifies the color of the shadow.
   */
  public color: Color;
  /**
   * Specifies the X offset relative to the element.
   */
  public offsetX: number;
  /**
   * Specifies the Y offset relative to the element.
   */
  public offsetY: number;
  /**
   * Specifies the blur size.
   */
  public blur: number;

  /**
   * Convert a string to a Shadow object.
   * @param value a string present a shadow object, the format is [X] [Y] [blur] [color].
   * @param [silent] if ture, ignore warning for an invalid value.
   * @returns A Shadow object for valid value, otherwise returns undefined.
   */
  public static of(value: string, silent: boolean = false): Shadow | undefined {
    const parts = new CSSTokenizer().tokenize(value);
    if (parts.length !== 4) {
      if (!silent) {
        console.warn(`invalid shadow:${value}`);
      }
      return undefined;
    }

    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    const blur = parseFloat(parts[2]);
    const color = Color.of(parts[3], silent);
    if (isNaN(x) || isNaN(y) || isNaN(blur) || color === undefined) {
      if (!silent) {
        console.warn(`invalid shadow:${value}`);
      }
      return undefined;
    }
    return new Shadow(x, y, blur, color);
  }

  /**
   * Constructs and initializes a shadow object with given arguments of X and Y offsets, blur and
   * color.
   * @param offsetX the x offset to this element.
   * @param offsetY the y offset to this element.
   * @param blur the blur size of this shadow.
   * @param color the color of this shadow.
   */
  constructor(offsetX: number, offsetY: number, blur: number, color: Color) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.blur = blur;
    this.color = color;
  }

  /**
   * Returns a string representation of this Shadow object.
   * @returns a string representation of this object.
   */
  public toString(): string {
    return `[Shadow (${this.color.toString()} ${this.offsetX} ${this.offsetY} ${this.blur})]`;
  }

  /**
   * Creates a new Shadow with the same X and Y offsets, blur and color as this object.
   * @returns a clone of this instance.
   */
  public clone(): Shadow {
    return new Shadow(this.offsetX, this.offsetY, this.blur, this.color);
  }

  /**
   * Returns true if this shadow instance takes affect.
   * @returns true if the shadow instance takes affect; false otherwise.
   */
  public isEnable(): boolean {
    return this.color.a > 0 && (this.offsetX !== 0 || this.offsetY !== 0 || this.blur !== 0);
  }
}
