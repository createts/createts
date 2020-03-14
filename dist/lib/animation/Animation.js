"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Animation = exports.AnimationState = exports.AnimationStep = exports.AnimateEvent = exports.AnimateEventType = exports.AnimationValueType = void 0;

var _BaseValue = require("../base/BaseValue");

var _Color = require("../base/Color");

var _Event2 = require("../base/Event");

var _Background = require("../style/Background");

var _Border = require("../style/Border");

var _Shadow = require("../style/Shadow");

var _AlgorithmFactory = require("./AlgorithmFactory");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AnimationValueType;
exports.AnimationValueType = AnimationValueType;

(function (AnimationValueType) {
  AnimationValueType[AnimationValueType["NUMBER"] = 1] = "NUMBER";
  AnimationValueType[AnimationValueType["BASEVALUE"] = 2] = "BASEVALUE";
  AnimationValueType[AnimationValueType["COLOR"] = 3] = "COLOR";
  AnimationValueType[AnimationValueType["BORDER"] = 4] = "BORDER";
  AnimationValueType[AnimationValueType["SHADOW"] = 5] = "SHADOW";
})(AnimationValueType || (exports.AnimationValueType = AnimationValueType = {}));

var AnimateEventType;
exports.AnimateEventType = AnimateEventType;

(function (AnimateEventType) {
  AnimateEventType["UPDATE"] = "update";
  AnimateEventType["COMPLETE"] = "complete";
})(AnimateEventType || (exports.AnimateEventType = AnimateEventType = {}));

var AnimateEvent =
/*#__PURE__*/
function (_Event) {
  _inherits(AnimateEvent, _Event);

  function AnimateEvent(type, progress, currentStep, currentProgress) {
    var _this;

    _classCallCheck(this, AnimateEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AnimateEvent).call(this, type, false, true));
    _this.progress = void 0;
    _this.currentStep = void 0;
    _this.currentProgress = void 0;
    _this.progress = progress;
    _this.currentStep = currentStep;
    _this.currentProgress = currentProgress;
    return _this;
  }

  _createClass(AnimateEvent, [{
    key: "toString",
    value: function toString() {
      return '[AnimateEvent (type=' + this.type + ')]';
    }
  }]);

  return AnimateEvent;
}(_Event2.Event);

exports.AnimateEvent = AnimateEvent;

var AnimationStep =
/*#__PURE__*/
function () {
  function AnimationStep(target, duration) {
    _classCallCheck(this, AnimationStep);

    this.duration = void 0;
    this.target = void 0;
    this.endTime = 0;
    this.target = target;
    this.duration = duration;
  } // tslint:disable-next-line: no-empty


  _createClass(AnimationStep, [{
    key: "onStart",
    value: function onStart() {} // Returns true to ask stage to update the canvas.

  }, {
    key: "onUpdate",
    value: function onUpdate(percent) {
      return false;
    } // tslint:disable-next-line: no-empty

  }, {
    key: "onEnd",
    value: function onEnd() {}
  }]);

  return AnimationStep;
}();

exports.AnimationStep = AnimationStep;

var WaitStep =
/*#__PURE__*/
function (_AnimationStep) {
  _inherits(WaitStep, _AnimationStep);

  function WaitStep() {
    _classCallCheck(this, WaitStep);

    return _possibleConstructorReturn(this, _getPrototypeOf(WaitStep).apply(this, arguments));
  }

  return WaitStep;
}(AnimationStep);

var StyleStep =
/*#__PURE__*/
function (_AnimationStep2) {
  _inherits(StyleStep, _AnimationStep2);

  function StyleStep(target, props, algorithm, duration) {
    var _this2;

    _classCallCheck(this, StyleStep);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(StyleStep).call(this, target, duration));
    _this2.algorithm = void 0;
    _this2.props = void 0;
    _this2.computed = void 0;

    if (typeof algorithm === 'string') {
      var algo = _AlgorithmFactory.AlgorithmFactory.get(algorithm);

      if (!algo) {
        throw new Error('unknow algorithm:' + algorithm);
      }

      _this2.algorithm = algo;
    } else {
      _this2.algorithm = algorithm;
    }

    _this2.props = props;
    return _this2;
  }

  _createClass(StyleStep, [{
    key: "onStart",
    value: function onStart() {
      this.computed = this.target.style.getSnapshotForAnimation(this.target, this.props);
    }
  }, {
    key: "onUpdate",
    value: function onUpdate(percent) {
      if (!this.computed) {
        return false;
      }

      for (var name in this.computed) {
        var attr = this.computed[name];

        switch (attr.type) {
          case AnimationValueType.NUMBER:
            {
              var from = attr.from;
              var to = attr.to;
              this.target.style[name] = from + (to - from) * this.algorithm.calclate(percent);
            }
            break;

          case AnimationValueType.BASEVALUE:
            {
              var _from = attr.from;
              var _to = attr.to;
              this.target.style[name] = new _BaseValue.BaseValue(_from.numberValue + (_to.numberValue - _from.numberValue) * this.algorithm.calclate(percent), _to.unit);
            }
            break;

          case AnimationValueType.COLOR:
            {
              var _from2 = attr.from;
              var _to2 = attr.to;
              var v = this.algorithm.calclate(percent);
              var color = new _Color.Color(_from2.r + (_to2.r - _from2.r) * v, _from2.g + (_to2.g - _from2.g) * v, _from2.b + (_to2.b - _from2.b) * v, _from2.a + (_to2.a - _from2.a) * v);

              if (name === 'backgroundColor') {
                if (!this.target.style.background) {
                  this.target.style.background = new _Background.Background();
                }

                this.target.style.background.color = color;
              } else {
                this.target.style[name] = color;
              }
            }
            break;

          case AnimationValueType.BORDER:
            {
              var _from3 = attr.from;
              var _to3 = attr.to;

              var _v = this.algorithm.calclate(percent);

              this.target.style[name] = new _Border.Border(_from3.width + (_to3.width - _from3.width) * _v, _from3.style, new _Color.Color(_from3.color.r + (_to3.color.r - _from3.color.r) * _v, _from3.color.g + (_to3.color.g - _from3.color.g) * _v, _from3.color.b + (_to3.color.b - _from3.color.b) * _v, _from3.color.a + (_to3.color.a - _from3.color.a) * _v));
            }
            break;

          case AnimationValueType.SHADOW:
            {
              var _from4 = attr.from;
              var _to4 = attr.to;

              var _v2 = this.algorithm.calclate(percent);

              this.target.style[name] = new _Shadow.Shadow(_from4.offsetX + (_to4.offsetX - _from4.offsetX) * _v2, _from4.offsetY + (_to4.offsetY - _from4.offsetY) * _v2, _from4.blur + (_to4.blur - _from4.blur) * _v2, new _Color.Color(_from4.color.r + (_to4.color.r - _from4.color.r) * _v2, _from4.color.g + (_to4.color.g - _from4.color.g) * _v2, _from4.color.b + (_to4.color.b - _from4.color.b) * _v2, _from4.color.a + (_to4.color.a - _from4.color.a) * _v2));
            }
            break;
        }
      }

      return true;
    }
  }]);

  return StyleStep;
}(AnimationStep);

var CallStep =
/*#__PURE__*/
function (_AnimationStep3) {
  _inherits(CallStep, _AnimationStep3);

  function CallStep(target, call) {
    var _this3;

    _classCallCheck(this, CallStep);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(CallStep).call(this, target, 0));
    _this3.call = void 0;
    _this3.call = call;
    return _this3;
  }

  _createClass(CallStep, [{
    key: "onEnd",
    value: function onEnd() {
      this.call();
    }
  }]);

  return CallStep;
}(AnimationStep);

var AnimationState;
exports.AnimationState = AnimationState;

(function (AnimationState) {
  AnimationState[AnimationState["RUNNING"] = 1] = "RUNNING";
  AnimationState[AnimationState["PAUSED"] = 2] = "PAUSED";
  AnimationState[AnimationState["COMPLETED"] = 3] = "COMPLETED";
  AnimationState[AnimationState["CANCELLED"] = 4] = "CANCELLED";
})(AnimationState || (exports.AnimationState = AnimationState = {}));

var Animation =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(Animation, _EventDispatcher);

  function Animation(target, loop) {
    var _this4;

    _classCallCheck(this, Animation);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Animation).call(this));
    _this4.playTimes = 1;
    _this4.state = AnimationState.RUNNING;
    _this4.target = void 0;
    _this4.steps = [];
    _this4.roundStartTime = 0;
    _this4.beginTime = void 0;
    _this4.pauseTime = void 0;
    _this4.duration = 0;
    _this4.currentStepIndex = 0;
    _this4.currentStepProgress = 0;
    _this4.totalProgress = 0;
    _this4.target = target;
    _this4.playTimes = loop ? 0 : 1;
    _this4.roundStartTime = _this4.beginTime = Date.now();
    _this4.currentStepIndex = 0;
    _this4.state = AnimationState.RUNNING;
    return _this4;
  }

  _createClass(Animation, [{
    key: "toPromise",
    value: function toPromise() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5.addEventListener(AnimateEventType.COMPLETE, function (event) {
          resolve(event);
        });
      });
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.state === AnimationState.RUNNING) {
        this.state = AnimationState.PAUSED;
        this.pauseTime = Date.now();
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "resume",
    value: function resume() {
      if (this.state === AnimationState.PAUSED) {
        var duration = Date.now() - this.pauseTime;
        this.roundStartTime += duration;
        this.beginTime += duration;
        this.state = AnimationState.RUNNING;
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "loop",
    value: function loop(_loop) {
      this.playTimes = _loop ? 0 : 1;
      return this;
    }
  }, {
    key: "times",
    value: function times(_times) {
      this.playTimes = _times;
      return this;
    }
  }, {
    key: "to",
    value: function to(props, duration) {
      var algorithm = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'linear';
      this.addStep(new StyleStep(this.target, props, algorithm, duration));
      return this;
    }
  }, {
    key: "call",
    value: function call(_call) {
      return this.addStep(new CallStep(this.target, _call));
    }
  }, {
    key: "wait",
    value: function wait(duration) {
      return this.addStep(new WaitStep(this.target, duration));
    }
  }, {
    key: "onInterval",
    value: function onInterval() {
      if (this.duration <= 0) {
        // This is an empty animation without any step.
        return false;
      }

      var now = Date.now();

      if (now < this.roundStartTime) {
        // The current time is before start time, this is usually caused by changing system time
        // during animation playing, ignore this.
        return false;
      }

      var passed = now - this.roundStartTime;
      var currentStep = this.steps[this.currentStepIndex];

      if (passed >= this.duration) {
        // To end
        currentStep.onUpdate(1);
        currentStep.onEnd();

        for (++this.currentStepIndex; this.currentStepIndex < this.steps.length; ++this.currentStepIndex) {
          var step = this.steps[this.currentStepIndex];
          step.onStart();
          step.onUpdate(1);
          step.onEnd();
        } // Check whether to start a new round


        var newRound = true;

        if (this.playTimes > 0) {
          newRound = this.playTimes * this.duration > now - this.beginTime;
        }

        if (!newRound) {
          this.currentStepIndex = this.steps.length - 1;
          this.onUpdateInternal(1, 1);
          this.state = AnimationState.COMPLETED;
          this.dispatchEvent(new AnimateEvent(AnimateEventType.COMPLETE, this.totalProgress, this.currentStepIndex, this.currentStepProgress));
        } else {
          // New loop
          passed = passed % this.duration;
          this.roundStartTime = now - passed;
          this.currentStepIndex = 0;

          while (true) {
            var _step = this.steps[this.currentStepIndex];

            _step.onStart();

            if (_step.endTime > passed) {
              var progress = 1 - (_step.endTime - passed) / _step.duration;
              this.onUpdateInternal(progress, passed / this.duration);
              break;
            } else {
              _step.onUpdate(1);

              _step.onEnd();

              ++this.currentStepIndex;
            }
          }
        }
      } else {
        if (currentStep.endTime > passed) {
          var _progress = 1 - (currentStep.endTime - passed) / currentStep.duration;

          this.onUpdateInternal(_progress, passed / this.duration);
        } else {
          currentStep.onUpdate(1);
          currentStep.onEnd();
          ++this.currentStepIndex;

          while (true) {
            var _step2 = this.steps[this.currentStepIndex];

            _step2.onStart();

            if (_step2.endTime > passed && _step2.duration > 0) {
              var _progress2 = 1 - (_step2.endTime - passed) / _step2.duration;

              this.onUpdateInternal(_progress2, passed / this.duration);
              break;
            } else {
              _step2.onUpdate(1);

              _step2.onEnd();

              ++this.currentStepIndex;
            }
          }
        }
      }

      return true;
    }
  }, {
    key: "cancel",
    value: function cancel() {
      this.state = AnimationState.CANCELLED;
      this.dispatchEvent(new AnimateEvent(AnimateEventType.COMPLETE, this.totalProgress, this.currentStepIndex, this.currentStepProgress));
    }
  }, {
    key: "onUpdateInternal",
    value: function onUpdateInternal(currentStepProgress, totalProgress) {
      this.currentStepProgress = currentStepProgress;
      this.totalProgress = totalProgress;
      this.steps[this.currentStepIndex].onUpdate(currentStepProgress);
      this.dispatchEvent(new AnimateEvent(AnimateEventType.UPDATE, this.totalProgress, this.currentStepIndex, this.currentStepProgress));
    }
  }, {
    key: "addStep",
    value: function addStep(step) {
      this.steps.push(step);
      this.duration += step.duration;
      step.endTime = this.duration;

      if (this.steps.length === 1) {
        step.onStart();
      }

      return this;
    }
  }]);

  return Animation;
}(_Event2.EventDispatcher);

exports.Animation = Animation;