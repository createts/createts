"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Apng = void 0;

var _HtmlParser = require("../parser/HtmlParser");

var _ResourceRegistry = require("../resource/ResourceRegistry");

var _Sprite2 = require("./Sprite");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Apng = /*#__PURE__*/function (_Sprite) {
  _inherits(Apng, _Sprite);

  function Apng(options) {
    var _this;

    _classCallCheck(this, Apng);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Apng).call(this, options));

    if (options && options.attributes) {
      if (options.attributes.src) {
        _ResourceRegistry.ResourceRegistry.DefaultInstance.add(options.attributes.src, _ResourceRegistry.ResourceType.APNG).then(function (opt) {
          _this.setSpriteSheet(opt).play();
        })["catch"](function (e) {
          console.warn('failed to load:' + options.attributes.src, e);
        });
      }
    }

    return _this;
  }

  return Apng;
}(_Sprite2.Sprite);

exports.Apng = Apng;

_HtmlParser.HtmlParser.registerTag('apng', Apng);