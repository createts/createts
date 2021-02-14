"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XObject = exports.XObjectEvent = void 0;

var _Event2 = require("../base/Event");

var _Matrix2D = require("../base/Matrix2D");

var _Rect = require("../base/Rect");

var _Runtime = require("../runtime/Runtime");

var _Style = require("../style/Style");

var _DrawUtils = require("../utils/DrawUtils");

var _LayoutUtils = require("../utils/LayoutUtils");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * This class represents an event object for both touch event (in mobile devices) and mouse event
 * (in desktop).
 */
var XObjectEvent = /*#__PURE__*/function (_Event) {
  _inherits(XObjectEvent, _Event);

  var _super = _createSuper(XObjectEvent);

  /**
   * The stage object of the target element.
   */

  /**
   * The touch item related to this event;
   */

  /**
   * The native event, note that the location of this event is not transferred to the stage.
   */

  /**
   * The identifier of this TouchItem, used to track a serial of touch events.
   */

  /**
   * The X coordinate of this TouchItem in the stage.
   */

  /**
   * The Y coordinate of this TouchItem in the stage.
   */

  /**
   * The X coordinate of this TouchItem in the current element.
   */

  /**
   * The Y coordinate of this TouchItem in the current element.
   */

  /**
   * A reference to the currently registered target for the event. This is the object to which the
   * event is currently slated to be sent. It's possible this has been changed along the way
   * through re-targeting.
   */

  /**
   * The source element of this event.
   */

  /**
   * Creates an instance of XObjectEvent.
   * @param srcElement The source element of this event.
   * @param type Event type.
   * @param bubbles Indicates whether the event bubbles up through its parents or not.
   * @param touch Contains location and identifier of this touch event.
   * @param cancelable Interface indicates whether the event can be canceled, and
   * therefore prevented as if the event never happened.
   */
  function XObjectEvent(type) {
    var _this;

    var bubbles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var cancelable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var srcElement = arguments.length > 3 ? arguments[3] : undefined;
    var touchItem = arguments.length > 4 ? arguments[4] : undefined;
    var currentTarget = arguments.length > 5 ? arguments[5] : undefined;

    _classCallCheck(this, XObjectEvent);

    _this = _super.call(this, type, bubbles, cancelable);
    _this.stage = void 0;
    _this.touchItem = void 0;
    _this.nativeEvent = null;
    _this.identifier = void 0;
    _this.stageX = void 0;
    _this.stageY = void 0;
    _this.x = void 0;
    _this.y = void 0;
    _this.currentTarget = void 0;
    _this.srcElement = void 0;
    _this.srcElement = srcElement;
    _this.touchItem = touchItem;
    _this.currentTarget = currentTarget;

    if (touchItem) {
      _this.identifier = touchItem.identifier;
      _this.stageX = touchItem.stageX;
      _this.stageY = touchItem.stageY;
    }

    return _this;
  }
  /**
   * Returns a string representation of this XObjectEvent object.
   * @returns a string representation of this XObjectEvent object.
   */


  _createClass(XObjectEvent, [{
    key: "toString",
    value: function toString() {
      return '[XObjectEvent (type=' + this.type + ')]';
    }
  }]);

  return XObjectEvent;
}(_Event2.Event);
/**
 * Indicates the cache state of this object.
 */


exports.XObjectEvent = XObjectEvent;
var CacheState;
/**
 * Options to create an XObject instance.
 */

(function (CacheState) {
  CacheState[CacheState["DISABLED"] = 1] = "DISABLED";
  CacheState[CacheState["CACHED"] = 2] = "CACHED";
  CacheState[CacheState["INVALIDATE"] = 3] = "INVALIDATE";
})(CacheState || (CacheState = {}));

/**
 * This class represents an basic object (XObject), contains id, style, cache and cache status,
 * etc.
 */
var XObject = /*#__PURE__*/function (_EventDispatcher) {
  _inherits(XObject, _EventDispatcher);

  var _super2 = _createSuper(XObject);

  /**
   * The string if of this object.
   */

  /**
   * The style of this object.
   */

  /**
   * The calculated location and size of this object.
   * Note: it is a computed result, do not change it manually, it maybe re-calculated in next
   * layout process.
   */

  /**
   * Parent object of this object.
   */

  /**
   * The cached canvas.
   */

  /**
   * Cache state, by default it is not cached.
   * Note that enabling cache does not always improve the performance, if this instance is a image
   * there is no performance gain, or its size is bigger but simple to draw, enabling cache may
   * hurt performance.
   */

  /**
   * The animationFactory object manages the animations of children elements, this is optional, if
   * not set, use its parent's animationFactory.
   */

  /**
   * Creates a XObject instance.
   * @param opt The options to create this object.
   */
  function XObject(opt) {
    var _this2;

    _classCallCheck(this, XObject);

    _this2 = _super2.call(this);
    _this2.id = undefined;
    _this2.style = void 0;
    _this2.rect = new _Rect.Rect(0, 0, 0, 0);
    _this2.parent = void 0;
    _this2.cacheCanvas = void 0;
    _this2.cacheState = CacheState.DISABLED;
    _this2.animationFactory = void 0;
    _this2.style = new _Style.Style();

    var defaultStyle = _this2.getDefaultStyle();

    if (defaultStyle) {
      _this2.style.apply(defaultStyle);
    }

    if (opt) {
      if (opt.attributes.style) {
        _this2.style.apply(_Style.Style.parse(opt.attributes.style));
      }

      if (opt.attributes.id) {
        _this2.id = opt.attributes.id;
      }
    }

    return _this2;
  }

  _createClass(XObject, [{
    key: "getDefaultStyle",
    value: function getDefaultStyle() {
      return undefined;
    }
    /**
     * This this element from its parent.
     */

  }, {
    key: "remove",
    value: function remove() {
      if (this.parent) {
        this.parent.removeChild(this);
      }
    }
    /**
     * Dispatches an event from current element and bubbles up through its parents.
     * @param event The event to be dispatched.
     * @returns True if the event is prevented, false otherwise.
     */

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
    /**
     * Checks whether this element is visible.
     * @returns True if it is visible, false otherwise.
     */

  }, {
    key: "isVisible",
    value: function isVisible() {
      return !!(this.style.visibility !== _Style.Visibility.HIDDEN && this.style.display !== _Style.Display.NONE && this.style.alpha > 0 && this.style.scaleX > 0 && this.style.scaleY > 0);
    }
    /**
     * Returns the offscreen cache canvas.
     * @returns The offscreen cache canvas.
     */

  }, {
    key: "getCacheCanvas",
    value: function getCacheCanvas() {
      return this.cacheCanvas;
    }
    /**
     * Checks whether this element is cache enabled.
     * Note that it returns true for an invalidate cache state.
     * @returns True if it is cache enabled, false otherwise.
     */

  }, {
    key: "isCached",
    value: function isCached() {
      return this.cacheState !== CacheState.DISABLED;
    }
    /**
     * Enable cache for this element.
     */

  }, {
    key: "cache",
    value: function cache() {
      if (this.cacheState !== CacheState.CACHED) {
        this.cacheState = CacheState.INVALIDATE;
      }
    }
    /**
     * Disable cache for this element.
     */

  }, {
    key: "uncache",
    value: function uncache() {
      this.cacheState = CacheState.DISABLED;
      delete this.cacheCanvas;
    }
    /**
     * Returns available animation factory.
     */

  }, {
    key: "getAnimationFactory",
    value: function getAnimationFactory() {
      var element = this;

      while (element) {
        if (element.animationFactory) {
          return element.animationFactory;
        }

        element = element.parent;
      }

      return undefined;
    }
    /**
     * A wrapper function to use its animationFactory to create animation for the given object.
     *
     * ```typescript
     *
     * const element = ...;
     *
     * element.animate(true).css({color: 'red'}, 1000, 'linear');
     * ```
     *
     * It can be used to create animation for other object, i.e.
     *
     * ```typescript
     *
     * const element1 = ...;
     * const element2 = ...;
     *
     * element1.animate(element2, true).css({color: 'red'}, 1000, 'linear');
     * ```
     *
     * @param element The target element to create the animation for, or `override` it type is boolean.
     * @param override Whether to remove the existing animation of this element.
     */

  }, {
    key: "animate",
    value: function animate(child) {
      var override = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (typeof child === 'boolean') {
        return this.getAnimationFactory().create(this, child);
      } else {
        var target = child === undefined ? this : child;
        return this.getAnimationFactory().create(target, override);
      }
    }
    /**
     * A wrapper function to use this its animationFactory to stop animation for the given object.
     *
     * ```typescript
     *
     * const element = ...;
     *
     * element.stopAnimation();
     * ```
     * @param element The target element to create the animation for, default is `this`.
     */

  }, {
    key: "stopAnimation",
    value: function stopAnimation() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;
      this.getAnimationFactory().removeByTarget(element);
    }
    /**
     * Marks the cache is invalidate and update in next render cycle.
     */

  }, {
    key: "invalidateCache",
    value: function invalidateCache() {
      if (this.cacheState === CacheState.DISABLED) {
        console.warn('Cache does not enabled for ' + this.toString());
        return;
      }

      this.cacheState = CacheState.INVALIDATE;
    }
    /**
     * Draws the image to stage canvas.
     * @param ctx The canvas rendering context of stage canvas.
     * @param ignoreCache If true, always not use cache.
     */

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
      } else {
        _DrawUtils.DrawUtils.drawElement(this, ctx);
      }
    }
    /**
     * Draws the background of this element to targeted canvas.
     * @param ctx The canvas rendering context of targeted canvas.
     * @param outerRect the outer position of border of this element.
     * @param innerRect the inner position of border of this element.
     */

  }, {
    key: "drawBackground",
    value: function drawBackground(ctx, outerRect, innerRect) {
      if (this.style.background) {
        this.style.background.draw(this, ctx, outerRect, innerRect);
      }
    }
    /**
     * Draws content of this element to targeted canvas.
     * @param ctx The canvas rendering context of targeted canvas.
     */

  }, {
    key: "drawContent",
    value: function drawContent(ctx) {
      return;
    }
    /**
     * Applies this object's transformation and alpha to the specified context. This is typically
     * called prior to 'draw' function.
     * @param ctx The canvas rendering context to update.
     */

  }, {
    key: "updateContext",
    value: function updateContext(ctx) {
      var mtx = this.getMatrix();
      ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
      ctx.globalAlpha *= this.style.alpha;
    }
    /**
     * Transforms the specified x and y position from the coordinate space of this object to the
     * stage coordinate space.
     * @param x The x position in the source object to transform.
     * @param y The y position in the source object to transform.
     * @returns A Point instance with x and y properties correlating to the transformed coordinates.
     */

  }, {
    key: "localToGlobal",
    value: function localToGlobal(x, y) {
      return this.getConcatenatedMatrix().transformPoint(x, y);
    }
    /**
     * Transforms the specified x and y position from the stage coordinate space to the coordinate
     * space of this object.
     * @param x The x position in the source object to transform.
     * @param y The y position in the source object to transform.
     * @returns A Point instance with x and y properties correlating to the transformed coordinates.
     */

  }, {
    key: "globalToLocal",
    value: function globalToLocal(x, y) {
      return this.getConcatenatedMatrix().invert().transformPoint(x, y);
    }
    /**
     * Transforms the specified x and y position from the coordinate space of this object to the
     * coordinate space of the target object.
     * @param x The x position in the source object to transform.
     * @param y The y position on the source object to transform.
     * @param target The target object to which the coordinates will be transformed.
     * @returns Returns a Point instance with x and y properties correlating to the transformed
     * position in the target's coordinate space.
     */

  }, {
    key: "localToLocal",
    value: function localToLocal(x, y, target) {
      var pt = this.localToGlobal(x, y);
      return target.globalToLocal(pt.x, pt.y);
    }
    /**
     * Returns a matrix based on this object's current transform.
     * @param matrix Optional. A Matrix2D object to populate with the calculated values.
     * If null, a new Matrix2D object is returned.
     * @return A matrix representing this object's transform.
     */

  }, {
    key: "getMatrix",
    value: function getMatrix(matrix) {
      var mtx = matrix && matrix.identity() || new _Matrix2D.Matrix2D();
      var cx = this.style.perspectiveOriginX.getValue(this.rect.width);
      var cy = this.style.perspectiveOriginY.getValue(this.rect.height);
      return mtx.appendTransform(this.rect.x + cx + this.style.transformX.getValue(this.rect.width), this.rect.y + cy + this.style.transformY.getValue(this.rect.height), this.style.scaleX, this.style.scaleY, this.style.rotation, this.style.skewX, this.style.skewY, cx, cy);
    }
    /**
     * Generates a Matrix2D object representing the combined transform of the object and all of its
     * parent Containers up to the stage. This can be used to transform positions between coordinate
     * spaces.
     * @param matrix A Matrix2D object to populate with the calculated values. If null, a new
     * Matrix2D object is returned.
     * @returnsThe combined matrix.
     */

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
    /**
     * Checks the given location should trigger a click event or not.
     * @param x The x position to test.
     * @param y The y position to test.
     * @returns True if it should trigger a click event, false otherwise.
     */

  }, {
    key: "hitTest",
    value: function hitTest(x, y) {
      return x >= 0 && x < this.rect.width && y >= 0 && y < this.rect.height;
    }
    /**
     * Calculates size of current object.
     */

  }, {
    key: "layout",
    value: function layout() {
      this.calculateSize();
    }
    /**
     * Calculates size of current object.
     */

  }, {
    key: "calculateSize",
    value: function calculateSize() {
      if (!this.parent) {
        return;
      }

      _LayoutUtils.LayoutUtils.updateSize(this, this.parent.getContentWidth(), this.parent.getContentHeight());
    }
    /**
     * Applies the style map to current object.
     * @param style Style map to apply.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "css",
    value: function css(style) {
      this.style.apply(style);
      this.dispatchEvent(new XObjectEvent('update', true, true, this));
      return this;
    }
    /**
     * Returns line height of this object.
     * @returns Line height of this object.
     */

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
    /**
     * Returns width of this object, including content width, padding width and border width.
     * @returns Width of this object.
     */

  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.rect.width;
    }
    /**
     * Returns height of this object, including content height, padding height and border height.
     * @returns Height of this object.
     */

  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.rect.height;
    }
    /**
     * Returns padding width of this object.
     * @returns Padding width of this object.
     */

  }, {
    key: "getPaddingWidth",
    value: function getPaddingWidth() {
      return this.rect.width - (this.style.borderLeft ? this.style.borderLeft.width : 0) - (this.style.borderRight ? this.style.borderRight.width : 0);
    }
    /**
     * Returns padding height of this object.
     * @returns Padding height of this object.
     */

  }, {
    key: "getPaddingHeight",
    value: function getPaddingHeight() {
      return this.rect.height - (this.style.borderTop ? this.style.borderTop.width : 0) - (this.style.borderBottom ? this.style.borderBottom.width : 0);
    }
    /**
     * Returns padding rect of this object.
     * @returns Padding rect of this object.
     */

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
    /**
     * Returns content width of this object.
     * @returns Content width of this object.
     */

  }, {
    key: "getContentWidth",
    value: function getContentWidth() {
      return this.rect.width - (this.style.paddingLeft ? this.style.paddingLeft.getValue(this.rect.width) : 0) - (this.style.paddingRight ? this.style.paddingRight.getValue(this.rect.width) : 0) - (this.style.borderLeft ? this.style.borderLeft.width : 0) - (this.style.borderRight ? this.style.borderRight.width : 0);
    }
    /**
     * Returns content height of this object.
     * @returns content height of this object.
     */

  }, {
    key: "getContentHeight",
    value: function getContentHeight() {
      return this.rect.height - (this.style.paddingTop ? this.style.paddingTop.getValue(this.rect.height) : 0) - (this.style.paddingBottom ? this.style.paddingBottom.getValue(this.rect.height) : 0) - (this.style.borderTop ? this.style.borderTop.width : 0) - (this.style.borderBottom ? this.style.borderBottom.width : 0);
    }
    /**
     * Returns content rect of this object.
     * @returns content rect of this object.
     */

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
    /**
     * Returns outer width of this object.
     * @returns Outer width of this object.
     */

  }, {
    key: "getOuterWidth",
    value: function getOuterWidth() {
      var parentWidth = this.parent ? this.parent.getWidth() : 0;
      return this.rect.width + (this.style.marginLeft ? this.style.marginLeft.getValue(parentWidth) : 0) + (this.style.marginRight ? this.style.marginRight.getValue(parentWidth) : 0);
    }
    /**
     * Returns outer height of this object.
     * @returns Outer height of this object.
     */

  }, {
    key: "getOuterHeight",
    value: function getOuterHeight() {
      var parentHeight = this.parent ? this.parent.getHeight() : 0;
      return this.rect.height + (this.style.marginTop ? this.style.marginTop.getValue(parentHeight) : 0) + (this.style.marginBottom ? this.style.marginBottom.getValue(parentHeight) : 0);
    }
    /**
     * Checks it this object is a child of the given object.
     * @param element The object to check with.
     * @returns True if this object is a child of the given object, false otherwise.
     */

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
    /**
     * Returns a string representation of this object.
     * @returns a string representation of this object.
     */

  }, {
    key: "toString",
    value: function toString() {
      return "[XObject (id=".concat(this.id, ")]");
    }
    /**
     * Do dispatch a touch event to a this element.
     * @param event The event to be dispatched.
     */

  }, {
    key: "doDispatchEvent",
    value: function doDispatchEvent(event) {
      event.currentTarget = this;

      if (event.stage && event.touchItem && this.willTrigger(event.type)) {
        var pt = event.stage.localToLocal(event.touchItem.stageX, event.touchItem.stageY, this);
        event.x = pt.x;
        event.y = pt.y;
        event.touchItem.x = pt.x;
        event.touchItem.y = pt.y;
      }

      _get(_getPrototypeOf(XObject.prototype), "dispatchEvent", this).call(this, event);
    }
  }]);

  return XObject;
}(_Event2.EventDispatcher);

exports.XObject = XObject;