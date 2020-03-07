"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XObject = exports.XActionEvent = exports.ActionState = void 0;

var _Event2 = require("../base/Event");

var _Matrix2D = require("../base/Matrix2D");

var _Rect = require("../base/Rect");

var _Runtime = require("../Runtime");

var _Style = require("../style/Style");

var _DrawUtils = require("../utils/DrawUtils");

var _LayoutUtils = require("../utils/LayoutUtils");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ActionState = function ActionState() {
  _classCallCheck(this, ActionState);

  this.pressed = false;
  this.inBounds = false;
};

exports.ActionState = ActionState;

var XActionEvent =
/*#__PURE__*/
function (_Event) {
  _inherits(XActionEvent, _Event);

  // TODO: change to support multiple touches.
  // A reference to the currently registered target for the event. This is the object to which the
  // event is currently slated to be sent. It's possible this has been changed along the way
  // through retargeting.
  function XActionEvent(target, type) {
    var _this;

    var bubbles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var cancelable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    _classCallCheck(this, XActionEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(XActionEvent).call(this, type, bubbles, cancelable));
    _this.stage = void 0;
    _this.nativeEvent = null;
    _this.stageX = -1;
    _this.stageY = -1;
    _this.x = -1;
    _this.y = -1;
    _this.currentTarget = void 0;
    _this.srcElement = void 0;
    _this.srcElement = target;
    _this.currentTarget = target;
    return _this;
  }

  _createClass(XActionEvent, [{
    key: "toString",
    value: function toString() {
      return '[XActionEvent (type=' + this.type + ')]';
    }
  }]);

  return XActionEvent;
}(_Event2.Event);

exports.XActionEvent = XActionEvent;
var CacheState;

(function (CacheState) {
  CacheState[CacheState["DISABLED"] = 1] = "DISABLED";
  CacheState[CacheState["CACHED"] = 2] = "CACHED";
  CacheState[CacheState["INVALIDATE"] = 3] = "INVALIDATE";
})(CacheState || (CacheState = {}));

var XObject =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(XObject, _EventDispatcher);

  function XObject(opt) {
    var _this2;

    _classCallCheck(this, XObject);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(XObject).call(this));
    _this2.eventEnabled = true;
    _this2.actionState = new ActionState();
    _this2.id = undefined;
    _this2.style = void 0;
    _this2.rect = new _Rect.Rect(0, 0, 0, 0);
    _this2.parent = void 0;
    _this2.cacheCanvas = void 0;
    _this2.cacheState = CacheState.DISABLED;
    _this2.style = opt && opt.style ? opt.style : new _Style.Style();

    if (opt && opt.attributes.id) {
      _this2.id = opt.attributes.id;
    }

    return _this2;
  }

  _createClass(XObject, [{
    key: "getCacheCanvas",
    value: function getCacheCanvas() {
      return this.cacheCanvas;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this.parent) {
        this.parent.removeChild(this);
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      if (!event.bubbles || !this.parent) {
        this.doDispatchEvent(event);
      } else {
        var element = this; // To avoid issues with items being removed or added during the dispatch

        var queue = [element];

        while (element.parent) {
          queue.push(element.parent);
          element = element.parent;
        } // Bubbling


        for (var _i = 0, _queue = queue; _i < _queue.length; _i++) {
          var ele = _queue[_i];
          event.currentTarget = ele;

          if (event.propagationStopped) {
            break;
          }

          ele.doDispatchEvent(event);
        }
      }

      return !event.defaultPrevented;
    }
  }, {
    key: "willTrigger",
    value: function willTrigger(type) {
      var o = this;

      while (o) {
        if (o.hasEventListener(type)) {
          return true;
        }

        o = o.parent;
      }

      return false;
    }
  }, {
    key: "isVisible",
    value: function isVisible() {
      return !!(this.style.visible && this.style.display !== _Style.Display.NONE && this.style.alpha > 0 && this.style.scaleX > 0 && this.style.scaleY > 0);
    }
  }, {
    key: "isCached",
    value: function isCached() {
      return this.cacheState !== CacheState.DISABLED;
    }
  }, {
    key: "cache",
    value: function cache() {
      this.cacheState = CacheState.INVALIDATE;
    }
  }, {
    key: "uncache",
    value: function uncache() {
      this.cacheState = CacheState.DISABLED;
    }
  }, {
    key: "invalidateCache",
    value: function invalidateCache() {
      if (this.cacheState === CacheState.DISABLED) {
        console.warn('Cache does not enabled for ' + this.toString());
        return;
      }

      this.cacheState = CacheState.INVALIDATE;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      ctx.filter = this.style.filter || 'none';

      if (!ignoreCache && this.cacheState !== CacheState.DISABLED) {
        if (!this.cacheCanvas) {
          this.cacheCanvas = _Runtime.Runtime.get().newCanvas();
        }

        if (this.cacheState !== CacheState.CACHED) {
          this.cacheCanvas.width = this.rect.width;
          this.cacheCanvas.height = this.rect.height;
          var cacheCtx = this.cacheCanvas.getContext('2d');

          if (cacheCtx) {
            _DrawUtils.DrawUtils.drawElement(this, cacheCtx);
          }

          this.cacheState = CacheState.CACHED;
        }

        ctx.drawImage(this.cacheCanvas, 0, 0, this.rect.width, this.rect.height);
        return;
      }

      _DrawUtils.DrawUtils.drawElement(this, ctx);
    }
  }, {
    key: "drawBackground",
    value: function drawBackground(ctx, outerRect, innerRect) {
      if (this.style.background) {
        this.style.background.draw(this, ctx, outerRect, innerRect);
      }
    }
  }, {
    key: "drawContent",
    value: function drawContent(ctx) {
      return;
    }
  }, {
    key: "updateContext",
    value: function updateContext(ctx) {
      var mtx = this.getMatrix();
      ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
      ctx.globalAlpha *= this.style.alpha;
    }
  }, {
    key: "localToGlobal",
    value: function localToGlobal(x, y) {
      return this.getConcatenatedMatrix().transformPoint(x, y);
    }
  }, {
    key: "globalToLocal",
    value: function globalToLocal(x, y) {
      return this.getConcatenatedMatrix().invert().transformPoint(x, y);
    }
  }, {
    key: "localToLocal",
    value: function localToLocal(x, y, target) {
      var pt = this.localToGlobal(x, y);
      return target.globalToLocal(pt.x, pt.y);
    }
  }, {
    key: "getMatrix",
    value: function getMatrix(matrix) {
      var mtx = matrix && matrix.identity() || new _Matrix2D.Matrix2D();
      var cx = this.style.perspectiveOriginX.getValue(this.rect.width);
      var cy = this.style.perspectiveOriginY.getValue(this.rect.height);
      return mtx.appendTransform(this.rect.x + cx + this.style.transformX.getValue(this.rect.width), this.rect.y + cy + this.style.transformY.getValue(this.rect.height), this.style.scaleX, this.style.scaleY, this.style.rotation, this.style.skewX, this.style.skewY, cx, cy);
    }
  }, {
    key: "getConcatenatedMatrix",
    value: function getConcatenatedMatrix(matrix) {
      var mtx = this.getMatrix(matrix);
      var o = this.parent;

      while (o) {
        mtx.prependMatrix(o.getMatrix());
        o = o.parent;
      }

      return mtx;
    }
  }, {
    key: "hitTest",
    value: function hitTest(x, y) {
      return x >= 0 && x < this.rect.width && y >= 0 && y < this.rect.height;
    }
  }, {
    key: "layout",
    value: function layout() {
      this.calculateSize();
    }
  }, {
    key: "calculateSize",
    value: function calculateSize() {
      if (!this.parent) {
        return;
      }

      _LayoutUtils.LayoutUtils.updateSize(this, this.parent.getWidth(), this.parent.getHeight());
    }
  }, {
    key: "css",
    value: function css(style) {
      this.style.apply(style);
    }
  }, {
    key: "getLineHeight",
    value: function getLineHeight() {
      if (this.style.font) {
        if (this.style.lineHeight) {
          return this.style.lineHeight.getValue(this.style.font.size);
        } else if (this.style.font.lineHeight) {
          return this.style.font.lineHeight.getValue(this.style.font.size);
        } else {
          return this.style.font.size;
        }
      } else {
        if (this.style.lineHeight) {
          return this.style.lineHeight.getValue(0);
        } else {
          return 0;
        }
      }
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.rect.width;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.rect.height;
    }
  }, {
    key: "getPaddingWidth",
    value: function getPaddingWidth() {
      return this.rect.width - (this.style.borderLeft ? this.style.borderLeft.width : 0) - (this.style.borderRight ? this.style.borderRight.width : 0);
    }
  }, {
    key: "getPaddingHeight",
    value: function getPaddingHeight() {
      return this.rect.height - (this.style.borderTop ? this.style.borderTop.width : 0) - (this.style.borderBottom ? this.style.borderBottom.width : 0);
    }
  }, {
    key: "getPaddingRect",
    value: function getPaddingRect() {
      var rect = new _Rect.Rect(0, 0, this.rect.width, this.rect.height);

      if (this.style.borderLeft) {
        rect.x += this.style.borderLeft.width;
        rect.width -= this.style.borderLeft.width;
      }

      if (this.style.borderRight) {
        rect.width -= this.style.borderRight.width;
      }

      if (this.style.borderTop) {
        rect.y += this.style.borderTop.width;
        rect.height -= this.style.borderTop.width;
      }

      if (this.style.borderBottom) {
        rect.height -= this.style.borderBottom.width;
      }

      return rect;
    }
  }, {
    key: "getContentWidth",
    value: function getContentWidth() {
      return this.rect.width - (this.style.paddingLeft ? this.style.paddingLeft.getValue(this.rect.width) : 0) - (this.style.paddingRight ? this.style.paddingRight.getValue(this.rect.width) : 0) - (this.style.borderLeft ? this.style.borderLeft.width : 0) - (this.style.borderRight ? this.style.borderRight.width : 0);
    }
  }, {
    key: "getContentHeight",
    value: function getContentHeight() {
      return this.rect.height - (this.style.paddingTop ? this.style.paddingTop.getValue(this.rect.height) : 0) - (this.style.paddingBottom ? this.style.paddingBottom.getValue(this.rect.height) : 0) - (this.style.borderTop ? this.style.borderTop.width : 0) - (this.style.borderBottom ? this.style.borderBottom.width : 0);
    }
  }, {
    key: "getContentRect",
    value: function getContentRect() {
      var rect = new _Rect.Rect(0, 0, this.rect.width, this.rect.height);

      if (this.style.paddingLeft) {
        var left = this.style.paddingLeft.getValue(this.rect.width);
        rect.x += left;
        rect.width -= left;
      }

      if (this.style.paddingRight) {
        rect.width -= this.style.paddingRight.getValue(this.rect.width);
      }

      if (this.style.paddingTop) {
        var top = this.style.paddingTop.getValue(this.rect.height);
        rect.y += top;
        rect.height -= top;
      }

      if (this.style.paddingBottom) {
        rect.height -= this.style.paddingBottom.getValue(this.rect.height);
      }

      if (this.style.borderLeft) {
        rect.x += this.style.borderLeft.width;
        rect.width -= this.style.borderLeft.width;
      }

      if (this.style.borderRight) {
        rect.width -= this.style.borderRight.width;
      }

      if (this.style.borderTop) {
        rect.y += this.style.borderTop.width;
        rect.height -= this.style.borderTop.width;
      }

      if (this.style.borderBottom) {
        rect.height -= this.style.borderBottom.width;
      }

      return rect;
    }
  }, {
    key: "getOuterWidth",
    value: function getOuterWidth() {
      var parentWidth = this.parent ? this.parent.getWidth() : 0;
      return this.rect.width + (this.style.marginLeft ? this.style.marginLeft.getValue(parentWidth) : 0) + (this.style.marginRight ? this.style.marginRight.getValue(parentWidth) : 0);
    }
  }, {
    key: "getOuterHeight",
    value: function getOuterHeight() {
      var parentHeight = this.parent ? this.parent.getHeight() : 0;
      return this.rect.height + (this.style.marginTop ? this.style.marginTop.getValue(parentHeight) : 0) + (this.style.marginBottom ? this.style.marginBottom.getValue(parentHeight) : 0);
    }
  }, {
    key: "isChildOf",
    value: function isChildOf(element) {
      var parent = this.parent;

      while (parent) {
        if (parent === element) {
          return true;
        }

        parent = parent.parent;
      }

      return false;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "[XObject (id=".concat(this.id, ")]");
    }
  }, {
    key: "doDispatchEvent",
    value: function doDispatchEvent(event) {
      event.currentTarget = this;

      if (event.stage) {
        var pt = event.stage.localToLocal(event.stageX, event.stageY, this);
        event.x = pt.x;
        event.y = pt.y;
      }

      _get(_getPrototypeOf(XObject.prototype), "dispatchEvent", this).call(this, event);
    }
  }]);

  return XObject;
}(_Event2.EventDispatcher);

exports.XObject = XObject;