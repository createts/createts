function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { AnimationFactory } from '../animation/AnimationFactory';
import { ResourceRegistry } from '../resource/ResourceRegistry';
import { Runtime } from '../Runtime';
import { Ticker } from '../Ticker';
import { LayoutUtils } from '../utils/LayoutUtils';
import { Container } from './Container';
import { TouchEvent } from './XObject';
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
 * 1. **IN_ANIMATION**: stage only update canvas during the animation.
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
  StageUpdatePolicy["IN_ANIMATION"] = "in_animation";
  StageUpdatePolicy["ALWAYS"] = "always";
})(StageUpdatePolicy || (StageUpdatePolicy = {}));

/**
 * A helper class for staging to hold the touch status of its children.
 */
var TouchedObjectSet =
/*#__PURE__*/
function () {
  function TouchedObjectSet() {
    _classCallCheck(this, TouchedObjectSet);

    this.objects = [];
  }

  _createClass(TouchedObjectSet, [{
    key: "contains",

    /**
     * Checks whether this instance contains a TouchItem with this touch identifier.
     * @param identifier Touch identifier to query.
     * @returns True if this instance contains a TouchItem with same identifier, false otherwise.
     */
    value: function contains(identifier) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          if (item.touch.identifier === identifier) {
            return true;
          }
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

      return false;
    }
    /**
     * Gets TouchedObject instance by a given touch identifier.
     * @param identifier Touch identifier to query.
     * @returns TouchedObject object if this instance contains a TouchItem with same identifier,
     * undefined otherwise.
     */

  }, {
    key: "get",
    value: function get(identifier) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.objects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          if (item.touch.identifier === identifier) {
            return item;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return undefined;
    }
    /**
     * Puts a pair of XObject and TouchItem instances into current set, caller must make sure that
     * only put the new TouchItem, this method does not check whether there is an existing pair
     * contains same touch identifier.
     * @param object The XObject instance.
     * @param touch  The TouchItem instance.
     */

  }, {
    key: "add",
    value: function add(object, touch) {
      this.objects.push({
        object: object,
        touch: touch
      });
    }
    /**
     * Removes the pair with same touch identifier.
     * @param identifier The touch identifier used to find the pair to be removed.
     */

  }, {
    key: "remove",
    value: function remove(identifier) {
      for (var i = 0; i < this.objects.length; ++i) {
        if (this.objects[i].touch.identifier === identifier) {
          this.objects.splice(i, 1);
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
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.objects[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var item = _step3.value;

          if (item.object === object) {
            result.push(item.touch);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
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


export var Stage =
/*#__PURE__*/
function (_Container) {
  _inherits(Stage, _Container);

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
   * Contains paris of touched children and touch information.
   */

  /**
   * Contains paris of hovered children and touch information.
   */

  /**
   * Indicated whether this stage object is started to render or not.
   */

  /**
   * Indicated whether this stage is invalidate and needs to be rendered.
   */

  /**
   * Construct a stage object by canvas and option.
   *
   * Example
   *
   * ```typescript
   * const canvas = windows.getElementById('canvas');
   * const stage = new Stage(canvas);
   * const parser = new Parser();
   * const html = `
   *    <div style='background:red;width:50%;height:100%'>
   *      <div style='background:yellow;width:50%;height:50%'></div>
   *    </div>
   *    <div style='background:green;width:50%;height:100%'></div>
   * `;
   * const children = parser.parse(html);
   * stage.addChildren(...children);
   * stage.start();
   * ```
   *
   * @param canvas The target canvas object this stage renders to.
   * @param option The parameters to create this stage instance.
   */
  function Stage(canvas) {
    var _this;

    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Stage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Stage).call(this));
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
       * Update policy of this stage instance, default is 'in-animation'.
       */
      updatePolicy: StageUpdatePolicy.IN_ANIMATION,

      /**
       * Whether clear the stage before rendering, default is true.
       */
      autoClear: true
    };
    _this.touchedChildren = new TouchedObjectSet();
    _this.hoverChildren = new TouchedObjectSet();
    _this.started = false;
    _this.needUpdate = false;

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

    _this.enableEvents();

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
          if (_this2.animationFactory.onInterval()) {
            _this2.needUpdate = true;
          }

          if (_this2.needUpdate || _this2.option.updatePolicy === StageUpdatePolicy.ALWAYS) {
            _this2.update();

            _this2.needUpdate = false;
          }
        });
      }
    }
    /**
     * Enables the event listeners that stage adds to canvas.
     */

  }, {
    key: "enableEvents",
    value: function enableEvents() {
      Runtime.get().enableEvents(this);
    }
    /**
     * Handle the mouse/touch events from runtime.
     * @param type The type of this event.
     * @param touches The list of touches, if the event is a mouse event, the first touch item
     * contains mouse location and the identifier is always 0.
     * @param e The native event object.
     */

  }, {
    key: "handleMouseEvent",
    value: function handleMouseEvent(type, touches, e) {
      if (!this.isVisible()) {
        return;
      }

      switch (type) {
        case 'mousedown':
        case 'touchstart':
          this.handleTouchStartEvent(touches, e);
          break;

        case 'mouseup':
          this.handleTouchEndEvent([], e);
          break;

        case 'touchend':
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

      var canvasWidth = this.canvas.width;
      var canvasHeight = this.canvas.height;
      LayoutUtils.updateSize(this, canvasWidth, canvasHeight);
      LayoutUtils.updatePositionForAbsoluteElement(this, canvasWidth, canvasHeight);
    }
    /**
     * A wrapper function to use this stage's animationFactory to create animation for the given child.
     *
     * ```typescript
     *
     * const stage = ...;
     * const element = ...;
     *
     * stage.animate(element, true).to({color: 'red'}, 'linear', 1000);
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
     * @param bubble Indicates whether the event bubbles up through its parents or not.
     * @param currentTouch It contains location and identifier of this event.
     * @param e The native event.
     */

  }, {
    key: "dispatchTouchEvent",
    value: function dispatchTouchEvent(element, type, bubble, currentTouch, e) {
      var event = new TouchEvent(element, type, bubble, currentTouch, this.touchedChildren.getTouches(element), true);
      event.stage = this;
      event.nativeEvent = e;
      element.dispatchEvent(event);
    }
    /**
     * Dispatch a non-cancellable touch event to a child element.
     * @param element The target element to receive this event.
     * @param type Event type.
     * @param bubble Indicates whether the event bubbles up through its parents or not.
     * @param currentTouch It contains location and identifier of this event.
     * @param e The native event.
     */

  }, {
    key: "dispatchNonCancellableTouchEvent",
    value: function dispatchNonCancellableTouchEvent(element, type, bubble, currentTouch, e) {
      var event = new TouchEvent(element, type, bubble, currentTouch, this.touchedChildren.getTouches(element), false);
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
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = touches[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var touch = _step4.value;
          var item = this.touchedChildren.get(touch.identifier);

          if (item) {
            if (item.touch.stageX !== touch.stageX || item.touch.stageY !== touch.stageY) {
              item.touch = touch;
              movedTouches.push(touch);
            }
          } else {
            movedTouches.push(touch);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      for (var _i = 0, _movedTouches = movedTouches; _i < _movedTouches.length; _i++) {
        var _touch = _movedTouches[_i];
        var pt = this.globalToLocal(_touch.stageX, _touch.stageY);
        var element = this.getObjectUnderPoint(pt.x, pt.y, true);

        if (element) {
          this.dispatchTouchEvent(element, 'move', true, _touch, e);
        }

        var touchedItem = this.touchedChildren.get(_touch.identifier);

        if (touchedItem) {
          this.dispatchTouchEvent(touchedItem.object, 'pressmove', true, touchedItem.touch, e);
        } // Checks enter/leave


        var hovedItem = this.hoverChildren.get(_touch.identifier);

        if (hovedItem && element) {
          if (hovedItem.object !== element) {
            var enterElement = element;
            var leaveElement = hovedItem.object;
            hovedItem.object = element;
            hovedItem.touch = _touch;

            while (leaveElement) {
              if (enterElement.isChildOf(leaveElement) || enterElement === leaveElement) {
                break;
              }

              this.dispatchTouchEvent(leaveElement, 'leave', false, _touch, e);
              leaveElement = leaveElement.parent;
            }

            while (enterElement && enterElement !== leaveElement) {
              this.dispatchTouchEvent(enterElement, 'enter', false, _touch, e);
              enterElement = enterElement.parent;
            }
          }
        } else if (element) {
          this.hoverChildren.add(element, _touch);
          this.dispatchNonCancellableTouchEvent(element, 'enter', true, _touch, e);
        } else if (hovedItem) {
          this.hoverChildren.remove(_touch.identifier);
          this.dispatchNonCancellableTouchEvent(hovedItem.object, 'leave', true, _touch, e);
        }
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
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = touches[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var touch = _step5.value;

          if (!this.touchedChildren.contains(touch.identifier)) {
            var element = this.getObjectUnderPoint(touch.stageX, touch.stageY, true);

            if (element) {
              newTouches.add(element, touch);
              this.touchedChildren.add(element, touch);
            }
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = newTouches.objects[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var item = _step6.value;
          this.dispatchTouchEvent(item.object, 'touchdown', true, item.touch, e);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
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
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this.touchedChildren.objects[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var item = _step7.value;
          var exists = false;
          var _iteratorNormalCompletion10 = true;
          var _didIteratorError10 = false;
          var _iteratorError10 = undefined;

          try {
            for (var _iterator10 = touches[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
              var touch = _step10.value;

              if (touch.identifier === item.touch.identifier) {
                exists = true;
                break;
              }
            }
          } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion10 && _iterator10["return"] != null) {
                _iterator10["return"]();
              }
            } finally {
              if (_didIteratorError10) {
                throw _iteratorError10;
              }
            }
          }

          if (!exists) {
            endedTouches.add(item.object, item.touch);
          }
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = endedTouches.objects[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var _item = _step8.value;
          this.touchedChildren.remove(_item.touch.identifier);
          this.hoverChildren.remove(_item.touch.identifier);
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
            _iterator8["return"]();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = endedTouches.objects[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var _item2 = _step9.value;
          var element = this.getObjectUnderPoint(_item2.touch.stageX, _item2.touch.stageY, true);

          if (element) {
            this.dispatchTouchEvent(element, 'touchup', true, _item2.touch, e);
          }

          this.dispatchTouchEvent(_item2.object, 'pressup', true, _item2.touch, e);

          if (element === _item2.object || _item2.object.isChildOf(element)) {
            this.dispatchTouchEvent(element, 'click', true, _item2.touch, e);
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
            _iterator9["return"]();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }
    }
  }]);

  return Stage;
}(Container);