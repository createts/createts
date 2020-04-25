"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Text = void 0;

var _HtmlParser = require("../parser/HtmlParser");

var _Style = require("../style/Style");

var _XObject2 = require("./XObject");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * A Text object is used to display text with specified styles like font size, font family, color,
 * etc.
 *
 * Text in this element can not be wrapped automatically, you must add '\n' by yourself in case of
 * wrapping the text; and Text element can not be 'inline' either, which means text siblings are
 * displayed block by block.
 *
 * Code example:
 *
 * ```typescript
 * const html = "<text style='color:red'>hello</text><text style='color:green'>world</text>";
 * container.load(html);
 * ```
 */
var Text = /*#__PURE__*/function (_XObject) {
  _inherits(Text, _XObject);

  var _super = _createSuper(Text);

  /**
   * The text of this element.
   */

  /**
   * Create a text element with given options.
   * @param options 'text' attribute of this option will be the 'text' of this element.
   */
  function Text(options) {
    var _this;

    _classCallCheck(this, Text);

    _this = _super.call(this, options);
    _this.text = '';
    _this.text = options && options.text || '';
    return _this;
  }
  /**
   * Returns the default text style:
   * 1. **color**: black.
   * 1. **font-size**: 26px.
   * @returns the default text style.
   */


  _createClass(Text, [{
    key: "getDefaultStyle",
    value: function getDefaultStyle() {
      return {
        color: 'black',
        fontSize: 26
      };
    }
    /**
     * Update the text of this element, if the new text is different with current text, update the
     * text and dispatch an 'update' event.
     * @param text the new text.
     */

  }, {
    key: "setText",
    value: function setText(text) {
      if (this.text !== text) {
        this.text = text;
        this.dispatchEvent(new _XObject2.XObjectEvent('update', true, true, this));
      }
    }
    /**
     * Returns the text of this element.
     * @returns Text of this element.
     */

  }, {
    key: "getText",
    value: function getText() {
      return this.text;
    }
    /**
     * Draw the text into given canvas context.
     * @param ctx The canvas rendering context of stage canvas.
     */

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

      var _iterator = _createForOfIteratorHelper(lines),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
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
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      ctx.restore();
      return true;
    }
    /**
     * Calculates size of current object, if there is no width or height specified in element style,
     * system will calculate the text width and height by text and font size.
     */

  }, {
    key: "layout",
    value: function layout() {
      _get(_getPrototypeOf(Text.prototype), "layout", this).call(this);

      if (this.style.font) {
        var lines = this.text.split('\n');
        var contentRect = this.getContentRect();
        var textWidth = 0;

        var _iterator2 = _createForOfIteratorHelper(lines),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var line = _step2.value;
            textWidth = Math.max(textWidth, this.style.font.measureTextWidth(line));
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
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