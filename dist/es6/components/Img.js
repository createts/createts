function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

import { Rect } from '../base/Rect';
import { HtmlParser } from '../parser/HtmlParser';
import { ImageClip } from '../resource/ImageClip';
import { ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { XObject, XObjectEvent } from './XObject';
export var Img = /*#__PURE__*/function (_XObject) {
  _inherits(Img, _XObject);

  var _super = _createSuper(Img);

  function Img(options) {
    var _this;

    _classCallCheck(this, Img);

    _this = _super.call(this, options);
    _this.imageClip = void 0;

    if (options && options.attributes) {
      if (options.attributes.src) {
        _this.setSrc(options.attributes.src);
      }

      if (options.attributes.sourcerect) {
        _this.setSourceRect(Rect.of(options.attributes.sourcerect));
      }
    }

    if (!_this.imageClip) {
      _this.imageClip = ImageClip.of('');
    }

    return _this;
  }

  _createClass(Img, [{
    key: "setSrc",
    value: function setSrc(src) {
      var _this2 = this;

      this.imageClip = ImageClip.of(src);
      ResourceRegistry.DefaultInstance.add(this.imageClip.getSrc(), ResourceType.IMAGE).then(function (image) {
        _this2.dispatchEvent(new XObjectEvent('update', true, true, _this2));
      });
      return this;
    }
  }, {
    key: "setImage",
    value: function setImage(image) {
      this.imageClip.setImage(image);
      return this;
    }
  }, {
    key: "setSourceRect",
    value: function setSourceRect(sourceRect) {
      this.imageClip.setRect(sourceRect);
      return this;
    }
    /**
     * Calculates size of current object.
     */

  }, {
    key: "calculateSize",
    value: function calculateSize() {
      _get(_getPrototypeOf(Img.prototype), "calculateSize", this).call(this);

      if (!this.style.width) {
        this.rect.width = this.imageClip.getWidth();
      }

      if (!this.style.height) {
        this.rect.height = this.imageClip.getHeight();
      }
    }
  }, {
    key: "drawContent",
    value: function drawContent(ctx) {
      this.imageClip.draw(ctx, this.getContentRect());
    }
  }]);

  return Img;
}(XObject);
HtmlParser.registerTag('img', Img);
HtmlParser.registerTag('image', Img);