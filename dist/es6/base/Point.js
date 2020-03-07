function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A point representing a location in (x,y) coordinate space, specified in integer precision.
 */
export var Point =
/*#__PURE__*/
function () {
  /**
   * The X coordinate of this Point.
   */

  /**
   * The Y coordinate of this Point.
   */

  /**
   * Constructs and initializes a point at the specified (x,y) location in the coordinate space.
   * @param x the X coordinate of the newly constructed Point
   * @param y the Y coordinate of the newly constructed Point
   */
  function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = void 0;
    this.y = void 0;
    this.x = x;
    this.y = y;
  }
  /**
   * Checks whether two points are equal.
   * The result is true if and only if the argument is a Point object that has the same location.
   * @param that the Object to compare with this Point.
   * @returns true if the objects are equal; false otherwise.
   */


  _createClass(Point, [{
    key: "equals",
    value: function equals(that) {
      return this.x === that.x && this.y === this.y;
    }
    /**
     * Creates a new Point with the same location as this object.
     * @returns a clone of this instance.
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Point(this.x, this.y);
    }
  }]);

  return Point;
}();