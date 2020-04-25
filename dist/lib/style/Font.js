"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Font = exports.FontWeight = exports.FontVariant = exports.FontStyle = void 0;

var _EnumUtils = require("../utils/EnumUtils");

var _LayoutUtils = require("../utils/LayoutUtils");

var _LineHeight = require("./LineHeight");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FontStyle;
exports.FontStyle = FontStyle;

(function (FontStyle) {
  FontStyle["NORMAL"] = "normal";
  FontStyle["ITALIC"] = "italic";
  FontStyle["OBLIQUE"] = "oblique";
})(FontStyle || (exports.FontStyle = FontStyle = {}));

var FontVariant;
exports.FontVariant = FontVariant;

(function (FontVariant) {
  FontVariant["NORMAL"] = "normal";
  FontVariant["SMALL_CAPS"] = "small-caps";
})(FontVariant || (exports.FontVariant = FontVariant = {}));

var FontWeight;
/**
 * A regular experssion represents font definition.
 */

exports.FontWeight = FontWeight;

(function (FontWeight) {
  FontWeight["NORMAL"] = "normal";
  FontWeight["BOLD"] = "bold";
  FontWeight["BOLDER"] = "bolder";
  FontWeight["W100"] = "100";
  FontWeight["W200"] = "200";
  FontWeight["W300"] = "300";
  FontWeight["W400"] = "400";
  FontWeight["W500"] = "500";
  FontWeight["W600"] = "600";
  FontWeight["W700"] = "700";
  FontWeight["W800"] = "800";
  FontWeight["W900"] = "900";
})(FontWeight || (exports.FontWeight = FontWeight = {}));

var REG_PARTS = /(^|^.*\s+)([0-9]+[a-z]+[^\s]+)($|\s+(.*)$)/;
/**
 * This class represents a font object contains style, width, size, variant, line height and font family.
 */

var Font = /*#__PURE__*/function () {
  _createClass(Font, null, [{
    key: "of",

    /**
     * The default font family, it is mutable
     */

    /**
     * Convert a string to a Font object.
     * @param value a string present font, see the definition here
     * <a href='https://developer.mozilla.org/en-US/docs/Web/CSS/font'>
     *   https://developer.mozilla.org/en-US/docs/Web/CSS/font
     * </a>
     * @param [silent] if ture, ignore warning for an invalid value.
     * @returns A Font object for valid value, otherwise returns undefined.
     */
    value: function of(value) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var matched = value.match(REG_PARTS);

      if (!matched) {
        if (!silent) {
          console.warn("invalid font:".concat(value));
        }

        return undefined;
      }

      var font = new Font();
      var styles = matched[1].split(/\s+/);

      var _iterator = _createForOfIteratorHelper(styles),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var style = _step.value;
          style = style.toLowerCase();

          if (style === 'normal') {
            continue;
          }

          var fontStyle = _EnumUtils.EnumUtils.fromString(FontStyle, style, FontStyle.NORMAL);

          if (fontStyle !== FontStyle.NORMAL) {
            font.style = fontStyle;
            continue;
          }

          var fontWeight = _EnumUtils.EnumUtils.fromString(FontWeight, style, FontWeight.NORMAL);

          if (fontWeight !== FontWeight.NORMAL) {
            font.weight = fontWeight;
            continue;
          }

          var fontVariant = _EnumUtils.EnumUtils.fromString(FontVariant, style, FontVariant.NORMAL);

          if (fontVariant !== FontVariant.NORMAL) {
            font.variant = fontVariant;
            continue;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var sizes = matched[2].split(/\//);
      font.size = parseFloat(sizes[0]);

      if (isNaN(font.size)) {
        if (!silent) {
          console.warn("invalid font:".concat(value));
        }

        return undefined;
      }

      if (sizes.length > 1) {
        font.lineHeight = _LineHeight.LineHeight.of(sizes[1], silent);

        if (!font.lineHeight) {
          if (!silent) {
            console.warn("invalid font:".concat(value));
          }

          return undefined;
        }
      }

      font.family = matched[3].trim();
      return font;
    }
    /**
     * The style property sets whether a font should be styled with a normal, italic, or oblique face from its
     * font-family.
     */

  }]);

  /**
   * Constructs and initializes a Font object with given arguments.
   * @param style see style definition.
   * @param variant see variant definition.
   * @param weight see weight definition.
   * @param size see size definition.
   * @param lineHeight see lineHeight definition.
   * @param family see family definition.
   */
  function Font(style, variant, weight, size, lineHeight, family) {
    _classCallCheck(this, Font);

    this.style = void 0;
    this.variant = void 0;
    this.weight = void 0;
    this.size = void 0;
    this.lineHeight = void 0;
    this.family = void 0;
    this.style = style || FontStyle.NORMAL;
    this.variant = variant || FontVariant.NORMAL;
    this.weight = weight || FontWeight.NORMAL;
    this.size = size || 16;
    this.lineHeight = lineHeight;
    this.family = family;
  }
  /**
   * Returns a string representation of this Font object.
   * @returns a string representation of this object.
   */


  _createClass(Font, [{
    key: "toString",
    value: function toString() {
      var font = [this.style || FontStyle.NORMAL, this.variant || FontVariant.NORMAL, this.weight || FontWeight.NORMAL, this.lineHeight ? this.size + 'px/' + this.lineHeight.toString() : this.size + 'px', this.family || Font.DEFAULT_FONT_FAMILY];
      return font.join(' ');
    }
    /**
     * Calculate the text width with current font.
     * @returns Width of text with current font.
     */

  }, {
    key: "measureTextWidth",
    value: function measureTextWidth(text) {
      return _LayoutUtils.LayoutUtils.measureTextWidth(text, this);
    }
    /**
     * Creates a new Font with the same style, width, size, variant, line height and font family.
     * @returns a clone of this instance.
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Font(this.style, this.variant, this.weight, this.size, this.lineHeight, this.family);
    }
  }]);

  return Font;
}();

exports.Font = Font;
Font.DEFAULT_FONT_FAMILY = 'sans-serif';