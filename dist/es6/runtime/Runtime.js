function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { WebpageRuntime } from './WebpageRuntime';
import { WechatMiniGameRuntime } from './WechatMiniGameRuntime';
import { WechatMiniProgramRuntime } from './WechatMiniProgramRuntime';
/**
 * An enum to indicate current runtime type, both web page (running in a browser) and wechat mini
 * game (https://developers.weixin.qq.com/minigame/dev/guide/) are supported, toutiao mini game
 * (https://developer.toutiao.com/) will be supported soon.
 */

export var RuntimeType;

(function (RuntimeType) {
  RuntimeType["WEBPAGE"] = "webpage";
  RuntimeType["WECHAT_MINI_GAME"] = "wechat_mini_game";
  RuntimeType["WECHAT_MINI_PROGRAM"] = "wechat_mini_program";
})(RuntimeType || (RuntimeType = {}));

/**
 * A class to manage runtime type and the abstract layer implementation.
 */
export var Runtime = /*#__PURE__*/function () {
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
            this.runtime = new WebpageRuntime();
            break;

          case RuntimeType.WECHAT_MINI_GAME:
            this.runtime = new WechatMiniGameRuntime();
            break;

          case RuntimeType.WECHAT_MINI_PROGRAM:
            this.runtime = new WechatMiniProgramRuntime();
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
Runtime.runtimeType = RuntimeType.WEBPAGE;
Runtime.runtime = void 0;