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

import { Rect } from '../base/Rect';
import { HtmlParser } from '../parser/HtmlParser';
import { Container } from './Container';
import { XObjectEvent } from './XObject';
/**
 * A Container is a nestable display list that allows you to work with compound objects, it can be
 * use to build the tree structure of all the objects like DOM tree, and itself is also a XObject
 * so that it also supports style, event handling, etc.
 *
 * Code example:
 *
 * ```typescript
 * const container  = new Container();
 * container.css({width:100, height:200, display:'absolute', left:50});
 * const obj  = new XObject();
 * container.addChild(obj);
 * ```
 */

export var Scrollable = /*#__PURE__*/function (_Container) {
  _inherits(Scrollable, _Container);

  function Scrollable(opt) {
    var _this;

    _classCallCheck(this, Scrollable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Scrollable).call(this, opt));
    _this.viewRect = new Rect(0, 0, 0, 0);
    _this.verticalSnappingSize = 0;
    _this.horizontalSnappingSize = 200;

    _this.on('pressmove', function (e) {
      _this.scroll(e.touchItem.getDelta());

      e.stage.updateOnce();
    });

    _this.on('mousewheel', function (e) {
      var delta = e.touchItem.getDelta();
      delta.x = -delta.x;
      delta.y = -delta.y;

      _this.scroll(delta, false);

      e.stage.updateOnce();
    });

    _this.on('pressup', function (e) {
      if (e.stage.getPressedTouchItems(_assertThisInitialized(_this)).length === 0) {
        _this.onRelease(e.stage);

        e.stage.updateOnce();
      }
    });

    return _this;
  }

  _createClass(Scrollable, [{
    key: "getDefaultStyle",
    value: function getDefaultStyle() {
      return {
        overflow: 'hidden'
      };
    }
  }, {
    key: "fixPosition",
    value: function fixPosition(val, min, max) {
      if (val > max) {
        return max;
      } else if (val < min) {
        return min;
      } else {
        return val;
      }
    }
  }, {
    key: "scroll",
    value: function scroll(delta) {
      var enableSnapping = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this.viewRect.x = this.fixPosition(this.viewRect.x + delta.x, Math.min(0, this.getContentWidth() - this.viewRect.width) - (enableSnapping ? this.horizontalSnappingSize : 0), enableSnapping ? this.horizontalSnappingSize : 0);
      this.viewRect.y = this.fixPosition(this.viewRect.y + delta.y, Math.min(0, this.getContentHeight() - this.viewRect.height) - (enableSnapping ? this.verticalSnappingSize : 0), enableSnapping ? this.verticalSnappingSize : 0);
    }
  }, {
    key: "onRelease",
    value: function onRelease(stage) {
      var _this2 = this;

      var back = {
        x: this.fixPosition(this.viewRect.x, Math.min(0, this.getContentWidth() - this.viewRect.width), 0),
        y: this.fixPosition(this.viewRect.y, Math.min(0, this.getContentHeight() - this.viewRect.height), 0)
      };

      if (back.x === this.viewRect.x && back.y === this.viewRect.y) {
        return;
      }

      stage.animate({
        x: this.viewRect.x,
        y: this.viewRect.y
      }, true).to(back, 200, 'quadIn').on('update', function (e) {
        if (back.x !== undefined) {
          _this2.viewRect.x = e.value.x;
        }

        if (back.y !== undefined) {
          _this2.viewRect.y = e.value.y;
        }

        _this2.dispatchEvent(new XObjectEvent('update', true, true, _this2));
      });
    }
  }, {
    key: "layoutChildren",
    value: function layoutChildren() {
      _get(_getPrototypeOf(Scrollable.prototype), "layoutChildren", this).call(this);

      this.viewRect.width = 0;
      this.viewRect.height = 0;
      var paddingRect = this.getPaddingRect();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var child = _step.value;
          this.viewRect.width = Math.max(this.viewRect.width, child.rect.x + child.getOuterWidth() - paddingRect.x);
          this.viewRect.height = Math.max(this.viewRect.height, child.rect.y + child.getOuterHeight() - paddingRect.y);
          child.rect.x += this.viewRect.x;
          child.rect.y += this.viewRect.y;
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
  }]);

  return Scrollable;
}(Container);
HtmlParser.registerTag('scrollable', Scrollable);