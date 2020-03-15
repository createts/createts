"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Img = void 0;

var _Rect = require("../base/Rect");

var _ResourceRegistry = require("../resource/ResourceRegistry");

var _XObject2 = require("./XObject");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Img = /*#__PURE__*/function (_XObject) {
  _inherits(Img, _XObject);

  function Img(options) {
    var _this;

    _classCallCheck(this, Img);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Img).call(this, options));
    _this.src = void 0;
    _this.sourceRect = void 0;

    if (options && options.attributes) {
      if (options.attributes.src) {
        _this.src = options.attributes.src;

        _ResourceRegistry.ResourceRegistry.DefaultInstance.add(_this.src, _ResourceRegistry.ResourceType.IMAGE);
      }

      if (options.attributes.sourcerect) {
        _this.sourceRect = _Rect.Rect.of(options.attributes.sourcerect);
      }
    }

    return _this;
  }

  _createClass(Img, [{
    key: "setSrc",
    value: function setSrc(src) {
      this.src = src;
      return this;
    }
  }, {
    key: "setSourceRect",
    value: function setSourceRect(sourceRect) {
      this.sourceRect = sourceRect;
      return this;
    }
  }, {
    key: "drawContent",
    value: function drawContent(ctx) {
      if (!this.src) {
        return;
      }

      var image = _ResourceRegistry.ResourceRegistry.DefaultInstance.get(this.src);

      if (!image) {
        return;
      }

      var rect = this.getContentRect();

      if (this.sourceRect) {
        ctx.drawImage(image, this.sourceRect.x, this.sourceRect.y, this.sourceRect.width, this.sourceRect.height, rect.x, rect.y, rect.width, rect.height);
      } else {
        ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);
      }
    }
  }]);

  return Img;
}(_XObject2.XObject);

exports.Img = Img;