function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { AnimationValueType, isIAnimatable } from '../animation/Animation';
import { BaseValue, BaseValueUnit } from '../base/BaseValue';
import { Color } from '../base/Color';
import { EnumUtils } from '../utils/EnumUtils';
import { StringUtils } from '../utils/StringUtils';
import { Background } from './Background';
import { Border } from './Border';
import { BorderRadius } from './BorderRadius';
import { Font, FontStyle, FontVariant, FontWeight } from './Font';
import { LineHeight } from './LineHeight';
import { Shadow } from './Shadow';
export var BoxSizing;

(function (BoxSizing) {
  BoxSizing["CONTENT_BOX"] = "content-box";
  BoxSizing["BORDER_BOX"] = "border-box";
})(BoxSizing || (BoxSizing = {}));

export var TextAlign;

(function (TextAlign) {
  TextAlign["LEFT"] = "left";
  TextAlign["RIGHT"] = "right";
  TextAlign["CENTER"] = "center";
})(TextAlign || (TextAlign = {}));

export var VerticalAlign;

(function (VerticalAlign) {
  VerticalAlign["TOP"] = "top";
  VerticalAlign["BOTTOM"] = "bottom";
  VerticalAlign["MIDDLE"] = "middle";
})(VerticalAlign || (VerticalAlign = {}));

export var Position;

(function (Position) {
  Position["STATIC"] = "static";
  Position["RELATIVE"] = "relative";
  Position["ABSOLUTE"] = "absolute";
  Position["FIXED"] = "fixed";
})(Position || (Position = {}));

export var Display;

(function (Display) {
  Display["INLINE"] = "inline";
  Display["BLOCK"] = "block";
  Display["NONE"] = "none";
})(Display || (Display = {}));

export var Overflow;

(function (Overflow) {
  Overflow["VISIBLE"] = "visible";
  Overflow["HIDDEN"] = "hidden";
})(Overflow || (Overflow = {}));

export var TextBorderPosition;

(function (TextBorderPosition) {
  TextBorderPosition["OUTER"] = "outer";
  TextBorderPosition["INNER"] = "inner";
})(TextBorderPosition || (TextBorderPosition = {}));

export var PointerEvents;

(function (PointerEvents) {
  PointerEvents["AUTO"] = "auto";
  PointerEvents["NONE"] = "none";
  PointerEvents["CROSS"] = "cross";
  PointerEvents["BLOCK"] = "block";
})(PointerEvents || (PointerEvents = {}));

export var Visibility;

(function (Visibility) {
  Visibility["VISIBLE"] = "visible";
  Visibility["HIDDEN"] = "hidden";
})(Visibility || (Visibility = {}));

var REG_ATTRS = /([^\s:;]+)[\s]*:[\s]*([^;]+)/gm;
export var Style = /*#__PURE__*/function () {
  function Style() {
    _classCallCheck(this, Style);

    this.width = void 0;
    this.minWidth = void 0;
    this.maxWidth = void 0;
    this.height = void 0;
    this.minHeight = void 0;
    this.maxHeight = void 0;
    this.position = Position.STATIC;
    this.display = Display.INLINE;
    this.left = void 0;
    this.right = void 0;
    this.top = void 0;
    this.bottom = void 0;
    this.paddingTop = void 0;
    this.paddingRight = void 0;
    this.paddingBottom = void 0;
    this.paddingLeft = void 0;
    this.marginTop = void 0;
    this.marginRight = void 0;
    this.marginBottom = void 0;
    this.marginLeft = void 0;
    this.perspectiveOriginX = BaseValue.of('50%');
    this.perspectiveOriginY = BaseValue.of('50%');
    this.transformX = BaseValue.ZERO;
    this.transformY = BaseValue.ZERO;
    this.alpha = 1;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.skewX = 0;
    this.skewY = 0;
    this.shadow = void 0;
    this.visibility = Visibility.VISIBLE;
    this.background = void 0;
    this.boxSizing = BoxSizing.CONTENT_BOX;
    this.color = Color.BLACK;
    this.font = void 0;
    this.lineHeight = void 0;
    this.textAlign = void 0;
    this.verticalAlign = void 0;
    this.borderTopLeftRadius = void 0;
    this.borderTopRightRadius = void 0;
    this.borderBottomLeftRadius = void 0;
    this.borderBottomRightRadius = void 0;
    this.borderTop = void 0;
    this.borderRight = void 0;
    this.borderBottom = void 0;
    this.borderLeft = void 0;
    this.overflow = Overflow.VISIBLE;
    this.compositeOperation = void 0;
    this.aspectRatio = void 0;
    this.filter = void 0;
    this.cursor = void 0;
    this.pointerEvents = PointerEvents.AUTO;
    this.textBorder = void 0;
    this.textBorderPosition = TextBorderPosition.OUTER;
    this.textShadow = void 0;
  }

  _createClass(Style, [{
    key: "apply",
    value: function apply(attrs) {
      for (var k in attrs) {
        var _key = this.normalize(k);

        var value = attrs[k] + '';

        switch (_key) {
          case 'width':
          case 'minWidth':
          case 'maxWidth':
          case 'height':
          case 'minHeight':
          case 'maxHeight':
            this[_key] = BaseValue.of(value);
            break;

          case 'position':
            this.position = EnumUtils.fromString(Position, value, Position.STATIC);
            break;

          case 'display':
            this.display = EnumUtils.fromString(Display, value, Display.INLINE);
            break;

          case 'left':
          case 'right':
          case 'top':
          case 'bottom':
            this[_key] = BaseValue.of(value);
            break;

          case 'padding':
            var paddings = Style.parse4Dirs(value);

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
            this[_key] = BaseValue.of(value);
            break;

          case 'margin':
            var margins = Style.parse4Dirs(value);

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
            this[_key] = BaseValue.of(value);
            break;

          case 'perspectiveOrigin':
            {
              var pieces = value.split(/\s+/);

              if (pieces.length === 1) {
                if (value === 'auto') {
                  this.perspectiveOriginX = BaseValue.of('50%');
                  this.perspectiveOriginY = BaseValue.of('50%');
                } else {
                  this.perspectiveOriginX = BaseValue.of(value);
                  this.perspectiveOriginY = BaseValue.of(value);
                }
              } else if (pieces.length > 1) {
                this.perspectiveOriginX = pieces[0] === 'auto' ? BaseValue.of('50%') : BaseValue.of(pieces[0]);
                this.perspectiveOriginY = pieces[1] === 'auto' ? BaseValue.of('50%') : BaseValue.of(pieces[1]);
              }

              break;
            }

          case 'transform':
            {
              var _pieces = value.split(/\s+/);

              if (_pieces.length === 1) {
                if (value === 'auto') {
                  this.transformX = BaseValue.of('50%');
                  this.transformY = BaseValue.of('50%');
                } else {
                  this.transformX = BaseValue.of(value);
                  this.transformY = BaseValue.of(value);
                }
              } else if (_pieces.length > 1) {
                this.transformX = _pieces[0] === 'auto' ? BaseValue.of('50%') : BaseValue.of(_pieces[0]);
                this.transformY = _pieces[1] === 'auto' ? BaseValue.of('50%') : BaseValue.of(_pieces[1]);
              }

              break;
            }

          case 'perspectiveOriginX':
          case 'perspectiveOriginY':
          case 'transformX':
          case 'transformY':
            this[_key] = value === 'auto' ? BaseValue.of('50%') : BaseValue.of(value);
            break;

          case 'scaleX':
          case 'scaleY':
          case 'skewX':
          case 'skewY':
          case 'alpha':
          case 'aspectRatio':
          case 'rotation':
            {
              var numberValue = parseFloat(value);

              if (isNaN(numberValue)) {
                console.warn("invalid ".concat(_key, " value: ").concat(value));
              } else {
                this[_key] = numberValue;
              }

              break;
            }

          case 'scale':
            {
              var _numberValue = parseFloat(value);

              if (isNaN(_numberValue)) {
                console.warn("invalid ".concat(_key, " value: ").concat(value));
              } else {
                this.scaleX = this.scaleY = _numberValue;
              }

              break;
            }

          case 'visibility':
            this.visibility = EnumUtils.fromString(Visibility, value, Visibility.VISIBLE);
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
            this.boxSizing = EnumUtils.fromString(BoxSizing, value, BoxSizing.CONTENT_BOX);
            break;

          case 'color':
            {
              var color = Color.of(value);

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

            this.font.weight = EnumUtils.fromString(FontWeight, value, FontWeight.NORMAL);
            break;

          case 'fontStyle':
            if (!this.font) {
              this.font = new Font();
            }

            this.font.style = EnumUtils.fromString(FontStyle, value, FontStyle.NORMAL);
            break;

          case 'fontVariant':
            if (!this.font) {
              this.font = new Font();
            }

            this.font.variant = EnumUtils.fromString(FontVariant, value, FontVariant.NORMAL);
            break;

          case 'fontSize':
            {
              var _numberValue2 = parseFloat(value);

              if (isNaN(_numberValue2)) {
                console.warn("invalid ".concat(_key, " value: ").concat(value));
              } else {
                if (!this.font) {
                  this.font = new Font();
                }

                this.font.size = _numberValue2;
              }

              break;
            }

          case 'lineHeight':
            this.lineHeight = LineHeight.of(value);
            break;

          case 'textAlign':
            this.textAlign = EnumUtils.fromStringOrUndefined(TextAlign, value);
            break;

          case 'verticalAlign':
            this.verticalAlign = EnumUtils.fromStringOrUndefined(VerticalAlign, value);
            break;

          case 'borderRadius':
            {
              var borderRadius = Style.parseBorderRadius(value);

              if (borderRadius) {
                this.borderTopLeftRadius = borderRadius[0];
                this.borderTopRightRadius = borderRadius[1];
                this.borderBottomRightRadius = borderRadius[2];
                this.borderBottomLeftRadius = borderRadius[3];
              }
            }
            break;

          case 'borderTopLeftRadius':
          case 'borderTopRightRadius':
          case 'borderBottomLeftRadius':
          case 'borderBottomRightRadius':
            this[_key] = BorderRadius.of(value);
            break;

          case 'border':
            this.borderTop = this.borderRight = this.borderLeft = this.borderBottom = Border.of(value);
            break;

          case 'borderTop':
          case 'borderRight':
          case 'borderLeft':
          case 'borderBottom':
          case 'textBorder':
            this[_key] = Border.of(value);
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
            this[_key] = Shadow.of(value);
            break;

          case 'textBorderPosition':
            this.textBorderPosition = EnumUtils.fromString(TextBorderPosition, value, TextBorderPosition.OUTER);
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
  }, {
    key: "getSnapshotForAnimation",
    value: function getSnapshotForAnimation(target, props) {
      var result = {};

      for (var name in props) {
        this.fillSnapshotForAnimation(target, name, props[name], result);
      }

      return result;
    }
  }, {
    key: "applyAnimationResult",
    value: function applyAnimationResult(result) {
      for (var name in result) {
        if (name === 'backgroundColor') {
          if (!this.background) {
            this.background = new Background();
          }

          this.background.color = result[name];
        } else {
          this[name] = result[name];
        }
      }
    }
  }, {
    key: "clone",
    value: function clone() {
      var cloned = new Style();
      cloned.width = this.width;
      cloned.minWidth = this.minWidth;
      cloned.maxWidth = this.maxWidth;
      cloned.height = this.height;
      cloned.minHeight = this.minHeight;
      cloned.maxHeight = this.maxHeight;
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
      cloned.verticalAlign = this.verticalAlign;

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

      if (this.borderTopLeftRadius) {
        cloned.borderTopLeftRadius = this.borderTopLeftRadius.clone();
      }

      if (this.borderTopRightRadius) {
        cloned.borderTopRightRadius = this.borderTopRightRadius.clone();
      }

      if (this.borderBottomRightRadius) {
        cloned.borderBottomRightRadius = this.borderBottomRightRadius.clone();
      }

      if (this.borderBottomLeftRadius) {
        cloned.borderBottomLeftRadius = this.borderBottomLeftRadius.clone();
      }

      cloned.overflow = this.overflow;
      cloned.compositeOperation = this.compositeOperation;
      cloned.aspectRatio = this.aspectRatio;
      cloned.filter = this.filter;
      cloned.cursor = this.cursor;
      cloned.pointerEvents = this.pointerEvents;
      return cloned;
    }
  }, {
    key: "fillSnapshotForAnimation",
    value: function fillSnapshotForAnimation(target, name, to, result) {
      var key = this.normalize(name);

      switch (key) {
        case 'scaleX':
        case 'scaleY':
        case 'alpha':
        case 'rotation':
        case 'skewX':
        case 'skewY':
        case 'aspectRatio':
          {
            var numberTo = NaN;

            if (typeof to === 'number') {
              numberTo = to;
            } else if (typeof to === 'string') {
              numberTo = parseFloat(to);
            }

            if (isNaN(numberTo)) {
              console.warn("invalid value (".concat(to, ") for ").concat(key));
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
        case 'transformX':
        case 'width':
        case 'minWidth':
        case 'maxWidth':
        case 'left':
        case 'right':
        case 'perspectiveOriginX':
          {
            var from = this[key] || BaseValue.of(0);
            var animatedValue = Style.calculateAnimationBaseValue(key, from, to, target.getWidth());

            if (animatedValue) {
              result[key] = animatedValue;
            }

            break;
          }

        case 'paddingTop':
        case 'paddingBottom':
        case 'marginTop':
        case 'marginBottom':
        case 'transformY':
        case 'height':
        case 'minHeight':
        case 'maxHeight':
        case 'top':
        case 'bottom':
        case 'perspectiveOriginY':
          {
            var _from = this[key] || BaseValue.of(0);

            var _animatedValue = Style.calculateAnimationBaseValue(key, _from, to, target.getHeight());

            if (_animatedValue) {
              result[key] = _animatedValue;
            }

            break;
          }

        case 'color':
          {
            var color;

            if (typeof to === 'string') {
              color = Color.of(to);
            } else if (to instanceof Color) {
              color = to;
            }

            if (!color) {
              console.warn("invalid value (".concat(to, ") for ").concat(key));
              break;
            }

            result[key] = {
              from: this[key],
              to: color,
              type: AnimationValueType.ANIMATABLE
            };
            break;
          }

        case 'backgroundColor':
          {
            var _color;

            if (typeof to === 'string') {
              _color = Color.of(to);
            } else if (to instanceof Color) {
              _color = to;
            }

            if (!_color) {
              console.warn("invalid value (".concat(to, ") for ").concat(key));
              break;
            }

            result[key] = {
              from: this.background && this.background.color || Color.WHITE,
              to: _color,
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
          var borderRadius = Style.parseBorderRadius(to);

          if (borderRadius) {
            this.fillSnapshotForAnimation(target, 'borderTopLeftRadius', borderRadius[0], result);
            this.fillSnapshotForAnimation(target, 'borderTopRightRadius', borderRadius[1], result);
            this.fillSnapshotForAnimation(target, 'borderBottomRightRadius', borderRadius[2], result);
            this.fillSnapshotForAnimation(target, 'borderBottomLeftRadius', borderRadius[3], result);
          }

          break;

        case 'borderTopLeftRadius':
        case 'borderTopRightRadius':
        case 'borderBottomLeftRadius':
        case 'borderBottomRightRadius':
          {
            var radius;

            if (typeof to === 'string' || typeof to === 'number') {
              radius = BorderRadius.of(to);
            } else if (to instanceof BorderRadius) {
              radius = to;
            }

            if (!radius) {
              console.warn("invalid value (".concat(to, ") for ").concat(key));
              break;
            }

            var _from2 = this[key] || BorderRadius.of(0);

            var value1;

            if (radius.value1.unit === BaseValueUnit.PERCENTAGE) {
              value1 = _from2.value1.toPercentage(target.getWidth());
            } else {
              value1 = _from2.value1.toAbsolute(target.getWidth());
            }

            var value2;

            if (radius.value2.unit === BaseValueUnit.PERCENTAGE) {
              value2 = _from2.value2.toPercentage(target.getHeight());
            } else {
              value2 = _from2.value2.toAbsolute(target.getHeight());
            }

            result[key] = {
              from: new BorderRadius(value1, value2),
              to: radius,
              type: AnimationValueType.ANIMATABLE
            };
          }
          break;

        case 'borderLeft':
        case 'borderRight':
        case 'borderTop':
        case 'borderBottom':
        case 'textBorder':
          {
            var border;

            if (typeof to === 'string') {
              border = Border.of(to);
            } else if (to instanceof Border) {
              border = to;
            }

            if (!border) {
              console.warn("invalid value (".concat(to, ") for ").concat(key));
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
            var shadow;

            if (typeof to === 'string') {
              shadow = Shadow.of(to);
            } else if (to instanceof Shadow) {
              shadow = to;
            }

            if (!shadow) {
              console.warn("invalid value (".concat(to, ") for ").concat(key));
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
  }, {
    key: "normalize",
    value: function normalize(key) {
      var pieces = key.split(/-/);
      var normalized = '';

      var _iterator = _createForOfIteratorHelper(pieces),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var piece = _step.value;

          if (normalized === '') {
            normalized = piece;
          } else {
            normalized += piece.substring(0, 1).toUpperCase() + piece.substring(1);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return normalized;
    }
  }], [{
    key: "of",
    value: function of(value) {
      var style = new Style();
      return style.apply(this.parse(value));
    }
  }, {
    key: "parse",
    value: function parse(value) {
      var attrs = {};
      var matches = StringUtils.matchAll(value, REG_ATTRS);

      var _iterator2 = _createForOfIteratorHelper(matches),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var match = _step2.value;
          attrs[match[1].toLowerCase()] = match[2];
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return attrs;
    }
  }, {
    key: "calculateAnimationBaseValue",
    value: function calculateAnimationBaseValue(key, from, to, base) {
      var toBaseValue;

      if (typeof to === 'number' || typeof to === 'string') {
        toBaseValue = BaseValue.of(to);
      } else if (to instanceof BaseValue) {
        toBaseValue = to;
      }

      if (!toBaseValue) {
        console.warn("invalid value (".concat(to, ") for ").concat(key));
        return undefined;
      }

      if (toBaseValue.unit === BaseValueUnit.PERCENTAGE) {
        return {
          from: from.toPercentage(base),
          to: toBaseValue,
          type: AnimationValueType.ANIMATABLE
        };
      } else {
        return {
          from: from.toAbsolute(base),
          to: toBaseValue,
          type: AnimationValueType.ANIMATABLE
        };
      }
    }
  }, {
    key: "parseBorderRadius",
    value: function parseBorderRadius(value) {
      if (typeof value === 'number') {
        var borderRadius = new BorderRadius(BaseValue.of(value));
        return [borderRadius, borderRadius, borderRadius, borderRadius];
      } else if (isIAnimatable(value)) {
        return [value, value, value, value];
      } else {
        var ps = value.toString().split('/');

        if (ps.length === 1) {
          var _borderRadius = Style.parse4Dirs(ps[0]);

          if (_borderRadius) {
            return [new BorderRadius(_borderRadius[0]), new BorderRadius(_borderRadius[1]), new BorderRadius(_borderRadius[2]), new BorderRadius(_borderRadius[3])];
          }
        } else if (ps.length === 2) {
          var borderRadius1 = Style.parse4Dirs(ps[0]);
          var borderRadius2 = Style.parse4Dirs(ps[1]);

          if (borderRadius1 && borderRadius2) {
            return [new BorderRadius(borderRadius1[0], borderRadius2[0]), new BorderRadius(borderRadius1[1], borderRadius2[1]), new BorderRadius(borderRadius1[2], borderRadius2[2]), new BorderRadius(borderRadius1[3], borderRadius2[3])];
          }
        }

        console.warn("invalid border radius:".concat(value));
        return undefined;
      }
    }
  }, {
    key: "parse4Dirs",
    value: function parse4Dirs(value) {
      var pieces = value.trim().split(/\s+/);

      if (pieces.length === 1) {
        return [BaseValue.of(pieces[0]), BaseValue.of(pieces[0]), BaseValue.of(pieces[0]), BaseValue.of(pieces[0])];
      } else if (pieces.length === 2) {
        return [BaseValue.of(pieces[0]), BaseValue.of(pieces[1]), BaseValue.of(pieces[0]), BaseValue.of(pieces[1])];
      } else if (pieces.length === 3) {
        return [BaseValue.of(pieces[0]), BaseValue.of(pieces[1]), BaseValue.of(pieces[2]), BaseValue.of(pieces[1])];
      } else if (pieces.length === 4) {
        return [BaseValue.of(pieces[0]), BaseValue.of(pieces[1]), BaseValue.of(pieces[2]), BaseValue.of(pieces[3])];
      } else {
        return undefined;
      }
    }
  }]);

  return Style;
}();