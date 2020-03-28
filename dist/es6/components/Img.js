function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import { Rect } from '../base/Rect';
import { ResourceRegistry, ResourceType } from '../resource/ResourceRegistry';
import { XObject } from './XObject';
export var Img = /*#__PURE__*/function (_XObject) {
  _inherits(Img, _XObject);

  function Img(options) {
    var _this;

    _classCallCheck(this, Img);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Img).call(this, options));
    _this.src = void 0;
    _this.image = void 0;
    _this.sourceRect = void 0;

    if (options && options.attributes) {
      if (options.attributes.src) {
        _this.src = options.attributes.src;
        ResourceRegistry.DefaultInstance.add(_this.src, ResourceType.IMAGE);
      }

      if (options.attributes.sourcerect) {
        _this.sourceRect = Rect.of(options.attributes.sourcerect);
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
    key: "setImage",
    value: function setImage(image) {
      this.image = image;
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
      var image;

      if (this.image) {
        image = this.image;
      } else if (this.src) {
        image = ResourceRegistry.DefaultInstance.get(this.src);
      }

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
}(XObject);