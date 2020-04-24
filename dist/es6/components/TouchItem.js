function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A type contains position (x/y) and timestamp.
 */

/**
 * A velocity type contains speed and direction.
 */
var TRACK_DURATION = 100; // In MS

/**
 * A helper class to track mouse/touch moves and calculate the velocity.
 * The current implementation tracks all moves in recently 100 milliseconds and use the
 * distance between current move and the last move in 100 milliseconds to calculate the velocity.
 */

var VelocityTracker = /*#__PURE__*/function () {
  function VelocityTracker() {
    _classCallCheck(this, VelocityTracker);

    this.positions = [];
  }

  _createClass(VelocityTracker, [{
    key: "trim",

    /**
     * Removes the expired moves.
     * @param now the current timestamp.
     */
    value: function trim(now) {
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

  }, {
    key: "add",
    value: function add(x, y, timestamp) {
      this.trim(timestamp);
      this.positions.push({
        x: x,
        y: y,
        timestamp: timestamp
      });
      var direction = 0;
      var speed = 0;

      if (this.positions.length > 1) {
        var first = this.positions[0];
        var duration = timestamp - first.timestamp;

        if (duration > 0) {
          var moves = Math.sqrt(Math.pow(x - first.x, 2) + Math.pow(y - first.y, 2));

          if (moves > 0) {
            speed = moves / duration;
            direction = Math.asin((first.y - y) / moves) / Math.PI * 180;

            if (x < first.x) {
              direction = 180 - direction;
            } else if (direction < 0) {
              direction = 360 + direction;
            }
          }
        }
      }

      return {
        speed: speed,
        direction: direction
      };
    }
  }]);

  return VelocityTracker;
}();
/**
 * A TouchItem object representing an identifier to track a serial of touch events and location in
 * (x,y) coordinate space of current event.
 */


export var TouchItem = /*#__PURE__*/function () {
  /**
   * The identifier of this TouchItem, used to track a serial of touch events.
   */

  /**
   * The first pressed element of this event.
   */

  /**
   * The timestamp of touch event starts.
   */

  /**
   * The X coordinate of this TouchItem in the stage.
   */

  /**
   * The Y coordinate of this TouchItem in the stage.
   */

  /**
   * A helper to track and calculate velocity.
   */

  /**
   * Whether the this TouchItem with mouse pressed.
   */

  /**
   * The timestamp of current event.
   */

  /**
   * The current move speed, unit is pixel per millisecond.
   */

  /**
   * The move direction, move to up is 0, right is 90, down is 180 and left is 270.
   */

  /**
   * The current X coordinate in the stage.
   */

  /**
   * The current Y coordinate in the stage.
   */

  /**
   * The current element of this event.
   */

  /**
   * The current X coordinate in the current element.
   */

  /**
   * The current Y coordinate in the current element.
   */

  /**
   * mousewheel event only, the delta in X direction.
   */

  /**
   * mousewheel event only, the delta in Y direction.
   */

  /**
   * Constructs and initializes a TouchItem at the specified identifier and (x,y) location in the
   * coordinate space.
   * @param identifier the identifier of the newly constructed TouchItem
   * @param srcElement the source element of the newly constructed TouchItem
   * @param stageX the X coordinate in stage of the newly constructed TouchItem
   * @param stageY the Y coordinate in stage of the newly constructed TouchItem
   */
  function TouchItem(identifier, srcElement, stageX, stageY, timestamp) {
    _classCallCheck(this, TouchItem);

    this.identifier = void 0;
    this.srcElement = void 0;
    this.srcTimestamp = void 0;
    this.srcStageX = void 0;
    this.srcStageY = void 0;
    this.velocityTracker = void 0;
    this.pressed = false;
    this.timestamp = void 0;
    this.speed = void 0;
    this.direction = void 0;
    this.stageX = void 0;
    this.stageY = void 0;
    this.currentTarget = void 0;
    this.x = 0;
    this.y = 0;
    this.deltaX = void 0;
    this.deltaY = void 0;
    this.identifier = identifier;
    this.srcElement = srcElement;
    this.srcStageX = this.stageX = stageX;
    this.srcStageY = this.stageY = stageY;
    this.srcTimestamp = this.timestamp = timestamp;
    this.speed = this.direction = 0;
  }

  _createClass(TouchItem, [{
    key: "getDelta",
    value: function getDelta() {
      if (this.deltaX !== undefined && this.deltaY !== undefined) {
        return {
          x: this.deltaX,
          y: this.deltaY
        };
      }

      if (!this.velocityTracker || this.velocityTracker.positions.length <= 1) {
        return {
          x: 0,
          y: 0
        };
      } else {
        var size = this.velocityTracker.positions.length;
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

  }, {
    key: "switchSourceElement",
    value: function switchSourceElement(srcElement) {
      var cloned = new TouchItem(this.identifier, srcElement, this.srcStageX, this.srcStageY, this.srcTimestamp);
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

  }, {
    key: "onUpdate",
    value: function onUpdate(item) {
      if (!this.velocityTracker) {
        this.velocityTracker = new VelocityTracker();
        this.velocityTracker.add(this.stageX, this.stageY, this.timestamp);
      }

      var velocity = this.velocityTracker.add(item.stageX, item.stageY, item.timestamp);
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

  }, {
    key: "clone",
    value: function clone() {
      return this.switchSourceElement(this.srcElement);
    }
  }]);

  return TouchItem;
}();