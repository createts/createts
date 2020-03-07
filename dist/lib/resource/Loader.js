"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Loader = void 0;

var _Event2 = require("../base/Event");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LoaderEvent =
/*#__PURE__*/
function (_Event) {
  _inherits(LoaderEvent, _Event);

  function LoaderEvent(target, type, response) {
    var _this;

    _classCallCheck(this, LoaderEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LoaderEvent).call(this, type));
    _this.target = void 0;
    _this.response = void 0;
    _this.target = target;
    _this.response = response;
    return _this;
  }

  return LoaderEvent;
}(_Event2.Event);

var Loader =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(Loader, _EventDispatcher);

  function Loader(url) {
    var _this2;

    var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';
    var responseType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    _classCallCheck(this, Loader);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Loader).call(this));
    _this2.url = void 0;
    _this2.method = void 0;
    _this2.responseType = void 0;
    _this2.xhr = void 0;
    _this2.totalBytes = void 0;
    _this2.loadedBytes = void 0;
    _this2.url = url;
    _this2.method = method;
    _this2.responseType = responseType;
    _this2.totalBytes = 0;
    _this2.loadedBytes = 0;

    _this2.download();

    return _this2;
  }

  _createClass(Loader, [{
    key: "download",
    value: function download() {
      var _this3 = this;

      if (this.xhr) {
        return;
      }

      this.xhr = new XMLHttpRequest();
      this.xhr.responseType = this.responseType;
      this.xhr.open(this.method, this.url, true);

      this.xhr.onload = function () {
        if (_this3.xhr.status === 200) {
          _this3.dispatchEvent(new LoaderEvent(_this3, 'load', _this3.xhr.response));
        }
      };

      this.xhr.onerror = function (event) {
        _this3.dispatchEvent(new LoaderEvent(_this3, 'error'));
      };

      this.xhr.onprogress = function (event) {
        if (event.lengthComputable) {
          _this3.loadedBytes = event.loaded;
          _this3.totalBytes = event.total;

          _this3.dispatchEvent(new LoaderEvent(_this3, 'progress'));
        }
      };

      this.xhr.send();
    }
  }]);

  return Loader;
}(_Event2.EventDispatcher);

exports.Loader = Loader;