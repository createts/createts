"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BitmapText = void 0;

var _Rect = require("../base/Rect");

var _HtmlParser = require("../parser/HtmlParser");

var _ResourceRegistry = require("../resource/ResourceRegistry");

var _DrawUtils = require("../utils/DrawUtils");

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
 * A BitmapText object is used to display text with specified image, it is used to render the text
 * by a pre-rendered picture, and no font needed.
 *
 * Before using BitmapText, you need to create a JSON file contains the information of each
 * character.
 *
 * Code example:
 *
 * ```json
 * {
 *   "url": "./numbers.png",
 *   "texts": {
 *     "0": { "srcX": 0, "srcY": 0, "srcWidth": 28, "srcHeight": 34 },
 *     "1": { "srcX": 28, "srcY": 0, "srcWidth": 15, "srcHeight": 34 },
 *     "2": { "srcX": 43, "srcY": 0, "srcWidth": 21, "srcHeight": 34 },
 *     "3": { "srcX": 64, "srcY": 0, "srcWidth": 18, "srcHeight": 34 },
 *     "4": { "srcX": 82, "srcY": 0, "srcWidth": 23, "srcHeight": 34 },
 *     "5": { "srcX": 105, "srcY": 0, "srcWidth": 20, "srcHeight": 34 },
 *     "6": { "srcX": 125, "srcY": 0, "srcWidth": 26, "srcHeight": 34 },
 *     "7": { "srcX": 151, "srcY": 0, "srcWidth": 21, "srcHeight": 34 },
 *     "8": { "srcX": 172, "srcY": 0, "srcWidth": 24, "srcHeight": 34 },
 *     "9": { "srcX": 196, "srcY": 0, "srcWidth": 24, "srcHeight": 34 },
 *     ".": { "srcX": 220, "srcY": 0, "srcWidth": 10, "srcHeight": 34 }
 *   }
 * }
 * ```
 *
 * ```typescript
 * const html = "<bitmaptext src='numbers.json'>12.34</bitmaptext>";
 * container.load(html);
 * ```
 */
var BitmapText = /*#__PURE__*/function (_XObject) {
  _inherits(BitmapText, _XObject);

  var _super = _createSuper(BitmapText);

  /**
   * The text of this element.
   */

  /**
   * Create a BitmapText element with given options.
   * @param options 'text' attribute of this option will be the 'text' of this element; if there is
   * a 'src' attribute in the option, the bitmapTextSheet attribute will be loaded from here.
   */
  function BitmapText(options) {
    var _this;

    _classCallCheck(this, BitmapText);

    _this = _super.call(this, options);
    _this.text = '';
    _this.bitmapTextSheet = void 0;

    if (options) {
      _this.text = options.text || '';

      if (options.attributes && options.attributes.src) {
        _ResourceRegistry.ResourceRegistry.DefaultInstance.add(options.attributes.src, _ResourceRegistry.ResourceType.JSON).then(function (json) {
          _this.setBitmapTextSheet(json);
        });
      }
    }

    return _this;
  }
  /**
   * Update the bitmapTextSheet of this element, and any image url in this bitmapTextSheet will be
   * loaded automatically.
   * @param bitmapTextSheet the new BitmapTextSheet.
   */


  _createClass(BitmapText, [{
    key: "setBitmapTextSheet",
    value: function setBitmapTextSheet(bitmapTextSheet) {
      var _this2 = this;

      this.bitmapTextSheet = bitmapTextSheet;

      if (this.bitmapTextSheet) {
        if (this.bitmapTextSheet.url) {
          _ResourceRegistry.ResourceRegistry.DefaultInstance.add(this.bitmapTextSheet.url, _ResourceRegistry.ResourceType.IMAGE).then(function () {
            _this2.dispatchEvent(new _XObject2.XObjectEvent('update', true, true, _this2));
          });
        }

        for (var text in this.bitmapTextSheet.texts) {
          var frame = this.bitmapTextSheet.texts[text];

          if (frame.url) {
            _ResourceRegistry.ResourceRegistry.DefaultInstance.add(frame.url, _ResourceRegistry.ResourceType.IMAGE).then(function () {
              _this2.dispatchEvent(new _XObject2.XObjectEvent('update', true, true, _this2));
            });
          }
        }
      }
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
      if (this.text === '' || !this.bitmapTextSheet || this.rect.width <= 0 || this.rect.height <= 0) {
        return;
      }

      var contentRect = this.getContentRect();
      var lines = this.text.split('\n');
      ctx.save();

      var _iterator = _createForOfIteratorHelper(lines),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var line = _step.value;
          var x = contentRect.x;
          var y = contentRect.y;
          var height = this.bitmapTextSheet.height || 0;

          var _iterator2 = _createForOfIteratorHelper(line),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var ch = _step2.value;
              var text = this.bitmapTextSheet.texts[ch];

              if (text) {
                var size = _DrawUtils.DrawUtils.getFrameSize(text, this.bitmapTextSheet);

                var rect = new _Rect.Rect(x, y, size.width, size.height);

                _DrawUtils.DrawUtils.drawFrame(ctx, rect, text, this.bitmapTextSheet);

                x += rect.width + (this.bitmapTextSheet.gapX || 0);
                height = Math.max(height, size.height);
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          y += height + (this.bitmapTextSheet.gapY || 0);
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
      _get(_getPrototypeOf(BitmapText.prototype), "layout", this).call(this);

      if (this.bitmapTextSheet) {
        var lines = this.text.split('\n');
        var contentRect = this.getContentRect();
        var maxWidth = 0;
        var maxHeight = 0;

        var _iterator3 = _createForOfIteratorHelper(lines),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var line = _step3.value;
            var width = 0;
            var height = this.bitmapTextSheet.height || 0;

            var _iterator4 = _createForOfIteratorHelper(line),
                _step4;

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var ch = _step4.value;
                var text = this.bitmapTextSheet.texts[ch];

                var size = _DrawUtils.DrawUtils.getFrameSize(text, this.bitmapTextSheet);

                if (width > 0 && !isNaN(this.bitmapTextSheet.gapX)) width += this.bitmapTextSheet.gapX;
                width += size.width;
                height = Math.max(height, size.height);
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }

            if (maxHeight > 0 && !isNaN(this.bitmapTextSheet.gapY)) {
              maxHeight += this.bitmapTextSheet.gapY;
            }

            maxHeight += height;
            maxWidth = Math.max(maxWidth, width);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        if (maxWidth > contentRect.width) {
          this.rect.width += maxWidth - contentRect.width;
        }

        if (maxHeight > contentRect.height) {
          this.rect.height += maxHeight - contentRect.height;
        }
      }
    }
  }]);

  return BitmapText;
}(_XObject2.XObject);

exports.BitmapText = BitmapText;

_HtmlParser.HtmlParser.registerTag('bitmaptext', BitmapText);