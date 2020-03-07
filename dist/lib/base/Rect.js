"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rect = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var REG_RECT = /^\s*[0-9]+\s+[0-9]+\s+[0-9]+\s+[0-9]+\s*$/;
/**
 * This class represents an rectangle object which contains start point (x, y) and size (width, height).
 *
 * Static method Rect.of can be used to parse a string to a Rect object, the string must contains 4 numbers joint with space.
 * ```typescript
 * const rect = Rect.of('100 100 200 300');
 * ```
 */

var Rect =
/*#__PURE__*/
function () {
  _createClass(Rect, null, [{
    key: "of",

    /**
     * Convert a string to a Rect object.
     * @param value a string present a rectangle, see the spec above for format.
     * @returns A rect object for valid value, otherwise returns undefined.
     */
    value: function of(value) {
      if (!REG_RECT.test(value)) {
        return undefined;
      }

      var pieces = value.split(/\s+/);
      var x = parseFloat(pieces[0]);

      if (isNaN(x)) {
        return undefined;
      }

      var y = parseFloat(pieces[1]);

      if (isNaN(y)) {
        return undefined;
      }

      var width = parseFloat(pieces[2]);

      if (isNaN(width)) {
        return undefined;
      }

      var height = parseFloat(pieces[3]);

      if (isNaN(height)) {
        return undefined;
      }

      return new Rect(x, y, width, height);
    }
    /**
     * The X coordinate of the upper-left corner of the Rect.
     */

  }]);

  /**
   * Constructs a new Rect whose upper-left corner is specified as (x,y) and whose width and height are specified by the arguments of the same name.
   * @param x the specified X coordinate
   * @param y the specified Y coordinate
   * @param width the width of the Rect
   * @param height the height of the Rect
   */
  function Rect(x, y, width, height) {
    _classCallCheck(this, Rect);

    this.x = void 0;
    this.y = void 0;
    this.width = void 0;
    this.height = void 0;
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


  _createClass(Rect, [{
    key: "in",
    value: function _in(x, y) {
      return x >= this.x && y >= this.y && x < this.x + this.width && y < this.y + this.height;
    }
    /**
     * Checks whether two Rect objects are equal.
     * The result is true if and only if the argument is a Rect object that has the same upper-left corner, width, and height as this Rect.
     * @param that the Object to compare with this Rect.
     * @returns true if the objects are equal; false otherwise.
     */

  }, {
    key: "equals",
    value: function equals(that) {
      return this.x === that.x && this.y === this.y && this.width === that.width && this.height === that.height;
    }
    /**
     * Creates a new Rect object with the same upper-left corner, width, and height as this object.
     * @returns a clone of this instance.
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Rect(this.x, this.y, this.width, this.height);
    }
  }]);

  return Rect;
}();

exports.Rect = Rect;