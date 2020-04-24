import { XObject } from './XObject';

/**
 * A type contains position (x/y) and timestamp.
 */
export type TouchPosition = {
  x: number;
  y: number;
  timestamp: number;
};

/**
 * A velocity type contains speed and direction.
 */
export type Velocity = {
  speed: number;
  direction: number;
};

const TRACK_DURATION = 100; // In MS

/**
 * A helper class to track mouse/touch moves and calculate the velocity.
 * The current implementation tracks all moves in recently 100 milliseconds and use the
 * distance between current move and the last move in 100 milliseconds to calculate the velocity.
 */
class VelocityTracker {
  /**
   * All the moves in 100 milliseconds.
   */
  readonly positions: TouchPosition[] = [];

  /**
   * Removes the expired moves.
   * @param now the current timestamp.
   */
  private trim(now: number) {
    while (this.positions.length > 0 && this.positions[0].timestamp < now - TRACK_DURATION) {
      this.positions.shift();
    }
  }

  /**
   * Adds a new position.
   * @param x The X coordinate.
   * @param y The Y coordinate.
   * @param timestamp The timestamp of this new position.
   * @returns A computed velocity contains speed and direction.
   */
  public add(x: number, y: number, timestamp: number): Velocity {
    this.trim(timestamp);
    this.positions.push({ x, y, timestamp });
    let direction = 0;
    let speed = 0;
    if (this.positions.length > 1) {
      const first = this.positions[0];
      const duration = timestamp - first.timestamp;
      if (duration > 0) {
        const moves = Math.sqrt(Math.pow(x - first.x, 2) + Math.pow(y - first.y, 2));
        if (moves > 0) {
          speed = moves / duration;
          direction = (Math.asin((first.y - y) / moves) / Math.PI) * 180;
          if (x < first.x) {
            direction = 180 - direction;
          } else if (direction < 0) {
            direction = 360 + direction;
          }
        }
      }
    }
    return { speed, direction };
  }
}

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
   * The first pressed element of this event.
   */
  readonly srcElement?: XObject;
  /**
   * The timestamp of touch event starts.
   */
  readonly srcTimestamp: number;
  /**
   * The X coordinate of this TouchItem in the stage.
   */
  readonly srcStageX: number;
  /**
   * The Y coordinate of this TouchItem in the stage.
   */
  readonly srcStageY: number;

  /**
   * A helper to track and calculate velocity.
   */
  private velocityTracker?: VelocityTracker;

  /**
   * Whether the this TouchItem with mouse pressed.
   */
  public pressed: boolean = false;

  /**
   * The timestamp of current event.
   */
  public timestamp: number;
  /**
   * The current move speed, unit is pixel per millisecond.
   */
  public speed: number;
  /**
   * The move direction, move to up is 0, right is 90, down is 180 and left is 270.
   */
  public direction: number;

  /**
   * The current X coordinate in the stage.
   */
  public stageX: number;
  /**
   * The current Y coordinate in the stage.
   */
  public stageY: number;
  /**
   * The current element of this event.
   */
  public currentTarget?: XObject;
  /**
   * The current X coordinate in the current element.
   */
  public x: number = 0;
  /**
   * The current Y coordinate in the current element.
   */
  public y: number = 0;
  /**
   * mousewheel event only, the delta in X direction.
   */
  public deltaX?: number;
  /**
   * mousewheel event only, the delta in Y direction.
   */
  public deltaY?: number;

  /**
   * Constructs and initializes a TouchItem at the specified identifier and (x,y) location in the
   * coordinate space.
   * @param identifier the identifier of the newly constructed TouchItem
   * @param srcElement the source element of the newly constructed TouchItem
   * @param stageX the X coordinate in stage of the newly constructed TouchItem
   * @param stageY the Y coordinate in stage of the newly constructed TouchItem
   */
  constructor(
    identifier: number,
    srcElement: XObject,
    stageX: number,
    stageY: number,
    timestamp: number
  ) {
    this.identifier = identifier;
    this.srcElement = srcElement;
    this.srcStageX = this.stageX = stageX;
    this.srcStageY = this.stageY = stageY;
    this.srcTimestamp = this.timestamp = timestamp;
    this.speed = this.direction = 0;
  }

  getDelta(): { x: number; y: number } {
    if (this.deltaX !== undefined && this.deltaY !== undefined) {
      return { x: this.deltaX, y: this.deltaY };
    }
    if (!this.velocityTracker || this.velocityTracker.positions.length <= 1) {
      return { x: 0, y: 0 };
    } else {
      const size = this.velocityTracker.positions.length;
      return {
        x: this.velocityTracker.positions[size - 1].x - this.velocityTracker.positions[size - 2].x,
        y: this.velocityTracker.positions[size - 1].y - this.velocityTracker.positions[size - 2].y
      };
    }
  }

  /**
   * Clones a new TouchItem instance by this one, but change the src element.
   * @param srcElement the new src element.
   */
  public switchSourceElement(srcElement: XObject): TouchItem {
    const cloned = new TouchItem(
      this.identifier,
      srcElement,
      this.srcStageX,
      this.srcStageY,
      this.srcTimestamp
    );
    cloned.x = this.x;
    cloned.y = this.y;
    cloned.currentTarget = this.currentTarget;
    cloned.pressed = this.pressed;
    cloned.speed = this.speed;
    cloned.direction = this.direction;
    return cloned;
  }

  /**
   *
   * @param item
   */
  public onUpdate(item: TouchItem) {
    if (!this.velocityTracker) {
      this.velocityTracker = new VelocityTracker();
      this.velocityTracker.add(this.stageX, this.stageY, this.timestamp);
    }
    const velocity = this.velocityTracker.add(item.stageX, item.stageY, item.timestamp);
    this.speed = velocity.speed;
    this.direction = velocity.direction;
    this.stageX = item.stageX;
    this.stageY = item.stageY;
    this.timestamp = item.srcTimestamp;
  }

  /**
   * Creates a new TouchItem with the same location as this object.
   * @returns a clone of this instance.
   */
  public clone(): TouchItem {
    return this.switchSourceElement(this.srcElement);
  }
}
