function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { FunctionParser } from '../parser/FunctionParser';
var REG_VALUE = /^([0-9]+|[0-9]+\.[0-9]*|[0-9]*\.[0-9]+)%?$/;
var REG_HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
/**
 * This class represents an immutable color value. It uses the sRGB (standard Red-Green-Blue) system, along with an
 * alpha value ranging from transparent (0.0f) and opaque (1.0f). Further information about sRGB can be found at
 * <a href="http://www.w3.org/pub/WWW/Graphics/Color/sRGB.html">http://www.w3.org/pub/WWW/Graphics/Color/sRGB.html</a>.
 *
 * Static method Color.of can be used to parse a string to a Color object, and it supports 4 types of format:
 * 1. hex value starts from '#'
 *    1. Hexadecimal notation: ```#RRGGBB[AA]```: R (red), G (green), B (blue), and A (alpha) are hexadecimal characters (0–9, A–F). A is optional. For example, ```#ff0000``` is equivalent to ```#ff0000ff```.
 *    1. Hexadecimal notation: ```#RGB[A]```: R (red), G (green), B (blue), and A (alpha) are hexadecimal characters (0–9, A–F). A is optional. The three-digit notation (#RGB) is a shorter version of the six-digit form (#RRGGBB). For example, #f09 is the same color as #ff0099. Likewise, the four-digit RGB notation (#RGBA) is a shorter version of the eight-digit form (#RRGGBBAA). For example, ```#0f38``` is the same color as ```#00ff3388```.
 * ```typescript
 * const white = Color.of('#fff');
 * const black = Color.of('#000000ff');
 * ```
 * 1. named color: there are 150 pre-defined named colors, also see <a href='https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords'>https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords</a>.
 * ```typescript
 * const white1 = Color.WHITE;
 * const white2 = Color.of('white');
 * ```
 * 1. Functional notation: rgb[a](R, G, B[, A]), R (red), G (green), and B (blue) can be either <number>s or <percentage>s, where the number 255 corresponds to 100%. A (alpha) can be a <number> between 0 and 1, or a <percentage>, where the number 1 corresponds to 100% (full opacity).
 * ```typescript
 * const white1 = Color.of('rgb(255, 255, 255)');
 * const white2 = Color.of('rgba(100%, 255, 255, 1)');
 * ```
 */

export var Color =
/*#__PURE__*/
function () {
  _createClass(Color, null, [{
    key: "of",

    /**
     * Convert a string to a Color object.
     * @param value a string present a color, see the spec above for format.
     * @param [silent] if ture, ignore warning for an invalid value.
     * @returns A color object for valid value, otherwise returns undefined.
     */
    value: function of(value) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      // Hex value.
      if (REG_HEX.test(value)) {
        return this.fromHex(value, silent);
      } // Checks pre-defined color name.


      var colorName = value.toUpperCase();

      if (COLOR_NAMES[colorName]) {
        return COLOR_NAMES[colorName];
      }

      var func = FunctionParser.parse(value, silent);

      if (!func) {
        if (!silent) {
          console.warn('invalid color value:' + value);
        }

        return undefined;
      }

      var funcnName = func.name.toLowerCase();

      if (funcnName === 'rgb' && func.arguments.length === 3) {
        var r = this.parseColorValue(func.arguments[0], 255);
        var g = this.parseColorValue(func.arguments[1], 255);
        var b = this.parseColorValue(func.arguments[2], 255);

        if (r === undefined || g === undefined || b === undefined) {
          console.warn('invalid color value:' + value);
          return undefined;
        }

        return new Color(r, g, b, 1);
      } else if (funcnName === 'rgba' && func.arguments.length === 4) {
        var _r = this.parseColorValue(func.arguments[0], 255);

        var _g = this.parseColorValue(func.arguments[1], 255);

        var _b = this.parseColorValue(func.arguments[2], 255);

        var a = this.parseColorValue(func.arguments[3], 1);

        if (_r === undefined || _g === undefined || _b === undefined || a === undefined) {
          console.warn('invalid color value:' + value);
          return undefined;
        }

        return new Color(_r, _g, _b, a);
      }

      if (!silent) {
        console.warn('invalid color value:' + value);
      }

      return undefined;
    }
  }, {
    key: "parseColorValue",
    value: function parseColorValue(value, base) {
      if (!REG_VALUE.test(value)) {
        return undefined;
      }

      if (value.endsWith('%')) {
        return parseFloat(value) * base / 100;
      } else {
        return parseFloat(value);
      }
    }
  }, {
    key: "fromHex",
    value: function fromHex(hex, silent) {
      if (hex.length === 4) {
        return new Color(parseInt(hex[1], 16) * 16 + parseInt(hex[1], 16), parseInt(hex[2], 16) * 16 + parseInt(hex[2], 16), parseInt(hex[3], 16) * 16 + parseInt(hex[3], 16), 1);
      } else if (hex.length === 5) {
        return new Color(parseInt(hex[1], 16) * 16 + parseInt(hex[1], 16), parseInt(hex[2], 16) * 16 + parseInt(hex[2], 16), parseInt(hex[3], 16) * 16 + parseInt(hex[3], 16), (parseInt(hex[4], 16) * 16 + parseInt(hex[4], 16)) / 255);
      } else if (hex.length === 7) {
        return new Color(parseInt(hex.substring(1, 3), 16), parseInt(hex.substring(3, 5), 16), parseInt(hex.substring(5, 7), 16), 1);
      } else if (hex.length === 9) {
        return new Color(parseInt(hex.substring(1, 3), 16), parseInt(hex.substring(3, 5), 16), parseInt(hex.substring(5, 7), 16), parseInt(hex.substring(7, 9), 16) / 255);
      }

      if (!silent) {
        console.warn('invalid color value:' + hex);
      }

      return undefined;
    }
    /**
     *  The color red. In the default sRGB space.
     */

  }]);

  /**
   * Constructs and initializes a color object with given arguments of sRGB and alpha.
   * @param r The color red, normalizes to 0 if it is smaller than 0, 255 if it is bigger than 255.
   * @param g The color green, normalizes to 0 if it is smaller than 0, 255 if it is bigger than 255.
   * @param b The color blue, normalizes to 0 if it is smaller than 0, 255 if it is bigger than 255.
   * @param a The alpha value, normalizes to 0 if it is smaller than 0, 1 if it is bigger than 1.
   */
  function Color(r, g, b) {
    var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    _classCallCheck(this, Color);

    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 1;
    this.r = Math.min(255, Math.max(0, r));
    this.g = Math.min(255, Math.max(0, g));
    this.b = Math.min(255, Math.max(0, b));
    this.a = Math.min(1, Math.max(0, a));
  }
  /**
   * Compare to the other color object.
   * @param that the object compare with
   * @returns true if equals
   */


  _createClass(Color, [{
    key: "equals",
    value: function equals(that) {
      return this.r === that.r && this.g === that.g && this.b === that.b && this.a === that.a;
    }
    /**
     * Creates a new Color object with the same sRGB value as this object.
     * @returns a clone of this instance
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Color(this.r, this.g, this.b, this.a);
    }
    /**
     * Returns a string representation of this Color object.
     * @returns a string representation of this Color object
     */

  }, {
    key: "toString",
    value: function toString() {
      return "rgba(".concat(this.r, ",").concat(this.g, ",").concat(this.b, ",").concat(this.a, ")");
    }
  }]);

  return Color;
}();
Color.TRANSPARENT = Color.of('#0000');
Color.ALICEBLUE = Color.of('#F0F8FF');
Color.ANTIQUEWHITE = Color.of('#FAEBD7');
Color.AQUA = Color.of('#00FFFF');
Color.AQUAMARINE = Color.of('#7FFFD4');
Color.AZURE = Color.of('#F0FFFF');
Color.BEIGE = Color.of('#F5F5DC');
Color.BISQUE = Color.of('#FFE4C4');
Color.BLACK = Color.of('#000000');
Color.BLANCHEDALMOND = Color.of('#FFEBCD');
Color.BLUE = Color.of('#0000FF');
Color.BLUEVIOLET = Color.of('#8A2BE2');
Color.BROWN = Color.of('#A52A2A');
Color.BURLYWOOD = Color.of('#DEB887');
Color.CADETBLUE = Color.of('#5F9EA0');
Color.CHARTREUSE = Color.of('#7FFF00');
Color.CHOCOLATE = Color.of('#D2691E');
Color.CORAL = Color.of('#FF7F50');
Color.CORNFLOWERBLUE = Color.of('#6495ED');
Color.CORNSILK = Color.of('#FFF8DC');
Color.CRIMSON = Color.of('#DC143C');
Color.CYAN = Color.of('#00FFFF');
Color.DARKBLUE = Color.of('#00008B');
Color.DARKCYAN = Color.of('#008B8B');
Color.DARKGOLDENROD = Color.of('#B8860B');
Color.DARKGRAY = Color.of('#A9A9A9');
Color.DARKGREY = Color.of('#A9A9A9');
Color.DARKGREEN = Color.of('#006400');
Color.DARKKHAKI = Color.of('#BDB76B');
Color.DARKMAGENTA = Color.of('#8B008B');
Color.DARKOLIVEGREEN = Color.of('#556B2F');
Color.DARKORANGE = Color.of('#FF8C00');
Color.DARKORCHID = Color.of('#9932CC');
Color.DARKRED = Color.of('#8B0000');
Color.DARKSALMON = Color.of('#E9967A');
Color.DARKSEAGREEN = Color.of('#8FBC8F');
Color.DARKSLATEBLUE = Color.of('#483D8B');
Color.DARKSLATEGRAY = Color.of('#2F4F4F');
Color.DARKSLATEGREY = Color.of('#2F4F4F');
Color.DARKTURQUOISE = Color.of('#00CED1');
Color.DARKVIOLET = Color.of('#9400D3');
Color.DEEPPINK = Color.of('#FF1493');
Color.DEEPSKYBLUE = Color.of('#00BFFF');
Color.DIMGRAY = Color.of('#696969');
Color.DIMGREY = Color.of('#696969');
Color.DODGERBLUE = Color.of('#1E90FF');
Color.FIREBRICK = Color.of('#B22222');
Color.FLORALWHITE = Color.of('#FFFAF0');
Color.FORESTGREEN = Color.of('#228B22');
Color.FUCHSIA = Color.of('#FF00FF');
Color.GAINSBORO = Color.of('#DCDCDC');
Color.GHOSTWHITE = Color.of('#F8F8FF');
Color.GOLD = Color.of('#FFD700');
Color.GOLDENROD = Color.of('#DAA520');
Color.GRAY = Color.of('#808080');
Color.GREY = Color.of('#808080');
Color.GREEN = Color.of('#008000');
Color.GREENYELLOW = Color.of('#ADFF2F');
Color.HONEYDEW = Color.of('#F0FFF0');
Color.HOTPINK = Color.of('#FF69B4');
Color.INDIANRED = Color.of('#CD5C5C');
Color.INDIGO = Color.of('#4B0082');
Color.IVORY = Color.of('#FFFFF0');
Color.KHAKI = Color.of('#F0E68C');
Color.LAVENDER = Color.of('#E6E6FA');
Color.LAVENDERBLUSH = Color.of('#FFF0F5');
Color.LAWNGREEN = Color.of('#7CFC00');
Color.LEMONCHIFFON = Color.of('#FFFACD');
Color.LIGHTBLUE = Color.of('#ADD8E6');
Color.LIGHTCORAL = Color.of('#F08080');
Color.LIGHTCYAN = Color.of('#E0FFFF');
Color.LIGHTGOLDENRODYELLOW = Color.of('#FAFAD2');
Color.LIGHTGRAY = Color.of('#D3D3D3');
Color.LIGHTGREY = Color.of('#D3D3D3');
Color.LIGHTGREEN = Color.of('#90EE90');
Color.LIGHTPINK = Color.of('#FFB6C1');
Color.LIGHTSALMON = Color.of('#FFA07A');
Color.LIGHTSEAGREEN = Color.of('#20B2AA');
Color.LIGHTSKYBLUE = Color.of('#87CEFA');
Color.LIGHTSLATEGRAY = Color.of('#778899');
Color.LIGHTSLATEGREY = Color.of('#778899');
Color.LIGHTSTEELBLUE = Color.of('#B0C4DE');
Color.LIGHTYELLOW = Color.of('#FFFFE0');
Color.LIME = Color.of('#00FF00');
Color.LIMEGREEN = Color.of('#32CD32');
Color.LINEN = Color.of('#FAF0E6');
Color.MAGENTA = Color.of('#FF00FF');
Color.MAROON = Color.of('#800000');
Color.MEDIUMAQUAMARINE = Color.of('#66CDAA');
Color.MEDIUMBLUE = Color.of('#0000CD');
Color.MEDIUMORCHID = Color.of('#BA55D3');
Color.MEDIUMPURPLE = Color.of('#9370DB');
Color.MEDIUMSEAGREEN = Color.of('#3CB371');
Color.MEDIUMSLATEBLUE = Color.of('#7B68EE');
Color.MEDIUMSPRINGGREEN = Color.of('#00FA9A');
Color.MEDIUMTURQUOISE = Color.of('#48D1CC');
Color.MEDIUMVIOLETRED = Color.of('#C71585');
Color.MIDNIGHTBLUE = Color.of('#191970');
Color.MINTCREAM = Color.of('#F5FFFA');
Color.MISTYROSE = Color.of('#FFE4E1');
Color.MOCCASIN = Color.of('#FFE4B5');
Color.NAVAJOWHITE = Color.of('#FFDEAD');
Color.NAVY = Color.of('#000080');
Color.OLDLACE = Color.of('#FDF5E6');
Color.OLIVE = Color.of('#808000');
Color.OLIVEDRAB = Color.of('#6B8E23');
Color.ORANGE = Color.of('#FFA500');
Color.ORANGERED = Color.of('#FF4500');
Color.ORCHID = Color.of('#DA70D6');
Color.PALEGOLDENROD = Color.of('#EEE8AA');
Color.PALEGREEN = Color.of('#98FB98');
Color.PALETURQUOISE = Color.of('#AFEEEE');
Color.PALEVIOLETRED = Color.of('#DB7093');
Color.PAPAYAWHIP = Color.of('#FFEFD5');
Color.PEACHPUFF = Color.of('#FFDAB9');
Color.PERU = Color.of('#CD853F');
Color.PINK = Color.of('#FFC0CB');
Color.PLUM = Color.of('#DDA0DD');
Color.POWDERBLUE = Color.of('#B0E0E6');
Color.PURPLE = Color.of('#800080');
Color.REBECCAPURPLE = Color.of('#663399');
Color.RED = Color.of('#FF0000');
Color.ROSYBROWN = Color.of('#BC8F8F');
Color.ROYALBLUE = Color.of('#4169E1');
Color.SADDLEBROWN = Color.of('#8B4513');
Color.SALMON = Color.of('#FA8072');
Color.SANDYBROWN = Color.of('#F4A460');
Color.SEAGREEN = Color.of('#2E8B57');
Color.SEASHELL = Color.of('#FFF5EE');
Color.SIENNA = Color.of('#A0522D');
Color.SILVER = Color.of('#C0C0C0');
Color.SKYBLUE = Color.of('#87CEEB');
Color.SLATEBLUE = Color.of('#6A5ACD');
Color.SLATEGRAY = Color.of('#708090');
Color.SLATEGREY = Color.of('#708090');
Color.SNOW = Color.of('#FFFAFA');
Color.SPRINGGREEN = Color.of('#00FF7F');
Color.STEELBLUE = Color.of('#4682B4');
Color.TAN = Color.of('#D2B48C');
Color.TEAL = Color.of('#008080');
Color.THISTLE = Color.of('#D8BFD8');
Color.TOMATO = Color.of('#FF6347');
Color.TURQUOISE = Color.of('#40E0D0');
Color.VIOLET = Color.of('#EE82EE');
Color.WHEAT = Color.of('#F5DEB3');
Color.WHITE = Color.of('#FFFFFF');
Color.WHITESMOKE = Color.of('#F5F5F5');
Color.YELLOW = Color.of('#FFFF00');
Color.YELLOWGREEN = Color.of('#9ACD32');
Color.NONE = Color.of('#FFFF00');
var COLOR_NAMES = {
  TRANSPARENT: Color.TRANSPARENT,
  ALICEBLUE: Color.ALICEBLUE,
  ANTIQUEWHITE: Color.ANTIQUEWHITE,
  AQUA: Color.AQUA,
  AQUAMARINE: Color.AQUAMARINE,
  AZURE: Color.AZURE,
  BEIGE: Color.BEIGE,
  BISQUE: Color.BISQUE,
  BLACK: Color.BLACK,
  BLANCHEDALMOND: Color.BLANCHEDALMOND,
  BLUE: Color.BLUE,
  BLUEVIOLET: Color.BLUEVIOLET,
  BROWN: Color.BROWN,
  BURLYWOOD: Color.BURLYWOOD,
  CADETBLUE: Color.CADETBLUE,
  CHARTREUSE: Color.CHARTREUSE,
  CHOCOLATE: Color.CHOCOLATE,
  CORAL: Color.CORAL,
  CORNFLOWERBLUE: Color.CORNFLOWERBLUE,
  CORNSILK: Color.CORNSILK,
  CRIMSON: Color.CRIMSON,
  CYAN: Color.CYAN,
  DARKBLUE: Color.DARKBLUE,
  DARKCYAN: Color.DARKCYAN,
  DARKGOLDENROD: Color.DARKGOLDENROD,
  DARKGRAY: Color.DARKGRAY,
  DARKGREY: Color.DARKGREY,
  DARKGREEN: Color.DARKGREEN,
  DARKKHAKI: Color.DARKKHAKI,
  DARKMAGENTA: Color.DARKMAGENTA,
  DARKOLIVEGREEN: Color.DARKOLIVEGREEN,
  DARKORANGE: Color.DARKORANGE,
  DARKORCHID: Color.DARKORCHID,
  DARKRED: Color.DARKRED,
  DARKSALMON: Color.DARKSALMON,
  DARKSEAGREEN: Color.DARKSEAGREEN,
  DARKSLATEBLUE: Color.DARKSLATEBLUE,
  DARKSLATEGRAY: Color.DARKSLATEGRAY,
  DARKSLATEGREY: Color.DARKSLATEGREY,
  DARKTURQUOISE: Color.DARKTURQUOISE,
  DARKVIOLET: Color.DARKVIOLET,
  DEEPPINK: Color.DEEPPINK,
  DEEPSKYBLUE: Color.DEEPSKYBLUE,
  DIMGRAY: Color.DIMGRAY,
  DIMGREY: Color.DIMGREY,
  DODGERBLUE: Color.DODGERBLUE,
  FIREBRICK: Color.FIREBRICK,
  FLORALWHITE: Color.FLORALWHITE,
  FORESTGREEN: Color.FORESTGREEN,
  FUCHSIA: Color.FUCHSIA,
  GAINSBORO: Color.GAINSBORO,
  GHOSTWHITE: Color.GHOSTWHITE,
  GOLD: Color.GOLD,
  GOLDENROD: Color.GOLDENROD,
  GRAY: Color.GRAY,
  GREY: Color.GREY,
  GREEN: Color.GREEN,
  GREENYELLOW: Color.GREENYELLOW,
  HONEYDEW: Color.HONEYDEW,
  HOTPINK: Color.HOTPINK,
  INDIANRED: Color.INDIANRED,
  INDIGO: Color.INDIGO,
  IVORY: Color.IVORY,
  KHAKI: Color.KHAKI,
  LAVENDER: Color.LAVENDER,
  LAVENDERBLUSH: Color.LAVENDERBLUSH,
  LAWNGREEN: Color.LAWNGREEN,
  LEMONCHIFFON: Color.LEMONCHIFFON,
  LIGHTBLUE: Color.LIGHTBLUE,
  LIGHTCORAL: Color.LIGHTCORAL,
  LIGHTCYAN: Color.LIGHTCYAN,
  LIGHTGOLDENRODYELLOW: Color.LIGHTGOLDENRODYELLOW,
  LIGHTGRAY: Color.LIGHTGRAY,
  LIGHTGREY: Color.LIGHTGREY,
  LIGHTGREEN: Color.LIGHTGREEN,
  LIGHTPINK: Color.LIGHTPINK,
  LIGHTSALMON: Color.LIGHTSALMON,
  LIGHTSEAGREEN: Color.LIGHTSEAGREEN,
  LIGHTSKYBLUE: Color.LIGHTSKYBLUE,
  LIGHTSLATEGRAY: Color.LIGHTSLATEGRAY,
  LIGHTSLATEGREY: Color.LIGHTSLATEGREY,
  LIGHTSTEELBLUE: Color.LIGHTSTEELBLUE,
  LIGHTYELLOW: Color.LIGHTYELLOW,
  LIME: Color.LIME,
  LIMEGREEN: Color.LIMEGREEN,
  LINEN: Color.LINEN,
  MAGENTA: Color.MAGENTA,
  MAROON: Color.MAROON,
  MEDIUMAQUAMARINE: Color.MEDIUMAQUAMARINE,
  MEDIUMBLUE: Color.MEDIUMBLUE,
  MEDIUMORCHID: Color.MEDIUMORCHID,
  MEDIUMPURPLE: Color.MEDIUMPURPLE,
  MEDIUMSEAGREEN: Color.MEDIUMSEAGREEN,
  MEDIUMSLATEBLUE: Color.MEDIUMSLATEBLUE,
  MEDIUMSPRINGGREEN: Color.MEDIUMSPRINGGREEN,
  MEDIUMTURQUOISE: Color.MEDIUMTURQUOISE,
  MEDIUMVIOLETRED: Color.MEDIUMVIOLETRED,
  MIDNIGHTBLUE: Color.MIDNIGHTBLUE,
  MINTCREAM: Color.MINTCREAM,
  MISTYROSE: Color.MISTYROSE,
  MOCCASIN: Color.MOCCASIN,
  NAVAJOWHITE: Color.NAVAJOWHITE,
  NAVY: Color.NAVY,
  OLDLACE: Color.OLDLACE,
  OLIVE: Color.OLIVE,
  OLIVEDRAB: Color.OLIVEDRAB,
  ORANGE: Color.ORANGE,
  ORANGERED: Color.ORANGERED,
  ORCHID: Color.ORCHID,
  PALEGOLDENROD: Color.PALEGOLDENROD,
  PALEGREEN: Color.PALEGREEN,
  PALETURQUOISE: Color.PALETURQUOISE,
  PALEVIOLETRED: Color.PALEVIOLETRED,
  PAPAYAWHIP: Color.PAPAYAWHIP,
  PEACHPUFF: Color.PEACHPUFF,
  PERU: Color.PERU,
  PINK: Color.PINK,
  PLUM: Color.PLUM,
  POWDERBLUE: Color.POWDERBLUE,
  PURPLE: Color.PURPLE,
  REBECCAPURPLE: Color.REBECCAPURPLE,
  RED: Color.RED,
  ROSYBROWN: Color.ROSYBROWN,
  ROYALBLUE: Color.ROYALBLUE,
  SADDLEBROWN: Color.SADDLEBROWN,
  SALMON: Color.SALMON,
  SANDYBROWN: Color.SANDYBROWN,
  SEAGREEN: Color.SEAGREEN,
  SEASHELL: Color.SEASHELL,
  SIENNA: Color.SIENNA,
  SILVER: Color.SILVER,
  SKYBLUE: Color.SKYBLUE,
  SLATEBLUE: Color.SLATEBLUE,
  SLATEGRAY: Color.SLATEGRAY,
  SLATEGREY: Color.SLATEGREY,
  SNOW: Color.SNOW,
  SPRINGGREEN: Color.SPRINGGREEN,
  STEELBLUE: Color.STEELBLUE,
  TAN: Color.TAN,
  TEAL: Color.TEAL,
  THISTLE: Color.THISTLE,
  TOMATO: Color.TOMATO,
  TURQUOISE: Color.TURQUOISE,
  VIOLET: Color.VIOLET,
  WHEAT: Color.WHEAT,
  WHITE: Color.WHITE,
  WHITESMOKE: Color.WHITESMOKE,
  YELLOW: Color.YELLOW,
  YELLOWGREEN: Color.YELLOWGREEN
};