"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlgorithmFactory = exports.ElasticInOut = exports.ElasticOut = exports.ElasticIn = exports.BounceInOut = exports.BounceIn = exports.BounceOut = exports.CircInOut = exports.CircOut = exports.CircIn = exports.BackInOut = exports.BackOut = exports.BackIn = exports.SineInOut = exports.SineOut = exports.SineIn = exports.PowInOut = exports.PowOut = exports.PowIn = exports.Linear = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The AlgorithmFactory provides a collection of easing functions for use with TweenJS. It does not use the standard 4 param
 * easing signature. Instead it uses a single param which indicates the current linear ratio (0 to 1) of the tween.
 *
 * Most methods on Ease can be passed directly as easing functions:
 *
 *      Tween.get(target).to({x:100}, 500, Ease.linear);
 *
 * However, methods beginning with "get" will return an easing function based on parameter values:
 *
 *      Tween.get(target).to({y:200}, 500, Ease.getPowIn(2.2));
 *
 * Please see the <a href="http://www.createjs.com/Demos/TweenJS/Tween_SparkTable">spark table demo</a> for an
 * overview of the different ease types on <a href="http://tweenjs.com">TweenJS.com</a>.
 *
 * <em>Equations derived from work by Robert Penner.</em>
 */
var Linear =
/*#__PURE__*/
function () {
  function Linear() {
    _classCallCheck(this, Linear);
  }

  _createClass(Linear, [{
    key: "calclate",
    value: function calclate(percent) {
      return percent;
    }
  }]);

  return Linear;
}();

exports.Linear = Linear;

var PowIn =
/*#__PURE__*/
function () {
  function PowIn(pow) {
    _classCallCheck(this, PowIn);

    this.pow = pow;
  }

  _createClass(PowIn, [{
    key: "calclate",
    value: function calclate(percent) {
      return Math.pow(percent, this.pow);
    }
  }]);

  return PowIn;
}();

exports.PowIn = PowIn;

var PowOut =
/*#__PURE__*/
function () {
  function PowOut(pow) {
    _classCallCheck(this, PowOut);

    this.pow = pow;
  }

  _createClass(PowOut, [{
    key: "calclate",
    value: function calclate(percent) {
      return 1 - Math.pow(1 - percent, this.pow);
    }
  }]);

  return PowOut;
}();

exports.PowOut = PowOut;

var PowInOut =
/*#__PURE__*/
function () {
  function PowInOut(pow) {
    _classCallCheck(this, PowInOut);

    this.pow = pow;
  }

  _createClass(PowInOut, [{
    key: "calclate",
    value: function calclate(percent) {
      percent *= 2;

      if (percent < 1) {
        return 0.5 * Math.pow(percent, this.pow);
      } else {
        return 1 - 0.5 * Math.abs(Math.pow(2 - percent, this.pow));
      }
    }
  }]);

  return PowInOut;
}();

exports.PowInOut = PowInOut;

var SineIn =
/*#__PURE__*/
function () {
  function SineIn() {
    _classCallCheck(this, SineIn);
  }

  _createClass(SineIn, [{
    key: "calclate",
    value: function calclate(percent) {
      return 1 - Math.cos(percent * Math.PI / 2);
    }
  }]);

  return SineIn;
}();

exports.SineIn = SineIn;

var SineOut =
/*#__PURE__*/
function () {
  function SineOut() {
    _classCallCheck(this, SineOut);
  }

  _createClass(SineOut, [{
    key: "calclate",
    value: function calclate(percent) {
      return Math.sin(percent * Math.PI / 2);
    }
  }]);

  return SineOut;
}();

exports.SineOut = SineOut;

var SineInOut =
/*#__PURE__*/
function () {
  function SineInOut() {
    _classCallCheck(this, SineInOut);
  }

  _createClass(SineInOut, [{
    key: "calclate",
    value: function calclate(percent) {
      return -0.5 * (Math.cos(Math.PI * percent) - 1);
    }
  }]);

  return SineInOut;
}();

exports.SineInOut = SineInOut;

var BackIn =
/*#__PURE__*/
function () {
  function BackIn(amount) {
    _classCallCheck(this, BackIn);

    this.amount = amount;
  }

  _createClass(BackIn, [{
    key: "calclate",
    value: function calclate(percent) {
      return percent * percent * ((this.amount + 1) * percent - this.amount);
    }
  }]);

  return BackIn;
}();

exports.BackIn = BackIn;

var BackOut =
/*#__PURE__*/
function () {
  function BackOut(amount) {
    _classCallCheck(this, BackOut);

    this.amount = amount;
  }

  _createClass(BackOut, [{
    key: "calclate",
    value: function calclate(percent) {
      return --percent * percent * ((this.amount + 1) * percent + this.amount) + 1;
    }
  }]);

  return BackOut;
}();

exports.BackOut = BackOut;

var BackInOut =
/*#__PURE__*/
function () {
  function BackInOut(amount) {
    _classCallCheck(this, BackInOut);

    this.amount = amount;
  }

  _createClass(BackInOut, [{
    key: "calclate",
    value: function calclate(percent) {
      percent *= 2;

      if (percent < 1) {
        return 0.5 * (percent * percent * ((this.amount + 1) * percent - this.amount));
      } else {
        return 0.5 * ((percent -= 2) * percent * ((this.amount + 1) * percent + this.amount) + 2);
      }
    }
  }]);

  return BackInOut;
}();

exports.BackInOut = BackInOut;

var CircIn =
/*#__PURE__*/
function () {
  function CircIn() {
    _classCallCheck(this, CircIn);
  }

  _createClass(CircIn, [{
    key: "calclate",
    value: function calclate(percent) {
      return -(Math.sqrt(1 - percent * percent) - 1);
    }
  }]);

  return CircIn;
}();

exports.CircIn = CircIn;

var CircOut =
/*#__PURE__*/
function () {
  function CircOut() {
    _classCallCheck(this, CircOut);
  }

  _createClass(CircOut, [{
    key: "calclate",
    value: function calclate(percent) {
      return Math.sqrt(1 - --percent * percent);
    }
  }]);

  return CircOut;
}();

exports.CircOut = CircOut;

var CircInOut =
/*#__PURE__*/
function () {
  function CircInOut() {
    _classCallCheck(this, CircInOut);
  }

  _createClass(CircInOut, [{
    key: "calclate",
    value: function calclate(percent) {
      percent *= 2;

      if (percent < 1) {
        return -0.5 * (Math.sqrt(1 - percent * percent) - 1);
      } else {
        return 0.5 * (Math.sqrt(1 - (percent -= 2) * percent) + 1);
      }
    }
  }]);

  return CircInOut;
}();

exports.CircInOut = CircInOut;

var Bounce =
/*#__PURE__*/
function () {
  function Bounce() {
    _classCallCheck(this, Bounce);
  }

  _createClass(Bounce, [{
    key: "calclateOut",
    value: function calclateOut(percent) {
      if (percent < 1 / 2.75) {
        return 7.5625 * percent * percent;
      } else if (percent < 2 / 2.75) {
        return 7.5625 * (percent -= 1.5 / 2.75) * percent + 0.75;
      } else if (percent < 2.5 / 2.75) {
        return 7.5625 * (percent -= 2.25 / 2.75) * percent + 0.9375;
      } else {
        return 7.5625 * (percent -= 2.625 / 2.75) * percent + 0.984375;
      }
    }
  }]);

  return Bounce;
}();

var BounceOut =
/*#__PURE__*/
function (_Bounce) {
  _inherits(BounceOut, _Bounce);

  function BounceOut() {
    _classCallCheck(this, BounceOut);

    return _possibleConstructorReturn(this, _getPrototypeOf(BounceOut).apply(this, arguments));
  }

  _createClass(BounceOut, [{
    key: "calclate",
    value: function calclate(percent) {
      return _get(_getPrototypeOf(BounceOut.prototype), "calclateOut", this).call(this, percent);
    }
  }]);

  return BounceOut;
}(Bounce);

exports.BounceOut = BounceOut;

var BounceIn =
/*#__PURE__*/
function (_Bounce2) {
  _inherits(BounceIn, _Bounce2);

  function BounceIn() {
    _classCallCheck(this, BounceIn);

    return _possibleConstructorReturn(this, _getPrototypeOf(BounceIn).apply(this, arguments));
  }

  _createClass(BounceIn, [{
    key: "calclate",
    value: function calclate(percent) {
      return 1 - _get(_getPrototypeOf(BounceIn.prototype), "calclateOut", this).call(this, 1 - percent);
    }
  }]);

  return BounceIn;
}(Bounce);

exports.BounceIn = BounceIn;

var BounceInOut =
/*#__PURE__*/
function (_BounceIn) {
  _inherits(BounceInOut, _BounceIn);

  function BounceInOut() {
    _classCallCheck(this, BounceInOut);

    return _possibleConstructorReturn(this, _getPrototypeOf(BounceInOut).apply(this, arguments));
  }

  _createClass(BounceInOut, [{
    key: "calclate",
    value: function calclate(percent) {
      if (percent < 0.5) {
        return _get(_getPrototypeOf(BounceInOut.prototype), "calclate", this).call(this, percent * 2) * 0.5;
      } else {
        return _get(_getPrototypeOf(BounceInOut.prototype), "calclateOut", this).call(this, percent * 2 - 1) * 0.5 + 0.5;
      }
    }
  }]);

  return BounceInOut;
}(BounceIn);

exports.BounceInOut = BounceInOut;
var PI2 = Math.PI * 2;

var ElasticIn =
/*#__PURE__*/
function () {
  function ElasticIn(amplitude, period) {
    _classCallCheck(this, ElasticIn);

    this.amplitude = amplitude;
    this.period = period;
    this.s = void 0;
    this.s = this.period / PI2 * Math.asin(1 / this.amplitude);
  }

  _createClass(ElasticIn, [{
    key: "calclate",
    value: function calclate(percent) {
      if (percent === 0 || percent === 1) {
        return percent;
      }

      return -(this.amplitude * Math.pow(2, 10 * (percent -= 1)) * Math.sin((percent - this.s) * PI2 / this.period));
    }
  }]);

  return ElasticIn;
}();

exports.ElasticIn = ElasticIn;

var ElasticOut =
/*#__PURE__*/
function () {
  function ElasticOut(amplitude, period) {
    _classCallCheck(this, ElasticOut);

    this.amplitude = amplitude;
    this.period = period;
    this.s = void 0;
    this.s = this.period / PI2 * Math.asin(1 / this.amplitude);
  }

  _createClass(ElasticOut, [{
    key: "calclate",
    value: function calclate(percent) {
      if (percent === 0 || percent === 1) {
        return percent;
      }

      return this.amplitude * Math.pow(2, -10 * percent) * Math.sin((percent - this.s) * PI2 / this.period) + 1;
    }
  }]);

  return ElasticOut;
}();

exports.ElasticOut = ElasticOut;

var ElasticInOut =
/*#__PURE__*/
function () {
  function ElasticInOut(amplitude, period) {
    _classCallCheck(this, ElasticInOut);

    this.amplitude = amplitude;
    this.period = period;
    this.s = void 0;
    this.s = this.period / PI2 * Math.asin(1 / this.amplitude);
  }

  _createClass(ElasticInOut, [{
    key: "calclate",
    value: function calclate(percent) {
      percent *= 2;

      if (percent < 1) {
        return -0.5 * (this.amplitude * Math.pow(2, 10 * (percent -= 1)) * Math.sin((percent - this.s) * PI2 / this.period));
      } else {
        return this.amplitude * Math.pow(2, -10 * (percent -= 1)) * Math.sin((percent - this.s) * PI2 / this.period) * 0.5 + 1;
      }
    }
  }]);

  return ElasticInOut;
}();
/**
 * The AlgorithmFactory provides a collection of easing algorithms for animation.
 *
 * Here is an example:
 *
 * ```typescript
 * // use the registerd algorithm name.
 * AnimationFactory.create(component, true).to({rotation:360}, 1000), "quadInOut");
 * // use the algorithm instance.
 * AnimationFactory.create(component, true).to({rotation:360}, 1000), new BackOut(2));
 * ```
 *
 * Developer can also register customized algorithm, code example:
 * ```
 * class MyAlgo implements IAlgorithm {
 *   public calclate(percent: number): number {
 *     return percent; // change it with your own algorithm.
 *   }
 * }
 * AlgorithmFactory.register('myalgo', new MyAlgo());
 *
 * AnimationFactory.create(component, true).to({rotation:360}, 1000), "quadInOut");
 */


exports.ElasticInOut = ElasticInOut;

var AlgorithmFactory =
/*#__PURE__*/
function () {
  function AlgorithmFactory() {
    _classCallCheck(this, AlgorithmFactory);
  }

  _createClass(AlgorithmFactory, null, [{
    key: "register",

    /**
     * Registers algorithm with a specified name.
     * @param name name of algorithm
     * @param algorithm the implementation instance of the algorithm
     */
    value: function register(name, algorithm) {
      this.algorithms.set(name, algorithm);
    }
    /**
     * Gets algorithm instance by a specified name.
     * @param name the name of algorithm, registered by AlgorithmFactory.register
     * @returns instance of algorithm, undefined for non-existed name
     */

  }, {
    key: "get",
    value: function get(name) {
      return this.algorithms.get(name);
    }
    /**
     * Algorithm instances collection, keyed by name;
     */

  }]);

  return AlgorithmFactory;
}();

exports.AlgorithmFactory = AlgorithmFactory;
AlgorithmFactory.algorithms = new Map();
AlgorithmFactory.register('linear', new Linear());
AlgorithmFactory.register('quadIn', new PowIn(2));
AlgorithmFactory.register('quadOut', new PowOut(2));
AlgorithmFactory.register('quadInOut', new PowInOut(2));
AlgorithmFactory.register('cubicIn', new PowIn(3));
AlgorithmFactory.register('cubicOut', new PowOut(3));
AlgorithmFactory.register('cubicInOut', new PowInOut(3));
AlgorithmFactory.register('quartIn', new PowIn(4));
AlgorithmFactory.register('quartOut', new PowOut(4));
AlgorithmFactory.register('quartInOut', new PowInOut(4));
AlgorithmFactory.register('quintIn', new PowIn(5));
AlgorithmFactory.register('quintOut', new PowOut(5));
AlgorithmFactory.register('quintInOut', new PowInOut(5));
AlgorithmFactory.register('sineIn', new SineIn());
AlgorithmFactory.register('sineOut', new SineOut());
AlgorithmFactory.register('sineInOut', new SineInOut());
AlgorithmFactory.register('backIn', new BackIn(1.7));
AlgorithmFactory.register('backOut', new BackOut(1.7));
AlgorithmFactory.register('backInOut', new BackInOut(1.7));
AlgorithmFactory.register('circIn', new CircIn());
AlgorithmFactory.register('circOut', new CircOut());
AlgorithmFactory.register('circInOut', new CircInOut());
AlgorithmFactory.register('bounceIn', new BounceIn());
AlgorithmFactory.register('bounceOut', new BounceOut());
AlgorithmFactory.register('bounceInOut', new BounceInOut());
AlgorithmFactory.register('elasticIn', new ElasticIn(1, 0.3));
AlgorithmFactory.register('elasticOut', new ElasticOut(1, 0.3));
AlgorithmFactory.register('elasticInOut', new ElasticInOut(1, 0.3));