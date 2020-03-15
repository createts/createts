import { XObject } from './XObject';

/**
 * A TouchItem object representing an identifier to track a serial of touch events and location in
 * (x,y) coordinate space of current event.
 */
export class TouchItem {
  /**
   * The identifier of this TouchItem, used to track a serial of touch events.
   */
  readonly identifier: number;
  /**
   * The X coordinate of this TouchItem in the stage.
   */
  public stageX: number;
  /**
   * The Y coordinate of this TouchItem in the stage.
   */
  public stageY: number;
  /**
   * The X coordinate of this TouchItem in the current element.
   */
  public x: number;
  /**
   * The Y coordinate of this TouchItem in the current element.
   */
  public y: number;

  /**
   * The first pressed element of this event.
   */
  public srcElement?: XObject;

  /**
   * Constructs and initializes a TouchItem at the specified identifier and (x,y) location in the
   * coordinate space.
   * @param identifier the identifier of the newly constructed TouchItem
   * @param srcElement the source element of the newly constructed TouchItem
   * @param x the X coordinate of the newly constructed TouchItem
   * @param y the Y coordinate of the newly constructed TouchItem
   */
  constructor(
    identifier: number,
    srcElement?: XObject,
    stageX?: number,
    stageY?: number,
    x?: number,
    y?: number
  ) {
    this.identifier = identifier;
    this.srcElement = srcElement;
    this.stageX = stageX;
    this.stageY = stageY;
    this.x = x;
    this.y = y;
  }

  /**
   * Checks whether two TouchItems are equal.
   * The result is true if and only if the argument is a TouchItem object that has same identifier
   * and location.
   * @param that the Object to compare with this TouchItem.
   * @returns true if the objects are equal; false otherwise.
   */
  public equals(that: TouchItem): boolean {
    return (
      this.identifier === that.identifier &&
      this.srcElement === that.srcElement &&
      this.stageX === that.stageX &&
      this.stageY === that.stageY &&
      this.x === that.x &&
      this.y === that.y
    );
  }

  /**
   * Creates a new TouchItem with the same location as this object.
   * @returns a clone of this instance.
   */
  public clone(): TouchItem {
    return new TouchItem(
      this.identifier,
      this.srcElement,
      this.stageX,
      this.stageY,
      this.x,
      this.y
    );
  }
}
