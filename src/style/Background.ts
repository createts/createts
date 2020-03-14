import { BaseValue, BaseValueUnit } from '../base/BaseValue';
import { Color } from '../base/Color';
import { Rect } from '../base/Rect';
import { RoundRect } from '../base/RoundRect';
import { XObject } from '../components/XObject';
import { ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { Runtime } from '../Runtime';
import { EnumUtils } from '../utils/EnumUtils';
import { StringUtils } from '../utils/StringUtils';

export enum BackgroundAttachment {
  SCROLL = 'scroll'
}

export enum BackgroundRepeat {
  REPEAT = 'repeat',
  NO_REPEAT = 'no-repeat',
  SPACE = 'space',
  ROUND = 'round'
}

interface IBackgroundSource extends ICloneable<IBackgroundSource> {
  getSource(width: number, height: number): any;
  toString(): string;
  destory(): void;
}

interface ICloneable<T> {
  clone(): T;
}

// Radial-gradient
// repeating-linear-gradient
// repeating-radial-gradient
class URLSource implements IBackgroundSource {
  public static of(value: string[]): URLSource {
    return new URLSource(value[0]);
  }

  private url: string;
  constructor(url: string) {
    this.url = url;
    ResourceRegistry.DefaultInstance.add(url, ResourceType.IMAGE);
  }

  public getSource(width: number, height: number) {
    return ResourceRegistry.DefaultInstance.get(this.url);
  }

  public toString(): string {
    return `url(${this.url})`;
  }

  public clone(): IBackgroundSource {
    return new URLSource(this.url);
  }

  public destory() {
    return;
  }
}

class LinearGradientSource implements IBackgroundSource {
  public static of(value: string[]): LinearGradientSource {
    return new LinearGradientSource(value);
  }

  private parameters: string[];
  private canvas?: HTMLCanvasElement;
  constructor(value: string[]) {
    this.parameters = value;
  }

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
      // TODO: caculate by deg
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

  public toString(): string {
    return `linear-gradient(${this.parameters.join(',')})`;
  }

  public clone(): IBackgroundSource {
    return new LinearGradientSource(this.parameters);
  }

  public destory() {
    if (this.canvas) {
      Runtime.get().releaseCanvas(this.canvas);
      this.canvas = undefined;
    }
  }
}

class BackgroundRepeatPair implements ICloneable<BackgroundRepeatPair> {
  public static of(value: string): BackgroundRepeatPair | undefined {
    if (value === 'repeat-x') {
      return new BackgroundRepeatPair(BackgroundRepeat.REPEAT, BackgroundRepeat.NO_REPEAT);
    } else if (value === 'repeat-y') {
      return new BackgroundRepeatPair(BackgroundRepeat.NO_REPEAT, BackgroundRepeat.REPEAT);
    }
    const parts = value.split(/\s+/);
    const x = EnumUtils.fromStringOrUndefined<BackgroundRepeat>(BackgroundRepeat, parts[0]);
    if (!x) {
      return undefined;
    }
    if (parts.length > 1) {
      const y = EnumUtils.fromString<BackgroundRepeat>(
        BackgroundRepeat,
        parts[1],
        BackgroundRepeat.NO_REPEAT
      );
      return new BackgroundRepeatPair(x, y);
    } else {
      return new BackgroundRepeatPair(x, x);
    }
  }

  public static toBaseValue(value: string): BaseValue {
    value = value.toLowerCase();
    if (value === 'left' || value === 'top') {
      return BaseValue.of('0%');
    } else if (value === 'right' || value === 'bottom') {
      return BaseValue.of('100%');
    } else if (value === 'center') {
      return BaseValue.of('50%');
    } else {
      return BaseValue.of(value);
    }
  }

  public x: BackgroundRepeat;
  public y: BackgroundRepeat;
  constructor(x: BackgroundRepeat, y: BackgroundRepeat) {
    this.x = x;
    this.y = y;
  }

  public clone(): BackgroundRepeatPair {
    return new BackgroundRepeatPair(this.x, this.y);
  }
}

export enum BackgroundClip {
  BORDER_BOX = 'border-box',
  PADDING_BOX = 'padding-box',
  CONTENT_BOX = 'content-box'
}

export enum BackgroundOrigin {
  BORDER_BOX = 'border-box',
  PADDING_BOX = 'padding-box',
  CONTENT_BOX = 'content-box'
}

export enum BackgroundSizeType {
  AUTO = 0,
  LENGTH = 1,
  PERCENTAGE = 2,
  COVER = 3,
  CONTAIN = 4
}

class BackgroundSizePair implements ICloneable<BackgroundSizePair> {
  public static of(value: string): BackgroundSizePair {
    const parts = value.split(/\s+/);
    const x = this.toBaseValue(parts[0]);
    const y = parts.length > 1 ? this.toBaseValue(parts[1]) : BaseValue.of('50%');
    return new BackgroundSizePair(x, y);
  }

  public static toBaseValue(value: string): BaseValue {
    value = value.toLowerCase();
    if (value === 'left' || value === 'top') {
      return BaseValue.of('0%');
    } else if (value === 'right' || value === 'bottom') {
      return BaseValue.of('100%');
    } else if (value === 'center') {
      return BaseValue.of('50%');
    } else {
      return BaseValue.of(value);
    }
  }

  public x: BaseValue;
  public y: BaseValue;
  constructor(x: BaseValue, y: BaseValue) {
    this.x = x;
    this.y = y;
  }

  public clone(): BackgroundSizePair {
    return new BackgroundSizePair(this.x.clone(), this.y.clone());
  }
}

const REG_PARTS = /([^\s]+\([^\)]+\)|[^\s]+)/g;
const REG_PARAMETERS = /("[^"]+"|'[^']+'|[^,]+)/g;

const REG_IMAGE = /^(url|linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient)\(([^\)]+)\)$/i;
const REG_POSITION_X = /^(left|right|[0-9\.]+px|[0-9\.]+%)$/i;
const REG_POSITION_Y = /^(top|bottom|[0-9\.]+px|[0-9\.]+%)$/i;

export class Background {
  public static of(value: string): Background | undefined {
    const parts = this.split(value);
    const bg = new Background();
    for (const part of parts) {
      let image;
      let repeat;
      let clip;
      let positionX;
      let positionY;
      const matches = StringUtils.matchAll(part, REG_PARTS);
      for (const match of matches) {
        const val = match[1].trim();
        // Try color
        if (!bg.color) {
          const color = Color.of(val, true);
          bg.color = color;
          continue;
        }

        // Try image
        if (!image) {
          image = this.parseImage(val);
          continue;
        }

        // Try repeat
        if (!repeat) {
          repeat = BackgroundRepeatPair.of(val);
          if (repeat) {
            continue;
          }
        }

        // Try clip
        if (!clip) {
          clip = EnumUtils.fromStringOrUndefined<BackgroundClip>(BackgroundClip, val);
          if (clip) {
            continue;
          }
        }

        // Try position
        if (!positionX) {
          if (REG_POSITION_X.test(val)) {
            positionX = BackgroundSizePair.toBaseValue(val);
            continue;
          }
        } else if (!positionY) {
          if (REG_POSITION_Y.test(val)) {
            positionY = BackgroundSizePair.toBaseValue(val);
            continue;
          }
        }
        console.warn('unknow part: ' + val);
      }

      if (image) {
        bg.image.push(image);
      }
      if (repeat) {
        bg.repeat.push(repeat);
      }
      if (clip) {
        bg.clip.push(clip);
      }
      if (positionX) {
        if (!positionY) {
          positionY = BaseValue.of('50%');
        }
        bg.position.push(new BackgroundSizePair(positionX, positionY));
      }
    }

    return bg;
  }
  private static trimParameter(value: string): string {
    value = value.trim();
    if (
      value.length > 1 &&
      ((value[0] === '"' && value[value.length - 1] === '"') ||
        (value[0] === "'" && value[value.length - 1] === "'"))
    ) {
      return value.substring(1, value.length - 1);
    } else {
      return value;
    }
  }

  private static parseParameters(value: string): string[] {
    const matches = StringUtils.matchAll(value, REG_PARAMETERS);
    const result = [];
    for (const match of matches) {
      const val = match[1].trim();
      result.push(this.trimParameter(val));
    }
    return result;
  }

  private static parseImage(value: string): IBackgroundSource | undefined {
    const matched = value.match(REG_IMAGE);
    if (!matched) {
      return undefined;
    }
    const type = matched[1];
    const params = matched[2];
    switch (type) {
      case 'url':
        return URLSource.of(this.parseParameters(params));
      case 'linear-gradient':
        return LinearGradientSource.of(this.parseParameters(params));
    }
    return undefined;
  }

  private static split(value: string): string[] {
    const result: string[] = [];
    let begin = 0;
    let inbrackets = false;
    const size = value.length;
    for (let i = 0; i < size; ++i) {
      const ch = value[i];
      if (inbrackets) {
        if (ch === ')') {
          inbrackets = false;
        }
      } else if (ch === '(') {
        inbrackets = true;
      } else if (ch === ',') {
        if (begin < i) {
          result.push(value.substring(begin, i).trim());
        }
        begin = i + 1;
      }
    }
    if (begin < size) {
      result.push(value.substring(begin).trim());
    }
    return result;
  }

  private static copyArray<T>(src: T[], dest: T[]) {
    for (const item of src) {
      dest.push(item);
    }
  }

  private static cloneArray<T>(src: (ICloneable<T> | undefined)[], dest: (T | undefined)[]) {
    for (const item of src) {
      if (!item) {
        dest.push(undefined);
      } else {
        dest.push(item.clone());
      }
    }
  }

  private static getFromArray<T>(arr: T[], idx: number, defaultVal: T) {
    return idx >= arr.length ? defaultVal : arr[idx];
  }

  public color?: Color;
  public attachment: BackgroundAttachment[] = [];
  public image: (IBackgroundSource | undefined)[] = [];
  public repeat: BackgroundRepeatPair[] = [];
  public clip: BackgroundClip[] = [];
  public origin: BackgroundOrigin[] = [];
  public size: BackgroundSizePair[] = [];
  public position: BackgroundSizePair[] = [];
  public blendMode: string[] = [];

  public setColor(value: string | Color) {
    this.color = value instanceof Color ? value : Color.of(value);
  }

  public setAttachment(value: string) {
    const parts = Background.split(value);
    this.attachment.length = 0;
    for (const _ of parts) {
      // TODO: support others later.
      this.attachment.push(BackgroundAttachment.SCROLL);
    }
  }

  public setImage(value: string) {
    const parts = Background.split(value);
    this.image.length = 0;
    for (const part of parts) {
      this.image.push(Background.parseImage(part));
    }
  }

  public setBlendMode(value: string) {
    const parts = Background.split(value);
    this.blendMode.length = 0;
    for (const part of parts) {
      this.blendMode.push(part);
    }
  }

  public setRepeat(value: string) {
    const parts = Background.split(value);
    this.repeat.length = 0;
    for (const part of parts) {
      const repeat =
        BackgroundRepeatPair.of(part) ||
        new BackgroundRepeatPair(BackgroundRepeat.NO_REPEAT, BackgroundRepeat.NO_REPEAT);
      this.repeat.push(repeat);
    }
  }

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

  public setOrigin(value: string) {
    const parts = Background.split(value);
    this.origin.length = 0;
    for (const part of parts) {
      const origin = EnumUtils.fromString<BackgroundOrigin>(
        BackgroundOrigin,
        part,
        BackgroundOrigin.BORDER_BOX
      );
      this.origin.push(origin);
    }
  }

  public setSize(value: string) {
    const parts = Background.split(value);
    this.size.length = 0;
    for (const part of parts) {
      this.size.push(BackgroundSizePair.of(part));
    }
  }

  public setPosition(value: string) {
    const parts = Background.split(value);
    this.position.length = 0;
    for (const part of parts) {
      this.position.push(BackgroundSizePair.of(part));
    }
  }

  public draw(
    target: XObject,
    ctx: CanvasRenderingContext2D,
    outerRect: RoundRect,
    innerRect: RoundRect
  ) {
    // TODO: support blend mode
    if (this.image.length === 0 && this.color) {
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
      const origin = Background.getFromArray(this.origin, i, BackgroundOrigin.BORDER_BOX);
      let originRect;
      switch (origin) {
        case BackgroundOrigin.PADDING_BOX: {
          originRect = target.getPaddingRect();
          break;
        }
        case BackgroundOrigin.CONTENT_BOX: {
          originRect = target.getContentRect();
          break;
        }
        default:
          originRect = new Rect(0, 0, target.rect.width, target.rect.height);
          break;
      }

      let w = originRect.width;
      let h = originRect.height;
      // Image size
      if (this.size.length > i) {
        const size = this.size[i];
        w = size.x.getValue(originRect.width);
        h = size.y.getValue(originRect.height);
      }

      const img = source.getSource(w, h);
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
      let srcScaleX = 1;
      let srcScaleY = 1;
      let destX = originRect.x;
      let destY = originRect.y;

      // Image size
      if (this.size.length > i) {
        const size = this.size[i];
        scaledWidth = size.x.getValue(originRect.width);
        scaledHeight = size.y.getValue(originRect.height);
        srcScaleX = scaledWidth / srcWidth;
        srcScaleY = scaledHeight / srcHeight;
      }

      if (scaledWidth < 1 || scaledHeight < 1) {
        continue;
      }

      // Repeat
      let repeatX = BackgroundRepeat.NO_REPEAT;
      let repeatY = BackgroundRepeat.NO_REPEAT;
      if (this.repeat.length > i) {
        repeatX = this.repeat[i].x;
        repeatY = this.repeat[i].y;
      }

      let gapX = 0;
      let gapY = 0;
      if (repeatX === BackgroundRepeat.SPACE) {
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
      } else if (repeatX === BackgroundRepeat.ROUND) {
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
          if (position.x.unit === BaseValueUnit.PERCENTAGE) {
            destX += ((originRect.width - scaledWidth) * position.x.numberValue) / 100;
          } else {
            destX += position.x.numberValue;
          }
        }
        if (repeatX === BackgroundRepeat.REPEAT) {
          while (destX > clipRect.x) {
            destX -= scaledWidth;
          }
        }
      }

      if (repeatY === BackgroundRepeat.SPACE) {
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
      } else if (repeatY === BackgroundRepeat.ROUND) {
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
          if (position.y.unit === BaseValueUnit.PERCENTAGE) {
            destY += ((originRect.height - scaledHeight) * position.y.numberValue) / 100;
          } else {
            destY += position.y.numberValue;
          }
        }
        if (repeatY === BackgroundRepeat.REPEAT) {
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
        } while (x < clipRight && repeatX !== BackgroundRepeat.NO_REPEAT);
        destY += gapY + scaledHeight;
      } while (destY < clipBottom && repeatY !== BackgroundRepeat.NO_REPEAT);
    }
  }

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
