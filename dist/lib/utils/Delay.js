"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Delay = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A class that used to delay a function call, and it always cancel the pending call in case of new call come.
 *
 * Code example:
 *
 * Print a 'hello world' after 100ms.
 * ```typescript
 * const delay = new Delay(100);  // wait for 100ms.
 * delay.call(() => {
 *   console.log('hello world');
 * });
 * ```
 *
 * Print a 'hello world' once after 100ms, the first call will be cancelled.
 * ```typescript
 * const delay = new Delay(100);  // wait for 100ms.
 * delay.call(() => {
 *   console.log('hello world');
 * });
 * delay.call(() => {
 *   console.log('hello world');
 * });
 * ```
 *
 * Print a 'hello world' twice because the second call is after first one was invoked.
 * ```typescript
 * const delay = new Delay(100);  // wait for 100ms.
 * delay.call(() => {
 *   console.log('hello world');
 * });
 * setTimeout(() => {
 *   delay.call(() => {
 *     console.log('hello world');
 *   });
 * }, 200);
 * ```
 */
var Delay =
/*#__PURE__*/
function () {
  /**
   * The delay time, unit is ms.
   */

  /**
   * A timeout handler used to cancel the timeout for the new calls.
   */

  /**
   * The pending function call.
   */

  /**
   * True indicates that current delay calls is paused.
   */

  /**
   * Creates an instance of Delay.
   * @param delayTime The delay time, unit is ms.
   */
  function Delay(delayTime) {
    _classCallCheck(this, Delay);

    this.delayTime = void 0;
    this.delayHandler = 0;
    this.func = void 0;
    this.paused = false;
    this.delayTime = delayTime;
  }
  /**
   * Set a new pending function call, cancel the current one if any and restart a new round of wait.
   * @param func The new pending function call.
   */


  _createClass(Delay, [{
    key: "call",
    value: function call(func) {
      this.func = func;

      if (this.paused) {
        return;
      }

      if (this.delayHandler) {
        clearTimeout(this.delayHandler);
        this.delayHandler = 0;
      }

      this.start();
    }
    /**
     * Pause the current pending calls.
     */

  }, {
    key: "pause",
    value: function pause() {
      if (this.delayHandler) {
        clearTimeout(this.delayHandler);
        this.delayHandler = 0;
      }

      this.paused = true;
    }
    /**
     * Resume the paused pending process.
     */

  }, {
    key: "resume",
    value: function resume() {
      if (this.paused) {
        this.paused = false;

        if (this.func) {
          this.start();
        }
      }
    }
    /**
     * Cancel the wait process and delete the pending function call if any.
     */

  }, {
    key: "cancel",
    value: function cancel() {
      if (this.delayHandler) {
        clearTimeout(this.delayHandler);
        this.delayHandler = 0;
      }

      this.func = undefined;
      this.paused = false;
    }
    /**
     * If the pending function call is set, start the wait process.
     */

  }, {
    key: "start",
    value: function start() {
      var _this = this;

      if (this.func) {
        this.delayHandler = setTimeout(function () {
          _this.delayHandler = 0;

          if (_this.func) {
            _this.func();

            _this.func = undefined;
          }
        }, this.delayTime);
      }
    }
  }]);

  return Delay;
}();

exports.Delay = Delay;