function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { TouchItem } from './components/TouchItem';

var WebRuntime = /*#__PURE__*/function () {
  function WebRuntime() {
    _classCallCheck(this, WebRuntime);

    this.globalCanvas = void 0;
  }

  _createClass(WebRuntime, [{
    key: "newCanvas",
    value: function newCanvas() {
      return document.createElement('canvas');
    }
  }, {
    key: "releaseCanvas",
    value: function releaseCanvas(canvas) {
      return;
    }
  }, {
    key: "enableEvents",
    value: function enableEvents(stage) {
      var _this = this;

      stage.canvas.addEventListener('mousedown', function (e) {
        _this.handleMouseEvent('mousedown', stage, e);
      });
      stage.canvas.addEventListener('mousemove', function (e) {
        _this.handleMouseEvent('mousemove', stage, e);
      });
      stage.canvas.addEventListener('pressmove', function (e) {
        _this.handleMouseEvent('mousemove', stage, e);
      });
      stage.canvas.addEventListener('mouseup', function (e) {
        _this.handleMouseEvent('mouseup', stage, e);
      });
      stage.canvas.addEventListener('mouseenter', function (e) {
        _this.handleMouseEvent('mouseenter', stage, e);
      });
      stage.canvas.addEventListener('mouseleave', function (e) {
        _this.handleMouseEvent('mouseleave', stage, e);
      });
      stage.canvas.addEventListener('touchstart', function (e) {
        _this.handleTouchEvent('touchstart', stage, e);
      });
      stage.canvas.addEventListener('touchend', function (e) {
        _this.handleTouchEvent('touchend', stage, e);
      });
      stage.canvas.addEventListener('touchmove', function (e) {
        _this.handleTouchEvent('touchmove', stage, e);
      });
    }
  }, {
    key: "requestAnimationFrame",
    value: function requestAnimationFrame(listener) {
      window.requestAnimationFrame(listener);
    }
  }, {
    key: "measureTextWidth",
    value: function measureTextWidth(text, font) {
      if (text.length === 0) {
        return 0;
      }

      var canvas = this.getGlobalCanvas();
      var ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.save();
        ctx.font = font.toString();
        var width = ctx.measureText(text).width;
        ctx.restore();
        return width;
      } else {
        return 0;
      }
    }
  }, {
    key: "getGlobalCanvas",
    value: function getGlobalCanvas() {
      if (!this.globalCanvas) {
        this.globalCanvas = this.newCanvas();
      }

      return this.globalCanvas;
    }
  }, {
    key: "handleMouseEvent",
    value: function handleMouseEvent(type, stage, e) {
      var scaleX = stage.canvas.width / stage.canvas.clientWidth;
      var scaleY = stage.canvas.height / stage.canvas.clientHeight; // Translate to multiple touch event

      var x = e.offsetX * scaleX;
      var y = e.offsetY * scaleY;
      stage.handleMouseOrTouchEvent(type, [new TouchItem(0, undefined, x, y, 0, 0)], e);
    }
  }, {
    key: "handleTouchEvent",
    value: function handleTouchEvent(type, stage, e) {
      var scaleX = stage.canvas.width / stage.canvas.clientWidth;
      var scaleY = stage.canvas.height / stage.canvas.clientHeight;
      var touches = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = e.touches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var touch = _step.value;
          touches.push(new TouchItem(touch.identifier, undefined, touch.clientX * scaleX, touch.clientY * scaleY, 0, 0));
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

      stage.handleMouseOrTouchEvent(type, touches, e);
    }
  }]);

  return WebRuntime;
}();

export var Runtime = /*#__PURE__*/function () {
  function Runtime() {
    _classCallCheck(this, Runtime);
  }

  _createClass(Runtime, null, [{
    key: "get",
    value: function get() {
      return this.runtime;
    }
  }]);

  return Runtime;
}();
Runtime.runtime = new WebRuntime();