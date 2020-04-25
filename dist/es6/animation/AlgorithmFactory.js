function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

export var Linear = /*#__PURE__*/function () {
  function Linear() {
    _classCallCheck(this, Linear);
  }

  _createClass(Linear, [{
    key: "calculate",
    value: function calculate(percent) {
      return percent;
    }
  }]);

  return Linear;
}();
export var PowIn = /*#__PURE__*/function () {
  function PowIn(pow) {
    _classCallCheck(this, PowIn);

    this.pow = pow;
  }

  _createClass(PowIn, [{
    key: "calculate",
    value: function calculate(percent) {
      return Math.pow(percent, this.pow);
    }
  }]);

  return PowIn;
}();
export var PowOut = /*#__PURE__*/function () {
  function PowOut(pow) {
    _classCallCheck(this, PowOut);

    this.pow = pow;
  }

  _createClass(PowOut, [{
    key: "calculate",
    value: function calculate(percent) {
      return 1 - Math.pow(1 - percent, this.pow);
    }
  }]);

  return PowOut;
}();
export var PowInOut = /*#__PURE__*/function () {
  function PowInOut(pow) {
    _classCallCheck(this, PowInOut);

    this.pow = pow;
  }

  _createClass(PowInOut, [{
    key: "calculate",
    value: function calculate(percent) {
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
export var SineIn = /*#__PURE__*/function () {
  function SineIn() {
    _classCallCheck(this, SineIn);
  }

  _createClass(SineIn, [{
    key: "calculate",
    value: function calculate(percent) {
      return 1 - Math.cos(percent * Math.PI / 2);
    }
  }]);

  return SineIn;
}();
export var SineOut = /*#__PURE__*/function () {
  function SineOut() {
    _classCallCheck(this, SineOut);
  }

  _createClass(SineOut, [{
    key: "calculate",
    value: function calculate(percent) {
      return Math.sin(percent * Math.PI / 2);
    }
  }]);

  return SineOut;
}();
export var SineInOut = /*#__PURE__*/function () {
  function SineInOut() {
    _classCallCheck(this, SineInOut);
  }

  _createClass(SineInOut, [{
    key: "calculate",
    value: function calculate(percent) {
      return -0.5 * (Math.cos(Math.PI * percent) - 1);
    }
  }]);

  return SineInOut;
}();
export var BackIn = /*#__PURE__*/function () {
  function BackIn(amount) {
    _classCallCheck(this, BackIn);

    this.amount = amount;
  }

  _createClass(BackIn, [{
    key: "calculate",
    value: function calculate(percent) {
      return percent * percent * ((this.amount + 1) * percent - this.amount);
    }
  }]);

  return BackIn;
}();
export var BackOut = /*#__PURE__*/function () {
  function BackOut(amount) {
    _classCallCheck(this, BackOut);

    this.amount = amount;
  }

  _createClass(BackOut, [{
    key: "calculate",
    value: function calculate(percent) {
      return --percent * percent * ((this.amount + 1) * percent + this.amount) + 1;
    }
  }]);

  return BackOut;
}();
export var BackInOut = /*#__PURE__*/function () {
  function BackInOut(amount) {
    _classCallCheck(this, BackInOut);

    this.amount = amount;
  }

  _createClass(BackInOut, [{
    key: "calculate",
    value: function calculate(percent) {
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
export var CircIn = /*#__PURE__*/function () {
  function CircIn() {
    _classCallCheck(this, CircIn);
  }

  _createClass(CircIn, [{
    key: "calculate",
    value: function calculate(percent) {
      return -(Math.sqrt(1 - percent * percent) - 1);
    }
  }]);

  return CircIn;
}();
export var CircOut = /*#__PURE__*/function () {
  function CircOut() {
    _classCallCheck(this, CircOut);
  }

  _createClass(CircOut, [{
    key: "calculate",
    value: function calculate(percent) {
      return Math.sqrt(1 - --percent * percent);
    }
  }]);

  return CircOut;
}();
export var CircInOut = /*#__PURE__*/function () {
  function CircInOut() {
    _classCallCheck(this, CircInOut);
  }

  _createClass(CircInOut, [{
    key: "calculate",
    value: function calculate(percent) {
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

var Bounce = /*#__PURE__*/function () {
  function Bounce() {
    _classCallCheck(this, Bounce);
  }

  _createClass(Bounce, [{
    key: "calculateOut",
    value: function calculateOut(percent) {
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

export var BounceOut = /*#__PURE__*/function (_Bounce) {
  _inherits(BounceOut, _Bounce);

  var _super = _createSuper(BounceOut);

  function BounceOut() {
    _classCallCheck(this, BounceOut);

    return _super.apply(this, arguments);
  }

  _createClass(BounceOut, [{
    key: "calculate",
    value: function calculate(percent) {
      return _get(_getPrototypeOf(BounceOut.prototype), "calculateOut", this).call(this, percent);
    }
  }]);

  return BounceOut;
}(Bounce);
export var BounceIn = /*#__PURE__*/function (_Bounce2) {
  _inherits(BounceIn, _Bounce2);

  var _super2 = _createSuper(BounceIn);

  function BounceIn() {
    _classCallCheck(this, BounceIn);

    return _super2.apply(this, arguments);
  }

  _createClass(BounceIn, [{
    key: "calculate",
    value: function calculate(percent) {
      return 1 - _get(_getPrototypeOf(BounceIn.prototype), "calculateOut", this).call(this, 1 - percent);
    }
  }]);

  return BounceIn;
}(Bounce);
export var BounceInOut = /*#__PURE__*/function (_BounceIn) {
  _inherits(BounceInOut, _BounceIn);

  var _super3 = _createSuper(BounceInOut);

  function BounceInOut() {
    _classCallCheck(this, BounceInOut);

    return _super3.apply(this, arguments);
  }

  _createClass(BounceInOut, [{
    key: "calculate",
    value: function calculate(percent) {
      if (percent < 0.5) {
        return _get(_getPrototypeOf(BounceInOut.prototype), "calculate", this).call(this, percent * 2) * 0.5;
      } else {
        return _get(_getPrototypeOf(BounceInOut.prototype), "calculateOut", this).call(this, percent * 2 - 1) * 0.5 + 0.5;
      }
    }
  }]);

  return BounceInOut;
}(BounceIn);
var PI2 = Math.PI * 2;
export var ElasticIn = /*#__PURE__*/function () {
  function ElasticIn(amplitude, period) {
    _classCallCheck(this, ElasticIn);

    this.amplitude = amplitude;
    this.period = period;
    this.s = void 0;
    this.s = this.period / PI2 * Math.asin(1 / this.amplitude);
  }

  _createClass(ElasticIn, [{
    key: "calculate",
    value: function calculate(percent) {
      if (percent === 0 || percent === 1) {
        return percent;
      }

      return -(this.amplitude * Math.pow(2, 10 * (percent -= 1)) * Math.sin((percent - this.s) * PI2 / this.period));
    }
  }]);

  return ElasticIn;
}();
export var ElasticOut = /*#__PURE__*/function () {
  function ElasticOut(amplitude, period) {
    _classCallCheck(this, ElasticOut);

    this.amplitude = amplitude;
    this.period = period;
    this.s = void 0;
    this.s = this.period / PI2 * Math.asin(1 / this.amplitude);
  }

  _createClass(ElasticOut, [{
    key: "calculate",
    value: function calculate(percent) {
      if (percent === 0 || percent === 1) {
        return percent;
      }

      return this.amplitude * Math.pow(2, -10 * percent) * Math.sin((percent - this.s) * PI2 / this.period) + 1;
    }
  }]);

  return ElasticOut;
}();
export var ElasticInOut = /*#__PURE__*/function () {
  function ElasticInOut(amplitude, period) {
    _classCallCheck(this, ElasticInOut);

    this.amplitude = amplitude;
    this.period = period;
    this.s = void 0;
    this.s = this.period / PI2 * Math.asin(1 / this.amplitude);
  }

  _createClass(ElasticInOut, [{
    key: "calculate",
    value: function calculate(percent) {
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
 * // use the registered algorithm name.
 * AnimationFactory.create(component, true).to({rotation:360}, 1000), "quadInOut");
 * // use the algorithm instance.
 * AnimationFactory.create(component, true).to({rotation:360}, 1000), new BackOut(2));
 * ```
 *
 * Developer can also register customized algorithm, code example:
 * ```
 * class MyAlgo implements IAlgorithm {
 *   public calculate(percent: number): number {
 *     return percent; // change it with your own algorithm.
 *   }
 * }
 * AlgorithmFactory.register('myalgo', new MyAlgo());
 *
 * AnimationFactory.create(component, true).to({rotation:360}, 1000), "quadInOut");
 */

export var AlgorithmFactory = /*#__PURE__*/function () {
  /**
   * Prevent creating instance.
   */
  function AlgorithmFactory() {
    _classCallCheck(this, AlgorithmFactory);
  }
  /**
   * Registers algorithm with a specified name.
   * @param name name of algorithm
   * @param algorithm the implementation instance of the algorithm
   */


  _createClass(AlgorithmFactory, null, [{
    key: "register",
    value: function register(name, algorithm) {
      this.algorithms.set(name, algorithm);
    }
    /**
     * Registers algorithm with a specified name.
     * @param data A name to IAlgorithm instance map to be registered.
     */

  }, {
    key: "registerAll",
    value: function registerAll(data) {
      for (var name in data) {
        this.algorithms.set(name, data[name]);
      }
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
AlgorithmFactory.algorithms = new Map();
AlgorithmFactory.registerAll({
  linear: new Linear(),
  quadIn: new PowIn(2),
  quadOut: new PowOut(2),
  quadInOut: new PowInOut(2),
  cubicIn: new PowIn(3),
  cubicOut: new PowOut(3),
  cubicInOut: new PowInOut(3),
  quartIn: new PowIn(4),
  quartOut: new PowOut(4),
  quartInOut: new PowInOut(4),
  quintIn: new PowIn(5),
  quintOut: new PowOut(5),
  quintInOut: new PowInOut(5),
  sineIn: new SineIn(),
  sineOut: new SineOut(),
  sineInOut: new SineInOut(),
  backIn: new BackIn(1.7),
  backOut: new BackOut(1.7),
  backInOut: new BackInOut(1.7),
  circIn: new CircIn(),
  circOut: new CircOut(),
  circInOut: new CircInOut(),
  bounceIn: new BounceIn(),
  bounceOut: new BounceOut(),
  bounceInOut: new BounceInOut(),
  elasticIn: new ElasticIn(1, 0.3),
  elasticOut: new ElasticOut(1, 0.3),
  elasticInOut: new ElasticInOut(1, 0.3)
});