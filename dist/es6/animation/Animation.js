function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import { Event, EventDispatcher } from '../base/Event';
import { XObjectEvent } from '../components/XObject';
import { ContainerUtils } from '../utils/ContainerUtils';
import { AlgorithmFactory } from './AlgorithmFactory';
export var AnimationValueType;

(function (AnimationValueType) {
  AnimationValueType[AnimationValueType["NUMBER"] = 1] = "NUMBER";
  AnimationValueType[AnimationValueType["ANIMATABLE"] = 2] = "ANIMATABLE";
})(AnimationValueType || (AnimationValueType = {}));

export var AnimateEventType;

(function (AnimateEventType) {
  AnimateEventType["UPDATE"] = "update";
  AnimateEventType["COMPLETE"] = "complete";
})(AnimateEventType || (AnimateEventType = {}));

export var AnimateEvent = /*#__PURE__*/function (_Event) {
  _inherits(AnimateEvent, _Event);

  function AnimateEvent(type, step, progress, value) {
    var _this;

    _classCallCheck(this, AnimateEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AnimateEvent).call(this, type, false, true));
    _this.step = void 0;
    _this.progress = void 0;
    _this.value = void 0;
    _this.step = step;
    _this.progress = progress;
    _this.value = value;
    return _this;
  }

  _createClass(AnimateEvent, [{
    key: "toString",
    value: function toString() {
      return '[AnimateEvent (type=' + this.type + ')]';
    }
  }]);

  return AnimateEvent;
}(Event);

function isIAnimatable(obj) {
  return obj && obj.isAnimatable && obj.isAnimatable();
}

function isNumber(obj) {
  return typeof obj === 'number';
}

export var AnimationStep = /*#__PURE__*/function () {
  function AnimationStep(target, duration) {
    _classCallCheck(this, AnimationStep);

    this.duration = void 0;
    this.target = void 0;
    this.endTime = 0;
    this.target = target;
    this.duration = duration;
  }

  _createClass(AnimationStep, [{
    key: "onStart",
    value: function onStart() {
      return;
    }
  }, {
    key: "onUpdate",
    value: function onUpdate(percent) {
      return undefined;
    }
  }, {
    key: "onEnd",
    value: function onEnd() {
      return;
    }
  }]);

  return AnimationStep;
}();

var WaitStep = /*#__PURE__*/function (_AnimationStep) {
  _inherits(WaitStep, _AnimationStep);

  function WaitStep() {
    _classCallCheck(this, WaitStep);

    return _possibleConstructorReturn(this, _getPrototypeOf(WaitStep).apply(this, arguments));
  }

  return WaitStep;
}(AnimationStep);

var ToStep = /*#__PURE__*/function (_AnimationStep2) {
  _inherits(ToStep, _AnimationStep2);

  function ToStep(target, value, algorithm, duration) {
    var _this2;

    _classCallCheck(this, ToStep);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ToStep).call(this, target, duration));
    _this2.algorithm = void 0;
    _this2.values = void 0;
    _this2.computed = void 0;

    if (typeof algorithm === 'string') {
      var algo = AlgorithmFactory.get(algorithm);

      if (!algo) {
        throw new Error('unknown algorithm:' + algorithm);
      }

      _this2.algorithm = algo;
    } else {
      _this2.algorithm = algorithm;
    }

    _this2.values = value;
    return _this2;
  }

  _createClass(ToStep, [{
    key: "onStart",
    value: function onStart() {
      this.computed = {};

      if (isNumber(this.target)) {
        this.computed.value = {
          type: AnimationValueType.NUMBER,
          from: this.target,
          to: this.values
        };
      } else if (isIAnimatable(this.target)) {
        var _target = this.target;
        this.computed.value = {
          type: AnimationValueType.ANIMATABLE,
          from: _target,
          to: _target.convertFrom(this.values)
        };
      } else {
        var values = this.values;

        for (var _key in values) {
          var dest = values[_key];
          var _src = this.target[_key];

          if (isIAnimatable(dest)) {
            var to = dest;
            this.computed[_key] = {
              type: AnimationValueType.ANIMATABLE,
              from: to.convertFrom(_src),
              to: to
            };
          } else if (isIAnimatable(_src)) {
            var from = _src;
            this.computed[_key] = {
              type: AnimationValueType.ANIMATABLE,
              from: from,
              to: from.convertFrom(dest)
            };
          } else if (typeof dest === 'number') {
            var _from = _src;

            if (isNaN(_from)) {
              _from = parseFloat(_src + '');

              if (isNaN(_from)) {
                _from = 0;
              }
            }

            this.computed[_key] = {
              type: AnimationValueType.NUMBER,
              from: _from,
              to: dest
            };
          }
        }
      }
    }
  }, {
    key: "onUpdate",
    value: function onUpdate(percent) {
      if (ContainerUtils.isEmpty(this.computed)) {
        return undefined;
      }

      if (isNumber(this.target)) {
        var from = this.computed.value.from;
        var to = this.computed.value.to;
        this.computed.value.current = from + (to - from) * this.algorithm.calculate(percent);
        return this.computed.value.current;
      } else if (isIAnimatable(this.target)) {
        var _from2 = this.computed.value.from;
        var _to = this.computed.value.to;
        this.computed.value.current = _from2.update(_to, this.algorithm.calculate(percent));
        return this.computed.value.current;
      } else {
        var result = {};
        var updated = false;

        for (var name in this.computed) {
          var attr = this.computed[name];

          switch (attr.type) {
            case AnimationValueType.NUMBER:
              {
                var _from3 = attr.from;
                var _to2 = attr.to;
                attr.current = _from3 + (_to2 - _from3) * this.algorithm.calculate(percent);
              }
              break;

            case AnimationValueType.ANIMATABLE:
              {
                var _from4 = attr.from;
                var _to3 = attr.to;
                attr.current = _from4.update(_to3, this.algorithm.calculate(percent));
              }
              break;
          }

          this.target[name] = attr.current;
          result[name] = attr.current;
          updated = true;
        }

        return updated ? result : undefined;
      }
    }
  }]);

  return ToStep;
}(AnimationStep);

var CssStep = /*#__PURE__*/function (_AnimationStep3) {
  _inherits(CssStep, _AnimationStep3);

  function CssStep(target, values, algorithm, duration) {
    var _this3;

    _classCallCheck(this, CssStep);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(CssStep).call(this, target, duration));
    _this3.algorithm = void 0;
    _this3.values = void 0;
    _this3.computed = void 0;

    if (typeof algorithm === 'string') {
      var algo = AlgorithmFactory.get(algorithm);

      if (!algo) {
        throw new Error('unknown algorithm:' + algorithm);
      }

      _this3.algorithm = algo;
    } else {
      _this3.algorithm = algorithm;
    }

    _this3.values = values;
    return _this3;
  }

  _createClass(CssStep, [{
    key: "onStart",
    value: function onStart() {
      this.computed = this.target.style.getSnapshotForAnimation(this.target, this.values);
    }
  }, {
    key: "onUpdate",
    value: function onUpdate(percent) {
      if (ContainerUtils.isEmpty(this.computed)) {
        return undefined;
      }

      var result = {};
      var updated = false;
      var target = this.target;

      for (var name in this.computed) {
        var attr = this.computed[name];

        switch (attr.type) {
          case AnimationValueType.NUMBER:
            {
              var from = attr.from;
              var to = attr.to;
              attr.current = from + (to - from) * this.algorithm.calculate(percent);
            }
            break;

          case AnimationValueType.ANIMATABLE:
            {
              var _from5 = attr.from;
              var _to4 = attr.to;
              attr.current = _from5.update(_to4, this.algorithm.calculate(percent));
            }
            break;
        }

        result[name] = attr.current;
        updated = true;
      }

      if (updated) {
        target.style.applyAnimationResult(result);
        target.dispatchEvent(new XObjectEvent('update', true, true, target));
        return result;
      } else {
        return undefined;
      }
    }
  }]);

  return CssStep;
}(AnimationStep);

var CallStep = /*#__PURE__*/function (_AnimationStep4) {
  _inherits(CallStep, _AnimationStep4);

  function CallStep(target, call) {
    var _this4;

    _classCallCheck(this, CallStep);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(CallStep).call(this, target, 0));
    _this4.call = void 0;
    _this4.call = call;
    return _this4;
  }

  _createClass(CallStep, [{
    key: "onEnd",
    value: function onEnd() {
      this.call(this.target);
    }
  }]);

  return CallStep;
}(AnimationStep);

export var AnimationState;

(function (AnimationState) {
  AnimationState[AnimationState["RUNNING"] = 1] = "RUNNING";
  AnimationState[AnimationState["PAUSED"] = 2] = "PAUSED";
  AnimationState[AnimationState["COMPLETED"] = 3] = "COMPLETED";
  AnimationState[AnimationState["CANCELLED"] = 4] = "CANCELLED";
})(AnimationState || (AnimationState = {}));

export var Animation = /*#__PURE__*/function (_EventDispatcher) {
  _inherits(Animation, _EventDispatcher);

  function Animation(target, loop) {
    var _this5;

    _classCallCheck(this, Animation);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Animation).call(this));
    _this5.playTimes = 1;
    _this5.state = AnimationState.RUNNING;
    _this5.target = void 0;
    _this5.steps = [];
    _this5.roundStartTime = 0;
    _this5.beginTime = void 0;
    _this5.pauseTime = void 0;
    _this5.duration = 0;
    _this5.currentStepIndex = 0;
    _this5.currentStepProgress = 0;
    _this5.target = target;
    _this5.playTimes = loop ? 0 : 1;
    _this5.roundStartTime = _this5.beginTime = Date.now();
    _this5.currentStepIndex = 0;
    _this5.state = AnimationState.RUNNING;
    return _this5;
  }

  _createClass(Animation, [{
    key: "toPromise",
    value: function toPromise() {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        _this6.addEventListener(AnimateEventType.COMPLETE, function (event) {
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
      this.addStep(new ToStep(this.target, props, algorithm, duration));
      return this;
    }
  }, {
    key: "css",
    value: function css(props, duration) {
      var algorithm = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'linear';
      this.addStep(new CssStep(this.target, props, algorithm, duration));
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
        this.doUpdateInternal(1);
        currentStep.onEnd();

        for (++this.currentStepIndex; this.currentStepIndex < this.steps.length; ++this.currentStepIndex) {
          var step = this.steps[this.currentStepIndex];
          step.onStart();
          this.doUpdateInternal(1);
          step.onEnd();
        } // Check whether to start a new round


        var newRound = true;

        if (this.playTimes > 0) {
          newRound = this.playTimes * this.duration > now - this.beginTime;
        }

        if (!newRound) {
          this.currentStepIndex = this.steps.length - 1;
          this.state = AnimationState.COMPLETED;
          this.dispatchEvent(new AnimateEvent(AnimateEventType.COMPLETE, this.currentStepIndex, this.currentStepProgress));
        } else {
          // New loop
          passed = passed % this.duration;
          this.roundStartTime = now - passed;
          this.currentStepIndex = 0;

          while (true) {
            var _step = this.steps[this.currentStepIndex];

            _step.onStart();

            if (_step.endTime > passed) {
              var _progress = 1 - (_step.endTime - passed) / _step.duration;

              this.doUpdateInternal(_progress);
              break;
            } else {
              this.doUpdateInternal(1);

              _step.onEnd();

              ++this.currentStepIndex;
            }
          }
        }
      } else {
        if (currentStep.endTime > passed) {
          var _progress2 = 1 - (currentStep.endTime - passed) / currentStep.duration;

          this.doUpdateInternal(_progress2);
        } else {
          this.doUpdateInternal(1);
          currentStep.onEnd();
          ++this.currentStepIndex;

          while (true) {
            var _step2 = this.steps[this.currentStepIndex];

            _step2.onStart();

            if (_step2.endTime > passed && _step2.duration > 0) {
              var _progress3 = 1 - (_step2.endTime - passed) / _step2.duration;

              this.doUpdateInternal(_progress3);
              break;
            } else {
              this.doUpdateInternal(1);

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
      this.dispatchEvent(new AnimateEvent(AnimateEventType.COMPLETE, this.currentStepIndex, this.currentStepProgress));
    }
  }, {
    key: "doUpdateInternal",
    value: function doUpdateInternal(progress) {
      this.currentStepProgress = progress;
      var result = this.steps[this.currentStepIndex].onUpdate(progress);

      if (result) {
        this.dispatchEvent(new AnimateEvent(AnimateEventType.UPDATE, this.currentStepIndex, this.currentStepProgress, result));
      }
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
}(EventDispatcher);