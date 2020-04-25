"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scrollable = void 0;

var _Rect = require("../base/Rect");

var _HtmlParser = require("../parser/HtmlParser");

var _Container2 = require("./Container");

var _XObject = require("./XObject");

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
var Scrollable = /*#__PURE__*/function (_Container) {
  _inherits(Scrollable, _Container);

  var _super = _createSuper(Scrollable);

  function Scrollable(opt) {
    var _this;

    _classCallCheck(this, Scrollable);

    _this = _super.call(this, opt);
    _this.viewRect = new _Rect.Rect(0, 0, 0, 0);
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

        _this2.dispatchEvent(new _XObject.XObjectEvent('update', true, true, _this2));
      });
    }
  }, {
    key: "layoutChildren",
    value: function layoutChildren() {
      _get(_getPrototypeOf(Scrollable.prototype), "layoutChildren", this).call(this);

      this.viewRect.width = 0;
      this.viewRect.height = 0;
      var paddingRect = this.getPaddingRect();

      var _iterator = _createForOfIteratorHelper(this.children),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var child = _step.value;
          this.viewRect.width = Math.max(this.viewRect.width, child.rect.x + child.getOuterWidth() - paddingRect.x);
          this.viewRect.height = Math.max(this.viewRect.height, child.rect.y + child.getOuterHeight() - paddingRect.y);
          child.rect.x += this.viewRect.x;
          child.rect.y += this.viewRect.y;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);

  return Scrollable;
}(_Container2.Container);

exports.Scrollable = Scrollable;

_HtmlParser.HtmlParser.registerTag('scrollable', Scrollable);