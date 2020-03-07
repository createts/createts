/**
 * A point representing a location in (x,y) coordinate space, specified in integer precision.
 */
export class Point {
  /**
   * The X coordinate of this Point.
   */
  public x: number;
  /**
   * The Y coordinate of this Point.
   */
  public y: number;

  /**
   * Constructs and initializes a point at the specified (x,y) location in the coordinate space.
   * @param x the X coordinate of the newly constructed Point
   * @param y the Y coordinate of the newly constructed Point
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Checks whether two points are equal.
   * The result is true if and only if the argument is a Point object that has the same location.
   * @param that the Object to compare with this Point.
   * @returns true if the objects are equal; false otherwise.
   */
  public equals(that: Point): boolean {
    return this.x === that.x && this.y === this.y;
  }

  /**
   * Creates a new Point with the same location as this object.
   * @returns a clone of this instance.
   */
  public clone(): Point {
    return new Point(this.x, this.y);
  }
}
