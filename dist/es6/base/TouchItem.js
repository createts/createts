function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A TouchItem object representing an identifier to track a serial of touch events and location in
 * (x,y) coordinate space of current event.
 */
export var TouchItem =
/*#__PURE__*/
function () {
  /**
   * The identifier of this TouchItem, used to track a serial of touch events.
   */

  /**
   * The X coordinate of this TouchItem in the stage.
   */

  /**
   * The Y coordinate of this TouchItem in the stage.
   */

  /**
   * The X coordinate of this TouchItem in the current element.
   */

  /**
   * The Y coordinate of this TouchItem in the current element.
   */

  /**
   * Constructs and initializes a TouchItem at the specified identifier and (x,y) location in the
   * coordinate space.
   * @param identifier the identifier of the newly constructed TouchItem
   * @param x the X coordinate of the newly constructed TouchItem
   * @param y the Y coordinate of the newly constructed TouchItem
   */
  function TouchItem(identifier, stageX, stageY, x, y) {
    _classCallCheck(this, TouchItem);

    this.identifier = void 0;
    this.stageX = void 0;
    this.stageY = void 0;
    this.x = void 0;
    this.y = void 0;
    this.identifier = identifier;
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


  _createClass(TouchItem, [{
    key: "equals",
    value: function equals(that) {
      return this.identifier === this.identifier && this.stageX === that.stageX && this.stageY === this.stageY && this.x === that.x && this.y === this.y;
    }
    /**
     * Creates a new TouchItem with the same location as this object.
     * @returns a clone of this instance.
     */

  }, {
    key: "clone",
    value: function clone() {
      return new TouchItem(this.identifier, this.stageX, this.stageY, this.x, this.y);
    }
  }]);

  return TouchItem;
}();