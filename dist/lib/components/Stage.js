"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stage = exports.StageLayoutPolicy = void 0;

var _AnimationFactory = require("../animation/AnimationFactory");

var _Runtime = require("../Runtime");

var _Ticker = require("../Ticker");

var _LayoutUtils = require("../utils/LayoutUtils");

var _Container2 = require("./Container");

var _XObject = require("./XObject");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var StageLayoutPolicy;
exports.StageLayoutPolicy = StageLayoutPolicy;

(function (StageLayoutPolicy) {
  StageLayoutPolicy["NEVER"] = "never";
  StageLayoutPolicy["ALWAYS"] = "always";
})(StageLayoutPolicy || (exports.StageLayoutPolicy = StageLayoutPolicy = {}));

var Stage =
/*#__PURE__*/
function (_Container) {
  _inherits(Stage, _Container);

  function Stage(canvas) {
    var _this;

    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Stage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Stage).call(this));
    _this.canvas = void 0;
    _this.ticker = void 0;
    _this.animationFactory = void 0;
    _this.option = {
      fps: 60,
      layoutPolicy: StageLayoutPolicy.NEVER,
      autoClear: true
    };
    _this.pressedChild = void 0;
    _this.hovedChildren = [];
    _this.started = false;

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

    _this.ticker = new _Ticker.Ticker(_this.option.fps);
    _this.animationFactory = new _AnimationFactory.AnimationFactory();

    _this.ticker.addEventListener('tick', function (_) {
      _this.animationFactory.onInterval();
    });

    return _this;
  }

  _createClass(Stage, [{
    key: "start",
    value: function start() {
      var _this2 = this;

      if (!this.started) {
        this.started = true;
        this.layout();
        this.ticker.addEventListener('tick', function (time) {
          _this2.update();
        });
      }
    }
  }, {
    key: "enableEvents",
    value: function enableEvents() {
      _Runtime.Runtime.get().enableEvents(this);
    }
  }, {
    key: "reportHovedChild",
    value: function reportHovedChild(child) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.hovedChildren[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var c = _step.value;

          if (c === child) {
            return;
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

      this.hovedChildren.push(child);
    }
  }, {
    key: "handleActionEvent",
    value: function handleActionEvent(type, pt, e) {
      if (!this.isVisible()) {
        return;
      }

      pt = this.globalToLocal(pt.x, pt.y);

      switch (type) {
        case 'mousedown':
          this.handleTouchDownEvent(pt, e);
          break;

        case 'mouseup':
          this.handleTouchUpEvent(pt, e);
          break;

        case 'mousemove':
          this.handleTouchMoveEvent(pt, e);
          break;

        case 'mouseleave':
          this.handleMouseLeaveEvent(pt, e);
          break;
      }
    }
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
  }, {
    key: "calculateSize",
    value: function calculateSize() {
      if (!this.canvas || !this.isVisible()) {
        return;
      }

      var canvasWidth = this.canvas.width;
      var canvasHeight = this.canvas.height;

      _LayoutUtils.LayoutUtils.updateSize(this, canvasWidth, canvasHeight);

      _LayoutUtils.LayoutUtils.updatePositionForAbsoluteElement(this, canvasWidth, canvasHeight);
    }
  }, {
    key: "animate",
    value: function animate(element) {
      var override = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return this.animationFactory.create(element, override);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "[Stage (id=".concat(this.id, ")]");
    }
  }, {
    key: "dispatchActionEvent",
    value: function dispatchActionEvent(element, type, bubble, pt, e) {
      var event = new _XObject.XActionEvent(element, type, bubble);
      event.stage = this;
      event.stageX = pt.x;
      event.stageY = pt.y;
      event.nativeEvent = e;
      element.dispatchEvent(event);
    }
  }, {
    key: "handleMouseLeaveEvent",
    value: function handleMouseLeaveEvent(pt, e) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.hovedChildren[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var child = _step2.value;
          child.actionState.inBounds = false;
          this.dispatchActionEvent(child, 'leave', false, pt, e);
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

      this.hovedChildren = [];
    }
  }, {
    key: "handleTouchDownEvent",
    value: function handleTouchDownEvent(pt, e) {
      var ele = this.getObjectUnderPoint(pt.x, pt.y, true);

      if (ele) {
        this.dispatchActionEvent(ele, 'pressdown', true, pt, e);
        this.pressedChild = ele;
      } else {
        this.pressedChild = undefined;
      }
    }
  }, {
    key: "handleTouchUpEvent",
    value: function handleTouchUpEvent(pt, e) {
      var ele = this.getObjectUnderPoint(pt.x, pt.y, true);

      if (ele) {
        this.dispatchActionEvent(ele, 'touchup', true, pt, e);
      }

      if (this.pressedChild) {
        this.pressedChild.actionState.pressed = false;
        this.dispatchActionEvent(this.pressedChild, 'pressup', true, pt, e);

        if (ele) {
          if (ele === this.pressedChild || this.pressedChild.isChildOf(ele)) {
            this.dispatchActionEvent(ele, 'click', true, pt, e);
          }
        }
      }

      this.pressedChild = undefined;
    }
  }, {
    key: "handleTouchMoveEvent",
    value: function handleTouchMoveEvent(pt, e) {
      pt = this.globalToLocal(pt.x, pt.y);
      var ele = this.getObjectUnderPoint(pt.x, pt.y, true);

      if (ele) {
        var hoved = [];
        var current = ele;
        var cursor;

        while (current) {
          if (!current.actionState.inBounds) {
            current.actionState.inBounds = true;
            this.dispatchActionEvent(current, 'enter', false, pt, e);
          }

          hoved.push(current);

          if (cursor === undefined && current.style.cursor) {
            cursor = current.style.cursor;
          }

          current = current.parent;
        }

        if (this.canvas.style) {
          this.canvas.style.cursor = cursor || 'auto';
        }

        this.dispatchActionEvent(ele, 'move', true, pt, e);
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.hovedChildren[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var child = _step3.value;
            var found = false;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = hoved[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var h = _step4.value;

                if (h === child) {
                  found = true;
                  break;
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

            if (!found) {
              child.actionState.inBounds = false;
              this.dispatchActionEvent(child, 'leave', false, pt, e);
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

        this.hovedChildren = hoved;
      } else {
        if (this.canvas.style) {
          this.canvas.style.cursor = this.style.cursor || 'auto';
        }

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.hovedChildren[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _child = _step5.value;
            _child.actionState.inBounds = false;
            this.dispatchActionEvent(_child, 'leave', false, pt, e);
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

        this.hovedChildren.length = 0;
      }

      if (this.pressedChild) {
        this.dispatchActionEvent(this.pressedChild, 'pressmove', true, pt, e);
      }
    }
  }]);

  return Stage;
}(_Container2.Container);

exports.Stage = Stage;