"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Background = exports.BackgroundSizeType = exports.BackgroundClip = exports.BackgroundRepeatType = exports.BackgroundAttachment = void 0;

var _BaseValue = require("../base/BaseValue");

var _Color = require("../base/Color");

var _Rect = require("../base/Rect");

var _CSSTokenizer = require("../parser/CSSTokenizer");

var _FunctionParser = require("../parser/FunctionParser");

var _resource = require("../resource");

var _ResourceRegistry = require("../resource/ResourceRegistry");

var _Runtime = require("../runtime/Runtime");

var _EnumUtils = require("../utils/EnumUtils");

var _StyleUtils = require("../utils/StyleUtils");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The global tokenizer to split background tokens.
 */
var BG_TOKENIZER = new _CSSTokenizer.CSSTokenizer('/');
/**
 * The BackgroundAttachment property sets whether a background image's position is fixed within the
 * viewport, or scrolls with its containing block, see:
 * https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment
 *
 * Currently we only support SCROLL.
 */

var BackgroundAttachment;
exports.BackgroundAttachment = BackgroundAttachment;

(function (BackgroundAttachment) {
  BackgroundAttachment["SCROLL"] = "scroll";
})(BackgroundAttachment || (exports.BackgroundAttachment = BackgroundAttachment = {}));

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
var URLSource = /*#__PURE__*/function () {
  _createClass(URLSource, null, [{
    key: "of",

    /**
     * Creates an URLSource instance from url(<image path>) function.
     * @param args The arguments of url function.
     * @returns an URLSource instance hold this url.
     */
    value: function of(args) {
      return new URLSource(args[0]);
    }
    /**
     * Image url.
     */

  }]);

  /**
   * Construct an URLSource instance with image url.
   * @param url image url.
   */
  function URLSource(url) {
    _classCallCheck(this, URLSource);

    this.url = void 0;
    this.imageClip = void 0;
    this.url = url;
    this.imageClip = _resource.ImageClip.of(url);

    _ResourceRegistry.ResourceRegistry.DefaultInstance.add(url, _ResourceRegistry.ResourceType.IMAGE);
  }
  /**
   * Returns a drawable object for drawing by the specified with and height.
   * @param width The required width.
   * @param height The required height.
   * @returns The image instance of this url if it is loaded.
   */


  _createClass(URLSource, [{
    key: "draw",
    value: function draw(ctx, rect, srcRect) {
      this.imageClip.draw(ctx, rect, srcRect);
    }
  }, {
    key: "ready",
    value: function ready() {
      return this.imageClip.ready();
    }
  }, {
    key: "width",
    value: function width(originRect) {
      return this.imageClip.getWidth();
    }
  }, {
    key: "height",
    value: function height(originRect) {
      return this.imageClip.getHeight();
    }
    /**
     * Returns a string representation of this object.
     * @returns a string representation of this object.
     */

  }, {
    key: "toString",
    value: function toString() {
      return "url(".concat(this.url, ")");
    }
    /**
     * Creates a new URLSource with the same image path.
     * @returns a clone of this instance.
     */

  }, {
    key: "clone",
    value: function clone() {
      return new URLSource(this.url);
    }
    /**
     * A callback function to destroy current instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      return;
    }
  }]);

  return URLSource;
}();
/**
 * The LinearGradientSource class implements IBackgroundImage for linear-gradient function, for
 * example:
 *
 * ```css
 * background-image: linear-gradient(red, yellow, blue);
 * ```
 *
 * see: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/linearGradient
 */


var LinearGradientSource = /*#__PURE__*/function () {
  _createClass(LinearGradientSource, null, [{
    key: "of",

    /**
     * Create a LinearGradientSource instance form augments of linear-gradient function.
     * @param value the arguments of linear-gradient function.
     * @returns LinearGradientSource instance with given arguments.
     */
    value: function of(args) {
      return new LinearGradientSource(args);
    }
    /**
     * the arguments of linear-gradient function.
     */

  }]);

  /**
   * Create a LinearGradientSource instance form augments of linear-gradient function.
   * @param value the arguments of linear-gradient function.
   */
  function LinearGradientSource(value) {
    _classCallCheck(this, LinearGradientSource);

    this.parameters = void 0;
    this.canvas = void 0;
    this.parameters = value;
  }
  /**
   * Returns a drawable instance (canvas) for the specified size.
   * @param width Specified drawable width.
   * @param height Specified drawable height.
   * @returns A canvas with given size and drawn by the linear-gradient function.
   */


  _createClass(LinearGradientSource, [{
    key: "draw",
    value: function draw(ctx, rect, srcRect) {
      if (this.parameters.length === 0) {
        return undefined;
      }

      var width = Math.round(rect.width);
      var height = Math.round(rect.height);

      if (this.canvas && this.canvas.width === width && this.canvas.height === height) {
        return this.canvas;
      }

      if (!this.canvas) {
        this.canvas = _Runtime.Runtime.get().newCanvas();
      }

      if (this.canvas.width !== width) {
        this.canvas.width = width;
      }

      if (this.canvas.height !== height) {
        this.canvas.height = height;
      }

      var canvasCtx = this.canvas.getContext('2d');

      if (!canvasCtx) {
        return undefined;
      }

      var i = 0;
      var gradient;

      if (this.parameters[0].startsWith('to')) {
        var where = this.parameters[0].substring(2).replace(/\s+/g, '');

        if (where === 'left') {
          gradient = canvasCtx.createLinearGradient(width - 1, 0, 0, 0);
        } else if (where === 'right') {
          gradient = canvasCtx.createLinearGradient(0, 0, width - 1, 0);
        } else if (where === 'top') {
          gradient = canvasCtx.createLinearGradient(0, height - 1, 0, 0);
        } else if (where === 'bottom') {
          gradient = canvasCtx.createLinearGradient(0, 0, 0, height - 1);
        } else if (where === 'lefttop') {
          gradient = canvasCtx.createLinearGradient(width - 1, height - 1, 0, 0);
        } else if (where === 'leftbottom') {
          gradient = canvasCtx.createLinearGradient(width - 1, 0, 0, height - 1);
        } else if (where === 'righttop') {
          gradient = canvasCtx.createLinearGradient(0, height - 1, width - 1, 0);
        } else if (where === 'rightbottom') {
          gradient = canvasCtx.createLinearGradient(0, 0, width - 1, height - 1);
        } else {
          gradient = canvasCtx.createLinearGradient(0, 0, 0, height - 1);
        }

        i++;
      } else if (this.parameters[0].endsWith('deg')) {
        // TODO: calculate by deg
        // const deg = parseFloat(this.parameters[0]);
        // const r = Math.sqrt(width * width / 4 + height * height * 4);
        // const x = r * Math.
        gradient = canvasCtx.createLinearGradient(0, 0, width - 1, height - 1);
        i++;
      }

      if (!gradient) {
        gradient = canvasCtx.createLinearGradient(0, 0, 0, height - 1);
      }

      for (var last = -1; i < this.parameters.length; ++i) {
        var parts = this.parameters[i].split(/\s+/);
        var color = parts[0];

        if (parts.length < 2) {
          if (last === -1) {
            last = 0;
            gradient.addColorStop(0, color);
          } else {
            var next = 1;
            var size = 0;

            for (var j = i + 1; j < this.parameters.length; ++j) {
              ++size;
              var ps = this.parameters[j].split(/\s+/);

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
          for (var _j = 1; _j < parts.length; ++_j) {
            last = parseFloat(parts[_j]) / 100;
            gradient.addColorStop(last, color);
          }
        }
      } // Set the fill style and draw a rectangle


      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(0, 0, width, height);
      ctx.drawImage(this.canvas, 0, 0, width, height, rect.x, rect.y, rect.width, rect.height);
    }
  }, {
    key: "ready",
    value: function ready() {
      return true;
    }
  }, {
    key: "width",
    value: function width(originRect) {
      return originRect.width;
    }
  }, {
    key: "height",
    value: function height(originRect) {
      return originRect.height;
    }
    /**
     * Returns a string representation of this object.
     * @returns a string representation of this object.
     */

  }, {
    key: "toString",
    value: function toString() {
      return "linear-gradient(".concat(this.parameters.join(','), ")");
    }
    /**
     * Creates a new LinearGradientSource with the same arguments.
     * @returns a clone of this instance.
     */

  }, {
    key: "clone",
    value: function clone() {
      return new LinearGradientSource(this.parameters);
    }
    /**
     * A callback function to destroy current instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      if (this.canvas) {
        _Runtime.Runtime.get().releaseCanvas(this.canvas);

        this.canvas = undefined;
      }
    }
  }]);

  return LinearGradientSource;
}();
/**
 * The NinePatchSource class implements IBackgroundImage for 9-patch function, for
 * example:
 *
 * ```css
 * background-image: 9patch('sample.png', 10, 20, 20, 10);
 * ```
 *
 * The image will be splitted to 9 patches, the 4 corners are fixed size, and others
 * will be extended to fill the whole area.
 * <pre>
 * |---------------------------------|
 * |      |        ↑         |       |
 * |      |       top        |       |
 * |      |        ↓         |       |
 * |------|------------------|-------|
 * |      |                  |       |
 * |←left→|                  |←right→|
 * |      |                  |       |
 * |------|------------------|-------|
 * |      |        ↑         |       |
 * |      |      bottom      |       |
 * |      |        ↓         |       |
 * |------|------------------|-------|
 * </pre>
 */


var NinePatchSource = /*#__PURE__*/function () {
  _createClass(NinePatchSource, null, [{
    key: "of",

    /**
     * Create a LinearGradientSource instance form augments of linear-gradient function.
     * @param value the arguments of linear-gradient function.
     * @returns LinearGradientSource instance with given arguments.
     */
    value: function of(args) {
      var padding = _StyleUtils.StyleUtils.parse4Dirs(args[1]);

      return new NinePatchSource(_resource.ImageClip.of(args[0]), padding[0], padding[1], padding[2], padding[3]);
    }
    /**
     * The source image clip.
     */

  }]);

  /**
   * Create a NinePatchSource instance form augments of 9patch function.
   * @param imageClip the source image clip.
   */
  function NinePatchSource(imageClip, top, right, bottom, left) {
    _classCallCheck(this, NinePatchSource);

    this.args = void 0;
    this.imageClip = void 0;
    this.top = void 0;
    this.right = void 0;
    this.bottom = void 0;
    this.left = void 0;
    this.imageClip = imageClip;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }
  /**
   * Returns a drawable instance (canvas) for the specified size.
   * @param width Specified drawable width.
   * @param height Specified drawable height.
   * @returns A canvas with given size and drawn by the linear-gradient function.
   */


  _createClass(NinePatchSource, [{
    key: "draw",
    value: function draw(ctx, rect, srcRect) {
      if (!this.ready()) return;
      var width = this.imageClip.getWidth();
      var height = this.imageClip.getHeight();
      var left = this.left.getValue(width);
      var right = this.right.getValue(height);
      var xcenter = width - left - right;

      if (xcenter < 0) {
        left = Math.round(left / (left + right) * width);
        right = width - left;
        xcenter = 0;
      }

      if (left + right > rect.width) {
        left = Math.round(left / (left + right) * rect.width);
        right = rect.width - left;
        xcenter = 0;
      }

      var top = this.top.getValue(height);
      var bottom = this.bottom.getValue(height);
      var ycenter = height - top - bottom;

      if (ycenter < 0) {
        top = Math.round(top / (top + bottom) * height);
        bottom = height - top;
        ycenter = 0;
      }

      if (top + bottom > rect.height) {
        top = Math.round(top / (top + bottom) * rect.height);
        bottom = rect.height - top;
        ycenter = 0;
      } // draw top


      if (top > 0) {
        if (left > 0) {
          this.imageClip.draw(ctx, new _Rect.Rect(rect.x, rect.y, left, top), new _Rect.Rect(0, 0, left, top));
        }

        if (xcenter > 0 && rect.width - left - right > 0) {
          this.imageClip.draw(ctx, new _Rect.Rect(rect.x + left, rect.y, rect.width - left - right, top), new _Rect.Rect(left, 0, xcenter, top));
        }

        if (right > 0) {
          this.imageClip.draw(ctx, new _Rect.Rect(rect.width - right, rect.y, right, top), new _Rect.Rect(width - right, 0, right, top));
        }
      } // draw middle


      if (ycenter > 0) {
        var h = rect.height - top - bottom;
        var y1 = rect.y + top;

        if (h > 0) {
          if (left > 0) {
            this.imageClip.draw(ctx, new _Rect.Rect(rect.x, y1, left, h), new _Rect.Rect(0, top, left, ycenter));
          }

          if (xcenter > 0 && rect.width - left - right > 0) {
            this.imageClip.draw(ctx, new _Rect.Rect(rect.x + left, y1, rect.width - left - right, h), new _Rect.Rect(left, top, xcenter, ycenter));
          }

          if (right > 0) {
            this.imageClip.draw(ctx, new _Rect.Rect(rect.width - right, y1, right, h), new _Rect.Rect(width - right, top, right, ycenter));
          }
        }
      } // draw bottom


      if (bottom > 0) {
        var _y = rect.y + rect.height - bottom;

        var y2 = height - bottom;

        if (left > 0) {
          this.imageClip.draw(ctx, new _Rect.Rect(rect.x, _y, left, bottom), new _Rect.Rect(0, y2, left, bottom));
        }

        if (xcenter > 0 && rect.width - left - right > 0) {
          this.imageClip.draw(ctx, new _Rect.Rect(rect.x + left, _y, rect.width - left - right, bottom), new _Rect.Rect(left, y2, xcenter, bottom));
        }

        if (right > 0) {
          this.imageClip.draw(ctx, new _Rect.Rect(rect.width - right, _y, right, bottom), new _Rect.Rect(width - right, y2, right, bottom));
        }
      }
    }
    /**
     * Returns a string representation of this object.
     * @returns a string representation of this object.
     */

  }, {
    key: "toString",
    value: function toString() {
      return "9patch(".concat(this.args.join(','), ")");
    }
  }, {
    key: "ready",
    value: function ready() {
      return true;
    }
  }, {
    key: "width",
    value: function width(originRect) {
      return originRect.width;
    }
  }, {
    key: "height",
    value: function height(originRect) {
      return originRect.height;
    }
    /**
     * Creates a new LinearGradientSource with the same arguments.
     * @returns a clone of this instance.
     */

  }, {
    key: "clone",
    value: function clone() {
      return new NinePatchSource(this.imageClip.clone(), this.top.clone(), this.right.clone(), this.bottom.clone(), this.left.clone());
    }
    /**
     * A callback function to destroy current instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {}
  }]);

  return NinePatchSource;
}();
/**
 * The background-repeat type for horizontal and vertical axes.
 * See https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat
 */


var BackgroundRepeatType;
/**
 * The background-repeat property sets how background images are repeated. A background image can
 * be repeated along the horizontal and vertical axes, or not repeated at all.
 */

exports.BackgroundRepeatType = BackgroundRepeatType;

(function (BackgroundRepeatType) {
  BackgroundRepeatType["REPEAT"] = "repeat";
  BackgroundRepeatType["NO_REPEAT"] = "no-repeat";
  BackgroundRepeatType["SPACE"] = "space";
  BackgroundRepeatType["ROUND"] = "round";
})(BackgroundRepeatType || (exports.BackgroundRepeatType = BackgroundRepeatType = {}));

var BackgroundRepeat = /*#__PURE__*/function () {
  _createClass(BackgroundRepeat, null, [{
    key: "of",

    /**
     * The default instance of BackgroundRepeat, repeat at both axes.
     */

    /**
     * Convert the tokens to an BackgroundRepeat instance.
     * @param tokens the tokens present BackgroundRepeat.
     * @returns a BackgroundRepeat instance presents these tokens.
     */
    value: function of(tokens) {
      // See: https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat
      if (tokens.length === 1) {
        var token = tokens[0];

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
        var x = _EnumUtils.EnumUtils.fromStringOrUndefined(BackgroundRepeatType, tokens[0]);

        var y = _EnumUtils.EnumUtils.fromStringOrUndefined(BackgroundRepeatType, tokens[1]);

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

  }]);

  /**
   * Creates an BackgroundRepeat instance repeat type of both horizontal and vertical axes.
   * @param x The repeat type of horizontal axes.
   * @param y The repeat type of vertical axes.
   */
  function BackgroundRepeat(x, y) {
    _classCallCheck(this, BackgroundRepeat);

    this.x = void 0;
    this.y = void 0;
    this.x = x;
    this.y = y;
  }
  /**
   * Creates a new BackgroundRepeat instance with the same repeat type of both horizontal and
   * vertical axes.
   * @returns a clone of this instance.
   */


  _createClass(BackgroundRepeat, [{
    key: "clone",
    value: function clone() {
      return new BackgroundRepeat(this.x, this.y);
    }
  }]);

  return BackgroundRepeat;
}();
/**
 * The background-clip property sets whether an element's background extends underneath its border
 * box, padding box, or content box.
 * See https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip
 */


BackgroundRepeat.DEFAULT = new BackgroundRepeat(BackgroundRepeatType.REPEAT, BackgroundRepeatType.REPEAT);
var BackgroundClip;
/**
 * The background-size type for horizontal and vertical axes.
 */

exports.BackgroundClip = BackgroundClip;

(function (BackgroundClip) {
  BackgroundClip["BORDER_BOX"] = "border-box";
  BackgroundClip["PADDING_BOX"] = "padding-box";
  BackgroundClip["CONTENT_BOX"] = "content-box";
})(BackgroundClip || (exports.BackgroundClip = BackgroundClip = {}));

var BackgroundSizeType;
/**
 * The background-size property sets the size of the element's background image. The image can be
 * left to its natural size, stretched, or constrained to fit the available space.
 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/background-size
 */

exports.BackgroundSizeType = BackgroundSizeType;

(function (BackgroundSizeType) {
  BackgroundSizeType["AUTO"] = "auto";
  BackgroundSizeType["COVER"] = "cover";
  BackgroundSizeType["CONTAIN"] = "contain";
  BackgroundSizeType["VALUE"] = "value";
})(BackgroundSizeType || (exports.BackgroundSizeType = BackgroundSizeType = {}));

var BackgroundSize = /*#__PURE__*/function () {
  _createClass(BackgroundSize, null, [{
    key: "of",

    /**
     * The default value of background size.
     */

    /**
     * Convert the tokens to an BackgroundSize instance.
     * @param tokens the tokens present BackgroundSize.
     * @returns a BackgroundSize instance presents these tokens.
     */
    value: function of(tokens) {
      var xType;
      var x = _BaseValue.BaseValue.ZERO;
      var yType;
      var y = _BaseValue.BaseValue.ZERO;

      if (tokens.length === 1) {
        var token = tokens[0];

        if (token === 'auto') {
          xType = yType = BackgroundSizeType.AUTO;
        } else if (token === 'cover') {
          xType = yType = BackgroundSizeType.COVER;
        } else if (token === 'contain') {
          xType = yType = BackgroundSizeType.CONTAIN;
        } else {
          x = y = _BaseValue.BaseValue.of(token);
          if (!y) return undefined;
        }
      } else if (tokens.length === 2) {
        if (tokens[0] === 'auto') {
          xType = BackgroundSizeType.AUTO;
        } else {
          xType = BackgroundSizeType.VALUE;
          x = _BaseValue.BaseValue.of(tokens[0], true);
          if (!x) return undefined;
        }

        if (tokens[1] === 'auto') {
          yType = BackgroundSizeType.AUTO;
        } else {
          yType = BackgroundSizeType.VALUE;
          y = _BaseValue.BaseValue.of(tokens[1], true);
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

  }]);

  /**
   * Creates a BackgroundSize instance with specified type and value in both horizontal and
   * vertical axes.
   * @param xType The background size type of horizontal axes.
   * @param x The background size of horizontal axes.
   * @param yType The background size type of vertical axes.
   * @param y The background size of vertical axes.
   */
  function BackgroundSize(xType, x, yType, y) {
    _classCallCheck(this, BackgroundSize);

    this.xType = void 0;
    this.yType = void 0;
    this.x = void 0;
    this.y = void 0;
    this.x = x;
    this.xType = xType;
    this.y = y;
    this.yType = yType;
  }
  /**
   * Creates a new BackgroundSize with the same type and value of both horizontal and vertical axes.
   * @returns a clone of this instance.
   */


  _createClass(BackgroundSize, [{
    key: "clone",
    value: function clone() {
      return new BackgroundSize(this.xType, this.x.clone(), this.yType, this.y.clone());
    }
  }]);

  return BackgroundSize;
}();
/**
 * The background-position type for horizontal and vertical axes.
 */


BackgroundSize.DEFAULT = new BackgroundSize(BackgroundSizeType.AUTO, _BaseValue.BaseValue.ZERO, BackgroundSizeType.AUTO, _BaseValue.BaseValue.ZERO);
var BackgroundPositionType;
/**
 * The background-position property sets the initial position for each background image. The
 * position is relative to the position layer set by background-origin.
 */

(function (BackgroundPositionType) {
  BackgroundPositionType["LEFT"] = "left";
  BackgroundPositionType["TOP"] = "top";
  BackgroundPositionType["CENTER"] = "center";
  BackgroundPositionType["BOTTOM"] = "bottom";
  BackgroundPositionType["RIGHT"] = "right";
})(BackgroundPositionType || (BackgroundPositionType = {}));

var BackgroundPosition = /*#__PURE__*/function () {
  _createClass(BackgroundPosition, null, [{
    key: "acceptToken",

    /**
     * The default value of background-position, it is in left-top cornor.
     */

    /**
     * Checks a token is a valid background-position token.
     * @param token The token need to be checked.
     * @returns True if it is a valid background-position token, false otherwise.
     */
    value: function acceptToken(token) {
      var pattern = /^(left|center|right|top|bottom|[0-9\.]+|[0-9\.]+px|[0-9\.]+%)$/;
      return pattern.test(token);
    }
    /**
     * Convert the tokens to an BackgroundPosition instance.
     * @param tokens the tokens present BackgroundPosition.
     * @returns a BackgroundPosition instance presents these tokens.
     */

  }, {
    key: "of",
    value: function of(tokens) {
      var xDir;
      var yDir;
      var x;
      var y; // 1-value syntax: the value may be:
      // The keyword value center, which centers the image.
      // One of the keyword values top, left, bottom, right. This specifies an edge against which to
      // place the item. The other dimension is then set to 50%, so the item is placed in the middle
      // of the edge specified.
      // A <length> or <percentage>. This specifies the X coordinate relative to the left edge, with
      // the Y coordinate set to 50%.

      if (tokens.length === 1) {
        var token = tokens[0];
        x = _BaseValue.BaseValue.ZERO;
        y = _BaseValue.BaseValue.ZERO;

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
          x = _BaseValue.BaseValue.of(token);
          yDir = BackgroundPositionType.CENTER;
        }
      } // 2-value syntax: one value defines X and the other defines Y. Each value may be:
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
          var tokenX = tokens[0];
          var tokenY = tokens[1];

          if (tokenX === 'top' || tokenX === 'bottom' || tokenY === 'left' || tokenY === 'right') {
            tokenX = tokens[1];
            tokenY = tokens[0];
          }

          if (tokenX === 'left' || tokenX === 'right' || tokenX === 'center') {
            xDir = tokenX;
            x = _BaseValue.BaseValue.ZERO;
          } else {
            xDir = BackgroundPositionType.LEFT;
            x = _BaseValue.BaseValue.of(tokenX);

            if (!x) {
              return undefined;
            }
          }

          if (tokenY === 'top' || tokenY === 'bottom' || tokenY === 'center') {
            yDir = tokenY;
            y = _BaseValue.BaseValue.ZERO;
          } else {
            yDir = BackgroundPositionType.TOP;
            y = _BaseValue.BaseValue.of(tokenY);

            if (!y) {
              return undefined;
            }
          }
        } // 3-value syntax: Two values are keyword values, and the third is the offset for the preceding
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
              x = _BaseValue.BaseValue.of(tokens[1]);

              if (x) {
                if (tokens[2] === 'top' || tokens[2] === 'bottom' || tokens[2] === 'center') {
                  yDir = tokens[2];
                  y = _BaseValue.BaseValue.ZERO;
                } else {
                  return undefined;
                }
              } else {
                x = _BaseValue.BaseValue.ZERO;

                if (tokens[1] === 'top' || tokens[1] === 'bottom' || tokens[1] === 'center') {
                  yDir = tokens[1];
                  y = _BaseValue.BaseValue.of(tokens[2]);
                  if (!y) return undefined;
                } else {
                  return undefined;
                }
              }
            } else if (tokens[0] === 'top' || tokens[0] === 'bottom') {
              yDir = tokens[0];
              y = _BaseValue.BaseValue.of(tokens[1]);

              if (y) {
                if (tokens[2] === 'left' || tokens[2] === 'right' || tokens[2] === 'center') {
                  xDir = tokens[2];
                  x = _BaseValue.BaseValue.ZERO;
                } else {
                  return undefined;
                }
              } else {
                y = _BaseValue.BaseValue.ZERO;

                if (tokens[1] === 'left' || tokens[1] === 'right' || tokens[1] === 'center') {
                  xDir = tokens[1];
                  x = _BaseValue.BaseValue.of(tokens[2]);
                  if (!x) return undefined;
                } else {
                  return undefined;
                }
              }
            }
          } // 4-value syntax: The first and third values are keyword value defining X and Y. The second
          // and fourth values are offsets for the preceding X and Y keyword values:
          // The first value and third values one of the keyword values top, left, bottom, right. If left
          // or right are given here, then this defines X. If top or bottom are given, then this defines
          // Y and the other keyword value defines X.
          // The second and fourth values are <length> or <percentage> values. The second value is the
          // offset for the first keyword. The fourth value is the offset for the second keyword.
          else if (tokens.length === 4) {
              if (tokens[0] === 'left' || tokens[0] === 'right') {
                xDir = tokens[0];
                x = _BaseValue.BaseValue.of(tokens[1]);
                yDir = tokens[2];
                y = _BaseValue.BaseValue.of(tokens[3]);
              } else if (tokens[0] === 'top' || tokens[0] === 'bottom') {
                xDir = tokens[2];
                x = _BaseValue.BaseValue.of(tokens[3]);
                yDir = tokens[0];
                y = _BaseValue.BaseValue.of(tokens[1]);
              }

              if (!x || !y || xDir !== 'left' && xDir !== 'right' || yDir !== 'top' && yDir !== 'bottom') {
                return undefined;
              }
            } else {
              return undefined;
            }

      return new BackgroundPosition(xDir, x, yDir, y);
    }
  }]);

  function BackgroundPosition(xDir, x, yDir, y) {
    _classCallCheck(this, BackgroundPosition);

    this.xDir = void 0;
    this.yDir = void 0;
    this.x = void 0;
    this.y = void 0;
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


  _createClass(BackgroundPosition, [{
    key: "clone",
    value: function clone() {
      return new BackgroundPosition(this.xDir, this.x.clone(), this.yDir, this.y.clone());
    }
  }]);

  return BackgroundPosition;
}();
/**
 * The background shorthand property sets all background style properties at once, such as color,
 * image, origin and size, or repeat method.
 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/background
 */


BackgroundPosition.DEFAULT = new BackgroundPosition(BackgroundPositionType.LEFT, _BaseValue.BaseValue.ZERO, BackgroundPositionType.TOP, _BaseValue.BaseValue.ZERO);

var Background = /*#__PURE__*/function () {
  function Background() {
    _classCallCheck(this, Background);

    this.color = void 0;
    this.attachment = [];
    this.image = [];
    this.repeat = [];
    this.clip = [];
    this.origin = [];
    this.size = [];
    this.position = [];
    this.blendMode = [];
  }

  _createClass(Background, [{
    key: "setColor",

    /**
     * Set the color property by a string.
     * @param value A string presents color.
     */
    value: function setColor(value) {
      this.color = value instanceof _Color.Color ? value : _Color.Color.of(value);
    }
    /**
     * Set the <background-attachment> property by a string.
     * @param value A string presents single <background-attachment> or a list of
     * <background-attachment> for multiple layers.
     */

  }, {
    key: "setAttachment",
    value: function setAttachment(value) {
      var parts = Background.split(value);
      this.attachment.length = 0;

      var _iterator = _createForOfIteratorHelper(parts),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _ = _step.value;
          // TODO: support others later.
          this.attachment.push(BackgroundAttachment.SCROLL);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    /**
     * Set the <background-image> property by a string.
     * @param value A string presents single <background-image> or a list of
     * <background-image> for multiple layers.
     */

  }, {
    key: "setImage",
    value: function setImage(value) {
      var parts = Background.split(value);
      this.image.length = 0;

      var _iterator2 = _createForOfIteratorHelper(parts),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var part = _step2.value;
          this.image.push(Background.parseImage(part));
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    /**
     * Set the <blend-mode> property by a string.
     * @param value A string presents single <blend-mode> or a list of <blend-mode> for multiple
     * layers.
     */

  }, {
    key: "setBlendMode",
    value: function setBlendMode(value) {
      var parts = Background.split(value);
      this.blendMode.length = 0;

      var _iterator3 = _createForOfIteratorHelper(parts),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var part = _step3.value;
          this.blendMode.push(part);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
    /**
     * Set the <background-repeat> property by a string.
     * @param value A string presents single <background-repeat> or a list of <background-repeat> for
     * multiple layers.
     */

  }, {
    key: "setRepeat",
    value: function setRepeat(value) {
      var parts = Background.split(value);
      this.repeat.length = 0;

      var _iterator4 = _createForOfIteratorHelper(parts),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var part = _step4.value;
          var repeat = BackgroundRepeat.of(BG_TOKENIZER.tokenize(part)) || BackgroundRepeat.DEFAULT;
          this.repeat.push(repeat);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
    /**
     * Set the <background-clip> property by a string.
     * @param value A string presents single <background-clip> or a list of <background-clip> for
     * multiple layers.
     */

  }, {
    key: "setClip",
    value: function setClip(value) {
      var parts = Background.split(value);
      this.clip.length = 0;

      var _iterator5 = _createForOfIteratorHelper(parts),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var part = _step5.value;

          var clip = _EnumUtils.EnumUtils.fromString(BackgroundClip, part, BackgroundClip.BORDER_BOX);

          this.clip.push(clip);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
    /**
     * Set the <background-origin> property by a string.
     * @param value A string presents single <background-origin> or a list of <background-origin> for
     * multiple layers.
     */

  }, {
    key: "setOrigin",
    value: function setOrigin(value) {
      var parts = Background.split(value);
      this.origin.length = 0;

      var _iterator6 = _createForOfIteratorHelper(parts),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var part = _step6.value;

          var origin = _EnumUtils.EnumUtils.fromString(BackgroundClip, part, BackgroundClip.BORDER_BOX);

          this.origin.push(origin);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
    /**
     * Set the <background-size> property by a string.
     * @param value A string presents single <background-size> or a list of <background-size> for
     * multiple layers.
     */

  }, {
    key: "setSize",
    value: function setSize(value) {
      var parts = Background.split(value);
      this.size.length = 0;

      var _iterator7 = _createForOfIteratorHelper(parts),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var part = _step7.value;
          var size = BackgroundSize.of(BG_TOKENIZER.tokenize(part)) || BackgroundSize.DEFAULT;
          this.size.push(size);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
    /**
     * Set the <background-position> property by a string.
     * @param value A string presents single <background-position> or a list of
     * <background-position> for multiple layers.
     */

  }, {
    key: "setPosition",
    value: function setPosition(value) {
      var parts = Background.split(value);
      this.position.length = 0;

      var _iterator8 = _createForOfIteratorHelper(parts),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var part = _step8.value;
          var position = BackgroundPosition.of(BG_TOKENIZER.tokenize(part)) || BackgroundPosition.DEFAULT;
          this.position.push(position);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }
    /**
     * Draw the background of an element.
     * @param target The target element.
     * @param ctx The canvas rendering context of stage canvas.
     * @param outerRect The pre-calculated outer round rect of the element.
     * @param innerRect The pre-calculated inner round rect of the element.
     */

  }, {
    key: "draw",
    value: function draw(target, ctx, outerRect, innerRect) {
      // TODO: support blend mode
      // Color only.
      if (this.image.length === 0 && this.color && this.color.a > 0) {
        ctx.fillStyle = this.color.toString();

        var _rect;

        var clip = Background.getFromArray(this.clip, 0, BackgroundClip.BORDER_BOX);

        switch (clip) {
          case BackgroundClip.PADDING_BOX:
            _rect = target.getPaddingRect();
            break;

          case BackgroundClip.CONTENT_BOX:
            _rect = target.getContentRect();
            break;

          default:
            _rect = new _Rect.Rect(0, 0, target.rect.width, target.rect.height);
            break;
        }

        if (clip === BackgroundClip.BORDER_BOX) {
          outerRect.clip(ctx);
        } else {
          innerRect.clip(ctx);
        }

        ctx.fillRect(_rect.x, _rect.y, _rect.width, _rect.height);
        return;
      }

      for (var i = this.image.length - 1; i >= 0; --i) {
        var source = this.image[i];

        if (!source) {
          continue;
        }

        var origin = Background.getFromArray(this.origin, i, BackgroundClip.BORDER_BOX);

        var _originRect = void 0;

        switch (origin) {
          case BackgroundClip.PADDING_BOX:
            {
              _originRect = target.getPaddingRect();
              break;
            }

          case BackgroundClip.CONTENT_BOX:
            {
              _originRect = target.getContentRect();
              break;
            }

          default:
            _originRect = new _Rect.Rect(0, 0, target.rect.width, target.rect.height);
            break;
        }

        if (_originRect.width < 1 || _originRect.height < 1) {
          continue;
        }

        if (!source.ready()) {
          continue;
        }

        var clipRect = void 0;

        var _clip = Background.getFromArray(this.clip, i, BackgroundClip.BORDER_BOX);

        switch (_clip) {
          case BackgroundClip.PADDING_BOX:
            {
              clipRect = target.getPaddingRect();
              break;
            }

          case BackgroundClip.CONTENT_BOX:
            {
              clipRect = target.getContentRect();
              break;
            }

          default:
            clipRect = new _Rect.Rect(0, 0, target.rect.width, target.rect.height);
            break;
        }

        if (_clip === BackgroundClip.BORDER_BOX) {
          outerRect.clip(ctx);
        } else {
          innerRect.clip(ctx);
        } // Draw color


        if (this.color && i === this.image.length - 1) {
          ctx.fillStyle = this.color.toString();
          ctx.fillRect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
        }

        var srcWidth = source.width(_originRect);
        var srcHeight = source.height(_originRect);
        var scaledWidth = srcWidth;
        var scaledHeight = srcHeight;
        var destX = _originRect.x;
        var destY = _originRect.y; // Image size

        var size = this.size.length > i ? this.size[i] : BackgroundSize.DEFAULT; // Background size

        if (size.xType === BackgroundSizeType.CONTAIN) {
          var ratio = srcWidth / srcHeight;

          if (ratio > _originRect.width / _originRect.height) {
            scaledWidth = _originRect.width;
            scaledHeight = scaledWidth / ratio;
          } else {
            scaledHeight = _originRect.height;
            scaledWidth = scaledHeight * ratio;
          }
        } else if (size.xType === BackgroundSizeType.COVER) {
          var _ratio = srcWidth / srcHeight;

          if (_ratio < _originRect.width / _originRect.height) {
            scaledWidth = _originRect.width;
            scaledHeight = scaledWidth / _ratio;
          } else {
            scaledHeight = _originRect.height;
            scaledWidth = scaledHeight * _ratio;
          }
        } else {
          if (size.xType === BackgroundSizeType.VALUE) {
            scaledWidth = size.x.getValue(_originRect.width);
          }

          if (size.yType === BackgroundSizeType.VALUE) {
            scaledHeight = size.y.getValue(_originRect.height);
          }
        }

        if (scaledWidth < 1 || scaledHeight < 1) {
          continue;
        }

        var srcScaleX = scaledWidth / srcWidth;
        var srcScaleY = scaledHeight / srcHeight; // Repeat

        var repeatX = BackgroundRepeatType.NO_REPEAT;
        var repeatY = BackgroundRepeatType.NO_REPEAT;

        if (this.repeat.length > i) {
          repeatX = this.repeat[i].x;
          repeatY = this.repeat[i].y;
        }

        var gapX = 0;
        var gapY = 0;

        if (repeatX === BackgroundRepeatType.SPACE) {
          var count = Math.floor(_originRect.width / scaledWidth);

          if (count === 1) {
            gapX = _originRect.width;
          } else {
            gapX = (_originRect.width - count * scaledWidth) / (count - 1);
          }

          destX = _originRect.x;

          while (destX > clipRect.x) {
            destX -= gapX + scaledWidth;
          }
        } else if (repeatX === BackgroundRepeatType.ROUND) {
          var _count = Math.max(1, Math.floor(_originRect.width / scaledWidth + 0.5));

          scaledWidth = _originRect.width / _count;
          srcScaleX = scaledWidth / srcWidth;
          destX = _originRect.x;

          while (destX > clipRect.x) {
            destX -= scaledWidth;
          }
        } else {
          if (this.position.length > i) {
            var position = this.position[i];

            if (position.xDir === BackgroundPositionType.CENTER) {
              destX += (_originRect.width - scaledWidth) * 50 / 100;
            } else if (position.xDir === BackgroundPositionType.RIGHT) {
              if (position.x.unit === _BaseValue.BaseValueUnit.PERCENTAGE) {
                destX += (_originRect.width - scaledWidth) * (100 - position.x.numberValue) / 100;
              } else {
                destX += _originRect.width - scaledWidth - position.x.numberValue;
              }
            } else {
              if (position.x.unit === _BaseValue.BaseValueUnit.PERCENTAGE) {
                destX += (_originRect.width - scaledWidth) * position.x.numberValue / 100;
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
          var _count2 = Math.floor(_originRect.height / scaledHeight);

          if (_count2 === 1) {
            gapY = _originRect.height;
          } else {
            gapY = (_originRect.height - _count2 * scaledHeight) / (_count2 - 1);
          }

          destY = _originRect.y;

          while (destY > clipRect.y) {
            destY -= gapY + scaledHeight;
          }
        } else if (repeatY === BackgroundRepeatType.ROUND) {
          var _count3 = Math.max(1, Math.floor(_originRect.height / scaledHeight + 0.5));

          scaledHeight = _originRect.height / _count3;
          srcScaleY = scaledHeight / srcHeight;
          destY = _originRect.y;

          while (destY > clipRect.y) {
            destY -= scaledHeight;
          }
        } else {
          if (this.position.length > i) {
            var _position = this.position[i];

            if (_position.yDir === BackgroundPositionType.CENTER) {
              destY += (_originRect.height - scaledHeight) * 50 / 100;
            } else if (_position.yDir === BackgroundPositionType.BOTTOM) {
              if (_position.x.unit === _BaseValue.BaseValueUnit.PERCENTAGE) {
                destY += (_originRect.height - scaledHeight) * (100 - _position.y.numberValue) / 100;
              } else {
                destY += _originRect.height - scaledHeight - _position.y.numberValue;
              }
            } else {
              if (_position.y.unit === _BaseValue.BaseValueUnit.PERCENTAGE) {
                destY += (_originRect.height - scaledHeight) * _position.y.numberValue / 100;
              } else {
                destY += _position.y.numberValue;
              }
            }
          }

          if (repeatY === BackgroundRepeatType.REPEAT) {
            while (destY > clipRect.y) {
              destY -= scaledHeight;
            }
          }
        }

        var clipBottom = clipRect.y + clipRect.height;
        var clipRight = clipRect.x + clipRect.width;

        do {
          var x = destX;

          do {
            this.drawImage(ctx, source, scaledWidth, scaledHeight, srcScaleX, srcScaleY, x, destY, clipRect);
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

  }, {
    key: "clone",
    value: function clone() {
      var cloned = new Background();
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

  }, {
    key: "drawImage",
    value: function drawImage(ctx, source, imgWidth, imgHeight, imageScaleX, imageScaleY, destX, destY, clip) {
      var srcX = 0;
      var srcY = 0;

      if (destX < clip.x) {
        srcX = clip.x - destX;
        destX = clip.x;
      }

      if (destY < clip.y) {
        srcY = clip.y - destY;
        destY = clip.y;
      }

      var srcWidth = imgWidth - srcX;
      var srcHeight = imgHeight - srcY;

      if (srcWidth + destX > clip.width + clip.x) {
        srcWidth = clip.width + clip.x - destX;
      }

      if (srcHeight + destY > clip.height + clip.y) {
        srcHeight = clip.height + clip.y - destY;
      }

      source.draw(ctx, new _Rect.Rect(destX, destY, srcWidth, srcHeight), new _Rect.Rect(srcX / imageScaleX, srcY / imageScaleY, srcWidth / imageScaleX, srcHeight / imageScaleY));
    }
  }], [{
    key: "of",

    /**
     * Parse a string format background definition to a background instance.
     * See the definition at https://developer.mozilla.org/en-US/docs/Web/CSS/background
     *
     * @param value Input string to be parsed.
     * @param [silent] if true, ignore warning for an invalid value.
     * @returns A Background instance of valid data, undefined otherwise.
     */
    value: function of(value) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var parts = this.split(value);
      var bg = new Background();

      var _iterator9 = _createForOfIteratorHelper(parts),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var part = _step9.value;
          var attachment = void 0;
          var image = void 0;
          var repeat = void 0;
          var clip = void 0;
          var origin = void 0;
          var size = void 0;
          var position = void 0;
          var blendMode = '';
          var tokens = BG_TOKENIZER.tokenize(part);

          for (var i = 0; i < tokens.length; ++i) {
            var token = tokens[i]; // The <box> value may be included zero, one, or two times. If included once, it sets both
            // background-origin and background-clip. If it is included twice, the first occurrence
            // sets background-origin, and the second sets background-clip.

            var box = _EnumUtils.EnumUtils.fromStringOrUndefined(BackgroundClip, token);

            if (box) {
              if (!clip) {
                clip = box;
              } else if (!origin) {
                origin = box;
              } else {
                if (!silent) {
                  console.warn('invalid background:' + value + '\n<box> value appears 3 times in one layer');
                }

                return undefined;
              }

              continue;
            } // Checks attachment.


            var parsedAttachment = _EnumUtils.EnumUtils.fromStringOrUndefined(BackgroundAttachment, token);

            if (parsedAttachment) {
              if (attachment) {
                if (!silent) {
                  console.warn('invalid background:' + value + '\n<attachment> value appears twice in one layer');
                }

                return undefined;
              }

              attachment = parsedAttachment;
              continue;
            } // Checks position & size.
            // The <bg-size> value may only be included immediately after <position>, separated with
            // the '/' character, like this: "center/80%".


            if (BackgroundPosition.acceptToken(token)) {
              if (position) {
                if (!silent) {
                  console.warn('invalid background:' + value + '\n<position> value appears twice in one layer');
                }

                return undefined;
              }

              var positionTokens = [token];

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
            } // Checks repeat


            var parsedRepeat = void 0;

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
                  console.warn('invalid background:' + value + '\n<repeat> value appears twice in one layer');
                }

                return undefined;
              } else {
                repeat = parsedRepeat;
              }

              continue;
            } // Checks image


            var parsedImage = this.parseImage(token);

            if (parsedImage) {
              if (image) {
                if (!silent) {
                  console.warn('invalid background:' + value + '\n<image> value appears twice in one layer');
                }

                return undefined;
              } else {
                image = parsedImage;
              }

              continue;
            } // Checks color


            var color = _Color.Color.of(token);

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
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      return bg;
    }
    /**
     * Try to parse a string to a BackgroundImage instance.
     * @param value A string presents image attribute.
     * @returns A BackgroundImage instance for a valid definition, undefined otherwise.
     */

  }, {
    key: "parseImage",
    value: function parseImage(value) {
      var func = _FunctionParser.FunctionParser.parse(value, true);

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

  }, {
    key: "split",
    value: function split(value) {
      var result = [];
      var begin = 0;
      var inBrackets = false;
      var size = value.length;

      for (var i = 0; i < size; ++i) {
        var ch = value[i];

        if (inBrackets) {
          if (ch === ')') {
            inBrackets = false;
          }
        } else if (ch === '(') {
          inBrackets = true;
        } else if (ch === ',') {
          if (begin < i) {
            var part = value.substring(begin, i).trim();

            if (part) {
              result.push(part);
            }
          }

          begin = i + 1;
        }
      }

      if (begin < size) {
        var _part = value.substring(begin).trim();

        if (_part) {
          result.push(_part);
        }
      }

      return result;
    }
    /**
     * Shadow copy the elements from one list to the other.
     * @param src The source list to be copied.
     * @param dest The destination list to hold the elements from source list.
     */

  }, {
    key: "copyArray",
    value: function copyArray(src, dest) {
      var _iterator10 = _createForOfIteratorHelper(src),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var item = _step10.value;
          dest.push(item);
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
    }
    /**
     * Deep copy the elements from one list to the other.
     * @param src The source list to be copied.
     * @param dest The destination list to hold the elements from source list.
     */

  }, {
    key: "cloneArray",
    value: function cloneArray(src, dest) {
      var _iterator11 = _createForOfIteratorHelper(src),
          _step11;

      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var item = _step11.value;

          if (!item) {
            dest.push(undefined);
          } else {
            dest.push(item.clone());
          }
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
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

  }, {
    key: "getFromArray",
    value: function getFromArray(arr, idx, defaultVal) {
      return idx >= arr.length ? defaultVal : arr[idx];
    }
    /**
     * The color property sets the background color of an element. It is rendered behind any
     * background-image that is specified, although the color will still be visible through any
     * transparency in the image.
     */

  }]);

  return Background;
}();

exports.Background = Background;