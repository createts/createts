"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebpageRuntime = void 0;

var _TouchItem = require("../components/TouchItem");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A IRuntime implementation for web page runs inside browser.
 */
var WebpageRuntime = /*#__PURE__*/function () {
  function WebpageRuntime() {
    _classCallCheck(this, WebpageRuntime);

    this.canvasCache = [];
  }

  _createClass(WebpageRuntime, [{
    key: "newCanvas",

    /**
     * Returns an offscreen canvas object from cache if cache is not empty or creates a new one.
     */
    value: function newCanvas() {
      if (this.canvasCache.length > 0) {
        return this.canvasCache.shift();
      } else {
        return document.createElement('canvas');
      }
    }
    /**
     * Release an offscreen canvas object, put it into cache.
     * @param canvas an offscreen canvas object to be released.
     */

  }, {
    key: "releaseCanvas",
    value: function releaseCanvas(canvas) {
      // TODO: check the cache to see if the canvas is already been released.
      this.canvasCache.push(canvas);
    }
    /**
     * Create an image object.
     */

  }, {
    key: "newImage",
    value: function newImage() {
      return new Image();
    }
    /**
     * Execute a load raw content task.
     * @param task The load raw content task to be executed.
     */

  }, {
    key: "loadArrayBuffer",
    value: function loadArrayBuffer(task) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'arraybuffer';
      xhr.open(task.method || 'GET', task.url, true);

      xhr.onload = function () {
        if (xhr.status === 200) {
          task.onLoad(xhr.response);
        }
      };

      xhr.onerror = function (event) {
        task.onError(event);
      };

      xhr.onprogress = function (event) {
        if (event.lengthComputable) {
          task.onProgress({
            loadedBytes: event.loaded,
            totalBytes: event.total
          });
        }
      };

      xhr.send();
    }
    /**
     * Execute a load image task.
     * TODO: check if it is not same domain, use Image.src to load to avoid cross domain problem.
     * @param task The load image task to be executed.
     */

  }, {
    key: "loadImage",
    value: function loadImage(task) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.open(task.method || 'GET', task.url, true);

      xhr.onload = function () {
        if (xhr.status === 200) {
          var url = URL.createObjectURL(xhr.response);
          var image = new Image();
          image.src = url;

          image.onload = function () {
            URL.revokeObjectURL(url);
            task.onLoad(image);
          };

          image.onerror = function (e) {
            URL.revokeObjectURL(url);
            task.onError(e);
          };
        }
      };

      xhr.onerror = function (event) {
        task.onError(event);
      };

      xhr.onprogress = function (event) {
        if (event.lengthComputable) {
          task.onProgress({
            loadedBytes: event.loaded,
            totalBytes: event.total
          });
        }
      };

      xhr.send();
    }
    /**
     * Add mouse and touch events for the Stage instance.
     * @param stage The target Stage instance to be added event handlers.
     */

  }, {
    key: "enableEvents",
    value: function enableEvents(stage) {
      var _this = this;

      stage.canvas.onpointerdown = function (e) {
        stage.canvas.setPointerCapture(e.pointerId);
      };

      stage.canvas.onpointerup = function (e) {
        stage.canvas.releasePointerCapture(e.pointerId);
      };

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
      stage.canvas.addEventListener('mousewheel', function (e) {
        _this.handleMouseWheelEvent(stage, e);
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
      stage.canvas.addEventListener('touchcancel', function (e) {
        _this.handleTouchEvent('touchcancel', stage, e);
      });
    }
    /**
     * Calls window.requestAnimationFrame to request a callback at next animation time.
     * @param listener The callback function.
     */

  }, {
    key: "requestAnimationFrame",
    value: function (_requestAnimationFrame) {
      function requestAnimationFrame(_x) {
        return _requestAnimationFrame.apply(this, arguments);
      }

      requestAnimationFrame.toString = function () {
        return _requestAnimationFrame.toString();
      };

      return requestAnimationFrame;
    }(function (listener) {
      requestAnimationFrame(listener);
    })
    /**
     * Handles mouse event, translate the coordinate to stage space and send to stage instance.
     * @param type Type of the mouse event.
     * @param stage The stage to receive this event.
     * @param e The native mouse event.
     */

  }, {
    key: "handleMouseEvent",
    value: function handleMouseEvent(type, stage, e) {
      var scaleX = stage.canvas.width / stage.canvas.clientWidth;
      var scaleY = stage.canvas.height / stage.canvas.clientHeight; // Translate to multiple touch event

      var x = e.offsetX * scaleX;
      var y = e.offsetY * scaleY;
      stage.handleMouseOrTouchEvent(type, [new _TouchItem.TouchItem(0, stage, x, y, Date.now())], e);
    }
    /**
     * Handles mouse wheel event, translate the coordinate to stage space and send to stage instance.
     * @param type Type of the mouse event.
     * @param stage The stage to receive this event.
     * @param e The native mouse event.
     */

  }, {
    key: "handleMouseWheelEvent",
    value: function handleMouseWheelEvent(stage, e) {
      var scaleX = stage.canvas.width / stage.canvas.clientWidth;
      var scaleY = stage.canvas.height / stage.canvas.clientHeight;
      stage.handleMouseWheelEvent(e.offsetX * scaleX, e.offsetY * scaleY, e.deltaX, e.deltaY, e);
    }
    /**
     * Handles touch event, translate the coordinates of multiple touches to stage space and send to
     * stage instance.
     * @param type Type of the touch event.
     * @param stage The stage to receive this event.
     * @param e The native touch event.
     */

  }, {
    key: "handleTouchEvent",
    value: function handleTouchEvent(type, stage, e) {
      var scaleX = stage.canvas.width / stage.canvas.clientWidth;
      var scaleY = stage.canvas.height / stage.canvas.clientHeight;
      var touches = [];
      var now = Date.now();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = e.touches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var touch = _step.value;
          touches.push(new _TouchItem.TouchItem(touch.identifier, stage, touch.clientX * scaleX, touch.clientY * scaleY, now));
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

  return WebpageRuntime;
}();

exports.WebpageRuntime = WebpageRuntime;