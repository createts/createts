import {
    AnimationProps, AnimationValues, AnimationValueType, IAnimatable
} from '../animation/Animation';
import { BaseValue, BaseValueUnit } from '../base/BaseValue';
import { Color } from '../base/Color';
import { XObject } from '../components/XObject';
import { Base64 } from '../utils/Base64';
import { EnumUtils } from '../utils/EnumUtils';
import { StringUtils } from '../utils/StringUtils';
import { Background } from './Background';
import { Border } from './Border';
import { Font, FontStyle, FontVariant, FontWeight } from './Font';
import { LineHeight } from './LineHeight';
import { Shadow } from './Shadow';

export enum BoxSizing {
  CONTENT_BOX = 'content-box',
  BORDER_BOX = 'border-box'
}

export enum TextAlign {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center'
}

export enum Position {
  STATIC = 'static',
  RELATIVE = 'relative',
  ABSOLUTE = 'absolute',
  FIXED = 'fixed'
}

export enum Display {
  INLINE = 'inline',
  BLOCK = 'block',
  NONE = 'none'
}

export enum Overflow {
  VISIBLE = 'visible',
  HIDDEN = 'hidden'
}

export enum TextBorderPosition {
  OUTER = 'outer',
  INNER = 'inner'
}

export enum PointerEvents {
  AUTO = 'auto',
  NONE = 'none'
}

export enum Visibility {
  VISIBLE = 'visible',
  HIDDEN = 'hidden'
}

const REG_ATTRS = /([^\s:;]+)[\s]*:[\s]*([^;]+)/gm;

export class Style {
  public static of(value: string): Style {
    const style = new Style();
    return style.apply(this.parse(value));
  }

  public static parse(value: string): { [key: string]: string } {
    const attrs: { [key: string]: string } = {};
    const matches = StringUtils.matchAll(value, REG_ATTRS);
    for (const match of matches) {
      attrs[match[1].toLowerCase()] = match[2];
    }
    return attrs;
  }

  public width?: BaseValue;
  public height?: BaseValue;
  public position: Position = Position.STATIC;
  public display: Display = Display.INLINE;
  public left?: BaseValue;
  public right?: BaseValue;
  public top?: BaseValue;
  public bottom?: BaseValue;
  public paddingTop?: BaseValue;
  public paddingRight?: BaseValue;
  public paddingBottom?: BaseValue;
  public paddingLeft?: BaseValue;
  public marginTop?: BaseValue;
  public marginRight?: BaseValue;
  public marginBottom?: BaseValue;
  public marginLeft?: BaseValue;
  public perspectiveOriginX: BaseValue = BaseValue.of('50%');
  public perspectiveOriginY: BaseValue = BaseValue.of('50%');
  public transformX: BaseValue = BaseValue.ZERO;
  public transformY: BaseValue = BaseValue.ZERO;
  public alpha: number = 1;
  public rotation: number = 0;
  public scaleX: number = 1;
  public scaleY: number = 1;
  public skewX: number = 0;
  public skewY: number = 0;
  public shadow?: Shadow;
  public visibility: Visibility = Visibility.VISIBLE;
  public background?: Background;
  public boxSizing: BoxSizing = BoxSizing.CONTENT_BOX;
  public color: Color = Color.BLACK;
  public font?: Font;
  public lineHeight?: LineHeight;
  public textAlign: TextAlign = TextAlign.LEFT;
  public borderRadiusTop?: BaseValue;
  public borderRadiusRight?: BaseValue;
  public borderRadiusBottom?: BaseValue;
  public borderRadiusLeft?: BaseValue;
  public borderTop?: Border;
  public borderRight?: Border;
  public borderBottom?: Border;
  public borderLeft?: Border;
  public overflow: Overflow = Overflow.VISIBLE;
  public compositeOperation?: string;
  public aspectRatio?: number;
  public filter?: string;
  public cursor?: string;
  public pointerEvents: PointerEvents = PointerEvents.AUTO;
  // Text style
  public textBorder?: Border;
  public textBorderPosition?: TextBorderPosition = TextBorderPosition.OUTER;
  public textShadow?: Shadow;

  apply(attrs: { [key: string]: string | number }): Style {
    for (const k in attrs) {
      const key = this.normalize(k);
      const value = attrs[k] + '';
      switch (key) {
        case 'width':
        case 'height':
          this[key] = BaseValue.of(value);
          break;
        case 'position':
          this.position = EnumUtils.fromString<Position>(Position, value, Position.STATIC);
          break;
        case 'display':
          this.display = EnumUtils.fromString<Display>(Display, value, Display.INLINE);
          break;
        case 'left':
        case 'right':
        case 'top':
        case 'bottom':
          this[key] = BaseValue.of(value);
          break;
        case 'padding':
          const paddings = Style.parse4Dirs(value);
          if (paddings) {
            this.paddingTop = paddings[0];
            this.paddingRight = paddings[1];
            this.paddingBottom = paddings[2];
            this.paddingLeft = paddings[3];
          }
          break;
        case 'paddingTop':
        case 'paddingRight':
        case 'paddingBottom':
        case 'paddingLeft':
          this[key] = BaseValue.of(value);
          break;
        case 'margin':
          const margins = Style.parse4Dirs(value);
          if (margins) {
            this.marginTop = margins[0];
            this.marginRight = margins[1];
            this.marginBottom = margins[2];
            this.marginLeft = margins[3];
          }
          break;
        case 'marginTop':
        case 'marginRight':
        case 'marginBottom':
        case 'marginLeft':
          this[key] = BaseValue.of(value);
          break;
        case 'perspectiveOrigin': {
          const pieces = value.split(/\s+/);
          if (pieces.length === 1) {
            if (value === 'auto') {
              this.perspectiveOriginX = BaseValue.of('50%');
              this.perspectiveOriginY = BaseValue.of('50%');
            } else {
              this.perspectiveOriginX = BaseValue.of(value);
              this.perspectiveOriginY = BaseValue.of(value);
            }
          } else if (pieces.length > 1) {
            this.perspectiveOriginX =
              pieces[0] === 'auto' ? BaseValue.of('50%') : BaseValue.of(pieces[0]);
            this.perspectiveOriginY =
              pieces[1] === 'auto' ? BaseValue.of('50%') : BaseValue.of(pieces[1]);
          }
          break;
        }
        case 'transform': {
          const pieces = value.split(/\s+/);
          if (pieces.length === 1) {
            if (value === 'auto') {
              this.transformX = BaseValue.of('50%');
              this.transformY = BaseValue.of('50%');
            } else {
              this.transformX = BaseValue.of(value);
              this.transformY = BaseValue.of(value);
            }
          } else if (pieces.length > 1) {
            this.transformX = pieces[0] === 'auto' ? BaseValue.of('50%') : BaseValue.of(pieces[0]);
            this.transformY = pieces[1] === 'auto' ? BaseValue.of('50%') : BaseValue.of(pieces[1]);
          }
          break;
        }
        case 'perspectiveOriginX':
        case 'perspectiveOriginY':
        case 'transformX':
        case 'transformY':
          this[key] = value === 'auto' ? BaseValue.of('50%') : BaseValue.of(value);
          break;
        case 'scaleX':
        case 'scaleY':
        case 'skewX':
        case 'skewY':
        case 'alpha':
        case 'aspectRatio':
        case 'rotation': {
          const numberValue = parseFloat(value);
          if (isNaN(numberValue)) {
            console.warn(`invalid ${key} value: ${value}`);
          } else {
            this[key] = numberValue;
          }
          break;
        }
        case 'scale': {
          const numberValue = parseFloat(value);
          if (isNaN(numberValue)) {
            console.warn(`invalid ${key} value: ${value}`);
          } else {
            this.scaleX = this.scaleY = numberValue;
          }
          break;
        }
        case 'visibility':
          this.visibility = EnumUtils.fromString<Visibility>(Visibility, value, Visibility.VISIBLE);
          break;
        case 'background':
          this.background = Background.of(value);
          break;
        case 'backgroundClip':
          if (!this.background) {
            this.background = new Background();
          }
          this.background.setClip(value);
          break;
        case 'backgroundColor':
          if (!this.background) {
            this.background = new Background();
          }
          this.background.setColor(value);
          break;
        case 'backgroundAttachment':
          if (!this.background) {
            this.background = new Background();
          }
          this.background.setAttachment(value);
          break;
        case 'backgroundImage':
          if (!this.background) {
            this.background = new Background();
          }
          this.background.setImage(value);
          break;
        case 'backgroundRepeat':
          if (!this.background) {
            this.background = new Background();
          }
          this.background.setRepeat(value);
          break;
        case 'backgroundOrigin':
          if (!this.background) {
            this.background = new Background();
          }
          this.background.setOrigin(value);
          break;
        case 'backgroundSize':
          if (!this.background) {
            this.background = new Background();
          }
          this.background.setSize(value);
          break;
        case 'backgroundPosition':
          if (!this.background) {
            this.background = new Background();
          }
          this.background.setPosition(value);
          break;
        case 'boxSizing':
          this.boxSizing = EnumUtils.fromString<BoxSizing>(BoxSizing, value, BoxSizing.CONTENT_BOX);
          break;
        case 'color': {
          const color = Color.of(value);
          if (color) {
            this.color = color;
          }
          break;
        }
        case 'font':
          this.font = Font.of(value);
          break;
        case 'fontFamily':
          if (!this.font) {
            this.font = new Font();
          }
          this.font.family = value;
          break;
        case 'fontWeight':
          if (!this.font) {
            this.font = new Font();
          }
          this.font.weight = EnumUtils.fromString<FontWeight>(FontWeight, value, FontWeight.NORMAL);
          break;
        case 'fontStyle':
          if (!this.font) {
            this.font = new Font();
          }
          this.font.style = EnumUtils.fromString<FontStyle>(FontStyle, value, FontStyle.NORMAL);
          break;
        case 'fontVariant':
          if (!this.font) {
            this.font = new Font();
          }
          this.font.variant = EnumUtils.fromString<FontVariant>(
            FontVariant,
            value,
            FontVariant.NORMAL
          );
          break;
        case 'fontSize': {
          const numberValue = parseFloat(value);
          if (isNaN(numberValue)) {
            console.warn(`invalid ${key} value: ${value}`);
          } else {
            if (!this.font) {
              this.font = new Font();
            }
            this.font.size = numberValue;
          }
          break;
        }
        case 'lineHeight':
          this.lineHeight = LineHeight.of(value);
        case 'textAlign':
          this.textAlign = EnumUtils.fromString<TextAlign>(TextAlign, value, TextAlign.LEFT);
          break;
        case 'borderRadius':
          const borderRadius = Style.parse4Dirs(value);
          if (borderRadius) {
            this.borderRadiusTop = borderRadius[0];
            this.borderRadiusRight = borderRadius[1];
            this.borderRadiusBottom = borderRadius[2];
            this.borderRadiusLeft = borderRadius[3];
          }
          break;
        case 'borderRadiusTop':
        case 'borderRadiusRight':
        case 'borderRadiusBottom':
        case 'borderRadiusLeft':
          this[key] = BaseValue.of(value);
          break;
        case 'border':
          this.borderTop = this.borderRight = this.borderLeft = this.borderBottom = Border.of(
            value
          );
          break;
        case 'borderTop':
        case 'borderRight':
        case 'borderLeft':
        case 'borderBottom':
        case 'textBorder':
          this[key] = Border.of(value);
          break;
        case 'overflow':
          this.overflow = EnumUtils.fromString(Overflow, value, Overflow.VISIBLE);
          break;
        case 'compositeOperation':
          this.compositeOperation = value;
          break;
        case 'filter':
          this.filter = value;
          break;
        case 'shadow':
        case 'textShadow':
          this[key] = Shadow.of(value);
          break;
        case 'textBorderPosition':
          this.textBorderPosition = EnumUtils.fromString(
            TextBorderPosition,
            value,
            TextBorderPosition.OUTER
          );
          break;
        case 'pointerEvents':
          this.pointerEvents = EnumUtils.fromString(PointerEvents, value, PointerEvents.AUTO);
          break;
        case 'cursor':
          this.cursor = value;
          break;
        default:
          console.warn('unknown style:' + k + ' value:' + value);
          break;
      }
    }
    return this;
  }

  public getSnapshotForAnimation(target: XObject, props: AnimationValues): AnimationProps {
    const result: AnimationProps = {};
    for (const name in props) {
      this.fillSnapshotForAnimation(target, name, props[name], result);
    }
    return result;
  }

  public applyAnimationResult(result: AnimationValues) {
    for (const name in result) {
      if (name === 'backgroundColor') {
        if (!this.background) {
          this.background = new Background();
        }
        this.background.color = result[name] as Color;
      } else {
        (this as any)[name] = result[name];
      }
    }
  }

  clone(): Style {
    const cloned = new Style();
    cloned.width = this.width;
    cloned.height = this.height;
    cloned.position = this.position;
    cloned.display = this.display;
    cloned.left = this.left;
    cloned.right = this.right;
    cloned.top = this.top;
    cloned.bottom = this.bottom;
    if (this.paddingTop) {
      cloned.paddingTop = this.paddingTop.clone();
    }
    if (this.paddingRight) {
      cloned.paddingRight = this.paddingRight.clone();
    }
    if (this.paddingBottom) {
      cloned.paddingBottom = this.paddingBottom.clone();
    }
    if (this.paddingLeft) {
      cloned.paddingLeft = this.paddingLeft.clone();
    }
    if (this.marginTop) {
      cloned.marginTop = this.marginTop.clone();
    }
    if (this.marginRight) {
      cloned.marginRight = this.marginRight.clone();
    }
    if (this.marginBottom) {
      cloned.marginBottom = this.marginBottom.clone();
    }
    if (this.marginLeft) {
      cloned.marginLeft = this.marginLeft.clone();
    }
    cloned.perspectiveOriginX = this.perspectiveOriginX;
    cloned.perspectiveOriginY = this.perspectiveOriginY;
    cloned.transformX = this.transformX;
    cloned.transformY = this.transformY;
    cloned.alpha = this.alpha;
    cloned.rotation = this.rotation;
    cloned.scaleX = this.scaleX;
    cloned.scaleY = this.scaleY;
    cloned.skewX = this.skewX;
    cloned.skewY = this.skewY;
    if (this.shadow) {
      cloned.shadow = this.shadow.clone();
    }
    if (this.textShadow) {
      cloned.textShadow = this.textShadow.clone();
    }
    cloned.textBorderPosition = this.textBorderPosition;
    if (this.textBorder) {
      cloned.textBorder = this.textBorder.clone();
    }
    cloned.visibility = this.visibility;
    if (this.background) {
      cloned.background = this.background.clone();
    }
    cloned.boxSizing = this.boxSizing;
    cloned.color = this.color.clone();
    if (this.font) {
      cloned.font = this.font.clone();
    }
    cloned.lineHeight = this.lineHeight;
    cloned.textAlign = this.textAlign;

    if (this.borderTop) {
      cloned.borderTop = this.borderTop.clone();
    }
    if (this.borderRight) {
      cloned.borderRight = this.borderRight.clone();
    }
    if (this.borderBottom) {
      cloned.borderBottom = this.borderBottom.clone();
    }
    if (this.borderLeft) {
      cloned.borderLeft = this.borderLeft.clone();
    }
    if (this.borderRadiusTop) {
      cloned.borderRadiusTop = this.borderRadiusTop.clone();
    }
    if (this.borderRadiusRight) {
      cloned.borderRadiusRight = this.borderRadiusRight.clone();
    }
    if (this.borderRadiusBottom) {
      cloned.borderRadiusBottom = this.borderRadiusBottom.clone();
    }
    if (this.borderRadiusLeft) {
      cloned.borderRadiusLeft = this.borderRadiusLeft.clone();
    }
    cloned.overflow = this.overflow;
    cloned.compositeOperation = this.compositeOperation;
    cloned.aspectRatio = this.aspectRatio;
    cloned.filter = this.filter;
    cloned.cursor = this.cursor;
    cloned.pointerEvents = this.pointerEvents;
    return cloned;
  }

  private fillSnapshotForAnimation(
    target: XObject,
    name: string,
    to: string | number | IAnimatable<any>,
    result: AnimationProps
  ) {
    const key = this.normalize(name);
    switch (key) {
      case 'scaleX':
      case 'scaleY':
      case 'alpha':
      case 'rotation':
      case 'skewX':
      case 'skewY':
      case 'aspectRatio':
        {
          let numberTo = NaN;
          if (typeof to === 'number') {
            numberTo = to;
          } else if (typeof to === 'string') {
            numberTo = parseFloat(to);
          }
          if (isNaN(numberTo)) {
            console.warn(`invalid value (${to}) for ${key}`);
            break;
          }
          result[key] = {
            from: this[key],
            to: numberTo,
            type: AnimationValueType.NUMBER
          };
        }
        break;

      case 'paddingRight':
      case 'paddingLeft':
      case 'marginRight':
      case 'marginLeft':
      case 'borderRadiusRight':
      case 'borderRadiusLeft':
      case 'transformX':
      case 'width':
      case 'left':
      case 'right':
      case 'perspectiveOriginX': {
        let toBaseValue: BaseValue | undefined;
        if (typeof to === 'number' || typeof to === 'string') {
          toBaseValue = BaseValue.of(to);
        } else if (to instanceof BaseValue) {
          toBaseValue = to;
        }
        if (!toBaseValue) {
          console.warn(`invalid value (${to}) for ${key}`);
          break;
        }
        const from: BaseValue = this[key] || BaseValue.of(0);
        if (toBaseValue.unit === BaseValueUnit.PERCENTAGE) {
          result[key] = {
            from: from.toPercentage(target.getWidth()),
            to: toBaseValue,
            type: AnimationValueType.ANIMATABLE
          };
        } else {
          result[key] = {
            from: from.toAbsolute(target.getWidth()),
            to: toBaseValue,
            type: AnimationValueType.ANIMATABLE
          };
        }
        break;
      }
      case 'paddingTop':
      case 'paddingBottom':
      case 'marginTop':
      case 'marginBottom':
      case 'borderRadiusTop':
      case 'borderRadiusBottom':
      case 'transformY':
      case 'height':
      case 'top':
      case 'bottom':
      case 'perspectiveOriginY': {
        let toBaseValue: BaseValue | undefined;
        if (typeof to === 'number' || typeof to === 'string') {
          toBaseValue = BaseValue.of(to);
        } else if (to instanceof BaseValue) {
          toBaseValue = to;
        }
        if (!toBaseValue) {
          console.warn(`invalid value (${to}) for ${key}`);
          break;
        }
        const from: BaseValue = this[key] || BaseValue.of(0);
        if (toBaseValue.unit === BaseValueUnit.PERCENTAGE) {
          result[key] = {
            from: from.toPercentage(target.getHeight()),
            to: toBaseValue,
            type: AnimationValueType.ANIMATABLE
          };
        } else {
          result[key] = {
            from: from.toAbsolute(target.getHeight()),
            to: toBaseValue,
            type: AnimationValueType.ANIMATABLE
          };
        }
        break;
      }
      case 'color': {
        let color: Color | undefined;
        if (typeof to === 'string') {
          color = Color.of(to);
        } else if (to instanceof Color) {
          color = to;
        }
        if (!color) {
          console.warn(`invalid value (${to}) for ${key}`);
          break;
        }
        result[key] = {
          from: this[key],
          to: color,
          type: AnimationValueType.ANIMATABLE
        };
        break;
      }
      case 'backgroundColor': {
        let color: Color | undefined;
        if (typeof to === 'string') {
          color = Color.of(to);
        } else if (to instanceof Color) {
          color = to;
        }
        if (!color) {
          console.warn(`invalid value (${to}) for ${key}`);
          break;
        }
        result[key] = {
          from: (this.background && this.background.color) || Color.WHITE,
          to: color,
          type: AnimationValueType.ANIMATABLE
        };
        break;
      }
      case 'padding':
        this.fillSnapshotForAnimation(target, 'paddingTop', to, result);
        this.fillSnapshotForAnimation(target, 'paddingRight', to, result);
        this.fillSnapshotForAnimation(target, 'paddingBottom', to, result);
        this.fillSnapshotForAnimation(target, 'paddingLeft', to, result);
        break;
      case 'margin':
        this.fillSnapshotForAnimation(target, 'marginTop', to, result);
        this.fillSnapshotForAnimation(target, 'marginRight', to, result);
        this.fillSnapshotForAnimation(target, 'marginBottom', to, result);
        this.fillSnapshotForAnimation(target, 'marginLeft', to, result);
        break;
      case 'perspectiveOrigin':
        this.fillSnapshotForAnimation(target, 'perspectiveOriginX', to, result);
        this.fillSnapshotForAnimation(target, 'perspectiveOriginY', to, result);
        break;
      case 'transform':
        this.fillSnapshotForAnimation(target, 'transformX', to, result);
        this.fillSnapshotForAnimation(target, 'transformY', to, result);
        break;
      case 'scale':
        this.fillSnapshotForAnimation(target, 'scaleX', to, result);
        this.fillSnapshotForAnimation(target, 'scaleY', to, result);
        break;
      case 'borderRadius':
        this.fillSnapshotForAnimation(target, 'borderRadiusTop', to, result);
        this.fillSnapshotForAnimation(target, 'borderRadiusRight', to, result);
        this.fillSnapshotForAnimation(target, 'borderRadiusBottom', to, result);
        this.fillSnapshotForAnimation(target, 'borderRadiusLeft', to, result);
        break;
      case 'borderLeft':
      case 'borderRight':
      case 'borderTop':
      case 'borderBottom':
      case 'textBorder':
        {
          let border: Border | undefined;
          if (typeof to === 'string') {
            border = Border.of(to);
          } else if (to instanceof Border) {
            border = to;
          }
          if (!border) {
            console.warn(`invalid value (${to}) for ${key}`);
            break;
          }
          result[key] = {
            from: this[key] || Border.DEFAULT,
            to: border,
            type: AnimationValueType.ANIMATABLE
          };
        }
        break;
      case 'border':
        this.fillSnapshotForAnimation(target, 'borderLeft', to, result);
        this.fillSnapshotForAnimation(target, 'borderRight', to, result);
        this.fillSnapshotForAnimation(target, 'borderTop', to, result);
        this.fillSnapshotForAnimation(target, 'borderBottom', to, result);
        break;
      case 'shadow':
      case 'textShadow':
        {
          let shadow: Shadow | undefined;
          if (typeof to === 'string') {
            shadow = Shadow.of(to);
          } else if (to instanceof Shadow) {
            shadow = to;
          }
          if (!shadow) {
            console.warn(`invalid value (${to}) for ${key}`);
            break;
          }
          result[key] = {
            from: this[key] || new Shadow(0, 0, 0, Color.WHITE),
            to: shadow,
            type: AnimationValueType.ANIMATABLE
          };
        }
        break;
      default:
        console.warn('unsupported animation attribute:' + name);
        break;
    }
  }

  private static parse4Dirs(value: string): BaseValue[] | undefined {
    const pieces = value.split(/\s+/);
    if (pieces.length === 1) {
      return [
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[0])
      ];
    } else if (pieces.length === 2) {
      return [
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[1]),
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[1])
      ];
    } else if (pieces.length === 3) {
      return [
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[1]),
        BaseValue.of(pieces[2]),
        BaseValue.of(pieces[1])
      ];
    } else if (pieces.length === 4) {
      return [
        BaseValue.of(pieces[0]),
        BaseValue.of(pieces[1]),
        BaseValue.of(pieces[2]),
        BaseValue.of(pieces[3])
      ];
    } else {
      return undefined;
    }
  }

  private normalize(key: string): string {
    const pieces = key.split(/-/);
    let normalized = '';
    for (const piece of pieces) {
      if (normalized === '') {
        normalized = piece;
      } else {
        normalized += piece.substring(0, 1).toUpperCase() + piece.substring(1);
      }
    }
    return normalized;
  }
}
