"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ticker = exports.TickerEvent = void 0;

var _Event2 = require("./base/Event");

var _Runtime = require("./runtime/Runtime");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * Event for ticker.
 */
var TickerEvent = /*#__PURE__*/function (_Event) {
  _inherits(TickerEvent, _Event);

  var _super = _createSuper(TickerEvent);

  /**
   * The current timestamp of this event.
   */

  /**
   * The delay to previous ticker event.
   */

  /**
   * Create a TickerEvent object with type, current timestamp and delay.
   * @param type Type of this event, can be 'tick', 'start', or 'stop'.
   * @param now The current timestamp.
   * @param delay The delay from previous event.
   */
  function TickerEvent(type, now, delay) {
    var _this;

    _classCallCheck(this, TickerEvent);

    _this = _super.call(this, type);
    _this.now = void 0;
    _this.delay = void 0;
    _this.now = now;
    _this.delay = delay;
    return _this;
  }

  return TickerEvent;
}(_Event2.Event);
/**
 * A Ticker instance provides a tick or heartbeat broadcast at a set interval, listeners of this
 * Ticker instance can listen to the 'tick' event to be notified when a set time interval has
 * elapsed.
 *
 * Code example, create a ticker instance with fps=10
 * ```typescript
 * const ticker = new Ticker(10);  // fps = 10
 * ticker.on('tick', e => {
 *   console.log(e);
 * });
 * ```
 *
 * For most cases, you may not need to create a ticker instance but use the one from Stage
 * instance.
 */


exports.TickerEvent = TickerEvent;

var Ticker = /*#__PURE__*/function (_EventDispatcher) {
  _inherits(Ticker, _EventDispatcher);

  var _super2 = _createSuper(Ticker);

  /**
   * The duration between 2 tick events.
   */

  /**
   * The previous ticker happen time.
   */

  /**
   * Indicate this ticker instance is stopped or not.
   */

  /**
   * Create a Ticker object with specified fps.
   * @param fps Frames per second, indicates how many ticker events in 1 second, default value is 60.
   */
  function Ticker() {
    var _this2;

    var fps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60;

    _classCallCheck(this, Ticker);

    _this2 = _super2.call(this);
    _this2.duration = 1000 / 60;
    _this2.lastTickTime = void 0;
    _this2.stopped = true;

    if (fps <= 0) {
      console.warn('invalid fps:' + fps + ', reset to 60');
      fps = 60;
    }

    _this2.setFps(fps);

    _this2.lastTickTime = 0;

    _this2.start();

    return _this2;
  }
  /**
   * Set the fps of this ticker object.
   * @param fps The new fps value.
   */


  _createClass(Ticker, [{
    key: "setFps",
    value: function setFps(fps) {
      this.duration = 1000 / fps;
    }
    /**
     * Start ticking if the current ticker is stopped, a 'start' event will be broadcasted to
     * listeners.
     */

  }, {
    key: "start",
    value: function start() {
      if (this.stopped) {
        this.stopped = false;

        _Runtime.Runtime.get().requestAnimationFrame(this.onAnimationFrame.bind(this));

        var now = Date.now();
        this.dispatchEvent(new TickerEvent('start', now, now - this.lastTickTime));
      }
    }
    /**
     * Stop ticking if the current ticker is started, a 'stop' event will be broadcasted to
     * listeners.
     */

  }, {
    key: "stop",
    value: function stop() {
      this.stopped = true;
      var now = Date.now();
      this.dispatchEvent(new TickerEvent('stop', now, now - this.lastTickTime));
    }
    /**
     * Callback of requestAnimationFrame function, check the duration of previous callback to
     * determine whether broadcast tick event.
     * @param time current timestamp.
     */

  }, {
    key: "onAnimationFrame",
    value: function onAnimationFrame(time) {
      if (this.stopped) {
        return;
      }

      if (time - this.lastTickTime >= this.duration) {
        this.dispatchEvent(new TickerEvent('tick', time, this.lastTickTime === 0 ? 0 : time - this.lastTickTime));
        this.lastTickTime = time;
      }

      _Runtime.Runtime.get().requestAnimationFrame(this.onAnimationFrame.bind(this));
    }
  }]);

  return Ticker;
}(_Event2.EventDispatcher);

exports.Ticker = Ticker;