import { FunctionParser } from '../parser/FunctionParser';

const REG_VALUE = /^([0-9]+|[0-9]+\.[0-9]*|[0-9]*\.[0-9]+)%?$/;
const REG_HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

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
export class Color {
  public static readonly TRANSPARENT = Color.of('#0000');
  public static readonly ALICEBLUE = Color.of('#F0F8FF')!;
  public static readonly ANTIQUEWHITE = Color.of('#FAEBD7')!;
  public static readonly AQUA = Color.of('#00FFFF')!;
  public static readonly AQUAMARINE = Color.of('#7FFFD4')!;
  public static readonly AZURE = Color.of('#F0FFFF')!;
  public static readonly BEIGE = Color.of('#F5F5DC')!;
  public static readonly BISQUE = Color.of('#FFE4C4')!;
  public static readonly BLACK = Color.of('#000000')!;
  public static readonly BLANCHEDALMOND = Color.of('#FFEBCD')!;
  public static readonly BLUE = Color.of('#0000FF')!;
  public static readonly BLUEVIOLET = Color.of('#8A2BE2')!;
  public static readonly BROWN = Color.of('#A52A2A')!;
  public static readonly BURLYWOOD = Color.of('#DEB887')!;
  public static readonly CADETBLUE = Color.of('#5F9EA0')!;
  public static readonly CHARTREUSE = Color.of('#7FFF00')!;
  public static readonly CHOCOLATE = Color.of('#D2691E')!;
  public static readonly CORAL = Color.of('#FF7F50')!;
  public static readonly CORNFLOWERBLUE = Color.of('#6495ED')!;
  public static readonly CORNSILK = Color.of('#FFF8DC')!;
  public static readonly CRIMSON = Color.of('#DC143C')!;
  public static readonly CYAN = Color.of('#00FFFF')!;
  public static readonly DARKBLUE = Color.of('#00008B')!;
  public static readonly DARKCYAN = Color.of('#008B8B')!;
  public static readonly DARKGOLDENROD = Color.of('#B8860B')!;
  public static readonly DARKGRAY = Color.of('#A9A9A9')!;
  public static readonly DARKGREY = Color.of('#A9A9A9')!;
  public static readonly DARKGREEN = Color.of('#006400')!;
  public static readonly DARKKHAKI = Color.of('#BDB76B')!;
  public static readonly DARKMAGENTA = Color.of('#8B008B')!;
  public static readonly DARKOLIVEGREEN = Color.of('#556B2F')!;
  public static readonly DARKORANGE = Color.of('#FF8C00')!;
  public static readonly DARKORCHID = Color.of('#9932CC')!;
  public static readonly DARKRED = Color.of('#8B0000')!;
  public static readonly DARKSALMON = Color.of('#E9967A')!;
  public static readonly DARKSEAGREEN = Color.of('#8FBC8F')!;
  public static readonly DARKSLATEBLUE = Color.of('#483D8B')!;
  public static readonly DARKSLATEGRAY = Color.of('#2F4F4F')!;
  public static readonly DARKSLATEGREY = Color.of('#2F4F4F')!;
  public static readonly DARKTURQUOISE = Color.of('#00CED1')!;
  public static readonly DARKVIOLET = Color.of('#9400D3')!;
  public static readonly DEEPPINK = Color.of('#FF1493')!;
  public static readonly DEEPSKYBLUE = Color.of('#00BFFF')!;
  public static readonly DIMGRAY = Color.of('#696969')!;
  public static readonly DIMGREY = Color.of('#696969')!;
  public static readonly DODGERBLUE = Color.of('#1E90FF')!;
  public static readonly FIREBRICK = Color.of('#B22222')!;
  public static readonly FLORALWHITE = Color.of('#FFFAF0')!;
  public static readonly FORESTGREEN = Color.of('#228B22')!;
  public static readonly FUCHSIA = Color.of('#FF00FF')!;
  public static readonly GAINSBORO = Color.of('#DCDCDC')!;
  public static readonly GHOSTWHITE = Color.of('#F8F8FF')!;
  public static readonly GOLD = Color.of('#FFD700')!;
  public static readonly GOLDENROD = Color.of('#DAA520')!;
  public static readonly GRAY = Color.of('#808080')!;
  public static readonly GREY = Color.of('#808080')!;
  public static readonly GREEN = Color.of('#008000')!;
  public static readonly GREENYELLOW = Color.of('#ADFF2F')!;
  public static readonly HONEYDEW = Color.of('#F0FFF0')!;
  public static readonly HOTPINK = Color.of('#FF69B4')!;
  public static readonly INDIANRED = Color.of('#CD5C5C')!;
  public static readonly INDIGO = Color.of('#4B0082')!;
  public static readonly IVORY = Color.of('#FFFFF0')!;
  public static readonly KHAKI = Color.of('#F0E68C')!;
  public static readonly LAVENDER = Color.of('#E6E6FA')!;
  public static readonly LAVENDERBLUSH = Color.of('#FFF0F5')!;
  public static readonly LAWNGREEN = Color.of('#7CFC00')!;
  public static readonly LEMONCHIFFON = Color.of('#FFFACD')!;
  public static readonly LIGHTBLUE = Color.of('#ADD8E6')!;
  public static readonly LIGHTCORAL = Color.of('#F08080')!;
  public static readonly LIGHTCYAN = Color.of('#E0FFFF')!;
  public static readonly LIGHTGOLDENRODYELLOW = Color.of('#FAFAD2')!;
  public static readonly LIGHTGRAY = Color.of('#D3D3D3')!;
  public static readonly LIGHTGREY = Color.of('#D3D3D3')!;
  public static readonly LIGHTGREEN = Color.of('#90EE90')!;
  public static readonly LIGHTPINK = Color.of('#FFB6C1')!;
  public static readonly LIGHTSALMON = Color.of('#FFA07A')!;
  public static readonly LIGHTSEAGREEN = Color.of('#20B2AA')!;
  public static readonly LIGHTSKYBLUE = Color.of('#87CEFA')!;
  public static readonly LIGHTSLATEGRAY = Color.of('#778899')!;
  public static readonly LIGHTSLATEGREY = Color.of('#778899')!;
  public static readonly LIGHTSTEELBLUE = Color.of('#B0C4DE')!;
  public static readonly LIGHTYELLOW = Color.of('#FFFFE0')!;
  public static readonly LIME = Color.of('#00FF00')!;
  public static readonly LIMEGREEN = Color.of('#32CD32')!;
  public static readonly LINEN = Color.of('#FAF0E6')!;
  public static readonly MAGENTA = Color.of('#FF00FF')!;
  public static readonly MAROON = Color.of('#800000')!;
  public static readonly MEDIUMAQUAMARINE = Color.of('#66CDAA')!;
  public static readonly MEDIUMBLUE = Color.of('#0000CD')!;
  public static readonly MEDIUMORCHID = Color.of('#BA55D3')!;
  public static readonly MEDIUMPURPLE = Color.of('#9370DB')!;
  public static readonly MEDIUMSEAGREEN = Color.of('#3CB371')!;
  public static readonly MEDIUMSLATEBLUE = Color.of('#7B68EE')!;
  public static readonly MEDIUMSPRINGGREEN = Color.of('#00FA9A')!;
  public static readonly MEDIUMTURQUOISE = Color.of('#48D1CC')!;
  public static readonly MEDIUMVIOLETRED = Color.of('#C71585')!;
  public static readonly MIDNIGHTBLUE = Color.of('#191970')!;
  public static readonly MINTCREAM = Color.of('#F5FFFA')!;
  public static readonly MISTYROSE = Color.of('#FFE4E1')!;
  public static readonly MOCCASIN = Color.of('#FFE4B5')!;
  public static readonly NAVAJOWHITE = Color.of('#FFDEAD')!;
  public static readonly NAVY = Color.of('#000080')!;
  public static readonly OLDLACE = Color.of('#FDF5E6')!;
  public static readonly OLIVE = Color.of('#808000')!;
  public static readonly OLIVEDRAB = Color.of('#6B8E23')!;
  public static readonly ORANGE = Color.of('#FFA500')!;
  public static readonly ORANGERED = Color.of('#FF4500')!;
  public static readonly ORCHID = Color.of('#DA70D6')!;
  public static readonly PALEGOLDENROD = Color.of('#EEE8AA')!;
  public static readonly PALEGREEN = Color.of('#98FB98')!;
  public static readonly PALETURQUOISE = Color.of('#AFEEEE')!;
  public static readonly PALEVIOLETRED = Color.of('#DB7093')!;
  public static readonly PAPAYAWHIP = Color.of('#FFEFD5')!;
  public static readonly PEACHPUFF = Color.of('#FFDAB9')!;
  public static readonly PERU = Color.of('#CD853F')!;
  public static readonly PINK = Color.of('#FFC0CB')!;
  public static readonly PLUM = Color.of('#DDA0DD')!;
  public static readonly POWDERBLUE = Color.of('#B0E0E6')!;
  public static readonly PURPLE = Color.of('#800080')!;
  public static readonly REBECCAPURPLE = Color.of('#663399')!;
  public static readonly RED = Color.of('#FF0000')!;
  public static readonly ROSYBROWN = Color.of('#BC8F8F')!;
  public static readonly ROYALBLUE = Color.of('#4169E1')!;
  public static readonly SADDLEBROWN = Color.of('#8B4513')!;
  public static readonly SALMON = Color.of('#FA8072')!;
  public static readonly SANDYBROWN = Color.of('#F4A460')!;
  public static readonly SEAGREEN = Color.of('#2E8B57')!;
  public static readonly SEASHELL = Color.of('#FFF5EE')!;
  public static readonly SIENNA = Color.of('#A0522D')!;
  public static readonly SILVER = Color.of('#C0C0C0')!;
  public static readonly SKYBLUE = Color.of('#87CEEB')!;
  public static readonly SLATEBLUE = Color.of('#6A5ACD')!;
  public static readonly SLATEGRAY = Color.of('#708090')!;
  public static readonly SLATEGREY = Color.of('#708090')!;
  public static readonly SNOW = Color.of('#FFFAFA')!;
  public static readonly SPRINGGREEN = Color.of('#00FF7F')!;
  public static readonly STEELBLUE = Color.of('#4682B4')!;
  public static readonly TAN = Color.of('#D2B48C')!;
  public static readonly TEAL = Color.of('#008080')!;
  public static readonly THISTLE = Color.of('#D8BFD8')!;
  public static readonly TOMATO = Color.of('#FF6347')!;
  public static readonly TURQUOISE = Color.of('#40E0D0')!;
  public static readonly VIOLET = Color.of('#EE82EE')!;
  public static readonly WHEAT = Color.of('#F5DEB3')!;
  public static readonly WHITE = Color.of('#FFFFFF')!;
  public static readonly WHITESMOKE = Color.of('#F5F5F5')!;
  public static readonly YELLOW = Color.of('#FFFF00')!;
  public static readonly YELLOWGREEN = Color.of('#9ACD32')!;
  public static readonly NONE = Color.of('#FFFF00')!;

  /**
   * Convert a string to a Color object.
   * @param value a string present a color, see the spec above for format.
   * @param [silent] if ture, ignore warning for an invalid value.
   * @returns A color object for valid value, otherwise returns undefined.
   */
  public static of(value: string, silent: boolean = false): Color | undefined {
    // Hex value.
    if (REG_HEX.test(value)) {
      return this.fromHex(value, silent);
    }

    // Checks pre-defined color name.
    const colorName = value.toUpperCase();
    if (COLOR_NAMES[colorName]) {
      return COLOR_NAMES[colorName];
    }

    const func = FunctionParser.parse(value, silent);
    if (!func) {
      if (!silent) {
        console.warn('invalid color value:' + value);
      }
      return undefined;
    }

    const funcnName = func.name.toLowerCase();
    if (funcnName === 'rgb' && func.arguments.length === 3) {
      const r = this.parseColorValue(func.arguments[0], 255);
      const g = this.parseColorValue(func.arguments[1], 255);
      const b = this.parseColorValue(func.arguments[2], 255);
      if (r === undefined || g === undefined || b === undefined) {
        console.warn('invalid color value:' + value);
        return undefined;
      }
      return new Color(r, g, b, 1);
    } else if (funcnName === 'rgba' && func.arguments.length === 4) {
      const r = this.parseColorValue(func.arguments[0], 255);
      const g = this.parseColorValue(func.arguments[1], 255);
      const b = this.parseColorValue(func.arguments[2], 255);
      const a = this.parseColorValue(func.arguments[3], 1);
      if (r === undefined || g === undefined || b === undefined || a === undefined) {
        console.warn('invalid color value:' + value);
        return undefined;
      }
      return new Color(r, g, b, a);
    }

    if (!silent) {
      console.warn('invalid color value:' + value);
    }
    return undefined;
  }

  private static parseColorValue(value: string, base: number): number | undefined {
    if (!REG_VALUE.test(value)) {
      return undefined;
    }
    if (value.endsWith('%')) {
      return (parseFloat(value) * base) / 100;
    } else {
      return parseFloat(value);
    }
  }

  private static fromHex(hex: string, silent: boolean): Color {
    if (hex.length === 4) {
      return new Color(
        parseInt(hex[1], 16) * 16 + parseInt(hex[1], 16),
        parseInt(hex[2], 16) * 16 + parseInt(hex[2], 16),
        parseInt(hex[3], 16) * 16 + parseInt(hex[3], 16),
        1
      );
    } else if (hex.length === 5) {
      return new Color(
        parseInt(hex[1], 16) * 16 + parseInt(hex[1], 16),
        parseInt(hex[2], 16) * 16 + parseInt(hex[2], 16),
        parseInt(hex[3], 16) * 16 + parseInt(hex[3], 16),
        (parseInt(hex[4], 16) * 16 + parseInt(hex[4], 16)) / 255
      );
    } else if (hex.length === 7) {
      return new Color(
        parseInt(hex.substring(1, 3), 16),
        parseInt(hex.substring(3, 5), 16),
        parseInt(hex.substring(5, 7), 16),
        1
      );
    } else if (hex.length === 9) {
      return new Color(
        parseInt(hex.substring(1, 3), 16),
        parseInt(hex.substring(3, 5), 16),
        parseInt(hex.substring(5, 7), 16),
        parseInt(hex.substring(7, 9), 16) / 255
      );
    }
    if (!silent) {
      console.warn('invalid color value:' + hex);
    }
    return undefined;
  }

  /**
   *  The color red. In the default sRGB space.
   */
  public readonly r: number = 0;
  /**
   *  The color green. In the default sRGB space.
   */
  public readonly g: number = 0;
  /**
   *  The color blue. In the default sRGB space.
   */
  public readonly b: number = 0;
  /**
   * The alpha value. This is in the range 0.0f - 1.0f, and the default value is 1.
   */
  public readonly a: number = 1;

  /**
   * Constructs and initializes a color object with given arguments of sRGB and alpha.
   * @param r The color red, normalizes to 0 if it is smaller than 0, 255 if it is bigger than 255.
   * @param g The color green, normalizes to 0 if it is smaller than 0, 255 if it is bigger than 255.
   * @param b The color blue, normalizes to 0 if it is smaller than 0, 255 if it is bigger than 255.
   * @param a The alpha value, normalizes to 0 if it is smaller than 0, 1 if it is bigger than 1.
   */
  constructor(r: number, g: number, b: number, a: number = 1) {
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
  public equals(that: Color): boolean {
    return this.r === that.r && this.g === that.g && this.b === that.b && this.a === that.a;
  }

  /**
   * Creates a new Color object with the same sRGB value as this object.
   * @returns a clone of this instance
   */
  public clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /**
   * Returns a string representation of this Color object.
   * @returns a string representation of this Color object
   */
  public toString(): string {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
  }
}

const COLOR_NAMES: { [key: string]: Color } = {
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
