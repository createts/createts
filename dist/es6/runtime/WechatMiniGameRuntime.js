function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { TouchItem } from '../components/TouchItem';
import { URLUtils } from '../utils/URLUtils';

/**
 * A IRuntime implementation for wechat mini game.
 */
export var WechatMiniGameRuntime = /*#__PURE__*/function () {
  /**
   * The global game canvas.
   */

  /**
   * The object contains system info like screen size, etc.
   * See https://developers.weixin.qq.com/minigame/dev/api/base/system/system-info/wx.getSystemInfoSync.html
   */

  /**
   * A canvas object cache contains released canvas objects.
   */

  /**
   * Creates a WechatMiniGameRuntime object and gets system info.
   */
  function WechatMiniGameRuntime() {
    _classCallCheck(this, WechatMiniGameRuntime);

    this.gameCanvas = void 0;
    this.systemInfo = void 0;
    this.canvasCache = [];
    this.systemInfo = wx.getSystemInfoSync();
  }
  /**
   * Returns an offscreen canvas object from cache if cache is not empty or creates a new one.
   */


  _createClass(WechatMiniGameRuntime, [{
    key: "newCanvas",
    value: function newCanvas() {
      if (!this.gameCanvas) {
        this.gameCanvas = wx.createCanvas();
      }

      if (this.canvasCache.length > 0) {
        return this.canvasCache.shift();
      }

      return wx.createCanvas();
    }
    /**
     * Release an offscreen canvas object, put it into cache.
     * @param canvas an offscreen canvas object to be released.
     */

  }, {
    key: "releaseCanvas",
    value: function releaseCanvas(canvas) {
      this.canvasCache.push(canvas);
    }
    /**
     * Create an image object.
     */

  }, {
    key: "newImage",
    value: function newImage() {
      return wx.createImage();
    }
    /**
     * Execute a load raw content task.
     * 1. If the source of content is a relative path, uses wechat file system api to read the file.
     * 1. If the source is an absolute url, use wechat network api to file a http request to get the
     * content, please note that you must whitelist the domain for your wechat mini game app.
     * @param task The load raw content task to be executed.
     */

  }, {
    key: "loadArrayBuffer",
    value: function loadArrayBuffer(task) {
      if (URLUtils.isAbsolute(task.url)) {
        wx.request({
          url: task.url,
          method: task.method || 'GET',
          responseType: 'arraybuffer',
          success: function success(res) {
            task.onLoad(res.data);
          },
          fail: function fail(error) {
            task.onError(error);
          }
        });
      } else {
        wx.getFileSystemManager().readFile({
          filePath: task.url,
          success: function success(e) {
            task.onLoad(e.data);
          },
          fail: function fail(e) {
            task.onError(e);
          }
        });
      }
    }
    /**
     * Execute a load image task.
     * 1. If the source of image is a relative path, uses wechat file system api to read the file.
     * 1. If the source is an absolute url, use wechat network api to file a http request to get the
     * image, please note that you must whitelist the domain for your wechat mini game app.
     * @param task The load image task to be executed.
     */

  }, {
    key: "loadImage",
    value: function loadImage(task) {
      var _this = this;

      if (URLUtils.isAbsolute(task.url)) {
        var downloader = wx.downloadFile({
          url: task.url,
          success: function success(res) {
            if (res.statusCode === 200) {
              var img = _this.newImage();

              img.src = res.tempFilePath;

              img.onload = function () {
                task.onLoad(img);
              };

              img.onerror = function (e) {
                task.onError(e);
              };
            } else {
              task.onError({
                msg: 'download failed, code:' + res.statusCode
              });
            }
          },
          fail: function fail(e) {
            task.onError(e);
          }
        });

        downloader.onProgressUpdate = function (event) {
          task.onProgress({
            loadedBytes: event.totalBytesWritten,
            totalBytes: event.totalBytesExpectedToWrite
          });
        };
      } else {
        var img = this.newImage();
        img.src = task.url;

        img.onload = function () {
          task.onLoad(img);
        };

        img.onerror = function (e) {
          task.onError(e);
        };
      }
    }
    /**
     * Returns the game canvas, it is the first created canvas.
     */

  }, {
    key: "getGameCanvas",
    value: function getGameCanvas() {
      if (!this.gameCanvas) {
        this.gameCanvas = wx.createCanvas();
      }

      return this.gameCanvas;
    }
    /**
     * Add touch events for the Stage instance.
     * @param stage The target Stage instance to be added event handlers.
     */

  }, {
    key: "enableEvents",
    value: function enableEvents(stage) {
      var _this2 = this;

      wx.onTouchStart(function (e) {
        _this2.handleTouchEvent('touchstart', stage, e);
      });
      wx.onTouchMove(function (e) {
        _this2.handleTouchEvent('touchmove', stage, e);
      });
      wx.onTouchEnd(function (e) {
        _this2.handleTouchEvent('touchend', stage, e);
      });
      wx.onTouchCancel(function (e) {
        _this2.handleTouchEvent('touchcancel', stage, e);
      });
    }
    /**
     * Calls wechat global requestAnimationFrame api to request a callback at next animation time.
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
     * Handles touch event, translate the coordinates of multiple touches to stage space and send to
     * stage instance.
     * @param type Type of the touch event.
     * @param stage The stage to receive this event.
     * @param e The native touch event.
     */

  }, {
    key: "handleTouchEvent",
    value: function handleTouchEvent(type, stage, e) {
      var scaleX = stage.canvas.width / this.systemInfo.windowWidth;
      var scaleY = stage.canvas.height / this.systemInfo.windowHeight;
      var touches = [];
      var now = Date.now();

      var _iterator = _createForOfIteratorHelper(e.touches),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var touch = _step.value;
          touches.push(new TouchItem(touch.identifier, stage, touch.clientX * scaleX, touch.clientY * scaleY, now));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      stage.handleMouseOrTouchEvent(type, touches, e);
    }
  }]);

  return WechatMiniGameRuntime;
}();