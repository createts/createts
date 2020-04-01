function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MethodCall = function MethodCall(method, args) {
  _classCallCheck(this, MethodCall);

  this.method = void 0;
  this.args = void 0;
  this.timestamp = void 0;
  this.method = method;
  this.args = args;
  this.timestamp = Date.now();
};

var Expectation = function Expectation(method, args, returnValue) {
  _classCallCheck(this, Expectation);

  this.method = void 0;
  this.args = void 0;
  this.returnValue = void 0;
  this.method = method;
  this.args = args;
  this.returnValue = returnValue;
};

export function any() {
  return function () {
    return true;
  };
}
export function eq(value) {
  return function (input) {
    if (input.equals) {
      return input.equals(value);
    }

    return input === value;
  };
}

var Mocked = /*#__PURE__*/function () {
  function Mocked() {
    _classCallCheck(this, Mocked);

    this.calls = [];
    this.expectations = [];
  }

  _createClass(Mocked, [{
    key: "onCall",
    value: function onCall(method, args) {
      this.calls.push(new MethodCall(method, args));
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.expectations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var expectation = _step.value;

          if (expectation.method === method && expectation.args.length === args.length) {
            var matched = true;

            for (var i = 0; i < args.length; ++i) {
              if (!expectation.args[i](args[i])) {
                matched = false;
                break;
              }
            }

            if (matched) {
              return expectation.returnValue;
            }
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
    }
  }, {
    key: "times",
    value: function times(method) {
      var times = 0;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.calls[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var call = _step2.value;

          if (call.method === method && call.args.length === args.length) {
            var matched = true;

            for (var i = 0; i < args.length; ++i) {
              if (!args[i](call.args[i])) {
                matched = false;
                break;
              }
            }

            if (matched) {
              ++times;
            }
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

      return times;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.calls.length = 0;
      this.expectations.length = 0;
    }
  }, {
    key: "resetTimes",
    value: function resetTimes() {
      this.calls.length = 0;
    }
  }, {
    key: "on",
    value: function on(method) {
      var _this = this;

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return {
        returns: function returns(value) {
          _this.expectations.push(new Expectation(method, args, value));
        }
      };
    }
  }]);

  return Mocked;
}();
/**
 * A mock class of HTMLCanvas for test purpose. This class does not
 */


export var MockCanvasRenderingContext2D = /*#__PURE__*/function (_Mocked) {
  _inherits(MockCanvasRenderingContext2D, _Mocked);

  function MockCanvasRenderingContext2D() {
    var _getPrototypeOf2;

    var _this2;

    _classCallCheck(this, MockCanvasRenderingContext2D);

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MockCanvasRenderingContext2D)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this2.canvas = void 0;
    _this2.globalAlpha = void 0;
    _this2.globalCompositeOperation = void 0;
    _this2.fillStyle = void 0;
    _this2.strokeStyle = void 0;
    _this2.filter = void 0;
    _this2.imageSmoothingEnabled = void 0;
    _this2.imageSmoothingQuality = void 0;
    _this2.lineCap = void 0;
    _this2.lineDashOffset = void 0;
    _this2.lineJoin = void 0;
    _this2.lineWidth = void 0;
    _this2.miterLimit = void 0;
    _this2.shadowBlur = void 0;
    _this2.shadowColor = void 0;
    _this2.shadowOffsetX = void 0;
    _this2.shadowOffsetY = void 0;
    _this2.direction = void 0;
    _this2.font = void 0;
    _this2.textAlign = void 0;
    _this2.textBaseline = void 0;
    return _this2;
  }

  _createClass(MockCanvasRenderingContext2D, [{
    key: "drawImage",
    value: function drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) {
      return this.onCall('drawImage', arguments);
    }
  }, {
    key: "beginPath",
    value: function beginPath() {
      return this.onCall('beginPath', arguments);
    }
  }, {
    key: "clip",
    value: function clip(path, fillRule) {
      return this.onCall('clip', arguments);
    }
  }, {
    key: "fill",
    value: function fill(path, fillRule) {
      return this.onCall('fill', arguments);
    }
  }, {
    key: "isPointInPath",
    value: function isPointInPath(path, x, y, fillRule) {
      return this.onCall('isPointInPath', arguments);
    }
  }, {
    key: "isPointInStroke",
    value: function isPointInStroke(path, x, y) {
      return this.onCall('isPointInStroke', arguments);
    }
  }, {
    key: "stroke",
    value: function stroke(path) {
      return this.onCall('stroke', arguments);
    }
  }, {
    key: "createLinearGradient",
    value: function createLinearGradient(x0, y0, x1, y1) {
      return this.onCall('createLinearGradient', arguments);
    }
  }, {
    key: "createPattern",
    value: function createPattern(image, repetition) {
      return this.onCall('createPattern', arguments);
    }
  }, {
    key: "createRadialGradient",
    value: function createRadialGradient(x0, y0, r0, x1, y1, r1) {
      return this.onCall('createRadialGradient', arguments);
    }
  }, {
    key: "createImageData",
    value: function createImageData(sw, sh) {
      return this.onCall('createImageData', arguments);
    }
  }, {
    key: "getImageData",
    value: function getImageData(sx, sy, sw, sh) {
      return this.onCall('getImageData', arguments);
    }
  }, {
    key: "putImageData",
    value: function putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
      return this.onCall('putImageData', arguments);
    }
  }, {
    key: "arc",
    value: function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
      return this.onCall('arc', arguments);
    }
  }, {
    key: "arcTo",
    value: function arcTo(x1, y1, x2, y2, radius) {
      return this.onCall('arcTo', arguments);
    }
  }, {
    key: "bezierCurveTo",
    value: function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
      return this.onCall('bezierCurveTo', arguments);
    }
  }, {
    key: "closePath",
    value: function closePath() {
      return this.onCall('closePath', arguments);
    }
  }, {
    key: "ellipse",
    value: function ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
      return this.onCall('ellipse', arguments);
    }
  }, {
    key: "lineTo",
    value: function lineTo(x, y) {
      return this.onCall('lineTo', arguments);
    }
  }, {
    key: "moveTo",
    value: function moveTo(x, y) {
      return this.onCall('moveTo', arguments);
    }
  }, {
    key: "quadraticCurveTo",
    value: function quadraticCurveTo(cpx, cpy, x, y) {
      return this.onCall('quadraticCurveTo', arguments);
    }
  }, {
    key: "rect",
    value: function rect(x, y, w, h) {
      return this.onCall('rect', arguments);
    }
  }, {
    key: "getLineDash",
    value: function getLineDash() {
      return this.onCall('getLineDash', arguments);
    }
  }, {
    key: "setLineDash",
    value: function setLineDash(segments) {
      return this.onCall('setLineDash', arguments);
    }
  }, {
    key: "clearRect",
    value: function clearRect(x, y, w, h) {
      return this.onCall('clearRect', arguments);
    }
  }, {
    key: "fillRect",
    value: function fillRect(x, y, w, h) {
      return this.onCall('fillRect', arguments);
    }
  }, {
    key: "strokeRect",
    value: function strokeRect(x, y, w, h) {
      return this.onCall('strokeRect', arguments);
    }
  }, {
    key: "restore",
    value: function restore() {
      return this.onCall('restore', arguments);
    }
  }, {
    key: "save",
    value: function save() {
      return this.onCall('save', arguments);
    }
  }, {
    key: "fillText",
    value: function fillText(text, x, y, maxWidth) {
      return this.onCall('fillText', arguments);
    }
  }, {
    key: "measureText",
    value: function measureText(text) {
      return this.onCall('measureText', arguments);
    }
  }, {
    key: "strokeText",
    value: function strokeText(text, x, y, maxWidth) {
      return this.onCall('strokeText', arguments);
    }
  }, {
    key: "getTransform",
    value: function getTransform() {
      return this.onCall('getTransform', arguments);
    }
  }, {
    key: "resetTransform",
    value: function resetTransform() {
      return this.onCall('resetTransform', arguments);
    }
  }, {
    key: "rotate",
    value: function rotate(angle) {
      return this.onCall('rotate', arguments);
    }
  }, {
    key: "scale",
    value: function scale(x, y) {
      return this.onCall('scale', arguments);
    }
  }, {
    key: "setTransform",
    value: function setTransform(a, b, c, d, e, f) {
      return this.onCall('setTransform', arguments);
    }
  }, {
    key: "transform",
    value: function transform(a, b, c, d, e, f) {
      return this.onCall('transform', arguments);
    }
  }, {
    key: "translate",
    value: function translate(x, y) {
      return this.onCall('translate', arguments);
    }
  }, {
    key: "drawFocusIfNeeded",
    value: function drawFocusIfNeeded(path, element) {
      return this.onCall('drawFocusIfNeeded', arguments);
    }
  }, {
    key: "scrollPathIntoView",
    value: function scrollPathIntoView(path) {
      return this.onCall('scrollPathIntoView', arguments);
    }
  }]);

  return MockCanvasRenderingContext2D;
}(Mocked);
/**
 * A mock class of HTMLCanvas for test purpose.
 */

export var MockCanvas = /*#__PURE__*/function (_Mocked2) {
  _inherits(MockCanvas, _Mocked2);

  function MockCanvas() {
    var _getPrototypeOf3;

    var _this3;

    _classCallCheck(this, MockCanvas);

    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    _this3 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(MockCanvas)).call.apply(_getPrototypeOf3, [this].concat(args)));
    _this3.width = void 0;
    _this3.height = void 0;
    return _this3;
  }

  _createClass(MockCanvas, [{
    key: "getContext",
    value: function getContext(type) {
      return this.onCall('getContext', arguments);
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(type, callback) {
      return this.onCall('addEventListener', arguments);
    }
  }, {
    key: "asCanvas",
    value: function asCanvas() {
      return this;
    }
  }]);

  return MockCanvas;
}(Mocked);