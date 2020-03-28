"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceRegistry = exports.ResourceRegistryEvent = exports.ResourceType = exports.LoadState = void 0;

var _Event2 = require("../base/Event");

var _ApngParser = require("../parser/ApngParser");

var _Runtime = require("../runtime/Runtime");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Resource load state.
 */
var LoadState;
/**
 * Resource types.
 */

exports.LoadState = LoadState;

(function (LoadState) {
  LoadState[LoadState["LOADING"] = 1] = "LOADING";
  LoadState[LoadState["LOADED"] = 2] = "LOADED";
  LoadState[LoadState["ERROR"] = 3] = "ERROR";
})(LoadState || (exports.LoadState = LoadState = {}));

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

  function ResourceRegistryEvent(type, progress, currentTarget) {
    var _this;

    _classCallCheck(this, ResourceRegistryEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResourceRegistryEvent).call(this, type));
    _this.progress = void 0;
    _this.currentTarget = void 0;
    _this.progress = progress;
    _this.currentTarget = currentTarget;
    return _this;
  }

  return ResourceRegistryEvent;
}(_Event2.Event);

exports.ResourceRegistryEvent = ResourceRegistryEvent;

var ResourceRegistry = /*#__PURE__*/function (_EventDispatcher) {
  _inherits(ResourceRegistry, _EventDispatcher);

  function ResourceRegistry() {
    var _getPrototypeOf2;

    var _this2;

    _classCallCheck(this, ResourceRegistry);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ResourceRegistry)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this2.items = [];
    return _this2;
  }

  _createClass(ResourceRegistry, [{
    key: "add",
    value: function add(url, type) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this3.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

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

        _this3.items.push(newItem);

        _this3.load(newItem);
      });
    }
  }, {
    key: "load",
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
  }, {
    key: "loadImage",
    value: function loadImage(item) {
      var _this4 = this;

      _Runtime.Runtime.get().loadImage({
        url: item.url,
        onLoad: function onLoad(image) {
          item.resource = image;

          _this4.onLoad(item);
        },
        onError: function onError(error) {
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
  }, {
    key: "loadApng",
    value: function loadApng(item) {
      var _this5 = this;

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
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = apng.frames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var frame = _step2.value;
              opt.frames.push({
                destX: frame.left,
                destY: frame.top,
                destWidth: frame.width,
                destHeight: frame.height,
                image: frame.image
              });
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

          item.resource = opt;

          _this5.onLoad(item);
        },
        onError: function onError(error) {
          console.warn('error while loading apng', error);
          item.error = error;

          _this5.onError(item);
        },
        onProgress: function onProgress(event) {
          item.loadedBytes = event.loadedBytes;
          item.totalBytes = event.totalBytes;

          _this5.onProgress(item);
        }
      });
    }
  }, {
    key: "getTotalProgress",
    value: function getTotalProgress() {
      var progress = 0;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var item = _step3.value;
          progress += item.progress;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return progress / this.items.length;
    }
  }, {
    key: "onProgress",
    value: function onProgress(item) {
      if (item.state === LoadState.LOADING && item.totalBytes > 0) {
        item.progress = item.loadedBytes / item.totalBytes;
      }

      this.dispatchEvent(new ResourceRegistryEvent('progress', this.getTotalProgress()));
      this.dispatchEvent(new ResourceRegistryEvent('itemprogress', item.totalBytes > 0 ? item.loadedBytes / item.totalBytes : 0, item));
    }
  }, {
    key: "onLoad",
    value: function onLoad(item) {
      item.state = LoadState.LOADED;
      item.loadedBytes = item.totalBytes;

      if (item.progress < 1) {
        item.progress = 1;
        this.onProgress(item);
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = item.promiseHandlers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var handler = _step4.value;
          handler.resolve(item.resource);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      item.promiseHandlers = [];
      this.dispatchEvent(new ResourceRegistryEvent('load', 1, item));
      var done = true;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.items[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var i = _step5.value;

          if (i.state !== LoadState.LOADED) {
            done = false;
            break;
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      if (done) {
        this.dispatchEvent(new ResourceRegistryEvent('done', 1));
      }
    }
  }, {
    key: "onError",
    value: function onError(item) {
      item.state = LoadState.ERROR;
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = item.promiseHandlers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var handler = _step6.value;
          handler.reject(item.error);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      item.promiseHandlers = [];
      this.dispatchEvent(new ResourceRegistryEvent('error', this.getTotalProgress(), item));
    }
  }, {
    key: "get",
    value: function get(url) {
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this.items[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
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
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      return undefined;
    }
  }, {
    key: "release",
    value: function release(url) {
      for (var i = 0; i < this.items.length; ++i) {
        var item = this.items[i];

        if (item.url === url) {
          this.items.splice(i, 1);
          return item;
        }
      }

      return undefined;
    }
  }]);

  return ResourceRegistry;
}(_Event2.EventDispatcher);

exports.ResourceRegistry = ResourceRegistry;
ResourceRegistry.DefaultInstance = new ResourceRegistry();