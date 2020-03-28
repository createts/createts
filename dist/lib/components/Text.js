"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Text = void 0;

var _HtmlParser = require("../parser/HtmlParser");

var _Style = require("../style/Style");

var _XObject2 = require("./XObject");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Text = /*#__PURE__*/function (_XObject) {
  _inherits(Text, _XObject);

  function Text(options) {
    var _this;

    _classCallCheck(this, Text);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, options));
    _this.text = '';
    _this.text = options && options.text || '';
    return _this;
  }

  _createClass(Text, [{
    key: "setText",
    value: function setText(text) {
      this.text = text;
    }
  }, {
    key: "getText",
    value: function getText() {
      return this.text;
    }
  }, {
    key: "drawContent",
    value: function drawContent(ctx) {
      if (this.text === '' || !this.style.font) {
        return;
      }

      var rect = this.getContentRect();
      ctx.save();
      ctx.textBaseline = 'middle';
      ctx.textAlign = this.style.textAlign;
      ctx.fillStyle = this.style.color.toString();
      ctx.font = this.style.font.toString(); // Set border.

      var hasBorder = this.style.textBorder && this.style.textBorder.isEnable();

      if (hasBorder) {
        ctx.strokeStyle = this.style.textBorder.color.toString();
        ctx.lineWidth = this.style.textBorder.width;
      } // Set shadow


      if (this.style.textShadow && this.style.textShadow.isEnable()) {
        ctx.shadowBlur = this.style.textShadow.blur;
        ctx.shadowColor = this.style.textShadow.color.toString();
        ctx.shadowOffsetX = this.style.textShadow.offsetX;
        ctx.shadowOffsetY = this.style.textShadow.offsetY;
      }

      var x;

      if (this.style.textAlign === _Style.TextAlign.RIGHT) {
        x = rect.x + rect.width;
      } else if (this.style.textAlign === _Style.TextAlign.CENTER) {
        x = rect.x + rect.width / 2;
      } else {
        x = rect.x;
      }

      var y = rect.y;
      var lines = this.text.split('\n');
      var lineHeight = this.getLineHeight();
      y += lineHeight / 2;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var line = _step.value;

          if (line.trim() !== '') {
            if (hasBorder) {
              if (this.style.textBorderPosition === _Style.TextBorderPosition.OUTER) {
                ctx.strokeText(line, x, y);
                ctx.fillText(line, x, y);
              } else {
                ctx.fillText(line, x, y);
                ctx.strokeText(line, x, y);
              }
            } else {
              ctx.fillText(line, x, y);
            }
          }

          y += lineHeight;
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

      ctx.restore();
      return true;
    }
  }, {
    key: "layout",
    value: function layout() {
      _get(_getPrototypeOf(Text.prototype), "layout", this).call(this);

      if (this.style.font) {
        var lines = this.text.split('\n');
        var contentRect = this.getContentRect();
        var textWidth = 0;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = lines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var line = _step2.value;
            textWidth = Math.max(textWidth, this.style.font.measureTextWidth(line));
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

        if (textWidth > contentRect.width) {
          this.rect.width += textWidth - contentRect.width;
        }

        var textHeight = this.getLineHeight() * lines.length;

        if (textHeight > contentRect.height) {
          this.rect.height += textHeight - contentRect.height;
        }
      }
    }
  }]);

  return Text;
}(_XObject2.XObject);

exports.Text = Text;

_HtmlParser.HtmlParser.registerTag('text', Text);