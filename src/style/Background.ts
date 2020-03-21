import { BaseValue, BaseValueUnit } from '../base/BaseValue';
import { Color } from '../base/Color';
import { Rect } from '../base/Rect';
import { RoundRect } from '../base/RoundRect';
import { XObject } from '../components/XObject';
import { CSSTokenizer } from '../parser/CSSTokenizer';
import { FunctionParser } from '../parser/FunctionParser';
import { ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { Runtime } from '../Runtime';
import { EnumUtils } from '../utils/EnumUtils';

/**
 * The global tokenizer to split background tokens.
 */
const BG_TOKENIZER = new CSSTokenizer('/');

/**
 * The BackgroundAttachment property sets whether a background image's position is fixed within the
 * viewport, or scrolls with its containing block, see:
 * https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment
 *
 * Currently we only support SCROLL.
 */
export enum BackgroundAttachment {
  SCROLL = 'scroll'
}

interface IBgAttribute<T> {
  clone(): T;
}

/**
 * The background-image property sets one or more background images on an element.
 * See https://developer.mozilla.org/en-US/docs/Web/CSS/background-image
 * Currently we only support image and linear-gradient(beta).
 */
interface IBackgroundImage extends IBgAttribute<IBackgroundImage> {
  getSource(width: number, height: number): any;
  toString(): string;
  destroy(): void;
}

/**
 * The URLSource class implements IBackgroundImage for url function, for example:
 *
 * ```css
 * background-image: url('sample.png');
 * ```
 *
 * The URLSource instance holds the image url and ask ResourceRegistry to download the image form
 * this url and provide it as background image.
 */
class URLSource implements IBackgroundImage {
  /**
   * Creates an URLSource instance from url(<image path>) function.
   * @param args The arguments of url function.
   * @returns an URLSource instance hold this url.
   */
  public static of(args: string[]): URLSource {
    return new URLSource(args[0]);
  }

  /**
   * Image url.
   */
  private url: string;

  /**
   * Construct an URLSource instance with image url.
   * @param url image url.
   */
  constructor(url: string) {
    this.url = url;
    ResourceRegistry.DefaultInstance.add(url, ResourceType.IMAGE);
  }

  /**
   * Returns a drawable object for drawing by the specified with and height.
   * @param width The required width.
   * @param height The required height.
   * @returns The image instance of this url if it is loaded.
   */
  public getSource(width: number, height: number): any {
    return ResourceRegistry.DefaultInstance.get(this.url);
  }

  /**
   * Returns a string representation of this object.
   * @returns a string representation of this object.
   */
  public toString(): string {
    return `url(${this.url})`;
  }

  /**
   * Creates a new URLSource with the same image path.
   * @returns a clone of this instance.
   */
  public clone(): IBackgroundImage {
    return new URLSource(this.url);
  }

  /**
   * A callback function to destroy current instance.
   */
  public destroy() {
    return;
  }
}

/**
 * The LinearGradientSource class implements IBackgroundImage for linear-gradient function, for
 * example:
 *
 * ```css
 * background-image: linear-gradient('sample.png');
 * ```
 *
 * see: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/linearGradient
 */
class LinearGradientSource implements IBackgroundImage {
  /**
   * Create a LinearGradientSource instance form augments of linear-gradient function.
   * @param value the arguments of linear-gradient function.
   * @returns LinearGradientSource instance with given arguments.
   */
  public static of(args: string[]): LinearGradientSource {
    return new LinearGradientSource(args);
  }

  /**
   * the arguments of linear-gradient function.
   */
  private parameters: string[];
  /**
   * The cached canvas with images defined in linear-gradient function.
   */
  private canvas?: HTMLCanvasElement;
  /**
   * Create a LinearGradientSource instance form augments of linear-gradient function.
   * @param value the arguments of linear-gradient function.
   */
  constructor(value: string[]) {
    this.parameters = value;
  }

  /**
   * Returns a drawable instance (canvas) for the specified size.
   * @param width Specified drawable width.
   * @param height Specified drawable height.
   * @returns A canvas with given size and drawn by the linear-gradient function.
   */
  public getSource(width: number, height: number) {
    if (this.parameters.length === 0) {
      return undefined;
    }
    width = Math.round(width);
    height = Math.round(height);
    if (this.canvas && this.canvas.width === width && this.canvas.height === height) {
      return this.canvas;
    }
    if (!this.canvas) {
      this.canvas = Runtime.get().newCanvas();
    }
    if (this.canvas.width !== width) {
      this.canvas.width = width;
    }
    if (this.canvas.height !== height) {
      this.canvas.height = height;
    }
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return undefined;
    }

    let i = 0;
    let gradient;
    if (this.parameters[0].startsWith('to')) {
      const where = this.parameters[0].substring(2).replace(/\s+/g, '');
      if (where === 'left') {
        gradient = ctx.createLinearGradient(width - 1, 0, 0, 0);
      } else if (where === 'right') {
        gradient = ctx.createLinearGradient(0, 0, width - 1, 0);
      } else if (where === 'top') {
        gradient = ctx.createLinearGradient(0, height - 1, 0, 0);
      } else if (where === 'bottom') {
        gradient = ctx.createLinearGradient(0, 0, 0, height - 1);
      } else if (where === 'lefttop') {
        gradient = ctx.createLinearGradient(width - 1, height - 1, 0, 0);
      } else if (where === 'leftbottom') {
        gradient = ctx.createLinearGradient(width - 1, 0, 0, height - 1);
      } else if (where === 'righttop') {
        gradient = ctx.createLinearGradient(0, height - 1, width - 1, 0);
      } else if (where === 'rightbottom') {
        gradient = ctx.createLinearGradient(0, 0, width - 1, height - 1);
      } else {
        gradient = ctx.createLinearGradient(0, 0, 0, height - 1);
      }
      i++;
    } else if (this.parameters[0].endsWith('deg')) {
      // TODO: calculate by deg
      // const deg = parseFloat(this.parameters[0]);
      // const r = Math.sqrt(width * width / 4 + height * height * 4);
      // const x = r * Math.
      gradient = ctx.createLinearGradient(0, 0, width - 1, height - 1);
      i++;
    }

    if (!gradient) {
      gradient = ctx.createLinearGradient(0, 0, 0, height - 1);
    }

    for (let last = -1; i < this.parameters.length; ++i) {
      const parts = this.parameters[i].split(/\s+/);
      const color = parts[0];
      if (parts.length < 2) {
        if (last === -1) {
          last = 0;
          gradient.addColorStop(0, color);
        } else {
          let next = 1;
          let size = 0;
          for (let j = i + 1; j < this.parameters.length; ++j) {
            ++size;
            const ps = this.parameters[j].split(/\s+/);
            if (ps.length > 1) {
              next = parseFloat(ps[1]) / 100;
              break;
            }
          }
          if (size === 0) {
            last = 1;
          } else {
            last = last + (next - last) / (size + 1);
          }
          gradient.addColorStop(last, color);
        }
      } else {
        for (let j = 1; j < parts.length; ++j) {
          last = parseFloat(parts[j]) / 100;
          gradient.addColorStop(last, color);
        }
      }
    }

    // Set the fill style and draw a rectangle
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    return this.canvas;
  }

  /**
   * Returns a string representation of this object.
   * @returns a string representation of this object.
   */
  public toString(): string {
    return `linear-gradient(${this.parameters.join(',')})`;
  }

  /**
   * Creates a new LinearGradientSource with the same arguments.
   * @returns a clone of this instance.
   */
  public clone(): IBackgroundImage {
    return new LinearGradientSource(this.parameters);
  }

  /**
   * A callback function to destroy current instance.
   */
  public destroy() {
    if (this.canvas) {
      Runtime.get().releaseCanvas(this.canvas);
      this.canvas = undefined;
    }
  }
}

/**
 * The background-repeat type for horizontal and vertical axes.
 * See https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat
 */
export enum BackgroundRepeatType {
  REPEAT = 'repeat',
  NO_REPEAT = 'no-repeat',
  SPACE = 'space',
  ROUND = 'round'
}

/**
 * The background-repeat property sets how background images are repeated. A background image can
 * be repeated along the horizontal and vertical axes, or not repeated at all.
 */
class BackgroundRepeat implements IBgAttribute<BackgroundRepeat> {
  /**
   * The default instance of BackgroundRepeat, repeat at both axes.
   */
  public static DEFAULT = new BackgroundRepeat(
    BackgroundRepeatType.REPEAT,
    BackgroundRepeatType.REPEAT
  );

  /**
   * Convert the tokens to an BackgroundRepeat instance.
   * @param tokens the tokens present BackgroundRepeat.
   * @returns a BackgroundRepeat instance presents these tokens.
   */
  public static of(tokens: string[]): BackgroundRepeat | undefined {
    // See: https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat
    if (tokens.length === 1) {
      const token = tokens[0];
      if (token === 'repeat-x') {
        return new BackgroundRepeat(BackgroundRepeatType.REPEAT, BackgroundRepeatType.NO_REPEAT);
      } else if (token === 'repeat-y') {
        return new BackgroundRepeat(BackgroundRepeatType.NO_REPEAT, BackgroundRepeatType.REPEAT);
      } else if (token === 'repeat') {
        return new BackgroundRepeat(BackgroundRepeatType.REPEAT, BackgroundRepeatType.REPEAT);
      } else if (token === 'space') {
        return new BackgroundRepeat(BackgroundRepeatType.SPACE, BackgroundRepeatType.SPACE);
      } else if (token === 'round') {
        return new BackgroundRepeat(BackgroundRepeatType.ROUND, BackgroundRepeatType.ROUND);
      } else if (token === 'no-repeat') {
        return new BackgroundRepeat(BackgroundRepeatType.NO_REPEAT, BackgroundRepeatType.NO_REPEAT);
      } else {
        return undefined;
      }
    } else if (tokens.length === 2) {
      const x = EnumUtils.fromStringOrUndefined<BackgroundRepeatType>(
        BackgroundRepeatType,
        tokens[0]
      );
      const y = EnumUtils.fromStringOrUndefined<BackgroundRepeatType>(
        BackgroundRepeatType,
        tokens[1]
      );
      if (!x || !y) {
        return undefined;
      }
      return new BackgroundRepeat(x, x);
    } else {
      return undefined;
    }
  }

  /**
   * The repeat type of horizontal axes.
   */
  readonly x: BackgroundRepeatType;
  /**
   * The repeat type of vertical axes.
   */
  readonly y: BackgroundRepeatType;

  /**
   * Creates an BackgroundRepeat instance repeat type of both horizontal and vertical axes.
   * @param x The repeat type of horizontal axes.
   * @param y The repeat type of vertical axes.
   */
  constructor(x: BackgroundRepeatType, y: BackgroundRepeatType) {
    this.x = x;
    this.y = y;
  }

  /**
   * Creates a new BackgroundRepeat instance with the same repeat type of both horizontal and
   * vertical axes.
   * @returns a clone of this instance.
   */
  public clone(): BackgroundRepeat {
    return new BackgroundRepeat(this.x, this.y);
  }
}

/**
 * The background-clip property sets whether an element's background extends underneath its border
 * box, padding box, or content box.
 * See https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip
 */
export enum BackgroundClip {
  BORDER_BOX = 'border-box',
  PADDING_BOX = 'padding-box',
  CONTENT_BOX = 'content-box'
}

/**
 * The background-size type for horizontal and vertical axes.
 */
export enum BackgroundSizeType {
  AUTO = 'auto',
  COVER = 'cover',
  CONTAIN = 'contain',
  VALUE = 'value'
}

/**
 * The background-size property sets the size of the element's background image. The image can be
 * left to its natural size, stretched, or constrained to fit the available space.
 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/background-size
 */
class BackgroundSize implements IBgAttribute<BackgroundSize> {
  /**
   * The default value of background size.
   */
  public static DEFAULT = new BackgroundSize(
    BackgroundSizeType.AUTO,
    BaseValue.ZERO,
    BackgroundSizeType.AUTO,
    BaseValue.ZERO
  );

  /**
   * Convert the tokens to an BackgroundSize instance.
   * @param tokens the tokens present BackgroundSize.
   * @returns a BackgroundSize instance presents these tokens.
   */
  public static of(tokens: string[]): BackgroundSize | undefined {
    let xType;
    let x = BaseValue.ZERO;
    let yType;
    let y = BaseValue.ZERO;
    if (tokens.length === 1) {
      const token = tokens[0];
      if (token === 'auto') {
        xType = yType = BackgroundSizeType.AUTO;
      } else if (token === 'cover') {
        xType = yType = BackgroundSizeType.COVER;
      } else if (token === 'contain') {
        xType = yType = BackgroundSizeType.CONTAIN;
      } else {
        x = y = BaseValue.of(token);
        if (!y) return undefined;
      }
    } else if (tokens.length === 2) {
      if (tokens[0] === 'auto') {
        xType = BackgroundSizeType.AUTO;
      } else {
        xType = BackgroundSizeType.VALUE;
        x = BaseValue.of(tokens[0], true);
        if (!x) return undefined;
      }
      if (tokens[1] === 'auto') {
        yType = BackgroundSizeType.AUTO;
      } else {
        yType = BackgroundSizeType.VALUE;
        y = BaseValue.of(tokens[1], true);
        if (!y) return undefined;
      }
    } else {
      return undefined;
    }
    return new BackgroundSize(xType, x, yType, y);
  }

  /**
   * The background size type of horizontal axe.
   */
  readonly xType: BackgroundSizeType;
  /**
   * The background size type of vertical axe.
   */
  readonly yType: BackgroundSizeType;
  /**
   * The background size of horizontal axe.
   */
  readonly x: BaseValue;
  /**
   * The background size of vertical axe.
   */
  readonly y: BaseValue;

  /**
   * Creates a BackgroundSize instance with specified type and value in both horizontal and
   * vertical axes.
   * @param xType The background size type of horizontal axes.
   * @param x The background size of horizontal axes.
   * @param yType The background size type of vertical axes.
   * @param y The background size of vertical axes.
   */
  constructor(xType: BackgroundSizeType, x: BaseValue, yType: BackgroundSizeType, y: BaseValue) {
    this.x = x;
    this.xType = xType;
    this.y = y;
    this.yType = yType;
  }

  /**
   * Creates a new BackgroundSize with the same type and value of both horizontal and vertical axes.
   * @returns a clone of this instance.
   */
  public clone(): BackgroundSize {
    return new BackgroundSize(this.xType, this.x.clone(), this.yType, this.y.clone());
  }
}

/**
 * The background-position type for horizontal and vertical axes.
 */
enum BackgroundPositionType {
  LEFT = 'left',
  TOP = 'top',
  CENTER = 'center',
  BOTTOM = 'bottom',
  RIGHT = 'right'
}

/**
 * The background-position property sets the initial position for each background image. The
 * position is relative to the position layer set by background-origin.
 */
class BackgroundPosition implements IBgAttribute<BackgroundPosition> {
  /**
   * The default value of background-position, it is in left-top cornor.
   */
  public static DEFAULT = new BackgroundPosition(
    BackgroundPositionType.LEFT,
    BaseValue.ZERO,
    BackgroundPositionType.TOP,
    BaseValue.ZERO
  );

  /**
   * Checks a token is a valid background-position token.
   * @param token The token need to be checked.
   * @returns True if it is a valid background-position token, false otherwise.
   */
  public static acceptToken(token: string): boolean {
    const pattern = /^(left|center|right|top|bottom|[0-9\.]+|[0-9\.]+px|[0-9\.]+%)$/;
    return pattern.test(token);
  }

  /**
   * Convert the tokens to an BackgroundPosition instance.
   * @param tokens the tokens present BackgroundPosition.
   * @returns a BackgroundPosition instance presents these tokens.
   */
  public static of(tokens: string[]): BackgroundPosition | undefined {
    let xDir;
    let yDir;
    let x;
    let y;

    // 1-value syntax: the value may be:
    // The keyword value center, which centers the image.
    // One of the keyword values top, left, bottom, right. This specifies an edge against which to
    // place the item. The other dimension is then set to 50%, so the item is placed in the middle
    // of the edge specified.
    // A <length> or <percentage>. This specifies the X coordinate relative to the left edge, with
    // the Y coordinate set to 50%.
    if (tokens.length === 1) {
      const token = tokens[0];
      x = BaseValue.ZERO;
      y = BaseValue.ZERO;
      if (token === 'left' || token === 'right') {
        xDir = token;
        yDir = BackgroundPositionType.CENTER;
      }
      if (token === 'top' || token === 'bottom') {
        xDir = BackgroundPositionType.CENTER;
        yDir = token;
      }
      if (token === 'center') {
        xDir = BackgroundPositionType.CENTER;
        yDir = BackgroundPositionType.CENTER;
      } else {
        xDir = BackgroundPositionType.LEFT;
        x = BaseValue.of(token);
        yDir = BackgroundPositionType.CENTER;
      }
    }

    // 2-value syntax: one value defines X and the other defines Y. Each value may be:
    // One of the keyword values top, left, bottom, right. If left or right are given here, then
    // this defines X and the other given value defines Y. If top or bottom are given, then this
    // defines Y and the other value defines X.
    // A <length> or <percentage>. If the other value is left or right, then this value defines Y,
    // relative to the top edge. If the other value is top or bottom, then this value defines X,
    // relative to the left edge. If both values are <length> or <percentage> values, then the
    // first defines X and the second Y.
    // Note that: If one value is top or bottom, then the other value may not be top or bottom.
    // If one value is left or right, then the other value may not be left or right. This means,
    // e.g., that top top and left right are not valid.
    // The default value is top left or 0% 0%.
    else if (tokens.length === 2) {
      let tokenX = tokens[0];
      let tokenY = tokens[1];
      if (tokenX === 'top' || tokenX === 'bottom' || tokenY === 'left' || tokenY === 'right') {
        tokenX = tokens[1];
        tokenY = tokens[0];
      }

      if (tokenX === 'left' || tokenX === 'right' || tokenX === 'center') {
        xDir = tokenX;
        x = BaseValue.ZERO;
      } else {
        xDir = BackgroundPositionType.LEFT;
        x = BaseValue.of(tokenX);
        if (!x) {
          return undefined;
        }
      }
      if (tokenY === 'top' || tokenY === 'bottom' || tokenY === 'center') {
        yDir = tokenY;
        y = BaseValue.ZERO;
      } else {
        yDir = BackgroundPositionType.TOP;
        y = BaseValue.of(tokenY);
        if (!y) {
          return undefined;
        }
      }
    }

    // 3-value syntax: Two values are keyword values, and the third is the offset for the preceding
    // value:
    // The first value is one of the keyword values top, left, bottom, right, or center. If left or
    // right are given here, then this defines X. If top or bottom are given, then this defines Y
    // and the other keyword value defines X.
    // The <length> or <percentage> value, if it is the second value, is the offset for the first
    // value. If it is the third value, it is the offset for the second value.
    // The single length or percentage value is an offset for the keyword value that precedes it.
    // The combination of one keyword with two <length> or <percentage> values is not valid.
    else if (tokens.length === 3) {
      if (tokens[0] === 'left' || tokens[0] === 'right') {
        xDir = tokens[0];
        x = BaseValue.of(tokens[1]);
        if (x) {
          if (tokens[2] === 'top' || tokens[2] === 'bottom' || tokens[2] === 'center') {
            yDir = tokens[2];
            y = BaseValue.ZERO;
          } else {
            return undefined;
          }
        } else {
          x = BaseValue.ZERO;
          if (tokens[1] === 'top' || tokens[1] === 'bottom' || tokens[1] === 'center') {
            yDir = tokens[1];
            y = BaseValue.of(tokens[2]);
            if (!y) return undefined;
          } else {
            return undefined;
          }
        }
      } else if (tokens[0] === 'top' || tokens[0] === 'bottom') {
        yDir = tokens[0];
        y = BaseValue.of(tokens[1]);
        if (y) {
          if (tokens[2] === 'left' || tokens[2] === 'right' || tokens[2] === 'center') {
            xDir = tokens[2];
            x = BaseValue.ZERO;
          } else {
            return undefined;
          }
        } else {
          y = BaseValue.ZERO;
          if (tokens[1] === 'left' || tokens[1] === 'right' || tokens[1] === 'center') {
            xDir = tokens[1];
            x = BaseValue.of(tokens[2]);
            if (!x) return undefined;
          } else {
            return undefined;
          }
        }
      }
    }
    // 4-value syntax: The first and third values are keyword value defining X and Y. The second
    // and fourth values are offsets for the preceding X and Y keyword values:
    // The first value and third values one of the keyword values top, left, bottom, right. If left
    // or right are given here, then this defines X. If top or bottom are given, then this defines
    // Y and the other keyword value defines X.
    // The second and fourth values are <length> or <percentage> values. The second value is the
    // offset for the first keyword. The fourth value is the offset for the second keyword.
    else if (tokens.length === 4) {
      if (tokens[0] === 'left' || tokens[0] === 'right') {
        xDir = tokens[0];
        x = BaseValue.of(tokens[1]);
        yDir = tokens[2];
        y = BaseValue.of(tokens[3]);
      } else if (tokens[0] === 'top' || tokens[0] === 'bottom') {
        xDir = tokens[2];
        x = BaseValue.of(tokens[3]);
        yDir = tokens[0];
        y = BaseValue.of(tokens[1]);
      }
      if (
        !x ||
        !y ||
        (xDir !== 'left' && xDir !== 'right') ||
        (yDir !== 'top' && yDir !== 'bottom')
      ) {
        return undefined;
      }
    } else {
      return undefined;
    }
    return new BackgroundPosition(
      xDir as BackgroundPositionType,
      x,
      yDir as BackgroundPositionType,
      y
    );
  }

  readonly xDir: BackgroundPositionType;
  readonly yDir: BackgroundPositionType;
  readonly x: BaseValue;
  readonly y: BaseValue;

  constructor(
    xDir: BackgroundPositionType,
    x: BaseValue,
    yDir: BackgroundPositionType,
    y: BaseValue
  ) {
    this.xDir = xDir;
    this.x = x;
    this.yDir = yDir;
    this.y = y;
  }

  /**
   * Creates a new BackgroundPosition with the same type and value of both horizontal and vertical
   * axes.
   * @returns a clone of this instance.
   */
  public clone(): BackgroundPosition {
    return new BackgroundPosition(this.xDir, this.x.clone(), this.yDir, this.y.clone());
  }
}

/**
 * The background shorthand property sets all background style properties at once, such as color,
 * image, origin and size, or repeat method.
 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/background
 */
export class Background {
  /**
   * Parse a string format background definition to a background instance.
   * See the definition at https://developer.mozilla.org/en-US/docs/Web/CSS/background
   *
   * @param value Input string to be parsed.
   * @param [silent] if true, ignore warning for an invalid value.
   * @returns A Background instance of valid data, undefined otherwise.
   */
  public static of(value: string, silent = false): Background | undefined {
    const parts = this.split(value);
    const bg = new Background();

    for (const part of parts) {
      let attachment: BackgroundAttachment;
      let image: IBackgroundImage;
      let repeat: BackgroundRepeat;
      let clip: BackgroundClip;
      let origin: BackgroundClip;
      let size: BackgroundSize;
      let position: BackgroundPosition;
      const blendMode = '';

      const tokens = BG_TOKENIZER.tokenize(part);
      for (let i = 0; i < tokens.length; ++i) {
        const token = tokens[i];

        // The <box> value may be included zero, one, or two times. If included once, it sets both
        // background-origin and background-clip. If it is included twice, the first occurrence
        // sets background-origin, and the second sets background-clip.
        const box: BackgroundClip | undefined = EnumUtils.fromStringOrUndefined(
          BackgroundClip,
          token
        );
        if (box) {
          if (!clip) {
            clip = box;
          } else if (!origin) {
            origin = box;
          } else {
            if (!silent) {
              console.warn(
                'invalid background:' + value + '\n<box> value appears 3 times in one layer'
              );
            }
            return undefined;
          }
          continue;
        }

        // Checks attachment.
        const parsedAttachment: BackgroundAttachment | undefined = EnumUtils.fromStringOrUndefined(
          BackgroundAttachment,
          token
        );
        if (parsedAttachment) {
          if (attachment) {
            if (!silent) {
              console.warn(
                'invalid background:' + value + '\n<attachment> value appears twice in one layer'
              );
            }
            return undefined;
          }
          attachment = parsedAttachment;
          continue;
        }

        // Checks position & size.
        // The <bg-size> value may only be included immediately after <position>, separated with
        // the '/' character, like this: "center/80%".
        if (BackgroundPosition.acceptToken(token)) {
          if (position) {
            if (!silent) {
              console.warn(
                'invalid background:' + value + '\n<position> value appears twice in one layer'
              );
            }
            return undefined;
          }
          const positionTokens = [token];
          for (++i; i < tokens.length; ++i) {
            if (BackgroundPosition.acceptToken(tokens[i])) {
              positionTokens.push(tokens[i]);
            } else {
              break;
            }
          }
          position = BackgroundPosition.of(positionTokens);
          if (!position) {
            if (!silent) {
              console.warn('invalid background:' + value + '\nbad <position> value');
            }
            return undefined;
          }
          if (i < tokens.length && tokens[i] === '/') {
            if (i + 2 < tokens.length) {
              size = BackgroundSize.of([tokens[i + 1], tokens[i + 2]]);
              if (size) {
                i += 2;
              } else {
                size = BackgroundSize.of([tokens[i + 1]]);
                if (size) {
                  ++i;
                }
              }
            } else if (i + 1 < tokens.length) {
              size = BackgroundSize.of([tokens[i + 1]]);
              if (size) {
                ++i;
              }
            }
            if (!size) {
              if (!silent) {
                console.warn('invalid background:' + value + '\nbad <size> value');
              }
              return undefined;
            }
          } else {
            --i;
          }
          continue;
        }

        // Checks repeat
        let parsedRepeat;
        if (i + 1 < tokens.length) {
          parsedRepeat = BackgroundRepeat.of([tokens[i], tokens[i + 1]]);
          if (parsedRepeat) {
            i += 1;
          } else {
            parsedRepeat = BackgroundRepeat.of([tokens[i]]);
          }
        } else {
          parsedRepeat = BackgroundRepeat.of([tokens[i]]);
        }
        if (parsedRepeat) {
          if (repeat) {
            if (!silent) {
              console.warn(
                'invalid background:' + value + '\n<repeat> value appears twice in one layer'
              );
            }
            return undefined;
          } else {
            repeat = parsedRepeat;
          }
          continue;
        }

        // Checks image
        const parsedImage = this.parseImage(token);
        if (parsedImage) {
          if (image) {
            if (!silent) {
              console.warn(
                'invalid background:' + value + '\n<image> value appears twice in one layer'
              );
            }
            return undefined;
          } else {
            image = parsedImage;
          }
          continue;
        }

        // Checks color
        const color = Color.of(token);
        if (color) {
          if (bg.color) {
            if (!silent) {
              console.warn('invalid background:' + value + '\n<color> value appears twice');
            }
            return undefined;
          }
          bg.color = color;
          continue;
        }

        if (!silent) {
          console.warn('invalid background:' + value + '\nunknown token:' + token);
        }
        return undefined;
      }

      if (!image) {
        continue;
      }

      bg.image.push(image);
      bg.attachment.push(attachment || BackgroundAttachment.SCROLL);
      bg.repeat.push(repeat || BackgroundRepeat.DEFAULT);
      bg.clip.push(clip || BackgroundClip.CONTENT_BOX);
      bg.origin.push(origin || BackgroundClip.PADDING_BOX);
      bg.size.push(size || BackgroundSize.DEFAULT);
      bg.position.push(position || BackgroundPosition.DEFAULT);
      bg.blendMode.push(blendMode);
    }
    return bg;
  }

  /**
   * Try to parse a string to a BackgroundImage instance.
   * @param value A string presents image attribute.
   * @returns A BackgroundImage instance for a valid definition, undefined otherwise.
   */
  private static parseImage(value: string): IBackgroundImage | undefined {
    const func = FunctionParser.parse(value, true);
    if (!func) {
      return undefined;
    }
    switch (func.name) {
      case 'url':
        return URLSource.of(func.arguments);
      case 'linear-gradient':
        return LinearGradientSource.of(func.arguments);
    }
    return undefined;
  }

  /**
   * The Background property supports multiple layers, this function is used to split layers from a
   * string.
   * @param value A string to be split.
   * @returns A list of split strings.
   */
  private static split(value: string): string[] {
    const result: string[] = [];
    let begin = 0;
    let inBrackets = false;
    const size = value.length;
    for (let i = 0; i < size; ++i) {
      const ch = value[i];
      if (inBrackets) {
        if (ch === ')') {
          inBrackets = false;
        }
      } else if (ch === '(') {
        inBrackets = true;
      } else if (ch === ',') {
        if (begin < i) {
          const part = value.substring(begin, i).trim();
          if (part) {
            result.push(part);
          }
        }
        begin = i + 1;
      }
    }
    if (begin < size) {
      const part = value.substring(begin).trim();
      if (part) {
        result.push(part);
      }
    }
    return result;
  }

  /**
   * Shadow copy the elements from one list to the other.
   * @param src The source list to be copied.
   * @param dest The destination list to hold the elements from source list.
   */
  private static copyArray<T>(src: T[], dest: T[]) {
    for (const item of src) {
      dest.push(item);
    }
  }

  /**
   * Deep copy the elements from one list to the other.
   * @param src The source list to be copied.
   * @param dest The destination list to hold the elements from source list.
   */
  private static cloneArray<T>(src: (IBgAttribute<T> | undefined)[], dest: (T | undefined)[]) {
    for (const item of src) {
      if (!item) {
        dest.push(undefined);
      } else {
        dest.push(item.clone());
      }
    }
  }

  /**
   * Get an element from a list with specified position, if the position is out of the range,
   * returns a default value.
   * @param arr The source list.
   * @param idx The position in the list to be retrieved.
   * @param defaultVal Default value for invalid position.
   * @returns an element in the list with specified position, or default value for invalid
   * position.
   */
  private static getFromArray<T>(arr: T[], idx: number, defaultVal: T) {
    return idx >= arr.length ? defaultVal : arr[idx];
  }

  /**
   * The color property sets the background color of an element. It is rendered behind any
   * background-image that is specified, although the color will still be visible through any
   * transparency in the image.
   */
  public color?: Color;
  /**
   * A list of BackgroundAttachment definition for multiple layers.
   */
  public attachment: BackgroundAttachment[] = [];
  /**
   * A list of IBackgroundImage definition for multiple layers.
   */
  public image: IBackgroundImage[] = [];
  /**
   * A list of BackgroundRepeat definition for multiple layers.
   */
  public repeat: BackgroundRepeat[] = [];
  /**
   * A list of BackgroundClip definition for multiple layers.
   */
  public clip: BackgroundClip[] = [];
  /**
   * A list of BackgroundOrigin definition for multiple layers.
   * Note: clip and origin are use same enum definition.
   */
  public origin: BackgroundClip[] = [];
  /**
   * A list of BackgroundSize definition for multiple layers.
   */
  public size: BackgroundSize[] = [];
  /**
   * A list of BackgroundPosition definition for multiple layers.
   */
  public position: BackgroundPosition[] = [];
  /**
   * A list of BlendMode definition for multiple layers.
   */
  public blendMode: string[] = [];

  /**
   * Set the color property by a string.
   * @param value A string presents color.
   */
  public setColor(value: string | Color) {
    this.color = value instanceof Color ? value : Color.of(value);
  }

  /**
   * Set the <background-attachment> property by a string.
   * @param value A string presents single <background-attachment> or a list of
   * <background-attachment> for multiple layers.
   */
  public setAttachment(value: string) {
    const parts = Background.split(value);
    this.attachment.length = 0;
    for (const _ of parts) {
      // TODO: support others later.
      this.attachment.push(BackgroundAttachment.SCROLL);
    }
  }

  /**
   * Set the <background-image> property by a string.
   * @param value A string presents single <background-image> or a list of
   * <background-image> for multiple layers.
   */
  public setImage(value: string) {
    const parts = Background.split(value);
    this.image.length = 0;
    for (const part of parts) {
      this.image.push(Background.parseImage(part));
    }
  }

  /**
   * Set the <blend-mode> property by a string.
   * @param value A string presents single <blend-mode> or a list of <blend-mode> for multiple
   * layers.
   */
  public setBlendMode(value: string) {
    const parts = Background.split(value);
    this.blendMode.length = 0;
    for (const part of parts) {
      this.blendMode.push(part);
    }
  }

  /**
   * Set the <background-repeat> property by a string.
   * @param value A string presents single <background-repeat> or a list of <background-repeat> for
   * multiple layers.
   */
  public setRepeat(value: string) {
    const parts = Background.split(value);
    this.repeat.length = 0;
    for (const part of parts) {
      const repeat = BackgroundRepeat.of(BG_TOKENIZER.tokenize(part)) || BackgroundRepeat.DEFAULT;
      this.repeat.push(repeat);
    }
  }

  /**
   * Set the <background-clip> property by a string.
   * @param value A string presents single <background-clip> or a list of <background-clip> for
   * multiple layers.
   */
  public setClip(value: string) {
    const parts = Background.split(value);
    this.clip.length = 0;
    for (const part of parts) {
      const clip = EnumUtils.fromString<BackgroundClip>(
        BackgroundClip,
        part,
        BackgroundClip.BORDER_BOX
      );
      this.clip.push(clip);
    }
  }

  /**
   * Set the <background-origin> property by a string.
   * @param value A string presents single <background-origin> or a list of <background-origin> for
   * multiple layers.
   */
  public setOrigin(value: string) {
    const parts = Background.split(value);
    this.origin.length = 0;
    for (const part of parts) {
      const origin = EnumUtils.fromString<BackgroundClip>(
        BackgroundClip,
        part,
        BackgroundClip.BORDER_BOX
      );
      this.origin.push(origin);
    }
  }

  /**
   * Set the <background-size> property by a string.
   * @param value A string presents single <background-size> or a list of <background-size> for
   * multiple layers.
   */
  public setSize(value: string) {
    const parts = Background.split(value);
    this.size.length = 0;
    for (const part of parts) {
      const size = BackgroundSize.of(BG_TOKENIZER.tokenize(part)) || BackgroundSize.DEFAULT;
      this.size.push(size);
    }
  }

  /**
   * Set the <background-position> property by a string.
   * @param value A string presents single <background-position> or a list of
   * <background-position> for multiple layers.
   */
  public setPosition(value: string) {
    const parts = Background.split(value);
    this.position.length = 0;
    for (const part of parts) {
      const position =
        BackgroundPosition.of(BG_TOKENIZER.tokenize(part)) || BackgroundPosition.DEFAULT;
      this.position.push(position);
    }
  }

  /**
   * Draw the background of an element.
   * @param target The target element.
   * @param ctx The canvas rendering context of stage canvas.
   * @param outerRect The pre-calculated outer round rect of the element.
   * @param innerRect The pre-calculated inner round rect of the element.
   */
  public draw(
    target: XObject,
    ctx: CanvasRenderingContext2D,
    outerRect: RoundRect,
    innerRect: RoundRect
  ) {
    // TODO: support blend mode

    // Color only.
    if (this.image.length === 0 && this.color && this.color.a > 0) {
      ctx.fillStyle = this.color.toString();
      let rect: Rect;
      const clip: BackgroundClip = Background.getFromArray(this.clip, 0, BackgroundClip.BORDER_BOX);
      switch (clip) {
        case BackgroundClip.PADDING_BOX:
          rect = target.getPaddingRect();
          break;
        case BackgroundClip.CONTENT_BOX:
          rect = target.getContentRect();
          break;
        default:
          rect = new Rect(0, 0, target.rect.width, target.rect.height);
          break;
      }
      if (clip === BackgroundClip.BORDER_BOX) {
        outerRect.clip(ctx);
      } else {
        innerRect.clip(ctx);
      }
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      return;
    }

    for (let i = this.image.length - 1; i >= 0; --i) {
      const source = this.image[i];
      if (!source) {
        continue;
      }
      const origin = Background.getFromArray(this.origin, i, BackgroundClip.BORDER_BOX);
      let originRect;
      switch (origin) {
        case BackgroundClip.PADDING_BOX: {
          originRect = target.getPaddingRect();
          break;
        }
        case BackgroundClip.CONTENT_BOX: {
          originRect = target.getContentRect();
          break;
        }
        default:
          originRect = new Rect(0, 0, target.rect.width, target.rect.height);
          break;
      }

      if (originRect.width < 1 || originRect.height < 1) {
        continue;
      }

      const img = source.getSource(originRect.width, originRect.height);
      if (!img) {
        continue;
      }

      let clipRect;
      const clip = Background.getFromArray(this.clip, i, BackgroundClip.BORDER_BOX);
      switch (clip) {
        case BackgroundClip.PADDING_BOX: {
          clipRect = target.getPaddingRect();
          break;
        }
        case BackgroundClip.CONTENT_BOX: {
          clipRect = target.getContentRect();
          break;
        }
        default:
          clipRect = new Rect(0, 0, target.rect.width, target.rect.height);
          break;
      }
      if (clip === BackgroundClip.BORDER_BOX) {
        outerRect.clip(ctx);
      } else {
        innerRect.clip(ctx);
      }
      // Draw color
      if (this.color && i === this.image.length - 1) {
        ctx.fillStyle = this.color.toString();
        ctx.fillRect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
      }

      const srcWidth = img.width;
      const srcHeight = img.height;
      let scaledWidth = srcWidth;
      let scaledHeight = srcHeight;
      let destX = originRect.x;
      let destY = originRect.y;

      // Image size
      const size = this.size.length > i ? this.size[i] : BackgroundSize.DEFAULT;
      // Background size
      if (size.xType === BackgroundSizeType.CONTAIN) {
        const ratio = srcWidth / srcHeight;
        if (ratio > originRect.width / originRect.height) {
          scaledWidth = originRect.width;
          scaledHeight = scaledWidth / ratio;
        } else {
          scaledHeight = originRect.height;
          scaledWidth = scaledHeight * ratio;
        }
      } else if (size.xType === BackgroundSizeType.COVER) {
        const ratio = srcWidth / srcHeight;
        if (ratio < originRect.width / originRect.height) {
          scaledWidth = originRect.width;
          scaledHeight = scaledWidth / ratio;
        } else {
          scaledHeight = originRect.height;
          scaledWidth = scaledHeight * ratio;
        }
      } else {
        if (size.xType === BackgroundSizeType.VALUE) {
          scaledWidth = size.x.getValue(originRect.width);
        }
        if (size.yType === BackgroundSizeType.VALUE) {
          scaledHeight = size.y.getValue(originRect.height);
        }
      }

      if (scaledWidth < 1 || scaledHeight < 1) {
        continue;
      }

      let srcScaleX = scaledWidth / srcWidth;
      let srcScaleY = scaledHeight / srcHeight;

      // Repeat
      let repeatX = BackgroundRepeatType.NO_REPEAT;
      let repeatY = BackgroundRepeatType.NO_REPEAT;
      if (this.repeat.length > i) {
        repeatX = this.repeat[i].x;
        repeatY = this.repeat[i].y;
      }

      let gapX = 0;
      let gapY = 0;
      if (repeatX === BackgroundRepeatType.SPACE) {
        const count = Math.floor(originRect.width / scaledWidth);
        if (count === 1) {
          gapX = originRect.width;
        } else {
          gapX = (originRect.width - count * scaledWidth) / (count - 1);
        }
        destX = originRect.x;
        while (destX > clipRect.x) {
          destX -= gapX + scaledWidth;
        }
      } else if (repeatX === BackgroundRepeatType.ROUND) {
        const count = Math.max(1, Math.floor(originRect.width / scaledWidth + 0.5));
        scaledWidth = originRect.width / count;
        srcScaleX = scaledWidth / srcWidth;
        destX = originRect.x;
        while (destX > clipRect.x) {
          destX -= scaledWidth;
        }
      } else {
        if (this.position.length > i) {
          const position = this.position[i];
          if (position.xDir === BackgroundPositionType.CENTER) {
            destX += ((originRect.width - scaledWidth) * 50) / 100;
          } else if (position.xDir === BackgroundPositionType.RIGHT) {
            if (position.x.unit === BaseValueUnit.PERCENTAGE) {
              destX += ((originRect.width - scaledWidth) * (100 - position.x.numberValue)) / 100;
            } else {
              destX += originRect.width - scaledWidth - position.x.numberValue;
            }
          } else {
            if (position.x.unit === BaseValueUnit.PERCENTAGE) {
              destX += ((originRect.width - scaledWidth) * position.x.numberValue) / 100;
            } else {
              destX += position.x.numberValue;
            }
          }
        }
        if (repeatX === BackgroundRepeatType.REPEAT) {
          while (destX > clipRect.x) {
            destX -= scaledWidth;
          }
        }
      }

      if (repeatY === BackgroundRepeatType.SPACE) {
        const count = Math.floor(originRect.height / scaledHeight);
        if (count === 1) {
          gapY = originRect.height;
        } else {
          gapY = (originRect.height - count * scaledHeight) / (count - 1);
        }
        destY = originRect.y;
        while (destY > clipRect.y) {
          destY -= gapY + scaledHeight;
        }
      } else if (repeatY === BackgroundRepeatType.ROUND) {
        const count = Math.max(1, Math.floor(originRect.height / scaledHeight + 0.5));
        scaledHeight = originRect.height / count;
        srcScaleY = scaledHeight / srcHeight;
        destY = originRect.y;
        while (destY > clipRect.y) {
          destY -= scaledHeight;
        }
      } else {
        if (this.position.length > i) {
          const position = this.position[i];
          if (position.yDir === BackgroundPositionType.CENTER) {
            destY += ((originRect.height - scaledHeight) * 50) / 100;
          } else if (position.yDir === BackgroundPositionType.BOTTOM) {
            if (position.x.unit === BaseValueUnit.PERCENTAGE) {
              destY += ((originRect.height - scaledHeight) * (100 - position.y.numberValue)) / 100;
            } else {
              destY += originRect.height - scaledHeight - position.y.numberValue;
            }
          } else {
            if (position.y.unit === BaseValueUnit.PERCENTAGE) {
              destY += ((originRect.height - scaledHeight) * position.y.numberValue) / 100;
            } else {
              destY += position.y.numberValue;
            }
          }
        }
        if (repeatY === BackgroundRepeatType.REPEAT) {
          while (destY > clipRect.y) {
            destY -= scaledHeight;
          }
        }
      }

      const clipBottom = clipRect.y + clipRect.height;
      const clipRight = clipRect.x + clipRect.width;
      do {
        let x = destX;
        do {
          this.drawImage(
            ctx,
            img,
            scaledWidth,
            scaledHeight,
            srcScaleX,
            srcScaleY,
            x,
            destY,
            clipRect
          );
          x += gapX + scaledWidth;
        } while (x < clipRight && repeatX !== BackgroundRepeatType.NO_REPEAT);
        destY += gapY + scaledHeight;
      } while (destY < clipBottom && repeatY !== BackgroundRepeatType.NO_REPEAT);
    }
  }

  /**
   * Creates a new Background with the same properties.
   * @returns a clone of this instance.
   */
  public clone(): Background {
    const cloned = new Background();
    cloned.color = this.color;
    Background.copyArray(this.attachment, cloned.attachment);
    Background.cloneArray(this.image, cloned.image);
    Background.copyArray(this.blendMode, cloned.blendMode);
    Background.copyArray(this.clip, cloned.clip);
    Background.copyArray(this.origin, cloned.origin);
    Background.cloneArray(this.repeat, cloned.repeat);
    Background.cloneArray(this.size, cloned.size);
    Background.cloneArray(this.position, cloned.position);
    return cloned;
  }

  /**
   * Draw an image to context with specified size, scale and destination in a clip area.
   * @param ctx The canvas rendering context of stage canvas.
   * @param img The image to draw.
   * @param imgWidth The image width.
   * @param imgHeight The image height.
   * @param imageScaleX The horizontal scale of the image.
   * @param imageScaleY The vertical scale of the image.
   * @param destX The X destination position.
   * @param destY The Y destination position.
   * @param clip The clip area.
   */
  private drawImage(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    imgWidth: number,
    imgHeight: number,
    imageScaleX: number,
    imageScaleY: number,
    destX: number,
    destY: number,
    clip: Rect
  ) {
    let srcX = 0;
    let srcY = 0;
    if (destX < clip.x) {
      srcX = clip.x - destX;
      destX = clip.x;
    }
    if (destY < clip.y) {
      srcY = clip.y - destY;
      destY = clip.y;
    }
    let srcWidth = imgWidth - srcX;
    let srcHeight = imgHeight - srcY;
    if (srcWidth + destX > clip.width + clip.x) {
      srcWidth = clip.width + clip.x - destX;
    }
    if (srcHeight + destY > clip.height + clip.y) {
      srcHeight = clip.height + clip.y - destY;
    }
    ctx.drawImage(
      img,
      srcX / imageScaleX,
      srcY / imageScaleY,
      srcWidth / imageScaleX,
      srcHeight / imageScaleY,
      destX,
      destY,
      srcWidth,
      srcHeight
    );
  }
}
