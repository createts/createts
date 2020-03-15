"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ticker = void 0;

var _Event = require("./base/Event");

var _Runtime = require("./Runtime");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Ticker = /*#__PURE__*/function (_EventDispatcher) {
  _inherits(Ticker, _EventDispatcher);

  function Ticker() {
    var _this;

    var fps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60;

    _classCallCheck(this, Ticker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Ticker).call(this));
    _this.duration = 1000 / 60;
    _this.lastTickTime = void 0;
    _this.stopped = true;

    if (fps <= 0) {
      console.warn('invalid fps:' + fps + ', reset to 60');
      fps = 60;
    }

    _this.setFps(fps);

    _this.lastTickTime = 0;

    _this.start();

    return _this;
  }

  _createClass(Ticker, [{
    key: "start",
    value: function start() {
      if (this.stopped) {
        this.stopped = false;

        _Runtime.Runtime.get().requestAnimationFrame(this.onAnimationFrame.bind(this));
      }
    }
  }, {
    key: "setFps",
    value: function setFps(fps) {
      this.duration = 1000 / fps;
    }
  }, {
    key: "stop",
    value: function stop() {
      this.stopped = true;
    }
  }, {
    key: "onAnimationFrame",
    value: function onAnimationFrame(time) {
      if (this.stopped) {
        return;
      }

      if (time - this.lastTickTime >= this.duration) {
        this.lastTickTime = time;
        this.dispatchEvent(new _Event.Event('tick'));
      }

      _Runtime.Runtime.get().requestAnimationFrame(this.onAnimationFrame.bind(this));
    }
  }]);

  return Ticker;
}(_Event.EventDispatcher);

exports.Ticker = Ticker;