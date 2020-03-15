"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Border = exports.BorderStyle = void 0;

var _Color = require("../base/Color");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Border styles, see
 * <a href='https://www.w3schools.com/css/css_border.asp'>https://www.w3schools.com/css/css_border.asp</a>
 *
 * Currently only supports 'solid'
 */
var BorderStyle;
/**
 * A regular experssion represents border definition.
 */

exports.BorderStyle = BorderStyle;

(function (BorderStyle) {
  BorderStyle["SOLID"] = "solid";
})(BorderStyle || (exports.BorderStyle = BorderStyle = {}));

var BORDER_PATTERN = /^[\s]*([^\s]+)[\s]+([\w]+)[\s]+(.*)$/;
/**
 * This class represents an immutable border object contains width, style and color.
 */

var Border = /*#__PURE__*/function () {
  _createClass(Border, null, [{
    key: "of",

    /**
     * Default border object with 0 border size.
     */

    /**
     * Convert a string to a Border object.
     * @param value a string present border, the format is [width] [style] [color]
     * @param [silent] if ture, ignore warning for an invalid value.
     * @returns A border object for valid value, otherwise returns undefined.
     */
    value: function of(value) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var pieces = value.match(BORDER_PATTERN);

      if (!pieces) {
        if (!silent) {
          console.warn("invalid border:".concat(value));
        }

        return undefined;
      }

      var color = _Color.Color.of(pieces[3], silent);

      if (!color) {
        if (!silent) {
          console.warn("invalid border:".concat(value));
        }

        return undefined;
      }

      return new Border(parseFloat(pieces[1]), BorderStyle.SOLID, color);
    }
    /**
     * Specifies the width of the four borders.
     */

  }]);

  /**
   * Constructs and initializes a border object with given arguments of sRGB and alpha.
   * @param width the width of the four borders.
   * @param style what kind of border to display.
   * @param color the color of this border.
   */
  function Border(width, style, color) {
    _classCallCheck(this, Border);

    this.width = 0;
    this.style = BorderStyle.SOLID;
    this.color = _Color.Color.NONE;
    this.width = width;
    this.style = style;
    this.color = color;
  }
  /**
   * Returns a string representation of this Border object.
   * @returns a string representation of this object.
   */


  _createClass(Border, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.width.toString(), " ").concat(this.style, " ").concat(this.color.toString());
    }
    /**
     * Checks whether two BaseValue Border are equal.
     * The result is true if and only if the argument is a Border object that has the same width, style and color as this Rect.
     * @param that the Object to compare with this Border object.
     * @returns true if the objects are equal; false otherwise.
     */

  }, {
    key: "equals",
    value: function equals(that) {
      return this.width === that.width && this.style === that.style && this.color.equals(that.color);
    }
    /**
     * Returns true if this border instance takes affect.
     * @returns true if the border instance takes affect; false otherwise.
     */

  }, {
    key: "isEnable",
    value: function isEnable() {
      return this.width > 0 && this.color.a > 0;
    }
    /**
     * Creates a new Border with the same width, style and color as this object.
     * @returns a clone of this instance.
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Border(this.width, this.style, this.color.clone());
    }
  }]);

  return Border;
}();

exports.Border = Border;
Border.DEFAULT = new Border(0, BorderStyle.SOLID, _Color.Color.BLACK);