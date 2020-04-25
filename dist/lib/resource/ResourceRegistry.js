"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceRegistry = exports.ResourceRegistryEvent = exports.ResourceType = void 0;

var _Event2 = require("../base/Event");

var _ApngParser = require("../parser/ApngParser");

var _Runtime = require("../runtime/Runtime");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
 * Resource load state.
 */
var LoadState;
/**
 * Resource types.
 */

(function (LoadState) {
  LoadState[LoadState["LOADING"] = 1] = "LOADING";
  LoadState[LoadState["LOADED"] = 2] = "LOADED";
  LoadState[LoadState["ERROR"] = 3] = "ERROR";
})(LoadState || (LoadState = {}));

var ResourceType;
exports.ResourceType = ResourceType;

(function (ResourceType) {
  ResourceType["IMAGE"] = "image";
  ResourceType["APNG"] = "apng";
})(ResourceType || (exports.ResourceType = ResourceType = {}));

/**
 * This event is triggered when resource was added, loaded, or loading progress was changed.
 */
var ResourceRegistryEvent = /*#__PURE__*/function (_Event) {
  _inherits(ResourceRegistryEvent, _Event);

  var _super = _createSuper(ResourceRegistryEvent);

  function ResourceRegistryEvent(type, progress, currentTarget) {
    var _this;

    _classCallCheck(this, ResourceRegistryEvent);

    _this = _super.call(this, type);
    _this.progress = void 0;
    _this.currentTarget = void 0;
    _this.progress = progress;
    _this.currentTarget = currentTarget;
    return _this;
  }

  return ResourceRegistryEvent;
}(_Event2.Event);
/**
 * The ResourceRegistry instance is used to load and manage image resources.
 *
 * Load an image programmatically:
 * ```typescript
 * const img = new Img();
 * ResourceRegistry.DefaultInstance.add('/image.jpg', ResourceType.IMAGE)
 * .then(image => {
 *   img.setImage(image);
 * });
 * ```
 *
 * By default Img instance use ResourceRegistry.DefaultInstance to load image, you can simplify the
 * code above as:
 * ```typescript
 * const img = new Img();
 * img.setSrc('/image.jpg');
 * ```
 *
 * Or
 * ```typescript
 * container.load(`<img src='/image.jpg'>`);
 * ```
 */


exports.ResourceRegistryEvent = ResourceRegistryEvent;

var ResourceRegistry = /*#__PURE__*/function (_EventDispatcher) {
  _inherits(ResourceRegistry, _EventDispatcher);

  var _super2 = _createSuper(ResourceRegistry);

  function ResourceRegistry() {
    var _this2;

    _classCallCheck(this, ResourceRegistry);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _super2.call.apply(_super2, [this].concat(args));
    _this2.items = [];
    return _this2;
  }

  _createClass(ResourceRegistry, [{
    key: "load",

    /**
     * Load the resource.
     * @param item The resource item to be loaded.
     */
    value: function load(item) {
      switch (item.type) {
        case ResourceType.IMAGE:
          this.loadImage(item);
          break;

        case ResourceType.APNG:
          this.loadApng(item);
          break;
      }
    }
    /**
     * Calls current runtime to load the image resource.
     * @param item The image resource item to be loaded.
     */

  }, {
    key: "loadImage",
    value: function loadImage(item) {
      var _this3 = this;

      _Runtime.Runtime.get().loadImage({
        url: item.url,
        onLoad: function onLoad(image) {
          item.resource = image;

          _this3.onLoad(item);
        },
        onError: function onError(error) {
          item.error = error;

          _this3.onError(item);
        },
        onProgress: function onProgress(event) {
          item.loadedBytes = event.loadedBytes;
          item.totalBytes = event.totalBytes;

          _this3.onProgress(item);
        }
      });
    }
    /**
     * Calls current runtime to load the apng resource.
     * @param item The apng resource item to be loaded.
     */

  }, {
    key: "loadApng",
    value: function loadApng(item) {
      var _this4 = this;

      _Runtime.Runtime.get().loadArrayBuffer({
        url: item.url,
        onLoad: function onLoad(data) {
          var apng = _ApngParser.ApngParser.parse(data);

          var opt = {
            width: apng.width,
            height: apng.height,
            fps: apng.frames.length * 1000 / apng.duration,
            frames: [],
            url: undefined,
            image: undefined
          };

          var _iterator = _createForOfIteratorHelper(apng.frames),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var frame = _step.value;
              opt.frames.push({
                destX: frame.left,
                destY: frame.top,
                destWidth: frame.width,
                destHeight: frame.height,
                image: frame.image
              });
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          item.resource = opt;

          _this4.onLoad(item);
        },
        onError: function onError(error) {
          console.warn('error while loading apng', error);
          item.error = error;

          _this4.onError(item);
        },
        onProgress: function onProgress(event) {
          item.loadedBytes = event.loadedBytes;
          item.totalBytes = event.totalBytes;

          _this4.onProgress(item);
        }
      });
    }
    /**
     * Calculate the current total loading progress.
     * @returns the total progress of current loading status.
     */

  }, {
    key: "getTotalProgress",
    value: function getTotalProgress() {
      var progress = 0;

      var _iterator2 = _createForOfIteratorHelper(this.items),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var item = _step2.value;
          progress += item.progress;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return progress / this.items.length;
    }
    /**
     * Callback while loading progress changes.
     * @param item the loading item who changes the progress.
     */

  }, {
    key: "onProgress",
    value: function onProgress(item) {
      if (item.state === LoadState.LOADING && item.totalBytes > 0) {
        item.progress = item.loadedBytes / item.totalBytes;
      }

      this.dispatchEvent(new ResourceRegistryEvent('progress', this.getTotalProgress()));
      this.dispatchEvent(new ResourceRegistryEvent('itemprogress', item.totalBytes > 0 ? item.loadedBytes / item.totalBytes : 0, item));
    }
    /**
     * Callback while a resource is loaded successfully.
     * @param item the loaded resource.
     */

  }, {
    key: "onLoad",
    value: function onLoad(item) {
      item.state = LoadState.LOADED;
      item.loadedBytes = item.totalBytes;

      if (item.progress < 1) {
        item.progress = 1;
        this.onProgress(item);
      }

      var _iterator3 = _createForOfIteratorHelper(item.promiseHandlers),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var handler = _step3.value;
          handler.resolve(item.resource);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      item.promiseHandlers = [];
      this.dispatchEvent(new ResourceRegistryEvent('load', 1, item));
      var done = true;

      var _iterator4 = _createForOfIteratorHelper(this.items),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var i = _step4.value;

          if (i.state !== LoadState.LOADED) {
            done = false;
            break;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      if (done) {
        this.dispatchEvent(new ResourceRegistryEvent('done', 1));
      }
    }
    /**
     * Callback while a resource is failed to been loaded.
     * @param item the resource is failed to been loaded.
     */

  }, {
    key: "onError",
    value: function onError(item) {
      item.state = LoadState.ERROR;

      var _iterator5 = _createForOfIteratorHelper(item.promiseHandlers),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var handler = _step5.value;
          handler.reject(item.error);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      item.promiseHandlers = [];
      this.dispatchEvent(new ResourceRegistryEvent('error', this.getTotalProgress(), item));
    }
    /**
     * Load the resource by url, please note that the resource with same url will be loaded once.
     * @param url Resource of this url to be loaded.
     * @returns A promise object od the loaded resource.
     */

  }, {
    key: "add",
    value: function add(url) {
      var _this5 = this;

      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ResourceType.IMAGE;
      return new Promise(function (resolve, reject) {
        var _iterator6 = _createForOfIteratorHelper(_this5.items),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var item = _step6.value;

            if (item.url === url) {
              if (item.state === LoadState.LOADED) {
                resolve(item.resource);
              } else if (item.state === LoadState.ERROR) {
                reject(item.error);
              } else {
                item.promiseHandlers.push({
                  resolve: resolve,
                  reject: reject
                });
              }

              return;
            }
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }

        var newItem = {
          url: url,
          type: type,
          resource: undefined,
          state: LoadState.LOADING,
          progress: 0,
          loadedBytes: 0,
          totalBytes: 0,
          promiseHandlers: [{
            resolve: resolve,
            reject: reject
          }]
        };

        _this5.items.push(newItem);

        _this5.load(newItem);
      });
    }
    /**
     * Get a loaded resource by url, or undefined in case of url is not loaded.
     * @param url the url of resource.
     * @returns The loaded resource of this url, or undefined for unloaded resource.
     */

  }, {
    key: "get",
    value: function get(url) {
      var _iterator7 = _createForOfIteratorHelper(this.items),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var item = _step7.value;

          if (item.url === url) {
            if (item.state === LoadState.LOADED) {
              return item.resource;
            } else {
              return undefined;
            }
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      return undefined;
    }
    /**
     * Release the resource by url.
     * @param url Resource of this url to be released.
     * @returns the released resource or undefined for a unloaded resource.
     */

  }, {
    key: "release",
    value: function release(url) {
      for (var i = 0; i < this.items.length; ++i) {
        var item = this.items[i];

        if (item.url === url) {
          this.items.splice(i, 1);
          item.promiseHandlers.length = 0;
          return item.resource;
        }
      }

      return undefined;
    }
    /**
     * The resources in this registry.
     */

  }]);

  return ResourceRegistry;
}(_Event2.EventDispatcher);

exports.ResourceRegistry = ResourceRegistry;
ResourceRegistry.DefaultInstance = new ResourceRegistry();