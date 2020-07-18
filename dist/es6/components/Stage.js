function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { AnimationFactory } from '../animation/AnimationFactory';
import { ResourceRegistry } from '../resource/ResourceRegistry';
import { Runtime } from '../runtime/Runtime';
import { Ticker } from '../Ticker';
import { LatestList } from '../utils/LatestList';
import { LayoutUtils } from '../utils/LayoutUtils';
import { Container } from './Container';
import { TouchItem } from './TouchItem';
import { XObjectEvent } from './XObject';
/**
 * An enum to identify how the stage instance do layout during the update process:
 *
 * 1. **NEVER**: stage does not re-layout during updating, you must call 'layout' method explicitly
 * while children status changes.
 * 1. **ALWAYS**: stage instance calls 'layout' method in each 'update' operation.
 */

export var StageLayoutPolicy;
/**
 * An enum to identify how the stage instance update the canvas for each ticker callback:
 *
 * 1. **NEVER**: stage never update the canvas, you must call stage.update method manually to
 * update the canvas.
 * 1. **AUTO**: stage only update canvas after listens a 'update' event.
 * 1. **ALWAYS**: stage update canvas in each ticker callback.
 */

(function (StageLayoutPolicy) {
  StageLayoutPolicy["NEVER"] = "never";
  StageLayoutPolicy["ALWAYS"] = "always";
})(StageLayoutPolicy || (StageLayoutPolicy = {}));

export var StageUpdatePolicy;
/**
 * Options for constructing a stage object.
 */

(function (StageUpdatePolicy) {
  StageUpdatePolicy["NEVER"] = "never";
  StageUpdatePolicy["AUTO"] = "auto";
  StageUpdatePolicy["ALWAYS"] = "always";
})(StageUpdatePolicy || (StageUpdatePolicy = {}));

/**
 * A helper class for staging to hold the all touch status of this stage.
 */
var TouchedObjectSet = /*#__PURE__*/function () {
  function TouchedObjectSet() {
    _classCallCheck(this, TouchedObjectSet);

    this.touchItems = [];
  }

  _createClass(TouchedObjectSet, [{
    key: "contains",

    /**
     * Checks whether this instance contains a TouchItem with this touch identifier.
     * @param identifier Touch identifier to query.
     * @returns True if this instance contains a TouchItem with same identifier, false otherwise.
     */
    value: function contains(identifier) {
      var _iterator = _createForOfIteratorHelper(this.touchItems),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;

          if (item.identifier === identifier) {
            return true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return false;
    }
    /**
     * Gets TouchItem instance by a given touch identifier.
     * @param identifier Touch identifier to query.
     * @returns TouchItem with same identifier, undefined if not found.
     */

  }, {
    key: "get",
    value: function get(identifier) {
      var _iterator2 = _createForOfIteratorHelper(this.touchItems),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var item = _step2.value;

          if (item.identifier === identifier) {
            return item;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return undefined;
    }
    /**
     * Puts a TouchItem instances into current set, caller must make sure that only put the new
     * TouchItem, this method does not check whether there is an existing TouchItem contains same
     * touch identifier.
     * @param touch  The TouchItem instance.
     */

  }, {
    key: "add",
    value: function add(touch) {
      this.touchItems.push(touch);
    }
    /**
     * Removes the TouchItem with same touch identifier.
     * @param identifier The touch identifier used to find the TouchItem to be removed.
     */

  }, {
    key: "remove",
    value: function remove(identifier) {
      for (var i = 0; i < this.touchItems.length; ++i) {
        if (this.touchItems[i].identifier === identifier) {
          this.touchItems.splice(i, 1);
          return;
        }
      }
    }
    /**
     * Returns a list of TouchItem instance of given XObject instance.
     * @param object The XObject instance to be checked.
     * @returns A list of TouchItem instance attaches to this object.
     */

  }, {
    key: "getTouches",
    value: function getTouches(object) {
      var result = [];

      var _iterator3 = _createForOfIteratorHelper(this.touchItems),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var item = _step3.value;

          if (item.srcElement === object || item.srcElement.isChildOf(object)) {
            result.push(item);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return result;
    }
  }]);

  return TouchedObjectSet;
}();
/**
 * This class represents a stage object which is the root level Container for a display list.
 * It also manages the context like ticker, animations, resources and controls the rendering
 * process.
 */


export var Stage = /*#__PURE__*/function (_Container) {
  _inherits(Stage, _Container);

  var _super = _createSuper(Stage);

  /**
   * The canvas instance where this stage render the image to.
   */

  /**
   * The ticker instance is used to provide a centralized tick to render the current stage if
   * necessary, it is also used by the AnimationFactory instance to update the animations.
   *
   * When setting the fps of stage instance, it actually set the fps of ticker.
   */

  /**
   * The animationFactory object manages the animations of children elements of this stage.
   */

  /**
   * The resourceRegistry object manages the resources (like images) used in this stage.
   * This is still under developing.
   */

  /**
   * The configuration of this stage instance.
   */

  /**
   * Contains current touch items of this stage.
   */

  /**
   * Indicated whether this stage object is started to render or not.
   */

  /**
   * Indicated whether this stage is invalidate and needs to be rendered.
   */

  /**
   * Indicated whether event handler of this stage is installed.
   */

  /**
   * Indicated whether event is enabled for this stage.
   */

  /**
   *
   * @param canvas
   * @param option
   */

  /**
   * Construct a stage object by canvas and option.
   *
   * Example
   *
   * ```typescript
   * const canvas = window.getElementById('canvas');
   * const stage = new Stage(canvas);
   * const html = `
   *    <div style='background:red;width:50%;height:100%'>
   *      <div style='background:yellow;width:50%;height:50%'></div>
   *    </div>
   *    <div style='background:green;width:50%;height:100%'></div>
   * `;
   * stage.load(html).start();
   * ```
   *
   * @param canvas The target canvas object this stage renders to.
   * @param option The parameters to create this stage instance.
   */
  function Stage(canvas) {
    var _this;

    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Stage);

    _this = _super.call(this);
    _this.canvas = void 0;
    _this.ticker = void 0;
    _this.animationFactory = void 0;
    _this.resourceRegistry = void 0;
    _this.option = {
      /**
       * The fps controls the frequency of rendering and animation updating, default is 60.
       */
      fps: 60,

      /**
       * Layout policy of this stage instance, default is 'always'.
       */
      layoutPolicy: StageLayoutPolicy.ALWAYS,

      /**
       * Update policy of this stage instance, default is 'auto'.
       */
      updatePolicy: StageUpdatePolicy.AUTO,

      /**
       * Whether clear the stage before rendering, default is true.
       */
      autoClear: true
    };
    _this.touchItems = new TouchedObjectSet();
    _this.started = false;
    _this.needUpdate = false;
    _this.eventHandlerInstalled = false;
    _this.eventEnabled = true;
    _this.latestRenderLatencies = void 0;

    for (var k in option) {
      _this.option[k] = option[k];
    }

    _this.canvas = canvas;

    _this.css({
      width: '100%',
      height: '100%',
      left: 0,
      top: 0
    });

    if (option.style) {
      _this.css(option.style);
    }

    if (option.recordRenderLatencies) {
      _this.latestRenderLatencies = new LatestList();
    }

    if (!option.noEventHandler) {
      _this.installEventHandlers();
    }

    _this.ticker = new Ticker(_this.option.fps);
    _this.animationFactory = new AnimationFactory();
    _this.resourceRegistry = new ResourceRegistry();
    return _this;
  }
  /**
   * Marks this stage is invalidate and it will render the canvas in next ticker.
   */


  _createClass(Stage, [{
    key: "updateOnce",
    value: function updateOnce() {
      this.needUpdate = true;
    }
    /**
     * Start the ticker of this stage.
     */

  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      if (!this.started) {
        this.started = true;
        this.layout();
        this.needUpdate = true;
        this.ticker.addEventListener('tick', function (_) {
          _this2.animationFactory.onInterval();

          if (_this2.option.updatePolicy !== StageUpdatePolicy.NEVER && (_this2.needUpdate || _this2.option.updatePolicy === StageUpdatePolicy.ALWAYS)) {
            _this2.update();

            _this2.needUpdate = false;
          }
        });
        ResourceRegistry.DefaultInstance.addEventListener('load', function (e) {
          _this2.updateOnce();
        });
        this.on('update', function () {
          _this2.updateOnce();
        });
      }
    }
    /**
     * Enables the event listeners that stage adds to canvas.
     */

  }, {
    key: "installEventHandlers",
    value: function installEventHandlers() {
      if (!this.eventHandlerInstalled) {
        this.eventHandlerInstalled = true;
        Runtime.get().enableEvents(this);
      }
    }
    /**
     * Enables event for this stage.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "enableEvents",
    value: function enableEvents() {
      this.eventEnabled = true;
      return this;
    }
    /**
     * Disables event for this stage.
     * @returns The current instance. Useful for chaining method calls.
     */

  }, {
    key: "disableEvents",
    value: function disableEvents() {
      this.eventEnabled = false;
      return this;
    }
    /**
     * Returns a list of TouchItems pressed on a given element.
     * @param child A child to find the pressed TouchItems, use stage itself if it is undefined.
     * @returns A list of TouchItems pressed on this element.
     */

  }, {
    key: "getPressedTouchItems",
    value: function getPressedTouchItems(child) {
      if (!child) child = this;
      var touches = this.touchItems.getTouches(child);
      var result = [];

      var _iterator4 = _createForOfIteratorHelper(touches),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var touch = _step4.value;
          if (!touch.pressed) continue;
          result.push(touch.clone());
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return result;
    }
    /**
     * Handles the mouse/touch events from runtime.
     * @param type The type of this event.
     * @param touches The list of touches, if the event is a mouse event, the first touch item
     * contains mouse location and the identifier is always 0.
     * @param e The native event object.
     */

  }, {
    key: "handleMouseOrTouchEvent",
    value: function handleMouseOrTouchEvent(type, touches, e) {
      if (!this.eventEnabled || !this.isVisible()) {
        return;
      }

      switch (type) {
        case 'mousedown':
        case 'touchstart':
          this.handleTouchStartEvent(touches, e);
          break;

        case 'mouseup':
          this.onTouchMove(touches, e);
          this.handleTouchEndEvent([], e);
          break;

        case 'touchend':
        case 'touchcancel':
          this.handleTouchEndEvent(touches, e);
          break;

        case 'mousemove':
        case 'touchmove':
        case 'mouseleave':
          this.onTouchMove(touches, e);
          break;
      }
    }
    /**
     * Handles the mouse/touch events from runtime.
     * @param type The type of this event.
     * @param touches The list of touches, if the event is a mouse event, the first touch item
     * contains mouse location and the identifier is always 0.
     * @param e The native event object.
     */

  }, {
    key: "handleMouseWheelEvent",
    value: function handleMouseWheelEvent(stageX, stageY, deltaX, deltaY, e) {
      var pt = this.globalToLocal(stageX, stageY);
      var element = this.getObjectUnderPoint(pt.x, pt.y, true);

      if (element) {
        var touch = new TouchItem(0, element, stageX, stageY, Date.now());
        touch.deltaX = deltaX;
        touch.deltaY = deltaY;
        this.dispatchTouchEvent(element, 'mousewheel', touch, true, true, e);
      }
    }
    /**
     * Render the stage to target canvas.
     * For performance respective, do not call this method directly, calls updateOnce to let stage
     * render at next ticker.
     */

  }, {
    key: "update",
    value: function update() {
      if (!this.canvas || !this.isVisible()) {
        return;
      }

      var startTime = Date.now();
      var ctx = this.canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      if (this.option.layoutPolicy === StageLayoutPolicy.ALWAYS) {
        this.layout();
      }

      if (this.option.autoClear) {
        ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
      }

      ctx.save();
      this.updateContext(ctx);
      this.draw(ctx, false);
      ctx.restore();

      if (this.latestRenderLatencies) {
        this.latestRenderLatencies.add(Date.now() - startTime);
      }
    }
    /**
     * Calculate stage size and position according to its style.
     */

  }, {
    key: "calculateSize",
    value: function calculateSize() {
      if (!this.canvas || !this.isVisible()) {
        return;
      }

      var canvasWidth = this.canvas.width || this.canvas.clientWidth;
      var canvasHeight = this.canvas.height || this.canvas.clientHeight;
      LayoutUtils.updateSize(this, canvasWidth, canvasHeight);
      LayoutUtils.updatePositionForAbsoluteElement(this, canvasWidth, canvasHeight);
    }
    /**
     * A wrapper function to use this stage's animationFactory to create animation for the given object.
     *
     * ```typescript
     *
     * const stage = ...;
     * const element = ...;
     *
     * stage.animate(element, true).css({color: 'red'}, 1000, 'linear');
     * ```
     *
     * @param element The target element to create the animation for.
     * @param override Whether to remove the existing animation of this element.
     */

  }, {
    key: "animate",
    value: function animate(element) {
      var override = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return this.animationFactory.create(element, override);
    }
    /**
     * A wrapper function to use this stage's animationFactory to stop animation for the given object.
     *
     * ```typescript
     *
     * const stage = ...;
     * const element = ...;
     *
     * stage.stopAnimation(element);
     * ```
     * @param element The target element to create the animation for.
     */

  }, {
    key: "stopAnimation",
    value: function stopAnimation(element) {
      this.animationFactory.removeByTarget(element);
    }
    /**
     * Returns a string representation of this stage object.
     * @returns a string representation of this stage object.
     */

  }, {
    key: "toString",
    value: function toString() {
      return "[Stage (id=".concat(this.id, ")]");
    }
    /**
     * Dispatch a touch event to a child element.
     * @param element The target element to receive this event.
     * @param type Event type.
     * @param currentTouch It contains location and identifier of this event.
     * @param bubble Indicates whether the event bubbles up through its parents or not.
     * @param cancellable Indicates whether the event is cancellable or not.
     * @param e The native event.
     */

  }, {
    key: "dispatchTouchEvent",
    value: function dispatchTouchEvent(element, type, currentTouch, bubble, cancellable, e) {
      var event = new XObjectEvent(type, bubble, cancellable, element, currentTouch);
      event.stage = this;
      event.nativeEvent = e;
      element.dispatchEvent(event);
    }
    /**
     * Handles the touch move event.
     * @param touches The list of touch item.
     * @param e The native event.
     */

  }, {
    key: "onTouchMove",
    value: function onTouchMove(touches, e) {
      var movedTouches = [];
      var newTouches = [];

      var _iterator5 = _createForOfIteratorHelper(touches),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _touch2 = _step5.value;
          var item = this.touchItems.get(_touch2.identifier);

          if (item) {
            if (item.stageX !== _touch2.stageX || item.stageY !== _touch2.stageY) {
              item.onUpdate(_touch2);
              movedTouches.push(item);
            }
          } else {
            newTouches.push(_touch2);
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      for (var _i = 0, _movedTouches = movedTouches; _i < _movedTouches.length; _i++) {
        var touch = _movedTouches[_i];
        var pt = this.globalToLocal(touch.stageX, touch.stageY);
        var element = this.getObjectUnderPoint(pt.x, pt.y, true);

        if (element) {
          this.dispatchTouchEvent(element, 'move', touch, true, true, e);
        }

        if (touch.pressed) {
          this.dispatchTouchEvent(touch.srcElement, 'pressmove', touch, true, true, e);
        } // Checks enter/leave


        if (element) {
          if (touch.currentTarget !== element) {
            var enterElement = element;
            var leaveElement = touch.currentTarget;
            touch.currentTarget = element;

            while (leaveElement) {
              if (enterElement.isChildOf(leaveElement) || enterElement === leaveElement) {
                break;
              }

              this.dispatchTouchEvent(leaveElement, 'leave', touch, false, true, e);
              leaveElement = leaveElement.parent;
            }

            while (enterElement && enterElement !== leaveElement) {
              this.dispatchTouchEvent(enterElement, 'enter', touch, false, true, e);
              enterElement = enterElement.parent;
            }
          }
        } else if (touch.currentTarget) {
          this.dispatchTouchEvent(touch.currentTarget, 'leave', touch, false, true, e);
          touch.currentTarget = undefined;
        }
      }

      for (var _i2 = 0, _newTouches = newTouches; _i2 < _newTouches.length; _i2++) {
        var _touch = _newTouches[_i2];

        var _pt = this.globalToLocal(_touch.stageX, _touch.stageY);

        var _element = this.getObjectUnderPoint(_pt.x, _pt.y, true);

        if (!_element) {
          continue;
        }

        var newMove = _touch.switchSourceElement(_element);

        newMove.pressed = false;
        newMove.currentTarget = _element;
        this.touchItems.add(newMove);
        this.dispatchTouchEvent(_element, 'move', newMove, true, true, e);
        this.dispatchTouchEvent(_element, 'enter', newMove, false, true, e);
      }
    }
    /**
     * Handles the touch start event.
     * @param touches The list of touch item.
     * @param e The native event.
     */

  }, {
    key: "handleTouchStartEvent",
    value: function handleTouchStartEvent(touches, e) {
      var newTouches = new TouchedObjectSet();

      var _iterator6 = _createForOfIteratorHelper(touches),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var touch = _step6.value;
          var existing = this.touchItems.get(touch.identifier);

          if (!existing || !existing.pressed) {
            if (existing) {
              this.touchItems.remove(existing.identifier);
            }

            var element = this.getObjectUnderPoint(touch.stageX, touch.stageY, true);

            if (element) {
              var item = touch.switchSourceElement(element);
              item.currentTarget = element;
              item.pressed = true;
              newTouches.add(item);
              this.touchItems.add(item);
            }
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      var _iterator7 = _createForOfIteratorHelper(newTouches.touchItems),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var _item = _step7.value;
          this.dispatchTouchEvent(_item.srcElement, 'touchdown', _item, true, true, e);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      this.onTouchMove(touches, e);
    }
    /**
     * Handles the touch end event.
     * @param touches The list of touch item.
     * @param e The native event.
     */

  }, {
    key: "handleTouchEndEvent",
    value: function handleTouchEndEvent(touches, e) {
      this.onTouchMove(touches, e);
      var endedTouches = new TouchedObjectSet();

      var _iterator8 = _createForOfIteratorHelper(this.touchItems.touchItems),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var item = _step8.value;
          var exists = false;

          var _iterator11 = _createForOfIteratorHelper(touches),
              _step11;

          try {
            for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
              var touch = _step11.value;

              if (touch.identifier === item.identifier) {
                exists = true;
                break;
              }
            }
          } catch (err) {
            _iterator11.e(err);
          } finally {
            _iterator11.f();
          }

          if (!exists) {
            endedTouches.add(item);
          }
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }

      var _iterator9 = _createForOfIteratorHelper(endedTouches.touchItems),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var _item2 = _step9.value;
          this.touchItems.remove(_item2.identifier);
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      var _iterator10 = _createForOfIteratorHelper(endedTouches.touchItems),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var _item3 = _step10.value;

          if (!_item3.pressed) {
            continue;
          }

          var element = this.getObjectUnderPoint(_item3.stageX, _item3.stageY, true);

          if (element) {
            this.dispatchTouchEvent(element, 'touchup', _item3, true, true, e);
          }

          this.dispatchTouchEvent(_item3.srcElement, 'pressup', _item3, true, true, e);

          if (element === _item3.srcElement || _item3.srcElement.isChildOf(element)) {
            this.dispatchTouchEvent(element, 'click', _item3, true, true, e);
          }
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
    }
  }]);

  return Stage;
}(Container);