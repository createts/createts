const REG_RECT = /^\s*[0-9]+\s+[0-9]+\s+[0-9]+\s+[0-9]+\s*$/;

/**
 * This class represents an rectangle object which contains start point (x, y) and size (width, height).
 *
 * Static method Rect.of can be used to parse a string to a Rect object, the string must contains 4 numbers joint with space.
 * ```typescript
 * const rect = Rect.of('100 100 200 300');
 * ```
 */
export class Rect {
  /**
   * Convert a string to a Rect object.
   * @param value a string present a rectangle, see the spec above for format.
   * @returns A rect object for valid value, otherwise returns undefined.
   */
  public static of(value: string): Rect | undefined {
    if (!REG_RECT.test(value)) {
      return undefined;
    }
    const pieces = value.split(/\s+/);
    const x = parseFloat(pieces[0]);
    if (isNaN(x)) {
      return undefined;
    }
    const y = parseFloat(pieces[1]);
    if (isNaN(y)) {
      return undefined;
    }
    const width = parseFloat(pieces[2]);
    if (isNaN(width)) {
      return undefined;
    }
    const height = parseFloat(pieces[3]);
    if (isNaN(height)) {
      return undefined;
    }
    return new Rect(x, y, width, height);
  }

  /**
   * The X coordinate of the upper-left corner of the Rect.
   */
  public x: number;
  /**
   * The Y coordinate of the upper-left corner of the Rect.
   */
  public y: number;
  /**
   * The width of the Rect.
   */
  public width: number;
  /**
   * The height of the Rect.
   */
  public height: number;

  /**
   * Constructs a new Rect whose upper-left corner is specified as (x,y) and whose width and height are specified by the arguments of the same name.
   * @param x the specified X coordinate
   * @param y the specified Y coordinate
   * @param width the width of the Rect
   * @param height the height of the Rect
   */
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Checks whether or not this Rect object contains the point at the specified location (x,y).
   * @param x the specified X coordinate
   * @param y the specified Y coordinate
   * @returns true if the point (x,y) is inside this Rect; false otherwise.
   */
  public in(x: number, y: number): boolean {
    return x >= this.x && y >= this.y && x < this.x + this.width && y < this.y + this.height;
  }

  /**
   * Checks whether two Rect objects are equal.
   * The result is true if and only if the argument is a Rect object that has the same upper-left corner, width, and height as this Rect.
   * @param that the Object to compare with this Rect.
   * @returns true if the objects are equal; false otherwise.
   */
  public equals(that: Rect): boolean {
    return (
      this.x === that.x &&
      this.y === this.y &&
      this.width === that.width &&
      this.height === that.height
    );
  }

  /**
   * Creates a new Rect object with the same upper-left corner, width, and height as this object.
   * @returns a clone of this instance.
   */
  public clone(): Rect {
    return new Rect(this.x, this.y, this.width, this.height);
  }
}
