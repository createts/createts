"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Background = exports.BackgroundSizeType = exports.BackgroundOrigin = exports.BackgroundClip = exports.BackgroundRepeat = exports.BackgroundAttachment = void 0;

var _BaseValue = require("../base/BaseValue");

var _Color = require("../base/Color");

var _Rect = require("../base/Rect");

var _ResourceRegistry = require("../resource/ResourceRegistry");

var _Runtime = require("../Runtime");

var _EnumUtils = require("../utils/EnumUtils");

var _StringUtils = require("../utils/StringUtils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BackgroundAttachment;
exports.BackgroundAttachment = BackgroundAttachment;

(function (BackgroundAttachment) {
  BackgroundAttachment["SCROLL"] = "scroll";
})(BackgroundAttachment || (exports.BackgroundAttachment = BackgroundAttachment = {}));

var BackgroundRepeat;
exports.BackgroundRepeat = BackgroundRepeat;

(function (BackgroundRepeat) {
  BackgroundRepeat["REPEAT"] = "repeat";
  BackgroundRepeat["NO_REPEAT"] = "no-repeat";
  BackgroundRepeat["SPACE"] = "space";
  BackgroundRepeat["ROUND"] = "round";
})(BackgroundRepeat || (exports.BackgroundRepeat = BackgroundRepeat = {}));

// Radial-gradient
// repeating-linear-gradient
// repeating-radial-gradient
var URLSource =
/*#__PURE__*/
function () {
  _createClass(URLSource, null, [{
    key: "of",
    value: function of(value) {
      return new URLSource(value[0]);
    }
  }]);

  function URLSource(url) {
    _classCallCheck(this, URLSource);

    this.url = void 0;
    this.url = url;

    _ResourceRegistry.ResourceRegistry.DefaultInstance.add(url, _ResourceRegistry.ResourceType.IMAGE);
  }

  _createClass(URLSource, [{
    key: "getSource",
    value: function getSource(width, height) {
      return _ResourceRegistry.ResourceRegistry.DefaultInstance.get(this.url);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "url(".concat(this.url, ")");
    }
  }, {
    key: "clone",
    value: function clone() {
      return new URLSource(this.url);
    }
  }, {
    key: "destory",
    value: function destory() {
      return;
    }
  }]);

  return URLSource;
}();

var LinearGradientSource =
/*#__PURE__*/
function () {
  _createClass(LinearGradientSource, null, [{
    key: "of",
    value: function of(value) {
      return new LinearGradientSource(value);
    }
  }]);

  function LinearGradientSource(value) {
    _classCallCheck(this, LinearGradientSource);

    this.parameters = void 0;
    this.canvas = void 0;
    this.parameters = value;
  }

  _createClass(LinearGradientSource, [{
    key: "getSource",
    value: function getSource(width, height) {
      if (this.parameters.length === 0) {
        return undefined;
      }

      width = Math.round(width);
      height = Math.round(height);

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

      var ctx = this.canvas.getContext('2d');

      if (!ctx) {
        return undefined;
      }

      var i = 0;
      var gradient;

      if (this.parameters[0].startsWith('to')) {
        var where = this.parameters[0].substring(2).replace(/\s+/g, '');

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


      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      return this.canvas;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "linear-gradient(".concat(this.parameters.join(','), ")");
    }
  }, {
    key: "clone",
    value: function clone() {
      return new LinearGradientSource(this.parameters);
    }
  }, {
    key: "destory",
    value: function destory() {
      if (this.canvas) {
        _Runtime.Runtime.get().releaseCanvas(this.canvas);

        this.canvas = undefined;
      }
    }
  }]);

  return LinearGradientSource;
}();

var BackgroundRepeatPair =
/*#__PURE__*/
function () {
  _createClass(BackgroundRepeatPair, null, [{
    key: "of",
    value: function of(value) {
      if (value === 'repeat-x') {
        return new BackgroundRepeatPair(BackgroundRepeat.REPEAT, BackgroundRepeat.NO_REPEAT);
      } else if (value === 'repeat-y') {
        return new BackgroundRepeatPair(BackgroundRepeat.NO_REPEAT, BackgroundRepeat.REPEAT);
      }

      var parts = value.split(/\s+/);

      var x = _EnumUtils.EnumUtils.fromStringOrUndefined(BackgroundRepeat, parts[0]);

      if (!x) {
        return undefined;
      }

      if (parts.length > 1) {
        var y = _EnumUtils.EnumUtils.fromString(BackgroundRepeat, parts[1], BackgroundRepeat.NO_REPEAT);

        return new BackgroundRepeatPair(x, y);
      } else {
        return new BackgroundRepeatPair(x, x);
      }
    }
  }, {
    key: "toBaseValue",
    value: function toBaseValue(value) {
      value = value.toLowerCase();

      if (value === 'left' || value === 'top') {
        return _BaseValue.BaseValue.of('0%');
      } else if (value === 'right' || value === 'bottom') {
        return _BaseValue.BaseValue.of('100%');
      } else if (value === 'center') {
        return _BaseValue.BaseValue.of('50%');
      } else {
        return _BaseValue.BaseValue.of(value);
      }
    }
  }]);

  function BackgroundRepeatPair(x, y) {
    _classCallCheck(this, BackgroundRepeatPair);

    this.x = void 0;
    this.y = void 0;
    this.x = x;
    this.y = y;
  }

  _createClass(BackgroundRepeatPair, [{
    key: "clone",
    value: function clone() {
      return new BackgroundRepeatPair(this.x, this.y);
    }
  }]);

  return BackgroundRepeatPair;
}();

var BackgroundClip;
exports.BackgroundClip = BackgroundClip;

(function (BackgroundClip) {
  BackgroundClip["BORDER_BOX"] = "border-box";
  BackgroundClip["PADDING_BOX"] = "padding-box";
  BackgroundClip["CONTENT_BOX"] = "content-box";
})(BackgroundClip || (exports.BackgroundClip = BackgroundClip = {}));

var BackgroundOrigin;
exports.BackgroundOrigin = BackgroundOrigin;

(function (BackgroundOrigin) {
  BackgroundOrigin["BORDER_BOX"] = "border-box";
  BackgroundOrigin["PADDING_BOX"] = "padding-box";
  BackgroundOrigin["CONTENT_BOX"] = "content-box";
})(BackgroundOrigin || (exports.BackgroundOrigin = BackgroundOrigin = {}));

var BackgroundSizeType;
exports.BackgroundSizeType = BackgroundSizeType;

(function (BackgroundSizeType) {
  BackgroundSizeType[BackgroundSizeType["AUTO"] = 0] = "AUTO";
  BackgroundSizeType[BackgroundSizeType["LENGTH"] = 1] = "LENGTH";
  BackgroundSizeType[BackgroundSizeType["PERCENTAGE"] = 2] = "PERCENTAGE";
  BackgroundSizeType[BackgroundSizeType["COVER"] = 3] = "COVER";
  BackgroundSizeType[BackgroundSizeType["CONTAIN"] = 4] = "CONTAIN";
})(BackgroundSizeType || (exports.BackgroundSizeType = BackgroundSizeType = {}));

var BackgroundSizePair =
/*#__PURE__*/
function () {
  _createClass(BackgroundSizePair, null, [{
    key: "of",
    value: function of(value) {
      var parts = value.split(/\s+/);
      var x = this.toBaseValue(parts[0]);
      var y = parts.length > 1 ? this.toBaseValue(parts[1]) : _BaseValue.BaseValue.of('50%');
      return new BackgroundSizePair(x, y);
    }
  }, {
    key: "toBaseValue",
    value: function toBaseValue(value) {
      value = value.toLowerCase();

      if (value === 'left' || value === 'top') {
        return _BaseValue.BaseValue.of('0%');
      } else if (value === 'right' || value === 'bottom') {
        return _BaseValue.BaseValue.of('100%');
      } else if (value === 'center') {
        return _BaseValue.BaseValue.of('50%');
      } else {
        return _BaseValue.BaseValue.of(value);
      }
    }
  }]);

  function BackgroundSizePair(x, y) {
    _classCallCheck(this, BackgroundSizePair);

    this.x = void 0;
    this.y = void 0;
    this.x = x;
    this.y = y;
  }

  _createClass(BackgroundSizePair, [{
    key: "clone",
    value: function clone() {
      return new BackgroundSizePair(this.x.clone(), this.y.clone());
    }
  }]);

  return BackgroundSizePair;
}();

var REG_PARTS = /([^\s]+\([^\)]+\)|[^\s]+)/g;
var REG_PARAMETERS = /("[^"]+"|'[^']+'|[^,]+)/g;
var REG_IMAGE = /^(url|linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient)\(([^\)]+)\)$/i;
var REG_POSITION_X = /^(left|right|[0-9\.]+px|[0-9\.]+%)$/i;
var REG_POSITION_Y = /^(top|bottom|[0-9\.]+px|[0-9\.]+%)$/i;

var Background =
/*#__PURE__*/
function () {
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
    value: function setColor(value) {
      this.color = _Color.Color.of(value);
    }
  }, {
    key: "setAttachment",
    value: function setAttachment(value) {
      var parts = Background.split(value);
      this.attachment.length = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ = _step.value;
          // TODO: support others later.
          this.attachment.push(BackgroundAttachment.SCROLL);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "setImage",
    value: function setImage(value) {
      var parts = Background.split(value);
      this.image.length = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = parts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var part = _step2.value;
          this.image.push(Background.parseImage(part));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "setBlendMode",
    value: function setBlendMode(value) {
      var parts = Background.split(value);
      this.blendMode.length = 0;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = parts[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var part = _step3.value;
          this.blendMode.push(part);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: "setRepeat",
    value: function setRepeat(value) {
      var parts = Background.split(value);
      this.repeat.length = 0;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = parts[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var part = _step4.value;
          var repeat = BackgroundRepeatPair.of(part) || new BackgroundRepeatPair(BackgroundRepeat.NO_REPEAT, BackgroundRepeat.NO_REPEAT);
          this.repeat.push(repeat);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  }, {
    key: "setClip",
    value: function setClip(value) {
      var parts = Background.split(value);
      this.clip.length = 0;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = parts[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var part = _step5.value;

          var clip = _EnumUtils.EnumUtils.fromString(BackgroundClip, part, BackgroundClip.BORDER_BOX);

          this.clip.push(clip);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }, {
    key: "setOrigin",
    value: function setOrigin(value) {
      var parts = Background.split(value);
      this.origin.length = 0;
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = parts[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var part = _step6.value;

          var origin = _EnumUtils.EnumUtils.fromString(BackgroundOrigin, part, BackgroundOrigin.BORDER_BOX);

          this.origin.push(origin);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }
  }, {
    key: "setSize",
    value: function setSize(value) {
      var parts = Background.split(value);
      this.size.length = 0;
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = parts[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var part = _step7.value;
          this.size.push(BackgroundSizePair.of(part));
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    }
  }, {
    key: "setPosition",
    value: function setPosition(value) {
      var parts = Background.split(value);
      this.position.length = 0;
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = parts[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var part = _step8.value;
          this.position.push(BackgroundSizePair.of(part));
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
            _iterator8["return"]();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }
    }
  }, {
    key: "draw",
    value: function draw(target, ctx, outerRect, innerRect) {
      // TODO: support blend mode
      if (this.image.length === 0 && this.color) {
        ctx.fillStyle = this.color.toString();
        var rect;
        var clip = Background.getFromArray(this.clip, 0, BackgroundClip.BORDER_BOX);

        switch (clip) {
          case BackgroundClip.PADDING_BOX:
            rect = target.getPaddingRect();
            break;

          case BackgroundClip.CONTENT_BOX:
            rect = target.getContentRect();
            break;

          default:
            rect = new _Rect.Rect(0, 0, target.rect.width, target.rect.height);
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

      for (var i = this.image.length - 1; i >= 0; --i) {
        var source = this.image[i];

        if (!source) {
          continue;
        }

        var origin = Background.getFromArray(this.origin, i, BackgroundOrigin.BORDER_BOX);
        var originRect = void 0;

        switch (origin) {
          case BackgroundOrigin.PADDING_BOX:
            {
              originRect = target.getPaddingRect();
              break;
            }

          case BackgroundOrigin.CONTENT_BOX:
            {
              originRect = target.getContentRect();
              break;
            }

          default:
            originRect = new _Rect.Rect(0, 0, target.rect.width, target.rect.height);
            break;
        }

        var w = originRect.width;
        var h = originRect.height; // Image size

        if (this.size.length > i) {
          var size = this.size[i];
          w = size.x.getValue(originRect.width);
          h = size.y.getValue(originRect.height);
        }

        var img = source.getSource(w, h);

        if (!img) {
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

        var srcWidth = img.width;
        var srcHeight = img.height;
        var scaledWidth = srcWidth;
        var scaledHeight = srcHeight;
        var srcScaleX = 1;
        var srcScaleY = 1;
        var destX = originRect.x;
        var destY = originRect.y; // Image size

        if (this.size.length > i) {
          var _size = this.size[i];
          scaledWidth = _size.x.getValue(originRect.width);
          scaledHeight = _size.y.getValue(originRect.height);
          srcScaleX = scaledWidth / srcWidth;
          srcScaleY = scaledHeight / srcHeight;
        }

        if (scaledWidth < 1 || scaledHeight < 1) {
          continue;
        } // Repeat


        var repeatX = BackgroundRepeat.NO_REPEAT;
        var repeatY = BackgroundRepeat.NO_REPEAT;

        if (this.repeat.length > i) {
          repeatX = this.repeat[i].x;
          repeatY = this.repeat[i].y;
        }

        var gapX = 0;
        var gapY = 0;

        if (repeatX === BackgroundRepeat.SPACE) {
          var count = Math.floor(originRect.width / scaledWidth);

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
          var _count = Math.max(1, Math.floor(originRect.width / scaledWidth + 0.5));

          scaledWidth = originRect.width / _count;
          srcScaleX = scaledWidth / srcWidth;
          destX = originRect.x;

          while (destX > clipRect.x) {
            destX -= scaledWidth;
          }
        } else {
          if (this.position.length > i) {
            var position = this.position[i];

            if (position.x.unit === _BaseValue.BaseValueUnit.PERCENTAGE) {
              destX += (originRect.width - scaledWidth) * position.x.numberValue / 100;
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
          var _count2 = Math.floor(originRect.height / scaledHeight);

          if (_count2 === 1) {
            gapY = originRect.height;
          } else {
            gapY = (originRect.height - _count2 * scaledHeight) / (_count2 - 1);
          }

          destY = originRect.y;

          while (destY > clipRect.y) {
            destY -= gapY + scaledHeight;
          }
        } else if (repeatY === BackgroundRepeat.ROUND) {
          var _count3 = Math.max(1, Math.floor(originRect.height / scaledHeight + 0.5));

          scaledHeight = originRect.height / _count3;
          srcScaleY = scaledHeight / srcHeight;
          destY = originRect.y;

          while (destY > clipRect.y) {
            destY -= scaledHeight;
          }
        } else {
          if (this.position.length > i) {
            var _position = this.position[i];

            if (_position.y.unit === _BaseValue.BaseValueUnit.PERCENTAGE) {
              destY += (originRect.height - scaledHeight) * _position.y.numberValue / 100;
            } else {
              destY += _position.y.numberValue;
            }
          }

          if (repeatY === BackgroundRepeat.REPEAT) {
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
            this.drawImage(ctx, img, scaledWidth, scaledHeight, srcScaleX, srcScaleY, x, destY, clipRect);
            x += gapX + scaledWidth;
          } while (x < clipRight && repeatX !== BackgroundRepeat.NO_REPEAT);

          destY += gapY + scaledHeight;
        } while (destY < clipBottom && repeatY !== BackgroundRepeat.NO_REPEAT);
      }
    }
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
  }, {
    key: "drawImage",
    value: function drawImage(ctx, img, imgWidth, imgHeight, imageScaleX, imageScaleY, destX, destY, clip) {
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

      ctx.drawImage(img, srcX / imageScaleX, srcY / imageScaleY, srcWidth / imageScaleX, srcHeight / imageScaleY, destX, destY, srcWidth, srcHeight);
    }
  }], [{
    key: "of",
    value: function of(value) {
      var parts = this.split(value);
      var bg = new Background();
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = parts[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var part = _step9.value;
          var image = void 0;
          var repeat = void 0;
          var clip = void 0;
          var positionX = void 0;
          var positionY = void 0;

          var matches = _StringUtils.StringUtils.matchAll(part, REG_PARTS);

          var _iteratorNormalCompletion10 = true;
          var _didIteratorError10 = false;
          var _iteratorError10 = undefined;

          try {
            for (var _iterator10 = matches[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
              var match = _step10.value;
              var val = match[1].trim(); // Try color

              if (!bg.color) {
                var color = _Color.Color.of(val, true);

                bg.color = color;
                continue;
              } // Try image


              if (!image) {
                image = this.parseImage(val);
                continue;
              } // Try repeat


              if (!repeat) {
                repeat = BackgroundRepeatPair.of(val);

                if (repeat) {
                  continue;
                }
              } // Try clip


              if (!clip) {
                clip = _EnumUtils.EnumUtils.fromStringOrUndefined(BackgroundClip, val);

                if (clip) {
                  continue;
                }
              } // Try position


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
          } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion10 && _iterator10["return"] != null) {
                _iterator10["return"]();
              }
            } finally {
              if (_didIteratorError10) {
                throw _iteratorError10;
              }
            }
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
              positionY = _BaseValue.BaseValue.of('50%');
            }

            bg.position.push(new BackgroundSizePair(positionX, positionY));
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
            _iterator9["return"]();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      return bg;
    }
  }, {
    key: "trimParameter",
    value: function trimParameter(value) {
      value = value.trim();

      if (value.length > 1 && (value[0] === '"' && value[value.length - 1] === '"' || value[0] === "'" && value[value.length - 1] === "'")) {
        return value.substring(1, value.length - 1);
      } else {
        return value;
      }
    }
  }, {
    key: "parseParameters",
    value: function parseParameters(value) {
      var matches = _StringUtils.StringUtils.matchAll(value, REG_PARAMETERS);

      var result = [];
      var _iteratorNormalCompletion11 = true;
      var _didIteratorError11 = false;
      var _iteratorError11 = undefined;

      try {
        for (var _iterator11 = matches[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
          var match = _step11.value;
          var val = match[1].trim();
          result.push(this.trimParameter(val));
        }
      } catch (err) {
        _didIteratorError11 = true;
        _iteratorError11 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion11 && _iterator11["return"] != null) {
            _iterator11["return"]();
          }
        } finally {
          if (_didIteratorError11) {
            throw _iteratorError11;
          }
        }
      }

      return result;
    }
  }, {
    key: "parseImage",
    value: function parseImage(value) {
      var matched = value.match(REG_IMAGE);

      if (!matched) {
        return undefined;
      }

      var type = matched[1];
      var params = matched[2];

      switch (type) {
        case 'url':
          return URLSource.of(this.parseParameters(params));

        case 'linear-gradient':
          return LinearGradientSource.of(this.parseParameters(params));
      }

      return undefined;
    }
  }, {
    key: "split",
    value: function split(value) {
      var result = [];
      var begin = 0;
      var inbrackets = false;
      var size = value.length;

      for (var i = 0; i < size; ++i) {
        var ch = value[i];

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
  }, {
    key: "copyArray",
    value: function copyArray(src, dest) {
      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = src[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var item = _step12.value;
          dest.push(item);
        }
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12["return"] != null) {
            _iterator12["return"]();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
          }
        }
      }
    }
  }, {
    key: "cloneArray",
    value: function cloneArray(src, dest) {
      var _iteratorNormalCompletion13 = true;
      var _didIteratorError13 = false;
      var _iteratorError13 = undefined;

      try {
        for (var _iterator13 = src[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
          var item = _step13.value;

          if (!item) {
            dest.push(undefined);
          } else {
            dest.push(item.clone());
          }
        }
      } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion13 && _iterator13["return"] != null) {
            _iterator13["return"]();
          }
        } finally {
          if (_didIteratorError13) {
            throw _iteratorError13;
          }
        }
      }
    }
  }, {
    key: "getFromArray",
    value: function getFromArray(arr, idx, defaultVal) {
      return idx >= arr.length ? defaultVal : arr[idx];
    }
  }]);

  return Background;
}();

exports.Background = Background;