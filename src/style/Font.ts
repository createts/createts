import { Runtime } from '../Runtime';
import { EnumUtils } from '../utils/EnumUtils';
import { LineHeight } from './LineHeight';

export enum FontStyle {
  NORMAL = 'normal',
  ITALIC = 'italic',
  OBLIQUE = 'oblique'
}

export enum FontVariant {
  NORMAL = 'normal',
  SMALL_CAPS = 'small-caps'
}

export enum FontWeight {
  NORMAL = 'normal',
  BOLD = 'bold',
  BOLDER = 'bolder',
  W100 = '100',
  W200 = '200',
  W300 = '300',
  W400 = '400',
  W500 = '500',
  W600 = '600',
  W700 = '700',
  W800 = '800',
  W900 = '900'
}

/**
 * A regular experssion represents font definition.
 */
const REG_PARTS = /(^|^.*\s+)([0-9]+[a-z]+[^\s]+)($|\s+(.*)$)/;

/**
 * This class represents a font object contains style, width, size, variant, line height and font family.
 */
export class Font {
  /**
   * The default font family, it is mutable
   */
  public static DEFAULT_FONT_FAMILY = 'sans-serif';

  /**
   * Convert a string to a Font object.
   * @param value a string present font, see the definition here
   * <a href='https://developer.mozilla.org/en-US/docs/Web/CSS/font'>
   *   https://developer.mozilla.org/en-US/docs/Web/CSS/font
   * </a>
   * @param [silent] if ture, ignore warning for an invalid value.
   * @returns A Font object for valid value, otherwise returns undefined.
   */
  public static of(value: string, silent: boolean = false): Font | undefined {
    const matched = value.match(REG_PARTS);
    if (!matched) {
      if (!silent) {
        console.warn(`invalid font:${value}`);
      }
      return undefined;
    }
    const font = new Font();
    const styles = matched[1].split(/\s+/);
    for (let style of styles) {
      style = style.toLowerCase();
      if (style === 'normal') {
        continue;
      }
      const fontStyle: FontStyle = EnumUtils.fromString<FontStyle>(
        FontStyle,
        style,
        FontStyle.NORMAL
      );
      if (fontStyle !== FontStyle.NORMAL) {
        font.style = fontStyle;
        continue;
      }
      const fontWeight: FontWeight = EnumUtils.fromString<FontWeight>(
        FontWeight,
        style,
        FontWeight.NORMAL
      );
      if (fontWeight !== FontWeight.NORMAL) {
        font.weight = fontWeight;
        continue;
      }
      const fontVariant: FontVariant = EnumUtils.fromString<FontVariant>(
        FontVariant,
        style,
        FontVariant.NORMAL
      );
      if (fontVariant !== FontVariant.NORMAL) {
        font.variant = fontVariant;
        continue;
      }
    }

    const sizes = matched[2].split(/\//);
    font.size = parseFloat(sizes[0]);
    if (isNaN(font.size)) {
      if (!silent) {
        console.warn(`invalid font:${value}`);
      }
      return undefined;
    }
    if (sizes.length > 1) {
      font.lineHeight = LineHeight.of(sizes[1], silent);
      if (!font.lineHeight) {
        if (!silent) {
          console.warn(`invalid font:${value}`);
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
  public style?: FontStyle;
  /**
   * The variant property is a shorthand for the longhand properties font-variant-caps, font-variant-numeric,
   * font-variant-alternates, font-variant-ligatures, and font-variant-east-asian.
   * Note: this is not supported yet.
   */
  public variant?: FontVariant;
  /**
   * The weight property sets the weight (or boldness) of the font. The weights available depend on the font-family
   * you are using.
   */
  public weight?: FontWeight;
  /**
   * The size property sets the size of the font. This property is also used to compute the size of em, ex, and other
   * relative <length> units.
   */
  public size: number;
  /**
   * The line-height property sets the height of a line box. It's commonly used to set the distance between lines of
   * text. On block-level elements, it specifies the minimum height of line boxes within the element. On non-replaced
   * inline elements, it specifies the height that is used to calculate line box height.
   */
  public lineHeight?: LineHeight;
  /**
   * The family property specifies a prioritized list of one or more font family names and/or generic family names for
   * the selected element.
   */
  public family?: string;

  /**
   * Constructs and initializes a Font object with given arguments.
   * @param style see style definition.
   * @param variant see variant definition.
   * @param weight see weight definition.
   * @param size see size definition.
   * @param lineHeight see lineHeight definition.
   * @param family see family definition.
   */
  constructor(
    style?: FontStyle,
    variant?: FontVariant,
    weight?: FontWeight,
    size?: number,
    lineHeight?: LineHeight,
    family?: string
  ) {
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
  public toString() {
    const font = [
      this.style || FontStyle.NORMAL,
      this.variant || FontVariant.NORMAL,
      this.weight || FontWeight.NORMAL,
      this.lineHeight ? this.size + 'px/' + this.lineHeight.toString() : this.size + 'px',
      this.family || Font.DEFAULT_FONT_FAMILY
    ];
    return font.join(' ');
  }

  /**
   * Calculate the text width with current font.
   * @returns Width of text with current font.
   */
  public measureTextWidth(text: string) {
    return Runtime.get().measureTextWidth(text, this);
  }

  /**
   * Creates a new Font with the same style, width, size, variant, line height and font family.
   * @returns a clone of this instance.
   */
  public clone(): Font {
    return new Font(this.style, this.variant, this.weight, this.size, this.lineHeight, this.family);
  }
}
