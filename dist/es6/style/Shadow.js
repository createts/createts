function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { Color } from '../base/Color';
import { CSSTokenizer } from '../parser/CSSTokenizer';
/**
 * The shadow property adds shadow effects around an element's frame. A shadow is described by X and Y offsets relative
 * to the element, blur and color.
 */

export var Shadow =
/*#__PURE__*/
function () {
  _createClass(Shadow, null, [{
    key: "of",

    /**
     * Specifies the color of the shadow.
     */

    /**
     * Specifies the X offset relative to the element.
     */

    /**
     * Specifies the Y offset relative to the element.
     */

    /**
     * Specifies the blur size.
     */

    /**
     * Convert a string to a Shadow object.
     * @param value a string present a shadow object, the format is [X] [Y] [blur] [color].
     * @param [silent] if ture, ignore warning for an invalid value.
     * @returns A Shadow object for valid value, otherwise returns undefined.
     */
    value: function of(value) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var parts = new CSSTokenizer().tokenize(value);

      if (parts.length !== 4) {
        if (!silent) {
          console.warn("invalid shadow:".concat(value));
        }

        return undefined;
      }

      var x = parseFloat(parts[0]);
      var y = parseFloat(parts[1]);
      var blur = parseFloat(parts[2]);
      var color = Color.of(parts[3], silent);

      if (isNaN(x) || isNaN(y) || isNaN(blur) || color === undefined) {
        if (!silent) {
          console.warn("invalid shadow:".concat(value));
        }

        return undefined;
      }

      return new Shadow(x, y, blur, color);
    }
    /**
     * Constructs and initializes a shadow object with given arguments of X and Y offsets, blur and color.
     * @param offsetX the x offset to this element.
     * @param offsetY the y offset to this element.
     * @param blur the blur size of this shadow.
     * @param color the color of this shadow.
     */

  }]);

  function Shadow(offsetX, offsetY, blur, color) {
    _classCallCheck(this, Shadow);

    this.color = void 0;
    this.offsetX = void 0;
    this.offsetY = void 0;
    this.blur = void 0;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.blur = blur;
    this.color = color;
  }
  /**
   * Returns a string representation of this Shadow object.
   * @returns a string representation of this object.
   */


  _createClass(Shadow, [{
    key: "toString",
    value: function toString() {
      return "[Shadow (".concat(this.color.toString(), " ").concat(this.offsetX, " ").concat(this.offsetY, " ").concat(this.blur, ")]");
    }
    /**
     * Creates a new Shadow with the same X and Y offsets, blur and color as this object.
     * @returns a clone of this instance.
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Shadow(this.offsetX, this.offsetY, this.blur, this.color);
    }
    /**
     * Returns true if this shadow instance takes affect.
     * @returns true if the shadow instance takes affect; false otherwise.
     */

  }, {
    key: "isEnable",
    value: function isEnable() {
      return this.color.a > 0 && (this.offsetX !== 0 || this.offsetY !== 0 || this.blur !== 0);
    }
  }]);

  return Shadow;
}();