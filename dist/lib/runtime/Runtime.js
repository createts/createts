"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Runtime = exports.RuntimeType = void 0;

var _WebpageRuntime = require("./WebpageRuntime");

var _WechatMiniGameRuntime = require("./WechatMiniGameRuntime");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * An enum to indicate current runtime type, both web page (running in a browser) and wechat mini
 * game (https://developers.weixin.qq.com/minigame/dev/guide/) are supported, toutiao mini game
 * (https://developer.toutiao.com/) will be supported soon.
 */
var RuntimeType;
exports.RuntimeType = RuntimeType;

(function (RuntimeType) {
  RuntimeType["WEBPAGE"] = "webpage";
  RuntimeType["WECHAT_MINI_GAME"] = "wechat_mini_game";
})(RuntimeType || (exports.RuntimeType = RuntimeType = {}));

/**
 * A class to manage runtime type and the abstract layer implementation.
 */
var Runtime = /*#__PURE__*/function () {
  function Runtime() {
    _classCallCheck(this, Runtime);
  }

  _createClass(Runtime, null, [{
    key: "setRuntimeType",

    /**
     * The current runt time type, by default it is web page, you need to call Runtime.setRuntimeType
     * explicitly to modify runtime type in case of it is not a web page at beginning, because auto
     * detection is not ready.
     *
     * ```typescript
     * Runtime.setRuntimeType(RuntimeType.WECHAT_MINI_GAME);
     * Runtime.get().newCanvas();
     * ```
     */

    /**
     * Sets the current runtime time type.
     * @param runtimeType The current runtime time type.
     */
    value: function setRuntimeType(runtimeType) {
      if (this.runtimeType !== runtimeType) {
        this.runtimeType = runtimeType;
        delete this.runtime;
      }
    }
    /**
     * Gets the current runtime time type.
     * @returns The current runtime time type.
     */

  }, {
    key: "getRuntimeType",
    value: function getRuntimeType() {
      return this.runtimeType;
    }
    /**
     * Returns the current IRuntime implementation.
     * @returns The current IRuntime implementation.
     */

  }, {
    key: "get",
    value: function get() {
      if (!this.runtime) {
        switch (this.runtimeType) {
          case RuntimeType.WEBPAGE:
            this.runtime = new _WebpageRuntime.WebpageRuntime();
            break;

          case RuntimeType.WECHAT_MINI_GAME:
            this.runtime = new _WechatMiniGameRuntime.WechatMiniGameRuntime();
            break;
        }
      }

      return this.runtime;
    }
    /**
     * The current IRuntime implementation instance.
     */

  }]);

  return Runtime;
}();

exports.Runtime = Runtime;
Runtime.runtimeType = RuntimeType.WEBPAGE;
Runtime.runtime = void 0;